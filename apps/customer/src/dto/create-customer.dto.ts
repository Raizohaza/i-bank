export class CreateCustomerDto {
  id?: string;
  email: string;
  name: string;
  password: string;
  is_confirmed: boolean;
  type?: string;
}
