import { IsString } from 'class-validator';
import { Point } from './point.dto';
import { IsBoundaryValid } from 'src/decorators/boundary-validator.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class PostAreaDto {
  @IsString()
  @ApiProperty()
  name: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      minItems: 4,
      maxItems: 1000,
      properties: {
        lat: { type: 'number' },
        lon: { type: 'number' },
      },
    },
  })
  @IsBoundaryValid({
    message: 'Boundary must be a closed polygon with valid points.',
  })
  boundary: Array<Point>;
}
