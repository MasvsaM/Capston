import { Component, Input } from '@angular/core';
import {
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
import { pawOutline, settingsOutline } from 'ionicons/icons';

@Component({
  selector: 'app-species-widget',
  templateUrl: './species-widget.component.html',
  styleUrls: ['./species-widget.component.scss'],
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
    IonButton,
  ],
})
export class SpeciesWidgetComponent {
  protected readonly pawOutline = pawOutline;
  protected readonly settingsOutline = settingsOutline;

  @Input() species: string[] = [];
}
