import { ApiProperty } from '@nestjs/swagger';
import { ICustomer } from '../customer.interface';

export class GetCustomerByTokenResponseDto {
  @ApiProperty({ example: 'customer_get_by_id_success' })
  message: string;
  @ApiProperty({
    example: {
      customer: {
        email: 'test@ibank.com',
        is_confirmed: true,
        id: '5d987c3bfb881ec86b476bcc',
      },
    },
    nullable: true,
  })
  data: {
    customer: ICustomer;
  };
  @ApiProperty({ example: null, nullable: true })
  errors: { [key: string]: unknown };
}
