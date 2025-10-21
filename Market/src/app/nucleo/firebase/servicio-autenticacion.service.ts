import { Injectable, inject } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  user as usuarioFirebase
} from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Observable, from, map, switchMap } from 'rxjs';
import { Usuario } from '@compartido/modelos';

@Injectable({
  providedIn: 'root'
})
export class ServicioAutenticacion {
  private readonly auth = inject(Auth);
  private readonly firestore = inject(Firestore);

  private readonly usuarioFirebase$ = usuarioFirebase(this.auth);

  readonly estadoAutenticacion$ = this.usuarioFirebase$;

  readonly usuarioActual$ = this.usuarioFirebase$.pipe(
    switchMap(usuario => {
      if (!usuario) {
        return from([null]);
      }
      return this.obtenerDatosUsuario(usuario.uid);
    })
  );

  async iniciarSesion(correo: string, contrasena: string): Promise<any> {
    try {
      const credencial = await signInWithEmailAndPassword(this.auth, correo, contrasena);
      const datosUsuario = await this.obtenerDatosUsuario(credencial.user.uid).toPromise();
      return { usuario: credencial.user, datosUsuario };
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  }

  async registrar(correo: string, contrasena: string, datos: Partial<Usuario>): Promise<any> {
    try {
      const credencial = await createUserWithEmailAndPassword(this.auth, correo, contrasena);

      const nuevoUsuario: Usuario = {
        uid: credencial.user.uid,
        name: datos.name || '',
        email: correo,
        phone: datos.phone || '',
        location: datos.location || 'Santiago, Chile',
        planType: 'Básico',
        userType: datos.userType || 'client',
        businessName: datos.businessName,
        services: datos.services,
        rating: datos.rating || 0,
        totalReviews: datos.totalReviews || 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await this.crearDocumentoUsuario(nuevoUsuario);
      return { usuario: credencial.user, datosUsuario: nuevoUsuario };
    } catch (error) {
      console.error('Error al registrar:', error);
      throw error;
    }
  }

  async iniciarSesionConGoogle(): Promise<any> {
    try {
      const proveedor = new GoogleAuthProvider();
      const credencial = await signInWithPopup(this.auth, proveedor);

      const datosUsuario = await this.obtenerDatosUsuario(credencial.user.uid).toPromise();

      if (!datosUsuario) {
        const nuevoUsuario: Usuario = {
          uid: credencial.user.uid,
          name: credencial.user.displayName || 'Usuario',
          email: credencial.user.email || '',
          phone: '',
          location: 'Santiago, Chile',
          planType: 'Básico',
          userType: 'client',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        await this.crearDocumentoUsuario(nuevoUsuario);
        return { usuario: credencial.user, datosUsuario: nuevoUsuario, esUsuarioNuevo: true };
      }

      return { usuario: credencial.user, datosUsuario, esUsuarioNuevo: false };
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
      throw error;
    }
  }

  async iniciarSesionConFacebook(): Promise<any> {
    try {
      const proveedor = new FacebookAuthProvider();
      const credencial = await signInWithPopup(this.auth, proveedor);

      const datosUsuario = await this.obtenerDatosUsuario(credencial.user.uid).toPromise();

      if (!datosUsuario) {
        const nuevoUsuario: Usuario = {
          uid: credencial.user.uid,
          name: credencial.user.displayName || 'Usuario',
          email: credencial.user.email || '',
          phone: '',
          location: 'Santiago, Chile',
          planType: 'Básico',
          userType: 'client',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        await this.crearDocumentoUsuario(nuevoUsuario);
        return { usuario: credencial.user, datosUsuario: nuevoUsuario, esUsuarioNuevo: true };
      }

      return { usuario: credencial.user, datosUsuario, esUsuarioNuevo: false };
    } catch (error) {
      console.error('Error al iniciar sesión con Facebook:', error);
      throw error;
    }
  }

  async cerrarSesion(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }

  async actualizarPerfilUsuario(uid: string, cambios: Partial<Usuario>): Promise<void> {
    const referencia = doc(this.firestore, `users/${uid}`);
    await setDoc(referencia, { ...cambios, updatedAt: new Date() }, { merge: true });
  }

  private async crearDocumentoUsuario(usuario: Usuario): Promise<void> {
    const referencia = doc(this.firestore, `users/${usuario.uid}`);
    await setDoc(referencia, usuario);
  }

  private obtenerDatosUsuario(uid: string): Observable<Usuario | null> {
    const referencia = doc(this.firestore, `users/${uid}`);
    return from(getDoc(referencia)).pipe(
      map(documento => {
        if (documento.exists()) {
          const datos = documento.data() as Usuario;
          return {
            ...datos,
            createdAt: datos.createdAt instanceof Date ? datos.createdAt : new Date(datos.createdAt),
            updatedAt: datos.updatedAt instanceof Date ? datos.updatedAt : new Date(datos.updatedAt)
          };
        }
        return null;
      })
    );
  }
}
