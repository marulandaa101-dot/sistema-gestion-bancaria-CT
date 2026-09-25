'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { RolUsuario } from '@/types/usuario';
import {
  Landmark,
  Calculator,
  Layers,
  History,
  ShieldCheck,
  BarChart3,
  Building2,
  PhoneCall,
  Menu,
  X,
  UserCheck,
  ChevronDown,
  LogOut,
  Sparkles,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, switchRole, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const rolesList: { rol: RolUsuario; label: string; badgeColor: string }[] = [
    { rol: 'asesor', label: 'Asesor Financiero', badgeColor: 'bg-blue-100 text-blue-800 border-blue-300' },
    { rol: 'admin', label: 'Administrador', badgeColor: 'bg-purple-100 text-purple-800 border-purple-300' },
    { rol: 'supervisor', label: 'Supervisor / Gerente', badgeColor: 'bg-amber-100 text-amber-800 border-amber-300' },
    { rol: 'soporte', label: 'Soporte Técnico', badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    { rol: 'cliente', label: 'Cliente (Consulta)', badgeColor: 'bg-slate-100 text-slate-800 border-slate-300' },
  ];

  const currentRoleInfo = rolesList.find(r => r.rol === user?.rol) || rolesList[0];

  const navLinks = [
    { href: '/', label: 'Inicio', icon: Landmark },
    { href: '/productos', label: 'Productos', icon: Layers },
    { href: '/dashboard', label: 'Simuladores', icon: Calculator, requireAuth: false },
    { href: '/simulaciones/historial', label: 'Historial', icon: History, roles: ['asesor', 'admin', 'supervisor', 'soporte'] },
    { href: '/admin/usuarios', label: 'Gestión Usuarios', icon: ShieldCheck, roles: ['admin'] },
    { href: '/admin/productos', label: 'Tasas y Parámetros', icon: Layers, roles: ['admin'] },
    { href: '/reportes', label: 'Reportes', icon: BarChart3, roles: ['supervisor', 'admin'] },
    { href: '/institucional', label: 'Nosotros', icon: Building2 },
    { href: '/contacto', label: 'Contacto', icon: PhoneCall },
  ];

  const filteredLinks = navLinks.filter(link => {
    if (!link.roles) return true;
    return user ? link.roles.includes(user.rol) : false;
  });

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/95 border-b border-slate-200/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Corporativo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-bank-900 via-bank-700 to-bank-500 flex items-center justify-center text-white shadow-md shadow-bank-900/20 group-hover:scale-105 transition-transform">
              <Landmark className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 flex items-center gap-1.5">
                BCF <span className="text-bank-700 font-semibold text-sm hidden sm:inline">| Banco Central</span>
              </span>
              <span className="text-[11px] text-slate-500 font-medium tracking-wide uppercase">
                Sistema de Gestión Bancaria
              </span>
            </div>
          </Link>

          {/* Enlaces de Navegación Escritorio */}
          <nav className="hidden lg:flex items-center space-x-1">
            {filteredLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-bank-50 text-bank-700 shadow-sm ring-1 ring-bank-200/70'
                      : 'text-slate-600 hover:text-bank-700 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-bank-600' : 'text-slate-400'}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Selector de Rol y Acceso */}
          <div className="hidden md:flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${currentRoleInfo.badgeColor} shadow-xs hover:brightness-95 transition-all`}
                title="Cambiar rol activo para pruebas del sistema"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>{currentRoleInfo.label}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {roleDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setRoleDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
                    <p className="text-[11px] font-semibold uppercase text-slate-400">Modo de rol activo:</p>
                    <p className="text-xs text-slate-600 font-medium truncate">{user?.nombre}</p>
                  </div>
                  {rolesList.map(r => (
                    <button
                      key={r.rol}
                      onClick={() => {
                        switchRole(r.rol);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                        user?.rol === r.rol ? 'font-bold text-bank-700 bg-bank-50/60' : 'text-slate-700'
                      }`}
                    >
                      <span>{r.label}</span>
                      {user?.rol === r.rol && <span className="w-1.5 h-1.5 rounded-full bg-bank-600" />}
                    </button>
                  ))}
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <Link
                      href="/login"
                      onClick={() => setRoleDropdownOpen(false)}
                      className="w-full text-left px-3 py-1.5 text-xs text-slate-600 hover:text-bank-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Pantalla de Iniciar Sesión
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/simuladores/credito"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white bg-bank-700 hover:bg-bank-800 shadow-md shadow-bank-900/15 hover:shadow-bank-900/25 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-bank-300" />
              Simular Crédito
            </Link>
          </div>

          {/* Botón Móvil */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Menú Móvil Desplegable */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-3">
          <div className="p-3 bg-slate-50 rounded-xl mb-3 border border-slate-200">
            <p className="text-xs text-slate-500 font-medium">Usuario activo:</p>
            <p className="text-sm font-bold text-slate-800">{user?.nombre}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {rolesList.map(r => (
                <button
                  key={r.rol}
                  onClick={() => {
                    switchRole(r.rol);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-[10px] px-2 py-1 rounded-md font-semibold border ${
                    user?.rol === r.rol ? 'bg-bank-700 text-white border-bank-700' : 'bg-white text-slate-600 border-slate-200'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            {filteredLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive
                      ? 'bg-bank-50 text-bank-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-5 h-5 text-bank-600" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-200">
            <Link
              href="/simuladores/credito"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold text-white bg-bank-700 shadow-md text-center"
            >
              <Sparkles className="w-4 h-4 text-bank-300" />
              Simular Crédito Ahora
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
