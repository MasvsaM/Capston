import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, addDoc, getDocs, getDoc, updateDoc, deleteDoc, query, where, orderBy, limit, setDoc } from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { Pet, Provider, Appointment, ServiceCategory } from '@compartido/modelos/user.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private firestore = inject(Firestore);

  // Pet operations
  async createPet(petData: Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const petsCollection = collection(this.firestore, 'pets');
    const newPet = {
      ...petData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const docRef = await addDoc(petsCollection, newPet);
    return docRef.id;
  }

  getUserPets(userId: string): Observable<Pet[]> {
    const petsCollection = collection(this.firestore, 'pets');
    const q = query(petsCollection, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    
    return from(getDocs(q)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data()['createdAt']?.toDate() || new Date(),
          updatedAt: doc.data()['updatedAt']?.toDate() || new Date()
        } as Pet))
      )
    );
  }

  async updatePet(petId: string, updates: Partial<Pet>): Promise<void> {
    const petDocRef = doc(this.firestore, `pets/${petId}`);
    await updateDoc(petDocRef, { ...updates, updatedAt: new Date() });
  }

  async deletePet(petId: string): Promise<void> {
    const petDocRef = doc(this.firestore, `pets/${petId}`);
    await deleteDoc(petDocRef);
  }

  // Provider operations
  async createProvider(providerData: Omit<Provider, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const providerDocRef = doc(this.firestore, `providers/${providerData.userId}`);
    const newProvider = {
      ...providerData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await setDoc(providerDocRef, newProvider);
    return providerData.userId;
  }

  getProviders(serviceType?: string, location?: string): Observable<Provider[]> {
    const providersCollection = collection(this.firestore, 'providers');
    let q = query(providersCollection, orderBy('rating', 'desc'), limit(20));
    
    if (serviceType) {
      q = query(providersCollection, where('services', 'array-contains', serviceType), orderBy('rating', 'desc'), limit(20));
    }
    
    return from(getDocs(q)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data()['createdAt']?.toDate() || new Date(),
          updatedAt: doc.data()['updatedAt']?.toDate() || new Date()
        } as Provider))
      )
    );
  }

  getProvider(providerId: string): Observable<Provider | null> {
    const providerDocRef = doc(this.firestore, `providers/${providerId}`);
    return from(getDoc(providerDocRef)).pipe(
      map(doc => {
        if (doc.exists()) {
          return {
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data()['createdAt']?.toDate() || new Date(),
            updatedAt: doc.data()['updatedAt']?.toDate() || new Date()
          } as Provider;
        }
        return null;
      })
    );
  }

  async updateProvider(providerId: string, updates: Partial<Provider>): Promise<void> {
    const providerDocRef = doc(this.firestore, `providers/${providerId}`);
    await updateDoc(providerDocRef, { ...updates, updatedAt: new Date() });
  }

  // Appointment operations
  async createAppointment(appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const appointmentsCollection = collection(this.firestore, 'appointments');
    const newAppointment = {
      ...appointmentData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const docRef = await addDoc(appointmentsCollection, newAppointment);
    return docRef.id;
  }

  getUserAppointments(userId: string): Observable<Appointment[]> {
    const appointmentsCollection = collection(this.firestore, 'appointments');
    const q = query(appointmentsCollection, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    
    return from(getDocs(q)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data()['createdAt']?.toDate() || new Date(),
          updatedAt: doc.data()['updatedAt']?.toDate() || new Date()
        } as Appointment))
      )
    );
  }

  getProviderAppointments(providerId: string): Observable<Appointment[]> {
    const appointmentsCollection = collection(this.firestore, 'appointments');
    const q = query(appointmentsCollection, where('providerId', '==', providerId), orderBy('createdAt', 'desc'));
    
    return from(getDocs(q)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data()['createdAt']?.toDate() || new Date(),
          updatedAt: doc.data()['updatedAt']?.toDate() || new Date()
        } as Appointment))
      )
    );
  }

  async updateAppointment(appointmentId: string, updates: Partial<Appointment>): Promise<void> {
    const appointmentDocRef = doc(this.firestore, `appointments/${appointmentId}`);
    await updateDoc(appointmentDocRef, { ...updates, updatedAt: new Date() });
  }

  async cancelAppointment(appointmentId: string): Promise<void> {
    await this.updateAppointment(appointmentId, { status: 'cancelled' });
  }

  // Service categories (mock data for now)
  getServiceCategories(): ServiceCategory[] {
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
