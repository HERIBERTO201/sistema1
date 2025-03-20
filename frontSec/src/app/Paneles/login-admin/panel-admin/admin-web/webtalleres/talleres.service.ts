import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TalleresService {

  private apiUrl = 'http://localhost:3000/talleres';

  constructor(private http: HttpClient) {}

  getTalleres(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  createTaller(taller: any, imagen: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('Taller', taller.Taller);
    formData.append('Contenido', taller.Contenido);
    if (imagen) {
      formData.append('imagen', imagen, imagen.name);
    }
    return this.http.post<any>(`${this.apiUrl}`, formData);
  }

  updateTaller(idTaller: number, contenido: any, imagen?: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('Contenido', contenido);
    if (imagen) {
        formData.append('imagen', imagen, imagen.name);
    }
    return this.http.put<any>(`${this.apiUrl}/${idTaller}`, formData);
  }

  updateTallerVisibility(idTaller: number, visible: boolean): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/visible/${idTaller}`, { Visible: visible });
  }

}
