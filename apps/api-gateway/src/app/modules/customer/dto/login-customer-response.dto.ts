import { ApiProperty } from '@nestjs/swagger';
import { BaseReponse } from '../../../interfaces/common/base-reponse.dto';

export class LoginCustomerResponseDto extends BaseReponse {
  @ApiProperty({
    example: { token: 'someEncodedToken' },
    nullable: true,
  })
  data: {
    token: string;
    refreshToken?: string;
  };
}
