import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { saveAs } from 'file-saver';

import { MainHomeServService } from '../Services/main-home-serv.service';
import { AboutComponent } from '../about/about.component';
import { HelpComponent } from '../help/help.component';
import { RfqComponent } from '../rfq/rfq.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  constructor(
    private fileService: MainHomeServService,
    private dialog: MatDialog
  ) {}

  // --- Dialog helper agar konsisten dengan header-nav ---
  private openSheet<T>(comp: T): void {
    this.dialog.open(comp as any, {
      maxHeight: '90vh',
      maxWidth: '700px',
      width: '90%',
      disableClose: true,
      panelClass: 'custom-dialog-container',
      autoFocus: 'h2'
    });
  }

  openAbout(ev?: Event) {
    ev?.preventDefault();
    this.openSheet(AboutComponent);
  }

  openRFQ(ev?: Event) {
    ev?.preventDefault();
    this.openSheet(RfqComponent);
  }

  openHelp(ev?: Event) {
    ev?.preventDefault();
    this.openSheet(HelpComponent);
  }

  downloadFile(filename: string): void {
    this.fileService.download(filename).subscribe({
      next: (blob) => saveAs(blob, filename),
      error: (error) => {
        console.error('Download gagal:', error);
        alert(`Gagal mengunduh file: ${filename}. Pastikan file ada di server.`);
      }
    });
  }
}
