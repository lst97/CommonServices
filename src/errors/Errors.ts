export class TokenServiceError implements Error {
  name: string;
  message: string;
  stack?: string | undefined;

  constructor(message: string) {
    this.name = "TokenServiceError";
    this.message = message;
    this.stack = new Error().stack;
  }
}
