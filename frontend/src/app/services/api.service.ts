import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private jwtService: JwtService
  ) { }

  // Authentication endpoints
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/authenticate`, credentials);
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData, { responseType: 'text' });
  }

  verifyOtp(otpData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/otpVerify`, otpData, { responseType: 'text' });
  }

  changePassword(emailData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/changePassword`, emailData, { responseType: 'text' });
  }

  updatePassword(passwordData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/updatePassword`, passwordData, { responseType: 'text' });
  }

  // Student endpoints
  getStudentFiles(username: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/student/getFiles/${username}`, "", this.getAuthHeaders());
  }

  uploadFile(username: string, formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/student/upload/${username}`, formData, this.getAuthHeaders());
  }

  deleteFile(username: string, filename: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/student/delete/${username}/${filename}`, "", this.getAuthHeaders());
  }

  getFileContent(username: string, filename: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/student/files/${username}/${filename}`, "", this.getAuthHeaders());
  }

  shareFile(username: string, filename: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/student/shareFile/${username}/${filename}`, "", this.getAuthHeaders());
  }

  // Staff endpoints
  getAllDocuments(): Observable<any> {
    return this.http.post(`${this.apiUrl}/staff/getAll`, "", this.getAuthHeaders());
  }

  getVerifiedDocuments(): Observable<any> {
    return this.http.post(`${this.apiUrl}/staff/getVerified`, "", this.getAuthHeaders());
  }

  getNonVerifiedDocuments(): Observable<any> {
    return this.http.post(`${this.apiUrl}/staff/getNonVerified`, "", this.getAuthHeaders());
  }

  getDocumentsByUsername(username: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/staff/getByUsername/${username}`, "", this.getAuthHeaders());
  }

  verifyDocument(username: string, filename: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/staff/verify/${username}/${filename}`, "", this.getAuthHeaders());
  }

  rejectDocument(username: string, filename: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/staff/reject/${username}/${filename}`, "", this.getAuthHeaders());
  }

  getStaffFileContent(username: string, filename: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/staff/files/${username}/${filename}`, "", this.getAuthHeaders());
  }

  // Admin endpoints
  getAllUsers(): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/getUsers`, "", this.getAuthHeaders());
  }

  changeUserRole(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/changeRole`, userData, this.getAuthHeaders());
  }

  toggleUserStatus(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/changeStatus`, userData, this.getAuthHeaders());
  }

  // Shared endpoints
  getSharedFile(username: string, filename: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/sharefiles/${username}/${filename}`, "");
  }

  // Helper method to get authorization headers
  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return { headers };
  }
}
