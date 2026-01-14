export interface JWTPayload {
  user: {
    _id: string;
    username: string;
    isAdmin: boolean;
  };
  iat?: number;
  exp?: number;
}
