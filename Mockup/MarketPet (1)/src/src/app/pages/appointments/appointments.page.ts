import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent,
  IonButton, IonIcon, IonBadge, IonChip, IonLabel, IonGrid, IonRow, IonCol,
  IonAvatar, IonRefresher, IonRefresherContent, IonFab, IonFabButton
} from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { Appointment } from '../../models/user.model';
import { addIcons } from 'ionicons';
import { 
  addOutline, calendarOutline, callOutline, chatbubbleOutline,
  timeOutline, locationOutline, checkmarkCircleOutline, 
  alertCircleOutline, closeCircleOutline
} from 'ionicons/icons';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-appointments',
  template: `
    <ion-content>
      <!-- Header -->
      <ion-header class="marketpet-header">
        <ion-toolbar>
          <ion-title>Mis Citas</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-refresher slot="fixed" (ionRefresh)="refreshData($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <div class="content-container">
        <!-- Stats Cards -->
        <ion-grid class="stats-grid">
          <ion-row>
            <ion-col size="6">
              <ion-card class="stat-card">
                <ion-card-content>
                  <div class="stat-content">
                    <div class="stat-number primary">{{ upcomingCount }}</div>
                    <div class="stat-label">Próximas Citas</div>
                  </div>
                </ion-card-content>
              </ion-card>
            </ion-col>
            <ion-col size="6">
              <ion-card class="stat-card">
                <ion-card-content>
                  <div class="stat-content">
                    <div class="stat-number success">{{ completedCount }}</div>
                    <div class="stat-label">Completadas</div>
                  </div>
                </ion-card-content>
              </ion-card>
            </ion-col>
          </ion-row>
        </ion-grid>

        <!-- Quick Book Section -->
        <ion-card class="quick-book-card">
          <ion-card-content>
            <div class="quick-book-content">
              <div class="quick-book-info">
                <h3>Agendar Nueva Cita</h3>
                <p>Encuentra el mejor cuidado para tu mascota</p>
              </div>
              <ion-button (click)="bookNewAppointment()" class="book-btn">
                <ion-icon name="add-outline" slot="start"></ion-icon>
                Agendar
              </ion-button>
            </div>
          </ion-card-content>
        </ion-card>

        <!-- Appointments List -->
        <div class="appointments-section">
          <h3>Próximas Citas</h3>
          
          <div class="appointments-list">
            <ion-card 
              *ngFor="let appointment of appointments$ | async" 
              class="appointment-card marketpet-card"
              [class.confirmed]="appointment.status === 'confirmed'"
              [class.pending]="appointment.status === 'pending'"
              [class.completed]="appointment.status === 'completed'">
              <ion-card-content>
                <div class="appointment-header">
                  <div class="appointment-pet">
                    <ion-avatar class="pet-avatar">
                      <img src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=60&h=60&fit=crop" [alt]="appointment.petName">
                    </ion-avatar>
                    <div class="pet-info">
                      <h4>{{ appointment.petName }}</h4>
                      <p>{{ appointment.service }}</p>
                    </div>
                  </div>
                  <ion-chip 
                    [color]="getStatusColor(appointment.status)"
                    class="status-chip">
                    <ion-icon [name]="getStatusIcon(appointment.status)"></ion-icon>
                    <ion-label>{{ getStatusText(appointment.status) }}</ion-label>
                  </ion-chip>
                </div>

                <div class="appointment-details">
                  <div class="provider-info">
                    <ion-avatar class="provider-avatar">
                      <img [src]="appointment.providerImage || getDefaultProviderImage()" [alt]="appointment.providerName">
                    </ion-avatar>
                    <div class="provider-details">
                      <h4>{{ appointment.providerName }}</h4>
                      <div class="appointment-datetime">
                        <ion-icon name="calendar-outline"></ion-icon>
                        <span>{{ appointment.date }}</span>
                      </div>
                      <div class="appointment-time">
                        <ion-icon name="time-outline"></ion-icon>
                        <span>{{ appointment.time }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="appointment-location">
                    <ion-icon name="location-outline"></ion-icon>
                    <span>{{ appointment.location }}</span>
                  </div>

                  <div class="appointment-price">
                    <strong>{{ appointment.price }}</strong>
                  </div>
                </div>

                <div class="appointment-actions" *ngIf="appointment.status !== 'completed'">
                  <ion-button 
                    size="small" 
                    fill="outline"
                    (click)="callProvider(appointment)">
                    <ion-icon name="call-outline" slot="start"></ion-icon>
                    Llamar
                  </ion-button>
                  <ion-button 
                    size="small" 
                    fill="outline"
                    (click)="messageProvider(appointment)">
                    <ion-icon name="chatbubble-outline" slot="start"></ion-icon>
                    Mensaje
                  </ion-button>
                  <ion-button 
                    size="small" 
                    color="warning"
                    (click)="rescheduleAppointment(appointment)">
                    Reprogramar
                  </ion-button>
                </div>
              </ion-card-content>
            </ion-card>

            <!-- Empty state -->
            <div *ngIf="(appointments$ | async)?.length === 0" class="empty-state">
              <div class="empty-icon">📅</div>
              <h3>No tienes citas programadas</h3>
              <p>Agenda tu primera cita para empezar a cuidar a tu mascota</p>
              <ion-button (click)="bookNewAppointment()" class="empty-action-btn">
                <ion-icon name="add-outline" slot="start"></ion-icon>
                Agendar Primera Cita
              </ion-button>
            </div>
          </div>
        </div>
      </div>

      <!-- Floating Action Button -->
      <ion-fab slot="fixed" vertical="bottom" horizontal="end" class="marketpet-floating-button">
        <ion-fab-button color="primary" (click)="bookNewAppointment()">
          <ion-icon name="add-outline"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  `,
  styles: [`
    .content-container {
      padding: 1rem;
    }

    .stats-grid {
      margin-bottom: 1rem;
      padding: 0;
    }

    .stat-card {
      margin: 0;
    }

    .stat-content {
      text-align: center;
      padding: 0.5rem 0;
    }

    .stat-number {
      font-size: 1.8rem;
      font-weight: 700;
      margin-bottom: 0.25rem;
    }

    .stat-number.primary { color: var(--ion-color-primary); }
    .stat-number.success { color: var(--ion-color-success); }

    .stat-label {
      font-size: 0.8rem;
      color: var(--ion-color-medium);
    }

    .quick-book-card {
      margin-bottom: 1.5rem;
    }

    .quick-book-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .quick-book-info h3 {
      margin: 0 0 0.25rem 0;
      font-weight: 600;
    }

    .quick-book-info p {
      margin: 0;
      color: var(--ion-color-medium);
      font-size: 0.9rem;
    }

    .book-btn {
      --border-radius: 12px;
    }

    .appointments-section h3 {
      margin-bottom: 1rem;
      font-weight: 600;
    }

    .appointments-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .appointment-card {
      border-left: 4px solid var(--ion-color-medium);
    }

    .appointment-card.confirmed {
      border-left-color: var(--ion-color-success);
    }

    .appointment-card.pending {
      border-left-color: var(--ion-color-warning);
    }

    .appointment-card.completed {
      border-left-color: var(--ion-color-primary);
      opacity: 0.8;
    }

    .appointment-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .appointment-pet {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }

    .pet-avatar {
      width: 40px;
      height: 40px;
    }

    .pet-info h4 {
      margin: 0;
      font-weight: 600;
      color: var(--ion-color-dark);
    }

    .pet-info p {
      margin: 0;
      font-size: 0.9rem;
      color: var(--ion-color-medium);
    }

    .status-chip {
      height: 28px;
    }

    .appointment-details {
      margin-bottom: 1rem;
    }

    .provider-info {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
    }

    .provider-avatar {
      width: 48px;
      height: 48px;
    }

    .provider-details h4 {
      margin: 0 0 0.5rem 0;
      font-weight: 600;
      color: var(--ion-color-dark);
    }

    .appointment-datetime, .appointment-time {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      color: var(--ion-color-medium);
      margin-bottom: 0.25rem;
    }

    .appointment-location {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      color: var(--ion-color-medium);
      margin-bottom: 0.5rem;
    }

    .appointment-price {
      font-size: 1.1rem;
      color: var(--ion-color-success);
      text-align: right;
    }

    .appointment-actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .appointment-actions ion-button {
      --border-radius: 8px;
      flex: 1;
      min-width: 80px;
    }

    .empty-state {
      text-align: center;
      padding: 3rem 1rem;
      color: var(--ion-color-medium);
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      font-weight: 600;
      color: var(--ion-color-dark);
      margin-bottom: 0.5rem;
    }

    .empty-state p {
      margin-bottom: 2rem;
      max-width: 280px;
      margin-left: auto;
      margin-right: auto;
    }

    .empty-action-btn {
      --border-radius: 12px;
    }
  `],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent,
    IonButton, IonIcon, IonBadge, IonChip, IonLabel, IonGrid, IonRow, IonCol,
    IonAvatar, IonRefresher, IonRefresherContent, IonFab, IonFabButton
  ]
})
export class AppointmentsPage implements OnInit {
  private authService = inject(AuthService);
  private dataService = inject(DataService);
  private router = inject(Router);

