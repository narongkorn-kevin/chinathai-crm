import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { catchError, Observable, throwError } from 'rxjs';

export const authInterceptor = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
    const authService = inject(AuthService);

    // ข้ามการแนบ Authorization สำหรับบาง endpoint
    if (req.url.includes('expand_unified.php')) {
        return next(req); // << สำคัญ: Functional interceptor ต้องใช้ next(req)
    }

    // แนบ Token หากมี
    const token = authService.accessToken;
    const authReq = token
        ? req.clone({
            setHeaders: { Authorization: `Bearer ${token}` },
        })
        : req;

    // ส่งคำขอ + ดักจับ error 401
    return next(authReq).pipe(
        catchError((error: unknown) => {
            if (error instanceof HttpErrorResponse && error.status === 401) {
                authService.signOut();
                location.reload();
            }
            return throwError(() => error);
        })
    );
};
