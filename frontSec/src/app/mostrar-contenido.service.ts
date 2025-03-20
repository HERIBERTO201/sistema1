import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MostrarContenidoService {

  constructor() { }

  private loginEventSubject = new Subject<void>();
  loginEvent$ = this.loginEventSubject.asObservable();

  emitLoginEvent() {
    this.loginEventSubject.next();
  }

  private logoutSubject = new Subject<void>();
  logout$ = this.logoutSubject.asObservable();
  emitLogout() {
    this.logoutSubject.next();
  }

  

  


  


}
