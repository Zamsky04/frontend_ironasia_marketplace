import { Component,  OnInit,  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SellerQuotationByProductResponseByproductComponent } from '../seller-quotation-by-product-response-byproduct/seller-quotation-by-product-response-byproduct.component';
import { SellerQuotationByProductResponseManualComponent } from '../seller-quotation-by-product-response-manual/seller-quotation-by-product-response-manual.component';
import { ServRequestsService } from '../../Request/Services/serv-requests.service';
import { ServLoginService } from '../../../login/Services/serv-login.service';
import { DTOProductDetailBlast } from '../../models/DTOProductDetailBlast';


@Component({
  selector: 'app-seller-quotation-by-product-detail',
  standalone: true,
  imports: [ CommonModule, SellerQuotationByProductResponseByproductComponent, SellerQuotationByProductResponseManualComponent],
  templateUrl: './seller-quotation-by-product-detail.component.html',
  styleUrl: './seller-quotation-by-product-detail.component.css'
})
export class SellerQuotationByProductDetailComponent implements OnInit {
  vqm: DTOProductDetailBlast[] = [];vblastno:any;
    vusrnm: any = "";
    vusrurl: any = "";
    vusnm: any = "";
    vusurl: any = "";
    vct: number = 0;
    usr: string = "";
    vusr: any;
    vusrd: any;
    activeTab: string = 'manual';
    isResponseModalOpen: boolean = false;
    isCatalogResponseModalOpen: boolean = false;
    isPreparingManualResponse: boolean = false;
    isPreparingListResponse: boolean = false; 
  
    constructor(private _vrlserv: ServRequestsService, private logserv: ServLoginService,  
      private route: ActivatedRoute, private router: Router){
    }
  
    ngOnInit(): void {
      this.vusrnm = localStorage.getItem('usnm');
      this.vusrurl = localStorage.getItem('usrimg');
      this.vusrd = localStorage.getItem('uscd');
  
      this.vusnm = this.vusrnm;
      this.vusurl = this.vusrurl;
      this.vusr = this.logserv.decrypt(this.vusrd);
  
      this.logserv.updatemyacc(this.vusnm);
      this.logserv.updatemyppc(this.vusurl);
  
      const blastIdFromRoute = this.route.snapshot.paramMap.get('blastId');
      
      if (blastIdFromRoute) {
        this.vblastno = blastIdFromRoute;
        this.getquoproductdetail(); 
      } else {
        console.error('Blast ID not found in route!');
      }  
    }
  
    getquoproductdetail() {
      // Pastikan this.vusr (user ID) dan this.vblastno sudah terisi
      if (!this.vusr || !this.vblastno) {
          console.error('User ID or Blast No is missing.');
          return;
      }
  
      this._vrlserv.execgetSupplierQuotationproductdetail(this.vblastno, this.vusr).subscribe({
        next: (data) => {
          this.vqm = data;
          // ...
        },
        error: (err) => {
          console.error('Error fetching quotation manual details:', err);
        }
      });
    }
  
     openResponseModal(): void {
      this.isResponseModalOpen = true;
    }
  
    closeResponseModal(): void {
      this.isResponseModalOpen = false;
    }
  
     openCatalogResponseModal(): void {
      this.isCatalogResponseModalOpen = true;
    }
    closeCatalogResponseModal(): void {
      this.isCatalogResponseModalOpen = false;
    }
  
     goBack(): void {
      // Ganti '/inquiries' dengan path yang benar menuju halaman daftar inquiries Anda
      this.router.navigate(['/sellerquotationlist']); 
    }
    
    handleFormSubmission(): void {
    console.log('Form submitted! Navigating back to the list.');
    
    // Tutup semua modal yang mungkin terbuka
    this.isResponseModalOpen = false;
    this.isCatalogResponseModalOpen = false;
    
    // Navigasi kembali ke halaman daftar
    this.router.navigate(['/sellerquotationlist']);
    
}
}

