import { Routes } from '@angular/router';
import { NosotrosComponent } from './Inicio/nosotros/nosotros.component';
import { TalleresComponent } from './Inicio/talleres/talleres.component';
import { NoticiasComponent } from './Inicio/noticias/noticias.component';
import { LoginPadresComponent } from './Paneles/login-padres/login-padres.component';
import { LoginAdminComponent } from './Paneles/login-admin/login-admin.component';
import { PanelPadresComponent } from './Paneles/login-padres/panel-padres/panel-padres.component';
import { PanelAdminComponent } from './Paneles/login-admin/panel-admin/panel-admin.component';
import { AlumnosPadresComponent } from './Paneles/login-padres/panel-padres/alumnos-padres/alumnos-padres.component';
import { AlumnosApelacionComponent } from './Paneles/login-padres/panel-padres/alumnos-apelacion/alumnos-apelacion.component';
import { AdminAlumnosComponent } from './Paneles/login-admin/panel-admin/admin-alumnos/admin-alumnos.component';
import { AdminAsistenciaComponent } from './Paneles/login-admin/panel-admin/admin-asistencia/admin-asistencia.component';
import { AdminEscolarComponent } from './Paneles/login-admin/panel-admin/admin-escolar/admin-escolar.component';
import { AdminWebComponent } from './Paneles/login-admin/panel-admin/admin-web/admin-web.component';
import { WebanunciosComponent } from './Paneles/login-admin/panel-admin/admin-web/webanuncios/webanuncios.component';
import { WebtalleresComponent } from './Paneles/login-admin/panel-admin/admin-web/webtalleres/webtalleres.component';
import { AdminsalonesComponent } from './Paneles/login-admin/panel-admin/admin-escolar/adminsalones/adminsalones.component';
import { AdminsturnosComponent } from './Paneles/login-admin/panel-admin/admin-escolar/adminsturnos/adminsturnos.component';
import { AdminalumnosComponent1 } from './Paneles/login-admin/panel-admin/admin-alumnos/adminalumnos/adminalumnos.component';
import { AdminpadresComponent } from './Paneles/login-admin/panel-admin/admin-alumnos/adminpadres/adminpadres.component';
import { AuthGuard } from './Paneles/login-padres/auth.guard';


export const routes: Routes = [
    {
        path:"",
        component: NosotrosComponent,
        pathMatch: "full"
    },
    {
        path:"Nosotros",
        component: NosotrosComponent
    },{
        path:"Noticias",
        component: NoticiasComponent,
    },{
        path:"Talleres",
        component: TalleresComponent
    },{
        path:"portalPadres",
        component: LoginPadresComponent
    },{
        path:"portalAdmin",
        component: LoginAdminComponent
    },{
        path:"panelPadres",
        component: PanelPadresComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: "",
                redirectTo: "padresAlumnos",
                pathMatch: "full"
            }
            ,
            {
                path: "padresAlumnos",
                component: AlumnosPadresComponent,
                canActivate: [AuthGuard]
            }
            ,
            {   
                path: "padresApelacion",
                component: AlumnosApelacionComponent,
                canActivate: [AuthGuard]
            }
        ]
    },{
        path:"panelAdmin",
        component: PanelAdminComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: "",
                redirectTo: "AdminWeb/Anuncios",
                pathMatch: "full"
            },
            {
                path: "AdminWeb",
                component: AdminWebComponent,
                children: [
                    {
                        path: "",
                        component: WebanunciosComponent,
                        pathMatch: "full"
                    },
                    {
                        path: "Anuncios",
                        component: WebanunciosComponent,
                    },
                    {
                        path: "Talleres",
                        component: WebtalleresComponent
                    }
                ]
            },
            {
                path: "AdminEscolar",
                component: AdminEscolarComponent,
                children: [
                    {
                        path: "",
                        component: AdminsalonesComponent,
                        pathMatch: "full"
                    },
                    {
                        path: "Salones",
                        component: AdminsalonesComponent
                    },
                    {
                        path: "Turnos",
                        component: AdminsturnosComponent
                    }
                ]
            },
            {
                path: "AdminAlumnos",
                component: AdminAlumnosComponent,
                children: [
                    {
                        path: "",
                        component: AdminalumnosComponent1,
                        pathMatch: "full"
                    },
                    {
                        path: "alumnos",
                        component: AdminalumnosComponent1
                    },
                    {
                        path: "padres",
                        component: AdminpadresComponent
                    }
                ]
            },
            {
                path: "AdminAsistencia",
                component: AdminAsistenciaComponent
            }
        ]
    },
    {
        path: "**",
        redirectTo: ""
    }
];
