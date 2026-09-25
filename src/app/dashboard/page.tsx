'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getProductos } from '@/actions/productos.actions';
import { getSimulaciones } from '@/actions/simulaciones.actions';
import { ProductoFinanciero } from '@/types/producto';
import { Simulacion } from '@/types/simulacion';
import { formatCurrency, formatPercent, formatDate } from '@/lib/formatters';
import {
  Calculator,
  TrendingUp,
  PiggyBank,
  History,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [productos, setProductos] = useState<ProductoFinanciero[]>([]);
  const [simulaciones, setSimulaciones] = useState<Simulacion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [prods, sims] = await Promise.all([
        getProductos(),
        getSimulaciones(),
      ]);
      setProductos(prods);
      setSimulaciones(sims);
      setLoading(false);
    }
    loadData();
  }, []);

  const totalSimulaciones = simulaciones.length;
  const recentSims = simulaciones.slice(0, 4);

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Banner de Bienvenida del Asesor */}
        <div className="bg-gradient-to-r from-bank-950 via-bank-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-bank-300">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>Sesión activa • {user?.cargo || 'Asesor Financiero'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Bienvenida(o), {user?.nombre || 'Asesor Financiero'}
            </h1>
            <p className="text-xs text-slate-300">
              Sucursal: {user?.sucursal || 'Sede Principal Centro - La Dorada'}
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/simuladores/credito"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-bank-600 hover:bg-bank-500 shadow-sm transition-all"
            >
              <Calculator className="w-4 h-4" />
              Simulador de Crédito
            </Link>
            <Link
              href="/simulaciones/historial"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-slate-200 bg-white/10 hover:bg-white/20 border border-white/10 transition-all"
            >
              <History className="w-4 h-4" />
              Ver Historial ({totalSimulaciones})
            </Link>
          </div>
        </div>

        {/* Módulos de Simulación Rápidos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card Crédito */}
          <Link
            href="/simuladores/credito"
            className="group bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:border-bank-500 hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-bank-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Calculator className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-bank-700 transition-colors">
                Simulador de Créditos
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Calcula cuotas fijas mensuales con sistema francés, genera tablas de amortización detalladas e imprime propuestas comerciales para el cliente.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-bank-600">
              <span>Iniciar simulación</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card CDT */}
          <Link
            href="/simuladores/cdt"
            className="group bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:border-emerald-500 hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                Simulador de Inversión CDT
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Proyecta rendimientos garantizados en plazos de 30 a 1080 días, con cálculo automático de retención en la fuente y monto total final.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600">
              <span>Proyectar CDT</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card Ahorro */}
          <Link
            href="/simuladores/ahorro"
            className="group bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:border-amber-500 hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <PiggyBank className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                Simulador de Ahorro Programado
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Estima el crecimiento patrimonial del cliente mediante aportes periódicos recurrentes y capitalización mensual de intereses.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600">
              <span>Calcular ahorro</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

        </div>

        {/* Sección Tasas Vigentes y Últimas Simulaciones */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Tasas Vigentes */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-bank-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Tasas de Referencia Vigentes
                </h3>
              </div>
              <Link href="/productos" className="text-xs text-bank-600 hover:underline font-semibold">
                Ver catálogo
              </Link>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {productos.slice(0, 5).map((p) => (
                <div key={p.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">{p.nombre}</p>
                    <p className="text-[11px] text-slate-400 capitalize">{p.tipo.replace('_', ' ')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">{formatPercent(p.tasaNominalMensual)} M.V.</p>
                    <p className="text-[10px] text-emerald-600 font-semibold">{formatPercent(p.tasaEfectivaAnual)} E.A.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Últimas Simulaciones Realizadas */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-bank-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Actividad Reciente en Sucursal
                </h3>
              </div>
              <Link href="/simulaciones/historial" className="text-xs text-bank-600 hover:underline font-semibold">
                Historial completo
              </Link>
            </div>

            {recentSims.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No hay simulaciones registradas aún.</p>
            ) : (
              <div className="space-y-3">
                {recentSims.map((s) => (
                  <div
                    key={s.id}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                          s.tipo === 'credito' ? 'bg-blue-100 text-blue-800' :
                          s.tipo === 'cdt' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {s.tipo}
                        </span>
                        <span className="font-bold text-slate-800">{s.clienteNombre}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">{s.productoNombre}</p>
                    </div>

                    <div className="text-right">
                      <p className="font-mono font-bold text-slate-900">
                        {s.tipo === 'credito' && formatCurrency(s.resultados.cuotaMensual) + ' /mes'}
                        {s.tipo === 'cdt' && formatCurrency(s.resultados.montoTotalFinal)}
                        {s.tipo === 'ahorro' && formatCurrency(s.resultados.saldoFinal)}
                      </p>
                      <p className="text-[10px] text-slate-400">{formatDate(s.fecha)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
