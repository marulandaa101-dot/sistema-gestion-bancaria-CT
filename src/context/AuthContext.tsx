'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Usuario, RolUsuario } from '@/types/usuario';

interface AuthContextType {
  user: Usuario | null;
  login: (usuario: Usuario) => void;
  logout: () => void;
  switchRole: (rol: RolUsuario) => void;
  isAuthenticated: boolean;
}

const DEFAULT_USER: Usuario = {
  id: 'usr-001',
  nombre: 'Cindi Tatiana Marulanda',
  documento: '1054987654',
  email: 'cindi.marulanda@bcfbancario.com.co',
  rol: 'asesor',
  cargo: 'Asesora Senior de Crédito e Inversiones',
  sucursal: 'Sede Principal Centro - La Dorada',
  estado: 'activo',
  creadoEn: '2026-08-06T08:00:00.000Z',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Leer usuario guardado en localStorage o usar asesor predeterminado
    const saved = localStorage.getItem('bcf_session_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        setUser(DEFAULT_USER);
      }
    } else {
      setUser(DEFAULT_USER);
      localStorage.setItem('bcf_session_user', JSON.stringify(DEFAULT_USER));
    }
    setMounted(true);
  }, []);

  const login = (userData: Usuario) => {
    setUser(userData);
    localStorage.setItem('bcf_session_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bcf_session_user');
  };

  const switchRole = (newRole: RolUsuario) => {
    if (!user) return;
    const updated = { ...user, rol: newRole };
    setUser(updated);
    localStorage.setItem('bcf_session_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        switchRole,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
