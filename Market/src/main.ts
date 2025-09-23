import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, PreloadAllModules, withPreloading } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { environment } from './environments/environment';

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
  ],
}).catch(error => console.error(error));
