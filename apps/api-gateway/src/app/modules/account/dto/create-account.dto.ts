import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountDto {
  @ApiProperty({
    uniqueItems: true,
    example: 'ObjectId',
  })
  customerId: string;
  @ApiProperty({
    enum: ['PAYROLL', 'SAVING'],
    example: 'PAYROLL',
  })
  type: string;
  @ApiProperty({
    minLength: 5,
    example: '50000',
  })
  balance: number;
}
