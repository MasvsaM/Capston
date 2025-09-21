import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil-proveedor',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './perfil-proveedor.page.html',
  styleUrls: ['./perfil-proveedor.page.scss'],
})
export class PerfilProveedorPage {
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
  }
}

