import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TurnosService {

  private apiUrl = 'http://localhost:3000/turnos';

  constructor(private http: HttpClient) { }


  getTurnos(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }


  createTurno(nombre: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { Nombre: nombre });
  }


  updateTurno(idTurno: number, nombre: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${idTurno}`, { Nombre: nombre });
  }
}
