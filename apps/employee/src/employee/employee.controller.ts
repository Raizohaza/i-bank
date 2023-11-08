import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/log-in.dto';
@Controller()
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @MessagePattern('createEmployee')
  async create(@Payload() createEmployeeDto: CreateEmployeeDto) {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createEmployeeDto.password,
      saltOrRounds
    );
    createEmployeeDto.password = hashedPassword;
    return await this.employeeService.create(createEmployeeDto);
  }

  @MessagePattern('login')
  login(@Payload() loginDto: LoginDto) {
    return this.employeeService.login(loginDto);
  }

  @MessagePattern('findAllEmployee')
  findAll() {
    return this.employeeService.findAll();
  }

  @MessagePattern('findOneEmployee')
  findOne(@Payload() id: string) {
    return this.employeeService.findOne(id);
  }

  @MessagePattern('findOneEmployeeByEmail')
  findByEmail(@Payload() email: string) {
    return this.employeeService.findByEmail(email);
  }

  @MessagePattern('updateEmployee')
  update(@Payload() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeeService.update(updateEmployeeDto.id, updateEmployeeDto);
  }

  @MessagePattern('removeEmployee')
  remove(@Payload() id: string) {
    return this.employeeService.remove(id);
  }
}
