import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({
    uniqueItems: true,
    example: 'test1@ibank.com',
  })
  email: string;
  @ApiProperty({
    minLength: 6,
    example: 'test11',
  })
  password: string;
  @ApiProperty({
    minLength: 6,
    example: 'username',
  })
  name: string;
  type = 'customer';
}
