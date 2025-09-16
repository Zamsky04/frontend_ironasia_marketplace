import { Component, OnInit, Optional } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MainHomeServService } from '../Services/main-home-serv.service';

@Component({
  selector: 'app-forgot-password',
  imports: [],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent implements OnInit 
{ 

errorMessage: string | null = null;

  constructor(@Optional() private dialogRef: MatDialogRef<ForgotPasswordComponent>, private mainserv : MainHomeServService){}

   ngOnInit(): void {       
   }  

   closeForm(): void {
  if (this.dialogRef) {
    this.dialogRef.close();
  } else {
    window.close();
  }
  }

  forgotpass(email: string) {
  alert(email);
  this.mainserv.forgotPassword(email).subscribe({
    next: (response: string) => {
      if (response && response.includes('violates not-null constraint')) {
        alert('invalid Email Address!!');
      } else {
        this.closeForm();
      }
    }
   
  });
}
}

