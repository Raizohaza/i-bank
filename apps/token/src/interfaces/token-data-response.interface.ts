export interface ITokenDataResponse {
  status: number;
  message: string;
  data: {
    customerId: string;
    tokenExp?: string;
    refreshTokenExp?: string;
  } | null;
}
