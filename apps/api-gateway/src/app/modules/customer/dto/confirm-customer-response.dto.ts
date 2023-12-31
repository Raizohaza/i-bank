import { ApiProperty } from '@nestjs/swagger';
import { BaseReponse } from '../../../interfaces/common/base-reponse.dto';

export class ConfirmCustomerResponseDto extends BaseReponse {
  @ApiProperty({ example: null, nullable: true, type: 'null' })
  data: null;
}
