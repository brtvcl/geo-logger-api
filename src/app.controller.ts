import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('areas')
  async getAreas() {
    const areas: { id: number; name: string; boundary: string }[] = await this
      .prisma
      .$queryRaw`SELECT id, name, ST_AsGeoJSON(boundary) as boundary FROM "Area"`;

    const areasParsed = areas.map((area) => {
      return {
        id: area.id,
        name: area.name,
        boundary: JSON.parse(area.boundary).coordinates[0].map(
          (point: number[]) => {
            return {
              lon: point[0],
              lat: point[1],
            };
          },
        ),
      };
    });

    return areasParsed;
  }

  @Post('areas')
  async postArea(
    @Body()
    body: {
      name: string;
      boundary: Array<{ lat: number; lon: number }>;
    },
  ) {
    const polygonText = `POLYGON((${body.boundary.map((point) => `${point.lon} ${point.lat}`).join(', ')}))`;

    const result = await this.prisma.$queryRaw`
        INSERT INTO "Area" 
        (id, name, boundary, "updatedAt") VALUES
        (${crypto.randomUUID()}, 
        ${body.name}, 
        ST_GeomFromText(${polygonText}, 4326),
        NOW())`;

    return result;
  }

  @Post('locations')
  async postLocations(
    @Body()
    body: {
      lat: number;
      lon: number;
    },
  ) {
    const area: { id: number; name: string }[] = await this.prisma.$queryRaw`
      SELECT "id", "name"
      FROM "Area"
      WHERE ST_Contains(boundary, ST_SetSRID(ST_Point(${body.lon}, ${body.lat}), 4326))
      LIMIT 1
    `;

    const withinArea = area.length > 0;

    if (withinArea) {
      await this.prisma.$queryRaw`
        INSERT INTO "Log" 
        ("id", "userId", "areaId", "location", "createdAt", "updatedAt") VALUES
        (${crypto.randomUUID()}, 
        'e19f9c9b-ab95-4e44-9221-82090d920eac',
        ${area[0].id}, 
        ST_SetSRID(ST_MakePoint(${body.lon}, ${body.lat}), 4326)::geography,
        NOW(),
        NOW());
      `;
    }

    return {
      logged: withinArea,
      area: withinArea ? area[0] : null,
    };
  }

  @Get('logs')
  async getLogs() {
    const logs: {
      id: number;
      userId: string;
      areaId: number;
      location: string;
    }[] = await this.prisma
      .$queryRaw`SELECT "id", "userId", "areaId", ST_AsGeoJSON(location) as location FROM "Log"`;

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

    const logsParsed = logs.map((log) => {
      const location = JSON.parse(log.location).coordinates;
      return {
        id: log.id,
        userId: log.userId,
        areaId: log.areaId,
        location: {
          lat: location[1],
          lon: location[0],
        },
      };
    });

    return logsParsed;
  }
}
