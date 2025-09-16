import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';
import { ServLoginService } from '../login/Services/serv-login.service';
import { throwDialogContentAlreadyAttachedError } from '@angular/cdk/dialog';
import { LoginCompComponent } from '../login/Components/login-comp/login-comp.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-product-list-card',
  imports: [CommonModule, ButtonModule, Tooltip],
  templateUrl: './product-list-card.component.html',
  styleUrl: './product-list-card.component.css'
})
export class ProductListCardComponent {
   @Input() products: any[] = [];
  @Output() shopNowClicked = new EventEmitter<any>();
  fallbackImage = 'https://via.placeholder.com/150';
  vusrnm:any;
  vusrurl:any="";
   vusrd:any;
  vusnm:any;
  vusurl:any;
  vusr:any;

  constructor(private logserv:ServLoginService, private dialog: MatDialog,private authService: AuthService,
  ) { }

  onShopNow(product: any) {
     this.vusrnm=localStorage.getItem('usnm');
     if (this.vusrnm==null){
       this.login();
     }
     else {
       this.shopNowClicked.emit(product);
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
