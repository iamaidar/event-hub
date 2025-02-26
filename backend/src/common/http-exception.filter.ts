import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        // Для HttpException извлекаем статус
        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        // Для HttpException можно достать сообщение
        const errorResponse =
            exception instanceof HttpException
                ? exception.getResponse()
                : null;

        // Можно формировать сообщение
        // Если Nest выбрасывает HttpException, там обычно лежит
        // либо строка (message), либо объект { message, error, etc. }
        let message = 'Internal server error';
        if (errorResponse) {
            if (typeof errorResponse === 'string') {
                message = errorResponse;
            } else if (typeof errorResponse === 'object') {
                message = (errorResponse as any).message || JSON.stringify(errorResponse);
            }
        }

        // Формируем структуру
        const responseBody = {
            success: false,
            message: message,
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            // Можно добавить другие поля, если нужно
        };

        response.status(status).json(responseBody);
    }
}
