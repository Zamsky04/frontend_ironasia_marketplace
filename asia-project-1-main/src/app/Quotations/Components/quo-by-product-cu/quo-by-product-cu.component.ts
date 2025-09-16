import { Component, Inject, OnInit } from '@angular/core';
import { productlist } from '../../../MasterApps/Models/productlist';
import { producttypelist } from '../../../MasterApps/Models/producttypelist';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ServProductTypeService } from '../../../MasterApps/Services/serv-product-type.service';
import { ServLoginService } from '../../../login/Services/serv-login.service';
import { ServQuoService } from '../../Services/serv-quo.service';
import { QuotationDetail } from '../../Models/QuotationDetail';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-quo-by-product-cu',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatIconModule, ReactiveFormsModule, MatSelectModule, MatFormFieldModule,
    MatCheckboxModule, MatInputModule, FormsModule],
  templateUrl: './quo-by-product-cu.component.html',
  styleUrl: './quo-by-product-cu.component.css'
})
export class QuoByProductCuComponent implements OnInit{

  prodlist: productlist[] = [];
  prodtylist: producttypelist[] = [];
  selectedprod: number = 0
  selectedprodtype: number = 0;
  p_usr: string = "aaaaa";
  p_type: string = "aaaaa";
  p_quono:string ="aaaaa";
  p_no:string="aaaa";
  p_status:string="";
  p_reaseon:string="";
  quoNumber:string="aaaa";
  preview = '';
  preview2 = '';
  preview3 = '';
  preview4 = '';
  vtkn:any;
  vtknd:any;
  vusr:any;
  vusrd:any;
  file1: any = null;
  file2: any = null;
  file3: any = null;
  file4: any = null;
  selectedFile1: any = null;
  file1image?: File;
  file1img: string = "a";

  selectedFile2: any = null;
  file2image?: File;
  file2img: string = "a";

  selectedFile3: any = null;
  file3image?: File;
  file3img: string = "a";

  selectedFile4: any = null;
  file4image?: File;
  file4img: string = "a";
  files: File[] = []; 
  userid: string = 'USER09';
  bef_type: string = "aaaaa";
  qdtl: QuotationDetail[] = [];
  imageUrls: string[] = [];
  data: QuotationDetail = {
    ctqdCtqhId: "",
    ctqdId: "",
    ctqdProductCode: 0,
    ctqdProductName: "",
    ctqdProducttypeCode: 0,
    ctqdProducttypeName: "",
    ctqdProducttypePrice: 0,
    ctqdProducttypeQty: 0,
    ctqdProducttypeMinQty: 0,
    ctqdProducttypeMaxPrice: 0,
    ctqdProducttypeDesc: "",
    ctqdProductTypeSize: "",
    ctqdProductTypeSpec: "",
    ctqdProductTypeAlias: "",
    ctqdProdTypeImg1Filename: "",
    ctqdProdTypeImg1Filepath: "",
    ctqdProdTypeImg2Filename: "",
    ctqdProdTypeImg2Filepath: "",
    ctqdNewUsed: "",
    ctqdFlagAsuransi: "",
    ctqdAsuransiName: "",
    ctqdEkspedisi: "",
    ctqdStatus: "",
    ctqdReason: "",
    ctqdCreateBy: "",
    ctqdCreateDate:"" ,
    ctqdUpdateBy: "",
    ctqdUpdateDate: "",
    ctqdBestPrice: "",
    ctqdBestProduct: "",
    ctqdNewProduct: "",
    ctqdSale: "",
    ctqdReqno: "",
    ctqdProdTypeImg3Filename: "",
    ctqdProdTypeImg3Filepath: "",
    ctqdProdTypeImg4Filename: "",
    ctqdProdTypeImg4Filepath: "",
    ctqdNotes: "",
    ctqdDeliveryAddrId: 0
    };
  

  constructor( private formBuider: FormBuilder, private quoServ: ServQuoService, private dialogRef: MatDialogRef<QuoByProductCuComponent>,
        private route: ActivatedRoute, private masterserv: ServProductTypeService, private logserv:ServLoginService,
      @Inject(MAT_DIALOG_DATA) public dialogData: any) {
        this.p_quono =dialogData.p_quono;
        this.p_type=dialogData.p_type;
        this.userid=dialogData.p_usr;
        this.p_no=dialogData.p_no;
        this.p_status=dialogData.p_status;
        this.p_reaseon=dialogData.p_reason;
   
  }

