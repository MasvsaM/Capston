import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { FachadaProveedores, PerfilProveedor } from '../../acceso-datos/fachada-proveedores.service';

@Component({
  selector: 'app-proveedores-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  private readonly fachada = inject(FachadaProveedores);
  perfil$!: Observable<PerfilProveedor>;

  ngOnInit(): void {
    this.perfil$ = this.fachada.obtenerPerfil();
  }
}
