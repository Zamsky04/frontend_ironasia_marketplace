import {  Component, Input, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Carousel } from 'primeng/carousel';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, Carousel],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent{
  @Input() showArrows: boolean = false; // Default: No arrows
  @Input() items: any[] = [];
  @ViewChild(Carousel) carousel: Carousel | undefined;

  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 1,
      numScroll: 1
    },
    {
      breakpoint: '768px',
      numVisible: 1,
      numScroll: 1
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];
}
