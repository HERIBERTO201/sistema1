import { Component, OnInit } from '@angular/core';
import { AlumnosService } from './alumnos.service';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-adminalumnos',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatSelectModule],
  templateUrl: './adminalumnos.component.html',
  styleUrl: './adminalumnos.component.css'
})
export class AdminalumnosComponent1 implements OnInit {

  alumnos: any[] = [];
  turnos: any[] = [];
  salones: any[] = [];
  padres: any[] = [];
  alumno: any = {};
  idviejo: string = '';
  displayedColumns: string[] = ['Matricula', 'Nombre', 'Salon', 'Familia', 'Turno', 'Opciones'];
  edicion: boolean = false;
  crear: boolean = false;
  familia: boolean = false;
  displayedColumnsPadres: string[] = ['Familia', 'Madre', 'Padre', 'Opciones'];
  padresFiltrados: any[] = [];
  filtroFamilia: string = '';
  qrImageUrl: string | null = null;
  numAlumnos: number = 1;
  filtroAlumno: string = '';
  alumnosFiltrados: any[] = [];
  filtroSalon: string = '';

  constructor(private alumnosService: AlumnosService) {
  }

  ngOnInit(): void {
    this.cargarAlumnos();
    this.getTurnos();
    this.getSalones();
    this.getPadres();
    this.padresFiltrados = this.padres;
    this.alumnosFiltrados = this.alumnos;
  }

  cargarAlumnos() {
    this.alumnosService.getAlumnos().subscribe(
      (data) => {
        this.alumnos = data;
        this.alumnosFiltrados = [...data];  // Inicializar alumnosFiltrados con todos los alumnos
      },
      (error) => {
        console.error('Error al cargar alumnos:', error);
      }
    );
  }

  aplicarFiltro() {
    const filtro = this.filtroFamilia.toLowerCase();
    this.padresFiltrados = this.padres.filter(padre => 
        padre.Familia.toLowerCase().includes(filtro) ||
        padre.Madre.toLowerCase().includes(filtro) ||
        padre.Padre.toLowerCase().includes(filtro)
    );
}

  getTurnos() {
    this.alumnosService.getTurnos().subscribe(
      (data) => {
        this.turnos = data;
        console.log('Turnos:', this.turnos);
      },
      (error) => {
        console.error('Error al obtener los turnos:', error);
      }
    );
  }

  getSalones() {
    this.alumnosService.getSalones().subscribe(
      (data) => {
        this.salones = data;
        console.log('Salones:', this.salones);
      },
      (error) => {
        console.error('Error al obtener los salones:', error);
      }
    );
  }

  getPadres() {
    this.alumnosService.getPadres().subscribe(
      (data) => {
        this.padres = data;
        console.log('Padres:', this.padres);
      },
      (error) => {
        console.error('Error al obtener los padres:', error);
      }
    );
  }

  crearAlumno() {
    this.crear = true;
    this.edicion = false;
    this.alumno.Matricula = null;
    this.alumno.Nombre = '';
    this.alumno.IDSalon = ''
  }

  editarAlumno(alumno: any) {
    this.idviejo = alumno.Matricula;
    this.alumno = alumno;
    this.edicion = true;
    this.crear = false;
    this.familia = false;
  }
  
  EditarAlumno() {
    const matricula = this.alumno.Matricula;
    const alumnoActualizado = {
      newMatricula: this.alumno.Matricula,
      Nombre: this.alumno.Nombre,
      IDSalon: this.alumno.IDSalon
    };

    if (!alumnoActualizado.newMatricula || !alumnoActualizado.Nombre || !alumnoActualizado.IDSalon) {
      console.error('Todos los campos son requeridos: Matrícula, Nombre e IDSalon');
      return;
    }

    this.alumnosService.actualizarAlumno(matricula, alumnoActualizado).subscribe(
      (response) => {
        console.log('Alumno actualizado con éxito:', response);
        this.cargarAlumnos();
        this.edicion = false;
      },
      (error) => {
        console.error('Error al actualizar el alumno:', error);
      }
    );
  }

  CrearAlumno() {
    const nuevoAlumno = {
      Matricula: this.alumno.Matricula,
      Nombre: this.alumno.Nombre,
      IDSalon: this.alumno.IDSalon
    };
    console.log(nuevoAlumno);
    this.alumnosService.crearAlumno(nuevoAlumno).subscribe(
      (response) => {
        console.log('Alumno creado con éxito:', response);
        this.cargarAlumnos();
        this.crear = false;
      },
      (error) => {
        console.error('Error al crear el alumno:', error);
      }
    );
  }

  agregarFamilia(alumno: any) {
    this.familia = true;
    this.crear = false;
    this.edicion = false;
    this.alumno = alumno;
  }



  accionPadre(padre: any) {
    this.alumnosService.actualizarFamilia(this.alumno.Matricula, padre.IDPadres).subscribe(
      (response) => {
        console.log('Familia actualizada con éxito:', response);
        this.cargarAlumnos();
      },
      (error) => {
        console.error('Error al actualizar la familia:', error);
      }
    );
  }

  verQR(matricula: string) {
    this.alumnosService.getQrCode(matricula).subscribe(blob => {
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

  aplicarFiltroAlumno(event: KeyboardEvent) {
    if (!this.filtroAlumno) {
      this.alumnosFiltrados = [...this.alumnos];
    } else {
      const filtro = this.filtroAlumno.toLowerCase();
      
      this.alumnosFiltrados = this.alumnos.filter(alumno => 
        alumno.Nombre.toLowerCase().includes(filtro) ||
        alumno.Matricula.toLowerCase().includes(filtro)
      );
    }

    if (this.filtroSalon) {
      this.alumnosFiltrados = this.alumnosFiltrados.filter(alumno => 
        alumno.IDSalon === this.filtroSalon
      );
    }
  }

  aplicarFiltroSalon() {
    if (this.filtroSalon) {
      this.alumnosFiltrados = this.alumnos.filter(alumno => alumno.IDSalon === this.filtroSalon);
    } else {
      this.alumnosFiltrados = this.alumnos;
    }
  }

}
