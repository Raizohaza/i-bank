import { BaseReponse } from '../../../interfaces/common/base-reponse.dto';
import { IAccount } from '../account.interface';

export class CreateAccountReponseDto extends BaseReponse {
  data: [IAccount] | any;
}
