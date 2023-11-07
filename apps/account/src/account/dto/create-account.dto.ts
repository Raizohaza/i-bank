import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountDto {
  @ApiProperty({
    uniqueItems: true,
    example: 'ObjectId',
  })
  customerId: string;
  @ApiProperty({
    example: 'PAY',
  })
  type: string;
  @ApiProperty({
    minLength: 5,
    example: '50000',
  })
  balance: number;
  @ApiProperty({
    minLength: 10,
    example: '1234567890',
  })
  accountNumber: string;
}
