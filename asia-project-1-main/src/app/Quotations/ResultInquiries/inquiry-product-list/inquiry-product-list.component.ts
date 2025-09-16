import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { catchError, of } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ServQuoService } from '../../Services/serv-quo.service';
import { ServLoginService } from '../../../login/Services/serv-login.service';
import { InquirySummary } from '../../Models/InquirySummary';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ViewInquiryResultsComponent } from '../view-inquiry-results/view-inquiry-results.component';

@Component({
  selector: 'app-inquiry-product-list',
  standalone: true,
  imports: [ CommonModule, DatePipe, MatTableModule, MatPaginatorModule, MatSortModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './inquiry-product-list.component.html',
  styleUrl: './inquiry-product-list.component.css'
})
export class InquiryProductListComponent implements  OnInit, AfterViewInit {
  
  // Properti untuk Angular Material Table
  displayedColumns: string[] = ['quoNo', 'quoDate', 'totalProduct', 'totalSupplier', 'action'];
  dataSource: MatTableDataSource<InquirySummary>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  isLoading = true;
  error: string | null = null;
  activeStatus = 'All'; // Untuk menandai tombol filter mana yang aktif

  custNo!: string;

  constructor(
    private inquiryService: ServQuoService,
    private loginService: ServLoginService,
    private router: Router, public dialog: MatDialog
  ) {
    // Inisialisasi dataSource di sini untuk menghindari error
    this.dataSource = new MatTableDataSource<InquirySummary>([]);
  }

  ngOnInit(): void {
    const encryptedUser = localStorage.getItem('uscd');
    if (encryptedUser) {
        this.custNo = this.loginService.decrypt(encryptedUser);
        this.loadInquiries(this.activeStatus);
    } else {
        this.error = "Customer not identified. Please log in.";
        this.isLoading = false;
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadInquiries(status: string): void {
    this.isLoading = true;
    this.activeStatus = status;
    this.error = null;

    this.inquiryService.getInquiryListByproduct(this.custNo, status).pipe(
      catchError(err => {
        console.error("Failed to load inquiries:", err);
        this.error = "Sorry, we couldn't load your inquiries.";
        return of([]);
      })
    ).subscribe(data => {
      this.dataSource.data = data;
      this.isLoading = false;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

 viewDetails(inquiry: InquirySummary): void {
    // 5. Ganti logika navigasi dengan logika untuk membuka dialog
    const dialogRef = this.dialog.open(ViewInquiryResultsComponent, {
      width: '90vw',       // Lebar dialog 90% dari viewport
      maxWidth: '1200px',  // Lebar maksimal 1200px
      data: inquiry,       // Kirim seluruh objek 'inquiry' ke komponen dialog
      panelClass: 'custom-dialog-container' // Opsional: untuk styling tambahan
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // Anda bisa melakukan sesuatu setelah dialog ditutup, misalnya refresh data
    });
  }

  // Metode dummy untuk tombol Add Quotation
  addQuotation(): void {
    alert('Navigating to Add Quotation page...');
    // this.router.navigate(['/path/to/add/quotation']);
  }
}