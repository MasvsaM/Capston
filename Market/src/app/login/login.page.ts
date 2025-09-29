import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

type AuthMode = 'login' | 'signup';
type UserType = 'cliente' | 'proveedor';

interface FeedbackMessage {
  type: 'success' | 'info';
  text: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  mode: AuthMode = 'login';
  showPassword = false;
  feedbackMessage: FeedbackMessage | null = null;

  readonly form = this.fb.group({
    name: [''],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    password: ['', [Validators.required, Validators.minLength(6)]],
    userType: ['cliente' as UserType, Validators.required],
  });

  constructor() {
    this.toggleSignupValidators(false);
  }

  get nameControl() {
    return this.form.controls.name;
  }

  get emailControl() {
    return this.form.controls.email;
  }

  get phoneControl() {
    return this.form.controls.phone;
  }

  get passwordControl() {
    return this.form.controls.password;
  }

  get userTypeControl() {
    return this.form.controls.userType;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, email, phone, password, userType } = this.form.getRawValue();
    if (!email || !password || !userType) {
      return;
    }

    if (this.mode === 'login') {
      console.log('Login con:', email, password, userType);
      this.feedbackMessage = {
        type: 'success',
        text: `¡Bienvenido de vuelta, ${email.split('@')[0]}!`,
      };

      void this.router.navigate([
        userType === 'cliente' ? '/perfil-cliente' : '/perfil-proveedor',
      ]);
      return;
    }

    console.log('Registro con:', { name, email, phone, password, userType });
    this.feedbackMessage = {
      type: 'success',
      text:
        userType === 'cliente'
          ? 'Cuenta de cliente creada con éxito. Redirigiendo a tu perfil...'
          : 'Cuenta de proveedor creada. Prepara tu perfil profesional!',
    };

    setTimeout(() => {
      void this.router.navigate([
        userType === 'cliente' ? '/perfil-cliente' : '/perfil-proveedor',
      ]);
    }, 600);
  }

  switchMode(mode: AuthMode): void {
    if (this.mode === mode) {
      return;
    }

    this.mode = mode;
    this.feedbackMessage = null;
    this.toggleSignupValidators(mode === 'signup');
    this.form.reset({
      name: '',
      email: '',
      phone: '',
      password: '',
      userType: 'cliente',
    });
  }

  onUserTypeChange(type: unknown): void {
    if (type !== 'cliente' && type !== 'proveedor') {
      return;
    }
    this.userTypeControl.setValue(type);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onForgotPassword(): void {
    this.feedbackMessage = {
      type: 'info',
      text: 'Te enviaremos instrucciones para recuperar tu contraseña.',
    };
    void this.router.navigate(['/auth/forgot-password']);
  }

  onSocialLogin(provider: 'google' | 'facebook'): void {
    console.log('Login social con:', provider);
    this.feedbackMessage = {
      type: 'info',
      text: `Funcionalidad de login con ${
        provider === 'google' ? 'Google' : 'Facebook'
      } próximamente.`,
    };
  }

  private toggleSignupValidators(isSignup: boolean): void {
    if (isSignup) {
      this.nameControl.setValidators([Validators.required, Validators.minLength(3)]);
      this.phoneControl.setValidators([
        Validators.required,
        Validators.pattern(/^[+\d][\d\s-]{7,}$/),
      ]);
    } else {
      this.nameControl.clearValidators();
      this.phoneControl.clearValidators();
    }

    this.nameControl.updateValueAndValidity();
    this.phoneControl.updateValueAndValidity();
  }
}
