import { Manager, Player, Professor, Match, GymRoutine, Attendance, FundraiserCampaign } from './types';

export const CLUB_CATEGORIES = ['M15', 'M16', 'M17', 'M19', 'Plantel Superior'];

export const RUGBY_POSITIONS = [
  'Primera Línea (Pilares/Hooker)',
  'Segunda Línea',
  'Tercera Línea (Flankers/Octavo)',
  'Medios (Medio Scrum/Apertura)',
  'Backs (Centros/Wings/Fullback)'
];

// Preloaded mock PDF representable text
export const MOCK_PDF_BASE64_TEMPLATE = "JVBERi0xLjQKJ...(Ficha Médica UAR Certificada - Mock PDF content)";

export const INITIAL_MANAGERS: Manager[] = [
  {
    id: 'm1',
    nombre: 'Gonzalo',
    apellido: 'Quesada',
    documento: '28456123',
    fecha_nacimiento: '1974-05-02',
    telefono: '+54 11 4875-9210',
    correo: 'gonzalo.quesada@rugbyclub.com',
    categorias: ['Plantel Superior', 'M19']
  },
  {
    id: 'm2',
    nombre: 'Felipe',
    apellido: 'Contepomi',
    documento: '30567890',
    fecha_nacimiento: '1977-08-20',
    telefono: '+54 11 5032-1144',
    correo: 'felipe.contepomi@rugbyclub.com',
    categorias: ['M17', 'M16']
  }
];

export const INITIAL_PROFESSORS: Professor[] = [
  {
    id: 'p1',
    nombre: 'Mario',
    apellido: 'Ledesma',
    documento: '25443211',
    fecha_nacimiento: '1973-05-17',
    telefono: '+54 9 11 6789-5432',
    correo: 'mario.ledesma@rugbyclub.com',
    categorias: ['Plantel Superior', 'M19']
  },
  {
    id: 'p2',
    nombre: 'Agustín',
    apellido: 'Pichot',
    documento: '24112233',
    fecha_nacimiento: '1974-08-31',
    telefono: '+54 9 11 4545-9876',
    correo: 'agustin.pichot@rugbyclub.com',
    categorias: ['M17', 'M16', 'M15']
  }
];

