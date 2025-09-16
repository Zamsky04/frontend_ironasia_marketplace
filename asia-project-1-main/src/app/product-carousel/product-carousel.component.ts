import { Component, Input, Output, EventEmitter, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Carousel } from 'primeng/carousel';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';
import { ServLoginService } from '../login/Services/serv-login.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginCompComponent } from '../login/Components/login-comp/login-comp.component';
import { TruncatePipe } from '../pages/truncate.pipe';


@Component({
  selector: 'app-product-carousel',
  standalone: true,
  imports: [CommonModule, Carousel, FormsModule, ButtonModule, Tooltip, TruncatePipe],
  templateUrl: './product-carousel.component.html',
  styleUrl: './product-carousel.component.css'
})
export class ProductCarouselComponent {
  @Input() products: any[] = [];
  @Input() numVisible: any;
  @Input() showIndicators: boolean = true;
  @Input() title: string = 'Top Deals';
  @Input() desc: string =
    'Discover exclusive discounts and limited-time deals on our most popular products. Shop now before they’re gone!';
  @Input() showNavigators: boolean = true;
  @Output() shopNowClicked = new EventEmitter<any>(); // Emit product when clicked
   @Output() viewMoreClicked = new EventEmitter<string>();
  vusrnm:any;
  vusrurl:any="";
  vusrd:any;
  vusnm:any;
  vusurl:any;
  vusr:any;

  constructor(private logserv:ServLoginService, private dialog: MatDialog,
  ) { }

   onViewMoreClick(event: MouseEvent) {
    event.preventDefault();
    this.viewMoreClicked.emit(this.title); 
  }

  openDrawer(product: any) {
    this.vusrnm=localStorage.getItem('usnm');
     if (this.vusrnm==null){
       this.login();
     }
     else {
       this.shopNowClicked.emit(product);
     }
    
  }
  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 1,
    },
    {
      breakpoint: '768px',
      numVisible: 3,
      numScroll: 1,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1,
    },
  ];


  public formatProductSpec(spec: string | null | undefined): string {
    const targetLength = 50;
    const ellipsis = '...';
    const stringValue = spec ?? '';
    const nbSpace = '\u00A0'; // Non-breaking space

    if (stringValue.length > targetLength) {
        return stringValue.slice(0, targetLength) + ellipsis;
    } else if (stringValue.length < targetLength && stringValue.length > 0) {
        // Jika perlu padding & string tidak kosong:
        const spacesNeeded = targetLength - stringValue.length;
        // Tambah 1 spasi biasa + sisa (N-1) non-breaking space
        return stringValue + ' ' + nbSpace.repeat(Math.max(0, spacesNeeded - 1));
    } else if (stringValue.length === 0) {
         // Jika string asli kosong, isi semua dengan non-breaking space
         return nbSpace.repeat(targetLength);
    } else { // Tepat 50 karakter
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
