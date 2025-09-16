import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, HostListener, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrawerModule } from 'primeng/drawer';
import { RatingModule } from 'primeng/rating';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { GalleriaModule } from 'primeng/galleria';
import { ShopDrawServService } from './Services/shop-draw-serv.service';
import { ServLoginService } from '../login/Services/serv-login.service';
import { ServRequestsService } from '../Seller/Request/Services/serv-requests.service';
import { FieldsetModule } from 'primeng/fieldset';
import { DTOProcToCart } from '../Home/Models/DTOProcToCart';
import { DtoExePickProd } from '../Seller/Request/Models/DtoExePickProd';
import { DtoExeGetContact } from '../Seller/Request/Models/DtoExeGetContact';
import { MatDialog } from '@angular/material/dialog';
import { GetContactComponent } from '../Home/get-contact/get-contact.component';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-shop-drawer',
  imports: [DrawerModule, RatingModule, InputNumberModule, ButtonModule, FormsModule, CommonModule, GalleriaModule,
             FieldsetModule,TooltipModule
  ],
  standalone: true,
  templateUrl: './shop-drawer.component.html',
  styleUrl: './shop-drawer.component.css'
})
export class ShopDrawerComponent implements OnInit,OnChanges {
  @Input() visible: boolean = false; // Controls drawer visibility
  @Input() product: any = null; // Product details from parent
  @Output() visibleChange = new EventEmitter<boolean>(); // Emits event when closing
  productsingle : any= null;

  vtkn:any;
  vtknd:any;
  vusr:any;
  vusrd:any;
  galleriaVisible: boolean = true; 
  quantity: number = 1; // Default quantity
  totalPrice: number = 0; // Computed total price
  isMobile: boolean = window.innerWidth < 768;
  result: any;
  data:DTOProcToCart[] = [];
  pickprod:DtoExePickProd[]=[];
  @HostListener('window:resize', ['$event'])
  activeIndex: number = 0;
  
  onResize(event: any) {
    this.isMobile = event.target.innerWidth < 768;
  }

  constructor(private _drawerserv:ShopDrawServService,  private logserv:ServLoginService, 
              private _servreq:ServRequestsService, private dialog: MatDialog){ 
  }

  ngOnInit(): void {
    this.vusrd = localStorage.getItem('uscd');
    this.vusr = this.logserv.decrypt(this.vusrd);
  }


  
ngOnChanges(changes: SimpleChanges) {
  if (changes['product'] && this.product) {
    const singleProduct = Array.isArray(this.product) ? this.product[0] : this.product;

    
    if (!singleProduct) {
      return; 
    }

    if (singleProduct.images && Array.isArray(singleProduct.images)) {
      const validImages = singleProduct.images.filter((image: any) => image && image.itemImageSrc);
      singleProduct.images = validImages;
    }

    this.product = singleProduct;

    // ======================= LOGIKA ANDA YANG SUDAH ADA =======================
    this.vusrd = localStorage.getItem('uscd');
    this.vusr = this.logserv.decrypt(this.vusrd);

    const pickProdPayload: DtoExePickProd = {
      p_custno: this.vusr,
      p_suppno: this.product.dctwSupplierCode,
      p_reqno: this.product.dctwCtechId,
      p_seqno: this.product.dctwId,
    };

    this.getresultpickprod(pickProdPayload);
    this.quantity = 1;
    this.updateTotal();
    this.activeIndex = 0; // Reset galleria ke gambar pertama
  }
}

  updateTotal() {
    this.totalPrice = this.product ? this.quantity * this.product.dctwProducttypePrice : 0;
  }

  closeDrawer() {
    this.visibleChange.emit(false);
  }

  checkout() {
    if (!this.product) {
        console.error("Cannot checkout, product data is missing.");
        return;
    }

    const payload: DTOProcToCart = {
      reqno: this.product.dctwCtechId,
      seqno: this.product.dctwId,
      qty: this.quantity,
      userid: this.vusr,
      notes: ""
      
    };

    this._drawerserv.getproctocart(payload).subscribe({
        next: (response) => {
            console.log('Product added to cart:', response);
            this.result = response;
             this._drawerserv.notifyCartUpdate();
            this.closeDrawer();
        },
        error: (err) => {
            console.error('Failed to add product to cart:', err);
           
            alert('Sorry, there was an error adding the product to your cart.');
        }
    });
}

  getresultpickprod (data:any){
    this.vusrd = localStorage.getItem('uscd');
    this.vusr = this.logserv.decrypt(this.vusrd);
    this._servreq.execpickproduct(data).subscribe(//this.vusr, p_suppno, p_reqno, p_seqno)
      response => {      
        this.result = response;    
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

  maxLinesToShow = 4;
  showAll = false;

  get descriptionLines(): string[] {
    return this.product.dctwProducttypeDesc?.split('\n') || [];
  }

  get visibleLines(): string[] {
    return this.showAll
      ? this.descriptionLines
      : this.descriptionLines.slice(0, this.maxLinesToShow);
  }

  toggleShowMore() {
    this.showAll = !this.showAll;
  }
  
    getContact(): void {
    // Tambahkan logika Anda di sini, misalnya menampilkan nomor telepon
    alert('Contacting seller: ' + this.product.dctwSuppPhone);
  }

 openContactDialog(supplierNumber: string): void {
  this.closeDrawer();
  this.getresultContact();
  this.dialog.open(GetContactComponent, {
    width: '80vw',     
    maxWidth: '900px',   
    data: { suppNo: supplierNumber }
  });
}
}
