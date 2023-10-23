import { ApiProperty } from '@nestjs/swagger';

export class TokenUserDto {
  @ApiProperty()
  token: string;
}
