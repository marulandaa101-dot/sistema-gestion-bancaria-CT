import React from 'react';
import { getInstitucionalData } from '@/actions/institucional.actions';
import { Landmark, Compass, Eye, Shield, Award, Users, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default async function InstitucionalPage() {
  const data = await getInstitucionalData();
  const { entidad } = data;

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabecera */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-bank-100 text-bank-800 border border-bank-200 mb-3">
            <Landmark className="w-3.5 h-3.5" />
            <span>Identidad & Principios Corporativos</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {entidad.nombre}
          </h1>
          <p className="text-base text-slate-600 mt-2">
            {entidad.eslogan}
          </p>
        </div>

        {/* Misión y Visión */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          
          {/* Misión */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-8 text-bank-100 pointer-events-none">
              <Compass className="w-24 h-24 stroke-[1]" />
            </div>
            <div>
              <div className="w-12 h-12 rounded-2xl bg-bank-50 text-bank-700 flex items-center justify-center mb-6">
                <Compass className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Nuestra Misión</h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {entidad.mision}
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-bank-700">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              Compromiso de calidad permanente
            </div>
          </div>

          {/* Visión */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-8 text-emerald-100 pointer-events-none">
              <Eye className="w-24 h-24 stroke-[1]" />
            </div>
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6">
                <Eye className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Nuestra Visión 2030</h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {entidad.vision}
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-emerald-700">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              Liderazgo en innovación financiera
            </div>
          </div>

        </div>

        {/* Valores Corporativos */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Valores que Nos Definen
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Pilares éticos y operacionales bajo los cuales asesoramos y servimos a cada usuario.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {entidad.valores.map((val, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-bank-400 hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-bank-700 font-bold flex items-center justify-center mb-4">
                  <Shield className="w-5 h-5 text-bank-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {val.titulo}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {val.descripcion}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Ficha Técnica y Reconocimiento SENA */}
        <div className="bg-gradient-to-r from-slate-900 via-bank-950 to-slate-900 rounded-3xl p-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-bank-200 border border-white/10">
                <Award className="w-3.5 h-3.5 text-bank-400" />
                <span>SENA • Centro Pecuario y Agroempresarial</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                Planeación y Diseño de Sistema de Información
              </h3>
              <p className="text-xs text-slate-300">
                Competencia: 210601012 - Aplicar tecnologías de la información teniendo en cuenta las necesidades de la unidad administrativa.
              </p>
              <p className="text-xs text-slate-400">
                Elaborado por: <strong>Cindi Tatiana Marulanda Arango</strong> • ID Ficha: 3230956
              </p>
            </div>

            <Link
              href="/contacto"
              className="px-6 py-3 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs transition-colors shrink-0"
            >
              Consultar Sucursales
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
