import { Request, Response, NextFunction } from 'express';
import ErrorHandler from "../utils/ErrorHandler";


export const handleError = (err: ErrorHandler, req:Request , res:Response,next:NextFunction) => {
    const { statusCode, message } = err;
    res.status(statusCode || 500).json({
        status: err.status,
        statusCode,
        message
    });
}
