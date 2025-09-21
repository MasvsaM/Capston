import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    role: ['cliente', Validators.required], // default: cliente
  });

  constructor(private fb: FormBuilder, private router: Router) {}

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password, role } = this.loginForm.value;
      console.log('Login con:', email, password, role);

      // Aquí iría la validación real con el backend
      // Suponemos login correcto, redirigimos según rol
      if (role === 'cliente') {
        this.router.navigate(['/perfil-cliente']);
      } else if (role === 'proveedor') {
        this.router.navigate(['/perfil-proveedor']);
      }
    }
  }
}

