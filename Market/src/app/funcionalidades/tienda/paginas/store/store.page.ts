import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  bagHandle,
  bagHandleOutline,
  cardOutline,
  checkmarkCircle,
  peopleOutline,
  shieldCheckmarkOutline,
  storefrontOutline,
} from 'ionicons/icons';
import { firstValueFrom } from 'rxjs';
import { ItemCarrito, OrdenWebpay, Producto } from '@compartido/modelos';
import { WebpayService } from '@compartido/servicios/webpay.service';

@Component({
  selector: 'app-store',
  standalone: true,
  template: `
    <ion-content class="store-content">
      <ion-header class="floating-header safe-area-top">
        <ion-toolbar>
          <ion-title>MarketPet Store</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="store-wrapper">
        <section class="store-hero">
          <div class="hero-copy">
            <h1>Insumos premium y experiencias exclusivas para tus mascotas</h1>
            <p>
              Arma tu carrito con productos seleccionados y descubre cómo se integra el flujo de pago seguro con Webpay.
              Este demo muestra el recorrido completo que vivirán tus clientes dentro de MarketPet.
            </p>
            <div class="hero-highlights">
              <ion-chip color="light" (click)="seleccionarCategoria('Todos')" [class.active-chip]="categoriaSeleccionada() === 'Todos'">
                <ion-icon name="storefront-outline"></ion-icon>
                <ion-label>Tienda integral</ion-label>
              </ion-chip>
              <ion-chip color="light">
                <ion-icon name="shield-checkmark-outline"></ion-icon>
                <ion-label>Pagos Webpay</ion-label>
              </ion-chip>
              <ion-chip color="light">
                <ion-icon name="people-outline"></ion-icon>
                <ion-label>Cuenta Premium conectada</ion-label>
              </ion-chip>
            </div>
          </div>
          <div class="hero-summary">
            <ion-card class="cart-card">
              <ion-card-content>
                <div class="cart-header">
                  <div>
                    <h2>Tu carrito</h2>
                    <p>Resumen dinámico antes de pagar con Webpay.</p>
                  </div>
                  <ion-icon name="bag-handle"></ion-icon>
                </div>

                <ng-container *ngIf="carrito().length; else emptyCart">
                  <ion-list lines="none" class="cart-list">
                    <ion-item *ngFor="let item of carrito()">
                      <div class="item-details">
                        <strong>{{ item.producto.nombre }}</strong>
                        <span>{{ item.cantidad }} x {{ item.producto.precio | currency:'CLP':'symbol-narrow':'1.0-0' }}</span>
                      </div>
                      <div class="item-actions">
                        <ion-button fill="clear" size="small" (click)="disminuirCantidad(item.producto)">-</ion-button>
                        <ion-badge color="primary">{{ item.cantidad }}</ion-badge>
                        <ion-button fill="clear" size="small" (click)="agregarAlCarrito(item.producto)">+</ion-button>
                      </div>
                    </ion-item>
                  </ion-list>

                  <div class="cart-totals">
                    <div class="totals-row">
                      <span>Subtotal</span>
                      <strong>{{ subtotal() | currency:'CLP':'symbol-narrow':'1.0-0' }}</strong>
                    </div>
                    <div class="totals-row">
                      <span>Envío</span>
                      <strong>{{ costoEnvio() | currency:'CLP':'symbol-narrow':'1.0-0' }}</strong>
                    </div>
                    <div class="totals-row total">
                      <span>Total</span>
                      <strong>{{ total() | currency:'CLP':'symbol-narrow':'1.0-0' }}</strong>
                    </div>
                  </div>
                </ng-container>

                <ng-template #emptyCart>
                  <div class="empty-cart">
                    <ion-icon name="bag-handle-outline"></ion-icon>
                    <p>Aún no agregas productos. Explora la tienda y arma tu primer pedido.</p>
                  </div>
                </ng-template>

                <ion-list lines="none" class="buyer-form">
                  <ion-item>
                    <ion-label position="stacked">Nombre del comprador</ion-label>
                    <ion-input [(ngModel)]="comprador.nombre" placeholder="Nombre y apellido"></ion-input>
                  </ion-item>
                  <ion-item>
                    <ion-label position="stacked">Correo electrónico</ion-label>
                    <ion-input type="email" [(ngModel)]="comprador.email" placeholder="correo@ejemplo.cl"></ion-input>
                  </ion-item>
                  <ion-item>
                    <ion-label position="stacked">Teléfono</ion-label>
                    <ion-input type="tel" [(ngModel)]="comprador.telefono" placeholder="+56 9 1234 5678"></ion-input>
                  </ion-item>
                </ion-list>

                <ion-button
                  expand="block"
                  class="checkout-btn"
                  [disabled]="!carrito().length || estaProcesando()"
                  (click)="iniciarCheckout()"
                >
                  Ir a pagar con Webpay
                </ion-button>
              </ion-card-content>
            </ion-card>
          </div>
        </section>

        <section class="categories">
          <ion-chip
            *ngFor="let categoria of categorias"
            (click)="seleccionarCategoria(categoria)"
            [class.active-chip]="categoriaSeleccionada() === categoria"
          >
            <ion-label>{{ categoria }}</ion-label>
          </ion-chip>
        </section>

        <section class="products-grid">
          <ion-grid>
            <ion-row>
              <ion-col size="12" sizeMd="6" sizeLg="4" *ngFor="let producto of productosVisibles()">
                <ion-card class="product-card">
                  <div class="product-media" [style.backgroundImage]="'url(' + producto.imagen + ')'">
                    <ion-badge color="success">{{ producto.categoria }}</ion-badge>
                  </div>
                  <ion-card-content>
                    <h3>{{ producto.nombre }}</h3>
                    <p>{{ producto.descripcion }}</p>
                    <div class="product-tags">
                      <ion-chip color="light" *ngFor="let etiqueta of producto.etiquetas">
                        <ion-label>{{ etiqueta }}</ion-label>
                      </ion-chip>
                    </div>
                    <div class="product-footer">
                      <div>
                        <strong>{{ producto.precio | currency:'CLP':'symbol-narrow':'1.0-0' }}</strong>
                        <span>Stock: {{ producto.stock }}</span>
                      </div>
                      <ion-button size="small" (click)="agregarAlCarrito(producto)">
                        Agregar
                      </ion-button>
                    </div>
                  </ion-card-content>
                </ion-card>
              </ion-col>
            </ion-row>
          </ion-grid>
        </section>

        <section class="webpay-flow">
          <ion-card class="flow-card">
            <ion-card-content>
              <h3>Así se verá el flujo con Webpay</h3>
              <p>
                Toda la experiencia está diseñada para ser transparente. Desde el resumen del pedido hasta el comprobante final,
                los tutores pueden seguir cada paso del pago.
              </p>
              <ion-list lines="none">
                <ion-item>
                  <ion-icon name="shield-checkmark-outline" slot="start"></ion-icon>
                  <ion-label>
                    <h4>Inicialización segura</h4>
                    <p>Generamos el token Webpay y firmamos la orden antes de redirigir al usuario.</p>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-icon name="card-outline" slot="start"></ion-icon>
                  <ion-label>
                    <h4>Pasarela Webpay</h4>
                    <p>El cliente completa los datos en el entorno Transbank, manteniendo el comercio protegido.</p>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-icon name="checkmark-circle" slot="start"></ion-icon>
                  <ion-label>
                    <h4>Confirmación en MarketPet</h4>
                    <p>Recibimos la respuesta final y liberamos los beneficios Premium en segundos.</p>
                  </ion-label>
                </ion-item>
              </ion-list>
            </ion-card-content>
          </ion-card>
        </section>
      </div>
    </ion-content>
  `,
  styles: [
    `
      .store-content {
        --background: linear-gradient(180deg, #f5fbff 0%, #fff 100%);
      }

      .floating-header {
        --background: transparent;
        backdrop-filter: blur(12px);
      }

      .floating-header ion-toolbar {
        --background: rgba(255, 255, 255, 0.8);
        --border-color: transparent;
      }

      .store-wrapper {
        padding: 5.5rem 1.5rem 3rem;
        display: flex;
        flex-direction: column;
        gap: 2.5rem;
        max-width: 1200px;
        margin: 0 auto;
      }

      .store-hero {
        display: grid;
        gap: 2rem;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        align-items: stretch;
      }

      .hero-copy h1 {
        font-size: clamp(2.2rem, 5vw, 3rem);
        margin-bottom: 1rem;
        color: #0f182f;
      }

      .hero-copy p {
        color: #3c4a67;
        line-height: 1.6;
      }

      .hero-highlights {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        margin-top: 1.5rem;
      }

      .hero-highlights ion-chip {
        --background: rgba(15, 24, 47, 0.08);
        --color: #0f182f;
        font-weight: 500;
      }

      .hero-summary {
        display: flex;
        justify-content: center;
      }

      .cart-card {
        width: min(360px, 100%);
        border-radius: 24px;
        box-shadow: 0 18px 40px rgba(15, 24, 47, 0.12);
        background: linear-gradient(180deg, #ffffff 0%, #f3f8ff 100%);
      }

      .cart-card ion-card-content {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
      }

      .cart-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }

      .cart-header h2 {
        margin: 0;
        font-size: 1.6rem;
        color: #0f182f;
      }

      .cart-header p {
        margin: 0.35rem 0 0;
        color: #3c4a67;
      }

      .cart-header ion-icon {
        font-size: 2.2rem;
        color: var(--ion-color-primary);
      }

      .cart-list ion-item {
        --background: transparent;
        --padding-start: 0;
        --inner-padding-end: 0;
        margin-bottom: 0.5rem;
      }

      .item-details {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .item-details strong {
        color: #0f182f;
      }

      .item-details span {
        color: #3c4a67;
        font-size: 0.9rem;
      }

      .item-actions {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
      }

      .cart-totals {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        border-top: 1px solid rgba(15, 24, 47, 0.08);
        padding-top: 0.75rem;
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

      .empty-cart {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 0.75rem;
        color: #3c4a67;
        padding: 1rem 0;
      }

      .empty-cart ion-icon {
        font-size: 2rem;
        color: var(--ion-color-primary);
      }

      .buyer-form ion-item {
        --background: rgba(255, 255, 255, 0.55);
        border-radius: 16px;
        margin-bottom: 0.75rem;
      }

      .checkout-btn {
        --border-radius: 16px;
        font-weight: 600;
      }

      .categories {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
      }

      .categories ion-chip {
        --background: rgba(15, 24, 47, 0.05);
        --color: #0f182f;
        font-weight: 500;
      }

      .categories ion-chip.active-chip {
        --background: var(--ion-color-primary);
        --color: #fff;
      }

      .products-grid ion-card {
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 12px 30px rgba(15, 24, 47, 0.12);
      }

      .product-media {
        position: relative;
        padding-bottom: 62%;
        background-size: cover;
        background-position: center;
      }

      .product-media ion-badge {
        position: absolute;
        top: 12px;
        left: 12px;
        border-radius: 999px;
        padding: 0.35rem 0.75rem;
      }

      .product-card ion-card-content {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .product-card h3 {
        margin: 0;
        color: #0f182f;
      }

      .product-card p {
        margin: 0;
        color: #3c4a67;
      }

      .product-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .product-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 0.5rem;
      }

      .product-footer span {
        display: block;
        color: #607196;
        font-size: 0.85rem;
      }

      .webpay-flow .flow-card {
        border-radius: 24px;
        background: linear-gradient(135deg, rgba(83, 208, 255, 0.15) 0%, rgba(255, 255, 255, 0.85) 100%);
      }

      .webpay-flow ion-card-content {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
      }

      .webpay-flow h3 {
        margin: 0;
        color: #0f182f;
      }

      .webpay-flow ion-item {
        --background: rgba(255, 255, 255, 0.6);
        border-radius: 18px;
        margin-bottom: 0.75rem;
      }

      .webpay-flow ion-icon {
        color: var(--ion-color-primary);
        font-size: 1.6rem;
      }

      @media (max-width: 768px) {
        .store-wrapper {
          padding-top: 4.5rem;
        }
      }
    `,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonCard,
    IonCardContent,
    IonButton,
    IonIcon,
    IonChip,
    IonBadge,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonGrid,
    IonRow,
    IonCol,
  ],
})
export class StorePage {
  private readonly webpayService = inject(WebpayService);
  private readonly router = inject(Router);

