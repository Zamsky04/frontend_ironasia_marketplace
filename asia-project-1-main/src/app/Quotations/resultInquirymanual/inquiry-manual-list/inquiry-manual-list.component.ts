import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { catchError, of } from 'rxjs';

// Import dari Angular Material
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

// Impor Service dan Model yang relevan
import { ServQuoService } from '../../Services/serv-quo.service';
import { ServLoginService } from '../../../login/Services/serv-login.service';
import { InquirymanualSummary } from '../../Models/InquirymanualSummary';
import { InquiryViewManualResultComponent } from '../inquiry-view-manual-result/inquiry-view-manual-result.component';


@Component({
  selector: 'app-inquiry-manual-list',
  standalone: true,
  imports: [
    CommonModule, 
    DatePipe, 
    RouterModule,
    MatTableModule, 
    MatPaginatorModule, 
    MatSortModule, 
    MatDialogModule,
    MatFormFieldModule, 
    MatInputModule, 
    MatIconModule, 
    MatButtonModule
  ],
  templateUrl: './inquiry-manual-list.component.html',
  styleUrl: './inquiry-manual-list.component.css'
})
export class InquiryManualListComponent implements OnInit, AfterViewInit {
  
  // Properti untuk Angular Material Table
  displayedColumns: string[] = ['quoNo', 'quoDate', 'totalProduct', 'totalSupplier', 'action'];
  dataSource: MatTableDataSource<InquirymanualSummary>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  isLoading = true;
  error: string | null = null;
  activeStatus = 'All'; // Untuk menandai tombol filter mana yang aktif

  custNo!: string;

  constructor(
    private inquiryService: ServQuoService,
    private loginService: ServLoginService,
    private router: Router, 
    public dialog: MatDialog
  ) {
    // Inisialisasi dataSource dengan tipe yang benar untuk menghindari error
    this.dataSource = new MatTableDataSource<InquirymanualSummary>([]);
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
    // Menghubungkan paginator dan sort ke dataSource setelah view diinisialisasi
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadInquiries(status: string): void {
    this.isLoading = true;
    this.activeStatus = status;
    this.error = null;

    this.inquiryService.getInquiryListBymanual(this.custNo, status).pipe(
      catchError(err => {
        console.error("Failed to load inquiries:", err);
        this.error = "Sorry, we couldn't load your inquiries.";
        // Mengembalikan array kosong dengan tipe yang benar jika terjadi error
        return of<InquirymanualSummary[]>([]);
      })
    ).subscribe(data => {
      this.isLoading = false;
      // Membuat instance baru untuk memicu update pada tabel
      this.dataSource = new MatTableDataSource(data);
      // Menghubungkan kembali paginator dan sort setiap kali data baru dimuat
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  viewDetails(inquiry: InquirymanualSummary): void {
    const dialogRef = this.dialog.open(InquiryViewManualResultComponent, {
      width: '90vw',
      maxWidth: '1200px',
      data: inquiry,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  // Metode dummy untuk tombol Add Quotation
  addQuotation(): void {
    alert('Navigating to Add Quotation page...');
  }
}