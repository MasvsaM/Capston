import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { ServicioAutenticacion } from '@nucleo/firebase';
import { ServicioAccesoDatosProveedores } from '@funcionalidades/proveedores/servicios';
import { Proveedor } from '@compartido/modelos';
import { Observable, of } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ResolverPerfilProveedor implements Resolve<Proveedor | null> {
  private readonly servicioAutenticacion = inject(ServicioAutenticacion);
  private readonly servicioAccesoDatosProveedores = inject(ServicioAccesoDatosProveedores);
  private readonly router = inject(Router);

  resolve(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Proveedor | null> {
    return this.servicioAutenticacion.usuarioActual$.pipe(
      take(1),
      switchMap(usuario => {
        if (!usuario) {
          this.router.navigate(['/autenticacion'], {
            queryParams: { redirectTo: state.url }
          });
          return of(null);
        }

        return this.servicioAccesoDatosProveedores.obtenerProveedor(usuario.uid).pipe(
          take(1),
          tap(perfil => {
            if (!perfil) {
              this.router.navigate(['/proveedores/onboarding'], { replaceUrl: true });
            }
          })
        );
      })
    );
  }
}
