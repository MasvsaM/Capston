import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardContent,
  IonAvatar,
  IonLabel,
  IonList,
  IonItem,
  IonInput,
  IonTextarea,
  IonButton,
  IonBadge,
  IonIcon,
  IonToast
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { callOutline, locationOutline, personCircleOutline, saveOutline, logOutOutline } from 'ionicons/icons';
import { AuthService } from '@nucleo/servicios/auth.service';
import { User } from '@compartido/modelos/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonCard,
    IonCardContent,
    IonAvatar,
    IonLabel,
    IonList,
    IonItem,
    IonInput,
    IonTextarea,
    IonButton,
    IonBadge,
    IonIcon,
    IonToast
  ],
  template: `
    <ion-content class="profile-content">
      <ion-header class="marketpet-header" collapse="condense">
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button defaultHref="/tabs/pets"></ion-back-button>
          </ion-buttons>
          <ion-title>Mi perfil</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="profile-wrapper ion-padding">
        <ion-card class="profile-card marketpet-card" *ngIf="currentUser">
          <ion-card-content>
            <div class="profile-header">
              <ion-avatar class="profile-avatar">
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" alt="Usuario">
              </ion-avatar>
              <div>
                <h2>{{ currentUser.name }}</h2>
                <p>{{ currentUser.email }}</p>
                <ion-badge color="primary">{{ currentUser.planType || 'Básico' }}</ion-badge>
              </div>
            </div>

            <form [formGroup]="profileForm" (ngSubmit)="saveProfile()">
              <ion-list lines="none">
                <ion-item class="form-item">
                  <ion-icon name="person-circle-outline" slot="start"></ion-icon>
                  <ion-label position="stacked">Nombre</ion-label>
                  <ion-input type="text" formControlName="name"></ion-input>
                </ion-item>

                <ion-item class="form-item">
                  <ion-icon name="call-outline" slot="start"></ion-icon>
                  <ion-label position="stacked">Teléfono</ion-label>
                  <ion-input type="tel" formControlName="phone"></ion-input>
                </ion-item>

                <ion-item class="form-item">
                  <ion-icon name="location-outline" slot="start"></ion-icon>
                  <ion-label position="stacked">Ubicación</ion-label>
                  <ion-input type="text" formControlName="location"></ion-input>
                </ion-item>

                <ng-container *ngIf="currentUser.userType === 'provider'">
                  <ion-item class="form-item">
                    <ion-label position="stacked">Nombre del negocio</ion-label>
                    <ion-input type="text" formControlName="businessName"></ion-input>
                  </ion-item>

                  <ion-item class="form-item">
                    <ion-label position="stacked">Servicios ofrecidos</ion-label>
                    <ion-textarea formControlName="services" placeholder="Servicios separados por coma"></ion-textarea>
                  </ion-item>
                </ng-container>
              </ion-list>

              <ion-button
                expand="block"
                type="submit"
                class="save-button"
                [disabled]="profileForm.invalid || isSaving">
                <ion-icon name="save-outline" slot="start"></ion-icon>
                Guardar cambios
              </ion-button>
            </form>

            <ion-button expand="block" fill="outline" color="medium" (click)="logout()">
              <ion-icon name="log-out-outline" slot="start"></ion-icon>
              Cerrar sesión
            </ion-button>
          </ion-card-content>
        </ion-card>
      </div>

      <ion-toast
        [isOpen]="toastOpen"
        [message]="toastMessage"
        [color]="toastColor"
        duration="2500"
        position="top"
        (didDismiss)="toastOpen = false">
      </ion-toast>
    </ion-content>
  `,
  styles: [`
    .profile-content {
      --background: var(--ion-color-light);
    }

    .profile-wrapper {
      max-width: 640px;
      margin: 0 auto;
    }

    .profile-card {
      margin-top: 2rem;
      border-radius: 24px;
      box-shadow: var(--marketpet-shadow);
    }

    .profile-header {
      display: flex;
      gap: 1rem;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .profile-avatar {
      width: 72px;
      height: 72px;
    }

    .profile-header h2 {
      margin: 0;
      font-weight: 700;
    }

    .profile-header p {
      margin: 0.25rem 0 0 0;
      color: var(--ion-color-medium);
    }

    .form-item {
      --padding-start: 0;
      --padding-end: 0;
      margin-bottom: 1rem;
      --background: var(--ion-color-light);
      --border-radius: 16px;
      padding: 0.5rem 0.75rem;
    }

    ion-icon[slot="start"] {
      color: var(--ion-color-primary);
      margin-right: 0.75rem;
    }

    .save-button {
      margin-top: 1.5rem;
      --border-radius: 14px;
      height: 52px;
      font-weight: 600;
    }
  `]
})
export class ProfilePage implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  profileForm: FormGroup;
  currentUser: User | null = null;
  isSaving = false;
  toastOpen = false;
  toastMessage = '';
  toastColor: 'success' | 'danger' = 'success';

  private subscription = new Subscription();

  constructor() {
    addIcons({ callOutline, locationOutline, personCircleOutline, saveOutline, logOutOutline });

    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      phone: [''],
      location: ['', Validators.required],
      businessName: [''],
      services: ['']
    });
  }

  ngOnInit(): void {
    const sub = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.profileForm.patchValue({
          name: user.name,
          phone: user.phone,
          location: user.location,
          businessName: user.businessName,
          services: user.services?.join(', ')
        });
      }
    });
    this.subscription.add(sub);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async saveProfile() {
    if (!this.currentUser) {
      return;
    }

    if (this.profileForm.invalid) {
      this.presentToast('Completa los campos requeridos.', 'danger');
      return;
    }

    this.isSaving = true;

    try {
      const value = this.profileForm.value;
      await this.authService.updateUserProfile(this.currentUser.uid, {
        name: value.name,
        phone: value.phone,
        location: value.location,
        businessName: value.businessName,
        services: value.services ? value.services.split(',').map((s: string) => s.trim()).filter(Boolean) : undefined
      });
      this.presentToast('Perfil actualizado correctamente.', 'success');
    } catch (error) {
      console.error('Error updating profile', error);
      this.presentToast('No se pudo actualizar el perfil.', 'danger');
    } finally {
      this.isSaving = false;
    }
  }

  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/autenticacion'], { replaceUrl: true });
    } catch (error) {
      console.error('Logout error', error);
      this.presentToast('No se pudo cerrar sesión.', 'danger');
    }
  }

  private presentToast(message: string, color: 'success' | 'danger') {
    this.toastMessage = message;
    this.toastColor = color;
    this.toastOpen = true;
  }
}
