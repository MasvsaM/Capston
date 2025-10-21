export class SimuladorTimestamp {
  constructor(private readonly fecha: Date) {}

  toDate(): Date {
    return this.fecha;
  }
}

type OperadorWhere = '==' | 'array-contains';

type RestriccionSimulada =
  | { tipo: 'where'; campo: string; operador: OperadorWhere; valor: unknown }
  | { tipo: 'orderBy'; campo: string; direccion?: 'asc' | 'desc' }
  | { tipo: 'limit'; cantidad: number };

type ReferenciaColeccion = { path: string };

type ReferenciaDocumento = { path: string; id: string; parent: ReferenciaColeccion };

type ConsultaSimulada = {
  coleccion: ReferenciaColeccion;
  restricciones: RestriccionSimulada[];
};

type DocumentoConsultado = {
  id: string;
  data(): Record<string, unknown>;
};

type DocumentoObtenido = DocumentoConsultado & {
  exists(): boolean;
};

export class SimuladorFirestore {
  readonly baseFirestore = { origen: 'simulador' };

  private colecciones = new Map<string, Map<string, Record<string, unknown>>>();
  private contadorIds = 0;

  collection(path: string): ReferenciaColeccion {
    if (!this.colecciones.has(path)) {
      this.colecciones.set(path, new Map());
    }
    return { path };
  }

  doc(path: string): ReferenciaDocumento {
    const segmentos = path.split('/');
    const id = segmentos.pop();
    if (!id) {
      throw new Error('El identificador del documento es obligatorio');
    }
    const coleccionPath = segmentos.join('/');
    return {
      path,
      id,
      parent: { path: coleccionPath }
    };
  }

  async setDoc(referencia: ReferenciaDocumento, datos: Record<string, unknown>): Promise<void> {
    const coleccion = this.obtenerColeccion(referencia.parent.path);
    coleccion.set(referencia.id, this.normalizarDatos(datos));
  }

  async addDoc(referencia: ReferenciaColeccion, datos: Record<string, unknown>): Promise<{ id: string }> {
    const id = `sim-${++this.contadorIds}`;
    const docRef = this.doc(`${referencia.path}/${id}`);
    await this.setDoc(docRef, datos);
    return { id };
  }

  async getDoc(referencia: ReferenciaDocumento): Promise<DocumentoObtenido> {
    const coleccion = this.obtenerColeccion(referencia.parent.path, false);
    const documento = coleccion?.get(referencia.id);
    return {
      id: referencia.id,
      data: () => (documento ? this.clonar(documento) : (undefined as unknown as Record<string, unknown>)),
      exists: () => Boolean(documento)
    };
  }

  async getDocs(consulta: ConsultaSimulada): Promise<{ docs: DocumentoConsultado[] }> {
    const documentos = this.evaluarConsulta(consulta);
    return {
      docs: documentos.map(doc => ({
        id: doc.id,
        data: () => this.clonar(doc.data)
      }))
    };
  }

  async updateDoc(referencia: ReferenciaDocumento, cambios: Record<string, unknown>): Promise<void> {
    const coleccion = this.obtenerColeccion(referencia.parent.path);
    const existente = this.clonar(coleccion.get(referencia.id) ?? {});
    const actualizados = { ...existente, ...this.normalizarDatos(cambios) };
    coleccion.set(referencia.id, actualizados);
  }

  async deleteDoc(referencia: ReferenciaDocumento): Promise<void> {
    const coleccion = this.obtenerColeccion(referencia.parent.path, false);
    coleccion?.delete(referencia.id);
  }

  query(coleccion: ReferenciaColeccion, ...restricciones: RestriccionSimulada[]): ConsultaSimulada {
    return { coleccion, restricciones };
  }

  where(campo: string, operador: OperadorWhere, valor: unknown): RestriccionSimulada {
    return { tipo: 'where', campo, operador, valor };
  }

  orderBy(campo: string, direccion?: 'asc' | 'desc'): RestriccionSimulada {
    return { tipo: 'orderBy', campo, direccion };
  }

