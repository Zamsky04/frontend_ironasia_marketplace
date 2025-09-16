import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { RequestDtl } from '../../Models/RequestDtl';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { productlist } from '../../../../MasterApps/Models/productlist';
import { producttypelist } from '../../../../MasterApps/Models/producttypelist';
import { ServProductTypeService } from '../../../../MasterApps/Services/serv-product-type.service';
import { ServLoginService } from '../../../../login/Services/serv-login.service';
import { ServRequestsService } from '../../Services/serv-requests.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-req-cu',
  imports: [CommonModule, MatTabsModule, MatIconModule, ReactiveFormsModule, MatSelectModule, MatFormFieldModule,
    MatCheckboxModule, MatInputModule, FormsModule, MatButtonModule],
  standalone: true,
  templateUrl: './req-cu.component.html',
  styleUrl: './req-cu.component.css'
})
export class ReqCuComponent implements OnInit {
  p_usr: string = "aaaaa";
  p_reqno: string = "aaaaa";
  p_type: string = "aaaaa";
  bef_type: string = "aaaaa";
  p_no: string = "aaaaa";
  preview = '';
  preview2 = '';
  preview3 = '';
  preview4 = '';
  coreTransRequestEcDtl: RequestDtl[] = [];
  prodlist: productlist[] = [];
  prodtylist: producttypelist[] = [];
  selectedprod: string = "";
  selectedprodtype: string = "";
  selectedFiles: File[] = [];

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

  vtkn: any;
  vtknd: any;
  vusr: any;
  vusrd: any;
  vtop: boolean = false;
  vnew: boolean = false;

  rdtl: RequestDtl[] = [];
  dataSource: MatTableDataSource<RequestDtl> = new MatTableDataSource();

  userid: string = 'USER09';
  data: RequestDtl = {
    ctecdCtechId: "",
    ctecdId: "",
    ctecdProductCode: "",
    ctecdProductName: "",
    ctecdProducttypeCode: "",
    ctecdProducttypeName: "",
    ctecdProducttypeStockQty: 0,
    ctecdProducttypeMinQty: 0,
    ctecdProducttypePrice: 0,
    ctecdProducttypeRangeQty1: 0,
    ctecdProducttypeRangePrice1: 0,
    ctecdProducttypeRangeQty2: 0,
    ctecdProducttypeRangePrice2: 0,
    ctecdProducttypeDesc: "",
    ctecdProductTypeSize: "",
    ctecdProductTypeSpec: "",
    ctecdProductTypeAlias: "",
    ctecdProdTypeImg1Filename: "",
    ctecdProdTypeImg1Filepath: "",
    ctecdProdTypeImg2Filename: "",
    ctecdProdTypeImg2Filepath: "",
    ctecdProdTypeImg3Filename: "",
    ctecdProdTypeImg3Filepath: "",
    ctecdProdTypeImg4Filename: "",
    ctecdProdTypeImg4Filepath: "",
    ctecdNewUsed: "",
    ctecdStatus: "",
    ctecdReason: "",
    ctecdCreateBy: "",
    ctecdCreateDate: "",
    ctecdUpdateBy: "",
    ctecdUpdateDate: "",
    ctecdBestPrice: "",
    ctecdBestProduct: "",
    ctecdNewProduct: "",
    ctecdSale: "",
    ctecdImg1CtpicRefNo: "",
    ctecdImg1CtpicSeqNo: "",
    ctecdImg2CtpicRefNo: "",
    ctecdImg2CtpicSeqNo: "",
    ctecdImg3CtpicRefNo: "",
    ctecdImg3CtpicSeqNo: "",
    ctecdImg4CtpicRefNo: "",
    ctecdImg4CtpicSeqNo: ""
  };

  imageUrls: string[] = [];


  file1: any = null;
  file2: any = null;
  file3: any = null;
  file4: any = null;
  files: File[] = []; // Array untuk menyimpan semua file
  requestNumber: string = '';

