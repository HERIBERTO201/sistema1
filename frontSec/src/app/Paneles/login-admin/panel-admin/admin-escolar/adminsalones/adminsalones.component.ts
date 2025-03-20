import { Component, OnInit } from '@angular/core';
import { SalonesService } from './salones.service';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { TurnosService } from '../adminsturnos/turnos.service';

interface Horario {
  Diasemana: string;
  Entrada: string;
  Salida: string;
}

@Component({
  selector: 'app-adminsalones',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule],
  templateUrl: './adminsalones.component.html',
  styleUrl: './adminsalones.component.css'
})
export class AdminsalonesComponent implements OnInit {

  salones: any[] = [];
  horario: boolean = false;
  editar: boolean = false;
  crear: boolean = false;
  salon: any = {};
  turnos: any[] = [];
  displayedColumns: string[] = ['IDSalon', 'SalonNombre', 'TurnoNombre', 'Opciones'];
  diasSemana: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  displayedColumnsHorario: string[] = ['dia', 'entrada', 'salida', 'guardar'];
  selectedFile: File | null = null;

  constructor(private salonesService: SalonesService, private turnosService: TurnosService) {}

  ngOnInit(): void {
    this.getSalones();
    this.getTurnos();
  }

  getSalones(): void {
    this.salonesService.getSalones().subscribe(salones => {
      this.salones = salones;
      console.log(this.salones);
    });
  }

  getTurnos(): void {
    this.turnosService.getTurnos().subscribe(turnos => {
      this.turnos = turnos;
      console.log(this.turnos);
    });
  }

  crearSalon(): void {
    this.salon = { IDSalon: null, SalonNombre: '', IDTurno: null };
    this.editar = false;
    this.crear = true;
    this.horario = false;
  }

  editarSalon(salon: any): void {
    this.salon = salon;
    this.salon.NuevoIDSalon = this.salon.IDSalon;
    this.editar = true;
    this.crear = false;
    this.horario = false;
  }

  EditarSalon(): void {

    this.salonesService.updateSalon(this.salon.IDSalon, this.salon.NuevoIDSalon, this.salon.SalonNombre, this.salon.IDTurno).subscribe(
      response => {
        console.log('Salón actualizado con éxito:', response);
        this.getSalones();
        this.editar = false;
        console.log(this.salon);
      },
      error => {
        console.error('Error al actualizar el salón:', error);
      }
    );
  }

  CrearSalon(): void {
    console.log(this.salon);
    this.salonesService.addSalon(this.salon.IDSalon, this.salon.SalonNombre, this.salon.IDTurno).subscribe(response => {
      console.log(response);
      this.getSalones();
    });
  }

  VerHorario(salon: any): void {
    this.horario = true;
    this.editar = false;
    this.crear = false;
    this.salon = salon;

    this.salon.horario = {
        Lunes: { entrada: null, salida: null },
        Martes: { entrada: null, salida: null },
        Miércoles: { entrada: null, salida: null },
        Jueves: { entrada: null, salida: null },
        Viernes: { entrada: null, salida: null }
    };

    this.salonesService.getHorario(salon.IDSalon).subscribe(horarios => {
        horarios.forEach((horario: Horario) => {
            const diaSemana = horario.Diasemana.charAt(0).toUpperCase() + horario.Diasemana.slice(1).toLowerCase();
            if (this.salon.horario[diaSemana]) {
                const entrada = `${horario.Entrada}`;
                const salida = `${horario.Salida}`;

                const entradaDate = new Date(`1970-01-01T${entrada}`);
                const salidaDate = new Date(`1970-01-01T${salida}`);

                if (!isNaN(entradaDate.getTime()) && !isNaN(salidaDate.getTime())) {
                    this.salon.horario[diaSemana] = {
                        entrada: entradaDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
                        salida: salidaDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
                    };
                } else {
                    console.error(`Invalid date for ${diaSemana}: Entrada: ${entrada}, Salida: ${salida}`);
                }
            }
        });
        console.log('Horario cargado para el salón:', this.salon.horario);
    }, error => {
        console.error('Error al cargar el horario:', error);
    });
  }

  guardarEntrada(dia: string, entrada: string, salida: string): void {
    const idSalon = this.salon.IDSalon;

    this.salonesService.updateHorario(idSalon, dia, entrada, salida).subscribe(
      response => {
        console.log('Horario actualizado con éxito', response);
      },
      error => {
        console.error('Error al actualizar el horario', error);
      }
    );
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmitPDF(): void {
    if (this.selectedFile && this.salon.IDSalon) {
        const formData: FormData = new FormData();
        formData.append('IDSalon', this.salon.IDSalon.toString());
        formData.append('pdf', this.selectedFile, this.selectedFile.name);

        this.salonesService.dochorariopost(this.salon.IDSalon, this.selectedFile).subscribe(
            response => {
                console.log('PDF subido con éxito', response);
            },
            error => {
                console.error('Error al subir el PDF', error);
            }
        );
    } else {
        console.error('No se ha seleccionado un archivo o el ID del salón no está disponible');
    }
  }

  descargarHorarioPDF(idSalon: number) {
    this.salonesService.getHorarioPDF(idSalon).subscribe(blob => {
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

