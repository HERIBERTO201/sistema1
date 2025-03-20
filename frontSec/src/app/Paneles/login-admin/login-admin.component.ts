import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule} from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, style, transition, animate } from '@angular/animations';
import { AuthAdminService } from './auth-admin.service';
import { Router } from '@angular/router';
import { MostrarContenidoService } from '../../mostrar-contenido.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { EventEmitter, Output } from '@angular/core';



@Component({
  selector: 'app-login-admin',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './login-admin.component.html',
  styleUrl: './login-admin.component.css',
  animations: [
    trigger('fade', [
      transition(':enter',
         [style({ opacity: 0 }),
          animate('1000ms ease-in', style({ opacity: 1 }))]),
      transition(':leave', 
        [animate('1ms ease-out', style({ opacity: 0 }))])])]
})
export class LoginAdminComponent {

  @Output() loginEvent = new EventEmitter<void>();

  Cuenta: string = '';
  Contrasena: string = '';

  constructor(private authAdmin: AuthAdminService, private router: Router, private mostrarContenido: MostrarContenidoService) {}

  onSubmit() {
    this.authAdmin.login(this.Cuenta, this.Contrasena).subscribe(
      (response: any) => {
        localStorage.setItem('adminToken', response.token);
        alert('Login exitoso');
        this.logear();
      },
      error => {
        alert('Contraseña o numero de cuenta incorrecta');
      }
    );
  }

  logear() {
    this.mostrarContenido.emitLoginEvent();
    this.router.navigate(['/panelAdmin']);
  }
}