  readonly categorias = ['Todos', 'Alimentos', 'Salud', 'Experiencias', 'Accesorios'];

  private readonly productosBase = signal<Producto[]>([
    {
      id: 'prod-001',
      nombre: 'Kit Salud Preventiva MarketPet',
      descripcion: 'Incluye vitaminas, antiparasitario y control veterinario remoto.',
      precio: 29990,
      imagen: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=900&q=80',
      categoria: 'Salud',
      etiquetas: ['Control anual', 'Recomendado por veterinarios'],
      stock: 12,
    },
    {
      id: 'prod-002',
      nombre: 'Snack Natural Relax',
      descripcion: 'Treats libres de granos con propiedades calmantes para momentos de estrés.',
      precio: 12990,
      imagen: 'https://images.unsplash.com/photo-1560114927-6ae7c0c544f0?auto=format&fit=crop&w=900&q=80',
      categoria: 'Alimentos',
      etiquetas: ['Ingredientes naturales', 'Ideal para cachorros'],
      stock: 35,
    },
    {
      id: 'prod-003',
      nombre: 'Experiencia Spa Premium',
      descripcion: 'Sesión completa de spa y grooming en centros aliados MarketPet Premium.',
      precio: 45990,
      imagen: 'https://images.unsplash.com/photo-1619983081593-e2ba5b543168?auto=format&fit=crop&w=900&q=80',
      categoria: 'Experiencias',
      etiquetas: ['Solo Premium', 'Duración 90 minutos'],
      stock: 6,
    },
    {
      id: 'prod-004',
      nombre: 'Arnés ergonómico UrbanWalk',
      descripcion: 'Material respirable, reflectante y con soporte de seguridad para paseos nocturnos.',
      precio: 18990,
      imagen: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80',
      categoria: 'Accesorios',
      etiquetas: ['Reflectante', 'Ultra ligero'],
      stock: 22,
    },
    {
      id: 'prod-005',
      nombre: 'Plan Nutricional Personalizado',
      descripcion: 'Evaluación con nutricionista y recetario semanal para cada mascota.',
      precio: 34990,
      imagen: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&w=900&q=80',
      categoria: 'Salud',
      etiquetas: ['Consulta online', 'Seguimiento 30 días'],
      stock: 10,
    },
    {
      id: 'prod-006',
      nombre: 'Caja Descubrimiento MarketPet',
      descripcion: 'Suscripción mensual con juguetes, snacks y sorpresas para mascotas Premium.',
      precio: 25990,
      imagen: 'https://images.unsplash.com/photo-1601758125946-6ec2ef64243c?auto=format&fit=crop&w=900&q=80',
      categoria: 'Alimentos',
      etiquetas: ['Entrega mensual', 'Contenido sorpresa'],
      stock: 18,
    },
  ]);

