import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DtoVerifyCust } from '../../Models/DtoVerifyCust';
import { ServChangePasswordWebService } from '../../Services/serv-change-password-web.service';
import { DtoUpdCustPwd } from '../../Models/DtoUpdCustPwd';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { ServLoginService } from '../../../../login/Services/serv-login.service';

@Component({
  selector: 'app-change-passwordweb',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatInputModule,
    FormsModule,
    MatButtonModule
  ],
  templateUrl: './change-passwordweb.component.html',
  styleUrls: ['./change-passwordweb.component.css']
})
export class ChangePasswordwebComponent implements OnInit {

  changePasswordForm!: FormGroup; // ✅ sudah aman
  hideCurrent = true;
  hideNew = true;
  hideConfirm = true;
  vusrnm: any = "";
  vusrurl: any = "";
  vusnm: any = "";
  vusurl: any = "";
  vtkn: any;
  vtknd: any;
  vusr: any;
  vusrd: any;
  vemail: any;
  vcustno: any;
  vdcsutno: any;
  to: string = '';
  subject: string = '';
  otp: string = '';

  constructor(private fb: FormBuilder, private _pwdempl: ServChangePasswordWebService, private _router: Router, private dialog: MatDialog, private logserv: ServLoginService, private http: HttpClient,) {

  }

  ngOnInit(): void {
    this.GetUserToken();

    this.changePasswordForm = this.fb.group({
      currentPassword: [
        '',
        {
          validators: [Validators.required],
          asyncValidators: [this.validateCurrentPassword.bind(this)],
          updateOn: 'blur'
        }
      ],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          this.specialCharacterAndNumberValidator
        ]
      ],
      confirmPassword: [
        '',
        [
          Validators.required,
          this.specialCharacterAndNumberValidator
        ]
      ],
      webOtp: ['']
    }, {
      validators: this.passwordsMatchValidator
    });

    this.changePasswordForm.statusChanges.subscribe(status => {
      console.log('🔍 Form status:', status);
    });
  }


  GetUserToken() {
    this.vusrnm=localStorage.getItem('usnm');
    this.vusrurl=localStorage.getItem('usrimg');
    this.vusrd=localStorage.getItem('uscd');
   
    this.vusnm=this.vusrnm;
    this.vusurl=this.vusrurl;    
    this.vusr=this.logserv.decrypt(this.vusrd);

    this.logserv.updatemyacc(this.vusnm);
    this.logserv.updatemyppc(this.vusurl);


    //this.vcustno = '00035WB202505'

    /*this.logserv.updatemyacc(this.vusnm);
    this.logserv.updatemyppc(this.vusurl);*/

  };

  passwordsMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    //alert('submite');
    if (this.changePasswordForm.valid) {
      const formValue = this.changePasswordForm.value;

      const payload: DtoUpdCustPwd = {
        pemail: this.vusr,
        pnewpassword: formValue.newPassword
      };

      this._pwdempl.ProcUpdCustPwd(payload, this.vtkn).subscribe({
        next: (response) => {
          console.log('Respons dari server:', response);
          if (response === 'OK') {
            alert('Password berhasil diubah.');
            //this._router.navigate(['/Headernav']); // Ganti sesuai rute tujuan kamu
            this.ngOnInit();
          } else {
            alert('Server tidak mengonfirmasi perubahan password.'+ response);
          }
        },
        error: (err) => {
          console.error('❌ Gagal mengubah password:', err);
          alert('Terjadi kesalahan saat mengubah password. Silakan coba lagi nanti.'+ err);
        }
      });
    }
  }

  specialCharacterAndNumberValidator(control: any) {
    const value = control.value;
    if (!value) {
      return null; // Biarkan Validators.required yang menangani jika kosong
    }

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    //const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    const errors: any = {
      ...(hasUpperCase ? {} : { noUpperCase: true }),
      ...(hasLowerCase ? {} : { noLowerCase: true }),
      ...(hasNumber ? {} : { noNumber: true }),
     // ...(hasSpecialChar ? {} : { noSpecialChar: true })
    };

    return Object.keys(errors).length ? errors : null;
  }


  /*sendOtp() {
  // 🔐 Simulasi logika pengiriman OTP
  const userId = 'user123'; // ganti sesuai identifikasi pengguna
  console.log('OTP dikirim untuk user:', userId);

  // Bisa integrasi ke service backend/WebClient di sini
  // this.webClientService.sendOtp(userId).subscribe(response => {
  //   console.log('OTP response:', response);
  // });
}*/

  sendEmail() {
    //const emailControl = this.RegisForm.get('ccregEmail');
    const emailControl = this.vemail;
    alert('email: ' + emailControl);
    if (emailControl?.valid && emailControl.value) {
      this.to = emailControl.value;
      this.subject = 'Kode OTP Registrasi Anda';
      this.http.get<string>(`/reg/send-email?to=${this.to}&subject=${encodeURIComponent(this.subject)}`)
        .subscribe({
          next: response => { this.otp = response; alert('OTP telah dikirim ke email Anda.'); },
          error: error => { alert(`Gagal mengirim OTP: ${error.message || 'Error tidak diketahui'}`); }
        });
    } else { alert('Masukkan alamat email yang valid terlebih dahulu.'); emailControl?.markAsTouched(); }
  }

  validateCurrentPassword(control: AbstractControl): Observable<ValidationErrors | null> {
    const value = control.value;
    const payload: DtoVerifyCust = {
      pemail: this.vusr,
      poldpassword: value
    };
    //alert(payload.pemail + '/' + payload.poldpassword + '/' + this.vtkn);
    return this._pwdempl.ProcVerifyCust(payload, this.vtkn).pipe(
      map(res => {
        // jika respon adalah string 'OK', berarti valid
        console.log('Full response:', res); // res pasti string
        // alert('paramout: ' + res);
        return res === 'OK' ? null : { invalidCurrentPassword: true };
      }),
      catchError(err => {
        console.error('Real error from HTTP:', err);
        alert('CatchError triggered: ' + JSON.stringify(err));
        return of({ serverError: true });
      })
    );
  }

  trimOtp() {
    const otpControl = this.changePasswordForm.get('webOtp');
    if (otpControl) {
      otpControl.setValue(otpControl.value?.trim());
    }
  }

}
