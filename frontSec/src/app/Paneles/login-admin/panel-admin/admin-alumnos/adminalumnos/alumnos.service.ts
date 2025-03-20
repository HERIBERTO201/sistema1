import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlumnosService {

  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getAlumnos(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/alumnos`);
  }

  getTurnos(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/turnos`);
  }

  getSalones(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/salones`);
  }

  getPadres(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/padres`);
  }

  crearAlumno(alumno: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/alumnos`, alumno);
  }

  actualizarFamilia(matricula: string, idPadres: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/alumnos/familia`, { Matricula: matricula, IDPadres: idPadres });
  }

  actualizarAlumno(matricula: string, alumno: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/alumnos/${matricula}`, alumno);
  }

  getQrCode(matricula: string): Observable<Blob> {
    const url = `${this.apiUrl}/qr/${matricula}`;
    return this.http.get(url, { responseType: 'blob' });
  }
  
}
