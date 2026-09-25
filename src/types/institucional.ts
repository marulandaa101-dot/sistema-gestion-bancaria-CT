export interface Sucursal {
  id: string;
  ciudad: string;
  nombre: string;
  direccion: string;
  telefono: string;
  horario: string;
}

export interface ServicioInstitucional {
  id: string;
  nombre: string;
  descripcion: string;
}

export interface ValorInstitucional {
  titulo: string;
  descripcion: string;
}

export interface EntidadInfo {
  nombre: string;
  eslogan: string;
  mision: string;
  vision: string;
  valores: ValorInstitucional[];
  servicios: ServicioInstitucional[];
  contacto: {
    lineaNacional: string;
    lineaAtencion: string;
    correo: string;
    horarioGeneral: string;
    oficinas: Sucursal[];
  };
}

export interface InstitucionalData {
  entidad: EntidadInfo;
}
