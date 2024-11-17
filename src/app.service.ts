import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Point } from './types/types';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async findAreaByLatLon(
    lat: number,
    lon: number,
  ): Promise<{ id: string; name: string }[]> {
    return this.prisma.$queryRaw`
      SELECT "id", "name"
      FROM "Area"
      WHERE ST_Contains(boundary, ST_SetSRID(ST_Point(${lon}, ${lat}), 4326))
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
    const polygonText = `POLYGON((${boundary.map((point) => `${point.lon} ${point.lat}`).join(', ')}))`;

    const id = crypto.randomUUID();
    await this.prisma.$queryRaw`
        INSERT INTO "Area" 
        ("id", "name", "boundary", "updatedAt") VALUES (
          ${id}, 
          ${name}, 
          ST_GeomFromText(${polygonText}, 4326),
          NOW()
        )`;

    return {
      id,
      name,
    };
  }

  async getLogs() {
    const allLogs = this.prisma.log.findMany({
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
    return allLogs;
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
