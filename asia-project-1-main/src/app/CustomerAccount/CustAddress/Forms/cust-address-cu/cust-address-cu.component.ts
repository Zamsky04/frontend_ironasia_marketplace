import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CustAddressServService } from '../../Services/cust-address-serv.service';
import { ActivatedRoute } from '@angular/router';
import { CustAddress } from '../../Models/CustAddress';
import { ServLoginService } from '../../../../login/Services/serv-login.service';
import { citymdl } from '../../../../Registration/Models/citymdl';
import { kecamatanmdl } from '../../../../Registration/Models/kecamatanmdl';
import { kelurahanmdl } from '../../../../Registration/Models/kelurahanmdl';
import { provincemdl } from '../../../../Registration/Models/provincemdl';

@Component({
  selector: 'app-cust-address-cu',
  standalone: true,
  imports: [MatCardModule, MatToolbarModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, ReactiveFormsModule, MatButtonModule, CommonModule, MatSelectModule, MatTableModule,
    FormsModule, MatDatepickerModule, MatCheckboxModule, MatSortModule, MatPaginatorModule,
    MatNativeDateModule, MatIconModule, MatAutocompleteModule, MatTabsModule
  ],
  templateUrl: './cust-address-cu.component.html',
  styleUrls: ['./cust-address-cu.component.css']
})
export class CustAddressCUComponent implements OnInit {

  p_usr: string = "aaaaa";
  p_reqno: string = "aaaaa";
  p_type: string = "aaaaa";
  p_no: any;
  p_custno: string = "aaaaa";
  vusrnm: any = "";
  vusrurl: any = "";
  vusnm: any = "";
  vusurl: any = "";
  vtkn: any;
  vtknd: any;
  vusr: any;
  vusrd: any;
  preview = '';
  preview2 = '';
  preview3 = '';
  preview4 = '';
  coreTransRequestEcDtl: CustAddress[] = [];
  //prodlist: productlist[] = [];
  // prodtylist: producttypelist[] = [];
  selectedprod: string = "";
  selectedprodtype: string = "";
  selectedFiles: File[] = [];

  selectedFile1: any = null;
  file1image?: File;
  file1img: string = "a";

  provlist: provincemdl[] = [];
  citylist: citymdl[] = [];
  keclist: kecamatanmdl[] = [];
  kellist: kelurahanmdl[] = [];
  selectedprov: string = 'a';
  selectedcity: string = 'a';
  selectedkec: string = 'a';
  selectedkel: string = 'a';
  p_provcode: string = '';
  p_citycode: string = '';
  p_keccode: string = '';

  form: FormGroup = new FormGroup({});
  showPassword: boolean = false;

  rdtl: CustAddress[] = [];
  dataSource!: MatTableDataSource<any>;

  userid: string = 'USER09';
  data: CustAddress = {
    ccaddrId: 0,
    ccaddrCustNo: "",
    ccaddrType: "",
    ccaddrAddress: "",
    ccaddrRt: "",
    ccaddrRw: "",
    ccaddrProvCode: "",
    ccaddrCityCode: "",
    ccaddrKecCode: "",
    ccaddrKelCode: "",
    ccaddrZipCode: "",
    ccaddrLongLat: "",
    ccaddrArea: "",
    ccpAddrCreatedBy: "",
    ccAddrCreateDate: "",
    ccAddrUpdateBay: "",
    ccAddrUpdateDate: ""
  };

  imageUrls: string[] = [];


  file1: any = null;
  files: File[] = []; // Array untuk menyimpan semua file
  requestNumber: string = '';



  constructor(private reqServ: CustAddressServService, private fb: FormBuilder,
    private route: ActivatedRoute, private logserv: ServLoginService, private dialogRef: MatDialogRef<CustAddressCUComponent>) {

  }

  closeForm() {
    this.dialogRef.close(true)
  }

  ngOnInit(): void {
    console.log("URL:", this.route.url);

    this.GetUserToken();
    this.InisialisasiFormGroup();
    this.getprovince(); // Muat list provinsi
    //alert('custno: '+this.p_custno);

    if (this.p_type === 'Insert') {
      this.data.ccaddrCustNo = this.p_custno;
    }

    if (this.p_type === 'Update') {
      this.getProductSingle(); // Ambil data karyawan
    }
  }

  InisialisasiFormGroup() {
    // 💡 Inisialisasi FormGroup lebih awal
    this.form = this.fb.group({
    ccaddrId: [0], // biasanya tidak perlu diisi manual
    ccaddrCustNo: [''],
    ccaddrType: [''],
    ccaddrAddress: ['', Validators.required],
    ccaddrRt: ['',Validators.required],
    ccaddrRw: ['',Validators.required],
    ccaddrProvCode: ['', Validators.required],
    ccaddrCityCode: ['', Validators.required],
    ccaddrKecCode: ['', Validators.required],
    ccaddrKelCode: ['', Validators.required],
    ccaddrZipCode: ['', [
      Validators.required,
      Validators.pattern(/^\d{5}$/) // validasi kode pos 5 digit
    ]],
    ccaddrLongLat: [''], // bisa tambahkan validasi koordinat jika perlu
    ccaddrArea: [''],
    ccpAddrCreatedBy: [''],
    ccAddrCreateDate: [''], // bisa gunakan default: new Date().toISOString()
    ccAddrUpdateBay: [''],
    ccAddrUpdateDate: ['']
  });
  };

