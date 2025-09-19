import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MainHomeServService } from '../Services/main-home-serv.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rfq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rfq.component.html',
  styleUrl: './rfq.component.css'
})
export class RfqComponent implements OnInit {

  rfqContent: string = '';
  isLoading: boolean = true;

  constructor(private dialogRef: MatDialogRef<RfqComponent>,  private homeService: MainHomeServService ){}

   ngOnInit(): void {
    this.homeService.mainRfq().subscribe({
      next: (response) => {
        this.rfqContent = response;
        this.isLoading = false;
        console.log('Data RFQ diterima:', response);
      },
      error: (err) => {
        console.error('Gagal mengambil data RFQ:', err);
        this.rfqContent = 'Gagal memuat konten. Silakan coba lagi nanti.';
        this.isLoading = false;
      }
    });
  }

  closeForm() {
    this.dialogRef.close(true);
  }

}
