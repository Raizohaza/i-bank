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
  public async createToken(data: {
    customerId: string;
  }): Promise<ITokenResponse> {
    let result: ITokenResponse;
    if (data && data.customerId) {
      try {
        const createResult = await this.tokenService.createToken(
          data.customerId,
        );
        result = {
          status: HttpStatus.CREATED,
          message: 'token_create_success',
          token: createResult.token,
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
    customerId: string;
  }): Promise<ITokenDestroyResponse> {
    return {
      status: data && data.customerId ? HttpStatus.OK : HttpStatus.BAD_REQUEST,
      message:
        data && data.customerId
          ? this.tokenService.deleteTokenForCustomerId(data.customerId) &&
            'token_destroy_success'
          : 'token_destroy_bad_request',
      errors: null,
    };
  }

  @MessagePattern('token_decode')
  public async decodeToken(data: {
    token: string;
  }): Promise<ITokenDataResponse> {
    const tokenData = await this.tokenService.decodeToken(data.token);
    return {
      status: tokenData ? HttpStatus.OK : HttpStatus.UNAUTHORIZED,
      message: tokenData ? 'token_decode_success' : 'token_decode_unauthorized',
      data: tokenData,
    };
  }
}
