import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalonesService {

  private apiUrl = 'http://localhost:3000/salones';

  constructor(private http: HttpClient) { }

  getSalones(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getHorario(idSalon: number): Observable<any> {
    const url = `${this.apiUrl}/${idSalon}/horario`;
    return this.http.get<any>(url);
  }

  addSalon(IDSalon: number, Nombre: string, IDTurno: number): Observable<any> {
    const body = { IDSalon, Nombre, IDTurno };
    return this.http.post<any>(`${this.apiUrl}`, body);
  }

  updateSalon(idSalon: number, newIDSalon: number, Nombre: string, IDTurno: number): Observable<any> {
    const url = `${this.apiUrl}/${idSalon}`;
    const body = { newIDSalon, Nombre, IDTurno };
    return this.http.put<any>(url, body);
  }

  updateHorario(idSalon: number, diaSemana: string, entrada: string, salida: string): Observable<any> {
    const url = `${this.apiUrl}/${idSalon}/horario`;
    const body = { diaSemana, entrada, salida };
    return this.http.put<any>(url, body);
  }

  dochorariopost(IDSalon: number, pdfFile: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('IDSalon', IDSalon.toString());
    formData.append('pdf', pdfFile, pdfFile.name);
    return this.http.post<any>(`${this.apiUrl}/horariosdoc`, formData);
  }

  getHorarioPDF(idSalon: number): Observable<Blob> {
    const url = `http://localhost:3000/salones/${idSalon}/horariosdoc`;
    return this.http.get(url, { responseType: 'blob' });
  }


  
}
