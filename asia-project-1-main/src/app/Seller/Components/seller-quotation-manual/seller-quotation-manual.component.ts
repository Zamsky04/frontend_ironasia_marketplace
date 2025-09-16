import { Component,  OnInit, ViewChild } from '@angular/core';
import { quotationmanual } from '../../models/quotationmanual'; // Pastikan path ini benar
import { ServRequestsService } from '../../Request/Services/serv-requests.service'; // Pastikan path ini benar
import { ServLoginService } from '../../../login/Services/serv-login.service'; // Pastikan path ini benar
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common'; // CommonModule untuk ngClass, DatePipe untuk date pipe
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button'; // Untuk mat-icon-button
import { MatTooltipModule } from '@angular/material/tooltip'; // Untuk matTooltip
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-seller-quotation-manual',
  standalone: true,
  // Tambahkan semua modul Angular Material yang dibutuhkan di sini
  imports: [
   // HeaderNavComponent,
    CommonModule, // Diperlukan untuk *ngClass, DatePipe
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    RouterModule,
    DatePipe // Jika Anda menggunakan DatePipe secara langsung di komponen atau di template
  ],
  templateUrl: './seller-quotation-manual.component.html',
  styleUrl: './seller-quotation-manual.component.css'
})
export class SellerQuotationManualComponent implements OnInit {
  quomanual: quotationmanual[] = [];
  vusrnm: any = "";
  vusrurl: any = "";
  vusnm: any = "";
  vusurl: any = "";
  vct: number = 0;
  usr: string = "";
  vusr: any;
  vusrd: any;
   private countdownInterval: any;
  dataSource!: MatTableDataSource<quotationmanual>; // Tipe dataSource disesuaikan dengan quotationmanual

  // Definisikan kolom yang akan ditampilkan di tabel
  displayedColumns: string[] = ['nourut', 'vmbmBlastId', 'vmbmBlastDate', 'vmbmVerifyBlastStatus','vmbmProdName', 'vmbmQty', 'vmbmProvinsi','remainingTime','action'];

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

    // Muat data awal saat komponen diinisialisasi, berdasarkan user ID
    // Asumsi: vusr adalah ID user yang akan digunakan untuk memfilter data
    this.getquomanualist(this.vusr);
  }

  /**
   * Mengambil daftar quotation dari supplier berdasarkan status atau user.
   * Asumsi: Parameter 'statusOrUser' akan digunakan oleh service untuk memfilter data.
   * @param statusOrUser String yang bisa berupa status (e.g., 'New', 'Sent') atau user ID.
   */
  getquomanualist(User: string) { // Default ke 'New' jika dipanggil tanpa argumen
    // Reset data sebelum memuat yang baru
    this.quomanual = [];
    this._vrlserv.execgetSupplierQuotation(User).subscribe({
      next: (response: quotationmanual[]) => {
        // Menambahkan properti 'nourut' (nomor urut) ke setiap item
        const dataWithNourut = response.map((item, index) => {
           const blastDate = new Date(item.vmbmBlastDate);
          const expiryDate = new Date(blastDate.getTime());
          expiryDate.setHours(blastDate.getHours() + 3);
          return { ...item, nourut: index + 1, expiryDate: expiryDate, 
            remainingTime: 'Calculating...', };
        });
        this.quomanual = dataWithNourut;
        this.dataSource = new MatTableDataSource(this.quomanual);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.startCountdown();
      },
      error: (error: HttpErrorResponse) => {
        console.error("Gagal mengambil data VRL:", error);
        // Ganti alert dengan cara yang lebih baik untuk menampilkan pesan kesalahan
        // Misalnya, menampilkan pesan di UI atau menggunakan snackbar Angular Material
        // Untuk saat ini, hanya log ke konsol
        console.log('Gagal memuat data. Silakan coba lagi.');
      }
    });
  }

   ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

   startCountdown() {
      this.countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        this.quomanual.forEach(item => {
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

  // Placeholder methods untuk tombol status
  getVrlSentByUser() {
    console.log('Mengambil data status Sent untuk user:', this.vusr);
    this.getquomanualist('Sent'); // Panggil dengan status 'Sent'
  }

  getVrlApproveSentByUser() {
    console.log('Mengambil data status Approve untuk user:', this.vusr);
    this.getquomanualist('Approved'); // Panggil dengan status 'Approved'
  }

  getVrlRejectSentByUser() {
    console.log('Mengambil data status Reject untuk user:', this.vusr);
    this.getquomanualist('Rejected'); // Panggil dengan status 'Rejected'
  }

  /**
   * Menerapkan filter pada dataSource tabel.
   * @param event Event dari input keyup.
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  } 

  viewQuoSeller(blastId: string) { // <-- 3. BUAT FUNGSI BARU UNTUK NAVIGASI
    if (!blastId) {
      console.error('Blast ID is missing, cannot navigate to detail.');
      return;
    }
    console.log('Navigating to detail for Blast ID:', blastId);
    // Navigasi ke rute detail dengan membawa blastId
    this.router.navigate(['/seller-quotation-manual/detail', blastId]);
  }
}