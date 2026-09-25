import { CategoriaProducto } from './producto';

export interface CuotaAmortizacion {
  numeroCuota: number;
  cuotaFija: number;
  interes: number;
  abonoCapital: number;
  saldoPendiente: number;
}

export interface SimulacionCreditoParams {
  monto: number;
  plazo: number; // meses
  tasaNominalMensual: number; // %
  tasaEfectivaAnual: number;  // %
  tipoCredito: string;
}

export interface SimulacionCreditoResultados {
  cuotaMensual: number;
  totalPagar: number;
  totalIntereses: number;
  numeroCuotas: number;
  tablaAmortizacion?: CuotaAmortizacion[];
}

export interface SimulacionCDTParams {
  inversion: number;
  plazoDias: number;
  tasaRentabilidadEA: number;
}

export interface SimulacionCDTResultados {
  rendimientoEstimado: number;
  retencionFuente: number;
  montoTotalFinal: number;
}

export interface SimulacionAhorroParams {
  ahorroInicial: number;
  aporteMensual: number;
  plazoMeses: number;
  tasaInteresEA: number;
}

export interface SimulacionAhorroResultados {
  totalAportado: number;
  interesesGenerados: number;
  saldoFinal: number;
}

export interface Simulacion {
  id: string;
  tipo: CategoriaProducto;
  fecha: string;
  asesorId: string;
  asesorNombre: string;
  clienteNombre: string;
  clienteDocumento: string;
  productoId?: string;
  productoNombre: string;
  parametros: SimulacionCreditoParams | SimulacionCDTParams | SimulacionAhorroParams | any;
  resultados: SimulacionCreditoResultados | SimulacionCDTResultados | SimulacionAhorroResultados | any;
}
