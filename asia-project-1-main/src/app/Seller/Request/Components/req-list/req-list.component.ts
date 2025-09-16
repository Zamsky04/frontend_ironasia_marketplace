import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { HttpErrorResponse } from '@angular/common/http';
import { ReqCuComponent } from '../req-cu/req-cu.component';
import { ReqUpdateListComponent } from '../req-update-list/req-update-list.component';
import { vrequestlist } from '../../Models/vrequestlist';
import { ServRequestsService } from '../../Services/serv-requests.service';
import { ServLoginService } from '../../../../login/Services/serv-login.service';

@Component({
  selector: 'app-req-list',
  standalone: true,
  imports: [
    CommonModule, MatInputModule, MatButtonModule, MatCardModule,
    MatFormFieldModule, MatNativeDateModule, MatPaginatorModule, MatTableModule,
    MatIconModule, FormsModule, ReactiveFormsModule, MatDialogModule,
    MatSortModule, RouterModule
  ],
  templateUrl: './req-list.component.html',
  styleUrl: './req-list.component.css'
})
export class ReqListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['nourut', 'vrlReqno', 'vrlDate', 'vrlStatus', 'vrlProductNo', 'vrlUpdateDate', 'action'];
  vusr: any;

  // 1. Inisialisasi MatTableDataSource HANYA SATU KALI di sini.
  dataSource: MatTableDataSource<vrequestlist> = new MatTableDataSource();
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  lastActionDateHeader: string = 'Last Update';
  file1img: string = "a";
  files: File[] = []; // Array untuk menyimpan semua file
  imageUrls: string[] = [];

  constructor(
    private _vrlserv: ServRequestsService,
    private dialog: MatDialog,
    private logserv: ServLoginService
  ) {}

  ngOnInit(): void {
    this.initializeUser();
    this.getImagesBanner();
    this.getVrlByUser();
  }

  // 2. Gunakan ngAfterViewInit untuk menghubungkan Paginator dan Sort.
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // 3. Sentralisasi logika user dan tangani nilai NULL dari localStorage.
  private initializeUser(): void {
    // Gunakan '?? '' ' untuk memberikan string kosong jika item tidak ada (mencegah error 'string | null')
    const vusrnmEnc = localStorage.getItem('usnm') ?? '';
    const vusrurlEnc = localStorage.getItem('usrimg') ?? '';
    const vusrdEnc = localStorage.getItem('uscd') ?? '';
    
    const vusnm = vusrnmEnc;
    const vusurl =vusrurlEnc;
    this.vusr = this.logserv.decrypt(vusrdEnc);

    this.logserv.updatemyacc(vusnm);
    this.logserv.updatemyppc(vusurl);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // 4. Perbarui HANYA 'dataSource.data' di semua method fetch.
  getVrlByUser() {
    this.lastActionDateHeader = 'Last Update';
    this._vrlserv.getVReqByuser(this.vusr, "SQ").subscribe({
      next: (response: vrequestlist[]) => {
        const dataWithNourut = response.map((item, index) => ({ ...item, nourut: index + 1 }));
        this.dataSource.data = dataWithNourut;
      },
      error: (error: HttpErrorResponse) => console.error("Gagal mengambil data VRL (New):", error)
    });
  }

  getVrlSentByUser() {
    this.lastActionDateHeader = 'Sent Date';
    this._vrlserv.getVReqByuser(this.vusr, "SD").subscribe({
      next: (response: vrequestlist[]) => {
        this.dataSource.data = response.map((item, index) => ({ ...item, nourut: index + 1 }));
      },
      error: (error: HttpErrorResponse) => console.error("Gagal mengambil data VRL (Sent):", error)
    });
  }

  getVrlApproveSentByUser() {
    this.lastActionDateHeader = 'Approved Date';
    this._vrlserv.getVReqByuser(this.vusr, "VR").subscribe({
      next: (response: vrequestlist[]) => {
        this.dataSource.data = response.map((item, index) => ({ ...item, nourut: index + 1 }));
      },
      error: (error: HttpErrorResponse) => console.error("Gagal mengambil data VRL (Approved):", error)
    });
  }

  getVrlRejectSentByUser() {
    this.lastActionDateHeader = 'Last Update';
    this._vrlserv.getVReqByuser(this.vusr, "RJ").subscribe({
      next: (response: vrequestlist[]) => {
        this.dataSource.data = response.map((item, index) => ({ ...item, nourut: index + 1 }));
      },
      error: (error: HttpErrorResponse) => console.error("Gagal mengambil data VRL (Rejected):", error)
    });
  }

  getImagesBanner() {
    this._vrlserv.getImgBannerType('R').subscribe(
      images => {
        this.imageUrls = images;
        this.imageUrls.forEach(imageUrl => {
          this.fetchImageAndConvertToFile1(imageUrl);
        });
      },
      error => console.error('Gagal mengambil gambar:', error)
    );
  }



  fetchImageAndConvertToFile1(imageUrl: string) {
    fetch(imageUrl)
      .then(res => res.blob())
      .then(blob => {
        const urlParts = imageUrl.split('/');
        const filename1 = urlParts[urlParts.length - 1];
        this.file1img = filename1;
        const file = new File([blob], filename1, { type: 'image/jpeg' });
        this.files.push(file);

        // Memisahkan file ke variabel terpisah
        /*if (this.files.length === 1) {
          this.selectedFile1 = this.files[0];
          this.file1 = this.selectedFile1;
        }*/
      });
  }


  // 5. Perbaiki dialog AddRequest agar menggunakan 'data' (best practice).
  AddRequest(): void {
    const dialogRef = this.dialog.open(ReqCuComponent, {
      height: '90%',
      maxWidth: '1100px',
      width: '99%',
      panelClass: 'custom-dialog-container',
      data: {
        usr: this.vusr,
        type: 'Insert'
      }
    });

    
    
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getVrlByUser();
        }
      }
    });
  }

  updateRequest(tipe: string, reqno: string, status: string): void {
    const dialogRef = this.dialog.open(ReqUpdateListComponent, {
      height: '80%',
      maxWidth: '900px',
      width: '90%',
      panelClass: 'custom-dialog-container',
      disableClose: true,
      data: {
        reqno: reqno,
        status: status,
        usr: this.vusr,
        type: 'Update'
      }
    });


    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getVrlByUser();
        }
      }
    });
  }
}