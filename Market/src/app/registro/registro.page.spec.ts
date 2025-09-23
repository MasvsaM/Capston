import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { FirebaseCrudService } from '../shared/services/firebase-crud.service';
import { ProviderDashboardService } from '../shared/services/provider-dashboard.service';
import { RegistroPage } from './registro.page';

class ProviderDashboardServiceStub {
  readonly profile$ = of(null);

  saveProfile = jasmine.createSpy().and.returnValue(Promise.resolve('provider-id'));
}

class FirebaseCrudServiceStub {
  setDocument = jasmine.createSpy().and.returnValue(Promise.resolve());
}

describe('RegistroPage', () => {
  let component: RegistroPage;
  let fixture: ComponentFixture<RegistroPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroPage, RouterTestingModule],
      providers: [
        { provide: ProviderDashboardService, useClass: ProviderDashboardServiceStub },
        { provide: FirebaseCrudService, useClass: FirebaseCrudServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
