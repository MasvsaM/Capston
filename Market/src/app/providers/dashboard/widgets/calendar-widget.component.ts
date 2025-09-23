import { Component, Input } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
} from '@ionic/angular/standalone';
import { addOutline, calendarOutline, createOutline } from 'ionicons/icons';

export interface CalendarAppointment {
  id: string;
  title: string;
  date: string;
  owner: string;
}

@Component({
  selector: 'app-calendar-widget',
  templateUrl: './calendar-widget.component.html',
  styleUrls: ['./calendar-widget.component.scss'],
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
    IonButtons,
    IonButton,
  ],
})
export class CalendarWidgetComponent {
  protected readonly calendarOutline = calendarOutline;
  protected readonly addOutline = addOutline;
  protected readonly createOutline = createOutline;

  @Input() appointments: CalendarAppointment[] = [];

  trackById(_index: number, appointment: CalendarAppointment): string {
    return appointment.id;
  }
}
