import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { lastValueFrom } from 'rxjs';
import { Authorization } from '../../decorators/authorization.decorator';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { LoginDto } from './dto/log-in.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
@ApiTags('employee')
@Controller('employee')
export class EmployeeController {
  constructor(
    @Inject('EMPLOYEE_SERVICE') private readonly employeeService: ClientProxy,
    @Inject('TOKEN_SERVICE') private readonly tokenServiceClient: ClientProxy
  ) {}

  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return lastValueFrom(
      this.employeeService.send('createEmployee', createEmployeeDto)
    );
  }
  @Post('login')
  async signin(@Body() loginDto: LoginDto) {
    const emp = await lastValueFrom(
      this.employeeService.send('login', loginDto)
    );
    const token = await lastValueFrom(
      this.tokenServiceClient.send('token_create', {
        uid: emp.data._id,
      })
    );
    return {
      data: {
        token,
      },
    };
  }

  @Get()
  findAll() {
    return lastValueFrom(this.employeeService.send('findAllEmployee', {}));
  }
  @Get('email/:email')
  async findOneByEmail(@Param('email') email: string) {
    const result = await lastValueFrom(
      this.employeeService.send('findOneEmployeeByEmail', email)
    );
    if (!result) {
      throw new NotFoundException('Email not found!');
    }
    return result;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return lastValueFrom(this.employeeService.send('findOneEmployee', id));
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto
  ) {
    updateEmployeeDto.id = id;
    return lastValueFrom(
      this.employeeService.send('updateEmployee', updateEmployeeDto)
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return lastValueFrom(this.employeeService.send('removeEmployee', id));
  }
}
