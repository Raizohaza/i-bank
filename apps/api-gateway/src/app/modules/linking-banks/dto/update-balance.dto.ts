import { ApiProperty } from '@nestjs/swagger';

export class UpdateBalanceDto {
  @ApiProperty({
    required: false,
    example: 'ObjectId',
  })
  id: string;
  @ApiProperty({
    example: '123456',
  })
  code: string;
}
