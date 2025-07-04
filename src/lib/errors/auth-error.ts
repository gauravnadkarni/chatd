import { AbstractError } from "./abstract-error";

export class AuthError extends AbstractError {
  constructor(message: string, payload?: unknown) {
    super(message, 401, payload);
  }
}
