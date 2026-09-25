export type RolUsuario = 'asesor' | 'admin' | 'supervisor' | 'soporte' | 'cliente';

export interface Usuario {
  id: string;
  nombre: string;
  documento: string;
  email: string;
  password?: string;
  rol: RolUsuario;
  cargo: string;
  sucursal: string;
  estado: 'activo' | 'inactivo';
  creadoEn: string;
}
