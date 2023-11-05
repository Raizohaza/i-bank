import {
  Injectable,
  Inject,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject('TOKEN_SERVICE') private readonly tokenServiceClient: ClientProxy,
    @Inject('CUSTOMER_SERVICE')
    private readonly customerServiceClient: ClientProxy
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const secured = this.reflector.get<string[]>(
      'secured',
      context.getHandler()
    );

    const basicSecured = this.reflector.get<string[]>(
      'basicSecured',
      context.getHandler()
    );
    if (!secured && !basicSecured) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request?.headers?.authorization?.split(' ')?.[1];
    if (!token) {
      throw new HttpException('Invalid Token', HttpStatus.BAD_REQUEST);
    }
    const customerTokenInfo = await firstValueFrom(
      this.tokenServiceClient.send('token_decode', { token })
    );
    if (!customerTokenInfo || !customerTokenInfo.data) {
      throw new HttpException(
        {
          message: customerTokenInfo.message,
          data: null,
        },
        customerTokenInfo.status
      );
    }

    const customerInfo = await firstValueFrom(
      this.customerServiceClient.send(
        'customer_get_by_id',
        customerTokenInfo.data.customerId
      )
    );

    request.customer = customerInfo.data;
    return true;
  }
}
