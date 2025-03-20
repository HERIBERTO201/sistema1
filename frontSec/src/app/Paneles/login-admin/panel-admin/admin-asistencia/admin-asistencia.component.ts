import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { AsistenciaService } from './asistencia.service';
import { SalonesService } from '../../panel-admin/admin-escolar/adminsalones/salones.service';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-admin-asistencia',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    NgIf, 
    RouterModule, 
    NgFor,
    MatTableModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  templateUrl: './admin-asistencia.component.html',
  styleUrl: './admin-asistencia.component.css'
})
export class AdminAsistenciaComponent implements OnInit {

  mostrarReportes = true;
  mostrarAsistencia = false;
  mostrarJustificacion = false;
  salones: any[] = [];
  salonSeleccionado: string = '';
  tipoReporte: string = '';
  fechaSeleccionada: string = '';
  fechaAsistencia: string = '';
  fechaApelacion: string = '';
  displayedColumns: string[] = ['matricula', 'nombre', 'horaEntrada', 'estado'];
  dataSource: any[] = [];
  estadosAsistencia: any[] = [];
  @ViewChild(MatTable) table!: MatTable<any>;
  apelaciones: any[] = [];
  columnasApelaciones: string[] = ['matricula', 'nombre', 'mensaje', 'documento'];

  constructor(private asistenciaService: AsistenciaService, private salonesService: SalonesService) { }
  
  ngOnInit() {
    this.obtenerSalones();
    this.obtenerEstadosAsistencia();
  }

  verReportes(){
    this.mostrarReportes = true;
    this.mostrarAsistencia = false;
    this.mostrarJustificacion = false;
  }

  verAsistencia(){
    this.mostrarAsistencia = true;
    this.mostrarReportes = false;
    this.mostrarJustificacion = false;
  }

  verJustificacion(){
    this.mostrarJustificacion = true;
    this.mostrarReportes = false;
    this.mostrarAsistencia = false;
  }

  obtenerSalones() {
    this.salonesService.getSalones().subscribe(
      (data) => {
        this.salones = data;
        console.log('Salones:', this.salones);
      },
      (error) => {
        console.error('Error al obtener los salones:', error);
      }
    );
  }

  obtenerEstadosAsistencia() {
    this.asistenciaService.getEstadosAsistencia().subscribe(
      (data) => {
        this.estadosAsistencia = data;
      },
      (error) => {
        console.error('Error al obtener estados de asistencia:', error);
      }
    );
  }

  cargarAsistencias() {
    if (this.salonSeleccionado && this.fechaAsistencia) {
      this.asistenciaService.getAsistenciaSalon(this.salonSeleccionado, this.fechaAsistencia)
        .subscribe(
          (data) => {
            this.dataSource = data;
            if (this.table) {
              this.table.renderRows();
            }
          },
          (error) => {
            console.error('Error al cargar asistencias:', error);
          }
        );
    }
  }

  actualizarEstado(element: any, nuevoEstado: number) {
    this.asistenciaService.actualizarAsistencia(
      element.Matricula,
      this.fechaAsistencia,
      nuevoEstado
    ).subscribe(
      () => {
        element.IDEstado = nuevoEstado;
        element.Estado = this.estadosAsistencia.find(e => e.IDEstado === nuevoEstado)?.Estado;
        if (this.table) {
          this.table.renderRows();
        }
      },
      (error) => {
        console.error('Error al actualizar asistencia:', error);
      }
    );
  }

  mostrarPDF() {
    if (this.tipoReporte === 'diario') {
      console.log('Fecha seleccionada:', this.fechaSeleccionada);
      console.log('ID del salón seleccionado:', this.salonSeleccionado);

      this.asistenciaService.generarPDF(this.salonSeleccionado, this.fechaSeleccionada).subscribe(
        (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `asistencia_${this.salonSeleccionado}_${this.fechaSeleccionada}.pdf`;
          a.click();
          window.URL.revokeObjectURL(url);
        },
        (error) => {
          console.error('Error al generar el PDF:', error);
        }
      );
    } else if (this.tipoReporte === 'semanal') {
      this.asistenciaService.generarPDFSemanal(this.salonSeleccionado, this.fechaSeleccionada).subscribe(
        (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `asistencia_semanal_${this.salonSeleccionado}_${this.fechaSeleccionada}.pdf`;
          a.click();
          window.URL.revokeObjectURL(url);
        },
        (error) => {
          console.error('Error al generar el PDF semanal:', error);
        }
      );
    }
  }

  limpiarFecha() {
    this.fechaApelacion = '';
    this.apelaciones = [];
  }

  cargarApelaciones() {
    if (this.salonSeleccionado && this.fechaApelacion) {
      this.asistenciaService.getApelacionesPorSalonFecha(this.salonSeleccionado, this.fechaApelacion)
        .subscribe(
          data => {
            this.apelaciones = data;
          },
          error => {
            console.error('Error al cargar apelaciones:', error);
          }
        );
    }
  }
}
