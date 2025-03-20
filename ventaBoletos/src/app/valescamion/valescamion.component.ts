import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BoletosService } from '../boletos.service';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-valescamion',
  standalone: true,
  imports: [ MatTableModule, RouterModule, NgIf, MatFormFieldModule, NgFor, FormsModule],
  templateUrl: './valescamion.component.html',
  styleUrl: './valescamion.component.css',
})
export class ValescamionComponent implements OnInit{

  asignacion: boolean = false;
  vision: boolean = false;

  title = 'ventaBoletos';
  rutasactivas: any[] = [];
  alumnos: any[] = [];
  boletos: any[] = [];
  alumno: any = { Matricula: '', Nombre: ''};
  filteredAlumnos: any[] = [];
  displayedColumns: string[] = ['Matricula', 'Nombre', 'Opciones'];

  constructor(private boletosService: BoletosService) { }

  ngOnInit(): void {
    this.loadAlumnosNombres();
    this.verrutasactivas();
  }

  loadAlumnosNombres(): void {
    this.boletosService.getAlumnosNombres().subscribe(
      (data) => {
        this.alumnos = data;
        this.filteredAlumnos = this.alumnos;
      },
      (error) => {
        console.error('Error al cargar los alumnos:', error);
      }
    );
  }
  
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredAlumnos = this.alumnos.filter(alumno => {
      const matricula = alumno.Matricula.toString(); // Convertir a cadena
      const nombre = alumno.Nombre.toLowerCase(); // Asegurarse de que es string y pasar a minúsculas
      return matricula.includes(filterValue) || nombre.includes(filterValue);
    });
  }

  verBoletos(matricula: number) {
    this.asignacion = false;
    this.vision = true;
    this.boletosService.getboletosmatricula(matricula).subscribe(
      (data) => {
        this.boletos = data;
      },
      (error) => {
        console.error('Error al obtener los boletos:', error);
      }
    );
  }



  verrutasactivas() {
    this.boletosService.getRutasCamionesActivas().subscribe(
      (data) => {
        this.rutasactivas = data;
        console.log(data);
      },
      (error) => {
        console.error('Error al cargar las rutas activas:', error);
      }
    );
  }

  asignarRuta(alumno: any){
    this.alumno = { Matricula: alumno.Matricula, Nombre: alumno.Nombre};
    this.vision = false;
    this.asignacion = true;
    console.log(this.alumno);
  }

  DarRuta() {
    console.log(this.rutaseleccionada)
    if (!this.rutaseleccionada) {
      console.error('Selecciona una ruta');
      return;
    }
    this.boletosService.DarRuta(this.alumno.Matricula, this.rutaseleccionada)
      .subscribe(
        response => {
          console.log('Ruta asignada con éxito:', response);
        },
        error => {
          console.error('Error al asignar la ruta:', error);
        }
      );
      this.asignacion = false;
  }


  rutaseleccionada: string | undefined;

  DarPases(element: any, cambio: number): void {
    const nuevoPases = element.Pases + cambio;
    console.log(element , cambio);
    if (nuevoPases < 0) return; // Evita valores negativos

    this.boletosService.DarPases(nuevoPases, element.Matricula, element.IDRuta).subscribe(
      (response) => {
        console.log('Registro actualizado con éxito', response);
        element.Pases = nuevoPases;
      },
      (error) => {
        console.error('Error al actualizar el registro', error);
      }
    );
  }


}