  constructor(private reqServ: ServRequestsService, private formBuider: FormBuilder, private dialogRef: MatDialogRef<ReqCuComponent>,
    private route: ActivatedRoute, private masterserv: ServProductTypeService, private logserv: ServLoginService,
    private cdr: ChangeDetectorRef, @Inject(MAT_DIALOG_DATA) public dialogData: any) {
    this.userid = dialogData.usr;
    this.p_reqno = dialogData.reqno;
    this.p_type = dialogData.type;
    this.p_no = dialogData.no;
    this.dataSource = new MatTableDataSource();
  }


  ngOnInit(): void {   
    this.getProductList();    
    if (this.p_type === 'Update') {
      if (this.p_reqno && this.p_no && this.p_type) {
        this.getRequestDtl(this.p_reqno);
      } else {
        console.error("Data tidak lengkap untuk memanggil API!", {
          reqno: this.p_reqno
        });
      }
    }
  }

  changeproduct() {
    this.prodtylist = [];

    this.getProducttypeList(this.selectedprod);

    const selectedProductObject = this.prodlist.find(prod => prod.cmprCode === Number(this.selectedprod));

    this.getProducttypeList(this.selectedprod);
    if (selectedProductObject) {
      this.data.ctecdProductName = selectedProductObject.cmprName;
    } else {
      // ...jika tidak ada yang dipilih, kosongkan field manual.
      this.data.ctecdProductName = '';
    }

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

changeproducttype() {
  // Tambahkan console.log untuk melihat nilai dan tipenya (untuk debugging)
  console.log('Nilai terpilih:', this.selectedprodtype, 'Tipe:', typeof this.selectedprodtype);

  const selectedProducttypeObject = this.prodtylist.find(prodty => 
    // UBAH KEDUA SISI MENJADI STRING SEBELUM MEMBANDINGKAN
    String(prodty.cmprtCode) === String(this.selectedprodtype)
  );

  if (selectedProducttypeObject) {
    console.log('Objek ditemukan:', selectedProducttypeObject);
    // Update field nama manual berdasarkan pilihan
    this.data.ctecdProducttypeName = selectedProducttypeObject.cmprtTypeDesc;
  } else {
    console.warn('Objek TIDAK ditemukan. Periksa kembali logika perbandingan.');
    this.data.ctecdProducttypeName = '';
  }
}

  getRequestDtl(req: string) {
    //  alert("customer no :"+this.custcd);
    // alert('cccccc :'+req+" --- "+ this.p_no);
    this.rdtl = [];

    this.reqServ.getReqEcByIdNo(req, this.p_no, this.vusr, this.vtkn).subscribe((res: RequestDtl[]) => {
      this.rdtl = res;
      this.getProductList();

      for (var j = 0; j < this.rdtl.length; j++) {
        if (this.rdtl[j].ctecdSale == "Y") {
          this.vtop = true;
        } else {
          this.vtop = false
        }

        if (this.rdtl[j].ctecdNewProduct == "Y") {
          this.vnew = true;
        } else {
          this.vnew = false
        }
        this.selectedprod = this.rdtl[j].ctecdProductCode;
        this.getProducttypeList(this.selectedprod);
        this.selectedprodtype = this.rdtl[j].ctecdProducttypeCode;
        this.data.ctecdCtechId = this.rdtl[j].ctecdCtechId;
        this.data.ctecdId = this.rdtl[j].ctecdId;
        this.data.ctecdProductCode = this.rdtl[j].ctecdProductCode;
        this.data.ctecdProducttypeCode = this.rdtl[j].ctecdProducttypeCode;
        this.data.ctecdProductName = this.rdtl[j].ctecdProductName;
        this.data.ctecdProducttypeName = this.rdtl[j].ctecdProducttypeName;
        this.data.ctecdProductTypeAlias = this.rdtl[j].ctecdProductTypeAlias;
        this.data.ctecdProducttypeStockQty = this.rdtl[j].ctecdProducttypeStockQty;
        this.data.ctecdProducttypePrice = this.rdtl[j].ctecdProducttypePrice;
        this.data.ctecdProducttypeMinQty = this.rdtl[j].ctecdProducttypeMinQty;
        this.data.ctecdProductTypeSize = this.rdtl[j].ctecdProductTypeSize;
        this.data.ctecdProductTypeSpec = this.rdtl[j].ctecdProductTypeSpec;
        this.data.ctecdProducttypeDesc = this.rdtl[j].ctecdProducttypeDesc;
        this.data.ctecdProdTypeImg1Filename = this.rdtl[j].ctecdProdTypeImg1Filename;
        this.data.ctecdProdTypeImg2Filename = this.rdtl[j].ctecdProdTypeImg2Filename;
        this.data.ctecdProdTypeImg3Filename = this.rdtl[j].ctecdProdTypeImg3Filename;
        this.data.ctecdProdTypeImg4Filename = this.rdtl[j].ctecdProdTypeImg4Filename;
        this.data.ctecdProdTypeImg1Filepath = this.rdtl[j].ctecdProdTypeImg1Filepath;
        this.data.ctecdProdTypeImg2Filepath = this.rdtl[j].ctecdProdTypeImg2Filepath;
        this.data.ctecdProdTypeImg3Filepath = this.rdtl[j].ctecdProdTypeImg3Filepath;
        this.data.ctecdProdTypeImg4Filepath = this.rdtl[j].ctecdProdTypeImg4Filepath;
        //  alert("eeeee :"+this.data.ctecdCtechId+" --- "+this.data.ctecdId);
        this.reqServ.getImages(this.userid, this.data.ctecdCtechId, this.data.ctecdId, this.userid, this.vtkn).subscribe(
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

  fetchImageAndConvertToFile4(imageUrl: string) {
    fetch(imageUrl)
      .then(res => res.blob())
      .then(blob => {
        const urlParts = imageUrl.split('/');
        const filename4 = urlParts[urlParts.length - 1];
        this.file4img = filename4;
        const file = new File([blob], filename4, { type: 'image/jpeg' });
        this.files.push(file);

        // Memisahkan file ke variabel terpisah
        if (this.files.length === 1) {
          this.selectedFile4 = this.files[0];
          this.file4 = this.selectedFile4;
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
    this.data.ctecdProductCode = this.selectedprod;
    this.data.ctecdProducttypeCode = this.selectedprodtype;

    if (this.vnew) {
      this.data.ctecdNewProduct = "Y"
    } else {
      this.data.ctecdBestProduct = "N"
    }

    if (this.vtop) {
      this.data.ctecdSale = "Y"
    } else {
      this.data.ctecdSale = "N"
    }
//alert('p_type ='+this.p_type)
    if (this.p_type == 'Insert') {
      // alert('new');
      this.reqServ.createReqWeb(this.userid, this.data, this.selectedFile1, this.selectedFile2, this.selectedFile3, this.selectedFile4)
        .subscribe(
          response => {

            this.requestNumber = response;
            console.log('Request successfully created. The number is:', this.requestNumber);


            // Tambahkan logika untuk menangani response sukses, misalnya:
            // - Reset form
            // - Tampilkan pesan sukses
            // - Redirect ke halaman lain
          },
          error => {
            console.error('Terjadi kesalahan:', error);
            // Tambahkan logika untuk menangani error, misalnya:
            // - Tampilkan pesan error
          }
        );
      this.p_type = "Update";

    } else {
      // alert('update');

      if (this.bef_type === 'Insert') {

        this.data.ctecdCtechId = this.requestNumber;

      }
      this.reqServ.UpdateReqWeb(this.data.ctecdId, this.userid, this.data.ctecdCtechId, this.data, this.selectedFile1, this.selectedFile2, this.selectedFile3, this.selectedFile4)
        .subscribe(
          response => {
            this.requestNumber = response;
            console.log('Request successfully created. The number is:', this.requestNumber);
            // Tambahkan logika untuk menangani response sukses, misalnya:
            // - Reset form
            // - Tampilkan pesan sukses
            // - Redirect ke halaman lain
          },
          error => {
            console.error('Terjadi kesalahan:', error);
            // Tambahkan logika untuk menangani error, misalnya:
            // - Tampilkan pesan error
          }
        );
    }
    //  this.dialogRef.close(true)
    this.closeDialog();
  }

  closeDialog() {
    this.dialogRef.close(true);
  }

  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


}
