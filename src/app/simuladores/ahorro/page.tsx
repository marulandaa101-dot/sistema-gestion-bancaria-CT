'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getProductos } from '@/actions/productos.actions';
import { saveSimulacion } from '@/actions/simulaciones.actions';
import { ProductoFinanciero } from '@/types/producto';
import { calculateSavingsSimulation } from '@/lib/financial-math';
import { formatCurrency, formatPercent } from '@/lib/formatters';
import {
  PiggyBank,
  Save,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

function SimuladorAhorroContent() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const productoIdParam = searchParams.get('productoId');

  const [productosAhorro, setProductosAhorro] = useState<ProductoFinanciero[]>([]);
  const [selectedProducto, setSelectedProducto] = useState<ProductoFinanciero | null>(null);

  // Entradas
  const [ahorroInicial, setAhorroInicial] = useState<number>(1000000);
  const [aporteMensual, setAporteMensual] = useState<number>(200000);
  const [plazoMeses, setPlazoMeses] = useState<number>(24);
  const [tasaEA, setTasaEA] = useState<number>(6.80);

  // Cliente
  const [clienteNombre, setClienteNombre] = useState<string>('');
  const [clienteDocumento, setClienteDocumento] = useState<string>('');

  // Estados
  const [errores, setErrores] = useState<string[]>([]);
  const [guardadoExitoso, setGuardadoExitoso] = useState<boolean>(false);
  const [guardando, setGuardando] = useState<boolean>(false);

  useEffect(() => {
    async function load() {
      const data = await getProductos();
      const ahorros = data.filter(p => p.categoria === 'ahorro');
      setProductosAhorro(ahorros);

      if (productoIdParam) {
        const found = ahorros.find(c => c.id === productoIdParam);
        if (found) {
          applyProducto(found);
          return;
        }
      }

      if (ahorros.length > 0) {
        applyProducto(ahorros[0]);
      }
    }
    load();
  }, [productoIdParam]);

  const applyProducto = (prod: ProductoFinanciero) => {
    setSelectedProducto(prod);
    setTasaEA(prod.tasaEfectivaAnual);
    if (prod.tipo === 'ahorro_programado') {
      if (aporteMensual < 50000) setAporteMensual(50000);
    }
  };

  useEffect(() => {
    const errs: string[] = [];
    if (ahorroInicial < 0) errs.push('El ahorro inicial no puede ser negativo.');
    if (aporteMensual < 0) errs.push('El aporte mensual no puede ser negativo.');
    if (!plazoMeses || plazoMeses <= 0) errs.push('El plazo en meses debe ser mayor a cero.');
    if (tasaEA < 0) errs.push('La tasa no puede ser negativa.');
    setErrores(errs);
  }, [ahorroInicial, aporteMensual, plazoMeses, tasaEA]);

  const resultados = calculateSavingsSimulation(
    errores.length === 0 ? ahorroInicial : 0,
    errores.length === 0 ? aporteMensual : 0,
    errores.length === 0 ? plazoMeses : 0,
    tasaEA
  );

  const handleGuardar = async () => {
    if (!clienteNombre.trim() || !clienteDocumento.trim()) {
      alert('Ingresa el nombre y cédula del cliente para registrar la proyección de ahorro.');
      return;
    }

    setGuardando(true);
    const res = await saveSimulacion({
      tipo: 'ahorro',
      asesorId: user?.id || 'usr-anon',
      asesorNombre: user?.nombre || 'Asesor Financiero',
      clienteNombre: clienteNombre.trim(),
      clienteDocumento: clienteDocumento.trim(),
      productoId: selectedProducto?.id || 'prod-ahorro-programado',
      productoNombre: selectedProducto?.nombre || 'Cuenta de Ahorro Programado',
      parametros: {
        ahorroInicial,
        aporteMensual,
        plazoMeses,
        tasaInteresEA: tasaEA,
      },
      resultados: {
        totalAportado: resultados.totalAportado,
        interesesGenerados: resultados.interesesGenerados,
        saldoFinal: resultados.saldoFinal,
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 mb-2">
            <PiggyBank className="w-3.5 h-3.5" />
            <span>Simulador de Ahorro y Capitalización • F07 EV9</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Simulador de Ahorro Programado
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Calcula el crecimiento progresivo de tu patrimonio con depósitos periódicos mensuales y el poder del interés compuesto bancario.
          </p>
        </div>

        {errores.length > 0 && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
            <div className="flex items-center gap-2 font-bold text-amber-800 mb-1">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              Validación de Datos:
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
              <p className="font-bold">¡Plan de ahorro guardado con éxito!</p>
              <p className="text-emerald-700">Se encuentra en el historial para acompañamiento continuo del asesor.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Formulario */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-slate-900">
                1. Plan de Ahorro
              </h2>
              <span className="text-xs text-slate-500">Parámetros</span>
            </div>

            {/* Ahorro Inicial */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">Depósito Inicial de Apertura ($ COP)</label>
                <span className="text-xs font-bold text-amber-700 font-mono">{formatCurrency(ahorroInicial)}</span>
              </div>
              <input
                type="number"
                min={0}
                step={50000}
                value={ahorroInicial}
                onChange={(e) => setAhorroInicial(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            {/* Aporte Mensual */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">Aporte Periódico Mensual ($ COP)</label>
                <span className="text-xs font-bold text-amber-700 font-mono">{formatCurrency(aporteMensual)}</span>
              </div>
              <input
                type="number"
                min={0}
                step={20000}
                value={aporteMensual}
                onChange={(e) => setAporteMensual(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
              <div className="mt-2 flex gap-1.5">
                {[50000, 100000, 200000, 500000, 1000000].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAporteMensual(val)}
                    className="px-2 py-1 rounded-md text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
                  >
                    ${val / 1000}k
                  </button>
                ))}
              </div>
            </div>

            {/* Plazo */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">Plazo del Plan (Meses)</label>
                <span className="text-xs font-bold text-amber-700 font-mono">{plazoMeses} meses ({(plazoMeses / 12).toFixed(1)} años)</span>
              </div>
              <input
                type="range"
                min={6}
                max={60}
                step={6}
                value={plazoMeses}
                onChange={(e) => setPlazoMeses(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
              />
            </div>

            {/* Tasa E.A. */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Tasa de Rentabilidad Anual (% E.A.)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={tasaEA}
                  onChange={(e) => setTasaEA(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">% E.A.</span>
              </div>
            </div>

            {/* Datos del Cliente */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                2. Titular de la Meta de Ahorro
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nombre</label>
                  <input
                    type="text"
                    value={clienteNombre}
                    onChange={(e) => setClienteNombre(e.target.value)}
                    placeholder="Ej. Andrés Felipe Ruiz"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Documento</label>
                  <input
                    type="text"
                    value={clienteDocumento}
                    onChange={(e) => setClienteDocumento(e.target.value)}
                    placeholder="Ej. 1032456789"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="button"
                disabled={guardando || errores.length > 0}
                onClick={handleGuardar}
                className="w-full mt-2 py-2.5 rounded-xl font-bold text-xs text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-3.5 h-3.5 text-amber-400" />
                {guardando ? 'Guardando...' : 'Guardar Plan en Historial'}
              </button>
            </div>

          </div>

          {/* Tarjeta Resultados */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-gradient-to-br from-slate-900 via-amber-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Saldo Final Proyectado
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Interés Compuesto
                  </span>
                </div>

                <div>
                  <span className="text-xs text-slate-300 font-medium">Patrimonio Acumulado Estimado</span>
                  <p className="text-4xl sm:text-5xl font-black text-white tracking-tight mt-1 font-mono">
                    {formatCurrency(resultados.saldoFinal)}
                  </p>
                  <p className="text-[11px] text-amber-300 mt-1">
                    * Capital ahorrado mes a mes sumado al rendimiento generado.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">Total Aportes Realizados</span>
                    <p className="text-xl font-bold text-white mt-0.5">
                      {formatCurrency(resultados.totalAportado)}
                    </p>
                    <span className="text-[10px] text-slate-400">Tu capital propio</span>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">Intereses Ganados</span>
                    <p className="text-xl font-bold text-emerald-400 mt-0.5">
                      +{formatCurrency(resultados.interesesGenerados)}
                    </p>
                    <span className="text-[10px] text-slate-400">Ganancia financiera</span>
                  </div>
                </div>

              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs text-xs text-slate-600 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">Ventajas del Ahorro Programado BCF:</h4>
              <p>• Los intereses se liquidan sobre el saldo diario y se abonan a fin de cada mes calendario.</p>
              <p>• Exención del impuesto 4x1000 de acuerdo con los topes de ley vigentes.</p>
              <p>• Débito automático programable para no olvidar ninguna mensualidad.</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default function SimuladorAhorroPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SimuladorAhorroContent />
    </Suspense>
  );
}