  ngOnInit(): void {
     this.getProductList();
   // this.vusrd=localStorage.getItem('uscd');
   // this.vtknd=localStorage.getItem('tkn');
   // this.userid=this.logserv.decrypt(this.vusrd);
    this.vtkn='';
    this.bef_type=this.p_type;
   // console.log("URL:", this.route.url);
    /*this.route.params.subscribe(params => {
      this.p_type = params['param1'];
      this.p_reqno = params['param2'];
      this.p_no = params['param3'];
    });*/
    
    //alert('bbbbbb :' + this.p_type + " ---- " + this.p_quono+ " --- "+this.p_no);
   
   
      if (this.p_type === 'Update') {

   
      this.getQuotDtl(this.p_quono );
    }
  }

   closeForm() {
    this.dialogRef.close(true)
  }

  
  getProductList() {
      this.prodtylist = [];
      this.masterserv.getProductList().subscribe((res: productlist[]) => {
        this.prodlist = res;
      });
    }
  
    getProducttypeList(value: any) {
      this.prodtylist = [];
      this.masterserv.getProductTypeList(value).subscribe((res: producttypelist[]) => {
        this.prodtylist = res;
      });
    }

    changeproduct() {  
      this.prodtylist = [];  
      const selectedProductObject = this.prodlist.find(prod => prod.cmprCode === this.selectedprod);   
      this.getProducttypeList(this.selectedprod);  
       if (selectedProductObject) {    
          this.data.ctqdProductName = selectedProductObject.cmprName;
        } else {
          this.data.ctqdProductName = '';
        }
    }

  changeproducttype() {
  // Cari objek produk tipe yang dipilih
  const selectedProducttypeObject = this.prodtylist.find(prodtype => prodtype.cmprtCode === this.selectedprodtype);  
 
  if (selectedProducttypeObject) {
    this.data.ctqdProducttypeName = selectedProducttypeObject.cmprtTypeDesc;
  } else {
    // Jika tidak ditemukan, kosongkan saja
    this.data.ctqdProducttypeName = '';
  }
}

