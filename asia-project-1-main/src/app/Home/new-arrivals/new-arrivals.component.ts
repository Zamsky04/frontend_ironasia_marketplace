import { Component, OnInit } from '@angular/core';
import { newarrivals } from '../Models/newarrivals';
import { MainHomeServService } from '../Services/main-home-serv.service';
import { CommonModule } from '@angular/common';
import { ProductListCardComponent } from '../../product-list-card/product-list-card.component';
import { ShopDrawerComponent } from '../../shop-drawer/shop-drawer.component';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ServLoginService } from '../../login/Services/serv-login.service';


@Component({
  selector: 'app-new-arrivals',
  standalone: true,
  imports: [ProductListCardComponent, ShopDrawerComponent, CommonModule, 
  ],
  templateUrl: './new-arrivals.component.html',
  styleUrl: './new-arrivals.component.css'
})
export class NewArrivalsComponent implements OnInit {
  newarriv : any[]=[];
  selectedProduct: any = null;
  showDrawer = false;

  constructor(private _homeserv:MainHomeServService, private authService: AuthService,
    private router: Router, private dialog: MatDialog, private logserv:ServLoginService){
  }

  ngOnInit(): void {
    this.getMainNewArrival();
  }

  getMainNewArrival(){
        this.newarriv=[];
        this._homeserv.mainNewArrivalList().subscribe((res:newarrivals[])=>{
          this.newarriv=res;
       
        });        
      };
  
  openShopDrawer(product: any) {
    this.authService.checkTokenValidity().subscribe(isExpired => {
    if (isExpired) {
      localStorage.removeItem('picnm');
       localStorage.removeItem('uscd');
        localStorage.removeItem('usnm');
         localStorage.removeItem('usrimg');
         localStorage.removeItem('typeb');
      this.authService.execLogout();      
      this.callothermethodheadernalogout();
      this.callothermethod();  
        this.callothermethodnavbar(); 
        alert("Your session has expired, please log in again.");  
      
    } else {
    this.selectedProduct = product;
    this.showDrawer = true;
    }
  });    
  }
    
   callothermethodheadernalogout() {
    this.logserv.callmethodfromothercomponentheaderbarlogout();
  }

  callothermethod() {
    this.logserv.callmethodfromothercomponent();
  }
  
   callothermethodnavbar() {
    this.logserv.callmethodfromothercomponentnavbar();
  }


  closeShopDrawer() {
    this.showDrawer = false;
  }

   
}
