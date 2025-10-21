import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProveedoresRoutingModule } from './proveedores-routing.module';
import { ResolverPerfilProveedor } from './acceso-datos';

@NgModule({
  imports: [CommonModule, ProveedoresRoutingModule],
  providers: [ResolverPerfilProveedor],
})
export class ProveedoresModule {}
