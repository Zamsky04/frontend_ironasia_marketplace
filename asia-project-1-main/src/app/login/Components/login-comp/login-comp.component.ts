import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule, FormsModule } from '@angular/forms';
import * as CryptoJS from 'crypto-js';
import { ServLoginService } from '../../Services/serv-login.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../Services/auth-service.service';
import { loginresponse } from '../../Models/loginresponse';
import { ForgotPasswordComponent } from '../../../Home/forgot-password/forgot-password.component';
import { CompRegisComponent } from '../../../Registration/Components/comp-regis/comp-regis.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login-comp',  
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule, FormsModule, RouterModule   ],
  templateUrl: './login-comp.component.html',
  styleUrl: './login-comp.component.css'
})
export class LoginCompComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  token: string = '';
  secretKey: string="12!@#$%abgz123";
  vusr:string="";
  vtkn:string="";
  vusrname:string="";
  vusrpic:string="";
  vusrimg:string="";
  vusrd:any;
  vtknd:any;
  resp:loginresponse[]=[];
  vusrnm:any="";
  vusrurl:any="";
  vusnm:any="";
  vusurl:any="";
  errorMessage: string | null = null;
   passwordVisible: boolean = false;
  

  constructor(private formBuilder: FormBuilder, private regiserv:ServLoginService,
    private dialogRef: MatDialogRef<LoginCompComponent>,private logserv:ServLoginService,
    private _auth:AuthService,  private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    this.vusrd=localStorage.getItem('usnm');
    this.vusr=this.regiserv.decrypt(this.vusrd)
    this.regiserv.updatemyacc(this.vusr);
  }



  onSubmit() {
  const email = this.loginForm.get('email')?.value;
  const password = this.loginForm.get('password')?.value;
  const macaddress = "some-mac-address"; 

  this._auth.execLogin(email, password, macaddress).subscribe({
    next: (response: loginresponse) =>{//TokenResponse) => {
     /// const token = response.usertoken;
      if (response.usercode==='Error Login - User Id / Password') {
          alert ('invalid Username And Password!!');
        }else{
         const namaSaja = response.username.replace(/\s\([^)]*\)$/, '');
        const typeb = response.username.match(/\([^)]*\)$/);
        localStorage.setItem('usrimg', response.userimageurl);        
        localStorage.setItem('usnm', namaSaja);
        localStorage.setItem('typeb', typeb ? typeb[0] : '');
        localStorage.setItem('picnm', this.regiserv.encrypt(response.userpiccode));
        localStorage.setItem('uscd', this.regiserv.encrypt(response.usercode));
        

        this.vusrd=localStorage.getItem('uscd');
        this.vusr=this.regiserv.decrypt(this.vusrd)
      
      this.dialogRef.close(true);
       setTimeout(() => {
          this.callothermethod();
          this.callothermethodnavbar();
      }, 1500); 
        }
    },
    error: (error) => {
      console.error("Terjadi error saat login:", error);
    this.errorMessage = 'Login failed. Please check your credentials and try again.';
    }
  });

}

  onSubmit2() {  
    this.regiserv.execLogin_asal(this.loginForm.get('email')?.value, this.loginForm.get('password')?.value, "aaaaaaa","aaaaaa").subscribe(
      (response: loginresponse) => {
        if (response.usercode==='Error Login - User Id / Password') {
          
          alert ('invalid Username And Password!!');
        }else{        
       
       this.vusr = this.regiserv.encrypt(response.usercode); 
   
        this.vusrname=response.username;
        this.vusrpic=this.regiserv.encrypt(response.userpiccode);
        this.vusrimg=response.userimageurl;
        const rawToken = response.usertoken;


        localStorage.setItem('uscd', this.vusr);
        localStorage.setItem('usnm',this.vusrname);
        localStorage.setItem('picnm', this.vusrpic);
        localStorage.setItem('usrimg',this.vusrimg);
        this.vusrd=localStorage.getItem('uscd');
        this.vusr=this.regiserv.decrypt(this.vusrd)
       this.dialogRef.close(true)
        }           
      },
      (error) => {
       
        console.error(error);
        this.dialogRef.close(false)
       alert ('invalid Username And Password!!'+error);
      }
    
    );

    this.vusrnm=localStorage.getItem('usnm');
    this.vusrurl=localStorage.getItem('usrimg');
    this.vusrd=localStorage.getItem('uscd');
   
    this.vusnm=this.vusrnm;
    this.vusurl=this.vusrurl;    
    this.vusr=this.logserv.decrypt(this.vusrd);

    this.logserv.updatemyacc(this.vusnm);
    this.logserv.updatemyppc(this.vusurl) 
  }

  encrypt(text: string): string {
    return CryptoJS.AES.encrypt(text, this.secretKey).toString();
  }

  decrypt(ciphertext: string): string {
    const bytes = CryptoJS.AES.decrypt(ciphertext, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

   callothermethod() {
    this.logserv.callmethodfromothercomponent();
  }
  
   callothermethodnavbar() {
    this.logserv.callmethodfromothercomponentnavbar();
  }

   closeForm() {
    this.dialogRef.close(true);
  }

  openForgotPasswordDialog(event: MouseEvent): void {
    event.preventDefault();     
    this.dialog.open(ForgotPasswordComponent, {
      width: '100px', 
       height: 'auto'
    });
  }

  openRegistrationDialog(event: MouseEvent): void {
    event.preventDefault();

    this.dialog.open(CompRegisComponent, {
      width: '90vw',      
      maxWidth: '1000px',
      height: '90vh',    
    });
  }

   togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

}