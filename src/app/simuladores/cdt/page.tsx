'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getProductos } from '@/actions/productos.actions';
import { saveSimulacion } from '@/actions/simulaciones.actions';
import { ProductoFinanciero } from '@/types/producto';
import { calculateCDTSimulation } from '@/lib/financial-math';
import { formatCurrency, formatPercent } from '@/lib/formatters';
import {
  TrendingUp,
  Save,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Calendar,
  DollarSign,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

function SimuladorCDTContent() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const productoIdParam = searchParams.get('productoId');

  const [productosCDT, setProductosCDT] = useState<ProductoFinanciero[]>([]);
  const [selectedProducto, setSelectedProducto] = useState<ProductoFinanciero | null>(null);

  // Entradas
  const [inversion, setInversion] = useState<number>(20000000);
  const [plazoDias, setPlazoDias] = useState<number>(360);
  const [tasaEA, setTasaEA] = useState<number>(11.60);

  // Datos del cliente
  const [clienteNombre, setClienteNombre] = useState<string>('');
  const [clienteDocumento, setClienteDocumento] = useState<string>('');

  // Estados
  const [errores, setErrores] = useState<string[]>([]);
  const [guardadoExitoso, setGuardadoExitoso] = useState<boolean>(false);
  const [guardando, setGuardando] = useState<boolean>(false);

  useEffect(() => {
    async function load() {
      const data = await getProductos();
      const cdts = data.filter(p => p.categoria === 'cdt');
      setProductosCDT(cdts);

      if (productoIdParam) {
        const found = cdts.find(c => c.id === productoIdParam);
        if (found) {
          applyProducto(found);
          return;
        }
      }

      if (cdts.length > 0) {
        applyProducto(cdts[0]);
      }
    }
    load();
  }, [productoIdParam]);

  const applyProducto = (prod: ProductoFinanciero) => {
    setSelectedProducto(prod);
    setTasaEA(prod.tasaEfectivaAnual);
    if (inversion < prod.montoMinimo) setInversion(prod.montoMinimo);
  };

  const handleProductoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const found = productosCDT.find(p => p.id === id);
    if (found) {
      applyProducto(found);
    }
  };

  // Validaciones
  useEffect(() => {
    const errs: string[] = [];
    if (!inversion || inversion <= 0) {
      errs.push('El valor de la inversión debe ser un monto positivo.');
    }
    if (selectedProducto && inversion < selectedProducto.montoMinimo) {
      errs.push(`La inversión mínima para este CDT es de ${formatCurrency(selectedProducto.montoMinimo)}.`);
    }
    if (!plazoDias || plazoDias < 30) {
      errs.push('El plazo mínimo de constitución de un CDT es de 30 días.');
    }
    if (!tasaEA || tasaEA <= 0) {
      errs.push('La tasa de rentabilidad debe ser mayor a 0%.');
    }
    setErrores(errs);
  }, [inversion, plazoDias, tasaEA, selectedProducto]);

  const resultados = calculateCDTSimulation(
    errores.length === 0 ? inversion : 0,
    errores.length === 0 ? plazoDias : 0,
    tasaEA
  );

  const handleGuardar = async () => {
    if (!clienteNombre.trim() || !clienteDocumento.trim()) {
      alert('Ingresa el nombre y cédula del cliente para guardar la simulación.');
      return;
    }

    setGuardando(true);
    const res = await saveSimulacion({
      tipo: 'cdt',
      asesorId: user?.id || 'usr-anon',
      asesorNombre: user?.nombre || 'Asesor Financiero',
      clienteNombre: clienteNombre.trim(),
      clienteDocumento: clienteDocumento.trim(),
      productoId: selectedProducto?.id || 'prod-cdt-tradicional',
      productoNombre: selectedProducto?.nombre || 'Certificado de Depósito a Término',
      parametros: {
        inversion,
        plazoDias,
        tasaRentabilidadEA: tasaEA,
      },
      resultados: {
        rendimientoEstimado: resultados.rendimientoEstimado,
        retencionFuente: resultados.retencionFuente,
        montoTotalFinal: resultados.montoTotalFinal,
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Simulador de Inversión y Rentabilidad • F06 EV9</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Simulador de CDT (Certificado de Depósito a Término)
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Calcula el rendimiento estimado de tu inversión, los intereses brutos, la retención en la fuente y el monto neto garantizado a recibir al vencimiento.
          </p>
        </div>

        {errores.length > 0 && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
            <div className="flex items-center gap-2 font-bold text-amber-800 mb-1">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              Validaciones de la Inversión:
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
              <p className="font-bold">¡Simulación de CDT guardada exitosamente!</p>
              <p className="text-emerald-700">Quedó registrada en el historial para auditoría y seguimiento del cliente.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Formulario de Entrada */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-slate-900">
                1. Datos de la Inversión
              </h2>
              <span className="text-xs text-slate-500">Parámetros del CDT</span>
            </div>

            {/* Tipo de CDT */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Modalidad de CDT
              </label>
              <select
                value={selectedProducto?.id || ''}
                onChange={handleProductoChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                {productosCDT.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} (Tasa: {formatPercent(p.tasaEfectivaAnual)} E.A.)
                  </option>
                ))}
              </select>
            </div>

            {/* Monto de Inversión */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Valor a Invertir ($ COP)
                </label>
                <span className="text-xs font-bold text-emerald-700 font-mono">
                  {formatCurrency(inversion)}
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">$</span>
                <input
                  type="number"
                  min={selectedProducto?.montoMinimo || 500000}
                  step={500000}
                  value={inversion}
                  onChange={(e) => setInversion(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                />
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {[5000000, 10000000, 20000000, 50000000, 100000000].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setInversion(val)}
                    className="px-2 py-1 rounded-md text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    ${val / 1000000}M
                  </button>
                ))}
              </div>
            </div>

            {/* Plazo en Días */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Tiempo de Inversión (Días)
                </label>
                <span className="text-xs font-bold text-emerald-700 font-mono">
                  {plazoDias} días (aprox. {Math.round(plazoDias / 30)} meses)
                </span>
              </div>
              <input
                type="range"
                min={30}
                max={1080}
                step={30}
                value={plazoDias}
                onChange={(e) => setPlazoDias(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="mt-2 flex items-center gap-2">
                {[
                  { dias: 90, label: '90 días' },
                  { dias: 180, label: '180 días' },
                  { dias: 360, label: '360 días (1 año)' },
                  { dias: 720, label: '720 días (2 años)' },
                ].map(item => (
                  <button
                    key={item.dias}
                    type="button"
                    onClick={() => setPlazoDias(item.dias)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold border transition-colors ${
                      plazoDias === item.dias
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tasa E.A. */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Tasa de Rentabilidad Efectiva Anual (% E.A.)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.05"
                  value={tasaEA}
                  onChange={(e) => setTasaEA(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">% E.A.</span>
              </div>
            </div>

            {/* Datos del Cliente */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                2. Titular de la Proyección (Historial)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nombre Inversionista</label>
                  <input
                    type="text"
                    value={clienteNombre}
                    onChange={(e) => setClienteNombre(e.target.value)}
                    placeholder="Ej. María Fernanda López"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Cédula</label>
                  <input
                    type="text"
                    value={clienteDocumento}
                    onChange={(e) => setClienteDocumento(e.target.value)}
                    placeholder="Ej. 52896321"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="button"
                disabled={guardando || errores.length > 0}
                onClick={handleGuardar}
                className="w-full mt-2 py-2.5 rounded-xl font-bold text-xs text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-3.5 h-3.5 text-emerald-400" />
                {guardando ? 'Guardando...' : 'Registrar Simulación de CDT'}
              </button>
            </div>

          </div>

          {/* Tarjeta de Liquidación Estimada */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                    Liquidación Proyectada al Vencimiento
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Respaldo Fogafín
                  </span>
                </div>

                <div>
                  <span className="text-xs text-slate-300 font-medium">Monto Total a Recibir (Capital + Rendimiento Neto)</span>
                  <p className="text-4xl sm:text-5xl font-black text-white tracking-tight mt-1 font-mono">
                    {formatCurrency(resultados.montoTotalFinal)}
                  </p>
                  <p className="text-[11px] text-emerald-400 mt-1">
                    * Rentabilidad garantizada fija desde el día 1 de apertura.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">Rendimiento Bruto</span>
                    <p className="text-xl font-bold text-emerald-400 mt-0.5">
                      +{formatCurrency(resultados.rendimientoEstimado)}
                    </p>
                    <span className="text-[10px] text-slate-400">Intereses generados</span>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">Retención en Fuente (4%)</span>
                    <p className="text-xl font-bold text-amber-400 mt-0.5">
                      -{formatCurrency(resultados.retencionFuente)}
                    </p>
                    <span className="text-[10px] text-slate-400">Impuesto normativo</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs text-slate-300">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Inversión Inicial:</span>
                    <span className="font-bold text-white">{formatCurrency(inversion)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase block">Plazo Pactado:</span>
                    <span className="font-bold text-emerald-300">{plazoDias} Días</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Garantía y Solidez */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Seguro de Depósitos Fogafín
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Los Certificados de Depósito a Término de Banco Central Financiero se encuentran cubiertos por el Seguro de Depósitos de FOGAFIN por hasta $50.000.000 COP por titular, asegurando tu tranquilidad patrimonial.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default function SimuladorCDTPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SimuladorCDTContent />
    </Suspense>
  );
}
