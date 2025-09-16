import { ChangeDetectorRef, Component,  Inject,  OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder,  FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute} from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { productlist } from '../../../../MasterApps/Models/productlist';
import { producttypelist } from '../../../../MasterApps/Models/producttypelist';
import { ServProductTypeService } from '../../../../MasterApps/Services/serv-product-type.service';
import { ServLoginService } from '../../../../login/Services/serv-login.service';
import { ReqCuComponent } from '../req-cu/req-cu.component';
import { RequestDtl } from '../../Models/RequestDtl';
import { requestlistupd } from '../../Models/requestlistupd';
import { ServRequestsService } from '../../Services/serv-requests.service';
import { DTORequestList } from '../../Models/DTORequestList';
import { ReqListComponent } from '../req-list/req-list.component';
import { forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-req-update-list',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatIconModule, ReactiveFormsModule, MatSelectModule, MatFormFieldModule,
    MatCheckboxModule, MatInputModule, FormsModule, MatDialogModule],
  templateUrl: './req-update-list.component.html',
  styleUrl: './req-update-list.component.css'
})
export class ReqUpdateListComponent  implements OnInit {
  p_usr: string = "aaaaa";
  p_reqno: string = "aaaaa";
  p_type: string = "aaaaa";
  p_status: string = "aaaaa";
  
  file1img: string = "a"; 
  file2img: string = "a";  
  file3img: string = "a";  
  file4img: string = "a";

  vtkn:any;
  vtknd:any;
  vusr:any;
  vusrd:any;
  vtop:boolean=false;
  vnew:boolean=false; 

  prodlist: productlist[] = [];
  prodtylist: producttypelist[] = [];
  rdtl: RequestDtl[] = [];
  userid: string = 'USER09';
  imageUrls: string[] = []; 
  sentresult:string="aaaa"; 
  productName: string = "ccc"; 
  producttype: string = "aaaa";
  data: requestlistupd[] = [];
  requestList: DTORequestList[]=[];
  isLoading: boolean = false;


  constructor(private reqServ: ServRequestsService, private formBuider: FormBuilder, private dialog:MatDialog,
    private route: ActivatedRoute, private masterserv: ServProductTypeService, private logserv:ServLoginService,
    private dialogRef: MatDialogRef<ReqListComponent>,  @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private cdr: ChangeDetectorRef ) {
     this.userid = dialogData.usr;
     this.p_reqno = dialogData.reqno;
     this.p_type = dialogData.type;
     this.p_status = dialogData.status;
     
  }

 ngOnInit(): void {

  this.vtkn = 'tkn';
   this.isLoading = true;

  if (this.p_reqno && this.p_usr && this.vtkn) {
    this.getRequestList(this.p_reqno, this.userid, this.vtkn);
  } else {
    console.error("Data tidak lengkap untuk memanggil API!", { 
        reqno: this.p_reqno, 
        user: this.p_usr, 
        token: this.vtkn 
    });
  }
}

 private initializeUser(): void {
        this.vusrd = localStorage.getItem('uscd');
           
        this.vusr = this.logserv.decrypt(this.vusrd);

    }

// GANTI SELURUH FUNGSI getRequestList ANDA DENGAN INI
getRequestList(req: string, user: string, token: string) { 
 
  this.requestList = [];
  
  console.log('Memanggil API getReqList dengan:', { req, user, token });

  this.reqServ.getReqList(req, user, token).subscribe((res: DTORequestList[]) => {
    this.requestList = res; // Data diisi
    
    // BERITAHU ANGULAR UNTUK SEGERA REFRESH TAMPILAN
    this.cdr.detectChanges(); 

    if (res.length === 0) {
      console.warn(`Tidak ada data untuk request no: ${req} dan user: ${user}`);
    }
  }, error => {
    console.error('Error saat memanggil getReqList:', error);
    // Jika ada error, kita juga perlu refresh untuk menampilkan pesan error (jika ada)
    this.cdr.detectChanges();
  });
}

  SentRequest(){
    this.reqServ.callSentRequest(this.vusr, this.p_reqno, "macaddress").subscribe((res: string) => {
      this.sentresult = res;
     // alert (this.sentresult);
       this.closeDialog();
    });  
  }

  getRequestDtl(req: string) {
  this.reqServ.getReqEcById(req, this.vusr, this.vtkn).pipe(
    switchMap((res: RequestDtl[]) => {
      this.rdtl = res;
      if (!res || res.length === 0) {
        // If there are no details, return an empty array
        return of([]); 
      }

      // Create an array of observables for fetching images for each detail item
      const imageObservables = res.map(detailItem => 
        this.reqServ.getImages(
          this.userid, 
          detailItem.ctecdCtechId, 
          detailItem.ctecdId.toString(), 
          this.vusr, 
          this.vtkn
        ).pipe(
          map(imageUrls => ({ // Map the result to include the original detail and the new image URLs
            ...detailItem, // Copy all properties from the detail item
            imageUrls: imageUrls // Add the fetched image URLs
          }))
        )
      );
      
      // forkJoin will run all image observables in parallel and emit a single value (an array of results) when all are complete
      return forkJoin(imageObservables);
    })
  ).subscribe(resultsWithImages => {
    // Now resultsWithImages is an array where each item has its details and the corresponding image URLs
    this.data = resultsWithImages.map(item => ({
      prodno: item.ctecdId,
      prodname: item.ctecdProductName,
      prodtypename: item.ctecdProducttypeName,
      prodprice: item.ctecdProducttypePrice.toString(),
      proddesc: item.ctecdProducttypeDesc,
      prodAlias: item.ctecdProductTypeAlias,
      prodsize: item.ctecdProductTypeSize,
      prodStock: item.ctecdProducttypeStockQty.toString(),
      prodMinpurc: item.ctecdProducttypeMinQty.toString(),
      previmg: item.imageUrls[0] || '', // Safely access images
      previmg2: item.imageUrls[1] || '',
      previmg3: item.imageUrls[2] || '',
      previmg4: item.imageUrls[3] || '',
    }));
  });
}

  getProductList(code: String) {
  
    this.masterserv.getProductByCode(code).subscribe((res: productlist[]) => {
      this.prodlist = res;
      this.productName = this.prodlist[0].cmprName;
    });
  }

  getProducttypeList(value: any) {
    this.masterserv.getProductTypeByCode(value).subscribe((res: producttypelist[]) => {
      this.prodtylist = res;
      this.producttype = this.prodtylist[0].cmprtTypeDesc;
    });
  }

    updateRequest(ptranstype:string, no:string){
         const dialogRef =this.dialog.open(ReqCuComponent,{
          height:'90%',
          maxWidth: '1000px',
          width:'80%',
          panelClass: 'custom-dialog-container',
           disableClose: true,
          data: {
              reqno: this.p_reqno,
              no: no,
              usr: this.p_usr,
              type: 'Update'
            }
          });
          dialogRef.afterClosed().subscribe({
            next:(val) =>{
              if (val) {

                  this.getRequestList(this.p_reqno, this.vusr, this.vtkn);
                  //localStorage.setItem("dsono", this.dtparam);

                }
              }
            });      
         //  dialogRef.componentInstance.p_usr=this.p_usr;
        //   dialogRef.componentInstance.p_type="Update";  
         //  dialogRef.componentInstance.p_no=no;
         //  dialogRef.componentInstance.p_reqno=this.p_reqno;
         }

    delay(ms: number): Promise<void> {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    
   closeDialog() {
    
    this.dialogRef.close(true);
  }

}
