import { PartialType } from '@nestjs/swagger';
import { CreateAccountReponseDto } from './create-account-reponse.dto';

export class UpdateAccountReponseDto extends PartialType(
  CreateAccountReponseDto
) {}
