export interface ITokenDataResponse {
  status: number;
  message: string;
  data: { customerId: string } | null;
}
