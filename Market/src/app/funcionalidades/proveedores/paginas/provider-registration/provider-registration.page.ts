import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
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
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonChip,
  IonIcon,
  IonToast
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { briefcaseOutline, businessOutline, locationOutline, cashOutline } from 'ionicons/icons';
import { AuthService } from '@nucleo/servicios/auth.service';
import { DataService } from '@nucleo/servicios/data.service';

interface ProviderRegistrationState {
  email: string;
  password: string;
  name: string;
  phone: string;
}

@Component({
  selector: 'app-provider-registration',
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
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonChip,
    IonIcon,
    IonToast
  ],
  template: `
    <ion-content class="provider-registration-content">
      <ion-header class="marketpet-header" collapse="condense">
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button defaultHref="/auth"></ion-back-button>
          </ion-buttons>
          <ion-title>Registro de Proveedor</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="content-wrapper ion-padding">
        <ion-card class="registration-card marketpet-card">
          <ion-card-content>
            <h2>Completa tu perfil profesional</h2>
            <p class="subtitle">
              Cuéntanos sobre tus servicios para conectar con los mejores clientes.
            </p>

            <form [formGroup]="registrationForm" (ngSubmit)="submit()">
              <ion-list lines="none">
                <ion-item class="form-item">
                  <ion-icon name="business-outline" slot="start"></ion-icon>
                  <ion-label position="stacked">Nombre del negocio</ion-label>
                  <ion-input
                    type="text"
                    formControlName="businessName"
                    placeholder="Ej: VetCare Express">
                  </ion-input>
                </ion-item>

                <ion-item class="form-item">
                  <ion-icon name="briefcase-outline" slot="start"></ion-icon>
                  <ion-label position="stacked">Profesión</ion-label>
                  <ion-input
                    type="text"
                    formControlName="profession"
                    placeholder="Veterinario, Groomer, Paseador">
                  </ion-input>
                </ion-item>

                <ion-item class="form-item">
                  <ion-icon name="location-outline" slot="start"></ion-icon>
                  <ion-label position="stacked">Ubicación</ion-label>
                  <ion-input
                    type="text"
                    formControlName="location"
                    placeholder="Santiago, Chile">
                  </ion-input>
                </ion-item>

                <ion-item class="form-item">
                  <ion-icon name="cash-outline" slot="start"></ion-icon>
                  <ion-label position="stacked">Rango de precios</ion-label>
                  <ion-input
                    type="text"
                    formControlName="priceRange"
                    placeholder="Ej: Desde $15.000">
                  </ion-input>
                </ion-item>

                <ion-item class="form-item">
                  <ion-label position="stacked">Servicios que ofreces</ion-label>
                  <ion-select
                    formControlName="services"
                    interface="popover"
                    [multiple]="true"
                    placeholder="Selecciona uno o más">
                    <ion-select-option
                      *ngFor="let category of serviceCategories"
                      [value]="category.name">
                      {{ category.name }}
                    </ion-select-option>
                  </ion-select>
                </ion-item>

                <ion-item class="form-item">
                  <ion-label position="stacked">Descripción</ion-label>
                  <ion-textarea
                    formControlName="description"
                    placeholder="Describe tu experiencia y servicios"
                    autoGrow="true">
                  </ion-textarea>
                </ion-item>

                <ion-item class="form-item">
                  <ion-label position="stacked">Disponibilidad</ion-label>
                  <ion-input
                    type="text"
                    formControlName="availability"
                    placeholder="Lunes a Viernes - 09:00 a 18:00">
                  </ion-input>
                </ion-item>
              </ion-list>

              <div class="selected-services" *ngIf="registrationForm.value.services?.length">
                <span>Servicios seleccionados:</span>
                <ion-chip color="primary" *ngFor="let service of registrationForm.value.services">
                  <ion-label>{{ service }}</ion-label>
                </ion-chip>
              </div>

              <ion-button
                expand="block"
                type="submit"
                class="submit-button"
                [disabled]="registrationForm.invalid || isSubmitting">
                {{ isSubmitting ? 'Registrando...' : 'Crear cuenta de proveedor' }}
              </ion-button>
            </form>
          </ion-card-content>
        </ion-card>
      </div>

      <ion-toast
        [isOpen]="toastOpen"
        [message]="toastMessage"
        color="danger"
        duration="3000"
        position="top"
        (didDismiss)="toastOpen = false">
      </ion-toast>
    </ion-content>
  `,
  styles: [`
    .provider-registration-content {
      --background: var(--ion-color-light);
    }

    .content-wrapper {
      max-width: 640px;
      margin: 0 auto;
    }

    .registration-card {
      margin-top: 2rem;
      border-radius: 24px;
      box-shadow: var(--marketpet-shadow);
    }

    h2 {
      font-weight: 700;
      margin-bottom: 0.5rem;
      color: var(--ion-color-dark);
    }

    .subtitle {
      margin-bottom: 1.5rem;
      color: var(--ion-color-medium);
    }

    .form-item {
      --padding-start: 0;
      --padding-end: 0;
      margin-bottom: 1rem;
      --border-radius: 16px;
      --background: var(--ion-color-light);
      padding: 0.5rem 0.75rem;
    }

    ion-icon[slot="start"] {
      margin-right: 0.75rem;
      color: var(--ion-color-primary);
    }

    .selected-services {
      margin: 1rem 0 1.5rem 0;
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      align-items: center;
    }

    .selected-services span {
      font-weight: 600;
      color: var(--ion-color-medium);
      margin-right: 0.5rem;
    }

    .submit-button {
      --border-radius: 14px;
      height: 52px;
      font-weight: 600;
    }
  `]
})
export class ProviderRegistrationPage implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private dataService = inject(DataService);

  registrationForm: FormGroup;
  isSubmitting = false;
  toastOpen = false;
  toastMessage = '';
  providerState?: ProviderRegistrationState;

  serviceCategories = this.dataService.getServiceCategories();

  constructor() {
    addIcons({ briefcaseOutline, businessOutline, locationOutline, cashOutline });

    this.registrationForm = this.fb.group({
      businessName: ['', Validators.required],
      profession: ['', Validators.required],
      location: ['', Validators.required],
      priceRange: ['', Validators.required],
      services: [[], Validators.required],
      description: ['', [Validators.required, Validators.minLength(20)]],
      availability: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const navigationState = this.router.getCurrentNavigation()?.extras.state as ProviderRegistrationState | undefined;
    const historyState = history.state as ProviderRegistrationState | undefined;
    this.providerState = navigationState?.email ? navigationState : historyState?.email ? historyState : undefined;

    if (!this.providerState?.email) {
      this.router.navigate(['/autenticacion'], { replaceUrl: true });
    }
  }

  async submit() {
    if (this.registrationForm.invalid || !this.providerState) {
      return;
    }

    this.isSubmitting = true;

    try {
      const formValue = this.registrationForm.value;
      const { email, password, name, phone } = this.providerState;

      const result = await this.authService.register(email, password, {
        name,
        phone,
        userType: 'provider',
        location: formValue.location,
        businessName: formValue.businessName,
        services: formValue.services
      });

      await this.dataService.createProvider({
        userId: result.user.uid,
        name,
        profession: formValue.profession,
        specialties: formValue.services,
        rating: 5,
        reviewCount: 0,
        location: formValue.location,
        availability: formValue.availability,
        price: formValue.priceRange,
        imageUrl: '',
        services: formValue.services,
        businessName: formValue.businessName,
        description: formValue.description
      });

      this.router.navigate(['/proveedores/onboarding'], { replaceUrl: true });
    } catch (error: any) {
      console.error('Provider registration error', error);
      this.toastMessage = this.getErrorMessage(error);
      this.toastOpen = true;
    } finally {
      this.isSubmitting = false;
    }
  }

  private getErrorMessage(error: any): string {
    switch (error?.code) {
      case 'auth/email-already-in-use':
        return 'Este correo ya está registrado.';
      case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres.';
      default:
        return 'No pudimos completar el registro. Intenta nuevamente.';
    }
  }
}
