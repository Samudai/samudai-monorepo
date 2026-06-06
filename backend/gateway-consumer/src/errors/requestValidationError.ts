import { ValidationError } from 'express-validator';

export class RequestValidationError extends Error {
    constructor(errors: ValidationError[]) {
        super();

        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }
}
