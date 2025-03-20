import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnunciosService {

  private apiUrl = 'http://localhost:3000/anuncios';

  constructor(private http: HttpClient) {}

  getAnuncios(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  createAnuncio(anuncio: any, imagen: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('Titulo', anuncio.Titulo);
    formData.append('Contenido', anuncio.Contenido);
    if (imagen) {
      formData.append('imagen', imagen, imagen.name);
    }
    return this.http.post<any>(`${this.apiUrl}`, formData);
  }

  updateAnuncio(idAnuncio: number, anuncio: any, imagen?: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('Titulo', anuncio.Titulo);
    formData.append('Contenido', anuncio.Contenido);
    if (imagen) {
      formData.append('imagen', imagen, imagen.name);
    }
    return this.http.put<any>(`${this.apiUrl}/${idAnuncio}`, formData);
  }

  veranuncio(idAnuncio: number, visible: boolean): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/visible/${idAnuncio}`, { Visible: visible });
  }

  

  
}
