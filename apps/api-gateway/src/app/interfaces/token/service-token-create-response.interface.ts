export interface IServiveTokenCreateResponse {
  status: number;
  token: string | null;
  refreshToken?: string | null;
  message: string;
}
