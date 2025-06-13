import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../errors/customError';
import { HttpException } from '../errors/exceptionHandlerHelper';

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
            errors: error.serializeErrors(),
        });
    }

    if (error instanceof HttpException) {
        return res.status(error.status).json({
            message: error.message,
            error: error.error.message ? error.error.message : error.error,
        });
    }

    console.log(error);

    return res.status(500).json({
        message: error.message,
        // field: 'internal',
        // errors: [{ message: 'Error' }]
    });
};
