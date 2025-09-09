import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Item {
  nombre: string;
  tipo: 'Producto' | 'Servicio';
  categoria: string;
  animal: string; // Perro, Gato, Exótico, Granja
  precio?: number;
  modalidad?: string; // Para servicios
  proveedor: string;
  foto: string;
}

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage {
  filtroAnimal: string = '';
  filtroTipo: string = '';
  esPremiumCliente: boolean = false; // Se puede pasar desde perfil

  items: Item[] = [
    { nombre: 'Peluquería Canina', tipo: 'Servicio', categoria: 'Cuidado', animal: 'Perro', modalidad: 'Domicilio', proveedor: 'PetCare', foto: 'https://via.placeholder.com/150' },
    { nombre: 'Alimento para Gatos', tipo: 'Producto', categoria: 'Alimento', animal: 'Gato', precio: 15000, proveedor: 'AnimalShop', foto: 'https://via.placeholder.com/150' },
    { nombre: 'Paseador de Perros', tipo: 'Servicio', categoria: 'Cuidado', animal: 'Perro', modalidad: 'Ambos', proveedor: 'DogWalkers', foto: 'https://via.placeholder.com/150' },
    { nombre: 'Publicidad: Oferta de Juguetes', tipo: 'Producto', categoria: 'Publicidad', animal: '', precio: 0, proveedor: 'Anuncio', foto: 'https://via.placeholder.com/150' },
  ];

  get filteredItems() {
    return this.items.filter(item => {
      if (this.esPremiumCliente && item.categoria === 'Publicidad') return false;
      return (!this.filtroAnimal || item.animal === this.filtroAnimal) &&
             (!this.filtroTipo || item.tipo === this.filtroTipo);
    });
  }

  contactarProveedor(item: Item) {
    console.log(`Contactando a ${item.proveedor} sobre ${item.nombre}`);
  }
}


