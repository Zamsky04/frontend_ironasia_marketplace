import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, FormsModule, AbstractControl, ValidationErrors, Validators, FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CustGeneral } from '../../Models/CustGeneral';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatRadioModule } from '@angular/material/radio';
import { ServProductTypeService } from '../../../../MasterApps/Services/serv-product-type.service';
import { productlist } from '../../../../MasterApps/Models/productlist';
import { ServLoginService } from '../../../../login/Services/serv-login.service';
import { ImageResponse } from '../../Models/ImageResponse';
import { CustProfileServService } from '../../Services/cust-profile-serv.service';
@Component({
  selector: 'app-cust-profile',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [MatCardModule, MatToolbarModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, ReactiveFormsModule, MatButtonModule, CommonModule, MatSelectModule, MatTableModule,
    FormsModule, MatDatepickerModule, MatCheckboxModule, MatSortModule, MatPaginatorModule,
    MatNativeDateModule, MatIconModule, MatAutocompleteModule, MatTabsModule, MatRadioModule,
  ],
  templateUrl: './cust-profile.component.html',
  styleUrls: ['./cust-profile.component.css']
})
export class CustProfileComponent implements OnInit {

  p_usr: string = "aaaaa";
  p_reqno: any;
  p_type: string = "aaaaa";
  p_no: any;
  vusrnm: any = "";
  vusrurl: any = "";
  vusnm: any = "";
  vusurl: any = "";
  vtkn: any;
  vtknd: any;
  vusr: any;
  vusrd: any;
  custNo: any;
  preview = '';
  preview2 = '';
  preview3 = '';
  preview4 = '';
  //prodlist: productlist[] = [];
  // prodtylist: producttypelist[] = [];
  selectedprod: string = "";
  selectedprodtype: string = "";
  selectedFiles: File[] = [];
  file1: any = null;
  file2: any = null;
  file3: any = null;

  selectedFile1: any = null;
  file1image?: File;
  file1img: string = "a";

  selectedFile2: any = null;
  file2image?: File;
  file2img: string = "a";

  selectedFile3: any = null;
  file3image?: File;
  file3img: string = "a";

  form!: FormGroup;
  vprodlist: productlist[] = [];
  vpickbuss: string = "aaa";

  rdtl: CustGeneral[] = [];
  dataSource!: MatTableDataSource<any>;
  emailDisabled = true; // awalnya disable
  notlpDisabled = true; // awalnya disable

  imageUrls: string[] = [];
  files: File[] = []; // Array untuk menyimpan semua file
  modalImage: string | null = null;

  userid: string = 'USER09';
  data: CustGeneral = {
    ccustRegId: '',
    ccustNo: '',
    ccustType: '',
    ccustName: '',
    ccustAlias: '',
    ccustEmail: '',
    ccustPhone: '',
    ccustHandPhone: '',
    ccustPassword: '',
    ccustStatus: '',
    ccustAreaName: '',
    ccustNpwpNo: '',
    ccustNibNo: '',
    ccustPkbNo: '',
    ccustKtpNo: '',
    ccustGrade: '',
    ccustCreateBy: '',
    ccustCreateDate: '',
    ccustUpdateBay: '',
    ccustUpdateDate: '',
    ccustNeedApproval: 0,
    ccustNpwpPicRefNo: 0,
    ccustNpwpPicSeqNo: 0,
    ccustNibPicRefNo: 0,
    ccustNibPicSeqNo: 0,
    ccustPkpPicRefNo: 0,
    ccustPkpPicSeqNo: 0,
    ccustKtpPicRefNo: 0,
    ccustKtpPicSeqNo: 0,
    role: '',
    ccustFilename: '',
    ccustFilePath: '',
    ccustCorebussiness: '',
  };


  constructor(private reqServ: CustProfileServService, private fb: FormBuilder,
    private route: ActivatedRoute, private logserv: ServLoginService, private _prodserv: ServProductTypeService) {

  }

  closeForm() {
    // this.dialogRef.close(true)
  }

  ngOnInit(): void {
    console.log("URL:", this.route.url);
    this.GetUserToken();
    this.InisialisasiFormGroup();
    this.getProduct();
    this.getCustSingle();

    /*if (this.p_type === 'Update') {
      this.p_reqno = this.p_no;
      //alert('update coy' + this.p_reqno)
      this.getBannerSingle(this.p_reqno);
      this.form.get('cmbannId')?.disable();
    }*/
  }

