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
  IonList,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonDatetime,
  IonTextarea,
  IonButton,
  IonIcon,
  IonText,
  IonToast
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { calendarOutline, medkitOutline, personOutline, pawOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { Appointment, Pet, Provider } from '../../models/user.model';
import { Subscription, firstValueFrom } from 'rxjs';

interface AppointmentState {
  pet?: Pet;
  provider?: Provider;
}

@Component({
  selector: 'app-appointment-form',
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
    IonSelect,
    IonSelectOption,
    IonDatetime,
    IonTextarea,
    IonButton,
    IonIcon,
    IonText,
    IonToast
  ],
  template: `
    <ion-content class="appointment-form-content">
      <ion-header class="marketpet-header" collapse="condense">
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button defaultHref="/tabs/pets"></ion-back-button>
          </ion-buttons>
          <ion-title>Agendar cita</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="form-wrapper ion-padding">
        <ion-card class="marketpet-card">
          <ion-card-content>
            <form [formGroup]="appointmentForm" (ngSubmit)="submit()">
              <ion-list lines="none">
                <ion-item class="form-item">
                  <ion-icon slot="start" name="paw-outline"></ion-icon>
                  <ion-label position="stacked">Mascota</ion-label>
                  <ion-select formControlName="petId" placeholder="Selecciona una mascota">
                    <ion-select-option *ngFor="let pet of pets" [value]="pet.id">
                      {{ pet.name }} • {{ pet.species }}
                    </ion-select-option>
                  </ion-select>
                </ion-item>

                <ion-item class="form-item">
                  <ion-icon slot="start" name="person-outline"></ion-icon>
                  <ion-label position="stacked">Proveedor</ion-label>
                  <ion-select formControlName="providerId" placeholder="Selecciona un proveedor">
                    <ion-select-option *ngFor="let provider of providers" [value]="provider.id">
                      {{ provider.name }} • {{ provider.profession }}
                    </ion-select-option>
                  </ion-select>
                </ion-item>

                <ion-item class="form-item">
                  <ion-icon slot="start" name="medkit-outline"></ion-icon>
                  <ion-label position="stacked">Servicio</ion-label>
                  <ion-select formControlName="service" placeholder="Tipo de servicio">
                    <ion-select-option value="Consulta general">Consulta general</ion-select-option>
                    <ion-select-option value="Control">Control</ion-select-option>
                    <ion-select-option value="Grooming">Grooming</ion-select-option>
                    <ion-select-option value="Paseo">Paseo</ion-select-option>
                  </ion-select>
                </ion-item>

                <ion-item class="form-item">
                  <ion-icon slot="start" name="calendar-outline"></ion-icon>
                  <ion-label position="stacked">Fecha y hora</ion-label>
                  <ion-datetime
                    formControlName="dateTime"
                    presentation="date-time"
                    [min]="minDate"
                    hourCycle="h23">
                  </ion-datetime>
                </ion-item>

                <ion-item class="form-item">
                  <ion-label position="stacked">Notas adicionales</ion-label>
                  <ion-textarea
                    formControlName="notes"
                    placeholder="Información importante para el proveedor"
                    autoGrow="true">
                  </ion-textarea>
                </ion-item>
              </ion-list>

              <ion-text color="medium" *ngIf="!pets.length">
                Debes registrar una mascota antes de agendar una cita.
              </ion-text>

              <ion-button
                expand="block"
                type="submit"
                class="submit-button"
                [disabled]="appointmentForm.invalid || isSubmitting">
                {{ isSubmitting ? 'Guardando...' : 'Confirmar cita' }}
              </ion-button>
            </form>
          </ion-card-content>
        </ion-card>
      </div>

      <ion-toast
        [isOpen]="toastOpen"
        [message]="toastMessage"
        color="danger"
        duration="2500"
        position="top"
        (didDismiss)="toastOpen = false">
      </ion-toast>
    </ion-content>
  `,
  styles: [`
    .appointment-form-content {
      --background: var(--ion-color-light);
    }

    .form-wrapper {
      max-width: 640px;
      margin: 0 auto;
    }

    ion-card {
      margin-top: 2rem;
      border-radius: 24px;
      box-shadow: var(--marketpet-shadow);
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

    .submit-button {
      margin-top: 1.5rem;
      --border-radius: 14px;
      height: 52px;
      font-weight: 600;
    }
  `]
})
export class AppointmentFormPage implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private dataService = inject(DataService);

  appointmentForm: FormGroup;
  pets: Pet[] = [];
  providers: Provider[] = [];
  isSubmitting = false;
  toastOpen = false;
  toastMessage = '';
  minDate = new Date().toISOString();

  private subscription = new Subscription();

  constructor() {
    addIcons({ calendarOutline, medkitOutline, personOutline, pawOutline });

    this.appointmentForm = this.fb.group({
      petId: ['', Validators.required],
      providerId: ['', Validators.required],
      service: ['', Validators.required],
      dateTime: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    const navState = this.router.getCurrentNavigation()?.extras.state as AppointmentState | undefined;
    const historyState = history.state as AppointmentState | undefined;
    const state = navState?.pet || navState?.provider ? navState : historyState;

    const sub = this.authService.currentUser$.subscribe(user => {
      if (user) {
        const petsSub = this.dataService.getUserPets(user.uid).subscribe(pets => {
          this.pets = pets;
          if (state?.pet) {
            this.appointmentForm.patchValue({ petId: state.pet.id });
          }
        });
        this.subscription.add(petsSub);

        const providersSub = this.dataService.getProviders().subscribe(providers => {
          this.providers = providers;
          if (state?.provider) {
            this.appointmentForm.patchValue({ providerId: state.provider.id });
          }
        });
        this.subscription.add(providersSub);
      }
    });

    this.subscription.add(sub);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async submit() {
    if (this.appointmentForm.invalid) {
      this.toastMessage = 'Completa todos los campos requeridos.';
      this.toastOpen = true;
      return;
    }

    const user = await firstValueFrom(this.authService.currentUser$);
    if (!user) {
      this.toastMessage = 'Debes iniciar sesión para agendar una cita.';
      this.toastOpen = true;
      return;
    }

    this.isSubmitting = true;

    try {
      const { petId, providerId, service, dateTime, notes } = this.appointmentForm.value;
      const selectedPet = this.pets.find(pet => pet.id === petId);
      const selectedProvider = this.providers.find(provider => provider.id === providerId);

      if (!selectedPet || !selectedProvider) {
        throw new Error('Información de mascota o proveedor inválida.');
      }

      const date = new Date(dateTime);
      const appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'> = {
        petId,
        petName: selectedPet.name,
        providerId,
        providerName: selectedProvider.name,
        userId: user.uid,
        service,
        date: date.toLocaleDateString(),
        time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        location: selectedProvider.location,
        price: selectedProvider.price,
        status: 'pending',
        providerImage: selectedProvider.imageUrl,
        notes
      };

      await this.dataService.createAppointment(appointment);
      this.router.navigate(['/tabs/appointments'], { replaceUrl: true });
    } catch (error) {
      console.error('Error creating appointment', error);
      this.toastMessage = 'No se pudo crear la cita. Intenta nuevamente.';
      this.toastOpen = true;
    } finally {
      this.isSubmitting = false;
    }
  }
}
