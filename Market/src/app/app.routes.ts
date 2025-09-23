import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then(m => m.HomePage),
  },
  {
    path: 'auth',
    loadComponent: () => import('./pages/auth/auth.page').then(m => m.AuthPage),
  },
  {
    path: 'auth/sign-up',
    loadComponent: () => import('./pages/auth/sign-up/sign-up.page').then(m => m.SignUpPage),
  },
  {
    path: 'auth/forgot-password',
    loadComponent: () => import('./pages/auth/forgot-password/forgot-password.page').then(m => m.ForgotPasswordPage),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage),
  },
  {
    path: 'registro',
    loadComponent: () => import('./registro/registro.page').then(m => m.RegistroPage),
  },
  {
    path: 'perfil-cliente',
    loadComponent: () => import('./perfil-cliente/perfil-cliente.page').then(m => m.PerfilClientePage),
  },
  {
    path: 'perfil-proveedor',
    loadComponent: () => import('./perfil-proveedor/perfil-proveedor.page').then(m => m.PerfilProveedorPage),
  },
  {
    path: 'feed',
    loadComponent: () => import('./feed/feed.page').then(m => m.FeedPage),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
