import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MegaMenuModule } from 'primeng/megamenu';
import { PrimeIcons } from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MegaMenuModule],
  providers: [PrimeIcons],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
}