import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';

import { AuthService } from '../services/auth/auth.service';
import { ROUTES } from '../../routes.constants';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private authService: AuthService,
        private router: Router
    ) {}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.authService.isAuthenticated()) {
            req = req.clone({
                setParams: {
                    auth: this.authService.token
                }
            });
        }
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                console.warn('Interceptor Error:', error);
                if (error.status === 401) {
                    this.unauthorizedRedirectToLogin();
                }
                return throwError(error);
            })
        );
    }

    private unauthorizedRedirectToLogin() {
        this.authService.logout();
        this.router.navigate([ROUTES.LOGIN]);
    }
}
