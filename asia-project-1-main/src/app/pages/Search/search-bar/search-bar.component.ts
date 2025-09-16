import { Component, OnInit } from '@angular/core';
import { MainHomeServService } from '../../../Home/Services/main-home-serv.service';
import { CommonModule } from '@angular/common';
import { ShopDrawerComponent } from '../../../shop-drawer/shop-drawer.component';
import { catchError, map, Observable, of, startWith, switchMap, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { hotdeals } from '../../../Home/Models/hotdeals';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../services/auth.service';
import { ServLoginService } from '../../../login/Services/serv-login.service';
import { ProductListSearchComponent } from '../../../product-list-search/product-list-search.component';

@Component({
  selector: 'app-search-bar',
  imports: [ ShopDrawerComponent, CommonModule, ProductListSearchComponent],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent implements OnInit {

  searchTerm$: Observable<string | null>;
  results$!: Observable<{
    isLoading: boolean;
    data?: hotdeals[];
    error?: string;
  }>;
  
  currentSearchTerm: string | null = null;
  
  // State untuk Shop Drawer
  selectedProduct: any = null;
  showDrawer = false;

  constructor(
    private route: ActivatedRoute, private homeserv: MainHomeServService, private authService: AuthService,
    private router: Router, private dialog: MatDialog, private logserv:ServLoginService
  ) {
    // Inisialisasi searchTerm$ dari query parameter 'q' di URL
    this.searchTerm$ = this.route.queryParamMap.pipe(
      map(params => params.get('q'))
    );
  }

  ngOnInit(): void {
    this.results$ = this.searchTerm$.pipe(
      // Simpan term pencarian saat ini untuk ditampilkan di UI
      tap(term => this.currentSearchTerm = term),
      // Gunakan switchMap untuk memanggil API berdasarkan term terbaru
      switchMap(term => {
        if (!term) {
          return of({ isLoading: false, data: [] }); // Jika tidak ada term, kembalikan hasil kosong
        }
        // Panggil service untuk mencari produk
        return this.homeserv.mainSearchPage(term).pipe(
          // Jika sukses, bungkus data dalam objek state
          map(data => ({ isLoading: false, data: data })),
          // Jika gagal, buat objek state error
          catchError(err => {
            console.error("Failed to load search results:", err);
            return of({ isLoading: false, error: 'Failed to load search results.' });
          }),
          // Saat panggilan dimulai, kirim state loading
          startWith({ isLoading: true })
        );
      })
    );
  }

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

  closeShopDrawer(): void {
    this.showDrawer = false;
  }
}