import { Component, OnInit } from '@angular/core';
import { NoticiasService } from './noticias.service';
import { RouterOutlet } from '@angular/router';
import { RouterModule} from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, style, transition, animate } from '@angular/animations';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-noticias',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf],
  templateUrl: './noticias.component.html',
  styleUrl: './noticias.component.css',
  animations: [
    trigger('fade', [
      transition(':enter',
         [style({ opacity: 0 }),
          animate('1000ms ease-in', style({ opacity: 1 }))]),
      transition(':leave', 
        [animate('1ms ease-out', style({ opacity: 0 }))])])]
})
export class NoticiasComponent implements OnInit {
  noticias: any[] = [];

  constructor(private noticiasService: NoticiasService) { }

  ngOnInit(): void {
    this.noticiasService.getNoticias().subscribe(
      (data) => {
        this.noticias = data;
        console.log('Noticias recibidas:', this.noticias);
      },
      (error) => {
        console.error('Error al obtener noticias:', error);
      }
    );
  }

  formatearFecha(fecha: string): string {
    const opciones: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES', opciones);
  }
}
