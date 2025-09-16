import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NavigationStart, Router, RouterModule } from '@angular/router';
import { HeaderNavComponent } from '../../../header-nav/header-nav.component';
import { VQuoHdrList } from '../../Models/VQuoHdrList';
import { ServQuoService } from '../../Services/serv-quo.service';
import { ServLoginService } from '../../../login/Services/serv-login.service';
import { HttpErrorResponse } from '@angular/common/http';
import { QuoCuComponent } from '../quo-cu/quo-cu.component';
import { QuoByProductCuComponent } from '../quo-by-product-cu/quo-by-product-cu.component';

@Component({
  selector: 'app-quo-list',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatButtonModule, MatCardModule,
    MatFormFieldModule, MatNativeDateModule, MatPaginatorModule, MatTableModule,
    MatIconModule, FormsModule, ReactiveFormsModule, MatDialogModule,
    MatSortModule, RouterModule, HeaderNavComponent],
  templateUrl: './quo-list.component.html',
  styleUrl: './quo-list.component.css'
})
export class QuoListComponent implements OnInit{
  displayedColumns: string[] = ['nourut', 'vquoId','vquoDate','vquoSubject', 'vquoStatus',  'action'];
  vquolist:VQuoHdrList[]=[];
  vusrnm:any="";
  vusrurl:any="";
  vusnm:any="";
  vusurl:any="";
  vtkn:any;
  vtknd:any;
  vusr:any;
  vusrd:any;
  vct:number=0;
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  imageUrls: string[] = [];
    file1img: string = "a";
  files: File[] = [];

  constructor(private _vquoserv:ServQuoService, private _router: Router, private dialog:MatDialog,  private logserv:ServLoginService){ 
    this._router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        console.log('🔍 NavigationStart:', event.url);
      }
    });
  }

  ngOnInit(): void {   
    this.vusrnm=localStorage.getItem('usnm');
    this.vusrurl=localStorage.getItem('usrimg');
    this.vusrd=localStorage.getItem('uscd');
   
    this.vusnm=this.vusrnm;
    this.vusurl=this.vusrurl;    
    this.vusr=this.logserv.decrypt(this.vusrd);

    this.logserv.updatemyacc(this.vusnm);
    this.logserv.updatemyppc(this.vusurl) 
    this.getImagesBanner2();
    this.getQuoHdrList();
  };

  getQuoHdrList(){
    this.vquolist=[];
    this.vct=0;
    this._vquoserv.QuoManualListByUser(this.vusr, 'SQ', 'M', this.vtkn).subscribe((res:VQuoHdrList[])=>{
      this.vquolist=res;
      this.dataSource=new MatTableDataSource(this.vquolist);
      this.dataSource.data.forEach( async item => {
        this.vct=this.vct+1;
        item.nourut=this.vct;
      });    
      this.dataSource.sort=this.sort;
      this.dataSource.paginator=this.paginator;
     
      error:(error: HttpErrorResponse):void =>{
        if (error instanceof ErrorEvent){
                }else{
        
        }
       }
    });  
  };

   getImagesBanner2() {
    // alert('getbanner');
    this._vquoserv.getImgBannerType('M').subscribe(
      images => {
        this.imageUrls = images;
        this.imageUrls.forEach(imageUrl => {
          this.fetchImageAndConvertToFile1(imageUrl);
        });
      },
      error => console.error('Gagal mengambil gambar:', error)
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
        /*if (this.files.length === 1) {
          this.selectedFile1 = this.files[0];
          this.file1 = this.selectedFile1;
        }*/
      });
  }


  getQuoHdrSentList(){
    this.vquolist=[];
    this.vct=0;
    this._vquoserv.QuoManualListByUser(this.vusr, 'SQ', 'M', this.vtkn).subscribe((res:VQuoHdrList[])=>{
      this.vquolist=res;
      
      this.dataSource=new MatTableDataSource(this.vquolist);
      this.dataSource.data.forEach( async item => {
        this.vct=this.vct+1;
        item.nourut=this.vct;
      });    
      this.dataSource.sort=this.sort;
      this.dataSource.paginator=this.paginator;
     
      error:(error: HttpErrorResponse):void =>{
        if (error instanceof ErrorEvent){
                }else{
          //server side error
        }
       }
    });  
  };

  getQuoHdrApprList(){
    this.vquolist=[];
    this.vct=0;
    this._vquoserv.QuoManualListByUser(this.vusr, 'BS', 'M', this.vtkn).subscribe((res:VQuoHdrList[])=>{
      this.vquolist=res;
      this.dataSource=new MatTableDataSource(this.vquolist);
      this.dataSource.data.forEach( async item => {
        this.vct=this.vct+1;
        item.nourut=this.vct;
      });    
      this.dataSource.sort=this.sort;
      this.dataSource.paginator=this.paginator;
     
      error:(error: HttpErrorResponse):void =>{
        if (error instanceof ErrorEvent){
                }else{
          //server side error
        }
       }
    });  
  };

  getQuoHdrRejectList(){
    this.vquolist=[];
    this.vct=0;
    this._vquoserv.QuoManualListByUser(this.vusr, 'RQ', 'M', this.vtkn).subscribe((res:VQuoHdrList[])=>{
      this.vquolist=res;
      this.dataSource=new MatTableDataSource(this.vquolist);
      this.dataSource.data.forEach( async item => {
        this.vct=this.vct+1;
        item.nourut=this.vct;
      });    
      this.dataSource.sort=this.sort;
      this.dataSource.paginator=this.paginator;
     
      error:(error: HttpErrorResponse):void =>{
        if (error instanceof ErrorEvent){
                }else{
          //server side error
        }
       }
    });  
  };


 

  AddQuo(ptranstype: string) {
    const dialogRef = this.dialog.open(QuoCuComponent, {
      height:'86',
      maxWidth: '900px',
      width:'70%',
      panelClass: 'custom-dialog-container',
      data:{
        p_usr:this.vusr,
        p_quono:'',
        p_type : 'Insert',
         p_status:'',
         p_reason:''
      }
    });
  
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getQuoHdrList();
        }
      },
    });  
   // dialogRef.componentInstance.p_usr = this.vusr;
   // dialogRef.componentInstance.p_type = 'Insert';
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  updateQuo(tipe:string, reqno:string, vstatus:string, vreason:string){       
            //this._router.navigate(['RequestUpdList', tipe,reqno]);
      const dialogRef =this.dialog.open(QuoCuComponent,{
            height:'86',
            maxWidth: '900px',
            width:'70%',
            panelClass: 'custom-dialog-container',
            data:{
              p_usr:this.vusr,
              p_quono:reqno,
              p_type:'Update',
              p_status:vstatus,
               p_reason:vreason
            }
          },);
            dialogRef.afterClosed().subscribe({
                next:(val) =>{
                      if (val) {
                        this.getQuoHdrList();              
                      }
                    }
                  });      
   // dialogRef.componentInstance.p_usr=this.vusr;
   // dialogRef.componentInstance.p_quono=reqno;
   // dialogRef.componentInstance.p_type='Update';
  }
    

}
