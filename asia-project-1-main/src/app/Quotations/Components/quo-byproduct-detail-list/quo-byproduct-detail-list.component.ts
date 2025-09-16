import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { productlist } from '../../../MasterApps/Models/productlist';
import { producttypelist } from '../../../MasterApps/Models/producttypelist';
import { DtoQuoByProduct } from '../../Models/DtoQuoByProduct';
import { QuotationDetail } from '../../Models/QuotationDetail';
import { ServQuoService } from '../../Services/serv-quo.service';
import { ActivatedRoute } from '@angular/router';
import { ServProductTypeService } from '../../../MasterApps/Services/serv-product-type.service';
import { ServLoginService } from '../../../login/Services/serv-login.service';
import { QuoCuComponent } from '../quo-cu/quo-cu.component';
import { QuoByProductCuComponent } from '../quo-by-product-cu/quo-by-product-cu.component';

@Component({
  selector: 'app-quo-byproduct-detail-list',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatIconModule, ReactiveFormsModule, MatSelectModule, MatFormFieldModule,
    MatCheckboxModule, MatInputModule, FormsModule, MatDialogModule],
  templateUrl: './quo-byproduct-detail-list.component.html',
  styleUrl: './quo-byproduct-detail-list.component.css'
})
export class QuoByproductDetailListComponent implements OnInit {
  p_usr: string = "aaaaa";
  p_quono: string = "aaaaa";
  p_type: string = "aaaaa";
  p_reason:string="";
  p_status:string="";
  file1img: string = "a"; 
  file2img: string = "a";  
  file3img: string = "a";  
  file4img: string = "a";

  vtkn:any;
  vtknd:any;
  vusr:any;
  vusrd:any;

   prodlist: productlist[] = [];
    prodtylist: producttypelist[] = [];
    qdtl: QuotationDetail[] = [];
    userid: string = 'USER09';
    imageUrls: string[] = []; 
    sentresult:string="aaaa"; 
    productName: string = "ccc"; 
    producttype: string = "aaaa";
   // data: requestlistupd[] = [];
    quoList: DtoQuoByProduct[]=[];

    constructor(private quoServ: ServQuoService, private formBuider: FormBuilder, private dialog:MatDialog,
      private route: ActivatedRoute, private masterserv: ServProductTypeService, private logserv:ServLoginService,
    @Inject(MAT_DIALOG_DATA) public dialogData: any) {
      this.p_quono=dialogData.p_quono;
      this.vusr=dialogData.p_usr;
      this.p_type=dialogData.p_type;
      this.p_status=dialogData.p_status;
      this.p_reason=dialogData.p_reason;
    }
  
    ngOnInit(): void {
     // this.vusrd=localStorage.getItem('uscd');
     // this.vtknd=localStorage.getItem('tkn');
     // this.vusr=this.logserv.decrypt(this.vusrd);
     // this.vtkn=this.logserv.decrypt(this.vtknd);
     // this.route.params.subscribe(params => {
      ///  this.p_type = params['param1'];
      //  this.p_reqno = params['param2'];
    //  });
    //  this.getRequestDtl(this.p_reqno);
        this.getquoList(this.p_quono);
    }

    getquoList(quo: string){
        this.quoList=[];
     //   alert(" quo by catalog :"+quo+" ---- "+this.vusr)
        this.quoServ.QuoListByQuoidUser(quo,  this.vusr, this.vtkn).subscribe((res: DtoQuoByProduct[]) => {
          this.quoList = res;
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
    
      updateQuo(ptranstype:string, no:string){
             const dialogRef =this.dialog.open(QuoByProductCuComponent,{
              height:'90%',
              maxWidth: '1000px',
              width:'80%',
              panelClass: 'custom-dialog-container',
              data:{
                p_usr:this.vusr,
                p_type:'Update',
                p_no:no,
                p_quono:this.p_quono
              }   
            },);
                dialogRef.afterClosed().subscribe({
                  next:(val) =>{
                    if (val) {
                      
                      this.getquoList(this.p_quono);
                     // this.getListFaktur();
                      //localStorage.setItem("dsono", this.dtparam);  
            
                    }
                  }
                });      
             //  dialogRef.componentInstance.p_usr=this.p_usr;
             //  dialogRef.componentInstance.p_type="Update";  
             //  dialogRef.componentInstance.p_no=no;
             //  dialogRef.componentInstance.p_quono=this.p_quono;
             }
    
        delay(ms: number): Promise<void> {
          return new Promise(resolve => setTimeout(resolve, ms));
        }

}
