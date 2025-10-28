import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./paginas/store/store.page').then(m => m.StorePage),
  },
  {
    path: 'checkout',
    loadComponent: () => import('./paginas/checkout/checkout.page').then(m => m.CheckoutPage),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TiendaRoutingModule {}
