import { CuotaAmortizacion, SimulacionCreditoResultados, SimulacionCDTResultados, SimulacionAhorroResultados } from '@/types/simulacion';

/**
 * Convierte Tasa Efectiva Anual (E.A.) a Tasa Periódica Mensual vencida
 * i_mensual = (1 + EA)^(1/12) - 1
 */
export function convertEAToMonthlyRate(eaPercent: number): number {
  const ea = eaPercent / 100;
  const iMonthly = Math.pow(1 + ea, 1 / 12) - 1;
  return iMonthly * 100;
}

/**
 * Convierte Tasa Nominal Mensual a Efectiva Anual
 * EA = (1 + i_mensual)^12 - 1
 */
export function convertMonthlyToEARate(monthlyPercent: number): number {
  const iMonthly = monthlyPercent / 100;
  const ea = Math.pow(1 + iMonthly, 12) - 1;
  return ea * 100;
}

/**
 * Calcula cuota fija mensual y tabla de amortización (Sistema Francés)
 */
export function calculateCreditSimulation(
  monto: number,
  plazoMeses: number,
  tasaNominalMensual: number
): SimulacionCreditoResultados {
  if (monto <= 0 || plazoMeses <= 0 || tasaNominalMensual <= 0) {
    return {
      cuotaMensual: 0,
      totalPagar: 0,
      totalIntereses: 0,
      numeroCuotas: plazoMeses,
      tablaAmortizacion: [],
    };
  }

  const i = tasaNominalMensual / 100;
  const factor = Math.pow(1 + i, plazoMeses);
  // Fórmula cuota fija: R = P * (i * (1+i)^n) / ((1+i)^n - 1)
  const cuotaMensual = Math.round(monto * ((i * factor) / (factor - 1)));

  let saldo = monto;
  const tablaAmortizacion: CuotaAmortizacion[] = [];
  let totalIntereses = 0;

  for (let n = 1; n <= plazoMeses; n++) {
    const interes = Math.round(saldo * i);
    let abonoCapital = cuotaMensual - interes;
    
    // Ajuste en la última cuota para evitar desfases de redondeo
    if (n === plazoMeses || abonoCapital > saldo) {
      abonoCapital = saldo;
    }

    saldo = Math.max(0, saldo - abonoCapital);
    totalIntereses += interes;

    tablaAmortizacion.push({
      numeroCuota: n,
      cuotaFija: cuotaMensual,
      interes,
      abonoCapital,
      saldoPendiente: saldo,
    });
  }

  const totalPagar = monto + totalIntereses;

  return {
    cuotaMensual,
    totalPagar,
    totalIntereses,
    numeroCuotas: plazoMeses,
    tablaAmortizacion,
  };
}

/**
 * Calcula el rendimiento y liquidación de un CDT
 * Retención en la fuente sobre rendimientos financieros (4% en Colombia)
 */
export function calculateCDTSimulation(
  inversion: number,
  plazoDias: number,
  tasaRentabilidadEA: number
): SimulacionCDTResultados {
  if (inversion <= 0 || plazoDias <= 0 || tasaRentabilidadEA <= 0) {
    return {
      rendimientoEstimado: 0,
      retencionFuente: 0,
      montoTotalFinal: 0,
    };
  }

  // Rendimiento bruto = Inversión * (tasaEA / 100) * (plazoDias / 365)
  const rendimientoBruto = Math.round(inversion * (tasaRentabilidadEA / 100) * (plazoDias / 365));
  // Retención en la fuente del 4% sobre rendimientos
  const retencionFuente = Math.round(rendimientoBruto * 0.04);
  const rendimientoNeto = rendimientoBruto - retencionFuente;
  const montoTotalFinal = inversion + rendimientoNeto;

  return {
    rendimientoEstimado: rendimientoBruto,
    retencionFuente,
    montoTotalFinal,
  };
}

/**
 * Calcula ahorro programado con aportes mensuales e interés compuesto
 */
export function calculateSavingsSimulation(
  ahorroInicial: number,
  aporteMensual: number,
  plazoMeses: number,
  tasaInteresEA: number
): SimulacionAhorroResultados {
  if (plazoMeses <= 0) {
    return { totalAportado: 0, interesesGenerados: 0, saldoFinal: 0 };
  }

  const tasaMensual = convertEAToMonthlyRate(tasaInteresEA) / 100;
  let saldo = ahorroInicial;
  let totalAportado = ahorroInicial;

  for (let m = 1; m <= plazoMeses; m++) {
    const interesDelMes = saldo * tasaMensual;
    saldo = saldo + interesDelMes + aporteMensual;
    totalAportado += aporteMensual;
  }

  saldo = Math.round(saldo);
  const interesesGenerados = Math.max(0, Math.round(saldo - totalAportado));

  return {
    totalAportado,
    interesesGenerados,
    saldoFinal: saldo,
  };
}
