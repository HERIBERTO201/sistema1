import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HijosService {

  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getAlumnosPorPadres(idPadres: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/alumnos/padres/${idPadres}`);
  }

  getQrCode(matricula: string): Observable<Blob> {
    const url = `${this.apiUrl}/qr/${matricula}`;
    return this.http.get(url, { responseType: 'blob' });
  }

  getHorarioPDF(idSalon: number): Observable<Blob> {
    const url = `${this.apiUrl}/salones/${idSalon}/horariosdoc`;
    return this.http.get(url, { responseType: 'blob' });
  }

}
