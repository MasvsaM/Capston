import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docSnapshots,
  setDoc,
} from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FirebaseCrudService {
  private readonly firestore = inject(Firestore);

  private collectionRef<T extends Record<string, unknown>>(path: string) {
    return collection(this.firestore, path);
  }

  private documentRef(path: string, id: string) {
    return doc(this.firestore, `${path}/${id}`);
  }

  watchCollection<T extends Record<string, unknown>>(path: string): Observable<Array<T & { id: string }>> {
    return collectionData(this.collectionRef<T>(path), { idField: 'id' }) as Observable<Array<T & { id: string }>>;
  }

  watchDocument<T extends Record<string, unknown>>(path: string, id: string): Observable<(T & { id: string }) | null> {
    return docSnapshots(this.documentRef(path, id)).pipe(
      map(snapshot => {
        if (!snapshot.exists()) {
          return null;
        }

        return { id: snapshot.id, ...(snapshot.data() as T) };
      }),
    );
  }

  async createDocument<T extends Record<string, unknown>>(path: string, data: T): Promise<string> {
    const docRef = await addDoc(this.collectionRef<T>(path), {
      ...data,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return docRef.id;
  }

  async setDocument<T extends Record<string, unknown>>(path: string, id: string, data: T): Promise<void> {
    const timestamp = Date.now();
    const payload: Record<string, unknown> = {
      ...data,
      id,
      updatedAt: timestamp,
    };

    if (!('createdAt' in payload)) {
      payload['createdAt'] = timestamp;
    }

    await setDoc(this.documentRef(path, id), payload, { merge: true });
  }

  async updateDocument<T extends Record<string, unknown>>(path: string, id: string, data: Partial<T>): Promise<void> {
    await setDoc(
      this.documentRef(path, id),
      {
        ...data,
        updatedAt: Date.now(),
      } as Partial<T>,
      { merge: true },
    );
  }

  async deleteDocument(path: string, id: string): Promise<void> {
    await deleteDoc(this.documentRef(path, id));
  }
}
