import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Observable } from 'rxjs';
import {
  FachadaProveedores,
  PedidoProveedor,
  ResumenPanelProveedor,
  ServicioProveedor,
} from '../../acceso-datos/fachada-proveedores.service';

@Component({
  selector: 'app-proveedores-panel',
  templateUrl: './panel.page.html',
  styleUrls: ['./panel.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class PanelPage implements OnInit {
  private readonly fachada = inject(FachadaProveedores);
  resumen$!: Observable<ResumenPanelProveedor>;
  pedidos$!: Observable<PedidoProveedor[]>;
  servicios$!: Observable<ServicioProveedor[]>;

  ngOnInit(): void {
    this.resumen$ = this.fachada.obtenerResumenPanel();
    this.pedidos$ = this.fachada.obtenerPedidos();
    this.servicios$ = this.fachada.obtenerServicios();
  }
}
