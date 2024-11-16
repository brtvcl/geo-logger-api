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

  // @Get('logs')
  // getLogs(): string {
  //   return this.appService.getLogs();
  // }

  // @Post('areas')
  // postArea(): string {
  //   return this.appService.postArea();
  // }
}
