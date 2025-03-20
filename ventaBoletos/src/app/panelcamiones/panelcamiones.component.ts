import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BoletosService } from '../boletos.service';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { NgModel } from '@angular/forms';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-panelcamiones',
  standalone: true,
  imports: [RouterModule, MatTableModule, MatPaginatorModule, NgIf, FormsModule],
  templateUrl: './panelcamiones.component.html',
  styleUrl: './panelcamiones.component.css'
})
export class PanelcamionesComponent implements OnInit{

  valorboleano: boolean = false;
  editarruta: boolean = false;
  agregarruta: boolean = false;
  rutasCamiones: any[] = [];
  rutaSeleccionada: any = { IDRuta: '', Ruta: '', Contrasena: '', Activa: false };
  constructor(private boletosService: BoletosService) { }

  ngOnInit(): void {
    this.obtenerRutasCamiones();
  }

  obtenerRutasCamiones(): void {
    this.boletosService.getRutasCamiones().subscribe(
      (data) => {
        console.log(data);
        this.rutasCamiones = data;
        console.log(typeof data[0].activa)
      },
      (error) => {
        console.error('Error al obtener las rutas de camiones', error);
      }
    );
  }

  editarRuta(ruta: any): void {
    this.rutaSeleccionada = { IDRuta: ruta.IDRuta, Ruta: ruta.Ruta, Contrasena: ruta.Contrasena, Activa: ruta.Activa };
    this.agregarruta = false;
    this.editarruta = true;
  }

  guardarRuta() {
    this.rutaSeleccionada.Activa = this.rutaSeleccionada.Activa === true;

    this.boletosService.updateRuta(this.rutaSeleccionada.IDRuta, {
        Ruta: this.rutaSeleccionada.Ruta,
        Contrasena: this.rutaSeleccionada.Contrasena,
        Activa: this.rutaSeleccionada.Activa // Esto ahora será true o false
    }).subscribe(
        response => {
            console.log('Ruta actualizada con éxito', response);
            this.obtenerRutasCamiones();
            this.editarruta = false;
        },
        error => {
            console.error('Error al actualizar la ruta', error);
        }
    );
    
    
  }

  crearRuta() {
    console.log(this.rutaSeleccionada);
    this.boletosService.CrearRuta(this.rutaSeleccionada.Ruta, this.rutaSeleccionada.Contrasena, this.rutaSeleccionada.Activa).subscribe({
      next: (response) => {
        console.log('Ruta añadida con éxito', response);
        this.obtenerRutasCamiones();
        this.agregarruta = false;
      },
      error: (err) => {
        console.error('Error al añadir ruta', err);
        this.obtenerRutasCamiones();
        this.agregarruta = false;
      }
    });
  }

}
