import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'registro',
    loadComponent: () => import('./registro/registro.page').then( m => m.RegistroPage)
  },
  {
    path: 'perfil-cliente',
    loadComponent: () => import('./perfil-cliente/perfil-cliente.page').then( m => m.PerfilClientePage)
  },
  {
    path: 'perfil-proveedor',
    loadComponent: () => import('./perfil-proveedor/perfil-proveedor.page').then( m => m.PerfilProveedorPage)
  },
  {
    path: 'feed',
    loadComponent: () => import('./feed/feed.page').then( m => m.FeedPage)
  },

];
