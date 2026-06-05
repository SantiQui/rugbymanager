export interface Manager {
  id: string;
  nombre: string;
  apellido: string;
  documento: string;
  fecha_nacimiento: string;
  telefono: string;
  correo: string;
  categorias: string[];
}

export interface JustificationDoc {
  id: string;
  nombreArchivo: string;
  fechaCarga: string;
  motivo: string;
  datosBase64?: string; // Simulated file content
}

export interface FichajeInstallment {
  id: string;
  numeroCuota: number;
  monto: number;
  pagado: boolean;
  fechaPago?: string;
  medioPago?: string; // 'Efectivo' | 'Transferencia' | 'Tarjeta'
}

export interface Player {
  id: string;
  nombre: string;
  apellido: string;
  documento: string;
  fecha_nacimiento: string;
  telefono: string;
  correo: string;
  categoria: string; // Assigned by manager
  posicion?: string; // Rugby position: Primera Línea, Segunda Línea, Tercera Línea, Medios, Volantes / Backs
  fichaMedicaUrl: string | null; // base64 or mock file
  fichaMedicaNombre: string | null;
  fichaMedicaFecha: string | null;
  justificaciones?: JustificationDoc[]; // List of uploaded justifications (injury, study, work)
  fichajeInstalments?: FichajeInstallment[]; // Fichaje UAR installment list
  historialRutinas?: RegistroRutina[];
}

export interface FundraiserCampaign {
  id: string;
  titulo: string; // e.g., "Venta de Milanesas de Pollo"
  descripcion: string;
  fechaDesde: string;
  fechaHasta: string;
  fotoFlyer?: string; // image or icon placeholder string
  cantidadPorJugador: number; // required quantity per player
  ventasRegistradas?: { [playerId: string]: number }; // map player id -> quantity sold
}

export interface Professor {
  id: string;
  nombre: string;
  apellido: string;
  documento: string;
  fecha_nacimiento: string;
  telefono: string;
  correo: string;
  categorias: string[];
}

export interface PlayerStats {
  tackles: number;
  tries: number;
  conversiones: number;
  penales: number;
}

export interface Match {
  id: string;
  fecha: string;
  hora: string;
  rival: string;
  categoria: string;
  lugar: 'Local' | 'Visitante';
  estado: 'Programado' | 'Jugado';
  resultadoClub: number | null;
  resultadoRival: number | null;
  titulares: string[]; // Player IDs
  suplentes: string[]; // Player IDs
  estadisticas: { [playerId: string]: PlayerStats };
  tercerTiempo?: TercerTiempoData;
}

export interface Ejercicio {
  ejercicio: string;
  series: number | string;
  repeticiones: number | string;
  notas?: string;
}

export interface GymRoutine {
  id: string;
  titulo: string;
  descripcion?: string;
  profesorId: string;       // <-- Este es el que faltaba
  profesorNombre: string;
  jugadorId?: string; 
  posicion?: string;
  fechaAsignacion?: string; // <-- Y este también
  
  // CAMPOS DEL CALENDARIO MENSUAL
  fechaInicio: string;  
  fechaFin: string;     
  diasSemana: string[]; 
  
  ejercicios: Ejercicio[];
}
export interface RegistroRutina {
  fecha: string;        // ej: "2026-06-05"
  rutinaId: string;
  completado: boolean;
}
export interface Attendance {
  id: string;
  fecha: string;
  tipo: 'Entrenamiento' | 'Partido';
  categoria: string;
  asistentes: string[]; // Player IDs who were present
  justificados?: string[]; // Player IDs who were absent but had their absence justified
}

export type UserRole = 'admin' | 'manager' | 'profesor' | 'jugador';

export interface TercerTiempoData {
  costo_comida: number;
  costo_bebida: number;
  otros_gastos: number;
  alias_transferencia: string;
  costo_total?: number;
  costo_por_jugador?: number;
}