import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        console.error('🔥 EXCEPTION CAUGHT 🔥', {
            url: request.url,
            method: request.method,
            status,
            message: exception instanceof HttpException ? exception.getResponse() : exception,
            stack: exception instanceof Error ? exception.stack : null,
        });

        response.status(status).json({
            success: false,
            statusCode: status,
            path: request.url,
            message:
                exception instanceof HttpException
                    ? exception.message
                    : 'Internal server error',
            timestamp: new Date().toISOString(),
        });
    }
}
