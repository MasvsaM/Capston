import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, PreloadAllModules, withPreloading } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { environment } from './environments/environment';
import { getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { initializeAppCheck, ReCaptchaEnterpriseProvider, provideAppCheck } from '@angular/fire/app-check';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getDataConnect, provideDataConnect } from '@angular/fire/data-connect';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { getPerformance, providePerformance } from '@angular/fire/performance';
import { getRemoteConfig, provideRemoteConfig } from '@angular/fire/remote-config';
import { getVertexAI, provideVertexAI } from '@angular/fire/vertexai';

declare global {
  interface Window {
    firebase?: any;
  }
}

const loadScript = (src: string): Promise<void> =>
  new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Unable to load script ${src}`));
    document.head.append(script);
  });

const initFirebase = async (): Promise<void> => {
  if (typeof window === 'undefined' || !environment.firebase) {
    return;
  }

  await loadScript('https://www.gstatic.com/firebasejs/11.0.0/firebase-app-compat.js');

  const { firebase } = window;

  if (!firebase) {
    throw new Error('Firebase SDK not available');
  }

  firebase.initializeApp(environment.firebase);

  if (environment.firebase.measurementId) {
    await loadScript('https://www.gstatic.com/firebasejs/11.0.0/firebase-analytics-compat.js');
    firebase.analytics();
  }
};

void initFirebase().catch(error => console.error('Error initializing Firebase', error));

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()), provideFirebaseApp(() => initializeApp({ projectId: "marketpet-708c9", appId: "1:1053161160027:web:19d7d51f8c64c57fa16e7e", storageBucket: "marketpet-708c9.firebasestorage.app", apiKey: "AIzaSyD3X_8vvI_Zherq77qdTAlqc2xYcpDuuHw", authDomain: "marketpet-708c9.firebaseapp.com", messagingSenderId: "1053161160027", measurementId: "G-0M9WYQPHJB", projectNumber: "1053161160027", version: "2" })), provideAuth(() => getAuth()), provideAnalytics(() => getAnalytics()), ScreenTrackingService, UserTrackingService, provideAppCheck(() => {
  // TODO get a reCAPTCHA Enterprise site key here https://console.cloud.google.com/security/recaptcha?project=_
  const provider = new ReCaptchaEnterpriseProvider('YOUR_RECAPTCHA_ENTERPRISE_SITE_KEY');
  return initializeAppCheck(undefined, { provider, isTokenAutoRefreshEnabled: true });
}), provideFirestore(() => getFirestore()), provideDatabase(() => getDatabase()), provideDataConnect(() => getDataConnect({connector: "example",location: "southamerica-west1",service: "market"})), provideFunctions(() => getFunctions()), provideMessaging(() => getMessaging()), providePerformance(() => getPerformance()), provideStorage(() => getStorage()), provideRemoteConfig(() => getRemoteConfig()), provideVertexAI(() => getVertexAI()), provideFirebaseApp(() => initializeApp({ projectId: "marketpet-708c9", appId: "1:1053161160027:web:19d7d51f8c64c57fa16e7e", storageBucket: "marketpet-708c9.firebasestorage.app", apiKey: "AIzaSyD3X_8vvI_Zherq77qdTAlqc2xYcpDuuHw", authDomain: "marketpet-708c9.firebaseapp.com", messagingSenderId: "1053161160027", measurementId: "G-0M9WYQPHJB", projectNumber: "1053161160027", version: "2" })), provideAuth(() => getAuth()), provideAnalytics(() => getAnalytics()), ScreenTrackingService, UserTrackingService, provideFirestore(() => getFirestore()), provideDatabase(() => getDatabase()), provideStorage(() => getStorage()),
  ],
}).catch(error => console.error(error));
