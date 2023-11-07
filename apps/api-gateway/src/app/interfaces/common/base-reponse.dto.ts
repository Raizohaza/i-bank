import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class BaseReponse {
  @ApiProperty({ example: HttpStatus.OK })
  status? = HttpStatus.OK;
  @ApiProperty({ example: 'success' })
  message = 'success';
  @ApiProperty()
  data: any;
}
