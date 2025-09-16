
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServRequestsService } from '../../Request/Services/serv-requests.service';
import { catalogproduct } from '../../models/catalogproduct ';
import { ServLoginService } from '../../../login/Services/serv-login.service';
import { forkJoin } from 'rxjs';
import { DTOSavePickProduct } from '../../models/DTOSavePickProduct';
import { SellerCatalogProduct } from '../../models/SellerCatalogProduct';
import { OfferedProduct } from '../seller-quotation-by-product-response-byproduct/seller-quotation-by-product-response-byproduct.component';

export interface SelectedProduct extends catalogproduct {
  offerQty: number;
  offerPrice: number;
}

@Component({
  selector: 'app-seller-quotation-manual-response-byproduct',
  standalone: true,
  imports: [ CommonModule, FormsModule],
  templateUrl: './seller-quotation-manual-response-byproduct.component.html',
  styleUrl: './seller-quotation-manual-response-byproduct.component.css'
})
export class SellerQuotationManualResponseByproductComponent implements OnInit {

  @Input() inquiryDetails: any | undefined;
  @Output() formSubmitted = new EventEmitter<SelectedProduct[]>();
  @Output() formCancelled = new EventEmitter<void>();

  allProducts: SellerCatalogProduct[] = [];
  filteredAndPagedProducts: SellerCatalogProduct[] = [];

  public isRequestDetailsVisible: boolean = false;
  offerQty: number | null = null;
   offerPrice: number | null = null;
   offerNotes: string = '';

  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
   vusrd: any;
  vusr: any;
  isLoading: boolean = true;
  error: string | null = null;
  selectedProducts: OfferedProduct[] = [];

  constructor(private catalogService: ServRequestsService,  private logserv: ServLoginService) { }

  ngOnInit(): void {
   /// const supplierNo = "00033WB202505";
   this.vusrd = localStorage.getItem('uscd');
    this.vusr = this.logserv.decrypt(this.vusrd);
    this.loadProducts(this.vusr);
    this.vusrd = localStorage.getItem('uscd');
      this.vusr = this.logserv.decrypt(this.vusrd);
  }

  loadProducts(supplierNo: string): void {
    this.isLoading = true;
    this.catalogService.getProductsBySupplier(this.vusr).subscribe({
      next: (data) => {
        this.allProducts = data;
        this.updateView();
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load product catalog.';
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  updateView(): void {
    const filtered = this.allProducts.filter(p =>
      p.dctwProductName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      p.dctwProductCode.toString().includes(this.searchTerm)
    );
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredAndPagedProducts = filtered.slice(startIndex, endIndex);
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.updateView();
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateView();
    }
  }

  // Fungsi ini sekarang akan berjalan tanpa error
  /*selectProduct(product: catalogproduct): void {
    const isAlreadySelected = this.selectedProducts.some(p => p.dctwProductName === product.dctwProductName);
    if (isAlreadySelected) {
      alert('This product has already been selected.');
      return;
    }
    const newSelectedProduct: SelectedProduct = {
      ...product,
      offerQty: 1,
      offerPrice: product.dctwProducttypePrice
    };
    this.selectedProducts.push(newSelectedProduct);
  }*/

     selectProduct(product: SellerCatalogProduct): void {
        const isAlreadySelected = this.selectedProducts.some(p => p.dctwSeq === product.dctwSeq);
        if (isAlreadySelected) {
          alert('This product has already been selected.');
          return;
        }
    
        const newSelectedProduct: OfferedProduct = {
          ...product,
          offerQty: 1,
          offerPrice: product.dctwProducttypePrice
        };
        this.selectedProducts.push(newSelectedProduct);
      }

  removeSelectedProduct(index: number): void {
    this.selectedProducts.splice(index, 1);
  }

  get totalOfferPrice(): number {
    return this.selectedProducts.reduce((total, p) => total + (p.offerQty * p.offerPrice), 0);
  }

  submitOffer(): void {
    if (this.selectedProducts.length === 0) {
      alert('Please select at least one product to offer.');
      return;
    }

   const saveRequests = this.selectedProducts.map(product => {
 
     const payload: DTOSavePickProduct = {
        blastid: product.dctwBlastId,      
        seqno: product.dctwSeq,            
        reqno: product.dctwReqNo,          
        reqseq: product.dctwReqSeq,  
        ptype: 'M',                        
        qty: product.offerQty,          
        price: product.offerPrice,        
        userid: this.vusr,
      };
      
      console.log('Payload to be sent:', payload);
      // Panggil service dan kembalikan Observable-nya
     // alert('quo manual response by catalog : '+this.inquiryDetails?.dbmdBlastId+ ' --- '+product.dctwReqNo+' - '+product.dctwReqSeq)
      return this.catalogService.getsaveproductinquiryproduct(payload);
    });
  
    // 3. Eksekusi semua panggilan HTTP secara bersamaan (kode ini sudah benar)
    this.isLoading = true; // Tampilkan loading indicator
    forkJoin(saveRequests).subscribe({
      next: (responses) => {
      //  this.isLoading = false;
     //   console.log('All offers submitted successfully:', responses);
        alert('All selected products have been submitted successfully!');
        this.formSubmitted.emit();
     //   this.formSubmitted.emit(this.selectedProducts);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('An error occurred while submitting offers:', err);
        alert(`Failed to submit one or more products. Please check the console for details.`);
      }
    });
  }

  cancel(): void {
    this.formCancelled.emit();
  }

  toggleRequestDetails(): void {
    this.isRequestDetailsVisible = !this.isRequestDetailsVisible;
  }

 
}