  getQuotDtl(req: string) {
        //alert("customer no :"+this.p_quono+"-------"+ this.p_no);
     // alert('cccccc :'+req+" --- "+ this.p_no);
      this.qdtl = [];
     
  this.quoServ.QuoDtlSingle( this.p_quono, this.p_no,  this.vtkn).subscribe((res: QuotationDetail[]) => {
        this.qdtl = res;
        this.getProductList();
  
        for (var j = 0; j < this.qdtl.length; j++) {
          this.selectedprod = this.qdtl[j].ctqdProductCode;
          this.getProducttypeList(this.selectedprod);
          this.data.ctqdCtqhId= this.qdtl[j].ctqdCtqhId,
          this.data.ctqdId= this.qdtl[j].ctqdId,
          this.selectedprod = this.qdtl[j].ctqdProductCode,
          this.data.ctqdProductName= this.qdtl[j].ctqdProductName,
          this.selectedprodtype = this.qdtl[j].ctqdProducttypeCode;
          this.data.ctqdProducttypeName= this.qdtl[j].ctqdProducttypeName,
          this.data.ctqdProducttypePrice= this.qdtl[j].ctqdProducttypePrice,
          this.data.ctqdProducttypeQty= this.qdtl[j].ctqdProducttypeQty,
          this.data.ctqdProducttypeMinQty= this.qdtl[j].ctqdProducttypeMinQty,
          this.data.ctqdProducttypeMaxPrice= this.qdtl[j].ctqdProducttypeMaxPrice,
          this.data.ctqdProducttypeDesc= this.qdtl[j].ctqdProducttypeDesc,
          this.data.ctqdProductTypeSize= this.qdtl[j].ctqdProductTypeSize,
          this.data.ctqdProductTypeSpec= this.qdtl[j].ctqdProductTypeSpec,
          this.data.ctqdProductTypeAlias= this.qdtl[j].ctqdProductTypeAlias,
          this.data.ctqdProdTypeImg1Filename= this.qdtl[j].ctqdProdTypeImg1Filename,
          this.data.ctqdProdTypeImg1Filepath= this.qdtl[j].ctqdProdTypeImg1Filepath,
          this.data.ctqdProdTypeImg2Filename= this.qdtl[j].ctqdProdTypeImg2Filename,
          this.data.ctqdProdTypeImg2Filepath= this.qdtl[j].ctqdProdTypeImg2Filepath,
          this.data.ctqdNewUsed= this.qdtl[j].ctqdNewUsed,
          this.data.ctqdFlagAsuransi= this.qdtl[j].ctqdFlagAsuransi,
          this.data.ctqdAsuransiName= this.qdtl[j].ctqdAsuransiName,
          this.data.ctqdEkspedisi= this.qdtl[j].ctqdEkspedisi,
          this.data.ctqdStatus= this.qdtl[j].ctqdStatus,
          this.data.ctqdReason= this.qdtl[j].ctqdReason,
          this.data.ctqdCreateBy= this.qdtl[j].ctqdCreateBy,
          this.data.ctqdCreateDate= this.qdtl[j].ctqdCreateDate,
          this.data.ctqdUpdateBy= this.qdtl[j].ctqdUpdateBy,
          this.data.ctqdUpdateDate= this.qdtl[j].ctqdUpdateDate,
          this.data.ctqdBestPrice= this.qdtl[j].ctqdBestPrice,
          this.data.ctqdBestProduct= this.qdtl[j].ctqdBestProduct,
          this.data.ctqdNewProduct= this.qdtl[j].ctqdNewProduct,
          this.data.ctqdSale= this.qdtl[j].ctqdSale,
          this.data.ctqdReqno= this.qdtl[j].ctqdReqno,
          this.data.ctqdProdTypeImg3Filename= this.qdtl[j].ctqdProdTypeImg3Filename,
          this.data.ctqdProdTypeImg3Filepath= this.qdtl[j].ctqdProdTypeImg3Filepath,
          this.data.ctqdProdTypeImg4Filename= this.qdtl[j].ctqdProdTypeImg4Filename,
          this.data.ctqdProdTypeImg4Filepath= this.qdtl[j].ctqdProdTypeImg4Filepath,
          this.data.ctqdNotes= this.qdtl[j].ctqdNotes,
          this.data.ctqdDeliveryAddrId= this.qdtl[j].ctqdDeliveryAddrId

       
          this.quoServ.getImagesquo(this.userid, this.data.ctqdCtqhId, this.data.ctqdId, this.userid, this.vtkn).subscribe(
            (data: string[]) => {
              this.imageUrls = data;
              if (data.length > 0) {
                this.preview = data[0];
                this.fetchImageAndConvertToFile1(this.preview);
              }
              if (data.length > 1) {
                this.preview2 = data[1];
                this.fetchImageAndConvertToFile2(this.preview2);
              };
              if (data.length > 2) {
                this.preview3 = data[2];
                this.fetchImageAndConvertToFile3(this.preview3);
              }
              if (data.length > 3) {
                this.preview4 = data[3];
                this.fetchImageAndConvertToFile4(this.preview4);
              }
            },
            (error) => {
              console.error('Error fetching images:', error);
            }
          );
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
  
          // Memisahkan file ke variabel terpisah
          if (this.files.length === 1) {
            this.selectedFile1 = this.files[0];
            this.file1=this.selectedFile1;
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
            this.file2=this.selectedFile2;
          }
        });
    }
  
    fetchImageAndConvertToFile3(imageUrl: string) {
      fetch(imageUrl)
        .then(res => res.blob())
        .then(blob => {
          const urlParts = imageUrl.split('/');
          const filename3=urlParts[urlParts.length - 1];
          this.file3img = filename3;
          const file = new File([blob], filename3, { type: 'image/jpeg' });
          this.files.push(file);
  
          // Memisahkan file ke variabel terpisah
          if (this.files.length === 1) {
            this.selectedFile3 = this.files[0];
            this.file3=this.selectedFile3;
          }
        });
    }
  
    fetchImageAndConvertToFile4(imageUrl: string) {
      fetch(imageUrl)
        .then(res => res.blob())
        .then(blob => {
          const urlParts = imageUrl.split('/');
          const filename4=urlParts[urlParts.length - 1];
          this.file4img = filename4;
          const file = new File([blob], filename4, { type: 'image/jpeg' });
          this.files.push(file);
  
          // Memisahkan file ke variabel terpisah
          if (this.files.length === 1) {
            this.selectedFile4 = this.files[0];
            this.file4=this.selectedFile4;
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
        case 2:
          this.preview2 = '';
          const cfile2 = event.target.files;
          const selectedFil2 = event.target.files;
          this.selectedFile2 = event.target.files[0] as File;
          if (selectedFil2) {
            const fil: File | null = selectedFil2.item(0);
            if (fil) {
              this.preview2 = '';
              this.file2image = fil;
              this.file2img = this.file2image.name;
              const reader = new FileReader();
  
              reader.onload = (e: any) => {
                console.log(e.target.result);
                this.preview2 = e.target.result;
              };
              reader.readAsDataURL(this.file2image);
            }
          }
          break;
        case 3:
          this.preview3 = '';
          const cfile3 = event.target.files;
          const selectedFil3 = event.target.files;
          this.selectedFile3 = event.target.files[0] as File;
          if (selectedFil3) {
            const fil: File | null = selectedFil3.item(0);
            if (fil) {
              this.preview3 = '';
              this.file3image = fil;
              this.file3img = this.file3image.name;
              const reader = new FileReader();
              reader.onload = (e: any) => {
                console.log(e.target.result);
                this.preview3 = e.target.result;
              };
              reader.readAsDataURL(this.file3image);
            }
          }
          break;
        case 4:
          this.preview4 = '';
          const cfile4 = event.target.files;
          const selectedFil4 = event.target.files;
          this.selectedFile4 = event.target.files[0] as File;
          if (selectedFil4) {
            const fil: File | null = selectedFil4.item(0);
            if (fil) {
              this.preview4 = '';
              this.file4image = fil;
              this.file4img = this.file4image.name;
              const reader = new FileReader();
  
              reader.onload = (e: any) => {
                console.log(e.target.result);
                this.preview4 = e.target.result;
              };
              reader.readAsDataURL(this.file4image);
            }
          }
          break;
       }
    }
    
    submitRequest() {
      
      console.log('Tombol submit ditekan!');
  console.log('Nilai this.selectedprod:', this.selectedprod);
  console.log('Nilai this.selectedprodtype:', this.selectedprodtype);

      if (!this.selectedprod || this.selectedprod === 0) {
        alert('Please select a Product first.');
        return; 
    }
    if (!this.selectedprodtype || this.selectedprodtype === 0) {
        alert('Please select a Product Type first.');
        return; 
    }
      this.data.ctqdProductCode = this.selectedprod;
      this.data.ctqdProducttypeCode = this.selectedprodtype;

    if (!this.selectedFile1 && !this.selectedFile2 && !this.selectedFile3 && !this.selectedFile4) {
      alert('You must upload at least one image.');
      return; 
    }

     /// alert("aaaaaaaaaaa :"+this.p_type+"---"+this.userid);
    
      if (this.p_type === 'Insert') {
      // alert('new');
        this.quoServ.createQuoWeb(this.userid, this.data, this.selectedFile1, this.selectedFile2, this.selectedFile3, this.selectedFile4)
          .subscribe(
            response => {
            
              this.quoNumber = response;
              alert('Quotation successfully created. The number is:'+ this.quoNumber);
              this.closeForm();
             
              // Tambahkan logika untuk menangani response sukses, misalnya:
              // - Reset form
              // - Tampilkan pesan sukses
              // - Redirect ke halaman lain
            },
            error => {
              console.error('Error :', error);
              // Tambahkan logika untuk menangani error, misalnya:
              // - Tampilkan pesan error
            }
          );
          this.p_type="Update";
          
      } else {
       // alert('update');
      
       if (this.bef_type ==='Insert'){
        
        this.data.ctqdCtqhId=this.quoNumber;
        
       }
        this.quoServ.UpdateQuoWeb(this.data.ctqdId, this.userid, this.data.ctqdCtqhId, this.data, this.selectedFile1, this.selectedFile2, this.selectedFile3, this.selectedFile4)
          .subscribe(
            response => {
              this.quoNumber = response;
              console.log('Quotation Updated');
             this.closeForm();
            
            },
            error => {
              console.error('Error :', error);
            
            }
          );
      }
    }
  
    delay(ms: number): Promise<void> {
      return new Promise(resolve => setTimeout(resolve, ms));
    }



}
