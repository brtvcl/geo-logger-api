import { IsNumber } from 'class-validator';

export class Point {
  @IsNumber()
  lat: number;

  @IsNumber()
  lon: number;
}
