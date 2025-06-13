import { AbstractError } from "./abstract-error";

export class ServiceError extends AbstractError {
  constructor(message: string, payload?: unknown) {
    super(message, 500, payload);
  }
}
