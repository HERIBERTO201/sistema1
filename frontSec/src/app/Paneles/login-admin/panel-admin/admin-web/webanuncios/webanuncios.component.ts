import { Component, OnInit } from '@angular/core';
import { AnunciosService } from './anuncios.service';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-webanuncios',
  standalone: true,
  imports: [CommonModule, MatListModule, MatTableModule, FormsModule],
  templateUrl: './webanuncios.component.html',
  styleUrls: ['./webanuncios.component.css']
})
export class WebanunciosComponent implements OnInit {

  anuncios: any[] = [];
  displayedColumns: string[] = ['Titulo', 'Fecha', 'Opciones', 'Visible'];
  edicion: boolean = false;
  anuncio: any = {};
  selectedFile: File | undefined;
  crear: boolean = false;

  constructor(private anunciosService: AnunciosService) {}

  ngOnInit(): void {
    this.cargarAnuncios();
  }

  cargarAnuncios(): void {
    this.anunciosService.getAnuncios().subscribe(
      (data: any[]) => {
        this.anuncios = data.map(anuncio => ({
          ...anuncio,
          Visible: !!anuncio.Visible
        }));
        console.log(this.anuncios);
      },
      error => {
        console.error('Error al obtener los anuncios', error);
      }
    );
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    this.selectedFile = file ? file : undefined;
  }

  editarAnuncio(anuncio: any): void {
    this.edicion = true;
    this.crear = false;
    this.anuncio = { ...anuncio };
  }

  crearanuncio(): void {
    this.edicion = false;
    this.crear = true;
    this.anuncio = {
        titulo: '',
        Contenido: '',
        Titulo: ''
    };
    this.selectedFile = undefined;
  }

  guardarAnuncio(): void {
    if (this.anuncio.IDAnuncio) {
      this.anunciosService.updateAnuncio(this.anuncio.IDAnuncio, this.anuncio, this.selectedFile).subscribe(
        response => {
          console.log('Anuncio actualizado con éxito', response);
          this.cargarAnuncios();
          this.anuncio = {};
          this.selectedFile = undefined;
        },
        error => {
          console.error('Error al actualizar el anuncio', error);
        }
      );
    } else {
      console.error('No se ha seleccionado un anuncio para actualizar');
    }
  }


  crearAnuncio(): void {
    console.log(this.anuncio);
    console.log(this.selectedFile);
    if (this.selectedFile) {
      this.anunciosService.createAnuncio(this.anuncio, this.selectedFile).subscribe(
        response => {
          console.log('Anuncio creado con éxito', response);
          this.cargarAnuncios();
          this.crear = false;
          this.anuncio = {};
          this.selectedFile = undefined;
          this.edicion = false;
        },
        error => {
          console.error('Error al crear el anuncio', error);
        }
      );
    } else {
      console.error('No se ha seleccionado ninguna imagen');
    }
  }

  veranuncio(anuncio: any): void {
    this.anunciosService.veranuncio(anuncio.IDAnuncio, anuncio.Visible).subscribe(
      response => {
          console.log('Visibilidad del anuncio actualizada', response);
      },
      error => {
          console.error('Error al actualizar la visibilidad del anuncio', error);
      }
    );
  }

  toggleVisible(anuncio: any): void {
    this.anunciosService.veranuncio(anuncio.IDAnuncio, anuncio.Visible).subscribe(
      response => {
        console.log('Visibilidad del anuncio actualizada', response);
      },
      error => {
        console.error('Error al actualizar la visibilidad del anuncio', error);
      }
    );
  }
}
