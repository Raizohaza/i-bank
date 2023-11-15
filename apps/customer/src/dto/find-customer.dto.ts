import { ApiProperty } from '@nestjs/swagger';

export class FindCustomerDTO {
  // @ApiProperty({
  //   enum: ['customer', 'employee', 'admin'],
  //   type: String,
  //   isArray: true,
  //   required: false,
  // })
  type: string[];
}
