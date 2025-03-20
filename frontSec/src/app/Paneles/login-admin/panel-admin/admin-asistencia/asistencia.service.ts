import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getSalones(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/salones`);
  }

  generarPDF(idSalon: string, fecha: string): Observable<Blob> {
    const url = `${this.apiUrl}/generar-pdf?idSalon=${idSalon}&fecha=${fecha}`;
    return this.http.get(url, { responseType: 'blob' });
  }

  generarPDFSemanal(idSalon: string, fecha: string): Observable<Blob> {
    const url = `${this.apiUrl}/generar-pdf-semanal?idSalon=${idSalon}&fecha=${fecha}`;
    return this.http.get(url, {
        responseType: 'blob'
    });
  }

  getAsistenciaSalon(idSalon: string, fecha: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/asistencia-salon?idSalon=${idSalon}&fecha=${fecha}`);
  }

  getEstadosAsistencia(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/estadosAsistencia`);
  }

  actualizarAsistencia(matricula: string, fecha: string, idEstado: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/actualizar-asistencia`, {
      matricula,
      fecha,
      idEstado
    });
  }

  
  getApelacionesPorSalonFecha(idSalon: string, fecha: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/apelaciones-por-salon-fecha?idSalon=${idSalon}&fecha=${fecha}`);
  }
}
