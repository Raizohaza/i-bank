export interface ITokenResponse {
  status: number;
  token: string | null;
  refreshToken?: string | null;
  message: string;
}
