import { HttpClient, HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Data } from '../data';
import { Files } from '../files';
import { JwtToken } from '../jwt-token';

@Component({
  selector: 'app-student-upload-file',
  templateUrl: './student-upload-file.component.html',
  styleUrls: ['./student-upload-file.component.css']
})
export class StudentUploadFileComponent implements OnInit {
    file!: File;
    fileName:string="SSC";
    static fileN:string="";
    flag:boolean=true;
    url:any;
    filesArr:Data[]=[];
  constructor(private http:HttpClient, private router:Router){

    var t='Bearer '+JwtToken.jwt;
    let headers = new HttpHeaders().set("Authorization", t);
    console.log(JwtToken.username +"us");
    http.post("http://localhost:8080/student/getFiles/"+JwtToken.username,"",{headers:headers}).subscribe((data:any)=>{
      this.filesArr=Object.values(data) ;
    });
  }
  
  ngOnInit(): void {
  }

  event:any;
  submit(event:any){
    var t='Bearer '+JwtToken.jwt;
    let headers = new HttpHeaders().set("Authorization", t);
    const data=new FormData();
    this.event=event;
    console.log(this.file)

    this.file=event.target.files[0];
    if(this.file.size>2097152)
      window.alert("File size too large");
     else{ 
       var allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
       if(!allowedExtensions.exec(this.file.name))
        window.alert("Only .jpg,.jpeg,.png extensions allowed");
        else
        {
         let exten:string=this.file.name.substring(this.file.name.indexOf('.'))
        
        StudentUploadFileComponent.fileN=this.fileName+exten;
        console.log(this.file)
        this.flag=true;
        data.append('imageFile',this.file,JwtToken.username+'\\'+ this.fileName+exten);
        console.log("hi")
   
    this.http.post("http://localhost:8080/student/byImageFile",data,{headers:headers, observe:'response', responseType:'text'}).subscribe((data:any)=>{
      // console.log("hi")
      // console.log(data);
      // this.filesArr=Object.values(data) ;
    });
    this.http.post("http://localhost:8080/student/getFiles/"+JwtToken.username,"",{headers:headers}).subscribe((data:any)=>{
    console.log(JwtToken.username+"name");  
    this.filesArr=data;
      console.log(data);
    });
  }}
  }
     
  getFile() {
    var t='Bearer '+JwtToken.jwt;
    let headers = new HttpHeaders().set("Authorization", t);
    this.http.post("http://localhost:8080/student/files/"+JwtToken.username+"/"+this.fileName,"",{headers:headers}).subscribe((data:any)=>{
     if(data!=null){
      const byteCharacters = atob(data.base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {type: data.type });
      var reader = new FileReader();
      reader.readAsDataURL(blob);
      
      reader.onload = (_event) => {
        this.url = reader.result; 
      }
    }
    else
      window.alert("File not uploaded");
    });
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Link copied to clipboard!');
    }, (err) => {
      console.error('Could not copy text: ', err);
    });
  }
}


