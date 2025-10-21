import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ServicioDatos } from '@nucleo/firebase';
import { Cita, Mascota, Proveedor } from '@compartido/modelos';

@Injectable({
  providedIn: 'root'
})
export class ServicioAccesoDatosCitas {
  private readonly servicioDatos = inject(ServicioDatos);

  obtenerCitasDeUsuario(usuarioId: string): Observable<Cita[]> {
    return this.servicioDatos.obtenerCitasPorUsuario(usuarioId);
  }

  obtenerCitasDeProveedor(proveedorId: string): Observable<Cita[]> {
    return this.servicioDatos.obtenerCitasPorProveedor(proveedorId);
  }

  registrarCita(cita: Omit<Cita, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    return this.servicioDatos.crearCita(cita);
  }

  actualizarCita(citaId: string, cambios: Partial<Cita>): Promise<void> {
    return this.servicioDatos.actualizarCita(citaId, cambios);
  }

  cancelarCita(citaId: string): Promise<void> {
    return this.servicioDatos.cancelarCita(citaId);
  }

  obtenerMascotasDeUsuario(usuarioId: string): Observable<Mascota[]> {
    return this.servicioDatos.obtenerMascotasPorUsuario(usuarioId);
  }

  obtenerProveedores(tipoServicio?: string): Observable<Proveedor[]> {
    return this.servicioDatos.obtenerProveedores(tipoServicio);
  }
}
