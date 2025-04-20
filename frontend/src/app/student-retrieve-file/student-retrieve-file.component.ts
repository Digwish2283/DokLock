import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { StudentUploadFileComponent } from '../student-upload-file/student-upload-file.component';

@Component({
  selector: 'app-student-retrieve-file',
  templateUrl: './student-retrieve-file.component.html',
  styleUrls: ['./student-retrieve-file.component.css']
})
export class StudentRetrieveFileComponent implements OnInit {

  constructor(private location: Location) { 
    this.file=StudentUploadFileComponent.fileN;
  }
  
  file: any;
  
  ngOnInit(): void {
  }

  downloadDocument() {
    if (this.file) {
      const link = document.createElement('a');
      link.href = this.file;
      link.download = `document-${new Date().getTime()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  goBack() {
    this.location.back();
  }
}
