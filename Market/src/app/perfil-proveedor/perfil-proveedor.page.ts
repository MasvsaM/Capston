import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { DashboardWidget, ProviderDashboardService } from '../shared/services/provider-dashboard.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-perfil-proveedor',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './perfil-proveedor.page.html',
  styleUrls: ['./perfil-proveedor.page.scss'],
})
export class PerfilProveedorPage {
  private readonly dashboardService = inject(ProviderDashboardService);

  readonly dashboard$ = this.dashboardService.profile$.pipe(
    map(profile => ({
      profile,
      widgets: this.dashboardService.getWidgets(profile),
    })),
  );

  trackWidget(_: number, widget: DashboardWidget): string {
    return widget.id;
  }
}

