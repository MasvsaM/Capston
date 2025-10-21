import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuardianAutenticacion } from '@nucleo/guardianes';

const routes: Routes = [
  {
    path: '',
    canActivate: [GuardianAutenticacion],
    loadComponent: () =>
      import('./paginas/profile/profile.page').then(m => m.ProfilePage),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerfilRoutingModule {}
