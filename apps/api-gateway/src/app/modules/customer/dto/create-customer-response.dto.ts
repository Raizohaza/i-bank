import { ApiProperty } from '@nestjs/swagger';
import { BaseReponse } from '../../../interfaces/common/base-reponse.dto';
import { ICustomer } from '../customer.interface';

export class CreateCustomerResponseDto extends BaseReponse {
  @ApiProperty({
    example: {
      customer: {
        email: 'test@ibank.com',
        is_confirmed: false,
        id: '5d987c3bfb881ec86b476bcc',
        name: 'Username',
      },
    },
    nullable: true,
  })
  data: {
    customer: ICustomer;
    token: string;
    refreshToken?: string;
  };
}
