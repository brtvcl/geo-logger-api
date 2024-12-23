import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Point } from './types/types';
import simplifyAndBuffer from './utils/simplify-and-buffer';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async findAreaByLatLon(
    lat: number,
    lon: number,
  ): Promise<{ id: string; name: string }[]> {
    // Find the area that contains the point
    // by checking if the point is in the envelope and boundary

    return this.prisma.$queryRaw`
      SELECT "id", "name"
      FROM "Area"
      WHERE 
      ST_Contains("envelope", ST_SetSRID(ST_Point(${lon}, ${lat}), 4326)) AND 
      ST_Contains("boundary", ST_SetSRID(ST_Point(${lon}, ${lat}), 4326))
      LIMIT 1
    `;
  }

  async logUserLocation({
    userId,
    lat,
    lon,
    areaId,
  }: {
    userId: string;
    lat: number;
    lon: number;
    areaId: string;
  }) {
    // Insert the log into the database
    await this.prisma.$queryRaw`
        INSERT INTO "Log" 
        ("id", "userId", "areaId", "location", "createdAt", "updatedAt") VALUES (
          ${crypto.randomUUID()}, 
          ${userId},
          ${areaId}, 
          ST_SetSRID(ST_MakePoint(${lon}, ${lat}), 4326)::geography,
          NOW(),
          NOW()
        );
      `;
  }

  async getUserById(userId: string) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  async findIntersectingArea(boundary: Array<Point>) {
    // Find the area that intersects with the polygon
    const polygonText = `POLYGON((${boundary.map((point) => `${point.lon} ${point.lat}`).join(', ')}))`;

    const intersectingArea: { id: string; name: string }[] = await this.prisma
      .$queryRaw`
      SELECT "id", "name"
      FROM "Area"
      WHERE ST_Intersects(boundary, ST_GeomFromText(${polygonText}, 4326))
      LIMIT 1
    `;

    return intersectingArea.length > 0 ? intersectingArea[0] : null;
  }

  async createArea({
    boundary,
    name,
  }: {
    boundary: Array<Point>;
    name: string;
  }) {
    const boundaryPolygonText = `POLYGON((${boundary.map((point) => `${point.lon} ${point.lat}`).join(', ')}))`;

    // Simplify and buffer the boundary polygon to create an envelope
    // When checking area contains on POST /logs,
    // we can use the envelope to speed up the query
    // by checking if the point is in the envelope first
    // before checking if the point is in the boundary

    // TODO: Current implementation uses buffer and simplify functions from turf.js
    // Ideally, we should use ST_SimplifyPolygonHull in a PostGIS query when
    // we migrate to a PostGIS with GEOS 3.11.0+ version
    const envelope = simplifyAndBuffer({
      polygon: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [boundary.map((point) => [point.lon, point.lat])],
        },
      },
      tolerance: 0.01,
      units: 'kilometers',
      maxDepth: 100,
    });

    const envelopePolygonText = `POLYGON((${envelope.geometry.coordinates[0].map((point: number[]) => `${point[0]} ${point[1]}`).join(', ')}))`;

    const id = crypto.randomUUID();

    // Insert envelope and boundary into the database
    await this.prisma.$queryRaw`
        INSERT INTO "Area" 
        ("id", "name", "boundary", "envelope", "updatedAt") VALUES (
          ${id}, 
          ${name}, 
          ST_GeomFromText(${boundaryPolygonText}, 4326),
          ST_GeomFromText(${envelopePolygonText}, 4326),
          NOW()
        )`;

    return {
      id,
      name,
    };
  }

  getLogs() {
    return this.prisma.log.findMany({
      select: {
        id: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        area: {
          select: {
            id: true,
            name: true,
          },
        },
        createdAt: true,
      },
    });
  }

  async getAreas() {
    const areas: { id: string; name: string; boundary: string }[] = await this
      .prisma
      .$queryRaw`SELECT "id", "name", ST_AsGeoJSON("boundary") as "boundary" FROM "Area"`;

    const areasParsed: {
      id: string;
      name: string;
      boundary: Point[];
    }[] = areas.map((area) => {
      return {
        id: area.id,
        name: area.name,
        boundary: JSON.parse(area.boundary).coordinates[0].map(
          (point: number[]) => {
            return {
              lat: point[1],
              lon: point[0],
            };
          },
        ),
      };
    });

    return areasParsed;
  }
}
