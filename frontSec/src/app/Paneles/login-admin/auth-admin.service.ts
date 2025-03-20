import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthAdminService {

  private apiUrl = 'http://localhost:3000/admin-login';

  constructor(private http: HttpClient) {}

  login(Cuenta: string, Contrasena: string): Observable<any> {
    return this.http.post(this.apiUrl, { Cuenta, Contrasena }).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('adminToken', response.token);
        }
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('adminToken');
  }

  logout(): void {
    localStorage.removeItem('adminToken');
  }
}
