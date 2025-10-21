import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ProviderDashboardPage } from './provider-dashboard.page';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, firstValueFrom, of } from 'rxjs';
import { ServicioAutenticacion } from '@nucleo/firebase';
import { ServicioAccesoDatosCitas } from '@funcionalidades/citas/servicios';
import { Cita, Proveedor } from '@compartido/modelos';
import { RouterTestingModule } from '@angular/router/testing';

describe('PanelPage', () => {
  let component: ProviderDashboardPage;
  let fixture: ComponentFixture<ProviderDashboardPage>;
  let servicioAccesoDatosCitas: jasmine.SpyObj<ServicioAccesoDatosCitas>;
  let usuarioActualSubject: BehaviorSubject<{ uid: string } | null>;
  let router: Router;

  const proveedorMock: Proveedor = {
    id: 'proveedor-1',
    userId: 'proveedor-1',
    name: 'Clínica Mascotas',
    profession: 'Veterinario',
    specialties: ['Consulta general'],
    rating: 4.8,
    reviewCount: 12,
    location: 'Ciudad Central',
    availability: 'Lunes a Viernes',
    price: '$40',
    services: ['veterinary'],
    businessName: 'Clínica Mascotas',
    description: 'Cuidado integral para mascotas',
    imageUrl: 'https://example.com/provider.png',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const citaMock: Cita = {
    id: 'cita-1',
    petId: 'pet-1',
    petName: 'Luna',
    providerId: 'proveedor-1',
    providerName: 'Clínica Mascotas',
    userId: 'usuario-1',
    service: 'Consulta general',
    date: '2024-01-01',
    time: '10:00',
    location: 'Ciudad Central',
    price: '$40',
    status: 'confirmed',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(async () => {
    servicioAccesoDatosCitas = jasmine.createSpyObj('ServicioAccesoDatosCitas', ['obtenerCitasDeProveedor']);
    usuarioActualSubject = new BehaviorSubject<{ uid: string } | null>({ uid: 'proveedor-1' });

    servicioAccesoDatosCitas.obtenerCitasDeProveedor.and.returnValue(of([citaMock]));

    await TestBed.configureTestingModule({
      imports: [ProviderDashboardPage, RouterTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: { data: of({ perfilProveedor: proveedorMock }) } },
        { provide: ServicioAccesoDatosCitas, useValue: servicioAccesoDatosCitas },
        {
          provide: ServicioAutenticacion,
          useValue: { usuarioActual$: usuarioActualSubject.asObservable() }
        }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.resolveTo(true);

    fixture = TestBed.createComponent(ProviderDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería exponer el proveedor resuelto', async () => {
    const provider = await firstValueFrom(component.provider$);
    expect(provider).toEqual(proveedorMock);
  });

  it('debería cargar las citas próximas del proveedor autenticado', async () => {
    const citas = await firstValueFrom(component.upcomingAppointments$);
    expect(servicioAccesoDatosCitas.obtenerCitasDeProveedor).toHaveBeenCalledWith('proveedor-1');
    expect(citas.length).toBe(1);
    expect(citas[0].id).toBe('cita-1');
  });

  it('debería completar el refresco tras invocar refreshData', fakeAsync(() => {
    const completar = jasmine.createSpy('complete');
    const evento = { target: { complete: completar } } as unknown as CustomEvent;

    component.refreshData(evento);
    tick(800);

    expect(completar).toHaveBeenCalled();
  }));

  it('debería navegar a la vista de citas', () => {
    component.goToAppointments();
    expect(router.navigate).toHaveBeenCalledWith(['/tabs/citas']);
  });

  it('debería navegar a la edición de perfil', () => {
    component.editProfile();
    expect(router.navigate).toHaveBeenCalledWith(['/perfil']);
  });
});
