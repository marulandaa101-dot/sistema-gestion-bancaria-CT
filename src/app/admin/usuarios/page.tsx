'use client';

import React, { useState, useEffect } from 'react';
import { getUsuarios, saveUsuario, deleteUsuario } from '@/actions/usuarios.actions';
import { Usuario, RolUsuario } from '@/types/usuario';
import { formatDate } from '@/lib/formatters';
import {
  ShieldCheck,
  UserPlus,
  Edit2,
  Trash2,
  User,
  Mail,
  CheckCircle,
  X,
  Lock,
  Building,
} from 'lucide-react';

export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);

  const [formData, setFormData] = useState({
    nombre: '',
    documento: '',
    email: '',
    password: '',
    rol: 'asesor' as RolUsuario,
    cargo: '',
    sucursal: 'Sede Principal Centro - La Dorada',
    estado: 'activo' as 'activo' | 'inactivo',
  });

  const loadData = async () => {
    setLoading(true);
    const data = await getUsuarios();
    setUsuarios(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({
      nombre: '',
      documento: '',
      email: '',
      password: 'Password123!',
      rol: 'asesor',
      cargo: 'Asesor Comercial de Crédito',
      sucursal: 'Sede Principal Centro - La Dorada',
      estado: 'activo',
    });
    setModalOpen(true);
  };

  const openEditModal = (u: Usuario) => {
    setEditingUser(u);
    setFormData({
      nombre: u.nombre,
      documento: u.documento,
      email: u.email,
      password: u.password || 'Password123!',
      rol: u.rol,
      cargo: u.cargo,
      sucursal: u.sucursal,
      estado: u.estado,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toSave: Usuario = {
      id: editingUser ? editingUser.id : `usr-${Date.now()}`,
      nombre: formData.nombre.trim(),
      documento: formData.documento.trim(),
      email: formData.email.trim(),
      password: formData.password,
      rol: formData.rol,
      cargo: formData.cargo.trim(),
      sucursal: formData.sucursal,
      estado: formData.estado,
      creadoEn: editingUser ? editingUser.creadoEn : new Date().toISOString(),
    };

    const res = await saveUsuario(toSave);
    if (res.success) {
      setModalOpen(false);
      await loadData();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar este usuario del sistema?')) {
      const res = await deleteUsuario(id);
      if (res.success) {
        setUsuarios(list => list.filter(u => u.id !== id));
      }
    }
  };

  const getRoleBadge = (rol: RolUsuario) => {
    switch (rol) {
      case 'admin':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">Administrador</span>;
      case 'asesor':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">Asesor Financiero</span>;
      case 'supervisor':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">Supervisor / Gerente</span>;
      case 'soporte':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Soporte Técnico</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">{rol}</span>;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabecera */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Módulo de Control de Acceso y Permisos • F10 EV9</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Gestión de Usuarios y Roles
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Crear, actualizar credenciales, asignar permisos y roles a asesores, supervisores y administradores.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-bank-700 hover:bg-bank-800 shadow-sm transition-all"
          >
            <UserPlus className="w-4 h-4" />
            Crear Nuevo Usuario
          </button>
        </div>

        {/* Tabla de Usuarios */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs text-slate-500">Cargando directorio de usuarios...</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">Funcionario</th>
                    <th className="px-5 py-3.5">Documento</th>
                    <th className="px-5 py-3.5">Rol en Sistema</th>
                    <th className="px-5 py-3.5">Cargo & Sucursal</th>
                    <th className="px-5 py-3.5">Estado</th>
                    <th className="px-5 py-3.5 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {usuarios.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
                            {u.nombre.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{u.nombre}</p>
                            <p className="text-[11px] text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-slate-700">
                        {u.documento}
                      </td>
                      <td className="px-5 py-3.5">
                        {getRoleBadge(u.rol)}
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-slate-800">{u.cargo}</p>
                        <p className="text-[10px] text-slate-400">{u.sucursal}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.estado === 'activo' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {u.estado}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditModal(u)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-bank-100 text-slate-600 hover:text-bank-700"
                            title="Editar usuario"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(u.id)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700"
                            title="Eliminar usuario"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

        {/* Modal Crear / Editar */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <h3 className="text-base font-bold text-slate-900">
                  {editingUser ? 'Modificar Usuario del Sistema' : 'Registrar Nuevo Usuario'}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Ej. Cindi Tatiana Marulanda"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-bank-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Documento de Identidad</label>
                    <input
                      type="text"
                      required
                      value={formData.documento}
                      onChange={(e) => setFormData({ ...formData, documento: e.target.value })}
                      placeholder="Ej. 1054987654"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-bank-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Rol / Permiso</label>
                    <select
                      value={formData.rol}
                      onChange={(e) => setFormData({ ...formData, rol: e.target.value as RolUsuario })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-bank-500 focus:outline-none bg-white font-semibold"
                    >
                      <option value="asesor">Asesor Financiero</option>
                      <option value="admin">Administrador del Sistema</option>
                      <option value="supervisor">Supervisor / Gerente</option>
                      <option value="soporte">Soporte Técnico</option>
                      <option value="cliente">Cliente (Consulta)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Correo Institucional</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="usuario@bcfbancario.com.co"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-bank-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Cargo</label>
                    <input
                      type="text"
                      required
                      value={formData.cargo}
                      onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                      placeholder="Ej. Asesor Senior"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-bank-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Estado</label>
                    <select
                      value={formData.estado}
                      onChange={(e) => setFormData({ ...formData, estado: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-bank-500 focus:outline-none bg-white font-semibold"
                    >
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sucursal Asignada</label>
                  <input
                    type="text"
                    required
                    value={formData.sucursal}
                    onChange={(e) => setFormData({ ...formData, sucursal: e.target.value })}
                    placeholder="Ej. Sede Principal La Dorada"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-bank-500 focus:outline-none"
                  />
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
                    Guardar Usuario
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
