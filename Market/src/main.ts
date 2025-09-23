import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import type { Provider } from '@angular/core';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAnalytics, getAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

const firebaseProviders: Provider[] = [
  provideFirebaseApp(() => initializeApp(environment.firebase)),
];

if (environment.firebase.measurementId) {
  firebaseProviders.push(
    provideAnalytics(() => getAnalytics()),
    ScreenTrackingService,
    UserTrackingService,
  );
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    ...firebaseProviders,
  ],
}).catch(error => console.error(error));
