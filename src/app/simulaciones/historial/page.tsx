'use client';

import React, { useState, useEffect } from 'react';
import { getSimulaciones, deleteSimulacion } from '@/actions/simulaciones.actions';
import { Simulacion } from '@/types/simulacion';
import { formatCurrency, formatPercent, formatDate } from '@/lib/formatters';
import {
  History,
  Search,
  Filter,
  Trash2,
  Eye,
  Printer,
  FileSpreadsheet,
  X,
  CreditCard,
  TrendingUp,
  PiggyBank,
  User,
  Calendar,
  Layers,
} from 'lucide-react';

export default function HistorialPage() {
  const [simulaciones, setSimulaciones] = useState<Simulacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [selectedSim, setSelectedSim] = useState<Simulacion | null>(null);

  useEffect(() => {
    async function fetchSims() {
      const data = await getSimulaciones();
      setSimulaciones(data);
      setLoading(false);
    }
    fetchSims();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este registro del historial?')) {
      const res = await deleteSimulacion(id);
      if (res.success) {
        setSimulaciones(sims => sims.filter(s => s.id !== id));
        if (selectedSim?.id === id) setSelectedSim(null);
      }
    }
  };

  const filteredSimulaciones = simulaciones.filter(s => {
    const matchesTipo = filtroTipo === 'todos' || s.tipo === filtroTipo;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      s.clienteNombre.toLowerCase().includes(term) ||
      s.clienteDocumento.includes(term) ||
      s.asesorNombre.toLowerCase().includes(term) ||
      s.productoNombre.toLowerCase().includes(term);
    return matchesTipo && matchesSearch;
  });

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case 'credito':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">Crédito</span>;
      case 'cdt':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">CDT</span>;
      case 'ahorro':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">Ahorro</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">{tipo}</span>;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabecera */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-bank-100 text-bank-800 border border-bank-200 mb-2">
              <History className="w-3.5 h-3.5" />
              <span>Registro de Asesoría y Proyecciones • F08 EV9</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Historial de Simulaciones Realizadas
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Bitácora de cálculos emitidos por los asesores financieros para consulta, auditoría o reemisión al cliente.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-500">Total registradas:</span>
            <p className="text-2xl font-black text-slate-900">{simulaciones.length}</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
            {['todos', 'credito', 'cdt', 'ahorro'].map(t => (
              <button
                key={t}
                onClick={() => setFiltroTipo(t)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                  filtroTipo === t
                    ? 'bg-bank-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por cliente, cédula o asesor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-bank-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Tabla de Historial */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-bank-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs text-slate-500">Cargando bitácora de simulaciones...</p>
          </div>
        ) : filteredSimulaciones.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No hay simulaciones que coincidan</h3>
            <p className="text-xs text-slate-500 mt-1">Realiza una simulación en los módulos correspondientes para verla reflejada aquí.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">Fecha</th>
                    <th className="px-5 py-3.5">Tipo</th>
                    <th className="px-5 py-3.5">Cliente</th>
                    <th className="px-5 py-3.5">Producto</th>
                    <th className="px-5 py-3.5 text-right">Resultado Principal</th>
                    <th className="px-5 py-3.5">Asesor</th>
                    <th className="px-5 py-3.5 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSimulaciones.map((sim) => (
                    <tr key={sim.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5 text-slate-500 font-medium whitespace-nowrap">
                        {formatDate(sim.fecha)}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        {getTipoBadge(sim.tipo)}
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-bold text-slate-900">{sim.clienteNombre}</p>
                        <p className="text-[10px] text-slate-400">CC: {sim.clienteDocumento}</p>
                      </td>
                      <td className="px-5 py-3.5 font-medium text-slate-700">
                        {sim.productoNombre}
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                        {sim.tipo === 'credito' && (
                          <div>
                            <span className="text-bank-700">{formatCurrency(sim.resultados.cuotaMensual)}</span>
                            <span className="text-[10px] text-slate-400 block font-sans">Cuota mensual</span>
                          </div>
                        )}
                        {sim.tipo === 'cdt' && (
                          <div>
                            <span className="text-emerald-700">{formatCurrency(sim.resultados.montoTotalFinal)}</span>
                            <span className="text-[10px] text-slate-400 block font-sans">Total liquidado</span>
                          </div>
                        )}
                        {sim.tipo === 'ahorro' && (
                          <div>
                            <span className="text-amber-700">{formatCurrency(sim.resultados.saldoFinal)}</span>
                            <span className="text-[10px] text-slate-400 block font-sans">Saldo acumulado</span>
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">
                        {sim.asesorNombre}
                      </td>
                      <td className="px-5 py-3.5 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedSim(sim)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-bank-100 text-slate-600 hover:text-bank-700 transition-colors"
                            title="Ver detalle completo"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(sim.id)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 transition-colors"
                            title="Eliminar de la bitácora"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal de Detalle Completo de Simulación */}
        {selectedSim && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Detalle de Simulación</span>
                  <h3 className="text-lg font-bold text-slate-900">{selectedSim.productoNombre}</h3>
                </div>
                <button
                  onClick={() => setSelectedSim(null)}
                  className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                
                {/* Datos del Cliente y Asesor */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-slate-500 block">Cliente:</span>
                    <strong className="text-slate-900 text-sm">{selectedSim.clienteNombre}</strong>
                    <span className="text-slate-400 block">Doc: {selectedSim.clienteDocumento}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Asesor a Cargo:</span>
                    <strong className="text-slate-900 text-sm">{selectedSim.asesorNombre}</strong>
                    <span className="text-slate-400 block">{formatDate(selectedSim.fecha)}</span>
                  </div>
                </div>

                {/* Parámetros de Entrada */}
                <div>
                  <h4 className="font-bold text-slate-800 mb-2 uppercase text-[10px] tracking-wider">Parámetros Ingresados</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl">
                    {Object.entries(selectedSim.parametros).map(([key, val]) => (
                      <div key={key}>
                        <span className="text-slate-400 text-[10px] block capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="font-semibold text-slate-800">
                          {typeof val === 'number' && val > 1000 ? formatCurrency(val) : String(val)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resultados Financieros */}
                <div>
                  <h4 className="font-bold text-slate-800 mb-2 uppercase text-[10px] tracking-wider">Resultados Calculados</h4>
                  <div className="grid grid-cols-2 gap-2 bg-bank-50/70 p-4 rounded-2xl border border-bank-100">
                    {Object.entries(selectedSim.resultados).map(([key, val]) => {
                      if (key === 'tablaAmortizacion') return null;
                      return (
                        <div key={key}>
                          <span className="text-bank-700/80 text-[10px] block capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span className="font-bold text-bank-950 text-sm">
                            {typeof val === 'number' ? formatCurrency(val) : String(val)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  Imprimir Comprobante
                </button>
                <button
                  onClick={() => setSelectedSim(null)}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-bank-700 hover:bg-bank-800 transition-colors"
                >
                  Cerrar
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
