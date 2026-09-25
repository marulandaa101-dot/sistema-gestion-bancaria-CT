'use server';

import { readJsonFile, writeJsonFile } from '@/lib/storage';
import { Usuario } from '@/types/usuario';

const FILE_NAME = 'usuarios.json';

export async function getUsuarios(): Promise<Usuario[]> {
  return await readJsonFile<Usuario[]>(FILE_NAME, []);
}

export async function getUsuarioById(id: string): Promise<Usuario | undefined> {
  const usuarios = await getUsuarios();
  return usuarios.find(u => u.id === id);
}

export async function saveUsuario(usuario: Usuario): Promise<{ success: boolean; message: string }> {
  try {
    const usuarios = await getUsuarios();
    const index = usuarios.findIndex(u => u.id === usuario.id);

    if (index >= 0) {
      usuarios[index] = { ...usuarios[index], ...usuario };
    } else {
      usuarios.push({
        ...usuario,
        id: usuario.id || `usr-${Date.now()}`,
        creadoEn: new Date().toISOString(),
      });
    }

    await writeJsonFile(FILE_NAME, usuarios);
    return { success: true, message: 'Usuario actualizado correctamente.' };
  } catch (error) {
    return { success: false, message: 'Error al procesar el usuario.' };
  }
}

export async function deleteUsuario(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const usuarios = await getUsuarios();
    const filtered = usuarios.filter(u => u.id !== id);
    await writeJsonFile(FILE_NAME, filtered);
    return { success: true, message: 'Usuario eliminado exitosamente.' };
  } catch (error) {
    return { success: false, message: 'Error al eliminar el usuario.' };
  }
}
