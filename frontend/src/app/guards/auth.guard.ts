import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { JwtService } from '../services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private jwtService: JwtService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (this.jwtService.isAuthenticated()) {
      // Check role-based access
      const userRole = this.jwtService.getRole();
      const requiredRole = route.data['role'];

      if (requiredRole && userRole !== requiredRole) {
        // User doesn't have required role, redirect to appropriate page
        this.redirectBasedOnRole(userRole);
        return false;
      }

      return true;
    } else {
      // Not authenticated, redirect to login
      this.router.navigate(['/login']);
      return false;
    }
  }

  private redirectBasedOnRole(role: string | null): void {
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
