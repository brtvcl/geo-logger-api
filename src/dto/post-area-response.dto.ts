import { ApiProperty } from '@nestjs/swagger';

export class PostAreaResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}
