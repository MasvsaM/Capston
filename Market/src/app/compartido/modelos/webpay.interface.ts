import { ItemCarrito } from './producto.interface';

export type EstadoWebpay =
  | 'created'
  | 'processing'
  | 'authorized'
  | 'failed'
  | 'completed';

export type PasoWebpay = 'order' | 'init' | 'redirect' | 'payment' | 'result';

export interface OrdenWebpay {
  items: ItemCarrito[];
  subtotal: number;
  envio: number;
  total: number;
  comprador: DatosComprador;
}

export interface DatosComprador {
  nombre: string;
  email: string;
  telefono: string;
}

export interface HistorialWebpay {
  paso: PasoWebpay;
  estado: EstadoWebpay;
  mensaje: string;
  timestamp: string;
}

export interface TransaccionWebpay {
  id: string;
  token: string;
  url: string;
  pasoActual: PasoWebpay;
  estado: EstadoWebpay;
  orden: OrdenWebpay;
  historial: HistorialWebpay[];
}
