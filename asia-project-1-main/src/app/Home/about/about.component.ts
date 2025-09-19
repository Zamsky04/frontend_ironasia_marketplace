import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MainHomeServService } from '../Services/main-home-serv.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements  OnInit {

  aboutContent: string = '';
  isLoading: boolean = true;

  constructor(private dialogRef: MatDialogRef<AboutComponent>,  private homeService: MainHomeServService ){}

   ngOnInit(): void {
    this.homeService.mainAbout().subscribe({
      next: (response) => {
        this.aboutContent = response;
        this.isLoading = false;
        console.log('Data RFQ diterima:', response);
      },
      error: (err) => {
        console.error('Gagal mengambil data RFQ:', err);
        this.aboutContent = 'Gagal memuat konten. Silakan coba lagi nanti.';
        this.isLoading = false;
      }
    });
  }

  closeForm() {
    this.dialogRef.close(true);
  }

}
