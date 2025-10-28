import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  EstadoWebpay,
  HistorialWebpay,
  OrdenWebpay,
  PasoWebpay,
  TransaccionWebpay,
} from '@compartido/modelos';

@Injectable({ providedIn: 'root' })
export class WebpayService {
  private readonly transaccionActual$ = new BehaviorSubject<TransaccionWebpay | null>(null);

  crearTransaccion(orden: OrdenWebpay): Observable<TransaccionWebpay> {
    const transaccionBase: TransaccionWebpay = {
      id: `WEBPAY-${Date.now()}`,
      token: this.generarToken(),
      url: 'https://webpay3g.transbank.cl/webpayserver/initTransaction',
      pasoActual: 'order',
      estado: 'created',
      orden,
      historial: [],
    };

    return timer(500).pipe(
      map(() => {
        const transaccion = this.agregarAlHistorial(
          transaccionBase,
          'order',
          'created',
          'Orden creada y enviada a Webpay para inicialización.'
        );
        this.transaccionActual$.next(transaccion);
        return transaccion;
      })
    );
  }

  inicializarWebpay(): Observable<TransaccionWebpay> {
    return this.actualizarTransaccion(
      'init',
      'processing',
      'Token de sesión generado correctamente. Esperando redirección del usuario a Webpay.'
    );
  }

  redirigirAWebpay(): Observable<TransaccionWebpay> {
    return this.actualizarTransaccion(
      'redirect',
      'processing',
      'Usuario redirigido al formulario seguro de Webpay para completar el pago.'
    );
  }

  autorizarPago(aceptado: boolean): Observable<TransaccionWebpay> {
    const estado: EstadoWebpay = aceptado ? 'authorized' : 'failed';
    const mensaje = aceptado
      ? 'Pago autorizado por el emisor. Recibiendo respuesta de Webpay.'
      : 'Pago rechazado por el banco emisor. Se puede intentar nuevamente.';

    return this.actualizarTransaccion('payment', estado, mensaje);
  }

  finalizarTransaccion(): Observable<TransaccionWebpay> {
    const transaccion = this.obtenerTransaccionActual();
    const estado: EstadoWebpay = transaccion.estado === 'authorized' ? 'completed' : 'failed';
    const mensaje =
      estado === 'completed'
        ? 'Transacción confirmada y recibo emitido. El comercio puede entregar el pedido.'
        : 'No se pudo completar la transacción. No se realizó ningún cargo.';

    return this.actualizarTransaccion('result', estado, mensaje);
  }

  reiniciar(): void {
    this.transaccionActual$.next(null);
  }

  obtenerTransaccion(): Observable<TransaccionWebpay | null> {
    return this.transaccionActual$.asObservable();
  }

  private actualizarTransaccion(
    paso: PasoWebpay,
    estado: EstadoWebpay,
    mensaje: string
  ): Observable<TransaccionWebpay> {
    const transaccion = this.obtenerTransaccionActual();

    const transaccionActualizada = this.agregarAlHistorial(
      { ...transaccion, pasoActual: paso, estado },
      paso,
      estado,
      mensaje
    );

    return timer(600).pipe(
      map(() => {
        this.transaccionActual$.next(transaccionActualizada);
        return transaccionActualizada;
      })
    );
  }

  private agregarAlHistorial(
    transaccion: TransaccionWebpay,
    paso: PasoWebpay,
    estado: EstadoWebpay,
    mensaje: string
  ): TransaccionWebpay {
    const entradaHistorial: HistorialWebpay = {
      paso,
      estado,
      mensaje,
      timestamp: new Date().toISOString(),
    };

    return {
      ...transaccion,
      historial: [...transaccion.historial, entradaHistorial],
    };
  }

  private obtenerTransaccionActual(): TransaccionWebpay {
    const transaccion = this.transaccionActual$.value;
    if (!transaccion) {
      throw new Error('No existe una transacción Webpay activa.');
    }
    return transaccion;
  }

  private generarToken(): string {
    return crypto.randomUUID().replace(/-/g, '').slice(0, 26).toUpperCase();
  }
}
