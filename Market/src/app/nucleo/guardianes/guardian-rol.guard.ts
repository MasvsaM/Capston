import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ServicioAutenticacion } from '@nucleo/firebase';
import { Usuario } from '@compartido/modelos';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

type RolPermitido = Usuario['userType'];

@Injectable({
  providedIn: 'root'
})
export class GuardianRol implements CanActivate {
  private readonly servicioAutenticacion = inject(ServicioAutenticacion);
  private readonly router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    const rolesPermitidos = (route.data?.['roles'] as RolPermitido[] | undefined) ?? [];

    return this.servicioAutenticacion.usuarioActual$.pipe(
      take(1),
      map(usuario => {
        if (!usuario) {
          return this.router.createUrlTree(['/autenticacion'], {
            queryParams: { redirectTo: state.url }
          });
        }

        if (!rolesPermitidos.length || rolesPermitidos.includes(usuario.userType)) {
          return true;
        }

        const rutaRedireccion = usuario.userType === 'client' ? ['/proveedores/registro'] : ['/'];
        return this.router.createUrlTree(rutaRedireccion);
      })
    );
  }
}
