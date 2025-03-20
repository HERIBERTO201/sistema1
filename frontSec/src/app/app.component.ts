import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule} from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginPadresComponent } from './Paneles/login-padres/login-padres.component';
import { trigger, style, transition, animate } from '@angular/animations';
import { LoginAdminComponent } from './Paneles/login-admin/login-admin.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthPadresService } from './Paneles/login-padres/auth-padres.service';
import { Router, NavigationEnd } from '@angular/router';
import { MostrarContenidoService } from './mostrar-contenido.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [HttpClientModule],
  animations: [
    trigger('fade', [
      transition(':enter',
         [style({ opacity: 0 }),
          animate('1000ms ease-in', style({ opacity: 1 }))]),
      transition(':leave', 
        [animate('1ms ease-out', style({ opacity: 0 }))])])]
})

export class AppComponent {
  title = 'frontSec';
  selectOption: string = "Nosotros";
  
  constructor(private authPadresService: AuthPadresService, private router: Router, private mostrarContenido: MostrarContenidoService){
    this.mostrarContenido.loginEvent$.subscribe(() => {
      this.onLoginEvent();
    });

    this.mostrarContenido.logout$.subscribe(() => {
      this.cerrarSesion();
    });
    
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = this.router.url;
        this.mostrarinicio = !url.startsWith('/panelAdmin') && !url.startsWith('/panelPadres');
      }
    });



    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/panelPadres') {
          this.onLoginEvent();
        }
        if (event.url === '/portalPadres') {
          this.cerrarSesion();
        }
        if (event.url === '/panelAdmin') {
          this.onLoginEvent();
        }
      }
    });
  }
  
  onOptionSelected(option: string, event?: MouseEvent): void {
    event?.preventDefault();
    this.selectOption = option; 
  }

  mostrarinicio: boolean = true;

  loginpadres(){
    this.mostrarinicio = false;
  }

  cerrarSesion() {
    this.mostrarinicio = true;
  }

  onLoginEvent() {
    this.loginpadres();
  }

  

}