  readonly categoriaSeleccionada = signal<string>('Todos');
  readonly carrito = signal<ItemCarrito[]>([]);
  readonly estaProcesando = signal<boolean>(false);

  readonly productosVisibles = computed(() => {
    const categoria = this.categoriaSeleccionada();
    return this.productosBase().filter(producto => categoria === 'Todos' || producto.categoria === categoria);
  });

  readonly subtotal = computed(() =>
    this.carrito().reduce((total, item) => total + item.producto.precio * item.cantidad, 0)
  );

  readonly costoEnvio = computed(() => (this.subtotal() > 50000 || !this.carrito().length ? 0 : 3990));

  readonly total = computed(() => this.subtotal() + this.costoEnvio());

  comprador = {
    nombre: 'Daniela Pérez',
    email: 'daniela@marketpet.cl',
    telefono: '+56 9 1234 5678',
  };

  constructor() {
    addIcons({
      bagHandle,
      bagHandleOutline,
      shieldCheckmarkOutline,
      storefrontOutline,
      peopleOutline,
      cardOutline,
      checkmarkCircle,
    });
  }

  seleccionarCategoria(categoria: string): void {
    this.categoriaSeleccionada.set(categoria);
  }

  agregarAlCarrito(producto: Producto): void {
    const items = [...this.carrito()];
    const existente = items.find(item => item.producto.id === producto.id);

    if (existente) {
      if (existente.cantidad >= producto.stock) {
        return;
      }
      existente.cantidad += 1;
    } else {
      items.push({ producto, cantidad: 1 });
    }

    this.carrito.set(items);
  }

  disminuirCantidad(producto: Producto): void {
    const items = [...this.carrito()];
    const indice = items.findIndex(item => item.producto.id === producto.id);
    if (indice === -1) {
      return;
    }

    const item = items[indice];
    if (item.cantidad === 1) {
      items.splice(indice, 1);
    } else {
      item.cantidad -= 1;
    }

    this.carrito.set(items);
  }

  async iniciarCheckout(): Promise<void> {
    if (!this.carrito().length || this.estaProcesando()) {
      return;
    }

    const orden = this.crearOrdenWebpay();
    this.estaProcesando.set(true);

    try {
      await firstValueFrom(this.webpayService.crearTransaccion(orden));
      await this.router.navigate(['/tienda/checkout']);
    } catch (error) {
      console.error('No se pudo iniciar la transacción Webpay', error);
    } finally {
      this.estaProcesando.set(false);
    }
  }

  private crearOrdenWebpay(): OrdenWebpay {
    const items = this.carrito();
    return {
      items,
      subtotal: this.subtotal(),
      envio: this.costoEnvio(),
      total: this.total(),
      comprador: { ...this.comprador },
    };
  }
}
