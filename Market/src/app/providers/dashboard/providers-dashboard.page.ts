import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { settingsOutline } from 'ionicons/icons';
import { ProviderPreferencesService } from '../services/provider-preferences.service';
import { CalendarWidgetComponent } from './widgets/calendar-widget.component';
import { InventoryWidgetComponent } from './widgets/inventory-widget.component';
import { ServicesWidgetComponent } from './widgets/services-widget.component';
import { SpeciesWidgetComponent } from './widgets/species-widget.component';

@Component({
  selector: 'app-providers-dashboard',
  templateUrl: './providers-dashboard.page.html',
  styleUrls: ['./providers-dashboard.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonButtons,
    IonIcon,
    IonContent,
    IonSpinner,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    CalendarWidgetComponent,
    InventoryWidgetComponent,
    ServicesWidgetComponent,
    SpeciesWidgetComponent,
  ],
})
export class ProvidersDashboardPage {
  private readonly preferencesService = inject(ProviderPreferencesService);
  private readonly router = inject(Router);

  protected readonly settingsOutline = settingsOutline;
  protected readonly preferences$ = this.preferencesService.preferences$;

  protected readonly sampleAppointments = [
    {
      id: '1',
      title: 'Consulta general',
      date: 'Lunes 10:00 a. m.',
      owner: 'Luna (canino)',
    },
    {
      id: '2',
      title: 'Vacunación',
      date: 'Martes 4:00 p. m.',
      owner: 'Simón (felino)',
    },
  ];

  protected readonly sampleInventory = [
    {
      id: '1',
      name: 'Alimento balanceado 10kg',
      stock: 8,
    },
    {
      id: '2',
      name: 'Antipulgas tópico',
      stock: 15,
    },
  ];

  protected editPreferences(): void {
    void this.router.navigate(['/providers/preferences']);
  }
}
