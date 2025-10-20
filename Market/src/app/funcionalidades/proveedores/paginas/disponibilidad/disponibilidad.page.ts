import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import {
  DisponibilidadProveedor,
  FachadaProveedores,
} from '../../acceso-datos/fachada-proveedores.service';

@Component({
  selector: 'app-proveedores-disponibilidad',
  templateUrl: './disponibilidad.page.html',
  styleUrls: ['./disponibilidad.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class DisponibilidadPage implements OnInit {
  private readonly fachada = inject(FachadaProveedores);
  disponibilidad$!: Observable<DisponibilidadProveedor[]>;

  ngOnInit(): void {
    this.disponibilidad$ = this.fachada.obtenerDisponibilidad();
  }

  limpiarHorarios(dia: string): void {
    this.disponibilidad$.pipe(take(1)).subscribe(disponibilidad => {
      const actualizada = disponibilidad.map(item =>
        item.dia === dia ? { ...item, horarios: [] } : item,
      );
      this.fachada.actualizarDisponibilidad(actualizada).subscribe();
    });
  }
}
