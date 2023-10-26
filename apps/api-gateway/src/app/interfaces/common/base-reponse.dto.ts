import { ApiProperty } from '@nestjs/swagger';

export class BaseReponse {
  @ApiProperty({ example: 'success' })
  message: string;
  @ApiProperty()
  data: any;
  @ApiProperty()
  errors?: { [key: string]: unknown };
}
