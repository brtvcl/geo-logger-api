import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import { PostLocationDto } from './dto/post-location.dto';
import { PostAreaDto } from './dto/post-area.dto';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { PostLocationResponseDto } from './dto/post-location-response.dto';
import { GetLogsResponseDto } from './dto/get-logs-response.dto';
import { PostAreaResponseDto } from './dto/post-area-response.dto';
import { GetAreasResponseDto } from './dto/get-areas-response.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('areas')
  @ApiExtraModels(GetAreasResponseDto)
  @ApiResponse({
    status: 200,
    schema: {
      $ref: getSchemaPath(GetAreasResponseDto),
    },
  })
  async getAreas(): Promise<GetAreasResponseDto> {
    const areas = await this.appService.getAreas();
    return {
      areas,
    };
  }

  @Post('areas')
  @ApiExtraModels(PostAreaResponseDto)
  @ApiResponse({
    status: 200,
    schema: {
      $ref: getSchemaPath(PostAreaResponseDto),
    },
  })
  async postArea(
    @Body(ValidationPipe)
    body: PostAreaDto,
  ): Promise<PostAreaResponseDto> {
    const intersectingArea = await this.appService.findIntersectingArea(
      body.boundary,
    );

    if (intersectingArea) {
      throw new HttpException(
        `Area ${intersectingArea.name} intersects with the new area, please adjust the boundary`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.appService.createArea(body);
  }

  @Post('locations')
  @ApiExtraModels(PostLocationResponseDto)
  @ApiResponse({
    status: 200,
    schema: {
      $ref: getSchemaPath(PostLocationResponseDto),
    },
  })
  async postLocations(
    @Body(ValidationPipe)
    body: PostLocationDto,
  ): Promise<PostLocationResponseDto> {
    const { userId, lat, lon } = body;

    // Validate the user exists
    const user = await this.appService.getUserById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // Find the area containing the user's location
    const area = await this.appService.findAreaByLatLon(lat, lon);

    const withinArea = area.length > 0;

    if (withinArea) {
      // Log the user's location if it's within an area
      await this.appService.logUserLocation({
        userId,
        lat,
        lon,
        areaId: area[0].id,
      });
    }

    return {
      logged: withinArea,
      area: withinArea ? area[0] : null,
    };
  }

  @Get('logs')
  @ApiExtraModels(GetLogsResponseDto)
  @ApiResponse({
    status: 200,
    schema: {
      $ref: getSchemaPath(GetLogsResponseDto),
    },
  })
  async getLogs(): Promise<GetLogsResponseDto> {
    const logs = await this.appService.getLogs();
    return {
      logs,
    };
  }
}
