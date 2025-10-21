import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, user, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Observable, from, map, switchMap } from 'rxjs';
import { User } from '@compartido/modelos/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  
  user$ = user(this.auth);
  
  currentUser$ = this.user$.pipe(
    switchMap(user => {
      if (!user) return from([null]);
      return this.getUserData(user.uid);
    })
  );

  async login(email: string, password: string): Promise<any> {
    try {
      const credential = await signInWithEmailAndPassword(this.auth, email, password);
      const userData = await this.getUserData(credential.user.uid).toPromise();
      return { user: credential.user, userData };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(email: string, password: string, userData: Partial<User>): Promise<any> {
    try {
      const credential = await createUserWithEmailAndPassword(this.auth, email, password);
      
      const newUser: User = {
        uid: credential.user.uid,
        name: userData.name || '',
        email: email,
        phone: userData.phone || '',
        location: userData.location || 'Santiago, Chile',
        planType: 'Básico',
        userType: userData.userType || 'client',
        businessName: userData.businessName,
        services: userData.services,
        rating: userData.rating || 0,
        totalReviews: userData.totalReviews || 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await this.createUserDocument(newUser);
      return { user: credential.user, userData: newUser };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async loginWithGoogle(): Promise<any> {
    try {
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(this.auth, provider);
      
      // Check if user document exists
      const userData = await this.getUserData(credential.user.uid).toPromise();
      
      if (!userData) {
        // Create new user document
        const newUser: User = {
          uid: credential.user.uid,
          name: credential.user.displayName || 'Usuario',
          email: credential.user.email || '',
          phone: '',
          location: 'Santiago, Chile',
          planType: 'Básico',
          userType: 'client',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        await this.createUserDocument(newUser);
        return { user: credential.user, userData: newUser, isNewUser: true };
      }
      
      return { user: credential.user, userData, isNewUser: false };
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  }

  async loginWithFacebook(): Promise<any> {
    try {
      const provider = new FacebookAuthProvider();
      const credential = await signInWithPopup(this.auth, provider);
      
      // Check if user document exists
      const userData = await this.getUserData(credential.user.uid).toPromise();
      
      if (!userData) {
        // Create new user document
        const newUser: User = {
          uid: credential.user.uid,
          name: credential.user.displayName || 'Usuario',
          email: credential.user.email || '',
          phone: '',
          location: 'Santiago, Chile',
          planType: 'Básico',
          userType: 'client',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        await this.createUserDocument(newUser);
        return { user: credential.user, userData: newUser, isNewUser: true };
      }
      
      return { user: credential.user, userData, isNewUser: false };
    } catch (error) {
      console.error('Facebook login error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  private async createUserDocument(userData: User): Promise<void> {
    const userDocRef = doc(this.firestore, `users/${userData.uid}`);
    await setDoc(userDocRef, userData);
  }

  private getUserData(uid: string): Observable<User | null> {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    return from(getDoc(userDocRef)).pipe(
      map(doc => {
        if (doc.exists()) {
          const data = doc.data() as User;
          return {
            ...data,
            createdAt: data.createdAt instanceof Date ? data.createdAt : new Date(data.createdAt),
            updatedAt: data.updatedAt instanceof Date ? data.updatedAt : new Date(data.updatedAt)
          };
        }
        return null;
      })
    );
  }

  async updateUserProfile(uid: string, updates: Partial<User>): Promise<void> {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    await setDoc(userDocRef, { ...updates, updatedAt: new Date() }, { merge: true });
  }
}