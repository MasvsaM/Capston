import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ServicioAutenticacion } from '@nucleo/firebase';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GuardianAutenticacion implements CanActivate {
  private readonly servicioAutenticacion = inject(ServicioAutenticacion);
  private readonly router = inject(Router);

  canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.servicioAutenticacion.estadoAutenticacion$.pipe(
      take(1),
      map(usuario => {
        if (usuario) {
          return true;
        }
        return this.router.createUrlTree(['/autenticacion'], {
          queryParams: { redirectTo: state.url }
        });
      })
    );
  }
}
