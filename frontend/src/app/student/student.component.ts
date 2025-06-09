import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtService } from '../services/jwt.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {

  constructor(
    private route: Router,
    private jwtService: JwtService
  ) { 
    route.navigate(['/student/uploadFile']);
  }

  ngOnInit(): void {
  }

  logout(): void {
    this.jwtService.clearAuth();
    this.route.navigate(['/']);
  }

}
