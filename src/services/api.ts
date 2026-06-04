import { Manager, Professor, Player, Match, GymRoutine, Attendance, FundraiserCampaign } from '../types';

// Magia pura: Si existe la variable de Vercel la usa, sino, usa el localhost de tu compu.
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/core';

// --- HELPER PARA PETICIONES ---
// Esta función maneja todos los fetch automáticamente
const fetchAPI = async (endpoint: string, method: string = 'GET', body: any = null) => {
  try {
    const options: RequestInit = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(`${API_URL}${endpoint}`, options);
    
    if (!response.ok) {
      throw new Error(`Error en el servidor: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error en la petición a ${endpoint}:`, error);
    throw error;
  }
};

// ==================== LOGIN ====================
export const loginUser = (credentials: any) => fetchAPI('/login', 'POST', credentials);

// ==================== MANAGERS ====================
export const getManagers = (): Promise<Manager[]> => fetchAPI('/managers');
export const saveManager = (manager: Manager) => fetchAPI('/managers', 'POST', manager);

// ==================== PROFESORES ====================
export const getProfessors = (): Promise<Professor[]> => fetchAPI('/professors');
export const saveProfessor = (prof: Professor) => fetchAPI('/professors', 'POST', prof);

// ==================== JUGADORES ====================
export const getPlayers = (): Promise<Player[]> => fetchAPI('/players');
export const savePlayer = (player: Player) => fetchAPI('/players', 'POST', player);

// ==================== PARTIDOS ====================
export const getMatches = (): Promise<Match[]> => fetchAPI('/matches');
export const saveMatch = (match: Match) => fetchAPI('/matches', 'POST', match);

// ==================== RUTINAS ====================
export const getRoutines = (): Promise<GymRoutine[]> => fetchAPI('/routines');
export const saveRoutine = (routine: GymRoutine) => fetchAPI('/routines', 'POST', routine);

// ==================== ASISTENCIAS ====================
export const getAttendances = (): Promise<Attendance[]> => fetchAPI('/attendances');
export const saveAttendance = (attendance: Attendance) => fetchAPI('/attendances', 'POST', attendance);

// ==================== CAMPAÑAS ====================
export const getCampaigns = (): Promise<FundraiserCampaign[]> => fetchAPI('/campaigns');
export const saveCampaign = (campaign: FundraiserCampaign) => fetchAPI('/campaigns', 'POST', campaign);

export const saveTercerTiempoAPI = (data: any) => fetchAPI('/tercer-tiempo', 'POST', data);