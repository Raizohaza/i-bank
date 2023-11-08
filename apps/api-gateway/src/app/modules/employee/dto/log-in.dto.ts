import { PickType } from '@nestjs/swagger';
import { CreateEmployeeDto } from './create-employee.dto';

export class LoginDto extends PickType(CreateEmployeeDto, [
  'email',
  'password',
] as const) {}
