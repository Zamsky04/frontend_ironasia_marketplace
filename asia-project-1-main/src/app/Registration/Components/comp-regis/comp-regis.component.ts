import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
// Pastikan ValidatorFn juga diimpor jika belum ada
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, ValidatorFn, ValidationErrors } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';


import { citymdl } from '../../Models/citymdl';
import { kecamatanmdl } from '../../Models/kecamatanmdl';
import { kelurahanmdl } from '../../Models/kelurahanmdl';
import { provincemdl } from '../../Models/provincemdl';
import { regismdl } from '../../Models/regismdl';
import { bankmdl } from '../../Models/bankmdl';
import { ServRegisService } from '../../Services/serv-regis.service';
import { ServProductTypeService } from '../../../MasterApps/Services/serv-product-type.service';
import { MainHomeComponent } from '../../../Home/main-home/main-home.component';

function idImageRequiredValidator(control: AbstractControl): ValidationErrors | null {
  const nationalId = control.get('nationalId');
  const nationalIdImage = control.get('nationalIdImage');
  if (nationalId && nationalIdImage && nationalId.value && !nationalIdImage.value) {
    return { idImageRequired: true };
  }
  return null;
}

export interface productlist {
  cmprCode: number;
  cmprName: string;
  cmprImgFilename: string;
  cmprImgFilepath: string;
  cmprCreateBy: string;
  cmprCreateDate: Date;
  cmprUpdateBy: string;
  cmprUpdateDate: Date;
}


export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }
    const hasUpperCase = /[A-Z]+/.test(value);
    const hasLowerCase = /[a-z]+/.test(value);
    const hasNumeric = /[0-9]+/.test(value);
    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric;
    return !passwordValid ? { passwordStrength: 'Password harus mengandung huruf besar, huruf kecil, dan angka.' } : null;
  };
}


export function passwordMatcher(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    if (!(group instanceof FormGroup)) {
      console.error('Password matcher validator harus diterapkan pada FormGroup.');
      return null;
    }
    const passwordControl = group.get('ccregPassword'); 
    const confirmPasswordControl = group.get('ccregReconfirmPassword'); 

    if (!passwordControl || !confirmPasswordControl) {
      return null; 
    }
    if (confirmPasswordControl.pristine || !confirmPasswordControl.value) {
      return null;
    }

    if (passwordControl.value !== confirmPasswordControl.value) {
      return { passwordMismatch: true };
    }
       return null;
  };
}

export function requiredImageWhenFieldHasValue(textFieldName: string, fileFieldName: string, errorName: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    if (!(group instanceof FormGroup)) { return null; }
    const textField = group.get(textFieldName);
    const fileField = group.get(fileFieldName);
    if (!textField || !fileField) { return null; }
    if (textField.value && !fileField.value) {
      return { [errorName]: true };
    }
    return null;
  };
}


@Component({
  selector: 'app-comp-regis',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatTabsModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatInputModule,
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './comp-regis.component.html',
  styleUrl: './comp-regis.component.css'
})
export class CompRegisComponent implements OnInit, AfterViewInit {
  // ... (properti lainnya tetap sama) ...
  selectedprov: any;
  puser: string = "aaaa";
  vreg: regismdl[] = [];
  vprodlist: productlist[] = [];
  RegisForm!: FormGroup;
  nikimage?: File;
  nibimage?: File;
  message = '';
  preview = '';
  preview2 = '';
  bankrcv: boolean = true;
  maxapp: number = 0;
  selectedcity: string = 'a';
  selectedkec: string = 'a';
  selectedkel: string = 'a';
  selectedbank: string = 'a';
  provlist: provincemdl[] = [];
  citylist: citymdl[] = [];
  keclist: kecamatanmdl[] = [];
  kellist: kelurahanmdl[] = [];
  banklist: bankmdl[] = [];
  regid: number = 0;
  nikimg: string = "a";
  nibimg: string = "a";
  vregid: number = 0;
  to: string = '';
  subject: string = '';
  otp: string = '';
  filepathnamenik: string = '';
  filepathnamenib: string = '';
  secretKey: string = "12!@#$%abgz123";
  vtkn: any;
  vtknd: any;
  vusr: any;
  vusrd: any;
  vpic: string = "aaaa";
  selectedFilenik: any;
  selectedFilenib: any;
  dirname: string = '';
  uploadProgress: number | null = null;
  uploadMessage: string | null = null;
  vpickbuss: string = "aaa";
  otpFromServer: string = '';
  @ViewChild('iconList') iconList!: ElementRef;
  icons = [
    'home', 'search', 'favorite', 'settings', 'person', 'info',
    'help', 'event', 'work', 'school', 'local_cafe', 'restaurant',
  ];

  vccregCustType:string='retail';

  

