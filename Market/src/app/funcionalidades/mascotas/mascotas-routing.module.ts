import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@nucleo/guardias/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./paginas/pets/pets.page').then(m => m.PetsPage),
  },
  {
    path: 'formulario',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./paginas/pet-form/pet-form.page').then(m => m.PetFormPage),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MascotasRoutingModule {}
