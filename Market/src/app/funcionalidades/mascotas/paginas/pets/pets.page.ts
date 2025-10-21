import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonAvatar,
  IonBadge,
  IonGrid,
  IonRow,
  IonCol,
  IonChip,
  IonSkeletonText,
  IonRefresher,
  IonRefresherContent,
  IonModal,
  IonButtons,
  IonList
} from '@ionic/angular/standalone';
import { ServicioAutenticacion } from '@nucleo/firebase';
import { ServicioAccesoDatosMascotas } from '@funcionalidades/mascotas/servicios';
import { Mascota } from '@compartido/modelos';
import { addIcons } from 'ionicons';
import { 
  addOutline, 
  sparklesOutline, 
  searchOutline, 
  calendarOutline, 
  locationOutline,
  notificationsOutline,
  settingsOutline,
  logOutOutline,
  chevronForwardOutline,
  heartOutline,
  medicalOutline,
  cutOutline,
  walkOutline
} from 'ionicons/icons';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pets',
  template: `
    <ion-content>
      <!-- Header with user profile -->
      <div class="user-header safe-area-top">
        <div class="user-info">
          <ion-avatar class="user-avatar">
            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" alt="Usuario">
          </ion-avatar>
          <div class="user-details">
            <h2>¡Hola {{ (currentUser$ | async)?.name }}! 👋</h2>
            <p>{{ (currentUser$ | async)?.location }}</p>
          </div>
        </div>
        <div class="header-actions">
          <ion-button fill="clear" size="small" (click)="openNotifications()">
            <ion-icon name="notifications-outline" slot="icon-only"></ion-icon>
            <ion-badge color="danger" class="notification-badge">2</ion-badge>
          </ion-button>
          <ion-button fill="clear" size="small" (click)="openProfile()">
            <ion-icon name="settings-outline" slot="icon-only"></ion-icon>
          </ion-button>
        </div>
      </div>

      <ion-refresher slot="fixed" (ionRefresh)="refreshData($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <div class="content-container">
        <!-- Welcome Card -->
        <ion-card class="welcome-card marketpet-card">
          <ion-card-content>
            <div class="welcome-content">
              <div class="welcome-text">
                <h3>Cuida a tus mascotas</h3>
                <p>Con los mejores servicios profesionales</p>
              </div>
              <ion-icon name="sparkles-outline" class="welcome-icon"></ion-icon>
            </div>
          </ion-card-content>
        </ion-card>

        <!-- Quick Actions -->
        <div class="quick-actions">
          <ion-grid>
            <ion-row>
              <ion-col size="3">
                <div class="action-item" (click)="addPet()">
                  <div class="action-icon add-pet">
                    <ion-icon name="add-outline"></ion-icon>
                  </div>
                  <span>Agregar Mascota</span>
                </div>
              </ion-col>
              <ion-col size="3">
                <div class="action-item" (click)="searchServices()">
                  <div class="action-icon search-services">
                    <ion-icon name="search-outline"></ion-icon>
                  </div>
                  <span>Buscar Servicios</span>
                </div>
              </ion-col>
              <ion-col size="3">
                <div class="action-item" (click)="bookAppointment()">
                  <div class="action-icon book-appointment">
                    <ion-icon name="calendar-outline"></ion-icon>
                  </div>
                  <span>Agendar Cita</span>
                </div>
              </ion-col>
              <ion-col size="3">
                <div class="action-item" (click)="findNearby()">
                  <div class="action-icon find-nearby">
                    <ion-icon name="location-outline"></ion-icon>
                  </div>
                  <span>Cerca de Ti</span>
                </div>
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>

        <!-- Pets Section -->
        <div class="pets-section">
          <div class="section-header">
            <h3>Mis Mascotas</h3>
            <ion-button size="small" fill="clear" (click)="addPet()">
              <ion-icon name="add-outline" slot="start"></ion-icon>
              Agregar
            </ion-button>
          </div>

          <!-- Loading state -->
          <div *ngIf="isLoading" class="pets-loading">
            <ion-card class="pet-card-skeleton" *ngFor="let item of [1,2,3]">
              <ion-card-content>
                <div class="skeleton-content">
                  <ion-skeleton-text animated style="width: 60px; height: 60px; border-radius: 50%;"></ion-skeleton-text>
                  <div class="skeleton-text">
                    <ion-skeleton-text animated style="width: 60%; height: 20px;"></ion-skeleton-text>
                    <ion-skeleton-text animated style="width: 80%; height: 16px;"></ion-skeleton-text>
                    <ion-skeleton-text animated style="width: 40%; height: 16px;"></ion-skeleton-text>
                  </div>
                </div>
              </ion-card-content>
            </ion-card>
          </div>

          <!-- Pets list -->
          <div *ngIf="!isLoading" class="pets-list">
            <ion-card 
              *ngFor="let pet of pets$ | async" 
              class="pet-card marketpet-card"
              (click)="editPet(pet)">
              <ion-card-content>
                <div class="pet-content">
                  <ion-avatar class="pet-avatar">
                    <img [src]="pet.imageUrl || getDefaultPetImage(pet.species)" [alt]="pet.name">
                  </ion-avatar>
                  <div class="pet-info">
                    <h4 class="pet-name">{{ pet.name }}</h4>
                    <p class="pet-details">{{ pet.breed }} • {{ pet.age }}</p>
                    <p class="pet-weight">{{ pet.weight }}</p>
                    <div class="pet-badges">
                      <ion-chip 
                        *ngFor="let vaccination of pet.vaccinations.slice(0, 3)" 
                        class="vaccination-chip">
                        <ion-icon name="medical-outline"></ion-icon>
                        <ion-label>{{ vaccination }}</ion-label>
                      </ion-chip>
                      <ion-chip 
                        *ngIf="pet.vaccinations.length > 3"
                        class="more-chip">
                        +{{ pet.vaccinations.length - 3 }}
                      </ion-chip>
                    </div>
                  </div>
                  <div class="pet-actions">
                    <ion-button 
                      size="small" 
                      fill="clear"
                      (click)="$event.stopPropagation(); bookAppointmentForPet(pet)">
                      <ion-icon name="calendar-outline" slot="icon-only"></ion-icon>
                    </ion-button>
                    <ion-button 
                      size="small" 
                      fill="clear"
                      (click)="$event.stopPropagation(); viewPetProfile(pet)">
                      <ion-icon name="chevron-forward-outline" slot="icon-only"></ion-icon>
                    </ion-button>
                  </div>
                </div>
              </ion-card-content>
            </ion-card>

            <!-- Empty state -->
            <div *ngIf="(pets$ | async)?.length === 0" class="empty-state">
              <div class="empty-icon">🐾</div>
              <h3>¡Agrega tu primera mascota!</h3>
              <p>Crea un perfil para tu mascota y accede a todos nuestros servicios</p>
              <ion-button (click)="addPet()" class="empty-action-btn">
                <ion-icon name="add-outline" slot="start"></ion-icon>
                Agregar Mascota
              </ion-button>
            </div>
          </div>
        </div>
      </div>

      <!-- Profile Modal -->
      <ion-modal [isOpen]="showProfileModal" (willDismiss)="closeProfile()">
        <ng-template>
          <ion-header>
            <ion-toolbar>
              <ion-title>Mi Perfil</ion-title>
              <ion-buttons slot="end">
                <ion-button (click)="closeProfile()">Cerrar</ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>
          <ion-content class="ion-padding">
            <div class="profile-content">
              <div class="profile-header">
                <ion-avatar class="profile-avatar">
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" alt="Usuario">
                </ion-avatar>
                <h2>{{ (currentUser$ | async)?.name }}</h2>
                <p>{{ (currentUser$ | async)?.email }}</p>
                <ion-chip color="primary">
                  <ion-label>Plan {{ (currentUser$ | async)?.planType }}</ion-label>
                </ion-chip>
              </div>

              <ion-list class="profile-menu">
                <ion-item button>
                  <ion-icon name="person-outline" slot="start"></ion-icon>
                  <ion-label>Editar Perfil</ion-label>
                  <ion-icon name="chevron-forward-outline" slot="end"></ion-icon>
                </ion-item>
                <ion-item button>
                  <ion-icon name="notifications-outline" slot="start"></ion-icon>
                  <ion-label>Notificaciones</ion-label>
                  <ion-icon name="chevron-forward-outline" slot="end"></ion-icon>
                </ion-item>
                <ion-item button>
                  <ion-icon name="help-circle-outline" slot="start"></ion-icon>
                  <ion-label>Ayuda y Soporte</ion-label>
                  <ion-icon name="chevron-forward-outline" slot="end"></ion-icon>
                </ion-item>
                <ion-item button (click)="logout()">
                  <ion-icon name="log-out-outline" slot="start" color="danger"></ion-icon>
                  <ion-label color="danger">Cerrar Sesión</ion-label>
                </ion-item>
              </ion-list>
            </div>
          </ion-content>
        </ng-template>
      </ion-modal>
    </ion-content>
  `,
  styles: [`
    .user-header {
      background: var(--marketpet-gradient-primary);
      color: white;
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-avatar {
      width: 48px;
      height: 48px;
    }

    .user-details h2 {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0;
    }

    .user-details p {
      font-size: 0.9rem;
      opacity: 0.8;
      margin: 0;
    }

    .header-actions {
      display: flex;
      gap: 0.5rem;
      position: relative;
    }

    .notification-badge {
      position: absolute;
      top: -2px;
      right: -2px;
      transform: scale(0.8);
    }

    .content-container {
      padding: 1rem;
    }

    .welcome-card {
      background: var(--marketpet-gradient-primary);
      color: white;
      margin-bottom: 1.5rem;
    }

    .welcome-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .welcome-text h3 {
      font-size: 1.3rem;
      font-weight: 600;
      margin: 0 0 0.25rem 0;
    }

    .welcome-text p {
      opacity: 0.9;
      margin: 0;
    }

    .welcome-icon {
      font-size: 2rem;
      opacity: 0.8;
    }

    .quick-actions {
      margin-bottom: 2rem;
    }

    .action-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      transition: transform 0.2s ease;
    }

    .action-item:active {
      transform: scale(0.95);
    }

    .action-icon {
      width: 56px;
      height: 56px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.5rem;
    }

    .add-pet { background: var(--ion-color-primary); }
    .search-services { background: var(--ion-color-secondary); }
    .book-appointment { background: var(--ion-color-success); }
    .find-nearby { background: var(--ion-color-warning); }

    .action-item span {
      font-size: 0.75rem;
      text-align: center;
      color: var(--ion-color-dark);
      font-weight: 500;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .section-header h3 {
      margin: 0;
      font-weight: 600;
    }

    .pets-loading, .pets-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .pet-card-skeleton .skeleton-content {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .skeleton-text {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .pet-card {
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .pet-card:active {
      transform: scale(0.98);
    }

    .pet-content {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .pet-avatar {
      width: 60px;
      height: 60px;
      flex-shrink: 0;
    }

    .pet-info {
      flex: 1;
    }

    .pet-name {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0 0 0.25rem 0;
      color: var(--ion-color-dark);
    }

    .pet-details, .pet-weight {
      font-size: 0.9rem;
      color: var(--ion-color-medium);
      margin: 0;
    }

    .pet-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
      margin-top: 0.5rem;
    }

    .vaccination-chip {
      height: 24px;
      font-size: 0.75rem;
      --background: var(--ion-color-primary-tint);
      --color: var(--ion-color-primary);
    }

    .more-chip {
      height: 24px;
      font-size: 0.75rem;
      --background: var(--ion-color-medium-tint);
      --color: var(--ion-color-medium);
    }

    .pet-actions {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
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

    .profile-content {
      padding: 1rem 0;
    }

    .profile-header {
      text-align: center;
      padding: 2rem 0;
    }

    .profile-avatar {
      width: 80px;
      height: 80px;
      margin: 0 auto 1rem auto;
    }

    .profile-header h2 {
      margin: 0 0 0.5rem 0;
      font-weight: 600;
    }

    .profile-header p {
      color: var(--ion-color-medium);
      margin: 0 0 1rem 0;
    }

    .profile-menu {
      margin-top: 1rem;
    }

    .profile-menu ion-item {
      --padding-start: 0;
      --padding-end: 0;
      margin: 0.5rem 0;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent,
    IonButton, IonIcon, IonItem, IonLabel, IonAvatar, IonBadge,
    IonGrid, IonRow, IonCol, IonChip, IonSkeletonText,
    IonRefresher, IonRefresherContent, IonModal, IonButtons, IonList
  ]
})
export class PetsPage implements OnInit {
  private servicioAutenticacion = inject(ServicioAutenticacion);
  private servicioAccesoDatosMascotas = inject(ServicioAccesoDatosMascotas);
  private router = inject(Router);

  currentUser$ = this.servicioAutenticacion.usuarioActual$;
  pets$!: Observable<Mascota[]>;
  isLoading = true;
  showProfileModal = false;

  constructor() {
    addIcons({ 
      addOutline, sparklesOutline, searchOutline, calendarOutline, 
      locationOutline, notificationsOutline, settingsOutline, logOutOutline,
      chevronForwardOutline, heartOutline, medicalOutline, cutOutline, walkOutline
    });
  }

  ngOnInit() {
    this.loadUserPets();
  }

  loadUserPets() {
    this.currentUser$.subscribe(user => {
      if (user) {
        this.pets$ = this.servicioAccesoDatosMascotas.obtenerMascotas(user.uid);
        this.pets$.subscribe(() => {
          this.isLoading = false;
        });
      }
    });
  }

  refreshData(event: any) {
    this.loadUserPets();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  addPet() {
    this.router.navigate(['/mascotas/formulario']);
  }

  editPet(pet: Mascota) {
    this.router.navigate(['/mascotas/formulario'], { state: { pet } });
  }

  searchServices() {
    this.router.navigate(['/tabs/proveedores']);
  }

  bookAppointment() {
    this.router.navigate(['/tabs/citas']);
  }

  bookAppointmentForPet(pet: Mascota) {
    this.router.navigate(['/citas/formulario'], { state: { pet } });
  }

  findNearby() {
    // Navigate to providers with location filter
    this.router.navigate(['/tabs/proveedores'], { queryParams: { nearby: true } });
  }

  viewPetProfile(pet: Mascota) {
    // Navigate to detailed pet profile
    this.router.navigate(['/mascotas/formulario'], { state: { pet, viewOnly: true } });
  }

  openNotifications() {
    // Open notifications modal or navigate to notifications page
    console.log('Open notifications');
  }

  openProfile() {
    this.showProfileModal = true;
  }

  closeProfile() {
    this.showProfileModal = false;
  }

  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/autenticacion'], { replaceUrl: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  getDefaultPetImage(species: string): string {
    const imageMap: { [key: string]: string } = {
      'Perro': 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=100&h=100&fit=crop',
      'Gato': 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=100&h=100&fit=crop',
      'Ave': 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=100&h=100&fit=crop',
      'Conejo': 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=100&h=100&fit=crop'
    };
    return imageMap[species] || 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=100&h=100&fit=crop';
  }
}