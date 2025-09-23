import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProviderDashboardService, ProviderProfile } from '../shared/services/provider-dashboard.service';

type UserRole = 'cliente' | 'proveedor';

interface ServiceOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  modalities: string[];
  suggestedAnimals: string[];
  defaultPrice: number;
}

type ServiceFormGroup = FormGroup<{
  id: FormControl<string>;
  name: FormControl<string>;
  modalidad: FormControl<string>;
  price: FormControl<number>;
  animals: FormControl<string[]>;
  schedule: FormControl<string>;
}>;

function atLeastOneService(control: AbstractControl): ValidationErrors | null {
  const formArray = control as FormArray;
  return formArray.length > 0 ? null : { required: true };
}

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dashboardService = inject(ProviderDashboardService);

  readonly serviceOptions: ServiceOption[] = [
    {
      id: 'grooming',
      title: 'Peluquería y baño',
      description: 'Baños, cortes higiénicos, tratamientos antipulgas y spa para mascotas.',
      icon: 'cut-outline',
      modalities: ['En local', 'A domicilio', 'Mixto'],
      suggestedAnimals: ['Perros', 'Gatos'],
      defaultPrice: 18000,
    },
    {
      id: 'walking',
      title: 'Paseo de perros',
      description: 'Rutas diarias, paquetes semanales y salidas grupales o individuales.',
      icon: 'walk-outline',
      modalities: ['Barrio del cliente', 'Parques asociados', 'Mixto'],
      suggestedAnimals: ['Perros'],
      defaultPrice: 7000,
    },
    {
      id: 'training',
      title: 'Adiestramiento y conducta',
      description: 'Sesiones personalizadas, entrenamiento básico y modificación de conducta.',
      icon: 'school-outline',
      modalities: ['En local', 'A domicilio', 'Online'],
      suggestedAnimals: ['Perros'],
      defaultPrice: 35000,
    },
    {
      id: 'veterinary',
      title: 'Veterinaria y salud',
      description: 'Consultas generales, vacunas, telemedicina y farmacia básica.',
      icon: 'medkit-outline',
      modalities: ['Clínica propia', 'Visita a domicilio', 'Teleconsulta'],
      suggestedAnimals: ['Perros', 'Gatos', 'Pequeños mamíferos'],
      defaultPrice: 25000,
    },
    {
      id: 'daycare',
      title: 'Guardería u hotel',
      description: 'Estadías diurnas, nocturnas y paquetes de cuidado vacacional.',
      icon: 'home-outline',
      modalities: ['En local', 'Servicio móvil'],
      suggestedAnimals: ['Perros', 'Gatos'],
      defaultPrice: 22000,
    },
  ];

  readonly animalesDisponibles = ['Perros', 'Gatos', 'Aves', 'Pequeños mamíferos', 'Reptiles'];
  readonly submitted = signal(false);

  readonly registroForm = this.fb.group({
    role: this.fb.nonNullable.control<UserRole>('cliente', { validators: [Validators.required] }),
    nombre: this.fb.nonNullable.control('', { validators: [Validators.required] }),
    rut: this.fb.control<string | null>(''),
    direccion: this.fb.nonNullable.control('', { validators: [Validators.required] }),
    telefono: this.fb.nonNullable.control('', { validators: [Validators.required] }),
    email: this.fb.nonNullable.control('', {
      validators: [Validators.required, Validators.email],
    }),
    password: this.fb.nonNullable.control('', { validators: [Validators.required] }),
    services: this.fb.array<ServiceFormGroup>([]),
  });

  readonly isProveedor = computed(() => this.registroForm.get('role')?.value === 'proveedor');

  constructor() {
    this.registroForm
      .get('role')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(role => {
        this.applyRoleValidators(role as UserRole | null);
      });

    this.applyRoleValidators(this.registroForm.get('role')?.value ?? 'cliente');
  }

  get servicios(): FormArray<ServiceFormGroup> {
    return this.registroForm.get('services') as FormArray<ServiceFormGroup>;
  }

  isServiceSelected(id: string): boolean {
    return this.servicios.controls.some(control => control.get('id')?.value === id);
  }

  toggleService(option: ServiceOption, checked: boolean): void {
    const index = this.servicios.controls.findIndex(control => control.get('id')?.value === option.id);

    if (checked && index === -1) {
      this.servicios.push(this.createServiceGroup(option));
    } else if (!checked && index !== -1) {
      this.servicios.removeAt(index);
    }

    this.servicios.updateValueAndValidity();
  }

  modalidadesPara(id: string | null | undefined): string[] {
    if (!id) {
      return [];
    }

    return this.serviceOptions.find(option => option.id === id)?.modalities ?? [];
  }

  private createServiceGroup(option: ServiceOption): ServiceFormGroup {
    return this.fb.nonNullable.group({
      id: this.fb.nonNullable.control(option.id),
      name: this.fb.nonNullable.control(option.title),
      modalidad: this.fb.nonNullable.control(option.modalities[0] ?? '', {
        validators: [Validators.required],
      }),
      price: this.fb.nonNullable.control(option.defaultPrice, {
        validators: [Validators.required, Validators.min(0)],
      }),
      animals: this.fb.nonNullable.control([...option.suggestedAnimals], {
        validators: [Validators.required],
      }),
      schedule: this.fb.nonNullable.control('Coordinar con el cliente', {
        validators: [Validators.required],
      }),
    });
  }

  private applyRoleValidators(role: UserRole | null): void {
    const rutControl = this.registroForm.get('rut');

    if (role === 'proveedor') {
      rutControl?.addValidators([Validators.required]);
      this.servicios.setValidators([atLeastOneService]);
    } else {
      rutControl?.removeValidators([Validators.required]);
      this.clearServiceSelection();
      this.servicios.clearValidators();
    }

    rutControl?.updateValueAndValidity({ emitEvent: false });
    this.servicios.updateValueAndValidity({ emitEvent: false });
  }

  private clearServiceSelection(): void {
    while (this.servicios.length) {
      this.servicios.removeAt(0);
    }
  }

  onSubmit(): void {
    this.submitted.set(true);

    if (this.isProveedor()) {
      this.servicios.controls.forEach(control => control.markAllAsTouched());
    }

    this.registroForm.markAllAsTouched();
    this.servicios.updateValueAndValidity();

    if (this.registroForm.invalid) {
      return;
    }

    const datos = this.registroForm.value;
    console.log('Registro con:', datos);

    if (datos.role === 'proveedor') {
      const profile: ProviderProfile = {
        name: datos.nombre ?? '',
        email: datos.email ?? '',
        telefono: datos.telefono ?? '',
        direccion: datos.direccion ?? '',
        rut: datos.rut ?? '',
        services:
          datos.services?.map(service => ({
            id: service?.id ?? 'custom',
            name: service?.name ?? 'Servicio personalizado',
            modalidad: service?.modalidad ?? 'Sin definir',
            price: Number(service?.price ?? 0),
            animals: service?.animals ?? [],
            schedule: service?.schedule ?? 'Coordinar con el cliente',
          })) ?? [],
      };

      this.dashboardService.setProfile(profile);
      void this.router.navigate(['/perfil-proveedor']);
      return;
    }

    void this.router.navigate(['/perfil-cliente']);
  }
}
