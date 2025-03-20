import { Component, EventEmitter, Output } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { MostrarContenidoService } from '../../../mostrar-contenido.service';
import { Router, NavigationEnd } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-panel-admin',
  standalone: true,
  imports: [RouterOutlet, RouterModule,CommonModule],
  templateUrl: './panel-admin.component.html',
  styleUrl: './panel-admin.component.css',
  animations: [
    trigger('fade', [
      transition(':enter',
         [style({ opacity: 0 }),
          animate('1000ms ease-in', style({ opacity: 1 }))]),
      transition(':leave', 
        [animate('1ms ease-out', style({ opacity: 0 }))])])]
})
export class PanelAdminComponent {

  constructor(private router: Router, private mostrarContenidoService: MostrarContenidoService) {}

  @Output() logoutEvent = new EventEmitter<void>();

  cerrarSesion() {
    this.mostrarContenidoService.emitLogout();
    this.router.navigate(['/portalPadres']);
  }

}
