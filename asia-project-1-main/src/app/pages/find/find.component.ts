import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataView } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { DtoMainProdList } from '../../Home/Components/DtoMainProdList';
import { MainHomeServService } from '../../Home/Services/main-home-serv.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ServProductTypeService } from '../../MasterApps/Services/serv-product-type.service';
import { producttypelist } from '../../MasterApps/Models/producttypelist';
import { ServRegisService } from '../../Registration/Services/serv-regis.service';
import { provincemdl } from '../../Registration/Models/provincemdl';
import { citymdl } from '../../Registration/Models/citymdl';
import { dtoProductType } from '../../Home/Models/dtoProductType';
import { CarouselModule } from 'primeng/carousel'; // <-- Tambahkan ini
import { Tooltip } from 'primeng/tooltip';
import { ShopDrawServService } from '../../shop-drawer/Services/shop-draw-serv.service';
import { ShopDrawerComponent } from '../../shop-drawer/shop-drawer.component';
import { LoginCompComponent } from '../../login/Components/login-comp/login-comp.component';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ServLoginService } from '../../login/Services/serv-login.service';

@Component({
  selector: 'app-find',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DataView,
    ButtonModule,
    ShopDrawerComponent,
    CarouselModule, Tooltip // <-- Tambahkan ini
  ],
  templateUrl: './find.component.html',
  styleUrl: './find.component.css'
})
export class FindComponent implements OnInit {

  sidebarVisible = false;
  isDesktop = false;
  productList: any[] = [];
  selectedCategory:number = 0;
  selectedprov = 'all';
  selectedCity = 'all';
  maxPrice:number = 0;
  prodid: any;
  type: string | null = null;
  layout: 'list' | 'grid' = 'grid';
  options: ('list' | 'grid')[] = ['list', 'grid'];
  dtprdlist: DtoMainProdList[]=[];
  dtprdtypelist: dtoProductType[]=[]; // Data untuk carousel
  prodname: string | null = null;
  prodimg: string | null = null;
  prodtypebyprdid:producttypelist[]=[];
  provinceall:provincemdl[]=[];
  cityall:citymdl[]=[];
  @Output() shopNowClicked = new EventEmitter<any>();
  private queryParamSub: Subscription | undefined;
  selectedProduct: any = null;
  showDrawer = false;
  categoryOptions: { name: string, value: number }[] = [];
  ProvinceOptions: { provname: string, provvalue: string }[] = [];
  cityOptions: { cityname: string, cityvalue: string }[] = [];
  vprovname:string | null = null;
  vcityname:string | null = null;
  varea :string = "All";
  vusrnm:any;
  vusrurl:any="";
  vusrd:any;
  vusnm:any;
  vusurl:any;
  vusr:any;

  // responsiveOptions untuk Carousel sudah Anda definisikan, kita akan gunakan ini
  // Jika belum ada, atau ingin menyesuaikan khusus untuk carousel ini:
  carouselResponsiveOptions: any[] = [
        {
            breakpoint: '1400px',
            numVisible: 4, // Tampilkan 4 item jika layar >= 1400px
            numScroll: 1
        },
        {
            breakpoint: '1024px', // Sesuai dengan yang Anda punya
            numVisible: 3,
            numScroll: 1
        },
        {
            breakpoint: '768px', // Sesuai dengan yang Anda punya
            numVisible: 2,
            numScroll: 1
        },
        {
            breakpoint: '560px', // Sesuai dengan yang Anda punya
            numVisible: 1,
            numScroll: 1
        }
    ];


  constructor( private homeserv:MainHomeServService, private _prodserv:ServProductTypeService,
               private route: ActivatedRoute, private _regisserv:ServRegisService,
              private _drawerserv:ShopDrawServService, private authService: AuthService,
                  private router: Router, private dialog: MatDialog, private logserv:ServLoginService){
  }

  ngOnInit(): void {
   this.queryParamSub = this.route.queryParamMap.subscribe(params => {
     this.prodid = params.get('prodid');
     this.prodname = params.get('prodname');
     this.prodimg = params.get('prodimg');
   });

   if (this.prodid){
     this.getFilterProvinceList();
     this.getMainProdtypebyprdid(this.prodid); // Untuk filter sub category
     this.getMainProdCategories(this.prodid); // Untuk list produk utama
     this.getMainProdtypebyprodid(); // Untuk data carousel
   }
   this.isDesktop = window.innerWidth >= 768;
  };

