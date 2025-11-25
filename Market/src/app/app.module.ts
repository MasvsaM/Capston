import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import {
  browserLocalPersistence,
  browserPopupRedirectResolver,
  initializeAuth,
  provideAuth,
  indexedDBLocalPersistence
} from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { Capacitor } from '@capacitor/core';
import { getApp, getApps, initializeApp as initializeFirebaseApp } from 'firebase/app';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { GuardianAutenticacion, GuardianRol } from '@nucleo/guardianes';

@NgModule({
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AppComponent,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => {
      const app = getApps().length ? getApp() : initializeFirebaseApp(environment.firebase);

      if (Capacitor.isNativePlatform()) {
        return initializeAuth(app, {
          persistence: indexedDBLocalPersistence,
          popupRedirectResolver: browserPopupRedirectResolver
        });
      }

      return initializeAuth(app, {
        persistence: [indexedDBLocalPersistence, browserLocalPersistence],
        popupRedirectResolver: browserPopupRedirectResolver
      });
    }),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    GuardianAutenticacion,
    GuardianRol,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