  InisialisasiFormGroup() {
    this.form = this.fb.group({
      ccustRegId: [''],
      ccustNo: ['', Validators.required],
      ccustType: [''],
      ccustName: ['', Validators.required],
      ccustAlias: ['', Validators.required],
      ccustEmail: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      ccustPhone: [''],
      ccustHandPhone: [{ value: '', disabled: true }, [Validators.required]],
      ccustPassword: [''],
      ccustStatus: [''],
      ccustAreaName: [''],
      ccustNpwpNo: [''],
      ccustNibNo: [''],
      ccustPkbNo: [''],
      ccustKtpNo: [''],
      ccustGrade: [''],
      ccustCreateBy: [''],
      ccustCreateDate: [''],
      ccustUpdateBay: [''],
      ccustUpdateDate: [''],
      ccustNeedApproval: [0],
      ccustNpwpPicRefNo: [0],
      ccustNpwpPicSeqNo: [0],
      ccustNibPicRefNo: [0],
      ccustNibPicSeqNo: [0],
      ccustPkpPicRefNo: [0],
      ccustPkpPicSeqNo: [0],
      ccustKtpPicRefNo: [0],
      ccustKtpPicSeqNo: [0],
      role: [''],
      ccustFilename: [''],
      ccustFilePath: [''],
      ccustCorebussiness: [this.vpickbuss],
      // --- FormArray untuk Bisnis Inti ---
      bisnisInti: this.fb.array([]), // <-- PENTING: Definisikan di sini
      //
    });
    // alert('custprof')
  };

  GetUserToken() {
    /* this.vusrnm = sessionStorage.getItem('usnm');
     this.vusrd = sessionStorage.getItem('uscd');
     this.vtknd = sessionStorage.getItem('tkn');
     this.vusnm = this.logserv.decrypt(this.vusrnm);
     this.vusr = this.logserv.decrypt(this.vusrd);
     this.vtkn = this.logserv.decrypt(this.vtknd);*/

    this.vusrnm = localStorage.getItem('usnm');
    this.vusrurl = localStorage.getItem('usrimg');
    this.vusrd = localStorage.getItem('uscd');

    this.vusnm = this.vusrnm;
    this.vusurl = this.vusrurl;
    this.vusr = this.logserv.decrypt(this.vusrd);

    this.logserv.updatemyacc(this.vusnm);
    this.logserv.updatemyppc(this.vusurl);

    //this.custNo = '00035WB202505';
    //this.custNo = '0001';

  };

  get bisnisIntiControls(): AbstractControl[] {
    const control = this.form?.get('bisnisInti');
    return control instanceof FormArray ? control.controls : [];
  }


  getCustSingle() {
    // alert('singleeeee' + this.vusr);
    this.rdtl = [];

    this.reqServ.getListByCustNo(this.vusr, this.vtkn).subscribe(
      (res: CustGeneral[]) => {
        this.rdtl = res;

        if (this.rdtl.length > 0) {
          // Ambil data pertama
          this.data = { ...this.rdtl[0] };

          // Sinkronkan ke FormGroup
          this.form.patchValue(this.data);

          // === Sinkronisasi bisnisInti checkbox ===
          this._prodserv.getProductList().subscribe((prodRes: productlist[]) => {
            this.vprodlist = prodRes;

            const bisnisIntiArray = this.form.get('bisnisInti') as FormArray;
            bisnisIntiArray.clear();

            const selectedCodes = this.data.ccustCorebussiness?.split(',').map(code => code.trim());

            this.vprodlist.forEach(prod => {
              const isSelected = selectedCodes.includes(prod.cmprCode.toString());
              bisnisIntiArray.push(new FormControl(!!isSelected));
            });
          });

          // Ambil gambar
         // alert('gambarr: ' + this.data.ccustNo + '/' + this.data.ccustKtpNo);
          this.reqServ.getImagesSingle(this.data.ccustNo, this.data.ccustKtpNo).subscribe(
            (data: ImageResponse[]) => {
              if (data.length > 0 && data[0].images?.length > 0) {
                const images = data[0].images.map(img => img.itemImageSrc);
                this.imageUrls = images;

                if (images[0]) {
                  this.preview = images[0];
                  this.fetchImageAndConvertToFile1(this.preview);
                }
                if (images[1]) {
                  this.preview2 = images[1];
                  this.fetchImageAndConvertToFile2(this.preview2);
                }
                if (images[2]) {
                  this.preview3 = images[2];
                  this.fetchImageAndConvertToFile3(this.preview3);
                }
              }
            },
            (error: any) => {
              console.error('Error fetching images:', error);
            }
          );

        }
      },
      (error: any) => {
        console.error('Error fetching banner data:', error);
      }
    );
  }

  submitCustGen() {
    // 💡 Validasi Form
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      alert('Form tidak valid. Mohon lengkapi semua isian.');
      return;
    }

    // 💡 Sinkronisasi bisnisInti ke ccustCorebussiness
    this.getSelectedProductData();
    this.form.patchValue({
      ccustCorebussiness: this.vpickbuss.trim().replace(/,$/, '')
    });


    // 💡 Sinkronisasi form ke data
    Object.assign(this.data, this.form.value);

    //alert('userid :' + this.vusr);
    this.setcreateupdate();