  ngOnDestroy(): void {
   if (this.queryParamSub) {
     this.queryParamSub.unsubscribe();
   }
  };

  getMainProdCategories(prodid:any){
     this.dtprdlist=[];
     this.homeserv.mainProdidList(prodid).subscribe((res:DtoMainProdList[])=>{
       this.dtprdlist=res;
     });
   };

    getMainProdAndProdTypeCategories(prdtype:any){ 
     this.dtprdlist=[];
     this.homeserv.mainProdidandProdtypeIdList(this.prodid, prdtype.prodtypeProductTypeCode).subscribe((res:DtoMainProdList[])=>{
       this.dtprdlist=res;
     });
   };

   getMainProdCategoriesFilter(){
     this.dtprdlist=[];

     if (this.selectedCity=='all'){
      this.vcityname='a';
     }

     if (this.selectedprov=='all'){
      this.vprovname='a';
      this.vcityname='a';
     }

     if (this.varea=="All" || this.varea?.length<=2){
      this.varea="All";
     }

     this.homeserv.mainProdidListFilter(this.prodid, this.selectedCategory, this.vprovname, this.vcityname, this.varea, this.maxPrice ).subscribe((res:DtoMainProdList[])=>{
       this.dtprdlist=res;
     });
   };


   getMainProdtypebyprodid(){
     this.dtprdtypelist=[];
     if (this.prodid) {
       this.homeserv.mainProdtypeidList(this.prodid).subscribe((res:dtoProductType[])=>{
         this.dtprdtypelist=res;
         console.log('Data for carousel (dtprdtypelist):', this.dtprdtypelist);
       });
     } else {
        console.warn('prodid is null, cannot fetch mainProdtypeidList for carousel');
     }
   }

   getMainProdtypebyprdid(prodid:any){ // Ini untuk filter sub category dropdown
     this._prodserv.getProductTypeByCode(prodid).subscribe((res:producttypelist[])=>{
       this.prodtypebyprdid=res;
       this.categoryOptions = res.map(item => {
         return {
           name: item.cmprtTypeDesc,
           value: item.cmprtCode
         };
       });
     });
   };

   getsingleproduct(ctid:string, ctseq:string, userid:string){
    this.productList=[];
    this._drawerserv.getprodwebAll().subscribe((res:any[])=>{
      this.productList=res;
    });  
  };

   getFilterProvinceList(){
     this._regisserv.getProvinceALL().subscribe((res:provincemdl[])=>{
       this.provinceall=res;
       this.ProvinceOptions = res.map(itemp => {
         return {
           provname: itemp.cmpsiProvinsi,
           provvalue: itemp.cmpsiProvCode
         };
       });
     });
   };

   getFilterCityList(prvid:string){
     this._regisserv.getcitybyprovALL(prvid).subscribe((res:citymdl[])=>{
       this.cityall=res;
       this.cityOptions = res.map(ctitemp => {
         return {
           cityname: ctitemp.cmcitCity,
           cityvalue:ctitemp.cmcitCityCode
         };
       });
     });
   };

  openShopDrawer(product: any) {
  const userCode = localStorage.getItem('uscd');

  if (!userCode) {
    alert("Your session has expired. Please log in again to continue");
   // this.login(); 
    return; 
  }
  this.authService.checkTokenValidity().subscribe(isExpired => {
    if (isExpired) {
      alert("Your session has expired. Please log in again to continue");
      localStorage.removeItem('uscd');
    localStorage.removeItem('picnm');    
    localStorage.removeItem('usnm');
    localStorage.removeItem('usrimg');  
      this.authService.execLogout();
      //this.login();
    } else {
      this.selectedProduct = product;
      this.showDrawer = true;
    }
  });
}

  /*openShopDrawer(product: any) {
     this.authService.checkTokenValidity().subscribe(isExpired => {
    if (isExpired) {
     // alert("aaaaaaaa")
      // Jika true, minta login ulang
       localStorage.removeItem('picnm');
       localStorage.removeItem('uscd');
        localStorage.removeItem('usnm');
         localStorage.removeItem('usrimg');
     this.authService.execLogout();      
    this.callothermethodheadernalogout();
     this.callothermethod();  
        this.callothermethodnavbar(); 
        alert("Your session has expired, please log in again.");  
     
    } else {
   //    alert("bbbbbbbb")
       this.selectedProduct = product;
       this.showDrawer = true;
    }
  });    
  }*/

