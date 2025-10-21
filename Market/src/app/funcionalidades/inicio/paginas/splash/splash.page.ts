import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { ServicioAutenticacion } from '@nucleo/firebase';

@Component({
  selector: 'app-splash',
  template: `
    <ion-content class="splash-content">
      <div class="splash-container">
        <div class="logo-container fade-in">
          <div class="logo">
            <div class="logo-icon">🐾</div>
            <h1 class="logo-text">MarketPet</h1>
          </div>
          <p class="tagline">Conectando mascotas con servicios especializados</p>
        </div>
        
        <div class="loading-container">
          <div class="loading-dots">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    .splash-content {
      --background: linear-gradient(135deg, var(--ion-color-primary) 0%, #1a1a2e 100%);
    }

    .splash-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100vh;
      padding: 2rem;
      text-align: center;
    }

    .logo-container {
      margin-bottom: 4rem;
    }

    .logo {
      margin-bottom: 1rem;
    }

    .logo-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      animation: bounce 2s infinite;
    }

    .logo-text {
      font-size: 2.5rem;
      font-weight: 700;
      color: white;
      margin: 0;
      letter-spacing: -0.02em;
    }

    .tagline {
      font-size: 1rem;
      color: rgba(255, 255, 255, 0.8);
      margin: 0;
      max-width: 280px;
    }

    .loading-container {
      position: absolute;
      bottom: 4rem;
      left: 50%;
      transform: translateX(-50%);
    }

    .loading-dots {
      display: flex;
      gap: 0.5rem;
    }

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.6);
      animation: pulse 1.5s infinite ease-in-out;
    }

    .dot:nth-child(1) { animation-delay: 0s; }
    .dot:nth-child(2) { animation-delay: 0.2s; }
    .dot:nth-child(3) { animation-delay: 0.4s; }

    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-20px);
      }
      60% {
        transform: translateY(-10px);
      }
    }

    @keyframes pulse {
      0%, 80%, 100% {
        transform: scale(0);
        opacity: 0.5;
      }
      40% {
        transform: scale(1);
        opacity: 1;
      }
    }

    .fade-in {
      animation: fadeIn 1s ease-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `],
  standalone: true,
  imports: [IonContent]
})
export class SplashPage implements OnInit {
  private router = inject(Router);
  private servicioAutenticacion = inject(ServicioAutenticacion);

  ngOnInit() {
    // Wait for 3 seconds then check authentication
    setTimeout(() => {
      this.checkAuthAndNavigate();
    }, 3000);
  }

  private checkAuthAndNavigate() {
    this.servicioAutenticacion.estadoAutenticacion$.subscribe(user => {
      if (user) {
        // User is authenticated, get user data and navigate accordingly
        this.servicioAutenticacion.usuarioActual$.subscribe(userData => {
          if (userData) {
            if (userData.userType === 'provider') {
              this.router.navigate(['/proveedores/panel'], { replaceUrl: true });
            } else {
              this.router.navigate(['/tabs/mascotas'], { replaceUrl: true });
            }
          }
        });
      } else {
        // Not authenticated, go to auth page
        this.router.navigate(['/autenticacion'], { replaceUrl: true });
      }
    });
  }
}