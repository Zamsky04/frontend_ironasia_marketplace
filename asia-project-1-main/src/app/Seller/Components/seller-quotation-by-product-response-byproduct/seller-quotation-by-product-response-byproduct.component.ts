import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SellerCatalogProduct } from '../../models/SellerCatalogProduct';
import { ServRequestsService } from '../../Request/Services/serv-requests.service';
import { ServLoginService } from '../../../login/Services/serv-login.service';
import { DTOSavePickProduct } from '../../models/DTOSavePickProduct';
import { forkJoin } from 'rxjs';



// Interface untuk produk yang dipilih untuk ditawarkan
export interface OfferedProduct extends SellerCatalogProduct {
  offerQty: number;
  offerPrice: number;
}

@Component({
  selector: 'app-seller-quotation-by-product-response-byproduct',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './seller-quotation-by-product-response-byproduct.component.html',
  styleUrl: './seller-quotation-by-product-response-byproduct.component.css'
})
export class SellerQuotationByProductResponseByproductComponent implements OnInit {

  @Input() inquiryDetails: any | undefined;
  @Output() formSubmitted = new EventEmitter<OfferedProduct[]>();
  @Output() formCancelled = new EventEmitter<void>();

  // State untuk data
  allProducts: SellerCatalogProduct[] = [];
  filteredAndPagedProducts: SellerCatalogProduct[] = [];
  selectedProducts: OfferedProduct[] = [];
  vusrd: any;
  vusr: any;
  // State untuk UI
  searchTerm: string = '';
  isLoading: boolean = true;
  error: string | null = null;
  
  // State Paginasi
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  public isRequestDetailsVisible: boolean = false;

  constructor(private catalogService: ServRequestsService, private logserv: ServLoginService) { }

  ngOnInit(): void {
    this.vusrd = localStorage.getItem('uscd');
    this.vusr = this.logserv.decrypt(this.vusrd);
    this.loadSellerProducts();
  }
  

  loadSellerProducts(): void {
    this.isLoading = true;
    this.catalogService.execgetproductwebdetail(this.vusr, this.inquiryDetails.dctwProductCode, this.inquiryDetails.dctwProducttypeCode).subscribe({
      next: (data) => {
        this.allProducts = data;
        this.updateView();
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load your product catalog.';
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
    if (this.currentPage > this.totalPages) {
        this.currentPage = 1;
    }

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
        ptype: 'P',                        
        qty: product.offerQty,          
        price: product.offerPrice,        
        userid: this.vusr,
      };
      
      console.log('Payload to be sent:', payload);
      // Panggil service dan kembalikan Observable-nya
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

