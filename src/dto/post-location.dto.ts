import { IsNumber, IsString } from 'class-validator';
export class PostLocationDto {
  @IsString()
  userId: string;

  @IsNumber()
  lat: number;

  @IsNumber()
  lon: number;
}
