import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'inicio',
  },
  {
    path: 'inicio',
    loadChildren: () =>
      import('@funcionalidades/inicio/inicio.module').then(m => m.InicioModule),
  },
  {
    path: 'autenticacion',
    loadChildren: () =>
      import('@funcionalidades/autenticacion/autenticacion.module').then(m => m.AutenticacionModule),
  },
  {
    path: 'onboarding',
    loadChildren: () =>
      import('@funcionalidades/onboarding/onboarding.module').then(m => m.OnboardingModule),
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
    path: 'mascotas',
    loadChildren: () =>
      import('@funcionalidades/mascotas/mascotas.module').then(m => m.MascotasModule),
  },
  {
    path: 'perfil',
    loadChildren: () =>
      import('@funcionalidades/perfil/perfil.module').then(m => m.PerfilModule),
  },
  {
    path: 'suscripcion',
    loadChildren: () =>
      import('@funcionalidades/suscripcion/suscripcion.module').then(m => m.SuscripcionModule),
  },
  {
    path: 'tabs',
    loadChildren: () =>
      import('@funcionalidades/navegacion/navegacion.module').then(m => m.NavegacionModule),
  },
  {
    path: '**',
    redirectTo: 'inicio',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
