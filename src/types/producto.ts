export type CategoriaProducto = 'credito' | 'cdt' | 'ahorro';

export type TipoCredito = 'libre_inversion' | 'vivienda' | 'vehiculo' | 'educativo';
export type TipoCDT = 'cdt';
export type TipoAhorro = 'ahorro_programado' | 'ahorro_tradicional';

export type TipoProducto = TipoCredito | TipoCDT | TipoAhorro;

export interface ProductoFinanciero {
  id: string;
  nombre: string;
  categoria: CategoriaProducto;
  tipo: TipoProducto;
  tasaNominalMensual: number; // Porcentaje ej 1.45
  tasaEfectivaAnual: number;  // Porcentaje ej 18.85
  montoMinimo: number;
  montoMaximo: number;
  plazoMinimoMeses: number;
  plazoMaximoMeses: number;
  descripcion: string;
  beneficios: string[];
  requisitos: string[];
  estado: 'activo' | 'inactivo';
}