  GetUserToken() {
    this.vusrnm=localStorage.getItem('usnm');
    this.vusrurl=localStorage.getItem('usrimg');
    this.vusrd=localStorage.getItem('uscd');
   
    this.vusnm=this.vusrnm;
    this.vusurl=this.vusrurl;    
    this.vusr=this.logserv.decrypt(this.vusrd);

    this.logserv.updatemyacc(this.vusnm);
    this.logserv.updatemyppc(this.vusurl);

    //alert('getusertoken: '+this.vusr+'/'+this.vusnm+'/'+this.vtkn);

  };

  changeprov(value: any) {
    //alert('chageprov');
    this.citylist = [];
    this.keclist = [];
    this.kellist = [];
    this.data.ccaddrProvCode = value;
    this.selectedprov = value;
    this.getcity(this.selectedprov);
    //alert('provcode: ' + this.data.cmeEmplProvCode)
  }

  getprovince() {
    //alert('getprovinsi');
    this.provlist = [];
    this.reqServ.getProvinceALL().subscribe((res: provincemdl[]) => {
      this.provlist = res;
      console.log(this.provlist.length);
    });
  }

  changecity(value: any) {
    this.keclist = [];
    this.kellist = [];
    this.selectedcity = value;
    this.data.ccaddrCityCode = value;
    this.getkecamatan(this.selectedcity);
  }

  changekecamatan(value: any) {
    this.kellist = [];
    this.selectedkec = value;
    this.data.ccaddrKecCode = value;
    this.getkelurahan(this.selectedkec);
    // alert('keccode: ' + this.selectedkec);
  }

  getcity(ct: string) {
    this.citylist = [];
    this.reqServ.getcitybyprovALL(ct).subscribe((res: citymdl[]) => {
      this.citylist = res;
    });
  }

  changekelurahan(value: any) {
    this.selectedkel = value;
    this.data.ccaddrKelCode = value;
  }

  getkecamatan(kc: string) {
    this.keclist = [];
    this.reqServ.getKecbyCityALL(kc).subscribe((res: kecamatanmdl[]) => {
      this.keclist = res;
    });
  }

  getkelurahan(kl: string) {
    this.kellist = [];
    this.reqServ.getKelbyKecALL(kl).subscribe((res: kelurahanmdl[]) => {
      this.kellist = res;
    });
  }


  getProductSingle() {
    this.rdtl = [];

    this.reqServ.getAddrSingle(this.p_no,this.p_custno, this.vtkn).subscribe((res: CustAddress[]) => {
      this.rdtl = res;

      if (this.rdtl.length > 0) {
        this.data = { ...this.rdtl[0] }; // Assign langsung ke objek

        // Panggil dropdown berdasarkan kode yang sudah didapat
        this.getcity(this.data.ccaddrProvCode);
        this.getkecamatan(this.data.ccaddrCityCode);
        this.getkelurahan(this.data.ccaddrKecCode);

        // Sinkronkan ke FormGroup
          this.form.patchValue(this.data);

      }
    });
  }


  submitProducts() {
    // 💡 Validasi Form
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      alert('Form tidak valid. Mohon lengkapi semua isian.');
      return;
    }

    // 💡 Sinkronisasi form ke data
    Object.assign(this.data, this.form.value);

    this.setcreateupdate();

    // 💡 Format tanggal
    this.data.ccAddrCreateDate = this.formatDateLocal(new Date());

    this.reqServ.SaveUpdateAddr(this.data, this.vtkn)
      .subscribe(
        (response: string) => {
          const cleanResponse = response?.trim().replace(/['"\n\r]/g, '').toLowerCase();

          if (typeof response === 'string' && cleanResponse.includes('submit')) {
            alert('Data berhasil disimpan');
          } else {
            alert('Respons tidak sesuai, data mungkin gagal disimpan');
          }

          //this.requestNumber = response;
        },
        error => {
          console.error('Terjadi kesalahan saat insert:', error);
          alert('Gagal menyimpan data');
        }
      );
    this.closeForm();
  }


  formatDateLocal(date: any): string {
    if (!(date instanceof Date)) return date;

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }


  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  specialCharValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return /[@$!%*?&]/.test(control.value) ? null : { noSpecialChar: true };
    };
  }

  numberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return /\d/.test(control.value) ? null : { noNumber: true };
    };
  }

  parseDate(value: string): Date | null {
    if (!value) return null;

    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? null : parsed;
  }


  setcreateupdate() {
    const sysdate = new Date().toISOString(); // Format ISO string: 'YYYY-MM-DDTHH:mm:ss.sssZ'

    if (this.p_type === 'Insert') {
      this.data.ccpAddrCreatedBy = this.vusr;
      this.data.ccAddrCreateDate = sysdate;
      this.data.ccaddrCustNo = this.p_custno;
      //tambahan sementara di harcode untuk uplevel dan subuplevel
    } else {
      this.data.ccAddrUpdateBay = this.vusr;
      this.data.ccAddrUpdateDate = sysdate;
    }


  }

  //option CustType
  CustTypeOptions = [
    { label: 'Web', value: 'W' },
    { label: 'Mobile', value: 'M' }
  ];


}
