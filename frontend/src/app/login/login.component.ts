import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtToken } from '../jwt-token';
import { JwtService } from '../services/jwt.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(
    private http: HttpClient, 
    private router: Router,
    private jwtService: JwtService,
    private apiService: ApiService
  ) { }
  username:string="";
  password:string="";
  data:string="";
  email:string="";
  disable:boolean=false;
  isShown:boolean=false;
  otp:number=0;

  
  ngOnInit(): void {
    // Check if user is already authenticated
    if (this.jwtService.isAuthenticated()) {
      this.redirectBasedOnRole();
    }
  }  login()
  {
    const credentials = {
      "username": this.username,
      "password": this.password
    };
    
    this.apiService.login(credentials).subscribe((data: any) => {
      console.log(data);
      if(data.error == "Account blocked" || data.error == "Verify your email" || data.error == "Incorrect username or password")
      {
        this.data = data.error;
      }
      else
      {
        // Store JWT token and user info using the service
        this.jwtService.setToken(data.jwt);
        this.jwtService.setUsername(this.username);
        this.jwtService.setRole(data.role);
        
        // Also maintain backward compatibility
        JwtToken.jwt = data.jwt;
        JwtToken.username = this.username;
        
        // Redirect based on role
        this.redirectBasedOnRole(data.role);
      }
    }, error => {
      this.data = "Login failed. Please try again.";
      console.error('Login error:', error);
    });
  }

  private redirectBasedOnRole(role?: string): void {
    const userRole = role || this.jwtService.getRole();
    
    if(userRole=="ROLE_stu")
    { 
      console.log("username " + this.username);
      this.router.navigate(['/student']); 
    }
    else if(userRole=="ROLE_staff")
    {
      this.router.navigate(['/staff']);
    }
    else if(userRole=="ROLE_admin")
    {
      this.router.navigate(['/admin']);
    }
    else
    {
      this.router.navigate(['/login']);
    }
  }  forgetPassword()
  {
    this.disable = true;
    const emailData = {
      "email": this.email
    };
    
    this.apiService.changePassword(emailData).subscribe((data: any) => {
      if(data == "sentMail")
      {
        this.disable = false;
        this.isShown = true;
      }
      else
      {
        window.alert("Something went wrong");
        this.disable = false;
      } 
    }, error => {
      window.alert("Something went wrong");
      this.disable = false;
      console.error('Forgot password error:', error);
    });
  }

  logout(): void {
    this.jwtService.clearAuth();
    JwtToken.jwt = null;
    JwtToken.username = "";
    this.router.navigate(['/login']);
  }
}