   callothermethodheadernalogout() {
    this.logserv.callmethodfromothercomponentheaderbarlogout();
  }

  callothermethod() {
    this.logserv.callmethodfromothercomponent();
  }
  
   callothermethodnavbar() {
    this.logserv.callmethodfromothercomponentnavbar();
  }

  closeShopDrawer() {
    this.showDrawer = false;
  }

   applyFilters() {
     // Any additional logic for filters
   }

   @HostListener('window:resize', [])
   onResize() {
     this.isDesktop = window.innerWidth >= 768;
     if (this.isDesktop) this.sidebarVisible = true;
   }

  
   // responsiveOptions untuk DataView (sudah ada)
   responsiveOptions = [ /* ...definisi Anda sebelumnya ... */ ];


   onPrdTypeChange(newValue: any){
       this.filterProductsByCategory(newValue);
   }

   onProvinceChange(newValue: any){
     this.getFilterCityList(newValue);
     const selectedProvince = this.ProvinceOptions.find(
       option => option.provvalue === newValue
     );
     if (selectedProvince) {
         this.vprovname = selectedProvince.provname;
     } else {
         this.vprovname = null;
     }
   }

   onCityChange(newValue: any){
    const selectedCity = this.cityOptions.find(
      option => option.cityvalue === newValue
    );
    // alert("aaaaaaaaaa :"+selectedCity?.cityname) // Mungkin ingin di-disable untuk produksi
    if (selectedCity) {
      this.vcityname = selectedCity.cityname;
    } else  {
        this.vcityname = null;
    }
  }

   filterProductsByCategory(categoryId: number): void {
     if (!this.prodtypebyprdid) {
         console.warn("Daftar produk asli belum dimuat.");
         this.prodtypebyprdid = [];
         return;
     }
     const filteredList = this.prodtypebyprdid.filter(product => {
       const productCategoryId = product.cmprtCode;
       return productCategoryId === categoryId;
     });
     this.prodtypebyprdid = filteredList; // Seharusnya ini tidak mengubah dtprdlist, tapi data source filter
   }

   public formatProductSpec(spec: string | null | undefined): string {
     const targetLength = 70;
     const ellipsis = '...';
     const stringValue = spec ?? '';
     const nbSpace = '\u00A0';
     if (stringValue.length > targetLength) {
         return stringValue.slice(0, targetLength) + ellipsis;
     } else if (stringValue.length < targetLength && stringValue.length > 0) {
         const spacesNeeded = targetLength - stringValue.length;
         return stringValue + ' ' + nbSpace.repeat(Math.max(0, spacesNeeded - 1));
     } else if (stringValue.length === 0) {
           return nbSpace.repeat(targetLength);
     } else {
         return stringValue;
     }
   }

    login() {
     //  event.preventDefault();
       const dialogRef = this.dialog.open(LoginCompComponent, {
         height: 'auto', 
         maxWidth: '300px', 
         width: '80%', 
         panelClass: 'custom-dialog-container' 
       });
     
       dialogRef.afterClosed().subscribe({
         next: (val) => {
           if (val) {
             this.vusrnm = localStorage.getItem('usnm');
             this.vusrurl = localStorage.getItem('usrimg');
             this.vusrd = localStorage.getItem('uscd');
             if (this.logserv && typeof this.logserv.decrypt === 'function') {
               this.vusnm = this.vusrnm;
               this.vusurl = this.vusrurl;
               this.vusr = this.logserv.decrypt(this.vusrd);
               if (typeof this.logserv.updatemyacc === 'function') {
                 this.logserv.updatemyacc(this.vusnm);
               }
               if (typeof this.logserv.updatemyppc === 'function') {
                 this.logserv.updatemyppc(this.vusurl);
               }
             } else {
               console.error('logserv atau metode decrypt tidak terdefinisi dengan benar.');
               this.vusnm = this.vusrnm;
               this.vusurl = this.vusrurl;
               this.vusr = this.vusrd;
             }
           }
         }
       });
     } 
   
}