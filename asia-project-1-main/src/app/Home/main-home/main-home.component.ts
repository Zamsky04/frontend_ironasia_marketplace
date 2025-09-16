import { Component, OnInit } from '@angular/core';
import { CategoriesCardComponent } from '../../categories-card/categories-card.component';
import { CommonModule } from '@angular/common';
import { ProductCarouselComponent } from '../../product-carousel/product-carousel.component';
import { CarouselComponent } from '../../carousel/carousel.component';
import { ShopDrawerComponent } from '../../shop-drawer/shop-drawer.component';
import { Router, RouterModule } from '@angular/router';
import { ServLoginService } from '../../login/Services/serv-login.service';
import { MainHomeServService } from '../Services/main-home-serv.service';
import { DtoMainProdList } from '../Components/DtoMainProdList';
import { Banners } from '../Components/Banners';
import { catchError, finalize, map, of, Subscription } from 'rxjs';
import { ShopDrawServService } from '../../shop-drawer/Services/shop-draw-serv.service';
import { ProductListCardComponent } from '../../product-list-card/product-list-card.component';
import { NavbarComponent } from "../../navbar/navbar.component";
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { FooterComponent } from '../footer/footer.component';

interface CarouselItem {
  image: string;
  alt: string;
}

@Component({
  selector: 'app-main-home',
  imports: [CategoriesCardComponent, CommonModule, ProductListCardComponent, FooterComponent,
    ProductCarouselComponent, CarouselComponent, ShopDrawerComponent, RouterModule, NavbarComponent],
  standalone: true,
  templateUrl: './main-home.component.html',
  styleUrl: './main-home.component.css'
})
export class MainHomeComponent implements OnInit{
  title = 'asia-project';
  featuredTitle = "Featured Product"
  myacc:string="My Account";
  mypp:string="assets/user.png";
  vusrd:any ="";
  userid:any;
  vusrurl:any="";
  vusnm:any="";
  vusurl:any="";
  vusrnm:any="";
  vusrimage:any="";
  vusrpic:any="";
  vtkn:any="";
  vusr:any;
  dtprdlist: DtoMainProdList[]=[];
  bannlist: Banners[]=[];
  errorMessage: string | null = null;
   isLoading = false;
   carouselItems: CarouselItem[] = [];
  productList:any=[];
   topDealsProductList: any[] = [];
  toprankingsProductList: any[] = [];
  newarrivalProductList: any[] = [];
   private subscription!: Subscription;

  constructor(  private logserv:ServLoginService, private homeserv:MainHomeServService, private authService: AuthService,
    private _drawerserv:ShopDrawServService, private router: Router, private dialog: MatDialog){ 
 }

  ngOnInit(): void { 
    this.getsingleproduct('0000051-WR-250313', '2', 'bbbb1');
    this.loadBanners();
    this.getMainProdCategories();
    try{  
       /* this.vusrnm=localStorage.getItem('usnm');
        this.vusrurl=localStorage.getItem('usrimg');
        this.vusrd=localStorage.getItem('uscd');
        */
       // this.vtkn=localStorage.getItem('tkn');
         this.vusrpic=localStorage.getItem('usrimg');         
        this.vusnm=localStorage.getItem('usnm');
        this.userid=localStorage.getItem('uscd');
        this.vusrimage=localStorage.getItem('picnm');
      

       // localStorage.setItem('tkn',this.vtkn);
       if (this.vusnm){
       // localStorage.setItem('usrimg',this.vusrpic);
       // localStorage.setItem('usnm',this.vusnm);
      //  localStorage.setItem('uscd', this.userid);        
      //  localStorage.setItem('picnm', this.vusrimage );
        

        this.vusnm=this.vusrnm;
        this.vusurl=this.vusrurl;    
        this.vusr=this.logserv.decrypt(this.vusrd);
setTimeout(() => {
       // this.logserv.updatemyacc(this.vusnm);
      //  this.logserv.updatemyppc(this.vusurl);
        }, 1000); 
       }
    }catch (error) {
      const err = error as Error; // Type assertion
      console.error('Error message:', err.message);
      this.myacc="My Account";
     // this.logserv.updatemyacc(this.myacc);
    }
     this.gethotdealsproduct();
      this.gettoprankingproduct();
      this.getnewarrivalproduct();
     this.subscription = this.logserv.callMethodObservableMain.subscribe(() => {   
      this.log_infonavbar();
     
    });

    const userAgent = navigator.userAgent;
 // alert(userAgent);
 }

