import { Component } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { pawOutline, paw, businessOutline, business, calendarOutline, calendar, ribbonOutline, ribbon } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom" class="marketpet-tab-bar">
        <ion-tab-button tab="pets">
          <ion-icon name="paw"></ion-icon>
          <ion-label>Mascotas</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="providers">
          <ion-icon name="business"></ion-icon>
          <ion-label>Servicios</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="appointments">
          <ion-icon name="calendar"></ion-icon>
          <ion-label>Citas</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="subscription">
          <ion-icon name="ribbon"></ion-icon>
          <ion-label>Planes</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
  styles: [`
    .marketpet-tab-bar {
      --background: var(--ion-color-light);
      --border: 1px solid var(--ion-color-light-shade);
      border-radius: 20px 20px 0 0;
      padding-bottom: env(safe-area-inset-bottom);
      
      ion-tab-button {
        --color: var(--ion-color-medium);
        --color-selected: var(--ion-color-primary);
        
        ion-icon {
          font-size: 1.5rem;
        }
        
        ion-label {
          font-size: 0.75rem;
          font-weight: 500;
        }
        
        &.tab-selected {
          --color: var(--ion-color-primary);
          
          ion-icon {
            transform: scale(1.1);
          }
        }
      }
    }
  `],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel]
})
export class TabsPage {
  constructor() {
    addIcons({ pawOutline, paw, businessOutline, business, calendarOutline, calendar, ribbonOutline, ribbon });
  }
}