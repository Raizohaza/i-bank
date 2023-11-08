import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { decrypt, isVerifiedWithSign } from '../utils/rsa.encrypt';

@Injectable()
export class RsaGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const verify = this.reflector.get<string[]>('Verify', context.getHandler());
    if (!verify) {
      return true;
    }
    const request = context.switchToHttp().getRequest();

    const data = decrypt(request.body.encrypted);
    const verifyData = Buffer.from(JSON.parse(data.toString('utf-8')));
    const sign = Buffer.from(request.body.sign, 'base64');
    if (!isVerifiedWithSign(verifyData, sign))
      throw new UnauthorizedException('Signature invalid!');
    if (!data) {
      return false;
    }
    request.body = JSON.parse(data.toString('utf-8'));

    return true;
  }
}
