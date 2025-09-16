import { Component, OnInit } from '@angular/core';
import { MainHomeServService } from '../Services/main-home-serv.service';
import { CommonModule } from '@angular/common';
import { ProductListCardComponent } from '../../product-list-card/product-list-card.component';
import { ShopDrawerComponent } from '../../shop-drawer/shop-drawer.component';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ServLoginService } from '../../login/Services/serv-login.service';

@Component({
  selector: 'app-top-ranking',
  imports: [ProductListCardComponent, ShopDrawerComponent, CommonModule],
  templateUrl: './top-ranking.component.html',
  styleUrl: './top-ranking.component.css'
})
export class TopRankingComponent implements OnInit {
  toprank : any[]=[];
  selectedProduct: any = null;
  showDrawer = false;

  constructor(private _homeserv:MainHomeServService, private authService: AuthService,
    private router: Router, private dialog: MatDialog, private logserv:ServLoginService){
  }

  ngOnInit(): void {
    this.getMainNewArrival();
  }

  getMainNewArrival(){
        this.toprank=[];
        this._homeserv.mainTopRaking().subscribe((res:any[])=>{
          this.toprank=res;
       
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
