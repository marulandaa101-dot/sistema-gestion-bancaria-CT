'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProductoFinanciero, CategoriaProducto } from '@/types/producto';
import { getProductos } from '@/actions/productos.actions';
import { formatCurrency, formatPercent } from '@/lib/formatters';
import {
  Layers,
  Search,
  CheckCircle2,
  Calendar,
  CreditCard,
  TrendingUp,
  PiggyBank,
  FileText,
  ArrowRight,
  ShieldCheck,
  Percent,
} from 'lucide-react';

export default function ProductosPage() {
  const [productos, setProductos] = useState<ProductoFinanciero[]>([]);
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await getProductos();
      setProductos(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const filteredProductos = productos.filter((prod) => {
    const matchesCategory = filtroCategoria === 'todos' || prod.categoria === filtroCategoria;
    const matchesSearch =
      prod.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (cat: CategoriaProducto) => {
    switch (cat) {
      case 'credito':
        return <CreditCard className="w-5 h-5 text-bank-600" />;
      case 'cdt':
        return <TrendingUp className="w-5 h-5 text-emerald-600" />;
      case 'ahorro':
        return <PiggyBank className="w-5 h-5 text-amber-600" />;
    }
  };

  const getSimulateLink = (prod: ProductoFinanciero) => {
    if (prod.categoria === 'credito') {
      return `/simuladores/credito?productoId=${prod.id}`;
    } else if (prod.categoria === 'cdt') {
      return `/simuladores/cdt?productoId=${prod.id}`;
    } else {
      return `/simuladores/ahorro?productoId=${prod.id}`;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabecera */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-bank-100 text-bank-800 border border-bank-200 mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>Portafolio Oficial de Productos Financieros</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Catálogo Integral de Productos y Tasas
          </h1>
          <p className="text-base text-slate-600 mt-2">
            Consulta condiciones, tasas vigentes, beneficios y requisitos actualizados para brindar asesoría integral y transparente.
          </p>
        </div>

        {/* Barra de Filtros y Búsqueda */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Pestañas de Categoría */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {[
              { id: 'todos', label: 'Todos los Productos' },
              { id: 'credito', label: 'Créditos' },
              { id: 'cdt', label: 'Inversiones CDT' },
              { id: 'ahorro', label: 'Cuentas de Ahorro' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFiltroCategoria(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  filtroCategoria === cat.id
                    ? 'bg-bank-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Campo de Búsqueda */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nombre o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-bank-500 focus:outline-none"
            />
          </div>

        </div>

        {/* Listado de Productos */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-bank-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs text-slate-500 font-semibold">Cargando portafolio bancario...</p>
          </div>
        ) : filteredProductos.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No se encontraron productos</h3>
            <p className="text-xs text-slate-500 mt-1">Intenta con otro término de búsqueda o categoría.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProductos.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:border-bank-400 hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  
                  {/* Encabezado de la Card */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-slate-100">
                        {getCategoryIcon(prod.categoria)}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-bank-50 text-bank-700 border border-bank-200">
                        {prod.categoria}
                      </span>
                    </div>

                    <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {formatPercent(prod.tasaEfectivaAnual)} E.A.
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
                    {prod.nombre}
                  </h3>

                  <p className="text-xs text-slate-600 mb-4 line-clamp-3 leading-relaxed">
                    {prod.descripcion}
                  </p>

                  {/* Ficha de Tasas y Condiciones */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 mb-5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Percent className="w-3.5 h-3.5 text-bank-600" />
                        Tasa Periódica Mensual:
                      </span>
                      <span className="font-bold text-slate-900">
                        {formatPercent(prod.tasaNominalMensual)} M.V.
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Plazo Permitido:
                      </span>
                      <span className="font-medium text-slate-800">
                        {prod.plazoMinimoMeses} a {prod.plazoMaximoMeses} meses
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Monto Mínimo:</span>
                      <span className="font-semibold text-slate-800">
                        {formatCurrency(prod.montoMinimo)}
                      </span>
                    </div>
                  </div>

                  {/* Beneficios Clave */}
                  <div className="mb-4">
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Beneficios Principales
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {prod.beneficios.map((b, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Requisitos */}
                  <div className="mb-6">
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Requisitos de Solicitud
                    </h4>
                    <ul className="space-y-1 text-xs text-slate-500 list-disc list-inside">
                      {prod.requisitos.map((r, i) => (
                        <li key={i} className="line-clamp-1">{r}</li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* Botón Acción para Simular */}
                <Link
                  href={getSimulateLink(prod)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-center text-white bg-bank-700 hover:bg-bank-800 shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <span>Proyectar en Simulador</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
