import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IdpadresService {

  constructor() { 
    this.idPadres = this.loadIdPadres();
  }

  private idPadres: number | null = null;

  setIdPadres(id: number): void {
    this.idPadres = id;
    localStorage.setItem('idPadres', id.toString());
  }

  getIdPadres(): number | null {
    return this.idPadres;
  }

  private loadIdPadres(): number | null {
    const storedId = localStorage.getItem('idPadres');
    return storedId ? parseInt(storedId, 10) : null;
  }
}
