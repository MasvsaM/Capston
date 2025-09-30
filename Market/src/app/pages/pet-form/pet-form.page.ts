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
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonButton,
  IonIcon,
  IonToast
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { pawOutline, saveOutline, trashOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { Pet } from '../../models/user.model';
import { firstValueFrom } from 'rxjs';

interface PetFormState {
  pet?: Pet;
  viewOnly?: boolean;
}

@Component({
  selector: 'app-pet-form',
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
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonButton,
    IonIcon,
    IonToast
  ],
  template: `
    <ion-content class="pet-form-content">
      <ion-header class="marketpet-header" collapse="condense">
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button defaultHref="/tabs/pets"></ion-back-button>
          </ion-buttons>
          <ion-title>{{ isEdit ? 'Editar mascota' : 'Nueva mascota' }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="form-wrapper ion-padding">
        <ion-card class="marketpet-card">
          <ion-card-content>
            <form [formGroup]="petForm" (ngSubmit)="submit()">
              <ion-list lines="none">
                <ion-item class="form-item">
                  <ion-label position="stacked">Nombre</ion-label>
                  <ion-input type="text" formControlName="name"></ion-input>
                </ion-item>

                <ion-item class="form-item">
                  <ion-label position="stacked">Especie</ion-label>
                  <ion-select formControlName="species" placeholder="Selecciona especie">
                    <ion-select-option value="Perro">Perro</ion-select-option>
                    <ion-select-option value="Gato">Gato</ion-select-option>
                    <ion-select-option value="Ave">Ave</ion-select-option>
                    <ion-select-option value="Conejo">Conejo</ion-select-option>
                    <ion-select-option value="Otro">Otro</ion-select-option>
                  </ion-select>
                </ion-item>

                <ion-item class="form-item">
                  <ion-label position="stacked">Raza</ion-label>
                  <ion-input type="text" formControlName="breed"></ion-input>
                </ion-item>

                <ion-item class="form-item">
                  <ion-label position="stacked">Edad</ion-label>
                  <ion-input type="text" formControlName="age"></ion-input>
                </ion-item>

                <ion-item class="form-item">
                  <ion-label position="stacked">Peso</ion-label>
                  <ion-input type="text" formControlName="weight"></ion-input>
                </ion-item>

                <ion-item class="form-item">
                  <ion-label position="stacked">Vacunas (separadas por coma)</ion-label>
                  <ion-textarea formControlName="vaccinations"></ion-textarea>
                </ion-item>

                <ion-item class="form-item">
                  <ion-label position="stacked">Ubicación</ion-label>
                  <ion-input type="text" formControlName="location"></ion-input>
                </ion-item>

                <ion-item class="form-item">
                  <ion-label position="stacked">Notas médicas</ion-label>
                  <ion-textarea formControlName="medicalHistory"></ion-textarea>
                </ion-item>

                <ion-item class="form-item">
                  <ion-label position="stacked">Preferencias</ion-label>
                  <ion-textarea formControlName="preferences"></ion-textarea>
                </ion-item>

                <ion-item class="form-item">
                  <ion-label position="stacked">Foto (URL)</ion-label>
                  <ion-input type="url" formControlName="imageUrl"></ion-input>
                </ion-item>
              </ion-list>

              <ion-button
                expand="block"
                type="submit"
                class="submit-button"
                [disabled]="petForm.invalid || isSubmitting || viewOnly">
                <ion-icon name="save-outline" slot="start"></ion-icon>
                {{ isEdit ? 'Actualizar' : 'Guardar' }}
              </ion-button>

              <ion-button
                expand="block"
                color="danger"
                fill="outline"
                *ngIf="isEdit && !viewOnly"
                (click)="deletePet()"
                [disabled]="isSubmitting">
                <ion-icon name="trash-outline" slot="start"></ion-icon>
                Eliminar mascota
              </ion-button>
            </form>
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
    .pet-form-content {
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

    .submit-button {
      margin-top: 1.5rem;
      --border-radius: 14px;
      height: 52px;
      font-weight: 600;
    }
  `]
})
export class PetFormPage implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private dataService = inject(DataService);

  petForm: FormGroup;
  isSubmitting = false;
  toastOpen = false;
  toastMessage = '';
  toastColor: 'success' | 'danger' = 'success';
  isEdit = false;
  viewOnly = false;
  currentPet?: Pet;

  constructor() {
    addIcons({ pawOutline, saveOutline, trashOutline });

    this.petForm = this.fb.group({
      name: ['', Validators.required],
      species: ['', Validators.required],
      breed: ['', Validators.required],
      age: ['', Validators.required],
      weight: ['', Validators.required],
      vaccinations: [''],
      location: ['', Validators.required],
      medicalHistory: [''],
      preferences: [''],
      imageUrl: ['']
    });
  }

  ngOnInit(): void {
    const navState = this.router.getCurrentNavigation()?.extras.state as PetFormState | undefined;
    const historyState = history.state as PetFormState | undefined;
    const state = navState?.pet ? navState : historyState;

    if (state?.pet) {
      this.isEdit = true;
      this.currentPet = state.pet;
      this.viewOnly = !!state.viewOnly;
      this.petForm.patchValue({
        ...state.pet,
        vaccinations: state.pet.vaccinations?.join(', '),
        medicalHistory: state.pet.medicalHistory?.join(', '),
        preferences: state.pet.preferences?.join(', ')
      });
      if (this.viewOnly) {
        this.petForm.disable();
      }
    }
  }

  async submit() {
    if (this.petForm.invalid) {
      this.presentToast('Completa todos los campos requeridos.', 'danger');
      return;
    }

    this.isSubmitting = true;

    try {
      const user = await firstValueFrom(this.authService.currentUser$);
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      const formValue = this.petForm.value;
      const payload: Omit<Pet, 'id' | 'createdAt' | 'updatedAt'> = {
        name: formValue.name,
        species: formValue.species,
        breed: formValue.breed,
        age: formValue.age,
        weight: formValue.weight,
        vaccinations: this.splitValues(formValue.vaccinations),
        location: formValue.location,
        medicalHistory: this.splitValues(formValue.medicalHistory),
        preferences: this.splitValues(formValue.preferences),
        imageUrl: formValue.imageUrl,
        userId: user.uid
      };

      if (this.isEdit && this.currentPet?.id) {
        await this.dataService.updatePet(this.currentPet.id, payload);
        this.presentToast('Mascota actualizada correctamente.', 'success');
      } else {
        await this.dataService.createPet(payload);
        this.presentToast('Mascota registrada correctamente.', 'success');
      }

      this.router.navigate(['/tabs/pets'], { replaceUrl: true });
    } catch (error) {
      console.error('Error saving pet', error);
      this.presentToast('No se pudo guardar la mascota. Intenta nuevamente.', 'danger');
    } finally {
      this.isSubmitting = false;
    }
  }

  async deletePet() {
    if (!this.currentPet?.id) {
      return;
    }

    this.isSubmitting = true;

    try {
      await this.dataService.deletePet(this.currentPet.id);
      this.presentToast('Mascota eliminada.', 'success');
      this.router.navigate(['/tabs/pets'], { replaceUrl: true });
    } catch (error) {
      console.error('Error deleting pet', error);
      this.presentToast('No se pudo eliminar la mascota.', 'danger');
    } finally {
      this.isSubmitting = false;
    }
  }

  private splitValues(value: string | string[]): string[] {
    if (!value) {
      return [];
    }
    if (Array.isArray(value)) {
      return value;
    }
    return value
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);
  }

  private presentToast(message: string, color: 'success' | 'danger') {
    this.toastMessage = message;
    this.toastColor = color;
    this.toastOpen = true;
  }
}
