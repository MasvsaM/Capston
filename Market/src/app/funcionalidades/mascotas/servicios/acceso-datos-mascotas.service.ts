import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ServicioDatos } from '@nucleo/firebase';
import { Mascota } from '@compartido/modelos';

@Injectable({
  providedIn: 'root'
})
export class ServicioAccesoDatosMascotas {
  private readonly servicioDatos = inject(ServicioDatos);

  obtenerMascotas(usuarioId: string): Observable<Mascota[]> {
    return this.servicioDatos.obtenerMascotasPorUsuario(usuarioId);
  }

  registrarMascota(mascota: Omit<Mascota, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    return this.servicioDatos.crearMascota(mascota);
  }

  actualizarMascota(mascotaId: string, cambios: Partial<Mascota>): Promise<void> {
    return this.servicioDatos.actualizarMascota(mascotaId, cambios);
  }

  eliminarMascota(mascotaId: string): Promise<void> {
    return this.servicioDatos.eliminarMascota(mascotaId);
  }
}
