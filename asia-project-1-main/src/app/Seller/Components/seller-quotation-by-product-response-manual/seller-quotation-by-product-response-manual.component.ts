import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- Pastikan FormsModule diimpor

// Gunakan model yang relevan untuk detail inquiry
import { QuotationByProductDetail } from '../../models/QuotationByProductDetail ';
import { DTOSaveManual } from '../../models/DTOSaveManual';
import { ServLoginService } from '../../../login/Services/serv-login.service';
import { ServRequestsService } from '../../Request/Services/serv-requests.service';
import { DTOSaveManualProduct } from '../../models/DTOSaveManualProduct';
import { forkJoin } from 'rxjs';

export interface ManualOffer {
  offerQty: number;
  offerPrice: number;
  offerNotes: string;
}

@Component({
  selector: 'app-seller-quotation-by-product-response-manual',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './seller-quotation-by-product-response-manual.component.html',
  styleUrl: './seller-quotation-by-product-response-manual.component.css'
})
export class SellerQuotationByProductResponseManualComponent implements OnInit {
 @Input() inquiryDetails: any | undefined;
  
  // Event emitter untuk berkomunikasi dengan modal di parent
  @Output() formSubmitted = new EventEmitter<any>(); // Anda bisa membuat interface untuk data form
  @Output() formCancelled = new EventEmitter<void>();
  
  // State untuk accordion
  public isRequestDetailsVisible: boolean = false; // Dibuat terlipat secara default

  // Properti untuk form
  offerQty: number | null = null;
  offerPrice: number | null = null;
  offerNotes: string = '';
  vusrd: any;
  vusr: any;
  isLoading: boolean = false;
   manualOffers: ManualOffer[] = [];
   // newOfferQty: number | null = 1;
  //newOfferPrice: number | null = null;
 // newOfferNotes: string = '';


  constructor( private logserv: ServLoginService, private catalogService: ServRequestsService) { }

  ngOnInit(): void { }

  // Fungsi untuk menampilkan/menyembunyikan detail permintaan
  toggleRequestDetails(): void {
    this.isRequestDetailsVisible = !this.isRequestDetailsVisible;
    this.vusrd = localStorage.getItem('uscd');
      this.vusr = this.logserv.decrypt(this.vusrd);
  }

  // Fungsi untuk mengirim respons
  /*sendResponse() {
    // Kumpulkan data form untuk dikirim
    const responseData = {
      quantity: this.offerQty,
      price: this.offerPrice,
      notes: this.offerNotes
    };
    console.log('Mengirim custom response untuk inquiry by product:', responseData);
    
    // Emit event ke parent untuk menutup modal
    this.formSubmitted.emit();
  }*/

    /*sendResponse() {       
        console.log('Mengirim respons dari dalam komponen form...');
         this.vusrd = localStorage.getItem('uscd');
      this.vusr = this.logserv.decrypt(this.vusrd);
        const payload: DTOSaveManualProduct = {
          blastid: this.inquiryDetails.dctwBlastId,
	        seqno: 1,
            ptype: 'P',
            notes: this.offerNotes,
            qty: Number(this.offerQty),
            price: Number(this.offerPrice),
            userid:  this.inquiryDetails.dctwSuppNo,
        };     
       //    alert("aaaaaaaaaaaaa: "+ this.inquiryDetails?.dbmdBlastId);
        console.log('Payload yang dikirim:', payload);    
        this.catalogService.getsavemanualinquiryManualproduct(payload).subscribe({
            next: (response) => {
               alert('offers submitted successfully ');
            // Cukup panggil event ini satu kali.
            // Komponen parent (detail) yang akan menangani penutupan modal.
            this.formSubmitted.emit();
            },
            error: (error) => {
                console.error('Terjadi kesalahan saat mengirim respons:', error);
                alert(`Gagal menyimpan: ${error.message || 'Error tidak diketahui dari server.'}`);
            }
        });
    }
  
  // Fungsi untuk tombol batal
  cancelResponse() {
    this.formCancelled.emit();
  }*/

  addOfferToList(): void {
    if (!this.offerQty || this.offerQty <= 0 || !this.offerPrice || this.offerPrice <= 0) {
      alert('Please fill in a valid quantity and price.');
      return;
    }

    const newOffer: ManualOffer = {
      offerQty: this.offerQty,
      offerPrice: this.offerPrice,
      offerNotes: this.offerNotes
    };
    
    this.manualOffers.push(newOffer);

    // Reset form untuk entri berikutnya
    this.offerQty = 1;
    this.offerPrice = null;
    this.offerNotes = '';
  }

  // Fungsi untuk MENGHAPUS penawaran dari daftar
  removeOfferFromList(index: number): void {
    this.manualOffers.splice(index, 1);
  }


   submitAllOffers() {
  this.addOfferToList(); 

    // 1. Buat array of observables, sama seperti di Component 1
    const saveRequests = this.manualOffers.map((offer, index) => {
      const payload: DTOSaveManualProduct = {
        blastid: this.inquiryDetails.dctwBlastId,
        seqno: index + 1, // Urutan sekuensial
        ptype: 'P',
        notes: offer.offerNotes,
        qty: offer.offerQty,
        price: offer.offerPrice,
        userid: this.inquiryDetails.dctwSuppNo, // atau this.vusr tergantung kebutuhan
      };
      console.log('Preparing payload:', payload);
      return this.catalogService.getsavemanualinquiryManualproduct(payload);
    });

    // 2. Eksekusi semua request dengan forkJoin
    this.isLoading = true;
    forkJoin(saveRequests).subscribe({
      next: (responses) => {
        this.isLoading = false;
        console.log('All manual offers submitted successfully:', responses);
        alert('All manual offers have been submitted successfully!');
        
        // 3. Emit event formSubmitted SATU KALI setelah semua berhasil
        this.formSubmitted.emit(); 
      },
      error: (error) => {
        this.isLoading = false;
        console.error('An error occurred while submitting manual offers:', error);
        alert(`Failed to submit one or more offers. Please check the console for details.`);
      }
    });
  }

  cancelResponse() {
    this.formCancelled.emit();
  }
}