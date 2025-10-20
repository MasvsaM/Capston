import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  FachadaProveedores,
  PedidoProveedor,
} from '../../acceso-datos/fachada-proveedores.service';

@Component({
  selector: 'app-proveedores-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
})
export class PedidosPage implements OnInit {
  private readonly fachada = inject(FachadaProveedores);
  pedidos$!: Observable<PedidoProveedor[]>;
  readonly estados = [
    { valor: 'pendiente' as const, etiqueta: 'Pendiente' },
    { valor: 'en_progreso' as const, etiqueta: 'En progreso' },
    { valor: 'completado' as const, etiqueta: 'Completado' },
  ];

  ngOnInit(): void {
    this.pedidos$ = this.fachada.obtenerPedidos();
  }

  actualizarEstado(pedido: PedidoProveedor, estado: PedidoProveedor['estado']): void {
    this.fachada.actualizarEstadoPedido(pedido.id, estado).subscribe();
  }
}
