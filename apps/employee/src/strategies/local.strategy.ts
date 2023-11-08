import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { EmployeeService } from '../employee/employee.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private employeeService: EmployeeService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.employeeService.validateUser(username, password);
    if (!user) {
      return {
        message: 'You have entered a wrong username or password',
      };
    }
    return user;
  }
}
