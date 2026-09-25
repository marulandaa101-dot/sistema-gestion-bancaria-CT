'use client';

import React, { useState } from 'react';
import { CuotaAmortizacion } from '@/types/simulacion';
import { formatCurrency } from '@/lib/formatters';
import { Printer, Download, Search, ChevronLeft, ChevronRight, Table } from 'lucide-react';

interface Props {
  cuotas: CuotaAmortizacion[];
  montoTotal: number;
  totalIntereses: number;
  totalPagar: number;
  clienteNombre?: string;
  tipoCredito?: string;
}

export default function TablaAmortizacion({
  cuotas,
  montoTotal,
  totalIntereses,
  totalPagar,
  clienteNombre,
  tipoCredito,
}: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // 1 año por vista para facilitar lectura
  const totalPages = Math.ceil(cuotas.length / itemsPerPage);

  const paginatedCuotas = cuotas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = ['Numero Cuota', 'Cuota Fija', 'Interes', 'Abono Capital', 'Saldo Pendiente'];
    const rows = cuotas.map(c => [
      c.numeroCuota,
      c.cuotaFija,
      c.interes,
      c.abonoCapital,
      c.saldoPendiente
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `tabla_amortizacion_${tipoCredito || 'credito'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!cuotas || cuotas.length === 0) {
    return null;
  }

  return (
    <div id="printable-section" className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-8 transition-all">
      {/* Encabezado de la Tabla */}
      <div className="p-6 bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Table className="w-5 h-5 text-bank-400" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              Tabla de Amortización Cuota Fija (Sistema Francés)
            </h3>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Proyección detallada mes a mes de cuota, intereses causados y abonos a capital.
            {clienteNombre && <span className="font-semibold text-bank-300 ml-1">Para: {clienteNombre}</span>}
          </p>
        </div>

        {/* Acciones de exportación e impresión */}
        <div className="flex items-center gap-2 print:hidden">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            title="Descargar tabla en formato CSV"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            Exportar CSV
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-bank-600 hover:bg-bank-500 text-white transition-colors"
            title="Imprimir resumen oficial para el cliente"
          >
            <Printer className="w-3.5 h-3.5" />
            Imprimir Tabla
          </button>
        </div>
      </div>

      {/* Resumen Métricas Clave */}
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 bg-slate-50/70 border-b border-slate-200 text-center py-4 px-6">
        <div>
          <span className="text-xs text-slate-500 uppercase font-semibold">Monto Financiado</span>
          <p className="text-lg font-bold text-slate-900">{formatCurrency(montoTotal)}</p>
        </div>
        <div className="pt-2 sm:pt-0">
          <span className="text-xs text-slate-500 uppercase font-semibold">Total Intereses</span>
          <p className="text-lg font-bold text-amber-600">{formatCurrency(totalIntereses)}</p>
        </div>
        <div className="pt-2 sm:pt-0">
          <span className="text-xs text-slate-500 uppercase font-semibold">Total a Pagar</span>
          <p className="text-lg font-bold text-bank-700">{formatCurrency(totalPagar)}</p>
        </div>
      </div>

      {/* Tabla Descriptiva */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-100 text-slate-700 uppercase font-bold tracking-wider text-[11px] border-b border-slate-200">
            <tr>
              <th scope="col" className="px-4 py-3 text-center">N° Cuota</th>
              <th scope="col" className="px-4 py-3 text-right">Valor Cuota</th>
              <th scope="col" className="px-4 py-3 text-right">Intereses</th>
              <th scope="col" className="px-4 py-3 text-right">Abono a Capital</th>
              <th scope="col" className="px-4 py-3 text-right">Saldo Pendiente</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {paginatedCuotas.map((c) => (
              <tr key={c.numeroCuota} className="hover:bg-bank-50/50 transition-colors">
                <td className="px-4 py-2.5 text-center font-bold text-slate-700">
                  <span className="inline-block w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-mono text-xs flex items-center justify-center mx-auto">
                    {c.numeroCuota}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-right font-semibold text-slate-900">
                  {formatCurrency(c.cuotaFija)}
                </td>
                <td className="px-4 py-2.5 text-right font-medium text-amber-600">
                  {formatCurrency(c.interes)}
                </td>
                <td className="px-4 py-2.5 text-right font-medium text-emerald-600">
                  {formatCurrency(c.abonoCapital)}
                </td>
                <td className="px-4 py-2.5 text-right font-bold text-slate-800 font-mono">
                  {formatCurrency(c.saldoPendiente)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación si hay más de 12 cuotas */}
      {totalPages > 1 && (
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 print:hidden">
          <span>
            Mostrando cuotas {(currentPage - 1) * itemsPerPage + 1} a {Math.min(currentPage * itemsPerPage, cuotas.length)} de {cuotas.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-300 disabled:opacity-40 hover:bg-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 font-semibold text-slate-700">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-300 disabled:opacity-40 hover:bg-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
