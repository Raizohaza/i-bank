import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsNotEmpty, IsEnum, IsEmail } from 'class-validator';
import { IEmployeeSchema } from '../entities/employee.entity';
export class CreateEmployeeDto implements IEmployeeSchema {
  @ApiProperty({
    example: 'User C',
  })
  @IsNotEmpty()
  name: string;
  @ApiProperty({
    example: 'EMPLOYEE',
  })
  @IsEnum({
    ADMIN: 'ADMIN',
    EMPLOYEE: 'EMPLOYEE',
  })
  position?: string;
  @ApiProperty({
    example: '0123456789',
  })
  @IsPhoneNumber()
  phone: string;
  @ApiProperty({
    example: 'true',
    required: false,
  })
  login?: string;
  @ApiProperty({
    example: 'User C',
  })
  @IsNotEmpty()
  password: string;
  @IsEmail()
  @ApiProperty({
    example: 'abc@gmail.com',
  })
  email: string;
}
