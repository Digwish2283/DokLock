import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtService } from '../services/jwt.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private jwtService: JwtService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // List of endpoints that don't need authentication
    const excludedEndpoints = [
      '/authenticate',
      '/register',
      '/otpVerify',
      '/changePassword',
      '/updatePassword',
      '/sharefiles'
    ];

    // Check if the request URL contains any excluded endpoint
    const isExcluded = excludedEndpoints.some(endpoint => request.url.includes(endpoint));

    if (!isExcluded && this.jwtService.isAuthenticated()) {
      // Clone the request and add the Authorization header
      const authRequest = request.clone({
        setHeaders: {
          Authorization: this.jwtService.getAuthHeader()
        }
      });
      return next.handle(authRequest);
    }

    return next.handle(request);
  }
}
