import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { QuotationHdr } from '../../Models/QuotationHdr';
import { ServQuoService } from '../../Services/serv-quo.service';
import { ActivatedRoute } from '@angular/router';
import { ServLoginService } from '../../../login/Services/serv-login.service';
import { ServProductTypeService } from '../../../MasterApps/Services/serv-product-type.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-quo-cu',
  imports: [CommonModule, MatTabsModule, MatIconModule, ReactiveFormsModule, MatSelectModule, MatFormFieldModule,
    MatCheckboxModule, MatInputModule, FormsModule,],
  standalone: true,
  templateUrl: './quo-cu.component.html',
  styleUrl: './quo-cu.component.css'
})
export class QuoCuComponent implements OnInit {
  vquhdr: QuotationHdr[] = [];
  p_usr: string = "";
  p_quono: string = "";
  p_type: string = "";
  p_status: string = "";
  p_reason:string ="";
  vtype: boolean = true;
  vQuoNo: string = "aaaa";
  vtkn: any;
  vtknd: any;
  vusr: any;
  vusrd: any;
  userid: string = 'USER09';
  ctqhNotesValue: string = '';
  forms: FormGroup;
  fileName1: string | null = null;
  fileName2: string | null = null;
  imagePreview1: string | ArrayBuffer | null = null;
  imagePreview2: string | ArrayBuffer | null = null;
  selectedFile1: any = null;
  file1image?: File;
  file1img: string = "a";
  files: File[] = [];
  file1: any = null;
  file2: any = null;

  selectedFile2: any = null;
  file2image?: File;
  file2img: string = "a";
  imageUrls: string[] = [];

  constructor(private _vquoserv: ServQuoService, private formBuider: FormBuilder, private dialogRef: MatDialogRef<QuoCuComponent>,
    private route: ActivatedRoute, private masterserv: ServProductTypeService, private logserv: ServLoginService,
  @Inject(MAT_DIALOG_DATA) public dialogData: any) {

    this.userid=dialogData.p_usr;
    this.p_quono=dialogData.p_quono;
    this.p_type=dialogData.p_type;
    this.p_status=dialogData.p_status;
    this.p_reason=dialogData.p_reason;

    this.forms = this.formBuider.group({
      ctqhId: '',
      ctqhDate: '',
      ctqhType: '',
      ctqhStatus: '',
      ctqhSendDate: '',
      ctqhCcustCusno: '',
      ctqhPic1Cusno: '',
      ctqhPic1Date: '',
      ctqhPic1Sts: '',
      ctqhPic2Cusno: '',
      ctqhPic2Date: '',
      ctqhPic2Sts: '',
      ctqhPic3Cusno: '',
      ctqhPic3Date: '',
      ctqhPic3Sts: '',
      ctqhCreateBy: '',
      ctqhCreateDate: '',
      ctqhUpdateBy: '',
      ctqhUpdateDate: '',
      ctqhNotes: ['', Validators.required],
      ctqhReason: '',
      ctqhDlvrAddrId: '',
      ctqhOrderId: '',
      ctqhOrderDate: '',
      ctqhUpdateByAdmin: '',
      ctqhUpdateDateAdmin: '',
      ctqhProductName: ['', Validators.required],
      ctqhQty: ''
    });
  }

  ngOnInit(): void {
   // this.vusrd = localStorage.getItem('uscd');
    //this.vtknd = localStorage.getItem('tkn');
    //this.userid = this.logserv.decrypt(this.vusrd);
    //this.vtkn = this.logserv.decrypt(this.vtknd);
    // alert("111111 :"+this.p_usr + " 111111 : "+this.p_quono+" 11111 : "+this.p_type );
    if (this.p_type === 'Update') {
      this.vtype = false
      this.forms.disable(); 
      this.getQuoByIdUser();
    }
   // alert("aaaaaaaaaaaaaaaaaa: "+this.p_status+" --- "+this.p_reason)
  };

  closeForm() {
    this.dialogRef.close(true)
  }

