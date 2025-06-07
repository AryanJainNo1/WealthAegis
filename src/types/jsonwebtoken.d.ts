declare module 'jsonwebtoken' {
  export interface JwtPayload {
    userId?: string;
    [key: string]: any;
  }

  export function sign(payload: JwtPayload, secret: string, options?: { expiresIn?: string }): string;
  export function verify(token: string, secret: string): JwtPayload;
}
