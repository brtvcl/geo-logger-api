import { ApiProperty } from '@nestjs/swagger';

export class GetLogsResponseDto {
  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
          },
        },
        area: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
          },
        },
        createdAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  logs: {
    id: string;
    user: {
      id: string;
      name: string;
    };
    area: {
      id: string;
      name: string;
    };
    createdAt: Date;
  }[];
}