export const INITIAL_PLAYERS: Player[] = [
  {
    id: 'j1',
    nombre: 'Emiliano',
    apellido: 'Boffelli',
    documento: '38123456',
    fecha_nacimiento: '1995-01-11',
    telefono: '+54 341 6224331',
    correo: 'emiliano.boffelli@rugbyclub.com',
    categoria: 'Plantel Superior',
    posicion: 'Backs (Centros/Wings/Fullback)',
    fichaMedicaUrl: 'simulated_pdf_boffelli',
    fichaMedicaNombre: 'Ficha_Medica_UAR_Boffelli_2026.pdf',
    fichaMedicaFecha: '2026-03-12',
    justificaciones: [],
    fichajeInstalments: [
      { id: 'f-j1-1', numeroCuota: 1, monto: 15000, pagado: true, fechaPago: '2026-03-10', medioPago: 'Transferencia' },
      { id: 'f-j1-2', numeroCuota: 2, monto: 15000, pagado: true, fechaPago: '2026-04-12', medioPago: 'Transferencia' },
      { id: 'f-j1-3', numeroCuota: 3, monto: 15000, pagado: false },
      { id: 'f-j1-4', numeroCuota: 4, monto: 15000, pagado: false }
    ]
  },
  {
    id: 'j2',
    nombre: 'Marcos',
    apellido: 'Kremer',
    documento: '39456789',
    fecha_nacimiento: '1997-07-30',
    telefono: '+54 343 5122876',
    correo: 'marcos.kremer@rugbyclub.com',
    categoria: 'Plantel Superior',
    posicion: 'Tercera Línea (Flankers/Octavo)',
    fichaMedicaUrl: null,
    fichaMedicaNombre: null,
    fichaMedicaFecha: null,
    justificaciones: [],
    fichajeInstalments: [
      { id: 'f-j2-1', numeroCuota: 1, monto: 20000, pagado: false },
      { id: 'f-j2-2', numeroCuota: 2, monto: 20000, pagado: false },
      { id: 'f-j2-3', numeroCuota: 3, monto: 20000, pagado: false }
    ]
  },
  {
    id: 'j3',
    nombre: 'Pablo',
    apellido: 'Matera',
    documento: '37554433',
    fecha_nacimiento: '1993-07-18',
    telefono: '+54 11 63112244',
    correo: 'pablo.matera@rugbyclub.com',
    categoria: 'Plantel Superior',
    posicion: 'Tercera Línea (Flankers/Octavo)',
    fichaMedicaUrl: 'simulated_pdf_matera',
    fichaMedicaNombre: 'Ficha_Medica_UAR_Matera_2026.pdf',
    fichaMedicaFecha: '2026-02-28',
    justificaciones: [],
    fichajeInstalments: [
      { id: 'f-j3-1', numeroCuota: 1, monto: 10000, pagado: true, fechaPago: '2026-02-15', medioPago: 'Tarjeta' },
      { id: 'f-j3-2', numeroCuota: 2, monto: 10000, pagado: true, fechaPago: '2026-03-15', medioPago: 'Efectivo' },
      { id: 'f-j3-3', numeroCuota: 3, monto: 10000, pagado: true, fechaPago: '2026-04-15', medioPago: 'Transferencia' }
    ]
  },
  {
    id: 'j4',
    nombre: 'Thomas',
    apellido: 'Gallo',
    documento: '41987554',
    fecha_nacimiento: '1999-04-30',
    telefono: '+54 381 4877122',
    correo: 'thomas.gallo@rugbyclub.com',
    categoria: 'Plantel Superior',
    posicion: 'Primera Línea (Pilares/Hooker)',
    fichaMedicaUrl: 'simulated_pdf_gallo',
    fichaMedicaNombre: 'Ficha_Medica_UAR_Gallo_2026.pdf',
    fichaMedicaFecha: '2026-04-01',
    justificaciones: [],
    fichajeInstalments: [
      { id: 'f-j4-1', numeroCuota: 1, monto: 12000, pagado: true, fechaPago: '2026-04-10', medioPago: 'Transferencia' },
      { id: 'f-j4-2', numeroCuota: 2, monto: 12000, pagado: false },
      { id: 'f-j4-3', numeroCuota: 3, monto: 12000, pagado: false },
      { id: 'f-j4-4', numeroCuota: 4, monto: 12000, pagado: false }
    ]
  },
  {
    id: 'j5',
    nombre: 'Mateo',
    apellido: 'Carreras',
    documento: '42332111',
    fecha_nacimiento: '2000-01-07',
    telefono: '+54 381 5544221',
    correo: 'mateo.carreras@rugbyclub.com',
    categoria: 'M19',
    posicion: 'Backs (Centros/Wings/Fullback)',
    fichaMedicaUrl: null,
    fichaMedicaNombre: null,
    fichaMedicaFecha: null,
    justificaciones: [],
    fichajeInstalments: [
      { id: 'f-j5-1', numeroCuota: 1, monto: 11000, pagado: true, fechaPago: '2025-11-20', medioPago: 'Efectivo' },
      { id: 'f-j5-2', numeroCuota: 2, monto: 11000, pagado: true, fechaPago: '2025-12-18', medioPago: 'Transferencia' },
      { id: 'f-j5-3', numeroCuota: 3, monto: 11000, pagado: false }
    ]
  },
  {
    id: 'j6',
    nombre: 'Bautista',
    apellido: 'Delguy',
    documento: '40112244',
    fecha_nacimiento: '1997-04-22',
    telefono: '+54 11 32115544',
    correo: 'bautista.delguy@rugbyclub.com',
    categoria: 'M19',
    posicion: 'Backs (Centros/Wings/Fullback)',
    fichaMedicaUrl: 'simulated_pdf_delguy',
    fichaMedicaNombre: 'Ficha_Medica_UAR_Delguy_2026.pdf',
    fichaMedicaFecha: '2026-05-10',
    justificaciones: [],
    fichajeInstalments: [
      { id: 'f-j6-1', numeroCuota: 1, monto: 14000, pagado: true, fechaPago: '2026-02-14', medioPago: 'Transferencia' },
      { id: 'f-j6-2', numeroCuota: 2, monto: 14000, pagado: false },
      { id: 'f-j6-3', numeroCuota: 3, monto: 14000, pagado: false }
    ]
  },
  {
    id: 'j7',
    nombre: 'Benjamín',
    apellido: 'Elizalde',
    documento: '45123987',
    fecha_nacimiento: '2004-10-15',
    telefono: '+54 291 4455889',
    correo: 'benjamin.elizalde@rugbyclub.com',
    categoria: 'M17',
    posicion: 'Backs (Centros/Wings/Fullback)',
    fichaMedicaUrl: null,
    fichaMedicaNombre: null,
    fichaMedicaFecha: null,
    justificaciones: [],
    fichajeInstalments: []
  }
];

