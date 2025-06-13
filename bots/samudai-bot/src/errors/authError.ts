import { CustomError } from "./customError";

export class NotAuthorisedError extends CustomError {
    statusCode = 401;
    
    constructor(message: string) {
        super(message);
    
        Object.setPrototypeOf(this, NotAuthorisedError.prototype);
    }
    
    serializeErrors(): { message: string }[] {
        return [{ message: this.message }];
    }
}