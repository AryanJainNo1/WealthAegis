declare module 'bcryptjs' {
  export function genSalt(saltRounds: number): Promise<string>;
  export function hash(password: string, salt: string): Promise<string>;
  export function compare(password: string, hash: string): Promise<boolean>;
}
