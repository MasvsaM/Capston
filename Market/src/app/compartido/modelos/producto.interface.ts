export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  categoria: string;
  etiquetas: string[];
  stock: number;
}

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}
