import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule} from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, style, transition, animate } from '@angular/animations';
import { AlumnosPadresComponent } from './panel-padres/alumnos-padres/alumnos-padres.component';
import { AlumnosApelacionComponent } from './panel-padres/alumnos-apelacion/alumnos-apelacion.component';
import { AuthPadresService } from './auth-padres.service';
import { MostrarContenidoService } from '../../mostrar-contenido.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { EventEmitter, Output } from '@angular/core';
import { IdpadresService } from './panel-padres/idpadres.service';


@Component({
  selector: 'app-login-padres',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './login-padres.component.html',
  styleUrl: './login-padres.component.css',
  providers: [HttpClient],
  animations: [
    trigger('fade', [
      transition(':enter',
         [style({ opacity: 0 }),
          animate('1000ms ease-in', style({ opacity: 1 }))]),
      transition(':leave', 
        [animate('1ms ease-out', style({ opacity: 0 }))])])]
})

export class LoginPadresComponent {

  @Output() loginEvent = new EventEmitter<void>();

  selectOption = '';
  IDPadres: string = '';
  contrasena: string = '';

  constructor(private authService: AuthPadresService, private router: Router, private mostrarContenido: MostrarContenidoService, private idPadresService: IdpadresService) {}


  onSubmit() {
    this.authService.login(this.IDPadres, this.contrasena).subscribe(
      (response: any) => {
        localStorage.setItem('token', response.token);
        alert('Login exitoso');
        this.idPadresService.setIdPadres(parseInt(this.IDPadres));
        this.logear();
      },
      error => {
        alert('Credenciales incorrectas');
      }
    );
  }

  logear() {
    this.mostrarContenido.emitLoginEvent();
    this.router.navigate(['/panelPadres']);
  }
}
