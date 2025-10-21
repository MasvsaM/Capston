import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonSearchbar,
  IonCard, IonCardContent, IonButton, IonIcon, IonChip, IonLabel,
  IonGrid, IonRow, IonCol, IonAvatar, IonFab, IonFabButton,
  IonRefresher, IonRefresherContent
} from '@ionic/angular/standalone';
import { ServicioAccesoDatosProveedores } from '@funcionalidades/proveedores/servicios';
import { Proveedor, CategoriaServicio } from '@compartido/modelos';
import { addIcons } from 'ionicons';
import {
  searchOutline, filterOutline, starOutline, locationOutline,
  callOutline, chatbubbleOutline, heartOutline, addOutline
} from 'ionicons/icons';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-providers',
  template: `
    <ion-content>
      <!-- Header -->
      <ion-header class="marketpet-header">
        <ion-toolbar>
          <ion-title>Servicios</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-refresher slot="fixed" (ionRefresh)="refreshData($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <div class="content-container">
        <!-- Search Bar -->
        <div class="search-section">
          <ion-searchbar 
            placeholder="Buscar servicios..." 
            [(ngModel)]="searchTerm"
            (ionInput)="onSearchInput($event)"
            class="custom-searchbar">
          </ion-searchbar>
          <ion-button fill="outline" size="default" class="filter-btn">
            <ion-icon name="filter-outline" slot="icon-only"></ion-icon>
          </ion-button>
        </div>

        <!-- Service Categories -->
        <ion-card class="categories-card">
          <ion-card-content>
            <h3>Categorías</h3>
            <ion-grid>
              <ion-row>
                <ion-col size="6" *ngFor="let category of serviceCategories">
                  <div class="category-item" (click)="selectCategory(category.id)">
                    <div class="category-icon">{{ getCategoryIcon(category.id) }}</div>
                    <span>{{ category.name }}</span>
                  </div>
                </ion-col>
              </ion-row>
            </ion-grid>
          </ion-card-content>
        </ion-card>

        <!-- Providers List -->
        <div class="providers-section">
          <h3>Proveedores Recomendados</h3>
          
          <div class="providers-list">
            <ion-card 
              *ngFor="let provider of providers$ | async" 
              class="provider-card marketpet-card"
              (click)="viewProvider(provider)">
              <ion-card-content>
                <div class="provider-content">
                  <ion-avatar class="provider-avatar">
                    <img [src]="provider.imageUrl || getDefaultProviderImage()" [alt]="provider.name">
                  </ion-avatar>
                  
                  <div class="provider-info">
                    <h4 class="provider-name">{{ provider.name }}</h4>
                    <p class="provider-profession">{{ provider.profession }}</p>
                    
                    <div class="provider-rating">
                      <ion-icon name="star-outline" color="warning"></ion-icon>
                      <span>{{ provider.rating }}</span>
                      <span class="reviews">({{ provider.reviewCount }} reseñas)</span>
                    </div>
                    
                    <div class="provider-location">
                      <ion-icon name="location-outline"></ion-icon>
                      <span>{{ provider.location }}</span>
                    </div>
                    
                    <div class="provider-specialties">
                      <ion-chip 
                        *ngFor="let specialty of provider.specialties.slice(0, 2)" 
                        size="small"
                        color="primary">
                        <ion-label>{{ specialty }}</ion-label>
                      </ion-chip>
                      <ion-chip 
                        *ngIf="provider.specialties.length > 2"
                        size="small">
                        +{{ provider.specialties.length - 2 }}
                      </ion-chip>
                    </div>
                  </div>
                  
                  <div class="provider-actions">
                    <div class="provider-price">{{ provider.price }}</div>
                    <div class="action-buttons">
                      <ion-button 
                        size="small" 
                        fill="outline"
                        (click)="$event.stopPropagation(); contactProvider(provider)">
                        <ion-icon name="call-outline" slot="icon-only"></ion-icon>
                      </ion-button>
                      <ion-button 
                        size="small"
                        (click)="$event.stopPropagation(); bookProvider(provider)">
                        Agendar
                      </ion-button>
                    </div>
                  </div>
                </div>
              </ion-card-content>
            </ion-card>
          </div>
        </div>
      </div>

      <!-- Floating Action Button -->
      <ion-fab slot="fixed" vertical="bottom" horizontal="end" class="marketpet-floating-button">
        <ion-fab-button color="primary" (click)="addProvider()">
          <ion-icon name="add-outline"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  `,
  styles: [`
    .content-container {
      padding: 1rem;
    }

    .search-section {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .custom-searchbar {
      flex: 1;
      --background: white;
      --border-radius: 12px;
      --box-shadow: var(--marketpet-shadow);
    }

    .filter-btn {
      --border-radius: 12px;
      --background: white;
      --box-shadow: var(--marketpet-shadow);
    }

    .categories-card {
      margin-bottom: 1.5rem;
    }

    .categories-card h3 {
      margin: 0 0 1rem 0;
      font-weight: 600;
    }

    .category-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 0.5rem;
      cursor: pointer;
      border-radius: 12px;
      transition: background-color 0.2s ease;
    }

    .category-item:active {
      background-color: var(--ion-color-light);
    }

    .category-icon {
      font-size: 2rem;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--ion-color-primary-tint);
      border-radius: 12px;
    }

    .category-item span {
      font-size: 0.85rem;
      font-weight: 500;
      text-align: center;
      color: var(--ion-color-dark);
    }

    .providers-section h3 {
      margin-bottom: 1rem;
      font-weight: 600;
    }

    .providers-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .provider-card {
      cursor: pointer;
      transition: transform 0.2s ease;
    }

    .provider-card:active {
      transform: scale(0.98);
    }

    .provider-content {
      display: flex;
      gap: 1rem;
    }

    .provider-avatar {
      width: 60px;
      height: 60px;
      flex-shrink: 0;
    }

    .provider-info {
      flex: 1;
    }

    .provider-name {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0 0 0.25rem 0;
      color: var(--ion-color-dark);
    }

    .provider-profession {
      font-size: 0.9rem;
      color: var(--ion-color-primary);
      font-weight: 500;
      margin: 0 0 0.5rem 0;
    }

    .provider-rating {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.85rem;
      margin-bottom: 0.25rem;
    }

    .provider-rating .reviews {
      color: var(--ion-color-medium);
    }

    .provider-location {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.8rem;
      color: var(--ion-color-medium);
      margin-bottom: 0.5rem;
    }

    .provider-specialties {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
    }

    .provider-actions {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.5rem;
    }

    .provider-price {
      font-size: 1rem;
      font-weight: 600;
      color: var(--ion-color-success);
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonSearchbar,
    IonCard, IonCardContent, IonButton, IonIcon, IonChip, IonLabel,
    IonGrid, IonRow, IonCol, IonAvatar, IonFab, IonFabButton,
    IonRefresher, IonRefresherContent, FormsModule
  ]
})
export class ProvidersPage implements OnInit {
  private servicioAccesoDatosProveedores = inject(ServicioAccesoDatosProveedores);
  private router = inject(Router);

  providers$!: Observable<Proveedor[]>;
  searchTerm = '';
  selectedCategory = '';
  serviceCategories: CategoriaServicio[] = [];

  constructor() {
    addIcons({ 
      searchOutline, filterOutline, starOutline, locationOutline,
      callOutline, chatbubbleOutline, heartOutline, addOutline
    });
  }

  ngOnInit() {
    this.loadProviders();
    this.serviceCategories = this.servicioAccesoDatosProveedores.obtenerCategoriasServicio();
  }

  loadProviders() {
    this.providers$ = this.servicioAccesoDatosProveedores.obtenerProveedores(this.selectedCategory);
  }

  refreshData(event: any) {
    this.loadProviders();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  onSearchInput(event: any) {
    this.searchTerm = event.target.value;
    // Implement search logic
  }

  selectCategory(categoryId: string) {
    this.selectedCategory = categoryId;
    this.loadProviders();
  }

  viewProvider(provider: Proveedor) {
    // Navigate to provider detail page
    console.log('View provider:', provider);
  }

  contactProvider(provider: Proveedor) {
    // Open contact options
    console.log('Contact provider:', provider);
  }

  bookProvider(provider: Proveedor) {
    this.router.navigate(['/citas/formulario'], { state: { provider } });
  }

  addProvider() {
    // Only for providers to add their services
    console.log('Add provider');
  }

  getCategoryIcon(categoryId: string): string {
    const icons: { [key: string]: string } = {
      'veterinary': '🏥',
      'grooming': '✂️',
      'walking': '🚶',
      'boarding': '🏠',
      'training': '🎓',
      'products': '🛍️'
    };
    return icons[categoryId] || '🐾';
  }

  getDefaultProviderImage(): string {
    return 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face';
  }
}