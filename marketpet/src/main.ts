import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
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

void initFirebase().catch(err => console.error('Error initializing Firebase', err));

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
