import { ValidationError } from "express-validator";

export class RequestValidationError extends Error {
  constructor(_errors: ValidationError[]) {
    super();

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
}
