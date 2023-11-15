import { ApiHideProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateCustomerDto } from './create-customer.dto';

export class UpdateCustomerDto extends PartialType(
  OmitType(CreateCustomerDto, ['email', 'type', 'password'] as const)
) {
  @ApiHideProperty()
  id: string;
}
