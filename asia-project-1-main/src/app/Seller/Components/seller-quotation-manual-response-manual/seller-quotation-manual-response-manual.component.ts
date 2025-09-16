import { CommonModule } from '@angular/common'; 
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { quotationmanualdetail } from '../../models/quotationmanualdetail'; // Sesuaikan path
import { ServRequestsService } from '../../Request/Services/serv-requests.service';
import { ServLoginService } from '../../../login/Services/serv-login.service';
import { FormsModule } from '@angular/forms';
import { DTOSaveManual } from '../../models/DTOSaveManual';

@Component({
  selector: 'app-seller-quotation-manual-response-manual',
  standalone: true, 
  imports: [
    CommonModule , FormsModule
  ],
  templateUrl: './seller-quotation-manual-response-manual.component.html',
  styleUrl: './seller-quotation-manual-response-manual.component.css'
})
export class SellerQuotationManualResponseManualComponent implements OnInit {

  @Input() inquiryDetails: quotationmanualdetail | undefined;
  @Output() formSubmitted = new EventEmitter<void>();
  @Output() formCancelled = new EventEmitter<void>();
   isRequestDetailsVisible: boolean = true;
  vusrd: any;
  vusr: any;
   offerQty: number | null = null;
   offerPrice: number | null = null;
   offerNotes: string = '';

  constructor(private _vrlserv: ServRequestsService, private logserv: ServLoginService) { }

  ngOnInit(): void {
     this.vusrd = localStorage.getItem('uscd');
      this.vusr = this.logserv.decrypt(this.vusrd);
    // Anda bisa mengakses detail permintaan di sini melalui this.inquiryDetails
  }


  sendResponse() {


    console.log('Mengirim respons dari dalam komponen form...');

    const payload: DTOSaveManual = {
        blastid: this.inquiryDetails?.dbmdBlastId,
        ptype: 'M',
        notes: this.offerNotes,
        qty: Number(this.offerQty),   
        price: Number(this.offerPrice),  
        userid: this.vusr
    };
    
    console.log('Payload yang dikirim:', payload);

    this._vrlserv.getsavemanualinquiryManual(payload).subscribe({
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

  cancelResponse() {
    this.formCancelled.emit();
  }

  toggleRequestDetails(): void {
    this.isRequestDetailsVisible = !this.isRequestDetailsVisible;
  }
}