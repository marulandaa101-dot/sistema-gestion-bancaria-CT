'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getUsuarios } from '@/actions/usuarios.actions';
import { Usuario } from '@/types/usuario';
import {
  Landmark,
  ShieldCheck,
  Lock,
  Mail,
  User,
  ArrowRight,
  Sparkles,
  CheckCircle,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, user: currentUser } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchUsers() {
      const data = await getUsuarios();
      setUsuarios(data);
    }
    fetchUsers();
  }, []);

  const handleQuickLogin = (usuario: Usuario) => {
    login(usuario);
    if (usuario.rol === 'admin') {
      router.push('/admin/usuarios');
    } else if (usuario.rol === 'supervisor') {
      router.push('/reportes');
    } else {
      router.push('/dashboard');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = usuarios.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      login(found);
      router.push('/dashboard');
    } else {
      setError('Credenciales inválidas. Puedes seleccionar uno de los usuarios de prueba directos abajo.');
    }
  };

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        
        {/* Cabecera */}
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-bank-900 to-bank-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-bank-900/20 mb-4">
            <Landmark className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Acceso al Sistema Bancario
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Plataforma interna de asesoría financiera y simulación • BCF
          </p>
        </div>

        {/* Formulario Estándar */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Correo Institucional
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@bcfbancario.com.co"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-bank-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-bank-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-bank-700 hover:bg-bank-800 shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>Ingresar al Sistema</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Acceso Rápido por Roles para Evaluadores y Pruebas */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Acceso Rápido por Perfil / Rol (Demostración EV9):</span>
            </div>

            <div className="space-y-1.5">
              {usuarios.map((u) => (
                <button
                  key={u.id}
                  onClick={() => handleQuickLogin(u)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-bank-400 hover:bg-bank-50/50 text-left transition-all flex items-center justify-between group"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-800 group-hover:text-bank-700">
                      {u.nombre}
                    </p>
                    <p className="text-[10px] text-slate-500 capitalize">
                      {u.cargo} ({u.rol})
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-bank-600 bg-bank-100/60 px-2 py-0.5 rounded-md">
                    Entrar como {u.rol}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
