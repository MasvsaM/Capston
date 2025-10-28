import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from '@compartido/modelos';

interface SimulatedAuthUser {
  uid: string;
  email: string;
  displayName: string;
}

@Injectable({
  providedIn: 'root'
})
export class ServicioAutenticacion {
  private readonly authStateSubject = new BehaviorSubject<SimulatedAuthUser | null>(null);
  private readonly userSubject = new BehaviorSubject<Usuario | null>(null);

  readonly estadoAutenticacion$ = this.authStateSubject.asObservable();
  readonly usuarioActual$ = this.userSubject.asObservable();

  async iniciarSesion(
    correo: string,
    _contrasena: string,
    opciones?: { userType?: 'client' | 'provider' }
  ): Promise<any> {
    const authUser = this.createSimulatedAuthUser(correo);
    const overrides: Partial<Usuario> = opciones?.userType ? { userType: opciones.userType } : {};
    const datosUsuario = this.setAuthenticatedUser(authUser, overrides);
    return { usuario: authUser, datosUsuario };
  }

  async registrar(correo: string, _contrasena: string, datos: Partial<Usuario>): Promise<any> {
    const authUser = this.createSimulatedAuthUser(correo, datos.name);
    const datosUsuario = this.setAuthenticatedUser(authUser, datos);
    return { usuario: authUser, datosUsuario };
  }

  async iniciarSesionConGoogle(opciones?: { userType?: 'client' | 'provider' }): Promise<any> {
    const authUser = this.createSimulatedAuthUser('demo-google@marketpet.app', 'Usuario Google');
    const overrides: Partial<Usuario> = opciones?.userType ? { userType: opciones.userType } : {};
    const datosUsuario = this.setAuthenticatedUser(authUser, overrides);
    return { usuario: authUser, datosUsuario, esUsuarioNuevo: false };
  }

  async iniciarSesionConFacebook(opciones?: { userType?: 'client' | 'provider' }): Promise<any> {
    const authUser = this.createSimulatedAuthUser('demo-facebook@marketpet.app', 'Usuario Facebook');
    const overrides: Partial<Usuario> = opciones?.userType ? { userType: opciones.userType } : {};
    const datosUsuario = this.setAuthenticatedUser(authUser, overrides);
    return { usuario: authUser, datosUsuario, esUsuarioNuevo: false };
  }

  async cerrarSesion(): Promise<void> {
    this.authStateSubject.next(null);
    this.userSubject.next(null);
  }

  async actualizarPerfilUsuario(uid: string, cambios: Partial<Usuario>): Promise<void> {
    const actual = this.userSubject.value;
    if (!actual || actual.uid !== uid) {
      return;
    }

    const actualizado: Usuario = {
      ...actual,
      ...cambios,
      name: cambios.name ?? actual.name,
      phone: cambios.phone ?? actual.phone,
      location: cambios.location ?? actual.location,
      planType: cambios.planType ?? actual.planType,
      userType: cambios.userType ?? actual.userType,
      businessName: cambios.businessName ?? actual.businessName,
      services: cambios.services ?? actual.services,
      rating: cambios.rating ?? actual.rating,
      totalReviews: cambios.totalReviews ?? actual.totalReviews,
      updatedAt: new Date()
    };

    this.userSubject.next(actualizado);
  }

  private setAuthenticatedUser(authUser: SimulatedAuthUser, overrides: Partial<Usuario> = {}): Usuario {
    const base =
      this.userSubject.value && this.userSubject.value.uid === authUser.uid
        ? this.userSubject.value
        : this.createDefaultUserData(authUser, overrides);

    const actualizado: Usuario = {
      ...base,
      ...overrides,
      name: overrides.name ?? base.name,
      phone: overrides.phone ?? base.phone,
      email: authUser.email,
      location: overrides.location ?? base.location,
      planType: overrides.planType ?? base.planType,
      userType: overrides.userType ?? base.userType,
      businessName: overrides.businessName ?? base.businessName,
      services: overrides.services ?? base.services,
      rating: overrides.rating ?? base.rating,
      totalReviews: overrides.totalReviews ?? base.totalReviews,
      updatedAt: new Date(),
      createdAt: base.createdAt ?? new Date()
    };

    this.authStateSubject.next(authUser);
    this.userSubject.next(actualizado);

    return actualizado;
  }

  private createDefaultUserData(authUser: SimulatedAuthUser, overrides: Partial<Usuario>): Usuario {
    const now = new Date();
    const userType = overrides.userType ?? this.resolveUserType(authUser.email);

    return {
      uid: authUser.uid,
      name: overrides.name ?? authUser.displayName ?? 'Usuario Demo',
      email: authUser.email,
      phone: overrides.phone ?? '+56 9 0000 0000',
      location: overrides.location ?? 'Santiago, Chile',
      planType: overrides.planType ?? 'Premium',
      userType,
      businessName: overrides.businessName,
      services: overrides.services,
      rating: overrides.rating ?? (userType === 'provider' ? 4.9 : undefined),
      totalReviews: overrides.totalReviews ?? (userType === 'provider' ? 128 : undefined),
      createdAt: overrides.createdAt ?? now,
      updatedAt: overrides.updatedAt ?? now
    };
  }

  private createSimulatedAuthUser(email: string, name?: string): SimulatedAuthUser {
    return {
      uid: this.generateUid(email),
      email,
      displayName: name || 'Usuario Demo'
    };
  }

  private resolveUserType(email: string): 'client' | 'provider' {
    const normalized = email.toLowerCase();
    return normalized.includes('proveedor') || normalized.includes('provider') ? 'provider' : 'client';
  }

  private generateUid(email: string): string {
    const normalized = email ? email.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() : 'usuario';
    return `sim-${normalized || 'usuario'}`;
  }
}
