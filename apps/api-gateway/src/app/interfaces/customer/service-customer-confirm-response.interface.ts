export interface IServiceCustomerConfirmResponse {
  status: number;
  message: string;
  errors: { [key: string]: unknown };
}
