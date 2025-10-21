import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where
} from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { Cita, Mascota, Proveedor, CategoriaServicio } from '@compartido/modelos';

@Injectable({
  providedIn: 'root'
})
export class ServicioDatos {
  private readonly firestore = inject(Firestore);

  async crearMascota(mascota: Omit<Mascota, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const coleccionMascotas = collection(this.firestore, 'pets');
    const nuevaMascota = {
      ...mascota,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const referencia = await addDoc(coleccionMascotas, nuevaMascota);
    return referencia.id;
  }

  obtenerMascotasPorUsuario(usuarioId: string): Observable<Mascota[]> {
    const coleccionMascotas = collection(this.firestore, 'pets');
    const consulta = query(
      coleccionMascotas,
      where('userId', '==', usuarioId),
      orderBy('createdAt', 'desc')
    );

    return from(getDocs(consulta)).pipe(
      map(snapshot =>
        snapshot.docs.map(documento => ({
          id: documento.id,
          ...documento.data(),
          createdAt: documento.data()['createdAt']?.toDate() || new Date(),
          updatedAt: documento.data()['updatedAt']?.toDate() || new Date()
        } as Mascota))
      )
    );
  }

  async actualizarMascota(mascotaId: string, cambios: Partial<Mascota>): Promise<void> {
    const referencia = doc(this.firestore, `pets/${mascotaId}`);
    await updateDoc(referencia, { ...cambios, updatedAt: new Date() });
  }

  async eliminarMascota(mascotaId: string): Promise<void> {
    const referencia = doc(this.firestore, `pets/${mascotaId}`);
    await deleteDoc(referencia);
  }

  async crearProveedor(proveedor: Omit<Proveedor, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const referencia = doc(this.firestore, `providers/${proveedor.userId}`);
    const nuevoProveedor = {
      ...proveedor,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await setDoc(referencia, nuevoProveedor);
    return proveedor.userId;
  }

  obtenerProveedores(tipoServicio?: string): Observable<Proveedor[]> {
    const coleccionProveedores = collection(this.firestore, 'providers');
    let consulta = query(coleccionProveedores, orderBy('rating', 'desc'), limit(20));

    if (tipoServicio) {
      consulta = query(
        coleccionProveedores,
        where('services', 'array-contains', tipoServicio),
        orderBy('rating', 'desc'),
        limit(20)
      );
    }

    return from(getDocs(consulta)).pipe(
      map(snapshot =>
        snapshot.docs.map(documento => ({
          id: documento.id,
          ...documento.data(),
          createdAt: documento.data()['createdAt']?.toDate() || new Date(),
          updatedAt: documento.data()['updatedAt']?.toDate() || new Date()
        } as Proveedor))
      )
    );
  }

  obtenerProveedor(proveedorId: string): Observable<Proveedor | null> {
    const referencia = doc(this.firestore, `providers/${proveedorId}`);
    return from(getDoc(referencia)).pipe(
      map(documento => {
        if (documento.exists()) {
          return {
            id: documento.id,
            ...documento.data(),
            createdAt: documento.data()['createdAt']?.toDate() || new Date(),
            updatedAt: documento.data()['updatedAt']?.toDate() || new Date()
          } as Proveedor;
        }
        return null;
      })
    );
  }

  async actualizarProveedor(proveedorId: string, cambios: Partial<Proveedor>): Promise<void> {
    const referencia = doc(this.firestore, `providers/${proveedorId}`);
    await updateDoc(referencia, { ...cambios, updatedAt: new Date() });
  }

  async crearCita(cita: Omit<Cita, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const coleccionCitas = collection(this.firestore, 'appointments');
    const nuevaCita = {
      ...cita,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const referencia = await addDoc(coleccionCitas, nuevaCita);
    return referencia.id;
  }

  obtenerCitasPorUsuario(usuarioId: string): Observable<Cita[]> {
    const coleccionCitas = collection(this.firestore, 'appointments');
    const consulta = query(
      coleccionCitas,
      where('userId', '==', usuarioId),
      orderBy('createdAt', 'desc')
    );

    return from(getDocs(consulta)).pipe(
      map(snapshot =>
        snapshot.docs.map(documento => ({
          id: documento.id,
          ...documento.data(),
          createdAt: documento.data()['createdAt']?.toDate() || new Date(),
          updatedAt: documento.data()['updatedAt']?.toDate() || new Date()
        } as Cita))
      )
    );
  }

  obtenerCitasPorProveedor(proveedorId: string): Observable<Cita[]> {
    const coleccionCitas = collection(this.firestore, 'appointments');
    const consulta = query(
      coleccionCitas,
      where('providerId', '==', proveedorId),
      orderBy('createdAt', 'desc')
    );

    return from(getDocs(consulta)).pipe(
      map(snapshot =>
        snapshot.docs.map(documento => ({
          id: documento.id,
          ...documento.data(),
          createdAt: documento.data()['createdAt']?.toDate() || new Date(),
          updatedAt: documento.data()['updatedAt']?.toDate() || new Date()
        } as Cita))
      )
    );
  }

  async actualizarCita(citaId: string, cambios: Partial<Cita>): Promise<void> {
    const referencia = doc(this.firestore, `appointments/${citaId}`);
    await updateDoc(referencia, { ...cambios, updatedAt: new Date() });
  }

  async cancelarCita(citaId: string): Promise<void> {
    await this.actualizarCita(citaId, { status: 'cancelled' });
  }

  obtenerCategoriasServicio(): CategoriaServicio[] {
    return [
      {
        id: 'veterinary',
        name: 'Veterinaria',
        icon: 'medical',
        description: 'Consultas médicas, cirugías y tratamientos',
        subcategories: ['Consulta General', 'Cirugía', 'Medicina Interna', 'Cardiología', 'Oftalmología']
      },
      {
        id: 'grooming',
        name: 'Grooming',
        icon: 'cut',
        description: 'Baño, corte y cuidado estético',
        subcategories: ['Baño', 'Corte de Pelo', 'Corte de Uñas', 'Limpieza de Oídos', 'Spa']
      },
      {
        id: 'walking',
        name: 'Paseos',
        icon: 'walk',
        description: 'Paseos y ejercicio para tu mascota',
        subcategories: ['Paseo Individual', 'Paseo Grupal', 'Ejercicio Intensivo', 'Socialización']
      },
      {
        id: 'boarding',
        name: 'Hospedaje',
        icon: 'home',
        description: 'Cuidado temporal en casa del cuidador',
        subcategories: ['Hospedaje Diario', 'Hospedaje Nocturno', 'Cuidado Prolongado', 'Cuidado Especial']
      },
      {
        id: 'training',
        name: 'Entrenamiento',
        icon: 'school',
        description: 'Educación y entrenamiento conductual',
        subcategories: ['Obediencia Básica', 'Entrenamiento Avanzado', 'Corrección de Conducta', 'Socialización']
      },
      {
        id: 'products',
        name: 'Productos',
        icon: 'bag',
        description: 'Alimentos, juguetes y accesorios',
        subcategories: ['Alimentos', 'Juguetes', 'Accesorios', 'Medicamentos', 'Camas y Transportadores']
      }
    ];
  }
}
