import { IReceiver } from '../receivers.interface';

export class CreateReceiverDto implements IReceiver {
  accountId: string;
  remindName: string;
  customerId: string;
}