  constructor(
    private regiServ: ServRegisService,
    private _prodserv: ServProductTypeService,
    private fb: FormBuilder,
    private http: HttpClient,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<MainHomeComponent>
  ) {

  }

  ngOnInit(): void {
    this.initializeForm();
    this.getProduct();
    this.getprovince();
    this.getRegId();
  }


  initializeForm() {
    this.RegisForm = this.fb.group({

      ccregId: [''],
      ccregName: ['', Validators.required],
      ccregNickName: [''],
      ccregPic1Name: ['', Validators.required],
      ccregNationId: ['', [Validators.required, Validators.pattern("^[0-9]{16}$")]],
      ccregNationImgFileName: [''],
      ccregNationImgFilePath: [''],
      ccregNationImgFile: [null],
      ccregNibId: [''],
      ccregNibImgFileName: [''],
      ccregNibImgFilePath: [''],
       ccregNibImgFile: [null], 
      bisnisInti: this.fb.array([]),
      ccregAddress: ['', Validators.required],
      ccregRt: ['', Validators.pattern("^[0-9]*$")],
      ccregRw: ['', Validators.pattern("^[0-9]*$")],
      ccregProvId: ['', Validators.required],
      ccregCityId: ['', Validators.required],
      ccregKecId: ['', Validators.required],
      ccregKelId: ['', Validators.required],
      ccregArea: [''],
      ccregZip: ['', Validators.pattern("^[0-9]{5}$")],
      ccregPhone: ['', Validators.pattern("^[0-9\\+\\s\\(\\)]*$")],
      ccregLongLat: [''],
      ccregCoreBussiness: [''],
      ccregMobilePhone: ['', [Validators.required, Validators.pattern("^[0-9\\+]*$")]], // Sesuaikan pattern jika perlu
      ccregEmail: ['', [Validators.required, Validators.email]],
      
      
      ccregPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        passwordStrengthValidator() 
      ]],
      ccregReconfirmPassword: ['', Validators.required], 
      
      otp: ['', [Validators.required, Validators.pattern("^[0-9]{6}$")]], 
      ccregSentCmbaId: [''],
      ccregSentCmbaName: [''],
      ccregSentCmbaAccount: [''],
      ccregRevcCmbaId: [''],
      ccregRecvCmbaName: [''],
      ccregRevcCmbaAccount: [''],
      ccregMinApproval: [''],
      ccregPic1Phone: [''],
      ccregPic1Email: [''],
      // ccregPic1password: [''], 
      ccregPic2Name: [''],
      ccregPic2Phone: [''],
      ccregPic2Email: [''],
      // ccregPic2password: [''],
      ccregPic3Name: [''],
      ccregPic3Phone: [''],
      ccregPic3Email: [''],
      // ccregPic3password: [''],
      ccreg_type: [''],
      // ccreg_password: [''] 
    }, {
      validators:  [
        passwordMatcher(),
        requiredImageWhenFieldHasValue('ccregNationId', 'ccregNationImgFile', 'nationIdImageRequired'),
        requiredImageWhenFieldHasValue('ccregNibId', 'ccregNibImgFile', 'nibIdImageRequired')
      ]
    });
    console.log('RegisForm initialized dengan validasi password.');
  }

  get bisnisIntiControls(): AbstractControl[] {
    const control = this.RegisForm?.get('bisnisInti');
    return control instanceof FormArray ? control.controls : [];
  }

  ngAfterViewInit(): void {
    if (this.iconList && this.iconList.nativeElement) {
      const iconElements = this.iconList.nativeElement.querySelectorAll('.icon');
      let totalWidth = 0;
      for (let i = 0; i < 5 && i < iconElements.length; i++) {
        totalWidth += iconElements[i].offsetWidth;
      }
      this.iconList.nativeElement.style.width = `${totalWidth}px`;
    }
  }

  changebank(value: any) { this.selectedbank = value; }
  getProduct() {
    if (!this.RegisForm) { return; }
    this._prodserv.getProductList().subscribe(
      (res: productlist[]) => {
        this.vprodlist = res;
        this.createBisnisIntiControls();
      },
      (error) => {
        console.error("Gagal mengambil data produk:", error);
        this.vprodlist = [];
        this.createBisnisIntiControls();
      }
    );
  }

  createBisnisIntiControls() {
    if (!this.RegisForm || !this.RegisForm.get('bisnisInti')) { return; }
    const bisnisIntiArray = this.RegisForm.get('bisnisInti') as FormArray;
    if (bisnisIntiArray instanceof FormArray) {
      bisnisIntiArray.clear();
      this.vprodlist.forEach(() => bisnisIntiArray.push(this.fb.control(false)));
    }
  }

  getSelectedProductData(): productlist[] {
    this.vpickbuss = "";
    const selectedProducts: productlist[] = [];
    if (!this.RegisForm || !this.RegisForm.get('bisnisInti')) { return []; }
    const bisnisIntiArrayValue = this.RegisForm.get('bisnisInti')?.value as boolean[];
    if (bisnisIntiArrayValue && this.vprodlist.length === bisnisIntiArrayValue.length) {
      bisnisIntiArrayValue.forEach((isSelected, index) => {
        if (isSelected && this.vprodlist[index]) {
          selectedProducts.push(this.vprodlist[index]);
          this.vpickbuss = this.vpickbuss + this.vprodlist[index].cmprCode + ", ";
        }
      });
    }
    return selectedProducts;
  }

  getRegId() { this.regiServ.getRegId().subscribe((res: any) => { this.vregid = res; }); }
  changeprov() {
    const selectedProvCode = this.RegisForm.get('ccregProvId')?.value;
    this.citylist = []; this.keclist = []; this.kellist = [];
    this.RegisForm.patchValue({ ccregCityId: '', ccregKecId: '', ccregKelId: '' });
    if (selectedProvCode) { this.getcity(selectedProvCode); }
  }
  getprovince() { this.regiServ.getProvinceALL().subscribe((res: provincemdl[]) => { this.provlist = res; }); }
  changecity() {
    const selectedCityCode = this.RegisForm.get('ccregCityId')?.value;
    this.keclist = []; this.kellist = [];
    this.RegisForm.patchValue({ ccregKecId: '', ccregKelId: '' });
    if (selectedCityCode) { this.getkecamatan(selectedCityCode); }
  }
  getcity(ct: string) { this.regiServ.getcitybyprovALL(ct).subscribe((res: citymdl[]) => { this.citylist = res; }); }
  changekecamatan() {
    const selectedKecCode = this.RegisForm.get('ccregKecId')?.value;
    this.kellist = [];
    this.RegisForm.patchValue({ ccregKelId: '' });
    if (selectedKecCode) { this.getkelurahan(selectedKecCode); }
  }
  getkecamatan(kc: string) { this.regiServ.getKecbyCityALL(kc).subscribe((res: kecamatanmdl[]) => { this.keclist = res; }); }
  changekelurahan() {
    const selectedKelCode = this.RegisForm.get('ccregKelId')?.value;
    this.RegisForm.patchValue({ ccregKelId: selectedKelCode });
  }
  getkelurahan(kl: string) { this.regiServ.getKelbyKecALL(kl).subscribe((res: kelurahanmdl[]) => { this.kellist = res; }); }

  /*sendEmail() {
    const emailControl = this.RegisForm.get('ccregEmail');
    if (emailControl?.valid && emailControl.value) {
      this.to = emailControl.value;
      this.subject = 'Kode OTP Registrasi Anda';
      this.http.get<string>(`/reg/send-email?to=${this.to}&subject=${encodeURIComponent(this.subject)}`)
        .subscribe({
          next: response => { this.otp = response; alert('OTP telah dikirim ke email Anda.'); },
          error: error => { alert(`Gagal mengirim OTP: ${error.message || 'Error tidak diketahui'}`); }
        });
    } else { alert('Masukkan alamat email yang valid terlebih dahulu.'); emailControl?.markAsTouched(); }
  }*/

 sendEmail() {
    const emailControl = this.RegisForm.get('ccregEmail');
    if (emailControl?.valid && emailControl.value) {
      const email = emailControl.value;
      const subject = 'Your Registration OTP Code';

      // Panggil method sendOtp dari service
      this.regiServ.sendOtp(email, subject)
        .subscribe({
          // Logika subscribe tetap di komponen karena komponen
          // yang bertanggung jawab atas apa yang terjadi di UI
          next: response => {
            this.otpFromServer = response;
            alert('OTP has been sent to your email.');
          },
          error: error => {
            console.error('API Error:', error);
            alert(`Failed to send OTP: ${error.statusText || 'Unknown server error'}`);
          }
        });

    } else {
      alert('Please enter a valid email address first.');
      emailControl?.markAsTouched();
    }
  }


  saveRegis() {
    const otpUserInput = this.RegisForm.get('otp')?.value;


  if (!this.otpFromServer) {
    alert('You have not requested an OTP code yet. Please click the "Send OTP" button first.');
    return; // Hentikan eksekusi
  }

 
  if (otpUserInput !== this.otpFromServer) {
    alert('The OTP code is incorrect. Please try again');
    this.RegisForm.get('otp')?.setErrors({ otpMismatch: true });
    return; 
  }

    if (this.RegisForm.valid) {
      const selectedCoreBusiness = this.getSelectedProductData();
      const formDataRaw = this.RegisForm.getRawValue();
      const payload = { 
        ccregId: 0,
        ccregName: formDataRaw.ccregName,
        ccregNickName: formDataRaw.ccregNickName,
        ccregPic1Name: formDataRaw.ccregPic1Name,
        ccregNationId: formDataRaw.ccregNationId,
        ccregNibId: formDataRaw.ccregNibId,
        ccregAddress: formDataRaw.ccregAddress,
        ccregRt: formDataRaw.ccregRt,
        ccregRw: formDataRaw.ccregRw,
        ccregProvId: formDataRaw.ccregProvId,
        ccregCityId: formDataRaw.ccregCityId,
        ccregKecId: formDataRaw.ccregKecId,
        ccregKelId: formDataRaw.ccregKelId,
        ccregArea: formDataRaw.ccregArea,
        ccregZip: formDataRaw.ccregZip,
        ccregPhone: formDataRaw.ccregPhone,
        ccregLongLat: formDataRaw.ccregLongLat,
        ccregCoreBussiness: this.vpickbuss,
        ccregMobilePhone: formDataRaw.ccregMobilePhone,
        ccregEmail: formDataRaw.ccregEmail,
        ccregPassword: formDataRaw.ccregPassword, 
      };
      this.regiServ.saveupdateRegis(payload, this.selectedFilenik, this.selectedFilenib).subscribe({
        next: (val: any) => { alert(val || 'Registrasi berhasil disimpan.'); this.closeForm();},
        
       // error: (err: any) => { alert(`Gagal menyimpan registrasi: ${err.message || 'Error tidak diketahui'}`); }
      });
    } else {
      alert('Form tidak valid. Mohon lengkapi semua field yang wajib diisi dengan benar.');
      this.RegisForm.markAllAsTouched();
    }
  }
  selectImageNik(event: any): void {
    const file = event.target.files[0]; this.selectedFilenik = file;
    if (file) {
      if (!file.type.startsWith('image/')) { alert('Harap pilih file gambar.'); this.selectedFilenik = null; event.target.value = null; this.preview = ''; return; }
      const maxSizeMB = 2; if (file.size > maxSizeMB * 1024 * 1024) { alert(`Ukuran file maksimal ${maxSizeMB} MB.`); this.selectedFilenik = null; event.target.value = null; this.preview = ''; return; }
      const reader = new FileReader(); reader.onload = (e: any) => { this.preview = e.target.result; }; reader.onerror = () => { alert('Gagal membaca file gambar.'); this.preview = ''; }; reader.readAsDataURL(file);
    } else { this.selectedFilenik = null; this.preview = ''; }

     if (file) {
    const reader = new FileReader(); 
    reader.onload = (e: any) => { 
      this.preview = e.target.result; 
      this.RegisForm.get('ccregNationImgFile')?.setValue(file); 
    }; 
   
    reader.readAsDataURL(file);
  } else { 
    this.selectedFilenik = null; 
    this.preview = ''; 
    this.RegisForm.get('ccregNationImgFile')?.setValue(null); 
  }
  }

  selectImageNib(event: any): void {
    const file = event.target.files[0]; this.selectedFilenib = file;
    if (file) {
      if (!file.type.startsWith('image/')) { alert('Harap pilih file gambar.'); this.selectedFilenib = null; event.target.value = null; this.preview2 = ''; return; }
      const maxSizeMB = 2; if (file.size > maxSizeMB * 1024 * 1024) { alert(`Ukuran file maksimal ${maxSizeMB} MB.`); this.selectedFilenib = null; event.target.value = null; this.preview2 = ''; return; }
      const reader = new FileReader(); reader.onload = (e: any) => { this.preview2 = e.target.result; }; reader.onerror = () => { alert('Gagal membaca file gambar NIB.'); this.preview2 = ''; }; reader.readAsDataURL(file);
    } else { this.selectedFilenib = null; this.preview2 = ''; }

    if (file) {
    const reader = new FileReader(); 
    reader.onload = (e: any) => { 
      this.preview2 = e.target.result; 
      this.RegisForm.get('ccregNibImgFile')?.setValue(file); 
    }; 

    reader.readAsDataURL(file);
  } else { 
    this.selectedFilenib = null; 
    this.preview2 = ''; 
    this.RegisForm.get('ccregNibImgFile')?.setValue(null);
  }
  }

  showSentBank() { this.bankrcv = !this.bankrcv; }
  cancelForm(): void { alert("Pendaftaran dibatalkan."); }

   onTypeSelectionChange(): void {
    const nibIdControl = this.RegisForm.get('ccregNibId');

    nibIdControl?.clearValidators();
    nibIdControl?.reset('');

    if (this.vccregCustType === 'business') {
      nibIdControl?.setValidators(Validators.required);
    }

    nibIdControl?.updateValueAndValidity();
  }

  closeForm() {
    this.dialogRef.close(true)
  }
}
