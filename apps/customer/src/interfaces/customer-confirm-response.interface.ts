export interface ICustomerConfirmResponse {
  status: number;
  message: string;
  errors: { [key: string]: unknown } | null;
}
