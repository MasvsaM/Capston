import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonCard,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonCheckbox,
  IonSegment,
  IonSegmentButton,
  IonToast,
  IonChip
} from '@ionic/angular/standalone';
import { ServicioAutenticacion } from '@nucleo/firebase';
import { addIcons } from 'ionicons';
import {
  logoGoogle,
  logoFacebook,
  eyeOutline,
  eyeOffOutline,
  mailOutline,
  lockClosedOutline,
  personOutline,
  callOutline,
  chatbubblesOutline,
  bulbOutline,
  shieldCheckmarkOutline,
  pawOutline,
  calendarOutline,
  heartOutline,
  briefcaseOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-auth',
  template: `
    <ion-content class="auth-content">
      <div class="blur-circle circle-1"></div>
      <div class="blur-circle circle-2"></div>

      <div class="auth-wrapper">
        <section class="promo-panel">
          <div class="logo-cluster">
            <div class="logo-icon">🐾</div>
            <div>
              <h1>MarketPet</h1>
              <p>Tu plataforma integral para el cuidado de mascotas</p>
            </div>
          </div>

          <div class="promo-chips">
            <ion-chip color="light">
              <ion-icon name="chatbubbles-outline"></ion-icon>
              <ion-label>Foros premium</ion-label>
            </ion-chip>
            <ion-chip color="light">
              <ion-icon name="bulb-outline"></ion-icon>
              <ion-label>IA para tu mascota (pronto)</ion-label>
            </ion-chip>
            <ion-chip color="light">
              <ion-icon name="shield-checkmark-outline"></ion-icon>
              <ion-label>Seguridad en cada paso</ion-label>
            </ion-chip>
          </div>

          <div class="highlight-grid">
            <div *ngFor="let highlight of wellnessHighlights" class="highlight-card">
              <ion-icon [name]="highlight.icon"></ion-icon>
              <div>
                <h3>{{ highlight.title }}</h3>
                <p>{{ highlight.description }}</p>
              </div>
            </div>
          </div>
        </section>

        <section class="form-panel">
          <div class="form-shell">
            <div class="form-header">
              <h2>{{ isRegister ? 'Crear una cuenta' : 'Bienvenido de nuevo' }}</h2>
              <p>
                Gestiona tus mascotas, descubre proveedores confiables y potencia tu experiencia con MarketPet Premium.
              </p>
            </div>

            <div class="user-type-wrapper">
              <span class="user-type-label">¿Cómo deseas usar MarketPet?</span>
              <ion-segment class="user-type-segment" [(ngModel)]="userType">
                <ion-segment-button value="client">
                  <ion-label>Cliente</ion-label>
                </ion-segment-button>
                <ion-segment-button value="provider">
                  <ion-label>Proveedor</ion-label>
                </ion-segment-button>
              </ion-segment>
              <div class="user-type-helper" [class.provider]="userType === 'provider'">
                <ion-icon [name]="userType === 'provider' ? 'briefcase-outline' : 'paw-outline'"></ion-icon>
                <div>
                  <p class="pill-title">{{ userType === 'provider' ? 'Ingresar como proveedor' : 'Ingresar como cliente' }}</p>
                  <p class="pill-subtitle">
                    {{
                      userType === 'provider'
                        ? 'Administra tus servicios, agenda con clientes y destaca tu negocio.'
                        : 'Guarda el perfil de tus mascotas, agenda y descubre profesionales cercanos.'
                    }}
                  </p>
                </div>
              </div>
            </div>

            <ion-card class="auth-card glass-card">
              <ion-card-content>
                <div class="form-toggle">
                  <button
                    class="toggle-btn"
                    [class.active]="!isRegister"
                    (click)="toggleForm(false)">
                    Iniciar Sesión
                  </button>
                  <button
                    class="toggle-btn"
                    [class.active]="isRegister"
                    (click)="toggleForm(true)">
                    Registrarse
                  </button>
                </div>

                <form [formGroup]="authForm" (ngSubmit)="onSubmit()">
                  <ion-item *ngIf="isRegister" class="form-item">
                    <ion-icon name="person-outline" slot="start"></ion-icon>
                    <ion-label position="stacked">Nombre completo</ion-label>
                    <ion-input
                      type="text"
                      formControlName="name"
                      placeholder="Ingresa tu nombre">
                    </ion-input>
                  </ion-item>

                  <ion-item *ngIf="isRegister" class="form-item">
                    <ion-icon name="call-outline" slot="start"></ion-icon>
                    <ion-label position="stacked">Teléfono</ion-label>
                    <ion-input
                      type="tel"
                      formControlName="phone"
                      placeholder="+56 9 1234 5678">
                    </ion-input>
                  </ion-item>

                  <ion-item class="form-item">
                    <ion-icon name="mail-outline" slot="start"></ion-icon>
                    <ion-label position="stacked">Email</ion-label>
                    <ion-input
                      type="email"
                      formControlName="email"
                      placeholder="tu@email.com">
                    </ion-input>
                  </ion-item>

                  <ion-item class="form-item">
                    <ion-icon name="lock-closed-outline" slot="start"></ion-icon>
                    <ion-label position="stacked">Contraseña</ion-label>
                    <ion-input
                      formControlName="password"
                      placeholder="••••••••"
                      [type]="showPassword ? 'text' : 'password'">
                    </ion-input>
                    <ion-icon
                      slot="end"
                      [name]="showPassword ? 'eye-off-outline' : 'eye-outline'"
                      (click)="togglePassword()">
                    </ion-icon>
                  </ion-item>

                  <div *ngIf="isRegister" class="terms-section">
                    <ion-checkbox formControlName="acceptTerms"></ion-checkbox>
                    <ion-label class="terms-label">
                      Acepto los <a href="#" class="terms-link">términos y condiciones</a>
                    </ion-label>
                  </div>

                  <ion-button
                    expand="block"
                    type="submit"
                    class="submit-btn"
                    [disabled]="!authForm.valid || isLoading">
                    {{ isLoading ? 'Cargando...' : (isRegister ? 'Crear Cuenta' : 'Iniciar Sesión') }}
                  </ion-button>
                </form>

                <div class="divider">
                  <span>o continúa con</span>
                </div>

                <div class="social-buttons">
                  <ion-button
                    fill="outline"
                    expand="block"
                    class="social-btn google-btn"
                    (click)="loginWithGoogle()">
                    <ion-icon name="logo-google" slot="start"></ion-icon>
                    Google
                  </ion-button>

                  <ion-button
                    fill="outline"
                    expand="block"
                    class="social-btn facebook-btn"
                    (click)="loginWithFacebook()">
                    <ion-icon name="logo-facebook" slot="start"></ion-icon>
                    Facebook
                  </ion-button>
                </div>
              </ion-card-content>
            </ion-card>
          </div>
        </section>
      </div>

      <ion-toast
        duration="3000"
        position="top"
        color="danger"
        [isOpen]="showToast"
        [message]="toastMessage"
        (didDismiss)="showToast = false">
      </ion-toast>
    </ion-content>
  `,
  styles: [`
    .auth-content {
      position: relative;
      --background: linear-gradient(140deg, #0b172d 0%, #1c3b64 45%, #295d8a 100%);
    }

    .blur-circle {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.6;
      z-index: 0;
    }

    .circle-1 {
      width: 320px;
      height: 320px;
      top: -120px;
      right: -80px;
      background: rgba(83, 208, 255, 0.45);
    }

    .circle-2 {
      width: 260px;
      height: 260px;
      bottom: -120px;
      left: -80px;
      background: rgba(101, 92, 255, 0.35);
    }

    .auth-wrapper {
      position: relative;
      z-index: 1;
      min-height: 100vh;
      display: flex;
      flex-direction: row;
      align-items: stretch;
      padding: 3rem 1.5rem 4rem;
      gap: 2.5rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .promo-panel {
      flex: 1;
      color: #f4f7ff;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      justify-content: center;
    }

    .logo-cluster {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .logo-icon {
      font-size: 3.2rem;
      background: rgba(255, 255, 255, 0.12);
      padding: 0.75rem;
      border-radius: 20px;
    }

    .logo-cluster h1 {
      font-size: 2.2rem;
      font-weight: 700;
      margin: 0;
    }

    .logo-cluster p {
      margin: 0;
      opacity: 0.7;
    }

    .promo-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .promo-chips ion-chip {
      --background: rgba(255, 255, 255, 0.1);
      --color: #f4f7ff;
      backdrop-filter: blur(8px);
    }

    .promo-chips ion-icon {
      margin-right: 0.4rem;
    }

    .highlight-grid {
      display: grid;
      gap: 1.1rem;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    }

    .highlight-card {
      display: flex;
      gap: 1rem;
      background: rgba(12, 22, 39, 0.55);
      border-radius: 18px;
      padding: 1.25rem;
      backdrop-filter: blur(14px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.25);
    }

    .highlight-card ion-icon {
      font-size: 1.8rem;
      color: #53d0ff;
    }

    .highlight-card h3 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 600;
    }

    .highlight-card p {
      margin: 0.35rem 0 0 0;
      opacity: 0.7;
      font-size: 0.95rem;
    }

    .form-panel {
      flex: 1;
      display: flex;
      align-items: center;
    }

    .form-shell {
      width: 100%;
      max-width: 460px;
      margin-left: auto;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-header h2 {
      color: #fff;
      font-size: 2rem;
      font-weight: 700;
      margin: 0;
    }

    .form-header p {
      margin: 0.5rem 0 0 0;
      color: rgba(255, 255, 255, 0.75);
      font-size: 0.95rem;
      line-height: 1.6;
    }

    .user-type-wrapper {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .user-type-helper {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding: 0.85rem 1rem;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.12);
    }

    .user-type-helper.provider {
      background: rgba(79, 109, 255, 0.12);
      border-color: rgba(79, 109, 255, 0.35);
    }

    .user-type-helper ion-icon {
      color: #53d0ff;
      font-size: 1.4rem;
    }

    .pill-title {
      margin: 0;
      color: #fff;
      font-weight: 700;
    }

    .pill-subtitle {
      margin: 0.1rem 0 0 0;
      color: rgba(255, 255, 255, 0.75);
      font-size: 0.9rem;
    }

    .user-type-label {
      color: rgba(255, 255, 255, 0.8);
      font-weight: 500;
    }

    .user-type-segment {
      --background: rgba(255, 255, 255, 0.12);
      border-radius: 14px;
    }

    .glass-card {
      border-radius: 26px;
      background: rgba(255, 255, 255, 0.12);
      backdrop-filter: blur(18px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 18px 45px rgba(5, 15, 35, 0.35);
    }

    .form-toggle {
      display: flex;
      background: rgba(15, 26, 46, 0.4);
      border-radius: 14px;
      padding: 6px;
      margin-bottom: 1.5rem;
    }

    .toggle-btn {
      flex: 1;
      background: transparent;
      border: none;
      padding: 12px;
      border-radius: 10px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.6);
      transition: all 0.3s ease;
    }

    .toggle-btn.active {
      background: linear-gradient(135deg, #53d0ff 0%, #4f6dff 100%);
      color: #0b1326;
      box-shadow: 0 12px 22px rgba(83, 208, 255, 0.4);
    }

    .form-item {
      margin-bottom: 1rem;
      --border-radius: 14px;
      --background: rgba(7, 19, 40, 0.55);
      --padding-start: 16px;
      --inner-padding-end: 12px;
      color: #fff;
    }

    .form-item ion-label {
      color: rgba(255, 255, 255, 0.75) !important;
    }

    .form-item ion-input {
      color: #fff;
    }

    .terms-section {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 1rem 0;
      color: rgba(255, 255, 255, 0.7);
    }

    .terms-link {
      color: #53d0ff;
      text-decoration: none;
    }

    .submit-btn {
      margin: 1.75rem 0 1rem 0;
      --border-radius: 16px;
      --background: linear-gradient(135deg, #53d0ff 0%, #4f6dff 100%);
      --box-shadow: 0 12px 26px rgba(83, 208, 255, 0.35);
      height: 52px;
      font-weight: 600;
    }

    .divider {
      text-align: center;
      margin: 1.5rem 0;
      position: relative;
      color: rgba(255, 255, 255, 0.6);
    }

    .divider::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: rgba(255, 255, 255, 0.1);
    }

    .divider span {
      background: rgba(15, 24, 45, 0.85);
      padding: 0 1rem;
    }

    .social-buttons {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }

    .social-btn {
      --border-radius: 14px;
      height: 50px;
      font-weight: 600;
    }

    .google-btn {
      --border-color: rgba(219, 68, 55, 0.45);
      --color: #fff;
      --background: rgba(219, 68, 55, 0.18);
    }

    .facebook-btn {
      --border-color: rgba(59, 89, 152, 0.45);
      --color: #fff;
      --background: rgba(59, 89, 152, 0.2);
    }

    @media (max-width: 992px) {
      .auth-wrapper {
        flex-direction: column;
        padding-top: 4rem;
        padding-bottom: 3rem;
      }

      .promo-panel,
      .form-panel {
        flex: unset;
      }

      .form-shell {
        margin: 0 auto;
        max-width: 520px;
      }
    }

    @media (max-width: 768px) {
      .auth-content {
        --background: linear-gradient(160deg, #0b172d 0%, #133050 60%, #1c3b64 100%);
      }

      .auth-wrapper {
        padding: 2.5rem 1rem 3rem;
      }

      .form-header h2 {
        font-size: 1.7rem;
      }

      .promo-panel {
        gap: 1rem;
      }

      .glass-card {
        box-shadow: 0 12px 32px rgba(5, 15, 35, 0.38);
      }
    }

    @media (max-width: 576px) {
      .auth-wrapper {
        padding: 2rem 0.75rem 2.5rem;
      }

      .form-shell {
        max-width: none;
      }

      .promo-chips {
        gap: 0.5rem;
      }

      .highlight-grid {
        grid-template-columns: 1fr;
      }

      .form-toggle {
        flex-direction: column;
        gap: 0.5rem;
      }

      .toggle-btn {
        width: 100%;
      }

      .user-type-helper {
        align-items: flex-start;
      }
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    IonContent, IonCard, IonCardContent,
    IonItem, IonLabel, IonInput, IonButton, IonIcon, IonCheckbox, IonSegment, IonSegmentButton, IonToast, IonChip,
    ReactiveFormsModule, FormsModule
  ]
})
export class AuthPage {
  private fb = inject(FormBuilder);
  private servicioAutenticacion = inject(ServicioAutenticacion);
  private router = inject(Router);

  isRegister = false;
  userType: 'client' | 'provider' = 'client';
  showPassword = false;
  isLoading = false;
  showToast = false;
  toastMessage = '';

  authForm: FormGroup;

  wellnessHighlights = [
    {
      icon: 'paw-outline',
      title: 'Seguimiento integral',
      description: 'Centraliza información de vacunas, citas y cuidados de cada mascota en un solo lugar.'
    },
    {
      icon: 'calendar-outline',
      title: 'Recordatorios inteligentes',
      description: 'Recibe alertas anticipadas para controles, baños y actividades clave.'
    },
    {
      icon: 'heart-outline',
      title: 'Comunidad confiable',
      description: 'Comparte experiencias y encuentra recomendaciones de tutores y especialistas certificados.'
    }
  ];

  constructor() {
    addIcons({
      logoGoogle,
      logoFacebook,
      eyeOutline,
      eyeOffOutline,
      mailOutline,
      lockClosedOutline,
      personOutline,
      callOutline,
      chatbubblesOutline,
      bulbOutline,
      shieldCheckmarkOutline,
      pawOutline,
      calendarOutline,
      heartOutline,
      briefcaseOutline
    });

    this.authForm = this.fb.group({
      name: [''],
      phone: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      acceptTerms: [false]
    });
  }

  toggleForm(isRegister: boolean) {
    this.isRegister = isRegister;

    if (isRegister) {
      this.authForm.get('name')?.setValidators([Validators.required]);
      this.authForm.get('phone')?.setValidators([Validators.required]);
      this.authForm.get('acceptTerms')?.setValidators([Validators.requiredTrue]);
    } else {
      this.authForm.get('name')?.clearValidators();
      this.authForm.get('phone')?.clearValidators();
      this.authForm.get('acceptTerms')?.clearValidators();
    }

    this.authForm.get('name')?.updateValueAndValidity();
    this.authForm.get('phone')?.updateValueAndValidity();
    this.authForm.get('acceptTerms')?.updateValueAndValidity();
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async onSubmit() {
    if (!this.authForm.valid) return;

    this.isLoading = true;
    const formData = this.authForm.value;

    try {
      if (this.isRegister) {
        if (this.userType === 'provider') {
          this.router.navigate(['/proveedores/registro'], {
            state: {
              email: formData.email,
              password: formData.password,
              name: formData.name,
              phone: formData.phone
            }
          });
        } else {
          await this.servicioAutenticacion.registrar(formData.email, formData.password, {
            name: formData.name,
            phone: formData.phone,
            userType: 'client'
          });

          this.router.navigate(['/onboarding'], { replaceUrl: true });
        }
      } else {
        const resultado = await this.servicioAutenticacion.iniciarSesion(formData.email, formData.password, {
          userType: this.userType
        });

        if (resultado.datosUsuario?.userType === 'provider') {
          this.router.navigate(['/proveedores/panel'], { replaceUrl: true });
        } else {
          this.router.navigate(['/tabs/mascotas'], { replaceUrl: true });
        }
      }
    } catch (error: any) {
      this.showError(this.getErrorMessage(error));
    } finally {
      this.isLoading = false;
    }
  }

  async loginWithGoogle() {
    try {
      this.isLoading = true;
      const resultado = await this.servicioAutenticacion.iniciarSesionConGoogle({
        userType: this.userType
      });

      if (resultado.esUsuarioNuevo) {
        this.router.navigate(['/onboarding'], { replaceUrl: true });
      } else {
        if (resultado.datosUsuario?.userType === 'provider') {
          this.router.navigate(['/proveedores/panel'], { replaceUrl: true });
        } else {
          this.router.navigate(['/tabs/mascotas'], { replaceUrl: true });
        }
      }
    } catch (error: any) {
      this.showError(this.getErrorMessage(error));
    } finally {
      this.isLoading = false;
    }
  }

  async loginWithFacebook() {
    try {
      this.isLoading = true;
      const resultado = await this.servicioAutenticacion.iniciarSesionConFacebook({
        userType: this.userType
      });

      if (resultado.esUsuarioNuevo) {
        this.router.navigate(['/onboarding'], { replaceUrl: true });
      } else {
        if (resultado.datosUsuario?.userType === 'provider') {
          this.router.navigate(['/proveedores/panel'], { replaceUrl: true });
        } else {
          this.router.navigate(['/tabs/mascotas'], { replaceUrl: true });
        }
      }
    } catch (error: any) {
      this.showError(this.getErrorMessage(error));
    } finally {
      this.isLoading = false;
    }
  }

  private showError(message: string) {
    this.toastMessage = message;
    this.showToast = true;
  }

  private getErrorMessage(error: any): string {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'Usuario no encontrado';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta';
      case 'auth/email-already-in-use':
        return 'Este email ya está registrado';
      case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres';
      case 'auth/invalid-email':
        return 'Email inválido';
      default:
        return 'Error de autenticación. Intenta nuevamente.';
    }
  }
}
