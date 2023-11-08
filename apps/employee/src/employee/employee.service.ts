import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { IEmployeeSchema } from './entities/employee.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/log-in.dto';
@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel('employee')
    private readonly employeeModel: Model<IEmployeeSchema>,
    private jwtService: JwtService
  ) {}
  create(createEmployeeDto: CreateEmployeeDto) {
    console.log(createEmployeeDto);
    return new this.employeeModel(createEmployeeDto).save();
  }

  findAll() {
    return this.employeeModel.find();
  }

  findOne(id: string) {
    return this.employeeModel.findById(id);
  }

  findByEmail(email: string) {
    return this.employeeModel.findOne({ email: email });
  }
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      return user;
    }
    return null;
  }
  async login(employee: LoginDto) {
    const result = await this.findByEmail(employee.email);
    // const payload = {
    //   email: result.email,
    //   sub: result.id,
    // };
    return {
      data: result,
    };
  }
  update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    console.log(updateEmployeeDto);
    return this.employeeModel.findByIdAndUpdate(id, updateEmployeeDto);
  }

  remove(id: string) {
    return this.employeeModel.remove(id);
  }
}
