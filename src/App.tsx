import React, { useState, useEffect } from 'react';
import { UserRole, Manager, Player, Professor, Match, GymRoutine, Attendance, PlayerStats, FundraiserCampaign } from './types';
import { 
  CLUB_CATEGORIES, 
  INITIAL_MANAGERS, 
  INITIAL_PROFESSORS, 
  INITIAL_PLAYERS, 
  INITIAL_MATCHES, 
  INITIAL_GYM_ROUTINES, 
  INITIAL_ATTENDANCE,
  INITIAL_CAMPAIGNS
} from './mockData';
import RoleSelector from './components/RoleSelector';
import LoginScreen from './components/LoginScreen';
import AdminPanel from './components/AdminPanel';
import ManagerPanel from './components/ManagerPanel';
import ProfessorPanel from './components/ProfessorPanel';
import PlayerPanel from './components/PlayerPanel';
import GuaycuruesLogo from './components/GuaycuruesLogo';
import { Award, ShieldCheck, Dumbbell, Calendar, Heart, LogOut, Sun, Moon } from 'lucide-react';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('rugby_theme') as 'light' | 'dark') || 'dark';
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('rugby_is_authenticated') === 'true';
  });

  // Load initial states from localStorage if available, else load preloaded mock sets.
  const [managers, setManagers] = useState<Manager[]>(() => {
    const saved = localStorage.getItem('rugby_managers');
    return saved ? JSON.parse(saved) : INITIAL_MANAGERS;
  });

  const [players, setPlayers] = useState<Player[]>(() => {
    const saved = localStorage.getItem('rugby_players');
    return saved ? JSON.parse(saved) : INITIAL_PLAYERS;
  });

  const [professors, setProfessors] = useState<Professor[]>(() => {
    const saved = localStorage.getItem('rugby_professors');
    return saved ? JSON.parse(saved) : INITIAL_PROFESSORS;
  });

  const [matches, setMatches] = useState<Match[]>(() => {
    const saved = localStorage.getItem('rugby_matches');
    return saved ? JSON.parse(saved) : INITIAL_MATCHES;
  });

  const [routines, setRoutines] = useState<GymRoutine[]>(() => {
    const saved = localStorage.getItem('rugby_routines');
    return saved ? JSON.parse(saved) : INITIAL_GYM_ROUTINES;
  });

  const [attendances, setAttendances] = useState<Attendance[]>(() => {
    const saved = localStorage.getItem('rugby_attendances');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [campaigns, setCampaigns] = useState<FundraiserCampaign[]>(() => {
    const saved = localStorage.getItem('rugby_campaigns');
    return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
  });

  // Simulator Context Values
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('rugby_current_role');
    return (saved as UserRole) || 'admin';
  });

  const [selectedManagerId, setSelectedManagerId] = useState<string>(() => {
    const saved = localStorage.getItem('rugby_sel_manager');
    return saved || (INITIAL_MANAGERS[0]?.id || '');
  });

  const [selectedProfessorId, setSelectedProfessorId] = useState<string>(() => {
    const saved = localStorage.getItem('rugby_sel_prof');
    return saved || (INITIAL_PROFESSORS[0]?.id || '');
  });

  const [selectedPlayerId, setSelectedPlayerId] = useState<string>(() => {
    const saved = localStorage.getItem('rugby_sel_player');
    return saved || (INITIAL_PLAYERS[0]?.id || '');
  });

  // Save states to LocalStorage on modifications
  useEffect(() => {
    localStorage.setItem('rugby_managers', JSON.stringify(managers));
  }, [managers]);

  useEffect(() => {
    localStorage.setItem('rugby_players', JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem('rugby_professors', JSON.stringify(professors));
  }, [professors]);

  useEffect(() => {
    localStorage.setItem('rugby_matches', JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem('rugby_routines', JSON.stringify(routines));
  }, [routines]);

  useEffect(() => {
    localStorage.setItem('rugby_attendances', JSON.stringify(attendances));
  }, [attendances]);

  useEffect(() => {
    localStorage.setItem('rugby_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem('rugby_current_role', currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem('rugby_sel_manager', selectedManagerId);
  }, [selectedManagerId]);

  useEffect(() => {
    localStorage.setItem('rugby_sel_prof', selectedProfessorId);
  }, [selectedProfessorId]);

  useEffect(() => {
    localStorage.setItem('rugby_sel_player', selectedPlayerId);
  }, [selectedPlayerId]);

  useEffect(() => {
    localStorage.setItem('rugby_is_authenticated', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('rugby_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleLoginSuccess = (role: UserRole, id?: string) => {
    setCurrentRole(role);
    if (role === 'manager' && id) {
      setSelectedManagerId(id);
    } else if (role === 'profesor' && id) {
      setSelectedProfessorId(id);
    } else if (role === 'jugador' && id) {
      setSelectedPlayerId(id);
    }
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // --- ACTIONS HANDLERS ---

  // Manager actions
  const handleAddManager = (newM: Manager) => {
    setManagers(prev => [newM, ...prev]);
  };

  const handleDeleteManager = (id: string) => {
    setManagers(prev => prev.filter(m => m.id !== id));
  };

  const handleUpdateManager = (updatedM: Manager) => {
    setManagers(prev => prev.map(m => m.id === updatedM.id ? updatedM : m));
  };

  // Player actions
  const handleAddPlayer = (newP: Player) => {
    setPlayers(prev => [newP, ...prev]);
  };

  const handleUpdatePlayer = (updatedP: Player) => {
    setPlayers(prev => prev.map(p => p.id === updatedP.id ? updatedP : p));
  };

  const handleDeletePlayer = (id: string) => {
    setPlayers(prev => prev.filter(p => p.id !== id));
  };

  // Professor actions
  const handleAddProfessor = (newProf: Professor) => {
    setProfessors(prev => [newProf, ...prev]);
  };

  // Match actions
  const handleAddMatch = (newMatch: Match) => {
    setMatches(prev => [newMatch, ...prev]);
  };

  const handleDeleteMatch = (id: string) => {
    setMatches(prev => prev.filter(m => m.id !== id));
  };

  const handleUpdateMatch = (updatedMatch: Match) => {
    setMatches(prev => prev.map(m => m.id === updatedMatch.id ? updatedMatch : m));
  };

  const handleUpdateMatchStats = (
    matchId: string, 
    titulares: string[], 
    suplentes: string[], 
    stats: { [playerId: string]: PlayerStats },
    clubScore: number,
    rivalScore: number
  ) => {
    setMatches(prev => prev.map(m => {
      if (m.id === matchId) {
        return {
          ...m,
          estado: 'Jugado',
          titulares,
          suplentes,
          estadisticas: stats,
          resultadoClub: clubScore,
          resultadoRival: rivalScore,
        };
      }
      return m;
    }));
  };

  // Routine actions
  const handleAddRoutine = (newRoutine: GymRoutine) => {
    setRoutines(prev => [newRoutine, ...prev]);
  };

  // Attendance actions
  const handleAddAttendance = (newAtt: Attendance) => {
    setAttendances(prev => [newAtt, ...prev]);
  };

  // Helper selectors
  const activeManagerObj = managers.find(m => m.id === selectedManagerId) || managers[0];
  const activeProfessorObj = professors.find(p => p.id === selectedProfessorId) || professors[0];
  const activePlayerObj = players.find(p => p.id === selectedPlayerId) || players[0];

  const handleResetSimulator = () => {
    if (window.confirm('¿Seguro que desea reincorporar los datos de simulación por defecto del club? Perderá los registros que haya creado.')) {
      localStorage.clear();
      setManagers(INITIAL_MANAGERS);
      setPlayers(INITIAL_PLAYERS);
      setProfessors(INITIAL_PROFESSORS);
      setMatches(INITIAL_MATCHES);
      setRoutines(INITIAL_GYM_ROUTINES);
      setAttendances(INITIAL_ATTENDANCE);
      setCampaigns(INITIAL_CAMPAIGNS);
      setCurrentRole('admin');
      setSelectedManagerId(INITIAL_MANAGERS[0]?.id || '');
      setSelectedProfessorId(INITIAL_PROFESSORS[0]?.id || '');
      setSelectedPlayerId(INITIAL_PLAYERS[0]?.id || '');
    }
  };

  if (!isAuthenticated) {
    return (
      <LoginScreen
        onLoginSuccess={handleLoginSuccess}
        managers={managers}
        professors={professors}
        players={players}
      />
    );
  }

  return (
    <div id="app-viewport" className="min-h-screen bg-zinc-950 flex flex-col justify-between text-zinc-100">
      
      {/* Top Selector Simulator (Role, Manager selection, etc.) */}
      <RoleSelector
        currentRole={currentRole}
        selectedManagerId={selectedManagerId}
        selectedProfessorId={selectedProfessorId}
        selectedPlayerId={selectedPlayerId}
        managers={managers}
        professors={professors}
        players={players}
        onChangeRole={setCurrentRole}
        onChangeManager={setSelectedManagerId}
        onChangeProfessor={setSelectedProfessorId}
        onChangePlayer={setSelectedPlayerId}
      />

      {/* Main Container */}
      <main className="flex-grow mx-auto w-full max-w-7xl px-4 py-6 md:px-6">
        
        {/* Supbannner Title */}
        <div className="mb-6 flex flex-col justify-between items-start gap-4 sm:flex-row sm:items-center bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="font-sans font-black text-white tracking-tight text-base md:text-lg leading-tight uppercase">
                Guaycurúes Rugby Sunchales
              </h3>
              <p className="font-sans text-[10px] md:text-xs text-[#2ECC71] dark:text-[#2ECC71] uppercase tracking-wider font-extrabold mt-1">
                Unión Santafesina de Rugby • Ciclo Deportivo 2026
              </p>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
            <button
              id="btn-toggle-theme"
              onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
              className="rounded-lg border border-slate-300 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-950 px-3 py-1.5 font-sans text-xs font-semibold text-slate-705 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-white transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              title={theme === 'dark' ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
                  <span>Modo Claro</span>
                </>
              ) : (
                <>
                  <Moon className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Modo Oscuro</span>
                </>
              )}
            </button>

            <button
              id="btn-restart-club-demo"
              onClick={handleResetSimulator}
              className="rounded-lg border border-slate-300 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-950 px-3 py-1.5 font-sans text-xs font-semibold text-slate-705 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-white transition flex items-center gap-1 cursor-pointer shadow-xs"
            >
              Reestablecer Simulación
            </button>

            <button
              onClick={handleLogout}
              className="rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/20 px-3 py-1.5 font-sans text-xs font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-950/40 hover:text-rose-800 dark:hover:text-rose-200 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Cerrar sesión activa"
            >
              <LogOut className="h-3.5 w-3.5 text-rose-600 dark:text-rose-450" />
              <span>Cerrar Sesión</span>
            </button>

            <div className="rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 px-3 py-1 font-mono text-[9px] font-bold text-emerald-800 dark:text-[#2ECC71] flex items-center gap-1.5 shadow-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-600 dark:bg-[#2ECC71] block shadow-xs animate-pulse"></span>
              <span>USR CONECTADO</span>
            </div>
          </div>
        </div>

        {/* Dynamic Panels according to user's simulated role */}
        <div id="active-panel-wrapper" className="bg-zinc-900/55 border border-zinc-800/80 rounded-xl p-6 shadow-xl animate-in fade-in duration-300">
          
          {currentRole === 'admin' && (
            <AdminPanel
              managers={managers}
              players={players}
              professors={professors}
              onAddManager={handleAddManager}
              onDeleteManager={handleDeleteManager}
              onUpdateManager={handleUpdateManager}
            />
          )}

          {currentRole === 'manager' && (
            activeManagerObj ? (
              <ManagerPanel
                manager={activeManagerObj}
                players={players}
                professors={professors}
                matches={matches}
                campaigns={campaigns}
                onUpdateCampaigns={setCampaigns}
                onAddPlayer={handleAddPlayer}
                onUpdatePlayer={handleUpdatePlayer}
                onDeletePlayer={handleDeletePlayer}
                onAddProfessor={handleAddProfessor}
                onAddMatch={handleAddMatch}
                onDeleteMatch={handleDeleteMatch}
                onUpdateMatch={handleUpdateMatch}
              />
            ) : (
              <div className="text-center py-12 text-slate-400">
                Hubo un inconveniente al seleccionar el manager activo. Incorpore un manager en el panel de Administración General.
              </div>
            )
          )}

          {currentRole === 'profesor' && (
            activeProfessorObj ? (
              <ProfessorPanel
                professor={activeProfessorObj}
                players={players}
                matches={matches}
                routines={routines}
                attendances={attendances}
                onAddRoutine={handleAddRoutine}
                onAddAttendance={handleAddAttendance}
                onUpdateMatchStats={handleUpdateMatchStats}
              />
            ) : (
              <div className="text-center py-12 text-slate-400 text-sm">
                No hay profesores cargados. El manager debe dar de alta un profesor primero para que pueda firmar entrenamientos o planillas tácticas.
              </div>
            )
          )}

          {currentRole === 'jugador' && (
            activePlayerObj ? (
              <PlayerPanel
                player={activePlayerObj}
                matches={matches}
                routines={routines}
                campaigns={campaigns}
                onUpdateCampaigns={setCampaigns}
                onUpdatePlayer={handleUpdatePlayer}
              />
            ) : (
              <div className="text-center py-12 text-slate-400 text-sm">
                No hay jugadores registrados en esta categoría deportiva. El manager respectivo debe cargarlos de forma federativa primero.
              </div>
            )
          )}

        </div>

      </main>

      {/* Footer disclaimer */}
      <footer className="border-t border-zinc-900 bg-zinc-950/70 backdrop-blur-md py-6 mt-12 text-xs text-zinc-400 font-sans">
        <div className="mx-auto max-w-7xl px-4 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <div>
            <p className="font-bold text-zinc-200 uppercase tracking-tight">© 2026 Guaycurúes Rugby Sunchales. Reservados todos los derechos.</p>
            <p className="text-[10px] text-zinc-500 mt-0.5">Sistema oficial de gestión deportiva y fichas médicas • Unión Santafesina de Rugby (USR).</p>
          </div>
          <div className="flex gap-4 font-mono text-[9px] items-center text-zinc-500">
            <div className="flex items-center gap-1.5 bg-emerald-950/20 border border-emerald-900/40 text-[#2ECC71] rounded px-2.5 py-1 font-bold">
              <ShieldCheck className="h-3.5 w-3.5 text-[#2ECC71]" />
              <span>Protección de Datos USR</span>
            </div>
            <span>v2.8.5 (AI Studio Build)</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
