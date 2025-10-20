import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@nucleo/guardias/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./paginas/providers/providers.page').then(m => m.ProvidersPage),
  },
  {
    path: 'registro',
    loadComponent: () =>
      import('./paginas/provider-registration/provider-registration.page').then(m => m.ProviderRegistrationPage),
  },
  {
    path: 'onboarding',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./paginas/provider-onboarding/provider-onboarding.page').then(m => m.ProviderOnboardingPage),
  },
  {
    path: 'panel',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./paginas/provider-dashboard/provider-dashboard.page').then(m => m.ProviderDashboardPage),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProveedoresRoutingModule {}
