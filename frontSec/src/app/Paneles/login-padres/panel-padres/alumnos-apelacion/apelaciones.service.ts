import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApelacionesService {

  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getAlumnosPorPadres(idPadres: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/alumnos/padres/${idPadres}`);
  }

  getAsistenciaAlumno(matricula: string, fecha: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/asistencia-alumno`, {
      params: { matricula, fecha }
    });
  }

  enviarApelacion(idPadres: number, idRegistro: number, mensaje: string, fecha: string, imagen?: File): Observable<any> {
    const formData = new FormData();
    formData.append('idPadres', idPadres.toString());
    formData.append('idRegistro', idRegistro.toString());
    formData.append('mensaje', mensaje);
    formData.append('fecha', fecha);
    
    if (imagen) {
        formData.append('imagen', imagen);
    }

    return this.http.post(`${this.apiUrl}/apelaciones`, formData);
  }
}