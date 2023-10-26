import { ApiProperty } from '@nestjs/swagger';

export class ConfirmCustomerDto {
  @ApiProperty()
  link: string;
}
