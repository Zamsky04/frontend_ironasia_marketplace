import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-categories-card',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './categories-card.component.html',
  styleUrl: './categories-card.component.css',
})
export class CategoriesCardComponent {
  @Input() item: any;
}
