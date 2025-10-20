import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PanelPage } from './paginas/panel/panel.page';
import { PerfilPage } from './paginas/perfil/perfil.page';
import { DisponibilidadPage } from './paginas/disponibilidad/disponibilidad.page';
import { ServiciosPage } from './paginas/servicios/servicios.page';
import { PedidosPage } from './paginas/pedidos/pedidos.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'panel',
    pathMatch: 'full',
  },
  {
    path: 'panel',
    component: PanelPage,
  },
  {
    path: 'perfil',
    component: PerfilPage,
  },
  {
    path: 'disponibilidad',
    component: DisponibilidadPage,
  },
  {
    path: 'servicios',
    component: ServiciosPage,
  },
  {
    path: 'pedidos',
    component: PedidosPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProveedoresRoutingModule {}
