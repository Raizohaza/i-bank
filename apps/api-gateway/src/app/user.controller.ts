import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiHeader,
} from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { Authorization } from './decorators/authorization.decorator';
import { IAuthorizedRequest } from './interfaces/common/authorized-request.interface';
import {
  IServiveTokenCreateResponse,
  IServiceTokenDestroyResponse,
} from './interfaces/token';
import {
  ConfirmUserDto,
  ConfirmUserResponseDto,
  CreateUserDto,
  CreateUserResponseDto,
  GetUserByTokenResponseDto,
  IServiceUserConfirmResponse,
  IServiceUserCreateResponse,
  IServiceUserGetByIdResponse,
  IServiceUserSearchResponse,
  LoginUserDto,
  LoginUserResponseDto,
  LogoutUserResponseDto,
} from './interfaces/user';
import { TokenUserDto } from './interfaces/user/dto/token-user.dto';
@ApiHeader({
  name: 'Authorization',
  description: 'Authorization token',
})
@Controller('user')
@ApiTags('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
    @Inject('TOKEN_SERVICE') private readonly tokenServiceClient: ClientProxy
  ) {}
  @Get()
  @Authorization(true)
  @ApiOkResponse({
    type: GetUserByTokenResponseDto,
  })
  public async getUserByToken(
    @Req() request: IAuthorizedRequest
  ): Promise<GetUserByTokenResponseDto> {
    const userInfo = request.user;

    const userResponse: IServiceUserGetByIdResponse = await firstValueFrom(
      this.userService.send('user_get_by_id', userInfo.id)
    );

    return {
      message: userResponse.message,
      data: {
        user: userResponse.user,
      },
      errors: null,
    };
  }

  @Post()
  @ApiCreatedResponse({
    type: CreateUserResponseDto,
  })
  public async createUser(
    @Body() userRequest: CreateUserDto
  ): Promise<CreateUserResponseDto> {
    const createUserResponse: IServiceUserCreateResponse = await firstValueFrom(
      this.userService.send('user_create', userRequest)
    );
    if (createUserResponse.status !== HttpStatus.CREATED) {
      throw new HttpException(
        {
          message: createUserResponse.message,
          data: null,
          errors: createUserResponse.errors,
        },
        createUserResponse.status
      );
    }

    const createTokenResponse: IServiveTokenCreateResponse =
      await firstValueFrom(
        this.tokenServiceClient.send('token_create', {
          userId: createUserResponse.user.id,
        })
      );

    return {
      message: createUserResponse.message,
      data: {
        user: createUserResponse.user,
        token: createTokenResponse.token,
      },
      errors: null,
    };
  }

  @Post('/login')
  @ApiCreatedResponse({
    type: LoginUserResponseDto,
  })
  public async loginUser(
    @Body() loginRequest: LoginUserDto
  ): Promise<LoginUserResponseDto> {
    const getUserResponse: IServiceUserSearchResponse = await firstValueFrom(
      this.userService.send('user_search_by_credentials', loginRequest)
    );

    if (getUserResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: getUserResponse.message,
          data: null,
          errors: null,
        },
        HttpStatus.UNAUTHORIZED
      );
    }

    const createTokenResponse: IServiveTokenCreateResponse =
      await firstValueFrom(
        this.tokenServiceClient.send('token_create', {
          userId: getUserResponse.user.id,
        })
      );

    return {
      message: createTokenResponse.message,
      data: {
        token: createTokenResponse.token,
      },
      errors: null,
    };
  }

  @Put('/logout')
  @Authorization(true)
  @ApiCreatedResponse({
    type: LogoutUserResponseDto,
  })
  public async logoutUser(
    @Req() request: IAuthorizedRequest
  ): Promise<LogoutUserResponseDto> {
    const userInfo = request.user;

    const destroyTokenResponse: IServiceTokenDestroyResponse =
      await firstValueFrom(
        this.tokenServiceClient.send('token_destroy', {
          userId: userInfo.id,
        })
      );

    if (destroyTokenResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: destroyTokenResponse.message,
          data: null,
          errors: destroyTokenResponse.errors,
        },
        destroyTokenResponse.status
      );
    }

    return {
      message: destroyTokenResponse.message,
      errors: null,
      data: null,
    };
  }

  @Get('/confirm/:link')
  @ApiCreatedResponse({
    type: ConfirmUserResponseDto,
  })
  public async confirmUser(
    @Param() params: ConfirmUserDto
  ): Promise<ConfirmUserResponseDto> {
    const confirmUserResponse: IServiceUserConfirmResponse =
      await firstValueFrom(
        this.userService.send('user_confirm', {
          link: params.link,
        })
      );

    if (confirmUserResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: confirmUserResponse.message,
          data: null,
          errors: confirmUserResponse.errors,
        },
        confirmUserResponse.status
      );
    }

    return {
      message: confirmUserResponse.message,
      errors: null,
      data: null,
    };
  }
}
