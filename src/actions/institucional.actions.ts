'use server';

import { readJsonFile } from '@/lib/storage';
import { InstitucionalData } from '@/types/institucional';

const FILE_NAME = 'institucional.json';

export async function getInstitucionalData(): Promise<InstitucionalData> {
  return await readJsonFile<InstitucionalData>(FILE_NAME, {
    entidad: {
      nombre: 'Banco Central Financiero (BCF)',
      eslogan: 'Construyendo tu futuro con solidez y confianza',
      mision: '',
      vision: '',
      valores: [],
      servicios: [],
      contacto: {
        lineaNacional: '',
        lineaAtencion: '',
        correo: '',
        horarioGeneral: '',
        oficinas: [],
      },
    },
  });
}
