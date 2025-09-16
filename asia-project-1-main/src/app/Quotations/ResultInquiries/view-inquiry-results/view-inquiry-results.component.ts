import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule, MatTabChangeEvent } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

import { InquirySummary } from '../../Models/InquirySummary';
import { ServQuoService } from '../../Services/serv-quo.service';
import { SellerResponse } from '../../Models/seller-response.model';
import { ManualSellerResponse } from '../../Models/ManualSellerResponse';
import { GetContactComponent } from '../../../Home/get-contact/get-contact.component';
import { DtoExeGetContact } from '../../../Seller/Request/Models/DtoExeGetContact';
import { ServRequestsService } from '../../../Seller/Request/Services/serv-requests.service';
import { ServLoginService } from '../../../login/Services/serv-login.service';

type ResultType = 'fulfill' | 'price' | 'region' | 'manual';
type ResultData = SellerResponse[] | ManualSellerResponse[];

@Component({
  selector: 'app-view-inquiry-results',
  standalone: true,
  imports: [ CommonModule, MatDialogModule, MatButtonModule, MatTabsModule, MatIconModule, MatProgressSpinnerModule ],
  templateUrl: './view-inquiry-results.component.html',
})
export class ViewInquiryResultsComponent implements OnInit {
  vusrd: any;
  vusr:any;
  private activeTabSubject = new BehaviorSubject<ResultType>('fulfill');
  activeTab$ = this.activeTabSubject.asObservable();

  results$!: Observable<{
    isLoading: boolean;
    data?: ResultData;
    error?: string;
  }>;
  expandedNotes: { [key: string]: boolean } = {};

  constructor(
    public dialogRef: MatDialogRef<ViewInquiryResultsComponent>,
    @Inject(MAT_DIALOG_DATA) public inquiryData: InquirySummary,
    private resultService: ServQuoService, private dialog: MatDialog,
    private _servreq:ServRequestsService,
    private logserv:ServLoginService
  ) {}

  ngOnInit(): void {
    if (!this.inquiryData?.vmrppCustNo || !this.inquiryData?.vmrppQuoNo) {
      console.error('Inquiry data is missing.');
      this.closeDialog();
      return;
    }
    this.loadResults();
  }

  loadResults(): void {
    this.results$ = this.activeTab$.pipe(
      switchMap(tab => {
        let apiCall: Observable<ResultData>;
        switch (tab) {
          case 'price':
            apiCall = this.resultService.getResultByPrice(this.inquiryData.vmrppCustNo, this.inquiryData.vmrppQuoNo);
            break;
          case 'region':
            apiCall = this.resultService.getResultByRegion(this.inquiryData.vmrppCustNo, this.inquiryData.vmrppQuoNo);
            break;
          case 'manual':
            apiCall = this.resultService.getResultByManual(this.inquiryData.vmrppCustNo, this.inquiryData.vmrppQuoNo);
            break;
          case 'fulfill':
          default:
            apiCall = this.resultService.getResultByFulfillment(this.inquiryData.vmrppCustNo, this.inquiryData.vmrppQuoNo);
            break;
        }
        return apiCall.pipe(
          map(data => ({ isLoading: false, data: data, error: undefined })),
          catchError(err => of({ isLoading: false, error: 'Failed to load offers.' })),
          startWith({ isLoading: true, data: [] })
        );
      })
    );
  }

  selectTab(tabIndex: number): void {
    const tabs: ResultType[] = ['fulfill', 'price', 'region', 'manual'];
    this.activeTabSubject.next(tabs[tabIndex]);
  }

  toggleNote(resultId: string): void {
    this.expandedNotes[resultId] = !this.expandedNotes[resultId];
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  // FUNGSI TYPE GUARD (INI KUNCINYA)
  isSellerResponseArray(data: any): data is SellerResponse[] {
    return Array.isArray(data) && data.length > 0 && data[0].hasOwnProperty('products');
  }

  isManualResponseArray(data: any): data is ManualSellerResponse[] {
    return Array.isArray(data) && data.length > 0 && data[0].hasOwnProperty('dctwNotes');
  }
/*
  openContactDialog(supplierNumber: string): void {  
    this.getresultContact ();
    this.dialog.open(GetContactComponent, {
      width: '80vw',     
      maxWidth: '900px',   
      data: { suppNo: supplierNumber }
    });
  }

  getresultContact (){//v_custno:string, v_suppno:string, v_reqno:string, v_seqno:number){
      const contactpayload: DtoExeGetContact = {
        p_custno:this.vusr,
        p_suppno:this.product.dctwSupplierCode,
        p_reqno:this.product.dctwCtechId,
        p_seqno:this.product.dctwId,
        p_qty:this.quantity,
        p_type:'W'
        
      };
      this._servreq.execgetcontact(contactpayload).subscribe(
        response => {      
          this.result = response;    
      });
    }
*/
  initiateContact(seller: any): void {
    this.vusrd=localStorage.getItem('uscd');
    this.vusr=this.logserv.decrypt(this.vusrd);
  const userId =this.vusr;

  const contactpayload: DtoExeGetContact = {
      p_custno: userId,
      p_suppno: seller.dctwSuppNo,
      p_reqno: seller.dctwQuoNo,
      p_seqno: seller.products?.[0]?.dctwReqSeq || seller.dctwQuoSeq,
      p_qty: seller.products?.[0]?.dctwReviseQty || seller.dctwQty,
      p_type: 'W'
  };

  console.log("Mencoba menghubungi seller, mengirim log:", contactpayload);
  
  this._servreq.execgetcontact(contactpayload).subscribe({
    next: (response) => {
      console.log("Log kontak berhasil disimpan.", response);
      
      // 3. SETELAH API BERHASIL, BARU BUKA DIALOG
      this.dialog.open(GetContactComponent, {
        width: '80vw',      
        maxWidth: '900px',   
        data: { suppNo: seller.dctwSuppNo } // Kirim suppNo ke dialog
      });
    },
    error: (err) => {
      console.error("Gagal menyimpan log kontak:", err);
      // Opsional: Tetap buka dialog kontak walau log gagal, atau tampilkan error
      alert("Gagal menghubungi server. Silakan coba lagi.");
    }
  });
}

}