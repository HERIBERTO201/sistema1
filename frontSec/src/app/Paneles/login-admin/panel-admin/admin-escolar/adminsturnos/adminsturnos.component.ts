import { Component, OnInit } from '@angular/core';
import { TurnosService } from './turnos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-adminsturnos',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule],
  templateUrl: './adminsturnos.component.html',
  styleUrl: './adminsturnos.component.css'
})

export class AdminsturnosComponent implements OnInit {

  turnos: any[] = [];
  displayedColumns: string[] = ['IDTurno', 'Nombre', 'Opciones'];
  edicion: boolean = false;
  turno: any = {};
  crear: boolean = false;

  constructor(private turnosService: TurnosService) {}

  ngOnInit(): void {
    this.getTurnos();
  }

  getTurnos(): void {
    this.turnosService.getTurnos().subscribe(turnos => {
      this.turnos = turnos;
      console.log(this.turnos);
    });
  }

  editarTurno(turno: any): void {
    this.turno = turno;
    this.edicion = true;
    this.crear = false;
  }
  
  crearTurno(): void {
    this.crear = true;
    this.edicion = false;
  }

  EditarTurno(): void {
    this.turnosService.updateTurno(this.turno.IDTurno, this.turno.Nombre).subscribe(response => {
      console.log(response);
      this.getTurnos();
      this.edicion = false;
      this.crear = false;
    });
  }

  CrearTurno(): void {
    this.turnosService.createTurno(this.turno.Nombre).subscribe(response => {
      console.log(response);
      this.getTurnos();
      this.crear = false;
      this.edicion = false;
    });
  }

}
