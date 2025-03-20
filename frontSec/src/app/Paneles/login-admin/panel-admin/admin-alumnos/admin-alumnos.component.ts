import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-alumnos',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './admin-alumnos.component.html',
  styleUrl: './admin-alumnos.component.css'
})
export class AdminAlumnosComponent {

}
