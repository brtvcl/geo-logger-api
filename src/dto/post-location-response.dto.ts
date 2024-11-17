import { ApiProperty } from '@nestjs/swagger';

export class PostLocationResponseDto {
  @ApiProperty()
  logged: boolean;

  @ApiProperty({
    nullable: true,
    example: { id: 'eefd658f-a5ad-475d-8bd9-50e37cc38d2a', name: 'Area 1' },
  })
  area: {
    id: string;
    name: string;
  } | null;
}
