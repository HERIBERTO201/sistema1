// escanerEntrada/src/app/asistencia.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {

  private apiUrl = 'http://localhost:3000/asistencia';
  private asistenciaHoyUrl = 'http://localhost:3000/asistencia/hoy';

  constructor(private http: HttpClient) { }

  enviarAsistencia(matricula: string): Observable<any> {
    return this.http.post(this.apiUrl, { Matricula: matricula }).pipe(
      tap(response => {
        console.log('Asistencia enviada:', response);
      }),
      switchMap(() => this.obtenerAsistenciaHoy(matricula))
    );
  }

  obtenerAsistenciaHoy(matricula: string): Observable<any> {
    return this.http.get(`${this.asistenciaHoyUrl}?matricula=${matricula}`);
  }
}