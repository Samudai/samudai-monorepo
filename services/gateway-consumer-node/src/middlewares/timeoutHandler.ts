import { NextFunction, Request, Response } from 'express';

export const timeoutHandler = (req: Request, res: Response, next: NextFunction) => {
    if (!req.timedout) next();
};
