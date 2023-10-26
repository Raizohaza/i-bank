import { ApiProperty } from '@nestjs/swagger';

export class ConfirmCustomerResponseDto {
  @ApiProperty({ example: 'customer_confirm_success' })
  message: string;
  @ApiProperty({ example: null, nullable: true, type: 'null' })
  data: null;
  @ApiProperty({ example: null, nullable: true })
  errors: { [key: string]: unknown };
}
