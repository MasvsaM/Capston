import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Mascota {
  nombre: string;
  especie: string;
  raza: string;
  edad: number;
  peso: number;
  sexo: 'Macho' | 'Hembra';
  personalidad: string;
  vacunas: string[];
  vacunasString?: string;
  foto: string;
}

@Component({
  selector: 'app-perfil-cliente',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './perfil-cliente.page.html',
  styleUrls: ['./perfil-cliente.page.scss'],
})
export class PerfilClientePage {
  esPremium: boolean = false; // Suscripción Premium

  mascotas: Mascota[] = [
    {
      nombre: 'Firulais',
      especie: 'Perro',
      raza: 'Labrador',
      edad: 3,
      peso: 12,
      sexo: 'Macho',
      personalidad: 'Juguetón',
      vacunas: ['Rabia', 'Moquillo'],
      vacunasString: 'Rabia, Moquillo',
      foto: 'https://via.placeholder.com/150',
    },
  ];

  togglePremium() {
    this.esPremium = !this.esPremium;
  }

  agregarMascota() {
    this.mascotas.push({
      nombre: '',
      especie: '',
      raza: '',
      edad: 0,
      peso: 0,
      sexo: 'Macho',
      personalidad: '',
      vacunas: [],
      vacunasString: '',
      foto: '',
    });
  }

  eliminarMascota(index: number) {
    this.mascotas.splice(index, 1);
  }

  actualizarVacunas(mascota: Mascota) {
    mascota.vacunas = mascota.vacunasString?.split(',').map(v => v.trim()) || [];
  }
}


