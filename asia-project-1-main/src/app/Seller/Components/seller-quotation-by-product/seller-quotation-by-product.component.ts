import { Component,  OnInit, ViewChild, OnDestroy  } from '@angular/core';
import { ServRequestsService } from '../../Request/Services/serv-requests.service'; // Pastikan path ini benar
import { ServLoginService } from '../../../login/Services/serv-login.service'; // Pastikan path ini benar
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // CommonModule untuk ngClass, DatePipe untuk date pipe
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button'; // Untuk mat-icon-button
import { MatTooltipModule } from '@angular/material/tooltip'; // Untuk matTooltip
import { Router, RouterModule } from '@angular/router';
import { quotationproduct } from '../../models/quotationproduct';

@Component({
  selector: 'app-seller-quotation-by-product',
  standalone: true,
  imports: [ CommonModule, // Diperlukan untuk *ngClass, DatePipe
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    RouterModule,
    ],
  templateUrl: './seller-quotation-by-product.component.html',
  styleUrl: './seller-quotation-by-product.component.css'
})
export class SellerQuotationByProductComponent implements OnInit {
  quoprod: quotationproduct[] = [];
  vusrnm: any = "";
  vusrurl: any = "";
  vusnm: any = "";
  vusurl: any = "";
  vct: number = 0;
  usr: string = "";
  vusr: any;
  vusrd: any;
   private countdownInterval: any;
  dataSource!: MatTableDataSource<quotationproduct>; // Tipe dataSource disesuaikan dengan quotationmanual


  displayedColumns: string[] = ['nourut', 'vmbpBlastId', 'vmbpBlastDate', 'vmbpVerifyBlastStatus', 'vmbpProdName','vmbNoOfProduct', 'vmbpProvinsi','remainingTime', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _vrlserv: ServRequestsService, private logserv: ServLoginService, private router: Router) {
  }

  ngOnInit(): void {
    this.vusrnm = localStorage.getItem('usnm');
    this.vusrurl = localStorage.getItem('usrimg');
    this.vusrd = localStorage.getItem('uscd');

    this.vusnm = this.vusrnm;
    this.vusurl = this.vusrurl;
    this.vusr = this.logserv.decrypt(this.vusrd);

    this.logserv.updatemyacc(this.vusnm);
    this.logserv.updatemyppc(this.vusurl);
    this.getVrlByUser(this.vusr);    
  }

   ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }
  


  getVrlByUser(statusOrUser: string = 'New') { // Default ke 'New' jika dipanggil tanpa argumen
    // Reset data sebelum memuat yang baru
    this.quoprod = [];
    this._vrlserv.execgetSupplierQuotationproduct(statusOrUser).subscribe({
      next: (response: quotationproduct[]) => {
        // Menambahkan properti 'nourut' (nomor urut) ke setiap item
        const dataWithNourut = response.map((item, index) => {
          const blastDate = new Date(item.vmbpBlastDate);
          const expiryDate = new Date(blastDate.getTime());
          expiryDate.setHours(blastDate.getHours() + 3);

          return { ...item, 
            nourut: index + 1,
            expiryDate: expiryDate, 
            remainingTime: 'Calculating...',
           };
        });
        this.quoprod = dataWithNourut;
        this.dataSource = new MatTableDataSource(this.quoprod);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
           this.startCountdown();
      },
      error: (error: HttpErrorResponse) => {
        console.error("Gagal mengambil data VRL:", error);
        console.log('Gagal memuat data. Silakan coba lagi.');
      }
    });
  }

    startCountdown() {
      this.countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        this.quoprod.forEach(item => {
          if (item.expiryDate) {
            const distance = item.expiryDate.getTime() - now;
  
            if (distance > 0) {
              const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
              const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
              const seconds = Math.floor((distance % (1000 * 60)) / 1000);
              item.remainingTime = `${hours}h ${minutes}m ${seconds}s`;
            } else {
              item.remainingTime = 'Expired';
            }
          }
        });
      }, 1000);
    }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }  

  viewQuoSeller(blastId: string, seqNo: string) { 
    if (!blastId) {
      console.error('Blast ID is missing, cannot navigate to detail.');
      return;
    }
    console.log('Navigating to detail for Blast ID:', blastId);
    // Navigasi ke rute detail dengan membawa blastId dan seqNo
    this.router.navigate(['/seller-quotation-product/detail/', blastId, 1]);
  }
}


