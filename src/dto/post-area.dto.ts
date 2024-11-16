import { IsString } from 'class-validator';
import { Point } from './point.dto';
import { IsBoundaryValid } from 'src/decorators/boundary-validator.decorator';

export class PostAreaDto {
  @IsString()
  name: string;

  @IsBoundaryValid({
    message: 'Boundary must be a closed polygon with valid points.',
  })
  boundary: Array<Point>;
}
