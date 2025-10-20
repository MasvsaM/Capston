import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { ProveedoresRoutingModule } from './proveedores-routing.module';
import { PanelPage } from './paginas/panel/panel.page';
import { PerfilPage } from './paginas/perfil/perfil.page';
import { DisponibilidadPage } from './paginas/disponibilidad/disponibilidad.page';
import { ServiciosPage } from './paginas/servicios/servicios.page';
import { PedidosPage } from './paginas/pedidos/pedidos.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ProveedoresRoutingModule,
    PanelPage,
    PerfilPage,
    DisponibilidadPage,
    ServiciosPage,
    PedidosPage,
  ],
})
export class ProveedoresModule {}
