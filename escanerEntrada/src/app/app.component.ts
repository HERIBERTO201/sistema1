// escanerEntrada/src/app/app.component.ts
import { Component, HostListener, ChangeDetectorRef } from '@angular/core';
import { AsistenciaService } from './asistencia.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule, NgIf],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'escanerEntrada';
  matricula: string = '';
  valido: boolean = false;
  invalido: boolean = false;
  solonumeros: boolean = false;
  datosAsistencia: any = null;
  
  constructor(private asistenciaService: AsistenciaService, private cdr: ChangeDetectorRef) {}

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const input = document.getElementById('barcodeInput') as HTMLInputElement;
    if (input) {
      input.focus();
    }
  }

  enviarAsistencia() {
    if (!/^\d+$/.test(this.matricula)) {
      console.error('La matrícula debe contener solo números.');
      this.solonumeros = true;
      return;
    }

    this.asistenciaService.enviarAsistencia(this.matricula).subscribe(
      response => {
        console.log('Asistencia y datos de hoy:', response);
        this.valido = true;
        this.invalido = false;
        this.solonumeros = false;
      },
      error => {
        console.error('Error al enviar asistencia o al obtener datos:', error);
        this.invalido = true;
        this.valido = false;
        this.solonumeros = false;
      }
    );
  }
}