'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getProductos } from '@/actions/productos.actions';
import { saveSimulacion } from '@/actions/simulaciones.actions';
import { ProductoFinanciero } from '@/types/producto';
import { calculateCreditSimulation } from '@/lib/financial-math';
import { formatCurrency, formatPercent } from '@/lib/formatters';
import TablaAmortizacion from '@/components/simuladores/TablaAmortizacion';
import {
  Calculator,
  Save,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  Printer,
  User,
  CreditCard,
  Calendar,
  Percent,
} from 'lucide-react';

function SimuladorCreditoContent() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const productoIdParam = searchParams.get('productoId');

  const [productos, setProductos] = useState<ProductoFinanciero[]>([]);
  const [selectedProducto, setSelectedProducto] = useState<ProductoFinanciero | null>(null);

  // Campos de formulario
  const [tipoCredito, setTipoCredito] = useState<string>('libre_inversion');
  const [monto, setMonto] = useState<number>(15000000);
  const [plazoMeses, setPlazoMeses] = useState<number>(36);
  const [tasaMensual, setTasaMensual] = useState<number>(1.45);
  
  // Datos del cliente para guardar propuesta
  const [clienteNombre, setClienteNombre] = useState<string>('');
  const [clienteDocumento, setClienteDocumento] = useState<string>('');
  
  // Estado y validaciones
  const [errores, setErrores] = useState<string[]>([]);
  const [guardadoExitoso, setGuardadoExitoso] = useState<boolean>(false);
  const [guardando, setGuardando] = useState<boolean>(false);

  useEffect(() => {
    async function load() {
      const data = await getProductos();
      const creditos = data.filter(p => p.categoria === 'credito');
      setProductos(creditos);

      if (productoIdParam) {
        const found = creditos.find(c => c.id === productoIdParam);
        if (found) {
          applyProducto(found);
          return;
        }
      }

      if (creditos.length > 0) {
        applyProducto(creditos[0]);
      }
    }
    load();
  }, [productoIdParam]);

  const applyProducto = (prod: ProductoFinanciero) => {
    setSelectedProducto(prod);
    setTipoCredito(prod.tipo);
    setTasaMensual(prod.tasaNominalMensual);
    // Ajustar plazo y monto dentro de límites
    if (monto < prod.montoMinimo) setMonto(prod.montoMinimo);
    if (monto > prod.montoMaximo) setMonto(prod.montoMaximo);
    if (plazoMeses < prod.plazoMinimoMeses) setPlazoMeses(prod.plazoMinimoMeses);
    if (plazoMeses > prod.plazoMaximoMeses) setPlazoMeses(prod.plazoMaximoMeses);
  };

  const handleTipoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setTipoCredito(val);
    const prod = productos.find(p => p.tipo === val);
    if (prod) {
      applyProducto(prod);
    }
  };

  // Validación de datos estricta (Requisito 8 del documento EV9)
  const validarFormulario = (): boolean => {
    const errs: string[] = [];

    if (!monto || isNaN(monto) || monto <= 0) {
      errs.push('El monto solicitado debe ser un valor numérico positivo mayor a 0.');
    }
    if (selectedProducto) {
      if (monto < selectedProducto.montoMinimo) {
        errs.push(`El monto mínimo para ${selectedProducto.nombre} es de ${formatCurrency(selectedProducto.montoMinimo)}.`);
      }
      if (monto > selectedProducto.montoMaximo) {
        errs.push(`El monto máximo permitido para este crédito es de ${formatCurrency(selectedProducto.montoMaximo)}.`);
      }
      if (plazoMeses < selectedProducto.plazoMinimoMeses || plazoMeses > selectedProducto.plazoMaximoMeses) {
        errs.push(`El plazo debe estar entre ${selectedProducto.plazoMinimoMeses} y ${selectedProducto.plazoMaximoMeses} meses.`);
      }
    }
    if (!plazoMeses || isNaN(plazoMeses) || plazoMeses <= 0) {
      errs.push('El plazo en meses debe ser un número entero positivo.');
    }
    if (!tasaMensual || isNaN(tasaMensual) || tasaMensual <= 0) {
      errs.push('La tasa de interés debe ser mayor a 0%.');
    }

    setErrores(errs);
    return errs.length === 0;
  };

  useEffect(() => {
    validarFormulario();
  }, [monto, plazoMeses, tasaMensual, selectedProducto]);

  // Cálculo en tiempo real de la simulación
  const resultados = calculateCreditSimulation(
    errores.length === 0 ? monto : 0,
    errores.length === 0 ? plazoMeses : 0,
    tasaMensual
  );

  const handleGuardarSimulacion = async () => {
    if (!clienteNombre.trim() || !clienteDocumento.trim()) {
      alert('Por favor digita el nombre y documento del cliente para registrar la simulación.');
      return;
    }

    setGuardando(true);
    const res = await saveSimulacion({
      tipo: 'credito',
      asesorId: user?.id || 'usr-anon',
      asesorNombre: user?.nombre || 'Asesor Financiero',
      clienteNombre: clienteNombre.trim(),
      clienteDocumento: clienteDocumento.trim(),
      productoId: selectedProducto?.id || 'prod-custom',
      productoNombre: selectedProducto?.nombre || `Crédito de ${tipoCredito}`,
      parametros: {
        monto,
        plazo: plazoMeses,
        tasaNominalMensual: tasaMensual,
        tasaEfectivaAnual: selectedProducto?.tasaEfectivaAnual || (tasaMensual * 12),
        tipoCredito,
      },
      resultados: {
        cuotaMensual: resultados.cuotaMensual,
        totalPagar: resultados.totalPagar,
        totalIntereses: resultados.totalIntereses,
        numeroCuotas: resultados.numeroCuotas,
      },
    });

    setGuardando(false);
    if (res.success) {
      setGuardadoExitoso(true);
      setTimeout(() => setGuardadoExitoso(false), 4000);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabecera */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-bank-100 text-bank-800 border border-bank-200 mb-2">
            <Calculator className="w-3.5 h-3.5" />
            <span>Módulo Oficial de Proyección y Crédito • EV9</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Simulador de Crédito & Tabla de Amortización
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Calcula la cuota aproximada mensual, el costo financiero total y genera la tabla de amortización detallada bajo el sistema de cuota fija francés.
          </p>
        </div>

        {/* Notificaciones de Validación */}
        {errores.length > 0 && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
            <div className="flex items-center gap-2 font-bold text-amber-800 mb-1">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              Validación de Parámetros del Crédito:
            </div>
            {errores.map((err, i) => (
              <p key={i} className="pl-6">• {err}</p>
            ))}
          </div>
        )}

        {guardadoExitoso && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold">¡Simulación registrada exitosamente!</p>
              <p className="text-emerald-700">Se ha guardado en el historial para consulta y auditoría de la sucursal.</p>
            </div>
          </div>
        )}

        {/* Panel Principal Dividido: Formulario y Resultados */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Columna Izquierda: Parámetros de Simulación */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-slate-900">
                1. Configuración del Crédito
              </h2>
              <span className="text-xs text-slate-500">Parámetros del Producto</span>
            </div>

            {/* Selector de Tipo de Crédito */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Línea / Modalidad de Crédito
              </label>
              <select
                value={tipoCredito}
                onChange={handleTipoChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-bank-500 focus:outline-none bg-white"
              >
                {productos.map(p => (
                  <option key={p.id} value={p.tipo}>
                    {p.nombre} (Tasa: {formatPercent(p.tasaNominalMensual)} M.V.)
                  </option>
                ))}
              </select>
            </div>

            {/* Monto Solicitado */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Monto Solicitado ($ COP)
                </label>
                <span className="text-xs font-bold text-bank-700 font-mono">
                  {formatCurrency(monto)}
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">$</span>
                <input
                  type="number"
                  min={selectedProducto?.montoMinimo || 500000}
                  max={selectedProducto?.montoMaximo || 500000000}
                  step={500000}
                  value={monto}
                  onChange={(e) => setMonto(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-bank-500 focus:outline-none font-mono"
                />
              </div>

              {selectedProducto && (
                <div className="mt-2 flex justify-between text-[11px] text-slate-400">
                  <span>Mín: {formatCurrency(selectedProducto.montoMinimo)}</span>
                  <span>Máx: {formatCurrency(selectedProducto.montoMaximo)}</span>
                </div>
              )}
            </div>

            {/* Plazo en Meses */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Plazo de Amortización (Meses)
                </label>
                <span className="text-xs font-bold text-bank-700 font-mono">
                  {plazoMeses} meses ({(plazoMeses / 12).toFixed(1)} años)
                </span>
              </div>
              <input
                type="range"
                min={selectedProducto?.plazoMinimoMeses || 6}
                max={selectedProducto?.plazoMaximoMeses || 120}
                step={6}
                value={plazoMeses}
                onChange={(e) => setPlazoMeses(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-bank-600"
              />
              <div className="mt-2 flex items-center gap-2">
                {[12, 24, 36, 48, 60, 72].map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPlazoMeses(m)}
                    className={`px-2 py-1 rounded-md text-[11px] font-bold border transition-colors ${
                      plazoMeses === m
                        ? 'bg-bank-700 text-white border-bank-700'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {m}m
                  </button>
                ))}
              </div>
            </div>

            {/* Tasa de Interés */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tasa Periódica Mensual (% M.V.)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    value={tasaMensual}
                    onChange={(e) => setTasaMensual(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-bank-500 focus:outline-none"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">%</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tasa Efectiva Anual (E.A.)
                </label>
                <div className="px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
                  {selectedProducto ? formatPercent(selectedProducto.tasaEfectivaAnual) : `${(tasaMensual * 12).toFixed(2)}%`} E.A.
                </div>
              </div>
            </div>

            {/* Información del Cliente para Registro de Propuesta */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                2. Datos de Asesoría al Cliente (Para Historial Oficial)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nombre del Cliente</label>
                  <input
                    type="text"
                    value={clienteNombre}
                    onChange={(e) => setClienteNombre(e.target.value)}
                    placeholder="Ej. Juan Gómez"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-bank-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Cédula / Documento</label>
                  <input
                    type="text"
                    value={clienteDocumento}
                    onChange={(e) => setClienteDocumento(e.target.value)}
                    placeholder="Ej. 1020304050"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-bank-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="button"
                disabled={guardando || errores.length > 0}
                onClick={handleGuardarSimulacion}
                className="w-full mt-2 py-2.5 rounded-xl font-bold text-xs text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-3.5 h-3.5 text-bank-300" />
                {guardando ? 'Guardando en base de datos...' : 'Guardar Simulación en Historial'}
              </button>
            </div>

          </div>

          {/* Columna Derecha: Tarjeta Resumen de Resultados */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="bg-gradient-to-br from-slate-900 via-bank-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <CreditCard className="w-36 h-36" />
              </div>

              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-bank-300">
                    Proyección de Resultados
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Sistema Francés
                  </span>
                </div>

                <div>
                  <span className="text-xs text-slate-300 font-medium">Valor Aproximado de la Cuota Mensual</span>
                  <p className="text-4xl sm:text-5xl font-black text-white tracking-tight mt-1 font-mono">
                    {formatCurrency(resultados.cuotaMensual)}
                    <span className="text-xs text-slate-400 font-normal"> / mes</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    * Cuota fija mes a mes durante los {plazoMeses} meses pactados.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">Total a Pagar</span>
                    <p className="text-xl font-bold text-white mt-0.5">
                      {formatCurrency(resultados.totalPagar)}
                    </p>
                    <span className="text-[10px] text-slate-400">Capital + Intereses</span>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">Total Intereses</span>
                    <p className="text-xl font-bold text-amber-400 mt-0.5">
                      {formatCurrency(resultados.totalIntereses)}
                    </p>
                    <span className="text-[10px] text-slate-400">Costo del crédito</span>
                  </div>
                </div>

                {/* Ficha Rápida del Asesor */}
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs text-slate-300">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Asesor que realiza la simulación:</span>
                    <span className="font-bold text-white">{user?.nombre || 'Cindi Tatiana Marulanda'}</span>
                  </div>
                  <span className="text-[11px] text-bank-300">{user?.sucursal || 'Sede La Dorada'}</span>
                </div>
              </div>
            </div>

            {/* Requisitos y Beneficios del Crédito Seleccionado */}
            {selectedProducto && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Condiciones & Beneficios de la Línea
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <h4 className="font-semibold text-slate-700 mb-1.5">Beneficios:</h4>
                    <ul className="space-y-1 text-slate-600">
                      {selectedProducto.beneficios.map((b, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-700 mb-1.5">Requisitos exigidos:</h4>
                    <ul className="space-y-1 text-slate-500 list-disc list-inside">
                      {selectedProducto.requisitos.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Tabla de Amortización Detallada (Requisito F05 de EV9) */}
        {resultados.tablaAmortizacion && (
          <TablaAmortizacion
            cuotas={resultados.tablaAmortizacion}
            montoTotal={monto}
            totalIntereses={resultados.totalIntereses}
            totalPagar={resultados.totalPagar}
            clienteNombre={clienteNombre}
            tipoCredito={selectedProducto?.nombre || tipoCredito}
          />
        )}

      </div>
    </div>
  );
}

export default function SimuladorCreditoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-bank-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SimuladorCreditoContent />
    </Suspense>
  );
}
