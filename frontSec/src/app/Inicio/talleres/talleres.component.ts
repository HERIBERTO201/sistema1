import { Component, OnInit } from '@angular/core';
import { TalleresService } from './talleres.service';
import { RouterOutlet } from '@angular/router';
import { RouterModule} from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, style, transition, animate } from '@angular/animations';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-talleres',
  standalone: true,
  imports: [CommonModule, NgFor],
  templateUrl: './talleres.component.html',
  styleUrl: './talleres.component.css',
  animations: [
    trigger('fade', [
      transition(':enter',
         [style({ opacity: 0 }),
          animate('1000ms ease-in', style({ opacity: 1 }))]),
      transition(':leave', 
        [animate('1ms ease-out', style({ opacity: 0 }))])])]
})
export class TalleresComponent implements OnInit {
  talleres: any[] = [];

  constructor(private talleresService: TalleresService) {}

  ngOnInit(): void {
    this.talleresService.getTalleresDetalles().subscribe(
      (data) => {
        this.talleres = data;
        console.log('Talleres recibidos:', this.talleres);
      },
      (error) => {
        console.error('Error al obtener talleres:', error);
      }
    );
  }
}
