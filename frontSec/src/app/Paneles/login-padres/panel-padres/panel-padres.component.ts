import { Component, EventEmitter, Output } from '@angular/core';
import { AlumnosPadresComponent } from './alumnos-padres/alumnos-padres.component';
import { AlumnosApelacionComponent } from './alumnos-apelacion/alumnos-apelacion.component';
import { trigger, style, transition, animate } from '@angular/animations';
import { MostrarContenidoService } from '../../../mostrar-contenido.service';
import { Router, NavigationEnd } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-panel-padres',
  standalone: true,
  imports: [RouterOutlet, RouterModule,CommonModule],
  templateUrl: './panel-padres.component.html',
  styleUrl: './panel-padres.component.css',
  animations: [
    trigger('fade', [
      transition(':enter',
         [style({ opacity: 0 }),
          animate('1000ms ease-in', style({ opacity: 1 }))]),
      transition(':leave', 
        [animate('1ms ease-out', style({ opacity: 0 }))])])]
})
export class PanelPadresComponent {

  constructor(private router: Router, private mostrarContenidoService: MostrarContenidoService) {}

  @Output() logoutEvent = new EventEmitter<void>();

  cerrarSesion() {
    this.mostrarContenidoService.emitLogout();
    this.router.navigate(['/portalPadres']);
  }

  

}
