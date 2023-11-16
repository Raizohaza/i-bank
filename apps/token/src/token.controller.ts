import { Controller, HttpStatus, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { TokenService } from './services/token.service';
import { ITokenResponse } from './interfaces/token-response.interface';
import { ITokenDataResponse } from './interfaces/token-data-response.interface';
import { ITokenDestroyResponse } from './interfaces/token-destroy-response.interface';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}
  private readonly logger = new Logger(TokenController.name);
  @MessagePattern('token_create')
  public async createToken(data: { uid: string }): Promise<ITokenResponse> {
    let result: ITokenResponse;
    if (data && data.uid) {
      try {
        const createResult = await this.tokenService.createToken(data.uid);
        result = {
          status: HttpStatus.CREATED,
          message: 'token_create_success',
          token: createResult.token,
          refreshToken: createResult.refreshToken,
          tokenExp: createResult.tokenExp,
          refreshTokenExp: createResult.refreshTokenExp,
        };
      } catch (e) {
        result = {
          status: HttpStatus.BAD_REQUEST,
          message: 'token_create_bad_request',
          token: null,
        };
      }
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'token_create_bad_request',
        token: null,
      };
    }

    return result;
  }

  @MessagePattern('token_destroy')
  public async destroyToken(data: {
    uid: string;
  }): Promise<ITokenDestroyResponse> {
    return {
      status: data && data.uid ? HttpStatus.OK : HttpStatus.BAD_REQUEST,
      message:
        data && data.uid
          ? this.tokenService.deleteTokenForUid(data.uid) &&
            'token_destroy_success'
          : 'token_destroy_bad_request',
    };
  }

  @MessagePattern('token_decode')
  public async decodeToken(data: {
    token: string;
  }): Promise<ITokenDataResponse> {
    const tokenData =
      (await this.tokenService.decodeToken(data.token)) ||
      (await this.tokenService.decodeRefreshToken(data.token));
    return {
      status: tokenData ? HttpStatus.OK : HttpStatus.UNAUTHORIZED,
      message: tokenData ? 'token_decode_success' : 'token_decode_unauthorized',
      data: tokenData,
    };
  }

  @MessagePattern('token_refresh')
  public async refreshToken(data: { uid: string; refreshToken: string }) {
    const tokenData = await this.tokenService.refreshTokens(data);
    return {
      status: tokenData ? HttpStatus.OK : HttpStatus.UNAUTHORIZED,
      message: tokenData
        ? 'token_refresh_success'
        : 'token_refresh_unauthorized',
      data: tokenData,
    };
  }
}
