import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Query } from 'mongoose';
import { IToken } from '../interfaces/token.interface';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel('Token') private readonly tokenModel: Model<IToken>,
  ) {}

  async createToken(uid: string): Promise<IToken> {
    const tokenByUid = await this.tokenModel.findOne({ customer_id: uid });
    if (tokenByUid) await this.deleteTokenForUid(uid);
    const [token, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          uid: uid,
        },
        {
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          uid: uid,
        },
        {
          expiresIn: '1d',
        },
      ),
    ]);
    const tokenExp = (await this.jwtService.decode(token)) as {
      exp: number;
      uid: unknown;
    };
    const refreshTokenExp = (await this.jwtService.decode(token)) as {
      exp: number;
      uid: unknown;
    };
    console.log({
      uid: uid,
      token,
      refreshToken,
      tokenExp: tokenExp.exp,
      refreshTokenExp: refreshTokenExp.exp,
    });

    return await new this.tokenModel({
      uid: uid,
      token,
      refreshToken,
      tokenExp: tokenExp.exp,
      refreshTokenExp: refreshTokenExp.exp,
    }).save();
  }
  async refreshTokens({
    uid,
    refreshToken,
  }: {
    uid: string;
    refreshToken: string;
  }): Promise<IToken> {
    const tokenByUid = await this.tokenModel.findOne({ uid: uid });
    // console.log({ tokenByUid, uid });

    if (!tokenByUid || !tokenByUid.refreshToken)
      throw new ForbiddenException('Access Denied');
    // console.log(tokenByUid);

    const refreshTokenMatches = tokenByUid.refreshToken === refreshToken;

    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.createToken(uid);
    return tokens;
  }

  public async deleteTokenForUid(
    uid: string,
  ): Promise<Query<unknown, unknown>> {
    return await this.tokenModel.deleteMany({
      uid: uid,
    });
  }

  public async decodeToken(token: string) {
    const tokenModel = await this.tokenModel.find({
      token,
    });
    let result = null;

    if (tokenModel && tokenModel[0]) {
      try {
        const tokenData = (await this.jwtService.decode(
          tokenModel[0].token,
        )) as {
          exp: number;
          uid: unknown;
        };
        if (!tokenData || tokenData.exp <= Math.floor(+new Date() / 1000)) {
          result = null;
        } else {
          result = {
            uid: tokenData.uid,
            exp: tokenData.exp,
          };
        }
      } catch (e) {
        result = null;
      }
    }
    return result;
  }

  public async decodeRefreshToken(token: string) {
    const tokenModel = await this.tokenModel.find({ refreshToken: token });
    let result = null;

    if (tokenModel && tokenModel[0]) {
      try {
        const refreshTokenData = (await this.jwtService.decode(
          tokenModel[0].refreshToken,
        )) as {
          exp: number;
          uid: unknown;
        };
        if (
          !refreshTokenData ||
          refreshTokenData.exp <= Math.floor(+new Date() / 1000)
        ) {
          result = null;
        } else {
          result = {
            uid: refreshTokenData.uid,
          };
        }
      } catch (e) {
        result = null;
      }
    }
    return result;
  }
}
