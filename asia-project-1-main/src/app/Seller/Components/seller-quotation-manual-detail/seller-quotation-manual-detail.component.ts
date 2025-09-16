import { Component, OnInit } from '@angular/core';
import { quotationmanualdetail } from '../../models/quotationmanualdetail';
import { ServRequestsService } from '../../Request/Services/serv-requests.service';
import { ServLoginService } from '../../../login/Services/serv-login.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SellerQuotationManualResponseManualComponent } from "../seller-quotation-manual-response-manual/seller-quotation-manual-response-manual.component";
import { SellerQuotationManualResponseByproductComponent } from "../seller-quotation-manual-response-byproduct/seller-quotation-manual-response-byproduct.component";

@Component({
  selector: 'app-seller-quotation-manual-detail',
  standalone: true, // Pastikan komponen Anda bersifat standalone jika menggunakan Angular v17+
  imports: [CommonModule, SellerQuotationManualResponseManualComponent, SellerQuotationManualResponseByproductComponent],
  templateUrl: './seller-quotation-manual-detail.component.html',
  styleUrl: './seller-quotation-manual-detail.component.css'
})
export class SellerQuotationManualDetailComponent implements OnInit{
  vqm : quotationmanualdetail[]=[];
  vblastno:any;
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
      this.getmanuadetail(); 
    } else {
      console.error('Blast ID not found in route!');
    }  
  }

  getmanuadetail() {
    // Pastikan this.vusr (user ID) dan this.vblastno sudah terisi
    if (!this.vusr || !this.vblastno) {
        console.error('User ID or Blast No is missing.');
        return;
    }

    this._vrlserv.getSupplierQuotationdetail(this.vusr, this.vblastno).subscribe({
      next: (data) => {
        this.vqm = data;
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
    this.router.navigate(['/sellerquotationManuallist']); 
  }

 /* handleFormSubmission(): void {
    console.log('Form submitted! Refreshing details on the current page.');

    // 1. Tutup semua modal yang mungkin terbuka
    this.isResponseModalOpen = false;
    this.isCatalogResponseModalOpen = false;

    // 2. Panggil fungsi untuk mengambil data terbaru
    //    Ini akan me-refresh data di halaman detail
    this.getmanuadetail(); 
  }*/

 handleFormSubmission(): void {
  console.log('Form submitted! Navigating back to the list.');
  
  // Tutup semua modal yang mungkin terbuka
  this.isResponseModalOpen = false;
  this.isCatalogResponseModalOpen = false;
  
  // Navigasi kembali ke halaman daftar
  this.router.navigate(['/sellerquotationManuallist']);
}
}


