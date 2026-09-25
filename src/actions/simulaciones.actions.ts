'use server';

import { readJsonFile, writeJsonFile } from '@/lib/storage';
import { Simulacion } from '@/types/simulacion';

const FILE_NAME = 'simulaciones.json';

export async function getSimulaciones(): Promise<Simulacion[]> {
  const data = await readJsonFile<Simulacion[]>(FILE_NAME, []);
  // Devolver las simulaciones ordenadas por fecha más reciente
  return data.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
}

export async function saveSimulacion(simulacionData: Omit<Simulacion, 'id' | 'fecha'> & { id?: string }): Promise<{ success: boolean; data?: Simulacion; message: string }> {
  try {
    const simulaciones = await getSimulaciones();
    const newSimulacion: Simulacion = {
      ...simulacionData,
      id: simulacionData.id || `sim-${Date.now()}`,
      fecha: new Date().toISOString(),
    };

    simulaciones.unshift(newSimulacion);
    await writeJsonFile(FILE_NAME, simulaciones);

    return {
      success: true,
      data: newSimulacion,
      message: 'Simulación guardada en el historial con éxito.',
    };
  } catch (error) {
    console.error('Error guardando simulación:', error);
    return {
      success: false,
      message: 'Ocurrió un error al guardar la simulación.',
    };
  }
}

export async function deleteSimulacion(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const simulaciones = await getSimulaciones();
    const filtered = simulaciones.filter(s => s.id !== id);
    await writeJsonFile(FILE_NAME, filtered);
    return { success: true, message: 'Simulación eliminada del registro.' };
  } catch (error) {
    return { success: false, message: 'Error al eliminar la simulación.' };
  }
}
