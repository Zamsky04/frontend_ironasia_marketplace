import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ShopDrawServService } from '../../shop-drawer/Services/shop-draw-serv.service';
import { DataViewModule } from 'primeng/dataview';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { ServLoginService } from '../../login/Services/serv-login.service';
import { GetContactComponent } from '../../Home/get-contact/get-contact.component';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';

// Interfaces (tidak berubah)
interface DisplayableCartItem {
  id: string; name: string; description: string | null; price: number; qty: number; images: { itemImageSrc: string | null }[]; selected: boolean; minPurchase: number; stock: number; originalData?: any; supplierCode: string;
}
interface ServerCartItemDetail {
  cartNo: string; cartDate: string; cartProductName: string; cartProductTypeName: string; cartProductPrice: number; cartProductDesc: string | null; cartProductAlias: string; cartProductSize: string; cartProductStock: number; cartProductMinPurc: number; cartProductImage1: string | null; cartProductImage2: string | null; cartProductImage3: string | null; cartProductImage4: string | null; cartSeqNo: string; cartQty: number;
}
interface ServerCartContainer {
  cartcustomerno: string; cartsupplierno: string; cartitem: ServerCartItemDetail[];
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [ CommonModule, FormsModule, DataViewModule, CheckboxModule, InputNumberModule, 
    ButtonModule, ConfirmDialogModule, TooltipModule    ],
  providers: [
    ConfirmationService
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartProductList: DisplayableCartItem[] = [];
  subtotal = 0;
  taxRate = 10;
  tax = 0;
  total = 0;
  vusr: any;
  isLoading = true;
  selectAll = false;

  constructor(
    private _cartserv: ShopDrawServService,
    private logserv: ServLoginService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
     private confirmationService: ConfirmationService 
  ) {}

  ngOnInit(): void {
    const vusrd = localStorage.getItem('uscd');
    if (vusrd) {
      this.vusr = this.logserv.decrypt(vusrd);
    }
    this.getCartList();
  }

  getCartList(): void {
    this.isLoading = true;
    this.cartProductList = [];
    this._cartserv.getcartList(this.vusr, 'N').subscribe({
      next: (serverResponse: ServerCartContainer[]) => {
        const processedItems: DisplayableCartItem[] = [];
        if (serverResponse && Array.isArray(serverResponse)) {
          serverResponse.forEach(container => {
            if (container.cartitem && Array.isArray(container.cartitem)) {
              container.cartitem.forEach(itemJson => {
                const productImages: { itemImageSrc: string | null }[] = [];
                if (itemJson.cartProductImage1) productImages.push({ itemImageSrc: itemJson.cartProductImage1 });
                if (itemJson.cartProductImage2) productImages.push({ itemImageSrc: itemJson.cartProductImage2 });
                if (itemJson.cartProductImage3) productImages.push({ itemImageSrc: itemJson.cartProductImage3 });
                if (itemJson.cartProductImage4) productImages.push({ itemImageSrc: itemJson.cartProductImage4 });
                if (productImages.length === 0) {
                  productImages.push({ itemImageSrc: 'https://via.placeholder.com/150' });
                }
                processedItems.push({
                  id: itemJson.cartNo, name: itemJson.cartProductName, description: itemJson.cartProductDesc, price: itemJson.cartProductPrice, qty: itemJson.cartQty || 1, images: productImages, selected: false, minPurchase: itemJson.cartProductMinPurc, stock: itemJson.cartProductStock, originalData: itemJson, supplierCode: container.cartsupplierno, 
                });
              });
            }
          });
        }
        this.cartProductList = processedItems;
        this.updateTotal();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse): void => {
        console.error('Error fetching cart list:', error);
        this.isLoading = false;
        this.cartProductList = [];
        this.updateTotal();
        this.cdr.detectChanges();
      }
    });
  }

  updateTotal(): void {
    const selectedItems = this.cartProductList.filter((item) => item.selected);
    this.subtotal = selectedItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
    this.tax = (this.subtotal * this.taxRate) / 100;
    this.total = this.subtotal + this.tax;
    this.updateSelectAllState();
  }
  
  onItemSelectionChange(): void { this.updateTotal(); }

  onItemQuantityChange(item: DisplayableCartItem): void {
    if (item.qty > item.stock) { item.qty = item.stock; }
    if (item.qty < item.minPurchase) { item.qty = item.minPurchase; }
    this.updateTotal();
  }

  /*removeItem(itemId: string): void {
    const itemToRemove = this.cartProductList.find(item => item.id === itemId);
    if (!itemToRemove) { return; }

    const { id: reqno, originalData: { cartSeqNo: reqseq } } = itemToRemove;

    this._cartserv.updateCart(this.vusr, reqno, reqseq, reqno).subscribe({
      next: () => {
        console.log('Item removed successfully from backend');
        // [DIPERBAIKI] Langsung panggil notifikasi dan muat ulang data
        this._cartserv.notifyCartUpdate();
        this.getCartList(); 
      },
      error: (error: HttpErrorResponse) => {
        console.error('Failed to remove item from backend:', error);
        alert('Could not remove the item. Please try again.');
      }
    });
  }*/

  removeItem(itemId: string): void {
  const itemToRemove = this.cartProductList.find(item => item.id === itemId);
  if (!itemToRemove) { return; }

  this.confirmationService.confirm({
    message: 'Are you sure you want to remove this item from your cart?',
    header: 'Confirm Deletion',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      const { id: reqno, originalData: { cartSeqNo: reqseq } } = itemToRemove;

      this._cartserv.updateCart(this.vusr, reqno, reqseq, reqno).subscribe({
        next: () => {
          console.log('Item removed successfully from backend');
          this._cartserv.notifyCartUpdate();
          this.getCartList(); 
        },
        error: (error: HttpErrorResponse) => {
          console.error('Failed to remove item from backend:', error);
          alert('Could not remove the item. Please try again.');
        }
      });
    },
    reject: () => {
      console.log('Item removal cancelled.');
    }
  });
}
/*
  removeSelectedItems(): void {
    const selectedItems = this.cartProductList.filter(item => item.selected);
    if (selectedItems.length === 0) { return; }

    const deleteObservables = selectedItems.map(item => {
      const { id: reqno, originalData: { cartSeqNo: reqseq } } = item;
      return this._cartserv.updateCart(this.vusr, reqno, reqseq, reqno);
    });

    forkJoin(deleteObservables).subscribe({
      next: () => {
        console.log('All selected items removed successfully');
        // [DIPERBAIKI] Langsung panggil notifikasi dan muat ulang data
        this._cartserv.notifyCartUpdate();
        this.getCartList();
      },
      error: (error: HttpErrorResponse) => {
        console.error('An error occurred while removing selected items:', error);
        alert('Could not remove all selected items. Please refresh and try again.');
        // Tetap coba refresh untuk sinkronisasi
        this._cartserv.notifyCartUpdate();
        this.getCartList();
      }
    });
  }
    */

removeSelectedItems(): void {
  const selectedItems = this.cartProductList.filter(item => item.selected);
  if (selectedItems.length === 0) { return; }

  this.confirmationService.confirm({
    message: `Are you sure you want to remove the selected ${selectedItems.length} item(s)?`,
    header: 'Confirm Deletion All',
    icon: 'pi pi-trash',
    accept: () => {
      const deleteObservables = selectedItems.map(item => {
        const { id: reqno, originalData: { cartSeqNo: reqseq } } = item;
        return this._cartserv.updateCart(this.vusr, reqno, reqseq, reqno );
      });

      forkJoin(deleteObservables).subscribe({
        next: () => {
          console.log('All selected items removed successfully');
          this._cartserv.notifyCartUpdate();
          this.getCartList();
        },
        error: (error: HttpErrorResponse) => {
          console.error('An error occurred while removing selected items:', error);
          alert('Could not remove all selected items. Please refresh and try again.');
          this._cartserv.notifyCartUpdate();
          this.getCartList();
        }
      });
    },
    reject: () => {
      console.log('Bulk removal cancelled.');
    }
  });
}
  
  toggleSelectAll(): void {
    this.cartProductList.forEach(item => item.selected = this.selectAll);
    this.updateTotal();
  }

  updateSelectAllState(): void {
    if (this.cartProductList.length === 0) {
      this.selectAll = false;
      return;
    }
    this.selectAll = this.cartProductList.every(item => item.selected);
  }

  checkout(): void {
    const selectedItems = this.cartProductList.filter((item) => item.selected);
    if (selectedItems.length === 0) {
      alert('Please select items to checkout.');
      return;
    }
    console.log('Checkout items:', selectedItems);
  }

  openContactDialog(supplierNumber: string): void {
    this.dialog.open(GetContactComponent, {
      width: '80vw', maxWidth: '900px', data: { suppNo: supplierNumber }
    });
  }
}