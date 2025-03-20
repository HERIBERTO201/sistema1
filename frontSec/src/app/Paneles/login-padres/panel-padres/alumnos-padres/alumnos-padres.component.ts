import { Component, OnInit } from '@angular/core';
import { HijosService } from './hijos.service';
import { IdpadresService } from '../idpadres.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-alumnos-padres',
  standalone: true,
  imports: [CommonModule, FormsModule, NgFor],
  templateUrl: './alumnos-padres.component.html',
  styleUrl: './alumnos-padres.component.css'
})
export class AlumnosPadresComponent implements OnInit {

  alumnos: any[] = [];
  qrImageUrl: string | null = null;

  constructor(private hijosService: HijosService, private idPadresService: IdpadresService) { }

  ngOnInit(): void {
    this.getAlumnos();
  }

  getAlumnos() {
    const idPadres = this.idPadresService.getIdPadres();
    if (idPadres !== null) {
      this.hijosService.getAlumnosPorPadres(idPadres).subscribe(
        (data) => {
          this.alumnos = data;
          console.log('Alumnos:', this.alumnos);
        },
        (error) => {
          console.error('Error al obtener los alumnos:', error);
        }
      );
    }
  }

  verQR(matricula: string) {
    this.hijosService.getQrCode(matricula).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      this.qrImageUrl = url;
      const a = document.createElement('a');
      a.href = url;
      a.download = `${matricula}.png`;
      a.click();
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error('Error al obtener el código QR:', error);
    });
  }

  descargarHorarioPDF(idSalon: number) {
    this.hijosService.getHorarioPDF(idSalon).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `horario_${idSalon}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error('Error al descargar el PDF:', error);
    });
  }



}
