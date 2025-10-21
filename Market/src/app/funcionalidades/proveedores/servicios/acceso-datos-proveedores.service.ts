import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ServicioDatos } from '@nucleo/firebase';
import { CategoriaServicio, Proveedor } from '@compartido/modelos';

@Injectable({
  providedIn: 'root'
})
export class ServicioAccesoDatosProveedores {
  private readonly servicioDatos = inject(ServicioDatos);

  registrarProveedor(proveedor: Omit<Proveedor, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    return this.servicioDatos.crearProveedor(proveedor);
  }

  obtenerProveedores(tipoServicio?: string): Observable<Proveedor[]> {
    return this.servicioDatos.obtenerProveedores(tipoServicio);
  }

  obtenerProveedor(proveedorId: string): Observable<Proveedor | null> {
    return this.servicioDatos.obtenerProveedor(proveedorId);
  }

  actualizarProveedor(proveedorId: string, cambios: Partial<Proveedor>): Promise<void> {
    return this.servicioDatos.actualizarProveedor(proveedorId, cambios);
  }

  obtenerCategoriasServicio(): CategoriaServicio[] {
    return this.servicioDatos.obtenerCategoriasServicio();
  }
}
