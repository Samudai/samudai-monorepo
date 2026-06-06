export abstract class HttpException extends Error {
    status: number;
    message: string;
    error: any;
    constructor(status: number, message: string, error: any) {
        super(message);
        this.status = status;
        this.message = message;
        this.error = error;
    }
}

class ErrorException extends HttpException {
    constructor(err: any, message: string) {
        if (err.hasOwnProperty('response')) {
            super(err.response.status, message, err.response.data.error);
        } else {
            super(500, message, err);
        }
    }
}

export default ErrorException;
