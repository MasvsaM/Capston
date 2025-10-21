import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuardianAutenticacion } from '@nucleo/guardianes';

const routes: Routes = [
  {
    path: '',
    canActivate: [GuardianAutenticacion],
    loadComponent: () =>
      import('./paginas/subscription/subscription.page').then(m => m.SubscriptionPage),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuscripcionRoutingModule {}
