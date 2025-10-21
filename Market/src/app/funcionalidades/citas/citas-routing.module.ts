import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuardianAutenticacion } from '@nucleo/guardianes';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./paginas/appointments/appointments.page').then(m => m.AppointmentsPage),
  },
  {
    path: 'formulario',
    canActivate: [GuardianAutenticacion],
    loadComponent: () =>
      import('./paginas/appointment-form/appointment-form.page').then(m => m.AppointmentFormPage),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CitasRoutingModule {}