    this.reqServ.UpdateCustgen(this.data.ccustRegId.toString(), this.vusr, this.data, this.selectedFile1, this.vtkn)
      .subscribe(
        (response: string) => {
          const cleanResponse = response?.trim().replace(/['"\n\r]/g, '').toLowerCase();

          if (typeof response === 'string' && cleanResponse.includes('submit')) {
            alert('Data berhasil diperbarui');
            this.ngOnInit();
          } else {
            alert('Respons tidak sesuai, data mungkin gagal diperbarui');
          }

          //this.requestNumber = response;
        },
        error => {
          console.error('Terjadi kesalahan saat update:', error);
          alert('Gagal memperbarui data');
        }
      );
  }



  fetchImageAndConvertToFile1(imageUrl: string) {
    fetch(imageUrl)
      .then(res => res.blob())
      .then(blob => {
        const urlParts = imageUrl.split('/');
        const filename1 = urlParts[urlParts.length - 1];
        this.file1img = filename1;
        const file = new File([blob], filename1, { type: 'image/jpeg' });
        this.files.push(file);

        // Memisahkan file ke variabel terpisah
        if (this.files.length === 1) {
          this.selectedFile1 = this.files[0];
          this.file1 = this.selectedFile1;
        }
      });
  }

  fetchImageAndConvertToFile2(imageUrl: string) {
    fetch(imageUrl)
      .then(res => res.blob())
      .then(blob => {
        const urlParts = imageUrl.split('/');
        const filename2 = urlParts[urlParts.length - 1];
        this.file2img = filename2;
        const file = new File([blob], filename2, { type: 'image/jpeg' });
        this.files.push(file);

        // Memisahkan file ke variabel terpisah
        if (this.files.length === 1) {
          this.selectedFile2 = this.files[0];
          this.file2 = this.selectedFile2;
        }
      });
  }

  fetchImageAndConvertToFile3(imageUrl: string) {
    fetch(imageUrl)
      .then(res => res.blob())
      .then(blob => {
        const urlParts = imageUrl.split('/');
        const filename3 = urlParts[urlParts.length - 1];
        this.file3img = filename3;
        const file = new File([blob], filename3, { type: 'image/jpeg' });
        this.files.push(file);

        // Memisahkan file ke variabel terpisah
        if (this.files.length === 1) {
          this.selectedFile3 = this.files[0];
          this.file3 = this.selectedFile3;
        }
      });
  }

  onFileSelected(event: any, fileNumber: number) {
    switch (fileNumber) {
      case 1:
        this.preview = '';
        const cfile1 = event.target.files;
        const selectedFil1 = event.target.files;
        this.selectedFile1 = event.target.files[0] as File;
        if (selectedFil1) {
          const fil: File | null = selectedFil1.item(0);
          if (fil) {
            this.preview = '';
            this.file1image = fil;
            this.file1img = this.file1image.name;
            const reader = new FileReader();

            reader.onload = (e: any) => {
              console.log(e.target.result);
              this.preview = e.target.result;
            };

            reader.readAsDataURL(this.file1image);
          }
        }
        break;
    }
  }

  //tambahan ceklis
  getProduct() {
    if (!this.form) { return; }
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

  // --- Method createBisnisIntiControls (sudah benar) ---
  createBisnisIntiControls() {
    if (!this.form || !this.form.get('bisnisInti')) { return; }
    const bisnisIntiArray = this.form.get('bisnisInti') as FormArray;
    if (bisnisIntiArray instanceof FormArray) {
      bisnisIntiArray.clear();
      this.vprodlist.forEach(() => bisnisIntiArray.push(this.fb.control(false)));
    }
  }

  getSelectedProductData(): productlist[] {
    this.vpickbuss = "";
    const selectedProducts: productlist[] = [];
    if (!this.form || !this.form.get('bisnisInti')) { return []; }
    const bisnisIntiArrayValue = this.form.get('bisnisInti')?.value as boolean[];
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

  toggleEmailEdit() {
    const emailControl = this.form.get('ccustEmail');
    emailControl?.disabled ? emailControl.enable() : emailControl?.disable();
  }

  toggleHpEdit() {
    const TlpControl = this.form.get('ccustHandPhone');
    TlpControl?.disabled ? TlpControl.enable() : TlpControl?.disable();
  }

  //versi jika ada validasi
  /*toggleEmailEdit() {
    const emailControl = this.form.get('ccustEmail');
    if (!emailControl) return;
  
    if (window.confirm('Apakah Anda yakin akan merubah email?')) {
      emailControl.disabled ? emailControl.enable() : emailControl.disable();
    }
  }*/


  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  setcreateupdate() {
    const sysdate = new Date().toISOString(); // Format ISO string: 'YYYY-MM-DDTHH:mm:ss.sssZ'

    this.data.ccustUpdateBay = this.vusr;
    this.data.ccustUpdateDate = sysdate;

  }

  openModal(imageSrc: string) {
    this.modalImage = imageSrc;
  }
  
}
