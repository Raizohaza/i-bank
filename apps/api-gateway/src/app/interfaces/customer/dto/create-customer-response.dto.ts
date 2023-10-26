import { ApiProperty } from '@nestjs/swagger';
import { ICustomer } from '../customer.interface';

export class CreateCustomerResponseDto {
  @ApiProperty({ example: 'customer_create_success' })
  message: string;
  @ApiProperty({
    example: {
      customer: {
        email: 'test@ibank.com',
        is_confirmed: false,
        id: '5d987c3bfb881ec86b476bcc',
      },
    },
    nullable: true,
  })
  data: {
    customer: ICustomer;
    token: string;
  };
  @ApiProperty({ example: null, nullable: true })
  errors: { [key: string]: unknown };
}
