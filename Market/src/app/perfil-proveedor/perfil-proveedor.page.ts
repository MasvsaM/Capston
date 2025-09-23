
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { DashboardWidget, ProviderDashboardService } from '../shared/services/provider-dashboard.service';
import { map } from 'rxjs';

import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
main

@Component({
  selector: 'app-perfil-proveedor',
  standalone: true,

  imports: [IonicModule, CommonModule, FormsModule, RouterModule],

  imports: [IonicModule, CommonModule, FormsModule],
main
  templateUrl: './perfil-proveedor.page.html',
  styleUrls: ['./perfil-proveedor.page.scss'],
})
export class PerfilProveedorPage {

  private readonly dashboardService = inject(ProviderDashboardService);

  readonly dashboard$ = this.dashboardService.profile$.pipe(
    map(profile => ({
      profile,
      widgets: this.dashboardService.getWidgets(profile),
    })),
  );

  trackWidget(_: number, widget: DashboardWidget): string {
    return widget.id;

  servicios = [
    { nombre: 'Peluquería a domicilio', modalidad: 'Domicilio', precio: 20000 },
  ];

  productos = [
    { nombre: 'Alimento para gatos', precio: 15000 },
  ];

  agregarServicio() {
    this.servicios.push({ nombre: '', modalidad: '', precio: 0 });
  }

  agregarProducto() {
    this.productos.push({ nombre: '', precio: 0 });
main
  }
}

