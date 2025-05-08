export interface DecodeUserModel {
  id: number;
  role: number;
  email: string;
  username: string;
  profile: { id: number };
  timestamp: number;
  iat: number;
  exp: number;
}
