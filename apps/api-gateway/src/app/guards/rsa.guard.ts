import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { decrypt, isVerifiedWithSign } from '../utils/rsa.encrypt';
import * as fs from 'fs';
import * as fetch from 'node-fetch';
import 'dotenv/config';
import { KeyLike } from 'crypto';

@Injectable()
export class RsaGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const verify = this.reflector.get<string[]>('Verify', context.getHandler());
    if (!verify) {
      return true;
    }
    const HOME = 'https://abine.fly.dev';
    const request = context.switchToHttp().getRequest();
    const data = decrypt(request.body.encrypted);
    console.log(data.toString('utf-8'));
    // const verifyData = Buffer.from(JSON.parse(data.toString('utf-8')));
    const verifyData = Buffer.from(data);
    const sign = Buffer.from(request.body.sign, 'base64');

    const fetchData = await fetch(HOME + '/public.pem');
    const publicKey = await fetchData.text();
    console.log(publicKey);
    // if (!isVerifiedWithSign(verifyData, sign, publicKey))
    //   throw new UnauthorizedException('Signature invalid!');
    if (!data) {
      return false;
    }
    request.body = JSON.parse(data.toString('utf-8'));

    return true;
  }
}
