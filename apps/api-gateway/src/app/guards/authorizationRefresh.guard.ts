import {
  Injectable,
  Inject,
  CanActivate,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import { BadRequestException } from '@nestjs/common/exceptions';
@Injectable()
export class AuthRefreshGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject('TOKEN_SERVICE') private readonly tokenServiceClient: ClientProxy,
    @Inject('CUSTOMER_SERVICE')
    private readonly customerServiceClient: ClientProxy
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const securedRefresh = this.reflector.get<string[]>(
      'securedRefresh',
      context.getHandler()
    );

    if (!securedRefresh) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const token = request?.headers?.authorization?.split(' ')?.[1];
    if (!token) {
      throw new BadRequestException('Invalid Token');
    }
    const parseToken = await firstValueFrom(
      this.tokenServiceClient.send('token_decode', { token })
    );

    if (!parseToken || !parseToken.data) {
      throw new HttpException(
        {
          message: parseToken.message,
          data: null,
        },
        parseToken.status
      );
    }

    const customerInfo = await firstValueFrom(
      this.customerServiceClient.send('customer_get_by_id', parseToken.data.uid)
    );
    if (!customerInfo) return false;
    request.customer = customerInfo.data;
    request.refreshToken = token;
    console.log({ parseToken, customerInfo, token });
    return true;
  }
}
