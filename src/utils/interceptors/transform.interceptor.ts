import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { instanceToPlain } from "class-transformer";
import { Observable, map } from "rxjs";
export interface Response<T> {
  data: T;
}
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => instanceToPlain(data)));
  }
}