  appointments$!: Observable<Appointment[]>;
  upcomingCount = 2;
  completedCount = 8;

  constructor() {
    addIcons({ 
      addOutline, calendarOutline, callOutline, chatbubbleOutline,
      timeOutline, locationOutline, checkmarkCircleOutline,
      alertCircleOutline, closeCircleOutline
    });
  }

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.appointments$ = this.dataService.getUserAppointments(user.uid);
      }
    });
  }

  refreshData(event: any) {
    this.loadAppointments();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  bookNewAppointment() {
    this.router.navigate(['/tabs/providers']);
  }

  callProvider(appointment: Appointment) {
    console.log('Call provider:', appointment.providerName);
  }

  messageProvider(appointment: Appointment) {
    console.log('Message provider:', appointment.providerName);
  }

  rescheduleAppointment(appointment: Appointment) {
    console.log('Reschedule appointment:', appointment.id);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'completed': return 'primary';
      case 'cancelled': return 'danger';
      default: return 'medium';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'confirmed': return 'checkmark-circle-outline';
      case 'pending': return 'alert-circle-outline';
      case 'completed': return 'checkmark-circle-outline';
      case 'cancelled': return 'close-circle-outline';
      default: return 'alert-circle-outline';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'confirmed': return 'Confirmada';
      case 'pending': return 'Pendiente';
      case 'completed': return 'Completada';
      case 'cancelled': return 'Cancelada';
      default: return 'Desconocido';
    }
  }

  getDefaultProviderImage(): string {
    return 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=60&h=60&fit=crop&crop=face';
  }
}