import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  private readonly TOKEN_KEY = 'doklock_jwt_token';
  private readonly USERNAME_KEY = 'doklock_username';
  private readonly ROLE_KEY = 'doklock_role';

  constructor() { }

  // Set JWT token
  setToken(token: string): void {
    if (token) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  // Get JWT token
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Set username
  setUsername(username: string): void {
    if (username) {
      localStorage.setItem(this.USERNAME_KEY, username);
    }
  }

  // Get username
  getUsername(): string | null {
    return localStorage.getItem(this.USERNAME_KEY);
  }

  // Set user role
  setRole(role: string): void {
    if (role) {
      localStorage.setItem(this.ROLE_KEY, role);
    }
  }

  // Get user role
  getRole(): string | null {
    return localStorage.getItem(this.ROLE_KEY);
  }

  // Clear all authentication data
  clearAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USERNAME_KEY);
    localStorage.removeItem(this.ROLE_KEY);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    // Check if token is expired
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  // Get authorization header
  getAuthHeader(): string {
    const token = this.getToken();
    return token ? `Bearer ${token}` : '';
  }

  // Decode JWT token to get user info
  getTokenInfo(): any {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (error) {
      return null;
    }
  }
}
