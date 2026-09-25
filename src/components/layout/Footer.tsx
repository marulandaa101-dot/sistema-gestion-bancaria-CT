import React from 'react';
import Link from 'next/link';
import { Landmark, ShieldCheck, Phone, Mail, Clock, MapPin, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto border-t border-slate-800">
      {/* Barra de Certificación y Solidez */}
      <div className="bg-bank-950/70 border-b border-slate-800/80 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="p-1.5 rounded-md bg-bank-600/30 text-bank-400 border border-bank-500/30">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="text-slate-300">
              Entidad simulada con fines formativos y académicos bajo lineamientos de la <strong>Superintendencia Financiera de Colombia</strong>.
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-bank-400" />
              SENA - Tecnólogo en Gestión Bancaria
            </span>
            <span className="text-slate-600">|</span>
            <span>ID Ficha: 3230956</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Columna 1: Identidad Corporativa */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-bank-600 flex items-center justify-center text-white">
                <Landmark className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg text-white">Banco Central BCF</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Construyendo tu futuro con solidez, transparencia y herramientas financieras precisas para el crecimiento integral de familias y empresas.
            </p>
            <div className="pt-2 text-xs text-bank-400 font-medium">
              Diseño de Sistema: Cindi Tatiana Marulanda Arango
            </div>
          </div>

          {/* Columna 2: Simuladores y Herramientas */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Simuladores</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/simuladores/credito" className="hover:text-bank-300 transition-colors">
                  Simulador de Crédito & Amortización
                </Link>
              </li>
              <li>
                <Link href="/simuladores/cdt" className="hover:text-bank-300 transition-colors">
                  Simulador de Inversión CDT
                </Link>
              </li>
              <li>
                <Link href="/simuladores/ahorro" className="hover:text-bank-300 transition-colors">
                  Simulador de Ahorro Programado
                </Link>
              </li>
              <li>
                <Link href="/simulaciones/historial" className="hover:text-bank-300 transition-colors">
                  Historial de Simulaciones
                </Link>
              </li>
              <li>
                <Link href="/productos" className="hover:text-bank-300 transition-colors">
                  Catálogo de Productos y Tasas
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Información Institucional */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Institucional</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/institucional" className="hover:text-bank-300 transition-colors">
                  Misión, Visión y Principios
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-bank-300 transition-colors">
                  Red de Oficinas y Sucursales
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-bank-300 transition-colors">
                  Portal del Asesor Financiero
                </Link>
              </li>
              <li>
                <Link href="/reportes" className="hover:text-bank-300 transition-colors">
                  Reportes de Gestión Comercial
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Canales de Atención */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Atención al Cliente</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-bank-400 shrink-0 mt-0.5" />
                <span>Línea Gratuita: 01 8000 912 345</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-bank-400 shrink-0 mt-0.5" />
                <span>contacto@bcfbancario.com.co</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-bank-400 shrink-0 mt-0.5" />
                <span>Lun - Vie: 8:00 a.m. a 5:00 p.m.</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-bank-400 shrink-0 mt-0.5" />
                <span>Sede Principal: La Dorada, Caldas</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Derechos de Autor */}
        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Banco Central Financiero (BCF). Proyecto Formativo SENA.</p>
          <p>EV9 - EV11 Planeación y Construcción del Sistema de Información Bancaria.</p>
        </div>
      </div>
    </footer>
  );
}
