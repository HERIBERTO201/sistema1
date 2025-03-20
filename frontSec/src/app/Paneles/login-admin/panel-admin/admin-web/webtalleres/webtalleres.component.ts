import { Component, OnInit } from '@angular/core';
import { TalleresService } from './talleres.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-webtalleres',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule],
  templateUrl: './webtalleres.component.html',
  styleUrls: ['./webtalleres.component.css']
})
export class WebtalleresComponent implements OnInit {

  talleres: any[] = [];
  displayedColumns: string[] = ['Taller', 'Contenido', 'Visible', 'Opciones'];
  edicion: boolean = false;
  taller: any = {};
  crear: boolean = false;

  constructor(private talleresService: TalleresService) {}

  ngOnInit(): void {
    this.cargarTalleres();
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
        this.taller.imagen = file;
    }
  }

  cargarTalleres(): void {
    this.talleresService.getTalleres().subscribe(
      (data: any[]) => {
        this.talleres = data.map(taller => ({
          ...taller,
          Visible: !!taller.Visible
        }));
        console.log(this.talleres);
      },
      error => {
        console.error('Error al obtener los talleres', error);
      }
    );
  }

  editarTaller(taller: any): void {
    this.edicion = true;
    this.crear = false;
    this.taller = { ...taller };
  }

  

  crearTaller(): void {
    if (this.taller) {
        this.talleresService.createTaller(this.taller, this.taller.imagen).subscribe(
            response => {
                console.log('Taller creado con éxito', response);
                this.cargarTalleres();
                this.crear = false;
                this.taller = {};
            },
            error => {
                console.error('Error al crear el taller', error);
            }
        );
    }
  }



  toggleVisibility(idTaller: number, currentVisibility: boolean): void {
    const newVisibility = !currentVisibility;
    this.talleresService.updateTallerVisibility(idTaller, newVisibility).subscribe(
      response => {
        console.log('Visibilidad actualizada:', response);
        this.cargarTalleres();
      },
      error => {
        console.error('Error al actualizar la visibilidad:', error);
      }
    );
  }

  guardarTaller(): void {
    if (this.taller && this.taller.IDTaller) {
        this.talleresService.updateTaller(this.taller.IDTaller, this.taller.Contenido, this.taller.imagen).subscribe(
            response => {
                console.log('Taller actualizado con éxito', response);
                this.cargarTalleres();
                this.edicion = false;
                this.taller = {};
            },
            error => {
                console.error('Error al actualizar el taller', error);
            }
        );
    }
  }

}
