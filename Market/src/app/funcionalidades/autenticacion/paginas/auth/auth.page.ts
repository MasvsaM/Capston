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
  IonToast
} from '@ionic/angular/standalone';
import { AuthService } from '@nucleo/servicios/auth.service';
import { addIcons } from 'ionicons';
import { logoGoogle, logoFacebook, eyeOutline, eyeOffOutline, mailOutline, lockClosedOutline, personOutline, callOutline } from 'ionicons/icons';

@Component({
  selector: 'app-auth',
  template: `
    <ion-content class="auth-content">
      <div class="auth-container">
        <!-- Logo Section -->
        <div class="logo-section">
          <div class="logo-icon">🐾</div>
          <h1>MarketPet</h1>
          <p>Conecta con los mejores servicios para tu mascota</p>
        </div>

        <!-- User Type Selector -->
        <ion-segment [(ngModel)]="userType" class="user-type-segment">
          <ion-segment-button value="client">
            <ion-label>Cliente</ion-label>
          </ion-segment-button>
          <ion-segment-button value="provider">
            <ion-label>Proveedor</ion-label>
          </ion-segment-button>
        </ion-segment>

        <!-- Auth Form -->
        <ion-card class="auth-card">
          <ion-card-content>
            <!-- Toggle between Login/Register -->
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
              <!-- Name field (only for register) -->
              <ion-item *ngIf="isRegister" class="form-item">
                <ion-icon name="person-outline" slot="start"></ion-icon>
                <ion-label position="stacked">Nombre completo</ion-label>
                <ion-input 
                  type="text" 
                  formControlName="name"
                  placeholder="Ingresa tu nombre">
                </ion-input>
              </ion-item>

              <!-- Phone field (only for register) -->
              <ion-item *ngIf="isRegister" class="form-item">
                <ion-icon name="call-outline" slot="start"></ion-icon>
                <ion-label position="stacked">Teléfono</ion-label>
                <ion-input 
                  type="tel" 
                  formControlName="phone"
                  placeholder="+56 9 1234 5678">
                </ion-input>
              </ion-item>

              <!-- Email field -->
              <ion-item class="form-item">
                <ion-icon name="mail-outline" slot="start"></ion-icon>
                <ion-label position="stacked">Email</ion-label>
                <ion-input 
                  type="email" 
                  formControlName="email"
                  placeholder="tu@email.com">
                </ion-input>
              </ion-item>

              <!-- Password field -->
              <ion-item class="form-item">
                <ion-icon name="lock-closed-outline" slot="start"></ion-icon>
                <ion-label position="stacked">Contraseña</ion-label>
                <ion-input 
                  [type]="showPassword ? 'text' : 'password'"
                  formControlName="password"
                  placeholder="••••••••">
                </ion-input>
                <ion-icon 
                  [name]="showPassword ? 'eye-off-outline' : 'eye-outline'"
                  slot="end"
                  (click)="togglePassword()">
                </ion-icon>
              </ion-item>

              <!-- Terms acceptance (only for register) -->
              <div *ngIf="isRegister" class="terms-section">
                <ion-checkbox formControlName="acceptTerms"></ion-checkbox>
                <ion-label class="terms-label">
                  Acepto los <a href="#" class="terms-link">términos y condiciones</a>
                </ion-label>
              </div>

              <!-- Submit Button -->
              <ion-button 
                expand="block" 
                type="submit"
                class="submit-btn"
                [disabled]="!authForm.valid || isLoading">
                {{ isLoading ? 'Cargando...' : (isRegister ? 'Crear Cuenta' : 'Iniciar Sesión') }}
              </ion-button>
            </form>

            <!-- Divider -->
            <div class="divider">
              <span>o continúa con</span>
            </div>

            <!-- Social Login -->
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

      <!-- Toast for errors -->
      <ion-toast
        [isOpen]="showToast"
        [message]="toastMessage"
        duration="3000"
        position="top"
        color="danger"
        (didDismiss)="showToast = false">
      </ion-toast>
    </ion-content>
  `,
  styles: [`
    .auth-content {
      --background: linear-gradient(135deg, var(--ion-color-primary) 0%, #1a1a2e 100%);
    }

    .auth-container {
      min-height: 100vh;
      padding: 2rem 1rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .logo-section {
      text-align: center;
      margin-bottom: 2rem;
      color: white;
    }

    .logo-icon {
      font-size: 3rem;
      margin-bottom: 0.5rem;
    }

    .logo-section h1 {
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
    }

    .logo-section p {
      opacity: 0.8;
      margin: 0;
    }

    .user-type-segment {
      margin-bottom: 1.5rem;
      --background: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
    }

    .auth-card {
      margin: 0;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }

    .form-toggle {
      display: flex;
      background: var(--ion-color-light);
      border-radius: 12px;
      padding: 4px;
      margin-bottom: 1.5rem;
    }

    .toggle-btn {
      flex: 1;
      background: none;
      border: none;
      padding: 12px;
      border-radius: 8px;
      font-weight: 500;
      color: var(--ion-color-medium);
      transition: all 0.3s ease;
    }

    .toggle-btn.active {
      background: var(--ion-color-primary);
      color: white;
    }

    .form-item {
      margin-bottom: 1rem;
      --border-radius: 12px;
      --background: var(--ion-color-light);
    }

    .terms-section {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 1rem 0;
    }

    .terms-label {
      font-size: 0.9rem;
      color: var(--ion-color-medium);
    }

    .terms-link {
      color: var(--ion-color-primary);
      text-decoration: none;
    }

    .submit-btn {
      margin: 1.5rem 0 1rem 0;
      --border-radius: 12px;
      height: 48px;
    }

    .divider {
      text-align: center;
      margin: 1.5rem 0;
      position: relative;
      color: var(--ion-color-medium);
    }

    .divider::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: var(--ion-color-light-shade);
    }

    .divider span {
      background: white;
      padding: 0 1rem;
    }

    .social-buttons {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .social-btn {
      --border-radius: 12px;
      height: 48px;
    }

    .google-btn {
      --border-color: #db4437;
      --color: #db4437;
    }

    .facebook-btn {
      --border-color: #3b5998;
      --color: #3b5998;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    IonContent, IonCard, IonCardContent,
    IonItem, IonLabel, IonInput, IonButton, IonIcon, IonCheckbox,
    IonSegment, IonSegmentButton, IonToast, ReactiveFormsModule, FormsModule
  ]
})
export class AuthPage {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isRegister = false;
  userType: 'client' | 'provider' = 'client';
  showPassword = false;
  isLoading = false;
  showToast = false;
  toastMessage = '';

  authForm: FormGroup;

  constructor() {
    addIcons({ logoGoogle, logoFacebook, eyeOutline, eyeOffOutline, mailOutline, lockClosedOutline, personOutline, callOutline });
    
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
          // Navigate to provider registration with form data
          this.router.navigate(['/proveedores/registro'], {
            state: {
              email: formData.email,
              password: formData.password,
              name: formData.name,
              phone: formData.phone
            }
          });
        } else {
          // Register as client
          const result = await this.authService.register(formData.email, formData.password, {
            name: formData.name,
            phone: formData.phone,
            userType: 'client'
          });
          
          this.router.navigate(['/onboarding'], { replaceUrl: true });
        }
      } else {
        // Login
        const result = await this.authService.login(formData.email, formData.password);
        
        if (result.userData.userType === 'provider') {
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
      const result = await this.authService.loginWithGoogle();
      
      if (result.isNewUser) {
        this.router.navigate(['/onboarding'], { replaceUrl: true });
      } else {
        if (result.userData.userType === 'provider') {
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
      const result = await this.authService.loginWithFacebook();
      
      if (result.isNewUser) {
        this.router.navigate(['/onboarding'], { replaceUrl: true });
      } else {
        if (result.userData.userType === 'provider') {
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