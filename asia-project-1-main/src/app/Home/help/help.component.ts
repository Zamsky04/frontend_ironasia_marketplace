import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MainHomeServService } from '../Services/main-home-serv.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './help.component.html',
  styleUrl: './help.component.css'
})
export class HelpComponent implements OnInit { 

  helpContent: string = '';
  isLoading: boolean = true;

  constructor(private dialogRef: MatDialogRef<HelpComponent>,  private homeService: MainHomeServService ){}

   ngOnInit(): void {
    this.homeService.mainHelp().subscribe({
      next: (response) => {
        this.helpContent = response; 
        this.isLoading = false;   
        console.log('Data RFQ diterima:', response);
      },
      error: (err) => {
        console.error('Gagal mengambil data RFQ:', err);
        this.helpContent = 'Gagal memuat konten. Silakan coba lagi nanti.';
        this.isLoading = false;    
      }
    });
  }
  
  closeForm() {
    this.dialogRef.close(true);
  }

}
