import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ResponseStructure<T> {
    success: boolean;
    data: T;
    message?: string;
}

@Injectable()
export class TransformResponseInterceptor<T>
    implements NestInterceptor<T, ResponseStructure<T>>
{
    intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ResponseStructure<T>> {
        return next.handle().pipe(
            map((data) => {
                return {
                    success: true,
                    data,
                    message: 'OK',
                };
            }),
        );
    }
}
