import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class AuthPadresService {

  private apiUrl = 'http://localhost:3000/login';

  constructor(private http: HttpClient) {}

  login(IDPadres: string, Contrasena: string): Observable<any> {
    return this.http.post(this.apiUrl, { IDPadres, Contrasena }).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // Verifica si existe un token
  }

  logout(): void {
    localStorage.removeItem('token'); // Elimina el token al cerrar sesión
  }

}
