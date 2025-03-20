import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PadresService {

  private apiUrl = 'http://localhost:3000/padres';

  constructor(private http: HttpClient) { }

  getPadresDetalles(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/detalles`);
  }

  agregarPadre(padre: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, padre);
  }

  actualizarPadre(idPadres: number, padreData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${idPadres}`, padreData);
  }
  
}