  limit(cantidad: number): RestriccionSimulada {
    return { tipo: 'limit', cantidad };
  }

  private obtenerColeccion(path: string, crear = true): Map<string, Record<string, unknown>> {
    if (!this.colecciones.has(path) && crear) {
      this.colecciones.set(path, new Map());
    }
    const coleccion = this.colecciones.get(path);
    if (!coleccion) {
      return new Map();
    }
    return coleccion;
  }

  private evaluarConsulta(consulta: ConsultaSimulada) {
    const coleccion = this.obtenerColeccion(consulta.coleccion.path, false);
    const documentos = coleccion
      ? Array.from(coleccion.entries()).map(([id, data]) => ({ id, data }))
      : [];

    return consulta.restricciones.reduce((acumulado, restriccion) => {
      switch (restriccion.tipo) {
        case 'where':
          return acumulado.filter(doc => this.cumpleWhere(doc.data, restriccion));
        case 'orderBy':
          return this.aplicarOrden(acumulado, restriccion);
        case 'limit':
          return acumulado.slice(0, restriccion.cantidad);
        default:
          return acumulado;
      }
    }, documentos);
  }

  private cumpleWhere(datos: Record<string, unknown>, restriccion: Extract<RestriccionSimulada, { tipo: 'where' }>) {
    const valor = datos[restriccion.campo];
    if (restriccion.operador === '==') {
      return valor === restriccion.valor;
    }
    if (restriccion.operador === 'array-contains' && Array.isArray(valor)) {
      return valor.includes(restriccion.valor as never);
    }
    return false;
  }

  private aplicarOrden(
    documentos: { id: string; data: Record<string, unknown> }[],
    restriccion: Extract<RestriccionSimulada, { tipo: 'orderBy' }>
  ) {
    const direccion = restriccion.direccion === 'desc' ? -1 : 1;
    return [...documentos].sort((a, b) => {
      const valorA = this.obtenerValorOrden(a.data[restriccion.campo]);
      const valorB = this.obtenerValorOrden(b.data[restriccion.campo]);
      if (valorA < valorB) {
        return -1 * direccion;
      }
      if (valorA > valorB) {
        return 1 * direccion;
      }
      return 0;
    });
  }

  private obtenerValorOrden(valor: unknown): number | string {
    if (valor instanceof SimuladorTimestamp) {
      return valor.toDate().getTime();
    }
    if (typeof valor === 'number' || typeof valor === 'string') {
      return valor;
    }
    return 0;
  }

  private normalizarDatos(datos: Record<string, unknown>): Record<string, unknown> {
    const copia: Record<string, unknown> = {};
    Object.entries(datos).forEach(([clave, valor]) => {
      if (valor instanceof Date) {
        copia[clave] = new SimuladorTimestamp(valor);
      } else if (valor instanceof SimuladorTimestamp) {
        copia[clave] = new SimuladorTimestamp(valor.toDate());
      } else if (Array.isArray(valor)) {
        copia[clave] = valor.map(item => {
          if (item instanceof Date) {
            return new SimuladorTimestamp(item);
          }
          if (item instanceof SimuladorTimestamp) {
            return new SimuladorTimestamp(item.toDate());
          }
          if (typeof item === 'object' && item !== null) {
            return this.normalizarDatos(item as Record<string, unknown>);
          }
          return item;
        });
      } else if (typeof valor === 'object' && valor !== null) {
        copia[clave] = this.normalizarDatos(valor as Record<string, unknown>);
      } else {
        copia[clave] = valor;
      }
    });
    return copia;
  }

  private clonar<T>(valor: T): T {
    if (valor instanceof SimuladorTimestamp) {
      return new SimuladorTimestamp(valor.toDate()) as unknown as T;
    }
    if (Array.isArray(valor)) {
      return valor.map(item => this.clonar(item)) as unknown as T;
    }
    if (typeof valor === 'object' && valor !== null) {
      const resultado: Record<string, unknown> = {};
      Object.entries(valor as Record<string, unknown>).forEach(([clave, item]) => {
        resultado[clave] = this.clonar(item);
      });
      return resultado as T;
    }
    return valor;
  }
}
