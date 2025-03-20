import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthPadresService } from './auth-padres.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authPadres: AuthPadresService, private router: Router) {}

  canActivate(): boolean {
    if (this.authPadres.isLoggedIn()) {
      return true; // Permitir acceso a la ruta
    } else {
      this.router.navigate(['/panelPadres']); // Redirigir al login si no está autenticado
      return false;
    }
  }


}
