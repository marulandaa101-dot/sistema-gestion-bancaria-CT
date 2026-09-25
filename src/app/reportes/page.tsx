'use client';

import React, { useState, useEffect } from 'react';
import { getSimulaciones } from '@/actions/simulaciones.actions';
import { Simulacion } from '@/types/simulacion';
import { formatCurrency, formatPercent } from '@/lib/formatters';
import {
  BarChart3,
  TrendingUp,
  CreditCard,
  PiggyBank,
  Users,
  Printer,
  Calendar,
  CheckCircle,
  FileSpreadsheet,
} from 'lucide-react';

export default function ReportesPage() {
  const [simulaciones, setSimulaciones] = useState<Simulacion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getSimulaciones();
      setSimulaciones(data);
      setLoading(false);
    }
    load();
  }, []);

  // Métricas calculadas
  const totalSimulaciones = simulaciones.length;
  
  const simsCredito = simulaciones.filter(s => s.tipo === 'credito');
  const simsCDT = simulaciones.filter(s => s.tipo === 'cdt');
  const simsAhorro = simulaciones.filter(s => s.tipo === 'ahorro');

  const montoTotalCredito = simsCredito.reduce((acc, s) => acc + (s.parametros.monto || 0), 0);
  const montoTotalCDT = simsCDT.reduce((acc, s) => acc + (s.parametros.inversion || 0), 0);
  const montoTotalAhorro = simsAhorro.reduce((acc, s) => acc + (s.resultados.saldoFinal || 0), 0);

  // Agrupación por asesor
  const asesoresMap: { [nombre: string]: { count: number; montoCredito: number } } = {};
  simulaciones.forEach(s => {
    const name = s.asesorNombre || 'Asesor General';
    if (!asesoresMap[name]) {
      asesoresMap[name] = { count: 0, montoCredito: 0 };
    }
    asesoresMap[name].count += 1;
    if (s.tipo === 'credito') {
      asesoresMap[name].montoCredito += (s.parametros.monto || 0);
    }
  });

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabecera */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 mb-2">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Módulo Gerencial de Análisis y Supervisión • F12 EV9</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Reportes de Gestión y Simulaciones
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Indicadores consolidados para apoyar la toma de decisiones, supervisar la actividad de los asesores y monitorear la demanda de productos financieros.
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition-all"
          >
            <Printer className="w-4 h-4" />
            Imprimir Informe Gerencial
          </button>
        </div>

        {/* Tarjetas KPI de Resumen */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Simulaciones Totales</span>
              <div className="p-2 rounded-xl bg-bank-50 text-bank-600">
                <BarChart3 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900">{totalSimulaciones}</p>
            <p className="text-[11px] text-slate-500 mt-1">Registradas en sucursal</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Colocación Cotizada</span>
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-blue-700">{formatCurrency(montoTotalCredito)}</p>
            <p className="text-[11px] text-slate-500 mt-1">{simsCredito.length} solicitudes de crédito</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Captación en CDT</span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-emerald-700">{formatCurrency(montoTotalCDT)}</p>
            <p className="text-[11px] text-slate-500 mt-1">{simsCDT.length} proyecciones de inversión</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Metas de Ahorro</span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <PiggyBank className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-amber-700">{formatCurrency(montoTotalAhorro)}</p>
            <p className="text-[11px] text-slate-500 mt-1">{simsAhorro.length} planes proyectados</p>
          </div>

        </div>

        {/* Sección de Detalle: Distribución por Producto y Asesor */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Actividad de Asesores */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-bank-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Desempeño y Actividad por Asesor
                </h3>
              </div>
              <span className="text-xs text-slate-400">Total: {Object.keys(asesoresMap).length} asesores</span>
            </div>

            <div className="space-y-4">
              {Object.entries(asesoresMap).map(([nombre, stats]) => (
                <div key={nombre} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-slate-900 text-xs sm:text-sm">{nombre}</p>
                    <span className="text-xs font-extrabold text-bank-700 bg-bank-100 px-2 py-0.5 rounded-full">
                      {stats.count} simulaciones
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <span>Monto cotizado en créditos:</span>
                    <span className="font-bold text-slate-800">{formatCurrency(stats.montoCredito)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Distribución por Categoría de Producto */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Demanda por Tipo de Solución
                </h3>
              </div>
              <span className="text-xs text-slate-400">Consolidado</span>
            </div>

            <div className="space-y-4">
              {/* Créditos */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Créditos (Libre Inversión, Vivienda, etc.)</span>
                  <span>{simsCredito.length} ({totalSimulaciones > 0 ? Math.round((simsCredito.length / totalSimulaciones) * 100) : 0}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all"
                    style={{ width: `${totalSimulaciones > 0 ? (simsCredito.length / totalSimulaciones) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* CDTs */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Inversiones a Término Fijo (CDT)</span>
                  <span>{simsCDT.length} ({totalSimulaciones > 0 ? Math.round((simsCDT.length / totalSimulaciones) * 100) : 0}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all"
                    style={{ width: `${totalSimulaciones > 0 ? (simsCDT.length / totalSimulaciones) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* Ahorro */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Cuentas y Planes de Ahorro</span>
                  <span>{simsAhorro.length} ({totalSimulaciones > 0 ? Math.round((simsAhorro.length / totalSimulaciones) * 100) : 0}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all"
                    style={{ width: `${totalSimulaciones > 0 ? (simsAhorro.length / totalSimulaciones) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 bg-slate-50 p-4 rounded-2xl text-xs text-slate-600">
              <p className="font-semibold text-slate-800 mb-1">Conclusión para la Dirección:</p>
              <p>
                Los productos de crédito representan la mayor demanda en las sucursales, requiriendo un enfoque prioritario en la optimización de los tiempos de asesoría y precisión de las cuotas.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
