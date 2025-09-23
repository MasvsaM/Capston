import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ProviderDashboardService } from '../shared/services/provider-dashboard.service';
import { PerfilProveedorPage } from './perfil-proveedor.page';

class ProviderDashboardServiceStub {
  readonly profile$ = of(null);

  getWidgets = jasmine.createSpy().and.returnValue([]);
}

describe('PerfilProveedorPage', () => {
  let component: PerfilProveedorPage;
  let fixture: ComponentFixture<PerfilProveedorPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilProveedorPage, RouterTestingModule],
      providers: [{ provide: ProviderDashboardService, useClass: ProviderDashboardServiceStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilProveedorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
