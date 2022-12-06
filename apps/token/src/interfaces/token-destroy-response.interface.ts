export interface ITokenDestroyResponse {
  status: number;
  message: string;
  errors: { [key: string]: unknown } | null;
}