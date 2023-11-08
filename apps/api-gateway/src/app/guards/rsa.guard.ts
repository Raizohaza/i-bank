import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { decrypt, isVerifiedWithSign } from '../utils/rsa.encrypt';
import * as fs from 'fs';
import 'dotenv/config';

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
    const verifyData = Buffer.from(JSON.parse(data.toString('utf-8')));
    const sign = Buffer.from(request.body.sign, 'base64');
   
    // const stream = await fetch(HOME + '/public.pem');
    // const publicKey: KeyLike = await new Promise((resolve, reject) => {
    //   res.body?.on('data', (chunk) => {
    //     resolve(chunk.toString());
    //   });
    //   stream.body?.on('error', reject);
    // });

    // const res = await fetch(HOME + TRANSFER, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Auth: hash(TRANSFER + now + process.env.SECRET_KEY),
    //     Time: now,
    //   },
    //   body: JSON.stringify({
    //     encrypted: abineEncrypt(
    //       {
    //         fromAccountNumber: tranferDTO.fromAccount,
    //         toAccountNumber: tranferDTO.toAccount,
    //         amount: tranferDTO.amount,
    //         content: tranferDTO.contentTransaction,
    //         feePayer,
    //       },
    //       publicKey
    //     ),
    //   }),
    // });
    if (!isVerifiedWithSign(verifyData, sign))
      throw new UnauthorizedException('Signature invalid!');
    if (!data) {
      return false;
    }
    request.body = JSON.parse(data.toString('utf-8'));

    return true;
  }
}
