import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ServicioAutenticacion } from '@nucleo/firebase';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private servicioAutenticacion = inject(ServicioAutenticacion);
  private router = inject(Router);

  canActivate() {
    return this.servicioAutenticacion.estadoAutenticacion$.pipe(
      take(1),
      map(user => {
        if (user) {
          return true;
        } else {
          this.router.navigate(['/autenticacion']);
          return false;
        }
      })
    );
  }
}