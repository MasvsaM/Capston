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
import { listCircleOutline, settingsOutline } from 'ionicons/icons';

@Component({
  selector: 'app-services-widget',
  templateUrl: './services-widget.component.html',
  styleUrls: ['./services-widget.component.scss'],
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
export class ServicesWidgetComponent {
  protected readonly listCircleOutline = listCircleOutline;
  protected readonly settingsOutline = settingsOutline;

  @Input() services: string[] = [];
}
