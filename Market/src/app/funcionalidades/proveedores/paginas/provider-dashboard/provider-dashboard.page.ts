import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonCard,
  IonCardContent,
  IonAvatar,
  IonBadge,
  IonButton,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  IonSkeletonText
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  calendarOutline,
  locationOutline,
  callOutline,
  chatbubbleOutline,
  pencilOutline
} from 'ionicons/icons';
import { ServicioAutenticacion } from '@nucleo/firebase';
import { ServicioAccesoDatosCitas } from '@funcionalidades/citas/servicios';
import { Cita, Proveedor } from '@compartido/modelos';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-provider-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonCard,
    IonCardContent,
    IonAvatar,
    IonBadge,
    IonButton,
    IonIcon,
    IonRefresher,
    IonRefresherContent,
    IonSkeletonText
  ],
  template: `
    <ion-content class="dashboard-content">
      <ion-header class="marketpet-header" collapse="condense">
        <ion-toolbar>
          <ion-title>Panel de Proveedor</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-refresher slot="fixed" (ionRefresh)="refreshData($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <div class="dashboard-wrapper ion-padding">
        <ion-card class="provider-card marketpet-card" *ngIf="provider$ | async as provider; else loading">
          <ion-card-content>
            <div class="provider-header">
              <ion-avatar class="provider-avatar">
                <img [src]="provider.imageUrl || defaultImage" alt="Proveedor" />
              </ion-avatar>
              <div class="provider-info">
                <h2>{{ provider.businessName || provider.name }}</h2>
                <p>{{ provider.profession }} • {{ provider.location }}</p>
                <div class="provider-metrics">
                  <ion-badge color="warning">⭐ {{ provider.rating || '5.0' }}</ion-badge>
                  <ion-badge color="light">{{ provider.reviewCount || 0 }} reseñas</ion-badge>
                </div>
              </div>
              <ion-button fill="clear" (click)="editProfile()">
                <ion-icon name="pencil-outline" slot="icon-only"></ion-icon>
              </ion-button>
            </div>

            <div class="services-section" *ngIf="provider.specialties?.length">
              <h3>Servicios destacados</h3>
              <div class="services-list">
                <ion-badge color="primary" *ngFor="let service of provider.specialties">
                  {{ service }}
                </ion-badge>
              </div>
            </div>

            <div class="stats-grid">
              <div class="stat-item">
                <h4>Reservas activas</h4>
                <p>{{ (upcomingAppointments$ | async)?.length || 0 }}</p>
              </div>
              <div class="stat-item">
                <h4>Ingresos estimados</h4>
                <p>{{ provider.price || '$0' }}</p>
              </div>
            </div>
          </ion-card-content>
        </ion-card>
        <ng-template #loading>
          <ion-card class="provider-card marketpet-card">
            <ion-card-content>
              <div class="provider-header">
                <ion-skeleton-text animated style="width:60px;height:60px;border-radius:50%"></ion-skeleton-text>
                <div class="provider-info">
                  <ion-skeleton-text animated style="width:60%;height:20px"></ion-skeleton-text>
                  <ion-skeleton-text animated style="width:40%;height:16px"></ion-skeleton-text>
                </div>
              </div>
            </ion-card-content>
          </ion-card>
        </ng-template>

        <ion-card class="appointments-card marketpet-card">
          <ion-card-content>
            <div class="card-header">
              <h3>Próximas citas</h3>
              <ion-button fill="clear" size="small" (click)="goToAppointments()">
                Ver todas
              </ion-button>
            </div>

            <ng-container *ngIf="upcomingAppointments$ | async as appointments; else appointmentsLoading">
              <div class="empty-state" *ngIf="!appointments.length">
                <ion-icon name="calendar-outline"></ion-icon>
                <p>Aún no tienes citas agendadas.</p>
                <ion-button size="small" (click)="goToAppointments()">
                  Crear cita
                </ion-button>
              </div>

              <div class="appointments-list" *ngIf="appointments.length">
                <ion-card *ngFor="let appointment of appointments" class="appointment-item">
                  <ion-card-content>
                    <div class="appointment-header">
                      <h4>{{ appointment.petName }}</h4>
                      <ion-badge color="success">{{ appointment.status }}</ion-badge>
                    </div>
                    <div class="appointment-meta">
                      <div>
                        <ion-icon name="calendar-outline"></ion-icon>
                        <span>{{ appointment.date }} • {{ appointment.time }}</span>
                      </div>
                      <div>
                        <ion-icon name="location-outline"></ion-icon>
                        <span>{{ appointment.location }}</span>
                      </div>
                    </div>
                    <div class="appointment-actions">
                      <ion-button size="small" fill="outline" (click)="contactClient(appointment)">
                        <ion-icon name="call-outline" slot="start"></ion-icon>
                        Llamar
                      </ion-button>
                      <ion-button size="small" fill="outline" (click)="messageClient(appointment)">
                        <ion-icon name="chatbubble-outline" slot="start"></ion-icon>
                        Mensaje
                      </ion-button>
                    </div>
                  </ion-card-content>
                </ion-card>
              </div>
            </ng-container>

            <ng-template #appointmentsLoading>
              <div class="appointments-loading">
                <ion-skeleton-text animated style="width:100%;height:80px;border-radius:16px"></ion-skeleton-text>
              </div>
            </ng-template>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  `,
  styles: [`
    .dashboard-content {
      --background: var(--ion-color-light);
    }

    .dashboard-wrapper {
      max-width: 720px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .provider-card {
      border-radius: 24px;
      box-shadow: var(--marketpet-shadow);
    }

    .provider-header {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .provider-avatar {
      width: 60px;
      height: 60px;
    }

    .provider-info h2 {
      margin: 0;
      font-weight: 700;
    }

    .provider-info p {
      margin: 0.25rem 0;
      color: var(--ion-color-medium);
    }

    .provider-metrics {
      display: flex;
      gap: 0.5rem;
    }

    .services-section {
      margin-top: 1.5rem;
    }

    .services-section h3 {
      margin-bottom: 0.75rem;
      font-weight: 600;
    }

    .services-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .stat-item {
      background: var(--ion-color-light);
      border-radius: 16px;
      padding: 1rem;
      text-align: center;
      box-shadow: inset 0 0 0 1px rgba(0,0,0,0.04);
    }

    .stat-item h4 {
      margin: 0;
      color: var(--ion-color-medium);
      font-weight: 500;
    }

    .stat-item p {
      margin: 0.5rem 0 0 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--ion-color-dark);
    }

    .appointments-card {
      border-radius: 24px;
      box-shadow: var(--marketpet-shadow);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .appointments-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .appointment-item {
      border-radius: 16px;
    }

    .appointment-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .appointment-meta {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      color: var(--ion-color-medium);
      font-size: 0.9rem;
    }

    .appointment-meta div {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .appointment-actions {
      display: flex;
      gap: 0.75rem;
      margin-top: 1rem;
    }

    .appointments-loading {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .empty-state {
      text-align: center;
      padding: 2rem 1rem;
      color: var(--ion-color-medium);
    }

    .empty-state ion-icon {
      font-size: 2rem;
      margin-bottom: 0.75rem;
    }
  `]
})
export class ProviderDashboardPage {
  private servicioAutenticacion = inject(ServicioAutenticacion);
  private servicioAccesoDatosCitas = inject(ServicioAccesoDatosCitas);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  provider$: Observable<Proveedor | null> = this.route.data.pipe(
    map(data => data['perfilProveedor'] as Proveedor | null)
  );

  upcomingAppointments$: Observable<Cita[]> = this.servicioAutenticacion.usuarioActual$.pipe(
    switchMap(usuario => {
      if (!usuario) {
        return of([] as Cita[]);
      }
      return this.servicioAccesoDatosCitas.obtenerCitasDeProveedor(usuario.uid);
    })
  );
  defaultImage = 'https://images.unsplash.com/photo-1558944351-dae1be1f4436?w=100&h=100&fit=crop';

  constructor() {
    addIcons({ calendarOutline, locationOutline, callOutline, chatbubbleOutline, pencilOutline });
  }

  refreshData(event: CustomEvent) {
    const refresher = event.target as HTMLIonRefresherElement | null;
    setTimeout(() => refresher?.complete(), 800);
  }

  goToAppointments() {
    this.router.navigate(['/tabs/citas']);
  }

  editProfile() {
    this.router.navigate(['/perfil']);
  }

  contactClient(_appointment: Cita) {
    // Placeholder for communication integration
    console.log('Contact client');
  }

  messageClient(_appointment: Cita) {
    console.log('Message client');
  }
}
