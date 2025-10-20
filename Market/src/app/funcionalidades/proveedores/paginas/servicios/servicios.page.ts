import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Observable } from 'rxjs';
import {
  FachadaProveedores,
  ServicioProveedor,
} from '../../acceso-datos/fachada-proveedores.service';

@Component({
  selector: 'app-proveedores-servicios',
  templateUrl: './servicios.page.html',
  styleUrls: ['./servicios.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class ServiciosPage implements OnInit {
  private readonly fachada = inject(FachadaProveedores);
  servicios$!: Observable<ServicioProveedor[]>;

  ngOnInit(): void {
    this.servicios$ = this.fachada.obtenerServicios();
  }

  toggleServicio(servicio: ServicioProveedor): void {
    this.fachada
      .guardarServicio({ ...servicio, activo: !servicio.activo })
      .subscribe();
  }
}
