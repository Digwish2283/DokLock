import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { JwtService } from '../services/jwt.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private jwtService: JwtService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Auto logout if 401 response returned from API
          this.jwtService.clearAuth();
          this.router.navigate(['/login']);
        }

        if (error.status === 403) {
          // Forbidden - redirect to appropriate page based on role
          const role = this.jwtService.getRole();
          if (role) {
            this.redirectBasedOnRole(role);
          } else {
            this.router.navigate(['/login']);
          }
        }

        const errorMsg = error.error?.message || error.statusText;
        console.error('HTTP Error:', errorMsg);
        return throwError(error);
      })
    );
  }

  private redirectBasedOnRole(role: string): void {
    switch (role) {
      case 'ROLE_stu':
        this.router.navigate(['/student']);
        break;
      case 'ROLE_staff':
        this.router.navigate(['/staff']);
        break;
      case 'ROLE_admin':
        this.router.navigate(['/admin']);
        break;
      default:
        this.router.navigate(['/login']);
    }
  }
}
