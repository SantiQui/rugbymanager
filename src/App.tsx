import React, { useState, useEffect } from 'react';
import { UserRole, Manager, Player, Professor, Match, GymRoutine, Attendance, PlayerStats, FundraiserCampaign } from './types';
import LoginScreen from './components/LoginScreen';
import AdminPanel from './components/AdminPanel';
import ManagerPanel from './components/ManagerPanel';
import ProfessorPanel from './components/ProfessorPanel';
import PlayerPanel from './components/PlayerPanel';
import { ShieldCheck, LogOut } from 'lucide-react';

import { 
  getManagers, getProfessors, getPlayers, getMatches, getRoutines, getAttendances, getCampaigns,
  saveManager, saveProfessor, savePlayer, saveMatch, saveRoutine, saveAttendance, saveCampaign,
  // NUEVO: Importamos las funciones para borrar en la base de datos
  deleteManager, deletePlayer, deleteMatch, deleteProfessor
} from './services/api';

export default function App() {
  // 1. LEER LA MEMORIA AL ARRANCAR
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return (localStorage.getItem('userRole') as UserRole) || 'admin';
  });
  
  // ESTADO DE CARGA (Para la ruedita al hacer F5)
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [managers, setManagers] = useState<Manager[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [routines, setRoutines] = useState<GymRoutine[]>([]);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [campaigns, setCampaigns] = useState<FundraiserCampaign[]>([]);

  const loadDatabase = async () => {
    setIsLoading(true); // Prende la ruedita de carga
    try {
      const [dbManagers, dbProfessors, dbPlayers, dbMatches, dbRoutines, dbAttendances, dbCampaigns] = await Promise.all([
        getManagers(), getProfessors(), getPlayers(), getMatches(), getRoutines(), getAttendances(), getCampaigns()
      ]);
      setManagers(dbManagers);
      setProfessors(dbProfessors);
      setPlayers(dbPlayers);
      setMatches(dbMatches);
      setRoutines(dbRoutines);
      setAttendances(dbAttendances);
      setCampaigns(dbCampaigns);
    } catch (error) {
      console.error("Error al cargar la base de datos:", error);
    } finally {
      setIsLoading(false); // Apaga la ruedita cuando termina
    }
  };

  useEffect(() => {
    if (isAuthenticated) loadDatabase();
  }, [isAuthenticated]);

  // 2. GUARDAR LA MEMORIA AL INICIAR SESIÓN
  const handleLoginSuccess = (backendRole: string) => {
    const role = backendRole.toLowerCase() as UserRole;
    setCurrentRole(role);
    setIsAuthenticated(true);
    
    // Guardamos en el navegador
    localStorage.setItem('userRole', role);
    localStorage.setItem('isAuthenticated', 'true');
  };

  // 3. BORRAR LA MEMORIA AL CERRAR SESIÓN
  const handleLogout = () => {
    setIsAuthenticated(false);
    
    // Limpiamos el navegador
    localStorage.removeItem('userRole');
    localStorage.removeItem('isAuthenticated');
  };

  // Funciones de guardado SILENCIOSAS (sin alerts)
  const handleAddManager = async (newM: Manager) => { try { await saveManager(newM); loadDatabase(); } catch (e) { console.error(e); } };
  const handleUpdateManager = async (updatedM: Manager) => { try { await saveManager(updatedM); loadDatabase(); } catch (e) { console.error(e); } };
  
  // NUEVO: Funciones de borrado que hablan con la base de datos
  const handleDeleteManager = async (id: string) => { 
    try { 
      await deleteManager(id); 
      loadDatabase(); 
    } catch (e) { console.error(e); } 
  };

  const handleAddProfessor = async (newProf: Professor) => { try { await saveProfessor(newProf); loadDatabase(); } catch (e) { console.error(e); } };
  const handleAddPlayer = async (newP: Player) => { try { await savePlayer(newP); loadDatabase(); } catch (e) { console.error(e); } };
  const handleUpdatePlayer = async (updatedP: Player) => { try { await savePlayer(updatedP); loadDatabase(); } catch (e) { console.error(e); } };
  
  // NUEVO: Función de borrado de jugador asíncrona
  const handleDeletePlayer = async (id: string) => { 
    try { 
      await deletePlayer(id); 
      loadDatabase(); 
    } catch (e) { console.error(e); } 
  };
const handleDeleteProfessor = async (id: string) => { 
  try { 
    await deleteProfessor(id); 
    loadDatabase(); 
  } catch (e) { console.error(e); } 
};
  const handleAddMatch = async (newMatch: Match) => { try { await saveMatch(newMatch); loadDatabase(); } catch (e) { console.error(e); } };
  const handleUpdateMatch = async (updatedMatch: Match) => { try { await saveMatch(updatedMatch); loadDatabase(); } catch (e) { console.error(e); } };
  
  // NUEVO: Función de borrado de partido asíncrona
  const handleDeleteMatch = async (id: string) => { 
    try { 
      await deleteMatch(id); 
      loadDatabase(); 
    } catch (e) { console.error(e); } 
  };

  const handleUpdateMatchStats = async (matchId: string, titulares: string[], suplentes: string[], stats: { [playerId: string]: PlayerStats }, clubScore: number, rivalScore: number) => {
    const matchToUpdate = matches.find(m => m.id === matchId);
    if (matchToUpdate) {
      const updatedMatch = { ...matchToUpdate, estado: 'Jugado' as const, titulares, suplentes, estadisticas: stats, resultadoClub: clubScore, resultadoRival: rivalScore };
      try { await saveMatch(updatedMatch); loadDatabase(); } catch (e) { console.error(e); }
    }
  };

  const handleAddRoutine = async (newRoutine: GymRoutine) => { try { await saveRoutine(newRoutine); loadDatabase(); } catch (e) { console.error(e); } };
  const handleAddAttendance = async (newAtt: Attendance) => { try { await saveAttendance(newAtt); loadDatabase(); } catch (e) { console.error(e); } };
  const handleUpdateCampaigns = async (newCampaigns: FundraiserCampaign[] | ((prev: FundraiserCampaign[]) => FundraiserCampaign[])) => {
    const updatedCampaigns = typeof newCampaigns === 'function' ? newCampaigns(campaigns) : newCampaigns;
    setCampaigns(updatedCampaigns);
  };

  const activeManagerObj = managers[0] || null;
  const activeProfessorObj = professors[0] || null;
  const activePlayerObj = players[0] || null;

  if (!isAuthenticated) {
    return (
      <div>
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <div>
      <div id="app-viewport" className="min-h-screen bg-gray-100 text-gray-900 flex flex-col justify-between transition-colors duration-300">
        <main className="flex-grow mx-auto w-full max-w-7xl px-4 py-6 md:px-6">
          
          <div className="mb-6 flex flex-col justify-between items-start gap-4 sm:flex-row sm:items-center bg-white border border-gray-200 rounded-xl p-5 shadow-lg transition-colors duration-300">
            <div className="flex items-center gap-3">
              <div>
                <h3 className="font-sans font-black text-gray-900 tracking-tight text-base md:text-lg leading-tight uppercase">
                  Guaycurues Rugby Sunchales
                </h3>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
              <button
                onClick={handleLogout}
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 font-sans text-xs font-semibold text-red-700 hover:bg-red-100 transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                title="Cerrar sesión activa"
              >
                <LogOut className="h-3.5 w-3.5 text-red-600" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>

          <div id="active-panel-wrapper" className="bg-white border border-gray-200 rounded-xl p-6 shadow-xl animate-in fade-in duration-300 transition-colors">
            
            {/* CONDICIONAL: Si está cargando muestra la ruedita, sino muestra los paneles */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 opacity-70">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600 mb-4"></div>
                <p className="font-sans text-sm font-bold text-slate-500 uppercase tracking-widest animate-pulse">Sincronizando Sistema...</p>
              </div>
            ) : (
              <>
                {currentRole === 'admin' && (
                  <AdminPanel managers={managers} players={players} professors={professors} onAddManager={handleAddManager} onDeleteManager={handleDeleteManager} onUpdateManager={handleUpdateManager} />
                )}

                {currentRole === 'manager' && (
                  activeManagerObj ? (
                    <ManagerPanel manager={activeManagerObj} players={players} professors={professors} matches={matches} campaigns={campaigns} onUpdateCampaigns={handleUpdateCampaigns} onAddPlayer={handleAddPlayer} onUpdatePlayer={handleUpdatePlayer} onDeletePlayer={handleDeletePlayer} onAddProfessor={handleAddProfessor} onAddMatch={handleAddMatch} onDeleteMatch={handleDeleteMatch} onUpdateMatch={handleUpdateMatch} onDeleteProfessor={handleDeleteProfessor} />
                  ) : (
                    <div className="text-center py-12 text-gray-500">Hubo un inconveniente al seleccionar el manager activo.</div>
                  )
                )}

                {currentRole === 'profesor' && (
                  activeProfessorObj ? (
                    <ProfessorPanel professor={activeProfessorObj} players={players} matches={matches} routines={routines} attendances={attendances} onAddRoutine={handleAddRoutine} onAddAttendance={handleAddAttendance} onUpdateMatchStats={handleUpdateMatchStats} />
                  ) : (
                    <div className="text-center py-12 text-gray-500">No hay profesores cargados.</div>
                  )
                )}

                {currentRole === 'jugador' && (
                  activePlayerObj ? (
                    <PlayerPanel player={activePlayerObj} matches={matches} routines={routines} campaigns={campaigns} onUpdateCampaigns={handleUpdateCampaigns} onUpdatePlayer={handleUpdatePlayer} />
                  ) : (
                    <div className="text-center py-12 text-gray-500">No hay jugadores registrados en esta categoría deportiva.</div>
                  )
                )}
              </>
            )}

          </div>
        </main>

        <footer className="border-t border-gray-200 bg-white/70 backdrop-blur-md py-6 mt-12 text-xs text-gray-500 font-sans transition-colors">
          <div className="mx-auto max-w-7xl px-4 flex justify-center items-center text-center">
            <p className="font-bold text-gray-900 uppercase tracking-tight">
              © 2026 Guaycurúes Rugby Sunchales. Reservados todos los derechos.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}