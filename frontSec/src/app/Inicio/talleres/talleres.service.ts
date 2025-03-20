import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TalleresService {

  private apiUrl = 'http://localhost:3000/talleres';

  constructor(private http: HttpClient) {}

  getTalleresDetalles(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/detalles`);
  }
}
