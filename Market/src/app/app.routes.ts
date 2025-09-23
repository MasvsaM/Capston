import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'providers',
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./providers/dashboard/providers-dashboard.page').then(
            (m) => m.ProvidersDashboardPage,
          ),
      },
      {
        path: 'preferences',
        loadComponent: () =>
          import('./providers/preferences/provider-preferences.page').then(
            (m) => m.ProviderPreferencesPage,
          ),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