  getQuoByIdUser() {
    this.vquhdr = [];
    this._vquoserv.getQuoListByIdUser(this.userid, this.p_quono, this.vtkn).subscribe((res: QuotationHdr[]) => {
      this.vquhdr = res;
    
      for (let ct in this.vquhdr) {
        try {
          this.forms.setValue({
            ctqhId: this.vquhdr[ct].ctqhId,
            ctqhDate: this.vquhdr[ct].ctqhDate,
            ctqhType: this.vquhdr[ct].ctqhType,
            ctqhStatus: this.vquhdr[ct].ctqhStatus,
            ctqhSendDate: this.vquhdr[ct].ctqhSendDate,
            ctqhCcustCusno: this.vquhdr[ct].ctqhCcustCusno,
            ctqhPic1Cusno: this.vquhdr[ct].ctqhPic1Cusno,
            ctqhPic1Date: this.vquhdr[ct].ctqhPic1Date,
            ctqhPic1Sts: this.vquhdr[ct].ctqhPic1Sts,
            ctqhPic2Cusno: this.vquhdr[ct].ctqhPic2Cusno,
            ctqhPic2Date: this.vquhdr[ct].ctqhPic2Date,
            ctqhPic2Sts: this.vquhdr[ct].ctqhPic2Sts,
            ctqhPic3Cusno: this.vquhdr[ct].ctqhPic3Cusno,
            ctqhPic3Date: this.vquhdr[ct].ctqhPic3Date,
            ctqhPic3Sts: this.vquhdr[ct].ctqhPic3Sts,
            ctqhCreateBy: this.vquhdr[ct].ctqhCreateBy,
            ctqhCreateDate: this.vquhdr[ct].ctqhCreateDate,
            ctqhUpdateBy: this.vquhdr[ct].ctqhUpdateBy,
            ctqhUpdateDate: this.vquhdr[ct].ctqhUpdateDate,
            ctqhNotes: this.vquhdr[ct].ctqhNotes,
            ctqhReason: this.vquhdr[ct].ctqhReason,
            ctqhDlvrAddrId: this.vquhdr[ct].ctqhDlvrAddrId,
            ctqhOrderId: this.vquhdr[ct].ctqhOrderId,
            ctqhOrderDate: this.vquhdr[ct].ctqhOrderDate,
            ctqhUpdateByAdmin: this.vquhdr[ct].ctqhUpdateByAdmin,
            ctqhUpdateDateAdmin: this.vquhdr[ct].ctqhUpdateDateAdmin,
            ctqhProductName: this.vquhdr[ct].ctqhProductName,
            ctqhQty: this.vquhdr[ct].ctqhQty
          });

          this._vquoserv.getImagesquoHdr(this.userid, this.forms.get("ctqhId")?.value, this.userid, this.vtkn).subscribe(
            (data: string[]) => {
              this.imageUrls = data;
              if (data.length > 0) {
                this.imagePreview1 = data[0];
                this.fetchImageAndConvertToFile1(this.imagePreview1);
              }
              if (data.length > 1) {
                this.imagePreview2 = data[1];
                this.fetchImageAndConvertToFile2(this.imagePreview2);
              };
            },
            (error) => {
              console.error('Error fetching images:', error);
            }
          );

        }
        catch (err) {
          alert("error :" + err);
        }
      }
    });
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

        if (this.files.length === 1) {
          this.selectedFile2 = this.files[0];
          this.file2 = this.selectedFile2;
        }
      });
  }

  submitRequest() {
   const now = new Date();
    now.setSeconds(0, 0); 
    if (this.forms.invalid) {
    this.forms.markAllAsTouched(); 
    alert('Note Cannot be Empty');
    return; 
  }
    const dt = now.toISOString();
   // alert('insert : '+this.userid+"----"+ this.p_quono);
    if (this.p_type === 'Insert') {
      this.forms.patchValue({
        ctqhType: 'W',
        ctqhStatus: 'SQ',
        ctqhCcustCusno: this.userid,
        ctqhCreateBy: this.userid,
        ctqhCreateDate: dt,
        ctqhDate:dt
      });
      this._vquoserv.createQuoHdr(this.userid, this.forms.value, this.selectedFile1!, this.selectedFile2!)
        .subscribe(
          response => {

            this.vQuoNo = response;
            alert('Quotation successfully created. The number is:' + this.vQuoNo);
          },
          error => {
            console.error('Error :', error);
           
          }
        );
    
      this.closeForm();
    }


    if (this.p_type === 'Update') {
      this._vquoserv.createQuoHdr(this.userid, this.forms.value, this.selectedFile1!, this.selectedFile2!)
        .subscribe(
          response => {
            this.vQuoNo = response;
            console.log('update success:', this.vQuoNo);
            alert('Quotation Updated');
            this.closeForm();
           
          },
          error => {
            console.error('Error:', error);
           
          }
        );
      this.closeForm();
    }
  }

  onFileSelected1(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;

    if (fileList && fileList.length > 0) {
      if (this.p_type !== 'Insert') {
        return;
    }

      const file = fileList[0];
      this.selectedFile1 = file;
  
      if (!file.type.startsWith('image/')) {
        console.error('Please select an image file');
       
        this.fileName1 = 'Bukan gambar';
        this.imagePreview1 = null; 
        element.value = ''; 
        return; 
      }

      this.forms.patchValue({ image1: file });
      this.fileName1 = file.name;

      // --- TAMBAHKAN LOGIKA FileReader ---
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview1 = reader.result; 
      };
      reader.onerror = (error) => {
        console.error('FileReader error: ', error);
        this.imagePreview1 = null; 
      };
      reader.readAsDataURL(file); 
      // ------------------------------------

      console.log('File 1 selected:', file);
    } else {
      // Reset jika tidak ada file dipilih (misal, user klik cancel)
      this.forms.patchValue({ image1: null });
      this.fileName1 = null;
      this.imagePreview1 = null; // Reset preview
    }
  }

  onFileSelected2(event: Event): void {
    if (this.p_type !== 'Insert') {
        return;
    }

    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    // alert("bbbbbbbbbbbbbb")
    if (fileList && fileList.length > 0) {
      const file2 = fileList[0];
      this.selectedFile2 = file2;
      if (!file2.type.startsWith('image/')) {
        console.error('Please select an image file');
        //  this.forms.patchValue({ image2: null });
        this.fileName2 = 'Bukan gambar';
        this.imagePreview2 = null;
        element.value = '';
        return;
      }

      this.forms.patchValue({ image2: file2 });
      this.fileName2 = file2.name;

      // --- TAMBAHKAN LOGIKA FileReader ---
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview2 = reader.result; // Simpan Data URL
      };
      reader.onerror = (error) => {
        console.error('FileReader error: ', error);
        this.imagePreview2 = null;
      };
      reader.readAsDataURL(file2);
      // ------------------------------------

      console.log('File 2 selected:', file2);
    } else {
      this.forms.patchValue({ image2: null });
      this.fileName2 = null;
      this.imagePreview2 = null; // Reset preview
    }
  }

}