export const INITIAL_MATCHES: Match[] = [
  {
    id: 'match1',
    fecha: '2026-05-10',
    hora: '15:30',
    rival: 'Hindú Club',
    categoria: 'Plantel Superior',
    lugar: 'Local',
    estado: 'Jugado',
    resultadoClub: 28,
    resultadoRival: 24,
    titulares: ['j1', 'j3', 'j4'],
    suplentes: ['j2'],
    estadisticas: {
      'j1': { tackles: 8, tries: 1, conversiones: 2, penales: 3 }, // 18 pts
      'j2': { tackles: 12, tries: 0, conversiones: 0, penales: 0 },
      'j3': { tackles: 15, tries: 1, conversiones: 0, penales: 0 },
      'j4': { tackles: 10, tries: 1, conversiones: 0, penales: 0 }
    }
  },
  {
    id: 'match2',
    fecha: '2026-05-20',
    hora: '15:30',
    rival: 'C.A.S.I.',
    categoria: 'Plantel Superior',
    lugar: 'Visitante',
    estado: 'Jugado',
    resultadoClub: 19,
    resultadoRival: 22,
    titulares: ['j1', 'j2', 'j3'],
    suplentes: ['j4'],
    estadisticas: {
      'j1': { tackles: 6, tries: 0, conversiones: 2, penales: 3 },
      'j2': { tackles: 17, tries: 1, conversiones: 0, penales: 0 },
      'j3': { tackles: 14, tries: 0, conversiones: 0, penales: 0 },
      'j4': { tackles: 7, tries: 1, conversiones: 0, penales: 0 }
    }
  },
  {
    id: 'match3',
    fecha: '2026-05-30',
    hora: '16:00',
    rival: 'S.I.C.',
    categoria: 'Plantel Superior',
    lugar: 'Local',
    estado: 'Programado',
    resultadoClub: null,
    resultadoRival: null,
    titulares: [],
    suplentes: [],
    estadisticas: {}
  },
  {
    id: 'match4',
    fecha: '2026-06-06',
    hora: '14:00',
    rival: 'Belgrano Athletic',
    categoria: 'M19',
    lugar: 'Visitante',
    estado: 'Programado',
    resultadoClub: null,
    resultadoRival: null,
    titulares: [],
    suplentes: [],
    estadisticas: {}
  }
];

