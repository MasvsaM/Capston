import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full',
  },
  {
    path: 'splash',
    loadComponent: () => import('./pages/splash/splash.page').then(m => m.SplashPage),
  },
  {
    path: 'auth',
    loadComponent: () => import('./pages/auth/auth.page').then(m => m.AuthPage),
  },
  {
    path: 'onboarding',
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/onboarding/onboarding.page').then(m => m.OnboardingPage),
  },
  {
    path: 'provider-registration',
    loadComponent: () => import('./pages/provider-registration/provider-registration.page').then(m => m.ProviderRegistrationPage),
  },
  {
    path: 'provider-onboarding',
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/provider-onboarding/provider-onboarding.page').then(m => m.ProviderOnboardingPage),
  },
  {
    path: 'provider-dashboard',
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/provider-dashboard/provider-dashboard.page').then(m => m.ProviderDashboardPage),
  },
  {
    path: 'tabs',
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/tabs/tabs.page').then(m => m.TabsPage),
    children: [
      {
        path: 'pets',
        loadComponent: () => import('./pages/pets/pets.page').then(m => m.PetsPage),
      },
      {
        path: 'providers',
        loadComponent: () => import('./pages/providers/providers.page').then(m => m.ProvidersPage),
      },
      {
        path: 'appointments',
        loadComponent: () => import('./pages/appointments/appointments.page').then(m => m.AppointmentsPage),
      },
      {
        path: 'subscription',
        loadComponent: () => import('./pages/subscription/subscription.page').then(m => m.SubscriptionPage),
      },
      {
        path: '',
        redirectTo: '/tabs/pets',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'appointment-form',
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/appointment-form/appointment-form.page').then(m => m.AppointmentFormPage),
  },
  {
    path: 'pet-form',
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/pet-form/pet-form.page').then(m => m.PetFormPage),
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/profile/profile.page').then(m => m.ProfilePage),
  },
  {
    path: '**',
    redirectTo: 'splash',
  },
];
