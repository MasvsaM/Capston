import { TestBed } from '@angular/core/testing';
import { ServicioAccesoDatosProveedores } from './acceso-datos-proveedores.service';
import { ServicioDatos } from '@nucleo/firebase';

import { firstValueFrom, from, map } from 'rxjs';
import { Proveedor, CategoriaServicio } from '@compartido/modelos';

class ServicioDatosSimulado {
  constructor(private readonly simulador: SimuladorFirestore) {}

  async crearProveedor(proveedor: Omit<Proveedor, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const referencia = this.simulador.doc(`providers/${proveedor.userId}`);
    await this.simulador.setDoc(referencia, {
      ...proveedor,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return proveedor.userId;
  }

  obtenerProveedores(tipoServicio?: string) {
    const coleccion = this.simulador.collection('providers');
    const restricciones = [this.simulador.orderBy('rating', 'desc'), this.simulador.limit(20)];
    if (tipoServicio) {
      restricciones.unshift(this.simulador.where('services', 'array-contains', tipoServicio));
    }
    const consulta = this.simulador.query(coleccion, ...restricciones);
    return from(this.simulador.getDocs(consulta)).pipe(
      map(snapshot =>
        snapshot.docs.map(doc => this.transformarProveedor(doc.id, doc.data() as Record<string, unknown>))
      )
    );
  }

  obtenerProveedor(proveedorId: string) {
    const referencia = this.simulador.doc(`providers/${proveedorId}`);
    return from(this.simulador.getDoc(referencia)).pipe(
      map(snapshot => {
        if (!snapshot.exists()) {
          return null;
        }
        return this.transformarProveedor(snapshot.id, snapshot.data() as Record<string, unknown>);
      })
    );
  }

  async actualizarProveedor(proveedorId: string, cambios: Partial<Proveedor>): Promise<void> {
    const referencia = this.simulador.doc(`providers/${proveedorId}`);
    await this.simulador.updateDoc(referencia, { ...cambios, updatedAt: new Date() });
  }

  obtenerCategoriasServicio(): CategoriaServicio[] {
    return [
      {
        id: 'mock',
        name: 'Simulada',
        icon: 'construct',
        description: 'Categoría de prueba',
        subcategories: []
      }
    ];
  }

  private transformarProveedor(id: string, datos: Record<string, unknown>): Proveedor {
    return {
      id,
      userId: (datos['userId'] as string) ?? id,
      name: (datos['name'] as string) ?? '',
      profession: (datos['profession'] as string) ?? '',
      specialties: (datos['specialties'] as string[]) ?? [],
      rating: (datos['rating'] as number) ?? 0,
      reviewCount: (datos['reviewCount'] as number) ?? 0,
      location: (datos['location'] as string) ?? '',
      availability: (datos['availability'] as string) ?? '',
      price: (datos['price'] as string) ?? '',
      services: (datos['services'] as string[]) ?? [],
      businessName: (datos['businessName'] as string) ?? '',
      description: datos['description'] as string | undefined,
      imageUrl: datos['imageUrl'] as string | undefined,
      createdAt: this.extraerFecha(datos['createdAt']),
      updatedAt: this.extraerFecha(datos['updatedAt'])
    };
  }

  private extraerFecha(valor: unknown): Date {
    if (valor instanceof SimuladorTimestamp) {
      return valor.toDate();
    }
    if (valor instanceof Date) {
      return valor;
    }
    return new Date();
  }
}

describe('ServicioProveedoresService', () => {
  let service: ServicioAccesoDatosProveedores;
  let simulador: SimuladorFirestore;

  const crearProveedorBase = (
    overrides: Partial<Omit<Proveedor, 'id' | 'createdAt' | 'updatedAt'>> = {}
  ): Omit<Proveedor, 'id' | 'createdAt' | 'updatedAt'> => ({
    userId: 'proveedor-base',
    name: 'Proveedor Base',
    profession: 'Veterinario',
    specialties: ['Consulta general'],
    rating: 4.5,
    reviewCount: 10,
    location: 'Ciudad Central',
    availability: 'Lunes a Viernes',
    price: '$40',
    services: ['veterinary'],
    businessName: 'Clínica Base',
    description: 'Servicios para mascotas',
    imageUrl: 'https://example.com/proveedor.png',
    ...overrides
  });

  beforeEach(() => {
    simulador = new SimuladorFirestore();
    const servicioDatos = new ServicioDatosSimulado(simulador);

    TestBed.configureTestingModule({
      providers: [
        ServicioAccesoDatosProveedores,
        { provide: ServicioDatos, useValue: servicioDatos as unknown as ServicioDatos }
      ]
    });

    service = TestBed.inject(ServicioAccesoDatosProveedores);
  });

  it('debería registrar y recuperar un proveedor', async () => {
    const datosProveedor = crearProveedorBase({ userId: 'proveedor-uno', name: 'Proveedor Uno' });

    const id = await service.registrarProveedor(datosProveedor);
    expect(id).toBe(datosProveedor.userId);

    const proveedor = await firstValueFrom(service.obtenerProveedor(datosProveedor.userId));
    expect(proveedor).not.toBeNull();
    expect(proveedor?.id).toBe(datosProveedor.userId);
    expect(proveedor?.name).toBe('Proveedor Uno');
    expect(proveedor?.createdAt).toBeInstanceOf(Date);
  });

  it('debería ordenar los proveedores por calificación y filtrar por servicio', async () => {
    await service.registrarProveedor(
      crearProveedorBase({ userId: 'proveedor-a', rating: 4.2, services: ['grooming'], name: 'Proveedor A' })
    );
    await service.registrarProveedor(
      crearProveedorBase({ userId: 'proveedor-b', rating: 4.9, services: ['grooming'], name: 'Proveedor B' })
    );
    await service.registrarProveedor(
      crearProveedorBase({ userId: 'proveedor-c', rating: 4.7, services: ['veterinary'], name: 'Proveedor C' })
    );

    const proveedores = await firstValueFrom(service.obtenerProveedores('grooming'));
    expect(proveedores.map(proveedor => proveedor.id)).toEqual(['proveedor-b', 'proveedor-a']);
    expect(proveedores.every(proveedor => proveedor.services.includes('grooming'))).toBeTrue();
  });

  it('debería actualizar la información de un proveedor existente', async () => {
    const base = crearProveedorBase({ userId: 'proveedor-actualizable', location: 'Ciudad Antigua' });
    await service.registrarProveedor(base);

    await service.actualizarProveedor(base.userId, { location: 'Ciudad Moderna' });

    const proveedorActualizado = await firstValueFrom(service.obtenerProveedor(base.userId));
    expect(proveedorActualizado?.location).toBe('Ciudad Moderna');
    expect(proveedorActualizado?.updatedAt).toBeInstanceOf(Date);
  });

  it('debería exponer las categorías de servicio configuradas', () => {
    const categorias = service.obtenerCategoriasServicio();
    expect(categorias.length).toBeGreaterThan(0);
    expect(categorias[0].id).toBeDefined();
  });
});
