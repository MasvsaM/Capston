import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonButton,
  IonCheckbox,
  IonContent,
  IonFooter,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { ProviderPreferences, ProviderPreferencesService } from '../services/provider-preferences.service';

@Component({
  selector: 'app-provider-preferences',
  templateUrl: './provider-preferences.page.html',
  styleUrls: ['./provider-preferences.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonCheckbox,
    IonTextarea,
    IonFooter,
    IonButton,
  ],
})
export class ProviderPreferencesPage {
  private readonly fb = inject(FormBuilder);
  private readonly preferencesService = inject(ProviderPreferencesService);
  private readonly router = inject(Router);

  protected readonly form: FormGroup = this.fb.group({
    modules: this.fb.group({
      agenda: [false],
      inventory: [false],
      services: [false],
      species: [false],
    }),
    servicesOffered: [''],
    speciesAttended: [''],
  });

  constructor() {
    const preferences = this.preferencesService.getPreferences();
    this.form.patchValue({
      modules: preferences.modules,
      servicesOffered: preferences.servicesOffered.join(', '),
      speciesAttended: preferences.speciesAttended.join(', '),
    });
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value as {
      modules: ProviderPreferences['modules'];
      servicesOffered: string;
      speciesAttended: string;
    };

    const preferences: ProviderPreferences = {
      modules: formValue.modules,
      servicesOffered: this.parseList(formValue.servicesOffered),
      speciesAttended: this.parseList(formValue.speciesAttended),
    };

    this.preferencesService.savePreferences(preferences);
    void this.router.navigate(['/providers/dashboard']);
  }

  private parseList(value: string | null | undefined): string[] {
    if (!value) {
      return [];
    }

    return value
      .split(',')
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0);
  }
}
