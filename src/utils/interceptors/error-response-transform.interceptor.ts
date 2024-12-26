import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

export interface Response<T> {
  data: T;
}

@Injectable()
export class ErrorResponseTransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<Response<T>> {
    return next.handle().pipe(
      catchError((error) => {
        const [request] = context.getArgs();
        const { correlationId } = request;
        request.logger.log(
          { error, correlationId },
          "Exception request in ErrorResponseTransformInterceptor"
        );
        return throwError(() => error);
      })
    );
  }
}
