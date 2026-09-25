'use client';

import React, { useState } from 'react';
import {
  Phone,
  Mail,
  Clock,
  MapPin,
  Send,
  Building,
  CheckCircle,
  HelpCircle,
  MessageSquare,
} from 'lucide-react';

export default function ContactoPage() {
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    documento: '',
    email: '',
    telefono: '',
    sucursal: 'La Dorada, Caldas',
    asunto: 'consulta_credito',
    mensaje: '',
  });

  const sucursales = [
    {
      id: 'of-principal',
      ciudad: 'La Dorada, Caldas',
      nombre: 'Sede Principal Centro',
      direccion: 'Calle 14 # 4-32, Plaza de Bolívar',
      telefono: '+57 (606) 857 2300',
      horario: 'Lunes a Viernes: 8:00 a.m. a 4:30 p.m. • Sábados: 8:30 a.m. a 12:30 p.m.',
    },
    {
      id: 'of-norte',
      ciudad: 'Bogotá D.C.',
      nombre: 'Centro Financiero Calle 72',
      direccion: 'Carrera 7 # 71-52, Torre Financiera Piso 3',
      telefono: '+57 (601) 320 8900',
      horario: 'Lunes a Viernes: 8:30 a.m. a 5:00 p.m.',
    },
    {
      id: 'of-occidente',
      ciudad: 'Medellín, Antioquia',
      nombre: 'Sucursal El Poblado',
      direccion: 'Carrera 43A # 1 Sur-180',
      telefono: '+57 (604) 444 5600',
      horario: 'Lunes a Viernes: 8:00 a.m. a 4:00 p.m. • Sábados: 9:00 a.m. a 1:00 p.m.',
    },
    {
      id: 'of-cafetera',
      ciudad: 'Manizales, Caldas',
      nombre: 'Sucursal Centro Histórico',
      direccion: 'Carrera 22 # 21-15',
      telefono: '+57 (606) 884 1200',
      horario: 'Lunes a Viernes: 8:00 a.m. a 4:00 p.m.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-bank-100 text-bank-800 border border-bank-200 mb-3">
            <Building className="w-3.5 h-3.5" />
            <span>Canales de Atención Presencial y Virtual</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Canales de Contacto y Red de Oficinas
          </h1>
          <p className="text-base text-slate-600 mt-2">
            Estamos a tu disposición en nuestras sucursales físicas y a través de nuestros canales oficiales de asesoría financiera.
          </p>
        </div>

        {/* Tarjetas de Atención Inmediata */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="p-3.5 rounded-xl bg-bank-50 text-bank-700">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Línea Nacional Gratuita</p>
              <p className="text-base font-extrabold text-slate-900">01 8000 912 345</p>
              <p className="text-[11px] text-slate-500">Bogotá: +57 (601) 456 7890</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-700">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Correo Electrónico</p>
              <p className="text-base font-extrabold text-slate-900">contacto@bcfbancario.com.co</p>
              <p className="text-[11px] text-slate-500">Respuesta en menos de 24h hábiles</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="p-3.5 rounded-xl bg-amber-50 text-amber-700">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Horario de Atención</p>
              <p className="text-base font-extrabold text-slate-900">Lun - Vie: 8am a 5pm</p>
              <p className="text-[11px] text-slate-500">Sábados: 8:30 a.m. a 12:30 p.m.</p>
            </div>
          </div>
        </div>

        {/* Sección Sucursales y Formulario */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sucursales Físicas */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-slate-900">
                Directorio de Oficinas y Sucursales
              </h2>
              <span className="text-xs text-slate-500 font-medium">4 sucursales activas</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sucursales.map((suc) => (
                <div
                  key={suc.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-bank-400 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-bank-50 text-bank-700 border border-bank-200">
                        {suc.ciudad}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">
                      {suc.nombre}
                    </h3>

                    <div className="space-y-1.5 text-xs text-slate-600">
                      <p className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span>{suc.direccion}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{suc.telefono}</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span>{suc.horario}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Formulario de Mensaje al Asesor */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2.5 mb-2">
              <MessageSquare className="w-5 h-5 text-bank-600" />
              <h3 className="text-lg font-bold text-slate-900">Solicitar Asesoría Personalizada</h3>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Déjanos tus datos y un asesor financiero se comunicará contigo para brindarte información detallada de nuestros productos.
            </p>

            {formSent ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-emerald-900">¡Mensaje Enviado con Éxito!</h4>
                <p className="text-xs text-emerald-700">
                  Gracias <strong>{formData.nombre}</strong>. Hemos radicado tu solicitud. Nuestro equipo comercial se comunicará a tu correo o teléfono en breve.
                </p>
                <button
                  onClick={() => {
                    setFormSent(false);
                    setFormData({
                      nombre: '',
                      documento: '',
                      email: '',
                      telefono: '',
                      sucursal: 'La Dorada, Caldas',
                      asunto: 'consulta_credito',
                      mensaje: '',
                    });
                  }}
                  className="mt-3 text-xs font-bold text-emerald-800 underline hover:text-emerald-950"
                >
                  Enviar otra consulta
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Ej. Andrés Morales"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-bank-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Cédula / Documento</label>
                    <input
                      type="text"
                      required
                      value={formData.documento}
                      onChange={(e) => setFormData({ ...formData, documento: e.target.value })}
                      placeholder="Ej. 1054987654"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-bank-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Teléfono Móvil</label>
                    <input
                      type="tel"
                      required
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      placeholder="Ej. 310 123 4567"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-bank-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="correo@ejemplo.com"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-bank-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Asunto de Asesoría</label>
                  <select
                    value={formData.asunto}
                    onChange={(e) => setFormData({ ...formData, asunto: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-bank-500 focus:outline-none bg-white"
                  >
                    <option value="consulta_credito">Crédito de Libre Inversión o Vivienda</option>
                    <option value="consulta_cdt">Certificado de Depósito a Término (CDT)</option>
                    <option value="consulta_ahorro">Cuenta de Ahorro Programado</option>
                    <option value="general">Información General o Requisitos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mensaje o Inquietud</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.mensaje}
                    onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                    placeholder="Descríbenos en qué producto estás interesado o tu requerimiento..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-bank-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-bank-700 hover:bg-bank-800 shadow-md shadow-bank-900/10 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  Enviar Solicitud al Asesor
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
