import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-web',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './admin-web.component.html',
  styleUrl: './admin-web.component.css'
})
export class AdminWebComponent {

}
