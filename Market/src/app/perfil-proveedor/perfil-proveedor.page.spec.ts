import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PerfilProveedorPage } from './perfil-proveedor.page';

describe('PerfilProveedorPage', () => {
  let component: PerfilProveedorPage;
  let fixture: ComponentFixture<PerfilProveedorPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilProveedorPage, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilProveedorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
