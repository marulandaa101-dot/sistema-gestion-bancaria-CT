'use client';

import React, { useState, useEffect } from 'react';
import { getProductos, saveProducto } from '@/actions/productos.actions';
import { ProductoFinanciero } from '@/types/producto';
import { formatCurrency, formatPercent } from '@/lib/formatters';
import {
  Layers,
  Edit3,
  Percent,
  Calendar,
  DollarSign,
  CheckCircle2,
  X,
  CreditCard,
  TrendingUp,
  PiggyBank,
} from 'lucide-react';

export default function AdminProductosPage() {
  const [productos, setProductos] = useState<ProductoFinanciero[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProd, setEditingProd] = useState<ProductoFinanciero | null>(null);

  const [formData, setFormData] = useState({
    tasaNominalMensual: 0,
    tasaEfectivaAnual: 0,
    montoMinimo: 0,
    montoMaximo: 0,
    plazoMinimoMeses: 0,
    plazoMaximoMeses: 0,
    estado: 'activo' as 'activo' | 'inactivo',
  });

  const loadData = async () => {
    setLoading(true);
    const data = await getProductos();
    setProductos(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openEdit = (p: ProductoFinanciero) => {
    setEditingProd(p);
    setFormData({
      tasaNominalMensual: p.tasaNominalMensual,
      tasaEfectivaAnual: p.tasaEfectivaAnual,
      montoMinimo: p.montoMinimo,
      montoMaximo: p.montoMaximo,
      plazoMinimoMeses: p.plazoMinimoMeses,
      plazoMaximoMeses: p.plazoMaximoMeses,
      estado: p.estado,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProd) return;

    const updated: ProductoFinanciero = {
      ...editingProd,
      tasaNominalMensual: Number(formData.tasaNominalMensual),
      tasaEfectivaAnual: Number(formData.tasaEfectivaAnual),
      montoMinimo: Number(formData.montoMinimo),
      montoMaximo: Number(formData.montoMaximo),
      plazoMinimoMeses: Number(formData.plazoMinimoMeses),
      plazoMaximoMeses: Number(formData.plazoMaximoMeses),
      estado: formData.estado,
    };

    const res = await saveProducto(updated);
    if (res.success) {
      setModalOpen(false);
      await loadData();
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabecera */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-bank-100 text-bank-800 border border-bank-200 mb-2">
            <Percent className="w-3.5 h-3.5" />
            <span>Módulo de Actualización de Tasas y Parámetros • F11 EV9</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Configuración de Tasas y Condiciones Financieras
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Actualiza en tiempo real las tasas efectivas anuales, nominales mensuales, montos y límites de plazos sin alterar el código fuente.
          </p>
        </div>

        {/* Tabla de Productos y Parámetros */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-bank-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs text-slate-500">Cargando portafolio bancario...</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">Producto Financiero</th>
                    <th className="px-5 py-3.5">Categoría</th>
                    <th className="px-5 py-3.5 text-right">Tasa Nominal M.V.</th>
                    <th className="px-5 py-3.5 text-right">Tasa Efectiva E.A.</th>
                    <th className="px-5 py-3.5">Rango de Montos</th>
                    <th className="px-5 py-3.5">Plazos</th>
                    <th className="px-5 py-3.5">Estado</th>
                    <th className="px-5 py-3.5 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {productos.map((prod) => (
                    <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-bold text-slate-900">{prod.nombre}</p>
                        <p className="text-[10px] text-slate-400 capitalize">{prod.tipo.replace('_', ' ')}</p>
                      </td>
                      <td className="px-5 py-3.5 uppercase font-bold text-[10px] text-bank-700">
                        {prod.categoria}
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono font-bold text-slate-800">
                        {formatPercent(prod.tasaNominalMensual)} M.V.
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono font-bold text-emerald-600">
                        {formatPercent(prod.tasaEfectivaAnual)} E.A.
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 font-mono text-[11px]">
                        {formatCurrency(prod.montoMinimo)} - {formatCurrency(prod.montoMaximo)}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">
                        {prod.plazoMinimoMeses} a {prod.plazoMaximoMeses} meses
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          prod.estado === 'activo' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {prod.estado}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <button
                          onClick={() => openEdit(prod)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-bank-700 hover:text-white text-slate-700 font-semibold transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Modificar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal de Edición de Parámetros */}
        {modalOpen && editingProd && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Actualizar Condiciones</span>
                  <h3 className="text-base font-bold text-slate-900">{editingProd.nombre}</h3>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Tasa Nominal Mensual (% M.V.)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.tasaNominalMensual}
                      onChange={(e) => setFormData({ ...formData, tasaNominalMensual: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-bank-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Tasa Efectiva Anual (% E.A.)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.tasaEfectivaAnual}
                      onChange={(e) => setFormData({ ...formData, tasaEfectivaAnual: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-bank-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Monto Mínimo ($ COP)</label>
                    <input
                      type="number"
                      step={100000}
                      required
                      value={formData.montoMinimo}
                      onChange={(e) => setFormData({ ...formData, montoMinimo: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-bank-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Monto Máximo ($ COP)</label>
                    <input
                      type="number"
                      step={500000}
                      required
                      value={formData.montoMaximo}
                      onChange={(e) => setFormData({ ...formData, montoMaximo: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-bank-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Plazo Mínimo (Meses)</label>
                    <input
                      type="number"
                      required
                      value={formData.plazoMinimoMeses}
                      onChange={(e) => setFormData({ ...formData, plazoMinimoMeses: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-bank-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Plazo Máximo (Meses)</label>
                    <input
                      type="number"
                      required
                      value={formData.plazoMaximoMeses}
                      onChange={(e) => setFormData({ ...formData, plazoMaximoMeses: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-bank-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Estado en Catálogo</label>
                  <select
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-bank-500 focus:outline-none bg-white font-semibold"
                  >
                    <option value="activo">Activo (Visible para simulaciones)</option>
                    <option value="inactivo">Inactivo (Suspendido temporalmente)</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 font-semibold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-bank-700 text-white font-bold hover:bg-bank-800 transition-colors shadow-sm"
                  >
                    Guardar Parámetros
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
