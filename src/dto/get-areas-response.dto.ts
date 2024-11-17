import { ApiProperty } from '@nestjs/swagger';

export class GetAreasResponseDto {
  @ApiProperty({
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      boundary: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            lat: { type: 'number' },
            lon: { type: 'number' },
          },
        },
      },
    },
  })
  areas: {
    id: string;
    name: string;
    boundary: { lat: number; lon: number }[];
  }[];
}
