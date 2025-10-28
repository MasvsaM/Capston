import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent,
  IonButton, IonIcon, IonList, IonItem, IonLabel, IonChip, IonBadge
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  checkmarkOutline,
  chatbubblesOutline,
  peopleCircleOutline,
  rocketOutline,
  shieldCheckmarkOutline,
  starOutline,
  bulbOutline,
  flameOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-subscription',
  template: `
    <ion-content class="subscription-content">
      <ion-header class="marketpet-header floating">
        <ion-toolbar>
          <ion-title>MarketPet Premium</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="content-wrapper">
        <section class="hero-section">
          <div class="hero-badge">Experiencia ilimitada</div>
          <h1>Un solo plan premium para todo lo que tu mascota necesita</h1>
          <p>
            Accede a herramientas exclusivas para la comunidad, conversación y bienestar de tus mascotas.
            Todo está incluido en una única suscripción fácil de entender.
          </p>

          <div class="hero-highlights">
            <ion-chip color="light">
              <ion-icon name="chatbubbles-outline"></ion-icon>
              <ion-label>Foros ilimitados</ion-label>
            </ion-chip>
            <ion-chip color="light">
              <ion-icon name="bulb-outline"></ion-icon>
              <ion-label>Asistente IA (muy pronto)</ion-label>
            </ion-chip>
            <ion-chip color="light">
              <ion-icon name="shield-checkmark-outline"></ion-icon>
              <ion-label>Beneficios exclusivos</ion-label>
            </ion-chip>
          </div>
        </section>

        <section class="premium-card-section">
          <ion-card class="premium-card">
            <ion-card-content>
              <div class="plan-header">
                <div>
                  <h2>Premium</h2>
                  <span class="plan-subtitle">Un solo plan, todas las funciones avanzadas</span>
                </div>
                <div class="plan-price">
                  <span class="price">$9.990</span>
                  <span class="period">/mes</span>
                </div>
              </div>

              <ion-list class="features-list">
                <ion-item *ngFor="let feature of premiumFeatures">
                  <ion-icon name="checkmark-outline" slot="start" color="success"></ion-icon>
                  <ion-label>{{ feature }}</ion-label>
                </ion-item>
              </ion-list>

              <ion-button expand="block" class="subscribe-btn" (click)="irATienda()">Quiero ser Premium</ion-button>
            </ion-card-content>
          </ion-card>
        </section>

        <section class="benefits-section">
          <h3>Lo que hace diferente a MarketPet Premium</h3>

          <div class="benefits-grid">
            <ion-card *ngFor="let highlight of premiumHighlights" class="benefit-card">
              <ion-card-content>
                <div class="benefit-icon">
                  <ion-icon [name]="highlight.icon"></ion-icon>
                </div>
                <h4>{{ highlight.title }}</h4>
                <p>{{ highlight.description }}</p>
              </ion-card-content>
            </ion-card>
          </div>
        </section>

        <section class="premium-preview-section">
          <div class="preview-header">
            <div>
              <h3>Vista previa de la cuenta Premium</h3>
              <p class="preview-description">
                Así se verá tu comunidad cuando actives la suscripción: foros moderados, métricas claras y beneficios desbloqueados automáticamente tras el pago en Webpay.
              </p>
            </div>
            <ion-button color="light" fill="outline" (click)="irATienda()">
              Ir a la tienda y activar
            </ion-button>
          </div>

          <div class="preview-grid">
            <ion-card *ngFor="let foro of forosDestacados" class="forum-card">
              <ion-card-content>
                <div class="forum-header">
                  <div class="forum-icon">
                    <ion-icon [name]="foro.icono"></ion-icon>
                  </div>
                  <ion-badge color="tertiary">{{ foro.miembros }} miembros</ion-badge>
                </div>
                <h4>{{ foro.titulo }}</h4>
                <p>{{ foro.descripcion }}</p>

                <div class="forum-stats">
                  <ion-chip color="light">
                    <ion-icon name="chatbubbles-outline"></ion-icon>
                    <ion-label>{{ foro.nuevosHilos }} hilos nuevos</ion-label>
                  </ion-chip>
                  <ion-chip color="light">
                    <ion-icon name="flame-outline"></ion-icon>
                    <ion-label>Tendencia</ion-label>
                  </ion-chip>
                </div>

                <div class="forum-topics">
                  <span *ngFor="let tema of foro.temasDestacados">#{{ tema }}</span>
                </div>
              </ion-card-content>
            </ion-card>

            <ion-card class="premium-dashboard-card">
              <ion-card-content>
                <h4>Panel Premium listo</h4>
                <p>
                  Visualiza métricas clave y beneficios que se habilitan automáticamente después del pago. Todo queda conectado con tu suscripción.
                </p>

                <ion-list lines="none">
                  <ion-item *ngFor="let metrica of metricasPremium">
                    <ion-badge [color]="metrica.color">{{ metrica.valor }}</ion-badge>
                    <ion-label>
                      <h5>{{ metrica.titulo }}</h5>
                      <p>{{ metrica.descripcion }}</p>
                    </ion-label>
                  </ion-item>
                </ion-list>

                <div class="dashboard-footer">
                  <ion-button size="small" fill="outline" color="light" (click)="irATienda()">
                    Activar en Webpay
                  </ion-button>
                  <ion-button size="small" color="light">
                    Ver foros en vivo
                  </ion-button>
                </div>
              </ion-card-content>
            </ion-card>
          </div>
        </section>

        <section class="cta-section">
          <ion-card class="cta-card">
            <ion-card-content>
              <div>
                <h3>¿Listo para conocer la comunidad?</h3>
                <p>
                  Actualiza tu cuenta para participar en foros temáticos, crear tus propios espacios y ser de los primeros
                  en conversar con nuestra futura IA para el cuidado integral de tu mascota.
                </p>
              </div>
              <ion-button color="light" fill="outline">Hablar con nosotros</ion-button>
            </ion-card-content>
          </ion-card>
        </section>
      </div>
    </ion-content>
  `,
  styles: [`
    .subscription-content {
      --background: linear-gradient(180deg, rgba(30, 35, 64, 1) 0%, rgba(42, 115, 152, 1) 100%);
    }

    .floating {
      --background: transparent;
      backdrop-filter: blur(12px);
      background: rgba(17, 19, 35, 0.4);
    }

    .floating ion-toolbar {
      --background: transparent;
      --color: #fff;
      --border-color: transparent;
    }

    .content-wrapper {
      padding: 5.5rem 1.5rem 3rem;
      display: flex;
      flex-direction: column;
      gap: 2.5rem;
    }

    .hero-section {
      color: #fff;
      max-width: 640px;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .hero-section h1 {
      font-size: 2.4rem;
      font-weight: 700;
      line-height: 1.2;
      margin: 0;
    }

    .hero-section p {
      margin: 0;
      opacity: 0.85;
      font-size: 1rem;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(255, 255, 255, 0.12);
      padding: 0.4rem 1rem;
      border-radius: 999px;
      font-size: 0.85rem;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .hero-highlights {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .hero-highlights ion-chip {
      --background: rgba(255, 255, 255, 0.16);
      --color: #fff;
      backdrop-filter: blur(10px);
    }

    .hero-highlights ion-icon {
      margin-right: 0.35rem;
    }

    .premium-card-section {
      display: flex;
      justify-content: center;
    }

    .premium-card {
      width: min(640px, 100%);
      border-radius: 28px;
      background: #0f182f;
      color: #fff;
      box-shadow: 0 20px 60px rgba(7, 17, 43, 0.4);
    }

    .premium-card ion-card-content {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .plan-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .plan-header h2 {
      margin: 0;
      font-size: 2rem;
      font-weight: 700;
    }

    .plan-subtitle {
      display: block;
      font-size: 0.95rem;
      opacity: 0.7;
    }

    .plan-price {
      display: flex;
      align-items: baseline;
      gap: 0.35rem;
    }

    .price {
      font-size: 2.6rem;
      font-weight: 700;
      color: #53d0ff;
      line-height: 1;
    }

    .period {
      font-size: 1rem;
      opacity: 0.7;
    }

    .features-list {
      background: rgba(255, 255, 255, 0.04);
      border-radius: 20px;
      padding: 0.5rem 0;
    }

    .features-list ion-item {
      --background: transparent;
      --border-color: transparent;
      --padding-start: 1rem;
      --inner-padding-end: 1rem;
      color: rgba(255, 255, 255, 0.9);
      font-size: 0.95rem;
    }

    .features-list ion-icon {
      margin-right: 0.75rem;
    }

    .subscribe-btn {
      --border-radius: 16px;
      --background: linear-gradient(135deg, #53d0ff 0%, #4f6dff 100%);
      font-weight: 600;
    }

    .benefits-section {
      color: #fff;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .benefits-section h3 {
      margin: 0;
      font-size: 1.5rem;
    }

    .benefits-grid {
      display: grid;
      gap: 1.5rem;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    }

    .benefit-card {
      border-radius: 20px;
      background: rgba(17, 22, 42, 0.7);
      color: #fff;
      backdrop-filter: blur(12px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }

    .benefit-card ion-card-content {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .benefit-icon {
      width: 48px;
      height: 48px;
      border-radius: 16px;
      background: rgba(83, 208, 255, 0.15);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #53d0ff;
      font-size: 1.4rem;
    }

    .benefit-card h4 {
      margin: 0;
      font-size: 1.15rem;
    }

    .benefit-card p {
      margin: 0;
      opacity: 0.75;
      font-size: 0.95rem;
    }

    .premium-preview-section {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      color: #fff;
    }

    .preview-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    .preview-description {
      margin: 0.35rem 0 0;
      opacity: 0.8;
    }

    .preview-grid {
      display: grid;
      gap: 1.5rem;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    }

    .forum-card,
    .premium-dashboard-card {
      border-radius: 24px;
      background: rgba(17, 22, 42, 0.72);
      backdrop-filter: blur(12px);
      box-shadow: 0 18px 40px rgba(10, 22, 45, 0.35);
    }

    .forum-card ion-card-content,
    .premium-dashboard-card ion-card-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .forum-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .forum-icon {
      width: 48px;
      height: 48px;
      border-radius: 16px;
      background: rgba(83, 208, 255, 0.18);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #53d0ff;
      font-size: 1.4rem;
    }

    .forum-card h4,
    .premium-dashboard-card h4 {
      margin: 0;
      font-size: 1.2rem;
    }

    .forum-card p,
    .premium-dashboard-card p {
      margin: 0;
      opacity: 0.8;
      line-height: 1.4;
    }

    .forum-stats {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .forum-stats ion-chip {
      --background: rgba(255, 255, 255, 0.16);
      --color: #fff;
    }

    .forum-topics {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      opacity: 0.85;
      font-size: 0.9rem;
    }

    .forum-topics span {
      background: rgba(255, 255, 255, 0.1);
      padding: 0.35rem 0.75rem;
      border-radius: 999px;
    }

    .premium-dashboard-card ion-item {
      --background: rgba(15, 24, 47, 0.4);
      border-radius: 18px;
      margin-bottom: 0.75rem;
    }

    .dashboard-footer {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .cta-section {
      display: flex;
      justify-content: center;
    }

    .cta-card {
      width: min(720px, 100%);
      border-radius: 24px;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.06) 100%);
      color: #fff;
      backdrop-filter: blur(14px);
      box-shadow: 0 18px 40px rgba(10, 22, 45, 0.35);
    }

    .cta-card ion-card-content {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .cta-card h3 {
      margin: 0;
      font-size: 1.6rem;
    }

    .cta-card p {
      margin: 0;
      opacity: 0.8;
      font-size: 0.98rem;
    }

    .cta-card ion-button {
      align-self: flex-start;
      --border-radius: 14px;
      --color: #fff;
      --border-color: rgba(255, 255, 255, 0.5);
    }

    @media (max-width: 768px) {
      .content-wrapper {
        padding-top: 4.5rem;
      }

      .hero-section h1 {
        font-size: 2rem;
      }

      .premium-card {
        border-radius: 22px;
      }
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent,
    IonButton, IonIcon, IonList, IonItem, IonLabel, IonChip, IonBadge
  ]
})
export class SubscriptionPage {
  premiumFeatures = [
    'Crea foros temáticos para tus mascotas y comunidades locales',
    'Únete a conversaciones moderadas con tutores y especialistas',
    'Acceso anticipado a nuestro asistente inteligente (IA) para recomendaciones personalizadas',
    'Perfiles ilimitados de mascotas y seguimiento integral de salud',
    'Reservas prioritarias y descuentos exclusivos en servicios',
    'Soporte dedicado cuando lo necesites'
  ];

  premiumHighlights = [
    {
      icon: 'chatbubbles-outline',
      title: 'Foros sin límites',
      description: 'Crea espacios de conversación, modera tus propias comunidades y comparte experiencias con otros tutores.'
    },
    {
      icon: 'people-circle-outline',
      title: 'Comunidad activa',
      description: 'Descubre grupos por intereses, recibe consejos de profesionales y organiza encuentros locales.'
    },
    {
      icon: 'bulb-outline',
      title: 'IA MarketPet',
      description: 'Prepárate para recibir apoyo inteligente y personalizado para el bienestar de tus mascotas (muy pronto).'
    },
    {
      icon: 'shield-checkmark-outline',
      title: 'Tu información segura',
      description: 'Controla el acceso a tus datos y comparte sólo lo que quieras con tu comunidad de confianza.'
    },
    {
      icon: 'rocket-outline',
      title: 'Beneficios exclusivos',
      description: 'Accede a promociones especiales, descuentos en servicios aliados y novedades antes que nadie.'
    },
    {
      icon: 'star-outline',
      title: 'Experiencia Premium',
      description: 'Una única suscripción clara, sin niveles ni sorpresas. Todo el poder de MarketPet en un solo plan.'
    }
  ];

  forosDestacados = [
    {
      icono: 'chatbubbles-outline',
      titulo: 'Círculo de bienestar y nutrición',
      descripcion: 'Recetas, planes alimenticios y recomendaciones de especialistas certificados.',
      miembros: '2.3K',
      nuevosHilos: 14,
      temasDestacados: ['RecetasNaturales', 'SuplementosSeguros', 'PlanBarf'],
    },
    {
      icono: 'shield-checkmark-outline',
      titulo: 'Soporte veterinario Premium',
      descripcion: 'Casos clínicos, seguimiento de tratamientos y respuestas priorizadas.',
      miembros: '1.1K',
      nuevosHilos: 9,
      temasDestacados: ['CuidadoSenior', 'Rehabilitacion', 'Telemedicina'],
    },
  ];

  metricasPremium = [
    {
      titulo: 'Participación semanal',
      valor: '92%',
      descripcion: 'Miembros activos dentro de los últimos 7 días.',
      color: 'success',
    },
    {
      titulo: 'Nuevos foros creados',
      valor: '+18',
      descripcion: 'Espacios premium lanzados este mes.',
      color: 'tertiary',
    },
    {
      titulo: 'Beneficios utilizados',
      valor: '74%',
      descripcion: 'Promociones y cupones aplicados tras el pago.',
      color: 'warning',
    },
  ];

  private readonly router = inject(Router);

  constructor() {
    addIcons({
      checkmarkOutline,
      chatbubblesOutline,
      peopleCircleOutline,
      rocketOutline,
      shieldCheckmarkOutline,
      starOutline,
      bulbOutline,
      flameOutline
    });
  }

  irATienda(): void {
    void this.router.navigate(['/tienda']);
  }
}
