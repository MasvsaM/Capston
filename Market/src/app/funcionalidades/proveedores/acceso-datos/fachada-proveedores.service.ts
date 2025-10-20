import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ResumenPanelProveedor {
  ingresosMensuales: number;
  citasPendientes: number;
  calificacionPromedio: number;
  serviciosActivos: number;
}

export interface PerfilProveedor {
  id: string;
  nombre: string;
  biografia: string;
  experiencia: number;
  especialidades: string[];
  ubicacion: string;
  fotoUrl: string;
  contacto: {
    telefono: string;
    correo: string;
  };
}

export interface DisponibilidadProveedor {
  dia: string;
  horarios: string[];
}

export interface ServicioProveedor {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  activo: boolean;
}

export interface PedidoProveedor {
  id: string;
  cliente: string;
  mascota: string;
  servicioId: string;
  fecha: string;
  estado: 'pendiente' | 'en_progreso' | 'completado';
}

@Injectable({
  providedIn: 'root',
})
export class FachadaProveedores {
  private readonly resumenPanel = new BehaviorSubject<ResumenPanelProveedor>({
    ingresosMensuales: 3200,
    citasPendientes: 5,
    calificacionPromedio: 4.8,
    serviciosActivos: 4,
  });

  private readonly perfil = new BehaviorSubject<PerfilProveedor>({
    id: 'proveedor-001',
    nombre: 'María Pérez',
    biografia: 'Profesional con más de 8 años de experiencia en cuidado integral de mascotas.',
    experiencia: 8,
    especialidades: ['Veterinaria', 'Entrenamiento canino', 'Estética canina'],
    ubicacion: 'Ciudad de México',
    fotoUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=300&h=300&fit=crop&crop=face',
    contacto: {
      telefono: '+52 55 1234 5678',
      correo: 'maria.perez@example.com',
    },
  });

  private readonly disponibilidad = new BehaviorSubject<DisponibilidadProveedor[]>([
    { dia: 'Lunes', horarios: ['09:00 - 13:00', '15:00 - 19:00'] },
    { dia: 'Martes', horarios: ['09:00 - 14:00'] },
    { dia: 'Miércoles', horarios: ['10:00 - 18:00'] },
    { dia: 'Jueves', horarios: ['09:00 - 13:00', '16:00 - 20:00'] },
    { dia: 'Viernes', horarios: ['09:00 - 14:00'] },
  ]);

  private readonly servicios = new BehaviorSubject<ServicioProveedor[]>([
    {
      id: 'srv-001',
      nombre: 'Consulta veterinaria integral',
      descripcion: 'Evaluación general de salud, vacunación y recomendaciones personalizadas.',
      precio: 650,
      categoria: 'Veterinaria',
      activo: true,
    },
    {
      id: 'srv-002',
      nombre: 'Baño y estética para perros',
      descripcion: 'Servicio completo de baño, corte de uñas y estilizado básico.',
      precio: 450,
      categoria: 'Estética',
      activo: true,
    },
    {
      id: 'srv-003',
      nombre: 'Entrenamiento básico canino',
      descripcion: 'Sesiones personalizadas enfocadas en obediencia y socialización.',
      precio: 520,
      categoria: 'Entrenamiento',
      activo: false,
    },
  ]);

  private readonly pedidos = new BehaviorSubject<PedidoProveedor[]>([
    {
      id: 'ped-1001',
      cliente: 'Luis Gómez',
      mascota: 'Max',
      servicioId: 'srv-001',
      fecha: '2024-10-21T10:30:00',
      estado: 'pendiente',
    },
    {
      id: 'ped-1002',
      cliente: 'Ana Torres',
      mascota: 'Luna',
      servicioId: 'srv-002',
      fecha: '2024-10-22T14:00:00',
      estado: 'en_progreso',
    },
    {
      id: 'ped-1003',
      cliente: 'Carlos Ruiz',
      mascota: 'Rocky',
      servicioId: 'srv-003',
      fecha: '2024-10-19T09:00:00',
      estado: 'completado',
    },
  ]);

  obtenerResumenPanel(): Observable<ResumenPanelProveedor> {
    return this.resumenPanel.asObservable();
  }

  obtenerPerfil(): Observable<PerfilProveedor> {
    return this.perfil.asObservable();
  }

  actualizarPerfil(perfilActualizado: PerfilProveedor): Observable<PerfilProveedor> {
    this.perfil.next(perfilActualizado);
    return of(perfilActualizado);
  }

  obtenerDisponibilidad(): Observable<DisponibilidadProveedor[]> {
    return this.disponibilidad.asObservable();
  }

  actualizarDisponibilidad(nuevaDisponibilidad: DisponibilidadProveedor[]): Observable<DisponibilidadProveedor[]> {
    this.disponibilidad.next(nuevaDisponibilidad);
    return of(nuevaDisponibilidad);
  }

  obtenerServicios(): Observable<ServicioProveedor[]> {
    return this.servicios.asObservable();
  }

  guardarServicio(servicio: ServicioProveedor): Observable<ServicioProveedor> {
    const serviciosActuales = this.servicios.getValue();
    const index = serviciosActuales.findIndex(item => item.id === servicio.id);
    if (index > -1) {
      serviciosActuales[index] = servicio;
    } else {
      serviciosActuales.push({ ...servicio, id: `srv-${Date.now()}` });
    }
    this.servicios.next([...serviciosActuales]);
    return of(servicio);
  }

  obtenerPedidos(): Observable<PedidoProveedor[]> {
    return this.pedidos.asObservable();
  }

  actualizarEstadoPedido(id: string, estado: PedidoProveedor['estado']): Observable<PedidoProveedor | undefined> {
    const pedidosActuales = this.pedidos.getValue();
    const pedido = pedidosActuales.find(item => item.id === id);
    if (pedido) {
      pedido.estado = estado;
      this.pedidos.next([...pedidosActuales]);
    }
    return of(pedido);
  }

  obtenerServicioPorId(id: string): Observable<ServicioProveedor | undefined> {
    return this.servicios.pipe(map(servicios => servicios.find(servicio => servicio.id === id)));
  }
}
