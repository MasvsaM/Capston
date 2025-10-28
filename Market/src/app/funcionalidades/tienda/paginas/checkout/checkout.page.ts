import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonChip,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  bagHandleOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  documentTextOutline,
  informationCircleOutline,
  shieldCheckmarkOutline,
  syncOutline,
} from 'ionicons/icons';
import { Observable, Subscription, firstValueFrom } from 'rxjs';
import { EstadoWebpay, HistorialWebpay, PasoWebpay, TransaccionWebpay } from '@compartido/modelos';
import { WebpayService } from '@compartido/servicios/webpay.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  template: `
    <ion-content class="checkout-content">
      <ion-header class="floating-header safe-area-top">
        <ion-toolbar>
          <ion-title>Pago con Webpay</ion-title>
        </ion-toolbar>
      </ion-header>

      <ng-container *ngIf="transaccion() as transaccion; else sinTransaccion">
        <div class="checkout-wrapper">
          <section class="status-section">
            <ion-chip [color]="colorEstado(transaccion.estado)">
              <ion-icon [name]="iconoEstado(transaccion.estado)" slot="start"></ion-icon>
              <ion-label>{{ etiquetaEstado(transaccion.estado) }}</ion-label>
            </ion-chip>
            <h1>Simulación Webpay lista para presentar</h1>
            <p>
              Gestiona cada paso igual que en producción: inicializa la transacción, redirige a Webpay, autoriza el pago y confirma la compra.
            </p>
            <div class="transaction-meta">
              <span><strong>ID:</strong> {{ transaccion.id }}</span>
              <span><strong>Token:</strong> {{ tokenReducido(transaccion.token) }}</span>
              <span><strong>URL Webpay:</strong> {{ transaccion.url }}</span>
            </div>
          </section>

          <section class="summary-section">
            <ion-grid>
              <ion-row>
                <ion-col size="12" sizeLg="7">
                  <ion-card class="order-card">
                    <ion-card-content>
                      <h2>Resumen del pedido</h2>
                      <p class="buyer-data">Comprador: {{ transaccion.orden.comprador.nombre }} · {{ transaccion.orden.comprador.email }}</p>

                      <ion-list lines="none" class="items-list">
                        <ion-item *ngFor="let item of transaccion.orden.items">
                          <ion-icon name="bag-handle-outline" slot="start"></ion-icon>
                          <ion-label>
                            <h3>{{ item.producto.nombre }}</h3>
                            <p>{{ item.cantidad }} x {{ item.producto.precio | currency:'CLP':'symbol-narrow':'1.0-0' }}</p>
                          </ion-label>
                          <ion-badge color="primary">{{ (item.producto.precio * item.cantidad) | currency:'CLP':'symbol-narrow':'1.0-0' }}</ion-badge>
                        </ion-item>
                      </ion-list>

                      <div class="totals">
                        <div class="totals-row">
                          <span>Subtotal</span>
                          <strong>{{ transaccion.orden.subtotal | currency:'CLP':'symbol-narrow':'1.0-0' }}</strong>
                        </div>
                        <div class="totals-row">
                          <span>Envío</span>
                          <strong>{{ transaccion.orden.envio | currency:'CLP':'symbol-narrow':'1.0-0' }}</strong>
                        </div>
                        <div class="totals-row total">
                          <span>Total</span>
                          <strong>{{ transaccion.orden.total | currency:'CLP':'symbol-narrow':'1.0-0' }}</strong>
                        </div>
                      </div>
                    </ion-card-content>
                  </ion-card>
                </ion-col>

                <ion-col size="12" sizeLg="5">
                  <ion-card class="actions-card">
                    <ion-card-content>
                      <h2>Paso actual: {{ descripcionPaso(transaccion.pasoActual) }}</h2>
                      <p>
                        Usa los botones para avanzar por el flujo real de Webpay. Cada acción actualiza el historial, perfecto para demos y pruebas funcionales.
                      </p>

                      <div class="actions-stack">
                        <ion-button
                          expand="block"
                          color="primary"
                          [disabled]="procesando() || transaccion.pasoActual !== 'order'"
                          (click)="ejecutarInicializacion()"
                        >
                          Inicializar con Transbank
                        </ion-button>

                        <ion-button
                          expand="block"
                          color="secondary"
                          fill="outline"
                          [disabled]="procesando() || transaccion.pasoActual !== 'init'"
                          (click)="ejecutarRedireccion()"
                        >
                          Redirigir a Webpay
                        </ion-button>

                        <div class="payment-actions">
                          <ion-button
                            expand="block"
                            color="success"
                            [disabled]="procesando() || transaccion.pasoActual !== 'redirect'"
                            (click)="autorizar(true)"
                          >
                            Simular pago exitoso
                          </ion-button>
                          <ion-button
                            expand="block"
                            color="danger"
                            fill="outline"
                            [disabled]="procesando() || transaccion.pasoActual !== 'redirect'"
                            (click)="autorizar(false)"
                          >
                            Simular pago rechazado
                          </ion-button>
                        </div>

                        <ion-button
                          expand="block"
                          color="tertiary"
                          [disabled]="procesando() || transaccion.pasoActual !== 'payment'"
                          (click)="finalizar()"
                        >
                          Finalizar pedido en MarketPet
                        </ion-button>
                      </div>

                      <ion-button
                        expand="block"
                        fill="clear"
                        color="medium"
                        (click)="volverATienda()"
                      >
                        Volver a la tienda
                      </ion-button>
                    </ion-card-content>
                  </ion-card>
                </ion-col>
              </ion-row>
            </ion-grid>
          </section>

          <section class="steps-section">
            <h2>Flujo Webpay paso a paso</h2>
            <div class="steps-grid">
              <div
                *ngFor="let paso of pasos; let i = index"
                class="step-card"
                [class.active-step]="pasoActivo(paso.id, transaccion)"
                [class.completed-step]="pasoCompletado(paso.id, transaccion)"
              >
                <div class="step-index">{{ i + 1 }}</div>
                <div class="step-body">
                  <h3>{{ paso.titulo }}</h3>
                  <p>{{ paso.descripcion }}</p>
                </div>
              </div>
            </div>
          </section>

          <section class="history-section">
            <ion-card class="history-card">
              <ion-card-content>
                <div class="history-header">
                  <h2>Historial en tiempo real</h2>
                  <ion-chip color="light">
                    <ion-icon name="document-text-outline"></ion-icon>
                    <ion-label>{{ transaccion.historial.length }} eventos</ion-label>
                  </ion-chip>
                </div>
                <ion-list lines="none">
                  <ion-item *ngFor="let evento of historialOrdenado(transaccion.historial)">
                    <ion-icon [name]="iconoEstado(evento.estado)" slot="start"></ion-icon>
                    <ion-label>
                      <h3>{{ descripcionPaso(evento.paso) }}</h3>
                      <p>{{ evento.mensaje }}</p>
                    </ion-label>
                    <ion-text color="medium">{{ evento.timestamp | date:'shortTime' }}</ion-text>
                  </ion-item>
                </ion-list>
              </ion-card-content>
            </ion-card>
          </section>
        </div>
      </ng-container>

      <ng-template #sinTransaccion>
        <div class="empty-state">
          <ion-icon name="information-circle-outline"></ion-icon>
          <h2>No hay una transacción activa</h2>
          <p>Vuelve a la tienda para seleccionar productos y comenzar el flujo de Webpay.</p>
          <ion-button (click)="volverATienda()">Ir a la tienda</ion-button>
        </div>
      </ng-template>
    </ion-content>
  `,
  styles: [
    `
      .checkout-content {
        --background: linear-gradient(180deg, #0f182f 0%, #1f3b6d 40%, #f5fbff 100%);
        color: #0f182f;
      }

      .floating-header {
        --background: transparent;
        backdrop-filter: blur(12px);
      }

      .floating-header ion-toolbar {
        --background: rgba(15, 24, 47, 0.65);
        --border-color: transparent;
        --color: #fff;
      }

      .checkout-wrapper {
        padding: 5.5rem 1.5rem 3rem;
        display: flex;
        flex-direction: column;
        gap: 2.5rem;
        max-width: 1100px;
        margin: 0 auto;
      }

      .status-section {
        text-align: left;
        color: #fff;
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .status-section ion-chip {
        width: fit-content;
        --background: rgba(255, 255, 255, 0.16);
        --color: #fff;
      }

      .status-section h1 {
        margin: 0;
        font-size: clamp(2.1rem, 4vw, 3rem);
      }

      .status-section p {
        margin: 0;
        opacity: 0.85;
        line-height: 1.6;
      }

      .transaction-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        font-size: 0.95rem;
        opacity: 0.85;
      }

      .summary-section ion-card {
        border-radius: 24px;
        box-shadow: 0 20px 50px rgba(15, 24, 47, 0.18);
      }

      .order-card ion-card-content {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
      }

      .buyer-data {
        margin: 0;
        color: #3c4a67;
      }

      .items-list ion-item {
        --background: rgba(245, 251, 255, 0.9);
        border-radius: 18px;
        margin-bottom: 0.75rem;
      }

      .items-list ion-icon {
        color: var(--ion-color-primary);
      }

      .totals {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .totals-row {
        display: flex;
        justify-content: space-between;
        color: #0f182f;
      }

      .totals-row.total {
        font-size: 1.1rem;
        font-weight: 600;
      }

      .actions-card ion-card-content {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
      }

      .actions-stack {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .payment-actions {
        display: flex;
        gap: 0.75rem;
        flex-direction: column;
      }

      .steps-section {
        background: rgba(255, 255, 255, 0.86);
        border-radius: 28px;
        padding: 2rem;
        box-shadow: 0 18px 45px rgba(15, 24, 47, 0.18);
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .steps-grid {
        display: grid;
        gap: 1.25rem;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      }

      .step-card {
        background: rgba(255, 255, 255, 0.65);
        border-radius: 20px;
        padding: 1.25rem;
        display: flex;
        gap: 1rem;
        align-items: flex-start;
        border: 1px solid rgba(15, 24, 47, 0.08);
        transition: transform 0.3s ease;
      }

      .step-card.active-step {
        border-color: var(--ion-color-primary);
        box-shadow: 0 16px 30px rgba(83, 208, 255, 0.25);
        transform: translateY(-4px);
      }

      .step-card.completed-step {
        background: linear-gradient(135deg, rgba(83, 208, 255, 0.18) 0%, rgba(255, 255, 255, 0.9) 100%);
      }

      .step-index {
        width: 36px;
        height: 36px;
        border-radius: 12px;
        background: rgba(15, 24, 47, 0.08);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        color: #0f182f;
      }

      .step-card.completed-step .step-index {
        background: var(--ion-color-primary);
        color: #fff;
      }

      .history-card {
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.92);
        box-shadow: 0 18px 45px rgba(15, 24, 47, 0.18);
      }

      .history-card ion-card-content {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
      }

      .history-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .history-card ion-item {
        --background: rgba(245, 251, 255, 0.8);
        border-radius: 18px;
        margin-bottom: 0.75rem;
      }

      .history-card ion-icon {
        color: var(--ion-color-primary);
      }

      .empty-state {
        padding: 5rem 1.5rem;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        color: #fff;
      }

      .empty-state ion-icon {
        font-size: 3rem;
      }

      @media (min-width: 768px) {
        .payment-actions {
          flex-direction: row;
        }
      }

      @media (max-width: 768px) {
        .checkout-wrapper {
          padding-top: 4.5rem;
        }
      }
    `,
  ],
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonChip,
    IonIcon,
    IonCard,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonBadge,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonText,
  ],
})
export class CheckoutPage implements OnInit, OnDestroy {
  private readonly webpayService = inject(WebpayService);
  private readonly router = inject(Router);

  readonly procesando = signal(false);
  readonly transaccion = signal<TransaccionWebpay | null>(null);

  private transaccionSub?: Subscription;

  readonly pasos: { id: PasoWebpay; titulo: string; descripcion: string }[] = [
    {
      id: 'order',
      titulo: 'Resumen del pedido',
      descripcion: 'Se construye la orden con los productos y datos del comprador.',
    },
    {
      id: 'init',
      titulo: 'Inicialización Webpay',
      descripcion: 'Se crea la transacción y se obtiene el token firmado de Transbank.',
    },
    {
      id: 'redirect',
      titulo: 'Redirección segura',
      descripcion: 'El usuario completa los datos de pago en la plataforma Webpay.',
    },
    {
      id: 'payment',
      titulo: 'Respuesta del emisor',
      descripcion: 'El banco autoriza o rechaza el pago y Webpay envía la respuesta.',
    },
    {
      id: 'result',
      titulo: 'Confirmación en MarketPet',
      descripcion: 'Se valida el resultado y se liberan los beneficios Premium.',
    },
  ];

  private readonly ordenPasos: PasoWebpay[] = ['order', 'init', 'redirect', 'payment', 'result'];

  constructor() {
    addIcons({
      shieldCheckmarkOutline,
      bagHandleOutline,
      syncOutline,
      checkmarkCircleOutline,
      closeCircleOutline,
      documentTextOutline,
      informationCircleOutline,
    });
  }

  async ngOnInit(): Promise<void> {
    const transaccion = await firstValueFrom(this.webpayService.obtenerTransaccion());
    if (!transaccion) {
      await this.router.navigate(['/tienda']);
      return;
    }
    this.transaccion.set(transaccion);
    this.transaccionSub = this.webpayService.obtenerTransaccion().subscribe(tx => {
      this.transaccion.set(tx);
    });
  }

  ngOnDestroy(): void {
    this.transaccionSub?.unsubscribe();
  }

  colorEstado(estado: EstadoWebpay): string {
    switch (estado) {
      case 'processing':
        return 'warning';
      case 'authorized':
      case 'completed':
        return 'success';
      case 'failed':
        return 'danger';
      default:
        return 'medium';
    }
  }

  iconoEstado(estado: EstadoWebpay): string {
    switch (estado) {
      case 'processing':
        return 'sync-outline';
      case 'authorized':
      case 'completed':
        return 'checkmark-circle-outline';
      case 'failed':
        return 'close-circle-outline';
      default:
        return 'shield-checkmark-outline';
    }
  }

  etiquetaEstado(estado: EstadoWebpay): string {
    switch (estado) {
      case 'processing':
        return 'Procesando con Webpay';
      case 'authorized':
        return 'Pago autorizado';
      case 'completed':
        return 'Transacción completada';
      case 'failed':
        return 'Transacción fallida';
      default:
        return 'Orden creada';
    }
  }

  descripcionPaso(paso: PasoWebpay): string {
    const descriptor = this.pasos.find(p => p.id === paso);
    return descriptor ? descriptor.titulo : 'Paso desconocido';
  }

  pasoActivo(paso: PasoWebpay, transaccion: TransaccionWebpay): boolean {
    return transaccion.pasoActual === paso;
  }

  pasoCompletado(paso: PasoWebpay, transaccion: TransaccionWebpay): boolean {
    const indicePaso = this.ordenPasos.indexOf(paso);
    const indiceActual = this.ordenPasos.indexOf(transaccion.pasoActual);
    if (indicePaso === -1 || indiceActual === -1) {
      return false;
    }

    if (indiceActual > indicePaso) {
      return true;
    }

    if (indiceActual === indicePaso) {
      return transaccion.estado === 'authorized' || transaccion.estado === 'completed';
    }

    return false;
  }

  historialOrdenado(historial: HistorialWebpay[]): HistorialWebpay[] {
    return [...historial].reverse();
  }

  tokenReducido(token: string): string {
    return `${token.substring(0, 6)}…${token.substring(token.length - 4)}`;
  }

  async ejecutarInicializacion(): Promise<void> {
    await this.ejecutarPaso(() => this.webpayService.inicializarWebpay());
  }

  async ejecutarRedireccion(): Promise<void> {
    await this.ejecutarPaso(() => this.webpayService.redirigirAWebpay());
  }

  async autorizar(exito: boolean): Promise<void> {
    await this.ejecutarPaso(() => this.webpayService.autorizarPago(exito));
  }

  async finalizar(): Promise<void> {
    await this.ejecutarPaso(() => this.webpayService.finalizarTransaccion());
  }

  async volverATienda(): Promise<void> {
    this.webpayService.reiniciar();
    await this.router.navigate(['/tienda']);
  }

  private async ejecutarPaso(accion: () => Observable<TransaccionWebpay>): Promise<void> {
    if (this.procesando()) {
      return;
    }

    this.procesando.set(true);
    try {
      await firstValueFrom(accion());
    } catch (error) {
      console.error('Error al ejecutar paso Webpay', error);
    } finally {
      this.procesando.set(false);
    }
  }
}
