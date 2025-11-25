import { Injectable, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, FacebookAuthProvider, User } from '@angular/fire/auth';
import {
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile
} from '@angular/fire/auth';
import { doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { BehaviorSubject, from, of, switchMap } from 'rxjs';
import { Usuario } from '@compartido/modelos';

@Injectable({
  providedIn: 'root'
})
export class ServicioAutenticacion {
  private readonly auth = inject(Auth);
  private readonly firestore = inject(Firestore);

  private readonly authStateSubject = new BehaviorSubject<User | null>(null);
  private readonly userSubject = new BehaviorSubject<Usuario | null>(null);
  private pendingUserType: Usuario['userType'] | undefined;

  readonly estadoAutenticacion$ = this.authStateSubject.asObservable();
  readonly usuarioActual$ = this.userSubject.asObservable();

  constructor() {
    authState(this.auth)
      .pipe(
        switchMap(user => {
          this.authStateSubject.next(user);
          if (user) {
            return from(this.fetchAndSyncUserProfile(user));
          }

          this.userSubject.next(null);
          return of(null);
        })
      )
      .subscribe(profile => {
        if (profile) {
          this.userSubject.next(profile);
        }
      });
  }

  async iniciarSesion(
    correo: string,
    contrasena: string,
    opciones?: { userType?: 'client' | 'provider' }
  ): Promise<any> {
    this.pendingUserType = opciones?.userType;
    const credential = await signInWithEmailAndPassword(this.auth, correo, contrasena);
    const datosUsuario = await this.fetchAndSyncUserProfile(credential.user, opciones);
    return { usuario: credential.user, datosUsuario };
  }

  async registrar(correo: string, contrasena: string, datos: Partial<Usuario>): Promise<any> {
    this.pendingUserType = datos.userType;
    const credential = await createUserWithEmailAndPassword(this.auth, correo, contrasena);
    if (datos.name) {
      await updateProfile(credential.user, { displayName: datos.name });
    }

    const datosUsuario = await this.fetchAndSyncUserProfile(credential.user, datos);
    return { usuario: credential.user, datosUsuario };
  }

  async iniciarSesionConGoogle(opciones?: { userType?: 'client' | 'provider' }): Promise<any> {
    const provider = new GoogleAuthProvider();
    this.pendingUserType = opciones?.userType;
    const credential = await signInWithPopup(this.auth, provider);
    const esUsuarioNuevo = (credential as any)?._tokenResponse?.isNewUser ?? false;
    const datosUsuario = await this.fetchAndSyncUserProfile(credential.user, opciones);
    return { usuario: credential.user, datosUsuario, esUsuarioNuevo };
  }

  async iniciarSesionConFacebook(opciones?: { userType?: 'client' | 'provider' }): Promise<any> {
    const provider = new FacebookAuthProvider();
    this.pendingUserType = opciones?.userType;
    const credential = await signInWithPopup(this.auth, provider);
    const esUsuarioNuevo = (credential as any)?._tokenResponse?.isNewUser ?? false;
    const datosUsuario = await this.fetchAndSyncUserProfile(credential.user, opciones);
    return { usuario: credential.user, datosUsuario, esUsuarioNuevo };
  }

  async cerrarSesion(): Promise<void> {
    await signOut(this.auth);
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
      updatedAt: new Date()
    };

    await setDoc(doc(this.firestore, `users/${uid}`), this.cleanUserPayload(actualizado), { merge: true });
    this.userSubject.next(actualizado);
  }

  private async fetchAndSyncUserProfile(user: User, overrides: Partial<Usuario> = {}): Promise<Usuario> {
    const referencia = doc(this.firestore, `users/${user.uid}`);
    const snapshot = await getDoc(referencia);
    const existingData = snapshot.data();
    const now = new Date();

    const resolvedUserType: Usuario['userType'] =
      overrides.userType ?? this.pendingUserType ?? (existingData?.['userType'] as Usuario['userType']) ?? 'client';

    const profile: Usuario = {
      uid: user.uid,
      name: overrides.name ?? existingData?.['name'] ?? user.displayName ?? 'Usuario MarketPet',
      email: user.email ?? existingData?.['email'] ?? '',
      phone: overrides.phone ?? existingData?.['phone'] ?? '+56 9 0000 0000',
      location: overrides.location ?? existingData?.['location'] ?? 'Santiago, Chile',
      planType: overrides.planType ?? existingData?.['planType'] ?? 'Básico',
      userType: resolvedUserType,
      businessName: overrides.businessName ?? existingData?.['businessName'],
      services: overrides.services ?? existingData?.['services'],
      rating: overrides.rating ?? existingData?.['rating'],
      totalReviews: overrides.totalReviews ?? existingData?.['totalReviews'],
      createdAt: this.extractDate(existingData?.['createdAt']) ?? now,
      updatedAt: now
    };

    this.pendingUserType = undefined;
    await setDoc(referencia, this.cleanUserPayload(profile), { merge: true });
    this.userSubject.next(profile);
    return profile;
  }

  private extractDate(value: any): Date | undefined {
    if (!value) return undefined;
    if (value instanceof Date) return value;
    if (typeof value.toDate === 'function') return value.toDate();
    return new Date(value);
  }

  private cleanUserPayload(profile: Usuario) {
    const payload: Record<string, any> = { ...profile };
    Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);
    return payload;
  }
}
