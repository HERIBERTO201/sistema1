import { Component, OnInit } from '@angular/core';
import { MatCalendar } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ApelacionesService } from './apelaciones.service';
import { IdpadresService } from '../idpadres.service';

@Component({
  selector: 'app-alumnos-apelacion',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './alumnos-apelacion.component.html',
  styleUrl: './alumnos-apelacion.component.css'
})

export class AlumnosApelacionComponent implements OnInit {
  alumnos: any[] = [];
  alumnoSeleccionado: string = '';
  fechaSeleccionada: string = '';
  mostrarCalendarioSection: boolean = false;
  mostrarEstadoSection: boolean = false;
  estadoAsistencia: any = null;
  mensajeApelacion: string = '';
  imagenSeleccionada: File | null = null;

  constructor(private apelacionesService: ApelacionesService, private idPadresService: IdpadresService) { }

  ngOnInit(): void {
    const idPadres = localStorage.getItem('idPadres');
    if (idPadres) {
      this.apelacionesService.getAlumnosPorPadres(Number(idPadres))
        .subscribe(data => {
          this.alumnos = data;
        });
    }
  }

  mostrarCalendario() {
    this.mostrarCalendarioSection = true;
    this.mostrarEstadoSection = false;
    this.estadoAsistencia = null;
  }

  mostrarEstado() {
    if (this.alumnoSeleccionado && this.fechaSeleccionada) {
      this.apelacionesService.getAsistenciaAlumno(this.alumnoSeleccionado, this.fechaSeleccionada)
        .subscribe(data => {
          this.estadoAsistencia = data;
          this.mostrarEstadoSection = true;
        });
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imagenSeleccionada = file;
    }
  }

  enviarApelacion() {
    if (!this.mensajeApelacion) {
      alert('Por favor, escriba un mensaje para la apelación');
      return;
    }

    const idPadres = Number(localStorage.getItem('idPadres'));
    if (!idPadres) {
      alert('Error: No se encontró el ID del padre');
      return;
    }

    if (!this.estadoAsistencia?.IDRegistro) {
      alert('Error: No hay un registro de asistencia para apelar');
      return;
    }

    this.apelacionesService.enviarApelacion(
      idPadres,
      this.estadoAsistencia.IDRegistro,
      this.mensajeApelacion,
      this.fechaSeleccionada,
      this.imagenSeleccionada!
    ).subscribe(
      response => {
        alert('Apelación enviada con éxito');
        this.mensajeApelacion = '';
        this.imagenSeleccionada = null;
      },
      error => {
        console.error('Error al enviar la apelación:', error);
        alert('Error al enviar la apelación');
      }
    );
  }
}
