import { ApiProperty } from '@nestjs/swagger';

export class LogoutCustomerResponseDto {
  @ApiProperty({ example: 'token_destroy_success' })
  message: string;
  @ApiProperty({ example: null, nullable: true, type: 'null' })
  data: null;
  @ApiProperty({ example: null, nullable: true })
  errors: { [key: string]: unknown };
}
