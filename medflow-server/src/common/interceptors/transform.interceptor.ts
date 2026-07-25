import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Định nghĩa interface cho Response chuẩn
export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  Response<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    // next.handle() đại diện cho dữ liệu mà các Controller trả về.
    // map() sẽ can thiệp vào trước khi dữ liệu được gửi về Frontend và bọc nó vào object "data".
    return next.handle().pipe(
      map((data) => {
        // Tránh bọc 2 lần nếu data đã có dạng { data: ... }
        // (để phòng hờ tính năng phân trang sau này)
        if (data && typeof data === 'object' && 'data' in data) {
          return data;
        }
        return { data };
      }),
    );
  }
}
