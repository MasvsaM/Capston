import { Component, Input } from '@angular/core';
import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
} from '@ionic/angular/standalone';
import { addCircleOutline, createOutline, storefrontOutline } from 'ionicons/icons';

export interface InventoryItem {
  id: string;
  name: string;
  stock: number;
}

@Component({
  selector: 'app-inventory-widget',
  templateUrl: './inventory-widget.component.html',
  styleUrls: ['./inventory-widget.component.scss'],
  standalone: true,
  imports: [
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonBadge,
    IonButton,
  ],
})
export class InventoryWidgetComponent {
  protected readonly storefrontOutline = storefrontOutline;
  protected readonly createOutline = createOutline;
  protected readonly addCircleOutline = addCircleOutline;

  @Input() inventory: InventoryItem[] = [];

  trackById(_index: number, item: InventoryItem): string {
    return item.id;
  }
}