  log_infonavbar(){
    this.getsingleproductByCoreBuss();
  }

 
 getMainProdCategories(){
    this.dtprdlist=[];
    this.homeserv.mainProdList().subscribe((res:DtoMainProdList[])=>{
      this.dtprdlist=res;
      
    });  
  };

  loadBanners(): void {
    this.isLoading = true; // Set loading = true saat mulai fetch
    this.errorMessage = null; // Reset pesan error sebelumnya

    this.homeserv.mainBannerList() // Panggil method dari service
      .pipe(
        // ---- Transformasi data ----
        map(responseData => {
          // Pastikan responseData tidak null atau undefined sebelum mapping
          if (!responseData) {
            return []; // Kembalikan array kosong jika tidak ada data
          }
          // Logika transformasi yang sama seperti sebelumnya
          return responseData.map((item, index) => ({
            image: item[0], // Ambil URL dari inner array
            alt: `Banner ${index + 1}` // Buat alt text dinamis
          }));
        }),
        // ---- Error Handling ----
        catchError(error => {
          console.error('Error fetching banners from service:', error);
          // Set pesan error untuk ditampilkan di template
          this.errorMessage = 'Gagal memuat banner. Silakan coba lagi nanti.';
          // Kembalikan Observable kosong agar stream tidak berhenti karena error
          return of([]); // Mengembalikan array kosong sebagai fallback
        }),
        // ---- Finalize ----
        // Operator finalize akan selalu dijalankan, baik saat berhasil maupun error
        finalize(() => {
          this.isLoading = false; // Set loading = false setelah selesai (sukses/error)
          console.log('Banner loading process finished.');
        })
      )
      .subscribe(transformedData => {
        // Terima data yang sudah ditransformasi (atau array kosong jika error)
        this.carouselItems = transformedData;
        // Tidak perlu set isLoading = false di sini karena sudah ditangani oleh finalize
      });
  }
  
  showMore = false;

  toggleShowMore() {
    this.showMore = !this.showMore;
  }

  selectedProduct: any = null;
  showDrawer = false;

  openShopDrawer(product: any) {
     this.authService.checkTokenValidity().subscribe(isExpired => {
    if (isExpired) {
      // Jika true, minta login ulang
      localStorage.removeItem('picnm');
       localStorage.removeItem('uscd');
        localStorage.removeItem('usnm');
         localStorage.removeItem('usrimg');  
         localStorage.removeItem('typeb');    

      this.authService.execLogout();      
      this.callothermethodheadernalogout();
      this.callothermethod();  
        this.callothermethodnavbar(); 
        alert("Your session has expired, please log in again.");  
     
    } else {
      this.selectedProduct = product;
    this.showDrawer = true;
    }
  });  
  
  }

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


   gettoprankingproduct(){
    this.toprankingsProductList=[];
    this.homeserv.mainTopRaking().subscribe((res:any[])=>{
      this.toprankingsProductList=res;
    });  
  };

   gethotdealsproduct(){
    this.topDealsProductList=[];
    this.homeserv.mainHotDealsList().subscribe((res:any[])=>{
      this.topDealsProductList=res;
    });  
  };

   getnewarrivalproduct(){
    this.newarrivalProductList=[];
    this.homeserv.mainNewArrivalList().subscribe((res:any[])=>{
      this.newarrivalProductList=res;
    });  
  };

  getsingleproduct(ctid:string, ctseq:string, userid:string){
    this.productList=[];
    this._drawerserv.getprodwebAll().subscribe((res:any[])=>{
      this.productList=res;
    });  
  };

  getsingleproductByCoreBuss(){
    this.productList=[];
    this.homeserv.mainCoreBussiness(this.vusr).subscribe((res:any[])=>{
      this.productList=res;
    });  
  };


navigateToSection(sectionTitle: string) {
    console.log('View More clicked for section:', sectionTitle);
    let routePath = '';

    // Tentukan route berdasarkan sectionTitle
    switch (sectionTitle) {
      case 'Hot Deals':
        routePath = '/hotdeal'; // Pastikan route ini ada
        break;
      case 'Top Ranking':
        routePath = '/topranking'; // Pastikan route ini ada
        break;
      case 'New Arrivals':
        routePath = '/newarrival'; // Pastikan route ini ada
        break;
      default:
        console.warn('Unknown section for View More:', sectionTitle);
        // routePath = '/products'; // Opsi: navigasi ke halaman produk umum
        return;
    }

    if (routePath) {
      const url = this.router.createUrlTree([routePath]).toString();
      window.open(url, '_blank');
    }
  }
  
}

