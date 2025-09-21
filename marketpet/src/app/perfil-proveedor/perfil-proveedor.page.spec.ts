import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilProveedorPage } from './perfil-proveedor.page';

describe('PerfilProveedorPage', () => {
  let component: PerfilProveedorPage;
  let fixture: ComponentFixture<PerfilProveedorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilProveedorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
