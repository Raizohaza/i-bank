export interface ITokenResponse {
  status: number;
  token: string | null;
  refreshToken?: string | null;
  tokenExp?: string;
  refreshTokenExp?: string;
  message: string;
}