export const INITIAL_GYM_ROUTINES: GymRoutine[] = [
  {
    id: 'rot1',
    titulo: 'Fuerza Máxima & Potencia - Tren Inferior',
    descripcion: 'Enfocado en mejorar el empuje en el scrum y la estabilidad del tackle.',
    ejercicios: [
      { ejercicio: 'Sentadilla Trasera', series: '4', repeticiones: '5 (85% RM)', notas: '3 min de pausa entre series' },
      { ejercicio: 'Prensa Inclinada', series: '3', repeticiones: '8', notas: 'Controlar el descenso de 3 segundos' },
      { ejercicio: 'Peso Muerto Rumano', series: '3', repeticiones: '8', notas: 'Mantener espalda bien recta' },
      { ejercicio: 'Saltos al Cajón (Box Jumps)', series: '4', repeticiones: '6', notas: 'Buscando altura máxima y caída amortiguada' }
    ],
    profesorId: 'p1',
    profesorNombre: 'Mario Ledesma',
    posicion: 'Tercera Línea (Flankers/Octavo)',
    fechaAsignacion: '2026-05-15'
  },
  {
    id: 'rot2',
    titulo: 'Acondicionamiento Físico & Core',
    descripcion: 'Trabajo de resistencia intermitente y estabilidad abdominal profunda.',
    ejercicios: [
      { ejercicio: 'Planca Isométrica con Disco', series: '4', repeticiones: '45 segundos', notas: 'Cargar disco de 15kg si es posible' },
      { ejercicio: 'Rueda Abdominal (Rollouts)', series: '3', repeticiones: '10', notas: 'Ejecución lenta y controlada' },
      { ejercicio: 'Farmer Walks (Caminata de Granjero)', series: '4', repeticiones: '40 metros', notas: 'Pesos pesados (mancuernas de 30kg+)' }
    ],
    profesorId: 'p1',
    profesorNombre: 'Mario Ledesma',
    posicion: 'Backs (Centros/Wings/Fullback)',
    fechaAsignacion: '2026-05-12'
  },
  {
    id: 'rot3',
    titulo: 'Hipertrofia Funcional & Prevención',
    descripcion: 'Puntual para primeras líneas, robusteciendo hombros, cuello y tren superior.',
    ejercicios: [
      { ejercicio: 'Press de Banca Plano', series: '4', repeticiones: '6 (80% RM)', notas: 'Barra al pecho con pausa controlada' },
      { ejercicio: 'Remo con Barra', series: '4', repeticiones: '8', notas: 'Manteniendo cadera fija' },
      { ejercicio: 'Press Militar del Hombro', series: '3', repeticiones: '8', notas: 'Cerrar fuerte traba arriba' },
      { ejercicio: 'Encogimiento de Hombros (Trap shrugs)', series: '3', repeticiones: '12', notas: 'Mancuernas pesadas con retención de 1s' }
    ],
    profesorId: 'p2',
    profesorNombre: 'Agustín Pichot',
    posicion: 'Primera Línea (Pilares/Hooker)',
    fechaAsignacion: '2026-05-18'
  }
];

export const INITIAL_ATTENDANCE: Attendance[] = [
  {
    id: 'att1',
    fecha: '2026-05-24',
    tipo: 'Entrenamiento',
    categoria: 'Plantel Superior',
    asistentes: ['j1', 'j3'] // bofelli and matera attended, kremer and gallo missed
  },
  {
    id: 'att2',
    fecha: '2026-05-25',
    tipo: 'Entrenamiento',
    categoria: 'Plantel Superior',
    asistentes: ['j1', 'j2', 'j3', 'j4'] // full house
  },
  {
    id: 'att3',
    fecha: '2026-05-22',
    tipo: 'Entrenamiento',
    categoria: 'M19',
    asistentes: ['j6'] // delguy attended, carreras missed
  }
];

export const INITIAL_CAMPAIGNS: FundraiserCampaign[] = [
  {
    id: 'c1',
    titulo: 'Venta de Milanesas de Pollo Rebosadas',
    descripcion: 'Campaña especial para financiar el viaje de la división juvenil a la ciudad de Rosario para el torneo de fin de año.',
    fechaDesde: '2026-06-01',
    fechaHasta: '2026-06-25',
    fotoFlyer: 'milanesas_flyer',
    cantidadPorJugador: 15,
    ventasRegistradas: {
      'j1': 10,
      'j2': 4,
      'j3': 15,
      'j4': 0,
      'j5': 12,
      'j6': 15
    }
  },
  {
    id: 'c2',
    titulo: 'Venta de Rifas de Invierno del Club 2026',
    descripcion: 'Rifa oficial de la Unión con importantes premios: indumentaria del club, pelotas de rugby firmadas y vouchers gastonómicos.',
    fechaDesde: '2026-06-15',
    fechaHasta: '2026-07-15',
    fotoFlyer: 'rifa_flyer',
    cantidadPorJugador: 20,
    ventasRegistradas: {
      'j1': 20,
      'j3': 18
    }
  }
];
