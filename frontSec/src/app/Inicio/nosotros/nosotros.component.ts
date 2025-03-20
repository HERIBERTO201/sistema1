import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule} from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [],
  templateUrl: './nosotros.component.html',
  styleUrl: './nosotros.component.css',
  animations: [
    trigger('fade', [
      transition(':enter',
         [style({ opacity: 0 }),
          animate('1000ms ease-in', style({ opacity: 1 }))]),
      transition(':leave', 
        [animate('1ms ease-out', style({ opacity: 0 }))])])]
})
export class NosotrosComponent {

}
