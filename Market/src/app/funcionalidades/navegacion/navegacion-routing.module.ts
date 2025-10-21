import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuardianAutenticacion } from '@nucleo/guardianes';

const routes: Routes = [
  {
    path: '',
    canActivate: [GuardianAutenticacion],
    loadComponent: () =>
      import('./paginas/tabs/tabs.page').then(m => m.TabsPage),
    children: [
      {
        path: 'mascotas',
        loadChildren: () =>
          import('@funcionalidades/mascotas/mascotas.module').then(m => m.MascotasModule),
      },
      {
        path: 'proveedores',
        loadChildren: () =>
          import('@funcionalidades/proveedores/proveedores.module').then(m => m.ProveedoresModule),
      },
      {
        path: 'citas',
        loadChildren: () =>
          import('@funcionalidades/citas/citas.module').then(m => m.CitasModule),
      },
      {
        path: 'suscripcion',
        loadChildren: () =>
          import('@funcionalidades/suscripcion/suscripcion.module').then(m => m.SuscripcionModule),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'mascotas',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NavegacionRoutingModule {}
