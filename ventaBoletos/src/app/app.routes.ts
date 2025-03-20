import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ValescamionComponent } from './valescamion/valescamion.component';
import { PanelcamionesComponent } from './panelcamiones/panelcamiones.component';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "/Vales",
        pathMatch: "full"
    },
    {
        path: "Vales",
        component: ValescamionComponent,
    },
    {
        path: "Camiones",
        component: PanelcamionesComponent,
    }
];
