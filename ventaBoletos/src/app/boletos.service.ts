import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class BoletosService {

  constructor(private http: HttpClient) { }

  getAlumnosNombres(): Observable<any> {
    return this.http.get<any>('http://localhost:3000/alumnos-nombres');
  }

  getboletosmatricula( matricula:number ): Observable<any>{
    return this.http.get<any>(`http://localhost:3000/pases-camion?matricula=${matricula}`)
  }

  getRutasCamiones(): Observable<any> {
    return this.http.get<any>('http://localhost:3000/rutascamiones');
  }

  getRutasCamionesActivas(): Observable<any> {
    return this.http.get<any>('http://localhost:3000/rutascamiones/activas');
  }

  updateRuta(IDRuta: number, rutaData: { Ruta: string; Contrasena: string; Activa: boolean }): Observable<any> {
    return this.http.put<any>(`http://localhost:3000/rutascamiones/${IDRuta}`, rutaData);
  }

  DarRuta(matricula: string, idRuta: string) {
    const body = { Matricula: matricula, IDRuta: idRuta };
    return this.http.post(`http://localhost:3000/pasoscamion/asignar`, body);
  }

  CrearRuta(ruta: string, contrasena: string, activa: number): Observable<any> {
    const body = {Ruta: ruta,Contrasena: contrasena,Activa: activa};
    return this.http.post(`http://localhost:3000/crearrutas`, body);
  }

  DarPases(pases: number, matricula: number, idRuta: number): Observable<any> {
    const body = { Pases: pases, Matricula: matricula, IDRuta: idRuta };
    return this.http.put(`http://localhost:3000/pasescamionput`, body);
  }
  

}
