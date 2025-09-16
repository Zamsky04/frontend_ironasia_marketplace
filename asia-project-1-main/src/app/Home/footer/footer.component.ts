import { Component } from '@angular/core';

import { saveAs } from 'file-saver';
import { MainHomeServService } from '../Services/main-home-serv.service';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
   constructor(private fileService: MainHomeServService) {}

  downloadFile(filename: string): void {
    this.fileService.download(filename).subscribe(
      (blob) => {
        saveAs(blob, filename);
      },
      (error) => {
        console.error('Download gagal:', error);
        alert(`Gagal mengunduh file: ${filename}. Pastikan file ada di server.`);
      }
    );
  }
}
