import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Controller()
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @MessagePattern('createEmployee')
  create(@Payload() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @MessagePattern('findAllEmployee')
  findAll() {
    return this.employeeService.findAll();
  }

  @MessagePattern('findOneEmployee')
  findOne(@Payload() id: number) {
    return this.employeeService.findOne(id);
  }

  @MessagePattern('updateEmployee')
  update(@Payload() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeeService.update(updateEmployeeDto.id, updateEmployeeDto);
  }

  @MessagePattern('removeEmployee')
  remove(@Payload() id: number) {
    return this.employeeService.remove(id);
  }
}
