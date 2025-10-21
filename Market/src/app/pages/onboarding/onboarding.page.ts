import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent, IonButton, IonIcon, IonCard, IonCardContent,
  IonCheckbox
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  pawOutline, heartOutline, starOutline, shieldCheckmarkOutline,
  notificationsOutline, locationOutline, chevronForwardOutline
} from 'ionicons/icons';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-onboarding',
  template: `
    <ion-content class="onboarding-content">
      <div class="onboarding-container">
        <!-- Step 1: Welcome -->
        <div *ngIf="currentStep === 0" class="onboarding-step fade-in">
          <div class="step-content">
            <div class="welcome-icon">🎉</div>
            <h1>¡Bienvenido a MarketPet!</h1>
            <p>Conecta con los mejores servicios para tu mascota en segundos</p>
            
            <div class="features-list">
              <div class="feature-item">
                <ion-icon name="paw-outline" color="primary"></ion-icon>
                <span>Perfiles detallados para tus mascotas</span>
              </div>
              <div class="feature-item">
                <ion-icon name="heart-outline" color="primary"></ion-icon>
                <span>Servicios verificados y confiables</span>
              </div>
              <div class="feature-item">
                <ion-icon name="star-outline" color="primary"></ion-icon>
                <span>Reservas instantáneas</span>
              </div>
            </div>
          </div>
          
          <div class="step-actions">
            <ion-button expand="block" (click)="nextStep()" class="primary-btn">
              Comenzar
              <ion-icon name="chevron-forward-outline" slot="end"></ion-icon>
            </ion-button>
          </div>
        </div>

        <!-- Step 2: Permissions -->
        <div *ngIf="currentStep === 1" class="onboarding-step fade-in">
          <div class="step-content">
            <div class="permission-icon">🔔</div>
            <h2>Mantente Informado</h2>
            <p>Recibe notificaciones importantes sobre tus citas y recordatorios de salud</p>
            
            <ion-card class="permission-card">
              <ion-card-content>
                <div class="permission-item">
                  <ion-checkbox
                    [(ngModel)]="permissions.notifications"
                    color="primary"
                    (ionChange)="handlePermissionToggle()">
                  </ion-checkbox>
                  <div class="permission-info">
                    <ion-icon name="notifications-outline" color="primary"></ion-icon>
                    <div>
                      <h4>Notificaciones Push</h4>
                      <p>Recordatorios de citas y alertas importantes</p>
                    </div>
                  </div>
                </div>
                
                <div class="permission-item">
                  <ion-checkbox
                    [(ngModel)]="permissions.location"
                    color="primary"
                    (ionChange)="handlePermissionToggle()">
                  </ion-checkbox>
                  <div class="permission-info">
                    <ion-icon name="location-outline" color="primary"></ion-icon>
                    <div>
                      <h4>Ubicación</h4>
                      <p>Encuentra servicios cerca de ti</p>
                    </div>
                  </div>
                </div>
              </ion-card-content>
            </ion-card>
          </div>
          
          <div class="step-actions">
            <ion-button expand="block" (click)="nextStep()" class="primary-btn">
              Continuar
              <ion-icon name="chevron-forward-outline" slot="end"></ion-icon>
            </ion-button>
            <ion-button expand="block" fill="clear" (click)="nextStep()">
              Saltar
            </ion-button>
          </div>
        </div>

        <!-- Step 3: Ready -->
        <div *ngIf="currentStep === 2" class="onboarding-step fade-in">
          <div class="step-content">
            <div class="ready-icon">✨</div>
            <h2>¡Todo Listo!</h2>
            <p>Ya puedes empezar a explorar y agendar servicios para tu mascota</p>
            
            <div class="next-steps">
              <div class="next-step-item">
                <div class="step-number">1</div>
                <span>Agrega el perfil de tu mascota</span>
              </div>
              <div class="next-step-item">
                <div class="step-number">2</div>
                <span>Explora servicios disponibles</span>
              </div>
              <div class="next-step-item">
                <div class="step-number">3</div>
                <span>Agenda tu primera cita</span>
              </div>
            </div>
          </div>
          
          <div class="step-actions">
            <ion-button expand="block" (click)="completeOnboarding()" class="primary-btn">
              Empezar a Usar MarketPet
              <ion-icon name="chevron-forward-outline" slot="end"></ion-icon>
            </ion-button>
          </div>
        </div>

        <!-- Progress Indicators -->
        <div class="progress-indicators">
          <div 
            *ngFor="let step of steps; let i = index"
            class="progress-dot"
            [class.active]="i === currentStep"
            [class.completed]="i < currentStep">
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    .onboarding-content {
      --background: linear-gradient(135deg, var(--ion-color-primary) 0%, #1a1a2e 100%);
    }

    .onboarding-container {
      min-height: 100vh;
      padding: 2rem 1.5rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      color: white;
    }

    .onboarding-step {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .step-content {
      text-align: center;
      margin-bottom: 3rem;
    }

    .welcome-icon, .permission-icon, .ready-icon {
      font-size: 4rem;
      margin-bottom: 1.5rem;
    }

    .step-content h1, .step-content h2 {
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 1rem 0;
    }

    .step-content p {
      font-size: 1.1rem;
      opacity: 0.9;
      line-height: 1.6;
      margin: 0 0 2rem 0;
      max-width: 320px;
      margin-left: auto;
      margin-right: auto;
    }

    .features-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-width: 300px;
      margin: 0 auto;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      text-align: left;
    }

    .feature-item ion-icon {
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .permission-card {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      backdrop-filter: blur(10px);
      margin: 2rem 0;
    }

    .permission-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .permission-item:last-child {
      margin-bottom: 0;
    }

    .permission-info {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      flex: 1;
    }

    .permission-info ion-icon {
      font-size: 1.5rem;
      margin-top: 0.25rem;
      flex-shrink: 0;
    }

    .permission-info h4 {
      font-weight: 600;
      margin: 0 0 0.25rem 0;
      color: white;
    }

    .permission-info p {
      font-size: 0.9rem;
      opacity: 0.8;
      margin: 0;
      line-height: 1.4;
    }

    .next-steps {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-width: 280px;
      margin: 0 auto;
    }

    .next-step-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      text-align: left;
    }

    .step-number {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      flex-shrink: 0;
    }

    .step-actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .primary-btn {
      --background: white;
      --color: var(--ion-color-primary);
      --border-radius: 12px;
      height: 52px;
      font-weight: 600;
    }

    .progress-indicators {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 2rem;
    }

    .progress-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transition: all 0.3s ease;
    }

    .progress-dot.active {
      background: white;
      transform: scale(1.2);
    }

    .progress-dot.completed {
      background: rgba(255, 255, 255, 0.6);
    }

    .fade-in {
      animation: fadeIn 0.5s ease-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    IonContent, IonButton, IonIcon, IonCard, IonCardContent,
    IonCheckbox, FormsModule
  ]
})
export class OnboardingPage implements OnInit {
  private router = inject(Router);

  currentStep = 0;
  steps = [0, 1, 2];

  permissions = {
    notifications: false,
    location: false
  };

  constructor() {
    addIcons({
      pawOutline, heartOutline, starOutline, shieldCheckmarkOutline,
      notificationsOutline, locationOutline, chevronForwardOutline
    });
  }

  ngOnInit(): void {
    this.restoreSavedPermissions();
    this.restoreProgress();
  }

  ionViewWillEnter(): void {
    const onboardingCompleted = localStorage.getItem('onboarding_completed') === 'true';
    if (onboardingCompleted) {
      this.router.navigate(['/tabs/pets'], { replaceUrl: true });
    }
  }

  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.persistCurrentStep();
    }
  }

  completeOnboarding() {
    // Save onboarding completion status
    localStorage.setItem('onboarding_completed', 'true');

    this.persistPermissions();
    this.persistCurrentStep(2);

    // Request permissions if user accepted them
    if (this.permissions.notifications) {
      this.requestNotificationPermission();
    }
    
    if (this.permissions.location) {
      this.requestLocationPermission();
    }

    // Navigate to main app
    this.router.navigate(['/tabs/pets'], { replaceUrl: true });
  }

  handlePermissionToggle(): void {
    this.persistPermissions();
  }

  private restoreProgress(): void {
    const storedStep = localStorage.getItem('onboarding_current_step');
    if (storedStep === null) {
      return;
    }

    const parsedStep = Number.parseInt(storedStep, 10);
    if (Number.isNaN(parsedStep)) {
      localStorage.removeItem('onboarding_current_step');
      return;
    }

    this.currentStep = this.steps.includes(parsedStep) ? parsedStep : 0;
  }

  private persistCurrentStep(step: number = this.currentStep): void {
    localStorage.setItem('onboarding_current_step', String(step));
  }

  private async requestNotificationPermission() {
    if ('Notification' in window) {
      await Notification.requestPermission();
    }
  }

  private async requestLocationPermission() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Location permission granted');
        },
        (error) => {
          console.log('Location permission denied');
        }
      );
    }
  }

  private restoreSavedPermissions(): void {
    const stored = localStorage.getItem('onboarding_permissions');
    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(stored) as Partial<typeof this.permissions>;
      this.permissions = {
        notifications: parsed.notifications ?? this.permissions.notifications,
        location: parsed.location ?? this.permissions.location,
      };
    } catch {
      localStorage.removeItem('onboarding_permissions');
    }
  }

  private persistPermissions(): void {
    localStorage.setItem('onboarding_permissions', JSON.stringify(this.permissions));
  }
}
