import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Carousel } from 'primeng/carousel';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { ServLoginService } from '../login/Services/serv-login.service';
import { LoginCompComponent } from '../login/Components/login-comp/login-comp.component';

@Component({
  selector: 'app-product-carousel',
  standalone: true,
  imports: [CommonModule, Carousel, FormsModule, ButtonModule, Tooltip],
  templateUrl: './product-carousel.component.html',
  styleUrl: './product-carousel.component.css'
})
export class ProductCarouselComponent {
  @Input() products: any[] = [];
  @Input() numVisible: number = 3;
  @Input() showIndicators: boolean = true;
  @Input() title: string = 'Top Deals';
  @Input() desc: string = 'Discover exclusive discounts and limited-time deals on our most popular products.';
  @Input() showNavigators: boolean = true;

  @Output() shopNowClicked = new EventEmitter<any>();
  @Output() viewMoreClicked = new EventEmitter<string>();

  constructor(private logserv: ServLoginService, private dialog: MatDialog) {}

  onViewMoreClick(event: MouseEvent) {
    event.preventDefault();
    this.viewMoreClicked.emit(this.title);
  }

  openDrawer(product: any) {
    const vusrnm = localStorage.getItem('usnm');
    if (!vusrnm) {
      const ref = this.dialog.open(LoginCompComponent, {
        height: 'auto',
        maxWidth: '300px',
        width: '80%',
        panelClass: 'custom-dialog-container',
      });
      ref.afterClosed().subscribe(() => {
        const after = localStorage.getItem('usnm');
        if (after) this.shopNowClicked.emit(product);
      });
    } else {
      this.shopNowClicked.emit(product);
    }
  }

  responsiveOptions = [
    { breakpoint: '1024px', numVisible: 3, numScroll: 1 },
    { breakpoint: '768px',  numVisible: 2, numScroll: 1 },
    { breakpoint: '560px',  numVisible: 1, numScroll: 1 },
  ];
}
