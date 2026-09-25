import React from 'react';
import Link from 'next/link';
import { getInstitucionalData } from '@/actions/institucional.actions';
import { getProductos } from '@/actions/productos.actions';
import {
  Landmark,
  Calculator,
  ShieldCheck,
  TrendingUp,
  CreditCard,
  PiggyBank,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Users,
  Award,
  ChevronRight,
  PhoneCall,
} from 'lucide-react';
import { formatCurrency, formatPercent } from '@/lib/formatters';

export default async function HomePage() {
  const institucional = await getInstitucionalData();
  const productos = await getProductos();
  const creditos = productos.filter(p => p.categoria === 'credito').slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Section Corporativo */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-bank-950 to-slate-900 text-white py-20 lg:py-28">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        
        {/* Glow de fondo */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-bank-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Texto y Llamado a la Acción */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-bank-500/10 text-bank-300 border border-bank-400/20 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-bank-400" />
                <span>Sistema Unificado de Asesoría Financiera • EV9 SENA</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Asesoría financiera <span className="text-transparent bg-clip-text bg-gradient-to-r from-bank-400 via-bank-200 to-emerald-400">precisa, rápida y confiable</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                {institucional.entidad.eslogan}. Consulta nuestro catálogo integral de productos bancarios y proyecta créditos, CDTs y ahorro con tablas de amortización detalladas en un solo lugar.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/simuladores/credito"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-bank-600 to-bank-700 hover:from-bank-500 hover:to-bank-600 shadow-lg shadow-bank-700/30 transition-all hover:scale-[1.02]"
                >
                  <Calculator className="w-4 h-4 text-bank-200" />
                  Simular Crédito Ahora
                </Link>

                <Link
                  href="/productos"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm text-slate-200 bg-slate-800/80 hover:bg-slate-800 hover:text-white border border-slate-700 transition-all"
                >
                  <CreditCard className="w-4 h-4 text-slate-400" />
                  Ver Catálogo de Productos
                </Link>
              </div>

              {/* Indicadores de confianza */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800 text-left max-w-lg mx-auto lg:mx-0">
                <div>
                  <p className="text-2xl font-black text-white">100%</p>
                  <p className="text-xs text-slate-400 font-medium">Unificado para asesores</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-emerald-400">Cuota Fija</p>
                  <p className="text-xs text-slate-400 font-medium">Sistema Francés</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-bank-400">Fogafín</p>
                  <p className="text-xs text-slate-400 font-medium">CDTs respaldados</p>
                </div>
              </div>
            </div>

            {/* Tarjeta Visual Destacada de Acceso Rápido */}
            <div className="lg:col-span-5">
              <div className="relative bg-gradient-to-b from-slate-800/90 to-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between pb-6 border-b border-slate-700/60">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-bank-600/30 border border-bank-500/30 flex items-center justify-center text-bank-400">
                      <Landmark className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Módulos de Simulación</h3>
                      <p className="text-xs text-slate-400">Calculadoras en tiempo real</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Vigente 2026
                  </span>
                </div>

                <div className="mt-6 space-y-3">
                  {/* Tarjeta Crédito */}
                  <Link
                    href="/simuladores/credito"
                    className="group block p-4 rounded-2xl bg-slate-800/60 hover:bg-bank-900/40 border border-slate-700/60 hover:border-bank-500/50 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-bank-300 transition-colors">
                            Crédito de Libre Inversión / Vivienda
                          </p>
                          <p className="text-xs text-slate-400">
                            Desde 1.05% M.V. • Hasta 240 meses
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </Link>

                  {/* Tarjeta CDT */}
                  <Link
                    href="/simuladores/cdt"
                    className="group block p-4 rounded-2xl bg-slate-800/60 hover:bg-bank-900/40 border border-slate-700/60 hover:border-bank-500/50 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                          <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                            Certificados de Depósito a Término (CDT)
                          </p>
                          <p className="text-xs text-slate-400">
                            Rentabilidad hasta 11.60% E.A. garantizada
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </Link>

                  {/* Tarjeta Ahorro */}
                  <Link
                    href="/simuladores/ahorro"
                    className="group block p-4 rounded-2xl bg-slate-800/60 hover:bg-bank-900/40 border border-slate-700/60 hover:border-bank-500/50 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                          <PiggyBank className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                            Cuenta de Ahorro Programado
                          </p>
                          <p className="text-xs text-slate-400">
                            Interés compuesto mensual capitalizable
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </Link>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Cálculos validados y auditables
                  </span>
                  <Link href="/dashboard" className="text-bank-400 hover:text-bank-300 font-semibold flex items-center gap-1">
                    Abrir portal <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Sección Servicios Institucionales */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-bank-600 mb-2">
              Portafolio Integral
            </h2>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
              Soluciones diseñadas para tus proyectos
            </p>
            <p className="text-slate-600 text-sm mt-3">
              Consulta nuestra oferta institucional estandarizada según las especificaciones del diseño EV9.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {institucional.entidad.servicios.map((srv, idx) => (
              <div
                key={srv.id}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-bank-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-bank-100 text-bank-700 flex items-center justify-center font-bold text-sm mb-4">
                    0{idx + 1}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {srv.nombre}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {srv.descripcion}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200">
                  <Link
                    href="/productos"
                    className="text-xs font-bold text-bank-600 hover:text-bank-800 inline-flex items-center gap-1 group"
                  >
                    Conocer requisitos
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección Catálogo Destacado con Tasas */}
      <section className="py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-bank-600">Tasas Competitivas</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Líneas de Crédito Más Solicitadas
              </h2>
            </div>
            <Link
              href="/productos"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-bank-700 hover:text-bank-800 hover:underline"
            >
              Explorar todo el catálogo ({productos.length} productos)
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {creditos.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-bank-50 text-bank-700 border border-bank-200">
                      {prod.tipo.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-bold text-emerald-600">
                      Tasa fija
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {prod.nombre}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-4">
                    {prod.descripcion}
                  </p>

                  <div className="bg-slate-50 rounded-xl p-4 space-y-2 mb-4 border border-slate-100">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Tasa Nominal Mensual:</span>
                      <span className="font-bold text-slate-900">{formatPercent(prod.tasaNominalMensual)} M.V.</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Tasa Efectiva Anual:</span>
                      <span className="font-bold text-bank-700">{formatPercent(prod.tasaEfectivaAnual)} E.A.</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Plazo Máximo:</span>
                      <span className="font-medium text-slate-700">{prod.plazoMaximoMeses} meses</span>
                    </div>
                  </div>

                  <ul className="space-y-1.5 text-xs text-slate-600 mb-6">
                    {prod.beneficios.slice(0, 2).map((b, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={`/simuladores/credito?productoId=${prod.id}`}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-center text-white bg-bank-700 hover:bg-bank-800 shadow-sm transition-all"
                >
                  Simular esta línea de crédito
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reseña Institucional & Misión */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-slate-900 to-bank-950 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
            <div className="relative z-10 max-w-3xl space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-bank-400">
                Compromiso Institucional
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Misión de Nuestra Entidad Financiera
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                "{institucional.entidad.mision}"
              </p>
              <div className="pt-4 flex flex-wrap gap-4 items-center">
                <Link
                  href="/institucional"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  Conocer Misión, Visión y Valores
                </Link>
                <Link
                  href="/contacto"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-200 border border-slate-700 hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  Directorio de Sucursales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
