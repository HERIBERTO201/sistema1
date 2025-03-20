import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { PadresService } from './padres.service';


@Component({
  selector: 'app-adminpadres',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule],
  templateUrl: './adminpadres.component.html',
  styleUrl: './adminpadres.component.css'
})
export class AdminpadresComponent implements OnInit {
  padres: any[] = [];
  padresFiltrados: any[] = [];
  filtro: string = '';
  nuevoPadre = {
    IDPadres: '',
    Madre: '',
    Padre: '',
    Contrasena: '',
    Familia: '',
    Contacto: '',
  };
  crear: boolean = false;
  editar: boolean = false;

  constructor(private padresService: PadresService) {}

  ngOnInit(): void {
    this.obtenerPadresDetalles();
  }

  obtenerPadresDetalles(): void {
    this.padresService.getPadresDetalles().subscribe(
      (data) => {
        this.padres = data;
        this.padresFiltrados = data;
      },
      (error) => {
        console.error('Error al obtener los detalles de los padres:', error);
      }
    );
  }

  aplicarFiltro(): void {
    const filtroLower = this.filtro.toLowerCase();
    this.padresFiltrados = this.padres.filter(padre =>
      padre.Familia.toLowerCase().includes(filtroLower) ||
      padre.Madre.toLowerCase().includes(filtroLower) ||
      padre.Padre.toLowerCase().includes(filtroLower)
    );
  }

  generarContrasenaAleatoria(): string {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$';
    let contrasena = '';
    for (let i = 0; i < 8; i++) {
      const indice = Math.floor(Math.random() * caracteres.length);
      contrasena += caracteres[indice];
    }
    return contrasena;
  }

  generarNumeroCuentaAleatorio(): number {
    const numero = Math.floor(10000000 + Math.random() * 90000000);
    return numero;
  }

  agregarPadre(): void {
    this.nuevoPadre.Contrasena = this.generarContrasenaAleatoria();
    this.nuevoPadre.IDPadres = this.generarNumeroCuentaAleatorio().toString();
    console.log(this.nuevoPadre);
    this.padresService.agregarPadre(this.nuevoPadre).subscribe(
      (response) => {
        console.log('Padre agregado con éxito:', response);
        this.obtenerPadresDetalles();
        this.nuevoPadre = { Familia: '', Madre: '', Padre: '', Contrasena: '', Contacto: '', IDPadres: ''};
      },
      (error) => {
        console.error('Error al agregar el padre:', error);
      }
    );
}

  crearPadre(): void {
    this.nuevoPadre = {
      IDPadres: '',
      Madre: '',
      Padre: '',
      Contrasena: '',
      Familia: '',
      Contacto: '',
    };
    this.crear = true;
    this.editar = false;
  }

  editarPadre(padre: any): void {
    this.nuevoPadre = padre;
    this.crear = false;
    this.editar = true;
  }

  EditarPadre(): void {
    const idPadres = parseInt(this.nuevoPadre.IDPadres, 10);

    this.padresService.actualizarPadre(idPadres, this.nuevoPadre).subscribe(
      (response) => {
        console.log('Padre actualizado con éxito:', response);
        this.obtenerPadresDetalles();
        this.crear = false;
        this.editar = false;
      },
      (error) => {
        console.error('Error al actualizar el padre:', error);
      }
    );
  }

}
