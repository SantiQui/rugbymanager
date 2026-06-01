import React, { useState } from 'react';
import { Professor, Player, Match, GymRoutine, Attendance, PlayerStats } from '../types';
import { CLUB_CATEGORIES, RUGBY_POSITIONS } from '../mockData';
import { Calendar, UserCheck, FileSpreadsheet, Dumbbell, Trophy, Plus, Check, Save, UserMinus, PlusCircle, AlertCircle } from 'lucide-react';

interface ProfessorPanelProps {
  professor: Professor;
  players: Player[];
  matches: Match[];
  routines: GymRoutine[];
  attendances: Attendance[];
  onAddRoutine: (routine: GymRoutine) => void;
  onAddAttendance: (att: Attendance) => void;
  onUpdateMatchStats: (matchId: string, titulares: string[], suplentes: string[], stats: { [playerId: string]: PlayerStats }, clubScore: number, rivalScore: number) => void;
}

export default function ProfessorPanel({
  professor,
  players,
  matches,
  routines,
  attendances,
  onAddRoutine,
  onAddAttendance,
  onUpdateMatchStats,
}: ProfessorPanelProps) {
  // Tabs: 'attendance' | 'matchsheet' | 'routines'
  const [activeTab, setActiveTab] = useState<'attendance' | 'matchsheet' | 'routines'>('attendance');

  // Attendance states
  const [attDate, setAttDate] = useState(new Date().toISOString().split('T')[0]);
  const [attType, setAttType] = useState<'Entrenamiento' | 'Partido'>('Entrenamiento');
  const [attCategory, setAttCategory] = useState(professor.categorias[0] || CLUB_CATEGORIES[0]);
  const [attendancePresents, setAttendancePresents] = useState<string[]>([]); // list of player IDs present
  const [attendanceJustifieds, setAttendanceJustifieds] = useState<string[]>([]); // list of player IDs justified absent

  // Routine prescription states
  const [routPosicion, setRoutPosicion] = useState(RUGBY_POSITIONS[0]);
  const [routTitle, setRoutTitle] = useState('');
  const [routDesc, setRoutDesc] = useState('');
  const [exercises, setExercises] = useState<{ ejercicio: string; series: string; repeticiones: string; notas: string }[]>([
    { ejercicio: '', series: '4', repeticiones: '8', notas: '' }
  ]);

  // Match sheet states
  const [selectedMatchId, setSelectedMatchId] = useState('');
  const [matchTitulares, setMatchTitulares] = useState<string[]>([]);
  const [matchSuplentes, setMatchSuplentes] = useState<string[]>([]);
  const [matchPlayerStats, setMatchPlayerStats] = useState<{ [playerId: string]: PlayerStats }>({});
  const [scoreClub, setScoreClub] = useState<number>(0);
  const [scoreRival, setScoreRival] = useState<number>(0);

  // Professor limits
  const pfCategories = professor.categorias;
  const filteredPlayers = players.filter(p => pfCategories.includes(p.categoria));
  const pendingMatches = matches.filter(m => pfCategories.includes(m.categoria) && m.estado === 'Programado');
  const playedMatches = matches.filter(m => pfCategories.includes(m.categoria) && m.estado === 'Jugado');
  const filteredAttendances = attendances.filter(a => pfCategories.includes(a.categoria));

  // --- ATTENDANCE ACTIONS ---
  const handleCatChangeForAttendance = (cat: string) => {
    setAttCategory(cat);
    setAttendancePresents([]); // reset selection
    setAttendanceJustifieds([]); // reset selection
  };

  const setPlayerAttendanceStatus = (playerId: string, status: 'Presente' | 'Ausente' | 'Justificado') => {
    if (status === 'Presente') {
      setAttendancePresents(prev => [...prev.filter(id => id !== playerId), playerId]);
      setAttendanceJustifieds(prev => prev.filter(id => id !== playerId));
    } else if (status === 'Justificado') {
      setAttendanceJustifieds(prev => [...prev.filter(id => id !== playerId), playerId]);
      setAttendancePresents(prev => prev.filter(id => id !== playerId));
    } else {
      setAttendancePresents(prev => prev.filter(id => id !== playerId));
      setAttendanceJustifieds(prev => prev.filter(id => id !== playerId));
    }
  };

  const handleSaveAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    const playersInClass = players.filter(p => p.categoria === attCategory);
    if (playersInClass.length === 0) {
      alert("No hay jugadores cargados en esta categoría para tomar asistencia.");
      return;
    }

    const newAttendance: Attendance = {
      id: 'att_' + Date.now(),
      fecha: attDate,
      tipo: attType,
      categoria: attCategory,
      asistentes: attendancePresents,
      justificados: attendanceJustifieds,
    };

    onAddAttendance(newAttendance);
    alert('Asistencia registrada correctamente.');
    setAttendancePresents([]);
    setAttendanceJustifieds([]);
  };

  // --- ROUTINE ACTIONS ---
  const handleAddExerciseRow = () => {
    setExercises([...exercises, { ejercicio: '', series: '3', repeticiones: '10', notas: '' }]);
  };

  const handleRemoveExerciseRow = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleExerciseChange = (index: number, field: string, value: string) => {
    const updated = [...exercises];
    updated[index] = { ...updated[index], [field]: value };
    setExercises(updated);
  };

  const handleSaveRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!routPosicion) {
      alert('Debe elegir una posición destinataria.');
      return;
    }
    if (!routTitle) {
      alert('Defina el título de la rutina gimnástica.');
      return;
    }
    const validExercises = exercises.filter(ex => ex.ejercicio.trim() !== '');
    if (validExercises.length === 0) {
      alert('Agregue al menos un ejercicio válido.');
      return;
    }

    const newRoutine: GymRoutine = {
      id: 'rot_' + Date.now(),
      titulo: routTitle,
      descripcion: routDesc,
      ejercicios: validExercises,
      profesorId: professor.id,
      profesorNombre: `${professor.nombre} ${professor.apellido}`,
      posicion: routPosicion,
      fechaAsignacion: new Date().toISOString().split('T')[0],
    };

    onAddRoutine(newRoutine);
    alert('Rutina de gimnasio asignada con éxito.');
    
    // clean form
    setRoutPosicion(RUGBY_POSITIONS[0]);
    setRoutTitle('');
    setRoutDesc('');
    setExercises([{ ejercicio: '', series: '4', repeticiones: '8', notas: '' }]);
  };

  // --- MATCH SHEET PLANILLA ACTIONS ---
  const handleSelectMatch = (matchId: string) => {
    setSelectedMatchId(matchId);
    const matchObj = matches.find(m => m.id === matchId);
    if (!matchObj) return;

    // initialize rosters and stats
    setMatchTitulares([]);
    setMatchSuplentes([]);
    setScoreClub(0);
    setScoreRival(0);

    const matchPlayers = players.filter(p => p.categoria === matchObj.categoria);
    const initialStats: { [playerId: string]: PlayerStats } = {};
    matchPlayers.forEach(p => {
      initialStats[p.id] = { tackles: 0, tries: 0, conversiones: 0, penales: 0 };
    });
    setMatchPlayerStats(initialStats);
  };

  const toggleMatchRoster = (playerId: string, target: 'titular' | 'suplente' | 'fuera') => {
    // remove from all first
    const cleanTitulares = matchTitulares.filter(id => id !== playerId);
    const cleanSuplentes = matchSuplentes.filter(id => id !== playerId);

    if (target === 'titular') {
      setMatchTitulares([...cleanTitulares, playerId]);
      setMatchSuplentes(cleanSuplentes);
    } else if (target === 'suplente') {
      setMatchTitulares(cleanTitulares);
      setMatchSuplentes([...cleanSuplentes, playerId]);
    } else {
      setMatchTitulares(cleanTitulares);
      setMatchSuplentes(cleanSuplentes);
    }
  };

  const handleStatChange = (playerId: string, statKey: keyof PlayerStats, value: number) => {
    setMatchPlayerStats(prev => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        [statKey]: Math.max(0, value), // limit negatives
      }
    }));
  };

  const handleSaveMatchSheet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatchId) return;

    if (matchTitulares.length === 0) {
      alert("Debe convocar al menos un jugador titular para oficializar la planilla.");
      return;
    }

    // compile stats exclusively for selected match roster
    const activeRoster = [...matchTitulares, ...matchSuplentes];
    const finalStats: { [id: string]: PlayerStats } = {};
    activeRoster.forEach(id => {
      finalStats[id] = matchPlayerStats[id] || { tackles: 0, tries: 0, conversiones: 0, penales: 0 };
    });

    onUpdateMatchStats(selectedMatchId, matchTitulares, matchSuplentes, finalStats, scoreClub, scoreRival);
    alert('Planilla oficial de rugby cargada con éxito. El partido ha sido marcado como "Jugado".');
    setSelectedMatchId('');
  };

  return (
    <div id="professor-panel-root" className="space-y-6">
      {/* Banner */}
      <div className="rounded-xl bg-[#05472A] border border-[#2ECC71]/30 p-6 text-white shadow-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-emerald-950 border border-[#2ECC71]/20 px-2.5 py-0.5 text-[9px] font-mono font-bold tracking-widest uppercase text-[#2ECC71]">
                Cuerpo Técnico / DT
              </span>
              <span className="font-mono text-[9px] text-emerald-200/80">ID: #{professor.id.toUpperCase()}</span>
            </div>
            <h2 className="mt-1 font-sans font-black text-2xl text-white tracking-tight">
              Prof. {professor.nombre} {professor.apellido}
            </h2>
            <p className="mt-1 font-sans text-xs text-emerald-100">
              Categorías de Entrenamiento: <strong className="text-white font-bold">{pfCategories.join(', ')}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex overflow-x-auto whitespace-nowrap space-x-6 pb-2">
          <button
            id="tab-att-trigger"
            onClick={() => setActiveTab('attendance')}
            className={`pb-4 font-sans text-xs font-bold uppercase tracking-wider transition-all border-b-2 relative -mb-[2px] ${
              activeTab === 'attendance'
                ? 'border-slate-950 text-slate-950 font-extrabold'
                : 'border-transparent text-slate-400 hover:text-slate-650'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <UserCheck className="h-4 w-4" />
              Tomar Asistencia
            </span>
          </button>
          
          <button
            id="tab-sheet-trigger"
            onClick={() => setActiveTab('matchsheet')}
            className={`pb-4 font-sans text-xs font-bold uppercase tracking-wider transition-all border-b-2 relative -mb-[2px] ${
              activeTab === 'matchsheet'
                ? 'border-slate-950 text-slate-950 font-extrabold'
                : 'border-transparent text-slate-400 hover:text-slate-650'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <FileSpreadsheet className="h-4 w-4" />
              Planilla de Partido ({pendingMatches.length} pendientes)
            </span>
          </button>

          <button
            id="tab-routines-trigger"
            onClick={() => setActiveTab('routines')}
            className={`pb-4 font-sans text-xs font-bold uppercase tracking-wider transition-all border-b-2 relative -mb-[2px] ${
              activeTab === 'routines'
                ? 'border-slate-950 text-slate-950 font-extrabold'
                : 'border-transparent text-slate-400 hover:text-slate-650'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Dumbbell className="h-4 w-4" />
              Rutinas
            </span>
          </button>
        </div>
      </div>

      {/* TAB: ATTENDANCE */}
      {activeTab === 'attendance' && (
        <div id="prof-attendance-view" className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          
          {/* Create Log Column */}
          <div className="lg:col-span-2 rounded-xl border border-slate-150 bg-white p-6 shadow-xs space-y-4">
            <h3 className="font-sans font-bold text-slate-800 text-base">Registrar Nueva Asistencia</h3>
            
            <form onSubmit={handleSaveAttendance} className="space-y-4 text-xs font-sans">
              
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Fecha de Toma</label>
                  <input
                    id="att-input-fecha"
                    type="date"
                    required
                    value={attDate}
                    onChange={(e) => setAttDate(e.target.value)}
                    className="w-full rounded border border-slate-200 px-3 py-1.5 text-slate-850"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Actividad</label>
                  <select
                    id="att-input-tipo"
                    value={attType}
                    onChange={(e) => setAttType(e.target.value as 'Entrenamiento' | 'Partido')}
                    className="w-full rounded border border-slate-200 px-3 py-1.5 text-slate-850 bg-white"
                  >
                    <option value="Entrenamiento">Entrenamiento Rutinario</option>
                    <option value="Partido">Partido de Rugby</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Categoría</label>
                  <select
                    id="att-input-categoria"
                    value={attCategory}
                    onChange={(e) => handleCatChangeForAttendance(e.target.value)}
                    className="w-full rounded border border-slate-200 px-3 py-1.5 text-slate-850 bg-white font-semibold"
                  >
                    {pfCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Athletes Selection Grid */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="font-sans font-bold text-slate-700 text-xs">Padrón de Jugadores ({players.filter(p => p.categoria === attCategory).length})</h4>
                  <span className="text-[10px] font-mono text-slate-400">Tilde los presentes en el campo</span>
                </div>

                {players.filter(p => p.categoria === attCategory).length === 0 ? (
                  <div className="p-6 text-center text-slate-400">
                    No hay jugadores fichados en la categoría {attCategory} todavía.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2.5">
                    {players.filter(p => p.categoria === attCategory).map(p => {
                      const isPresent = attendancePresents.includes(p.id);
                      const isJustified = attendanceJustifieds.includes(p.id);
                      const isAbsent = !isPresent && !isJustified;
                      return (
                        <div
                          id={`player-attend-card-${p.id}`}
                          key={p.id}
                          className={`flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border p-3 text-left transition ${
                            isPresent
                              ? 'bg-emerald-50/50 border-emerald-250'
                              : isJustified
                              ? 'bg-amber-50/50 border-amber-250 text-amber-900 font-medium'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="mb-2 sm:mb-0">
                            <span className="block text-xs font-bold text-slate-800">{p.apellido}, {p.nombre}</span>
                            <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                              <span className="font-mono text-[9px] text-slate-450">DNI: {p.documento}</span>
                              {p.posicion && (
                                <span className="inline-flex rounded-sm bg-slate-100 px-1 py-0.2 text-[8px] font-extrabold uppercase font-sans text-slate-650 tracking-tight">
                                  🏉 {p.posicion}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md self-start sm:self-auto">
                            <button
                              type="button"
                              onClick={() => setPlayerAttendanceStatus(p.id, 'Presente')}
                              className={`px-3 py-1 text-[10px] font-bold rounded-sm transition cursor-pointer ${
                                isPresent
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'text-slate-500 hover:text-slate-800'
                              }`}
                            >
                              Presente
                            </button>
                            <button
                              type="button"
                              onClick={() => setPlayerAttendanceStatus(p.id, 'Justificado')}
                              className={`px-3 py-1 text-[10px] font-bold rounded-sm transition cursor-pointer ${
                                isJustified
                                  ? 'bg-amber-500 text-white shadow-xs'
                                  : 'text-slate-500 hover:text-slate-800'
                              }`}
                              title="Asistencia justificada por certificado médico, lesión, etc."
                            >
                              Justificado
                            </button>
                            <button
                              type="button"
                              onClick={() => setPlayerAttendanceStatus(p.id, 'Ausente')}
                              className={`px-3 py-1 text-[10px] font-bold rounded-sm transition cursor-pointer ${
                                isAbsent
                                  ? 'bg-rose-500 text-white shadow-xs'
                                  : 'text-slate-500 hover:text-slate-800'
                              }`}
                            >
                              Ausente
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Attendance trigger submit */}
              <div className="border-t border-slate-150 pt-4 flex justify-end">
                <button
                  id="btn-att-submit"
                  type="submit"
                  disabled={players.filter(p => p.categoria === attCategory).length === 0}
                  className={`inline-flex items-center gap-1 bg-green-700 text-white rounded-lg px-4 py-2 font-bold hover:bg-green-800 cursor-pointer ${
                    players.filter(p => p.categoria === attCategory).length === 0 ? 'opacity-40 cursor-not-allowed' : ''
                  }`}
                >
                  <Save className="h-3.5 w-3.5" />
                  Oficializar Asistencia
                </button>
              </div>

            </form>
          </div>

          {/* Historical Logs Column */}
          <div className="rounded-xl border border-slate-150 bg-slate-50 p-5 shadow-inner space-y-4">
            <h3 className="font-sans font-bold text-slate-800 text-sm">Historial de Tomados ({filteredAttendances.length})</h3>
            
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {filteredAttendances.length === 0 ? (
                <p className="text-center py-8 text-slate-400 text-xs">Aún no hay asistencias guardadas para sus categorías.</p>
              ) : (
                filteredAttendances.map(a => (
                  <div key={a.id} className="rounded-lg border border-slate-200 bg-white p-3.5 space-y-1.5 text-xs text-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{a.fecha}</span>
                      <span className="rounded bg-slate-250 px-1.5 py-0.5 font-mono text-[9px] font-bold text-slate-700 uppercase">
                        {a.tipo}
                      </span>
                    </div>
                    <p className="text-slate-500">Categoría: <strong className="text-slate-700 uppercase">{a.categoria}</strong></p>
                    <div className="border-t border-slate-100 pt-2 flex items-center justify-between text-[11px]">
                      <span className="font-medium text-emerald-700">Presentes: {a.asistentes.length} jugadores</span>
                      <span className="text-[10px] text-slate-400">Total: {players.filter(p => p.categoria === a.categoria).length}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

      {/* TAB: MATCH OFFICIAL SHEET */}
      {activeTab === 'matchsheet' && (
        <div id="prof-matchsheet-view" className="space-y-6">
          <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 text-xs text-purple-950 font-medium leading-relaxed shadow-xs">
            <strong>Planilla de Rugby Oficial:</strong> Seleccione de la lista un partido programado para convocar tu XV titular y suplentes, registrar indicadores individuales (Tackles, Tries, Conversiones, Penales) y sancionar el resultado definitivo del encuentro.
          </div>

          {pendingMatches.length === 0 && !selectedMatchId ? (
            <div className="rounded-xl border border-slate-200 bg-white py-12 text-center text-slate-450">
              <Trophy className="h-10 w-10 text-slate-355 mx-auto mb-2" />
              <p className="font-sans font-bold text-slate-700">No hay partidos convocados con ficha de partido pendiente.</p>
              <p className="text-xs text-slate-400 mt-1">Los partidos son programados originalmente por los managers autorizados.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              
              {/* Select Matches List */}
              <div className="rounded-xl border border-slate-150 bg-white p-5 shadow-xs space-y-3 lg:col-span-1 h-fit">
                <h4 className="font-sans font-bold text-slate-800 text-sm">Partidos Habilitados</h4>
                <div className="space-y-2">
                  {pendingMatches.map(m => (
                    <button
                      id={`btn-select-match-${m.id}`}
                      key={m.id}
                      onClick={() => handleSelectMatch(m.id)}
                      className={`w-full text-left rounded-lg border p-3 transition text-xs flex flex-col justify-between ${
                        selectedMatchId === m.id 
                          ? 'border-purple-600 bg-purple-50/50 ring-2 ring-purple-500/10' 
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <strong className="text-slate-800 text-sm font-bold truncate">vs {m.rival}</strong>
                        <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[9px] font-bold text-purple-700 uppercase">
                          {m.categoria}
                        </span>
                      </div>
                      <p className="text-slate-500 mt-1">Fecha: {m.fecha} ({m.lugar})</p>
                    </button>
                  ))}
                </div>

                {playedMatches.length > 0 && (
                  <div className="pt-4 border-t border-slate-100">
                    <span className="block text-[10px] uppercase font-bold text-slate-400 mb-2">Partidos Jugados Recientes</span>
                    <div className="space-y-1.5 max-h-44 overflow-y-auto text-xs pr-1">
                      {playedMatches.map(pm => (
                        <div key={pm.id} className="rounded border border-slate-100 bg-slate-50 p-2 flex justify-between items-center text-slate-650">
                          <div>
                            <p className="font-bold text-slate-850">vs UAR {pm.rival}</p>
                            <span className="text-[9px] text-slate-400">{pm.fecha} ({pm.categoria})</span>
                          </div>
                          <span className="font-mono font-black text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                            {pm.resultadoClub} - {pm.resultadoRival}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Roster & Statistics Entry Form Sheet */}
              <div className="lg:col-span-2 rounded-xl border border-slate-150 bg-white p-6 shadow-xs">
                {selectedMatchId === '' ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center text-slate-405 font-sans">
                    <AlertCircle className="h-8 w-8 text-slate-355 mb-2" />
                    <p className="font-medium text-sm">Seleccione un partido a la izquierda para iniciar la carga.</p>
                  </div>
                ) : (
                  (() => {
                    const match = matches.find(m => m.id === selectedMatchId)!;
                    const matchPlayers = players.filter(p => p.categoria === match.categoria);

                    return (
                      <form onSubmit={handleSaveMatchSheet} className="space-y-6 text-xs font-sans">
                        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                          <div>
                            <h3 className="font-extrabold text-slate-800 text-base">Planilla Oficial - vs {match.rival}</h3>
                            <p className="text-slate-500">Categoría: {match.categoria} | Fecha: {match.fecha} a las {match.hora}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Condición</span>
                            <span className="font-bold text-purple-750 uppercase">{match.lugar}</span>
                          </div>
                        </div>

                        {/* Final score inputs */}
                        <div className="rounded-lg bg-slate-50 p-4 border border-slate-200">
                          <h4 className="font-sans font-bold text-slate-755 text-xs mb-2.5">Resultado Definitivo del Marcador</h4>
                          <div className="flex items-center gap-4">
                            <div className="space-y-1 block shrink-0">
                              <label className="block text-[10px] font-bold text-slate-500 uppercase">Taller Rugby Club</label>
                              <input
                                id="score-input-club"
                                type="number"
                                required
                                value={scoreClub}
                                onChange={(e) => setScoreClub(parseInt(e.target.value) || 0)}
                                className="w-24 rounded border border-slate-300 bg-white px-3 py-1.5 font-sans font-bold text-sm text-slate-800"
                              />
                            </div>
                            <span className="font-bold text-slate-400 text-lg pt-4">v</span>
                            <div className="space-y-1 block shrink-0">
                              <label className="block text-[10px] font-bold text-slate-500 uppercase">Club {match.rival}</label>
                              <input
                                id="score-input-rival"
                                type="number"
                                required
                                value={scoreRival}
                                onChange={(e) => setScoreRival(parseInt(e.target.value) || 0)}
                                className="w-24 rounded border border-slate-300 bg-white px-3 py-1.5 font-sans font-bold text-sm text-slate-800"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Player Selection and Stats grid */}
                        <div className="space-y-3">
                          <h4 className="font-sans font-bold text-slate-755 text-xs border-b border-slate-100 pb-1">Convocatoria & Estadísticas Individuales</h4>
                          
                          {matchPlayers.length === 0 ? (
                            <p className="text-slate-400">No hay jugadores cargados en la categoría {match.categoria}. El manager debe registrarlos primero.</p>
                          ) : (
                            <div className="space-y-3">
                              {matchPlayers.map(p => {
                                const isTitular = matchTitulares.includes(p.id);
                                const isSuplente = matchSuplentes.includes(p.id);
                                const pStats = matchPlayerStats[p.id] || { tackles: 0, tries: 0, conversiones: 0, penales: 0 };

                                return (
                                  <div key={p.id} className="rounded-lg border border-slate-150 p-3.5 space-y-2.5 bg-white shadow-xs">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
                                      <div>
                                        <strong className="text-slate-800 block text-xs font-semibold">{p.apellido}, {p.nombre}</strong>
                                        <span className="font-mono text-[9px] text-slate-400">DNI: {p.documento}</span>
                                      </div>

                                      {/* Selection Toggles */}
                                      <div className="flex items-center gap-1.5">
                                        <button
                                          id={`btn-set-titular-${p.id}`}
                                          type="button"
                                          onClick={() => toggleMatchRoster(p.id, isTitular ? 'fuera' : 'titular')}
                                          className={`px-2.5 py-1 text-[9px] font-bold rounded uppercase transition-colors cursor-pointer ${
                                            isTitular 
                                              ? 'bg-green-700 text-white border-green-750 border' 
                                              : 'bg-slate-50 text-slate-700 border-slate-200 border hover:bg-slate-100'
                                          }`}
                                        >
                                          Titular (XV)
                                        </button>
                                        <button
                                          id={`btn-set-suplente-${p.id}`}
                                          type="button"
                                          onClick={() => toggleMatchRoster(p.id, isSuplente ? 'fuera' : 'suplente')}
                                          className={`px-2.5 py-1 text-[9px] font-bold rounded uppercase transition-colors cursor-pointer ${
                                            isSuplente 
                                              ? 'bg-purple-700 text-white border-purple-750 border' 
                                              : 'bg-slate-50 text-slate-705 border-slate-200 border hover:bg-slate-100'
                                          }`}
                                        >
                                          Suplente
                                        </button>
                                        {(isTitular || isSuplente) && (
                                          <span className="text-[10px] text-emerald-650 font-bold">✓ Convocado</span>
                                        )}
                                      </div>
                                    </div>

                                    {/* Stats input (Only if player is selected to play!) */}
                                    {(isTitular || isSuplente) && (
                                      <div className="grid grid-cols-4 gap-2.5 bg-slate-50 p-2.5 rounded border border-slate-150 transition-all">
                                        
                                        <div className="space-y-1">
                                          <label className="block text-[9px] text-slate-500 font-bold uppercase">Tackles</label>
                                          <input
                                            id={`stat-tackles-${p.id}`}
                                            type="number"
                                            value={pStats.tackles}
                                            onChange={(e) => handleStatChange(p.id, 'tackles', parseInt(e.target.value) || 0)}
                                            className="w-full rounded border border-slate-300 bg-white p-1 text-center font-bold"
                                          />
                                        </div>

                                        <div className="space-y-1">
                                          <label className="block text-[9px] text-slate-500 font-bold uppercase">Tries</label>
                                          <input
                                            id={`stat-tries-${p.id}`}
                                            type="number"
                                            value={pStats.tries}
                                            onChange={(e) => handleStatChange(p.id, 'tries', parseInt(e.target.value) || 0)}
                                            className="w-full rounded border border-slate-300 bg-white p-1 text-center font-bold"
                                          />
                                        </div>

                                        <div className="space-y-1">
                                          <label className="block text-[9px] text-slate-500 font-bold uppercase">Conversiones</label>
                                          <input
                                            id={`stat-conversiones-${p.id}`}
                                            type="number"
                                            value={pStats.conversiones}
                                            onChange={(e) => handleStatChange(p.id, 'conversiones', parseInt(e.target.value) || 0)}
                                            className="w-full rounded border border-slate-300 bg-white p-1 text-center font-bold"
                                          />
                                        </div>

                                        <div className="space-y-1">
                                          <label className="block text-[9px] text-slate-500 font-bold uppercase">Penales</label>
                                          <input
                                            id={`stat-penales-${p.id}`}
                                            type="number"
                                            value={pStats.penales}
                                            onChange={(e) => handleStatChange(p.id, 'penales', parseInt(e.target.value) || 0)}
                                            className="w-full rounded border border-slate-300 bg-white p-1 text-center font-bold"
                                          />
                                        </div>

                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Save trigger buttons */}
                        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 border-t border-slate-100 pt-4">
                          <button
                            id="btn-match-sheet-cancel"
                            type="button"
                            onClick={() => setSelectedMatchId('')}
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                          >
                            Cerrar Planilla
                          </button>
                          <button
                            id="btn-match-sheet-save"
                            type="submit"
                            className="rounded-lg bg-green-700 px-4 py-2 font-bold text-white hover:bg-green-800 transition cursor-pointer"
                          >
                            Oficializar Ficha de Partido
                          </button>
                        </div>
                      </form>
                    );
                  })()
                )}
              </div>

            </div>
          )}
        </div>
      )}

      {/* TAB: PRESCRIPTION ROUTINES */}
      {activeTab === 'routines' && (
        <div id="prof-routines-view" className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          
          {/* Create Routine Column Form */}
          <div className="lg:col-span-2 rounded-xl border border-slate-150 bg-white p-6 shadow-xs">
            <h3 className="font-sans font-bold text-slate-800 text-base mb-4 flex items-center gap-1.5">
              <PlusCircle className="h-5 w-5 text-purple-650" />
              Diseñar Rutinas de Entrenamiento
            </h3>

            <form onSubmit={handleSaveRoutine} className="space-y-4 text-xs font-sans">
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Seleccionar Posición Target *</label>
                  <select
                    id="routine-input-posicion"
                    required
                    value={routPosicion}
                    onChange={(e) => setRoutPosicion(e.target.value)}
                    className="w-full rounded border border-slate-200 px-3 py-2 font-sans text-xs text-slate-850 bg-white font-medium focus:outline-hidden"
                  >
                    {RUGBY_POSITIONS.map(pos => (
                      <option key={pos} value={pos}>
                        {pos}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Título de la Rutina *</label>
                  <input
                    id="routine-input-titulo"
                    type="text"
                    required
                    value={routTitle}
                    onChange={(e) => setRoutTitle(e.target.value)}
                    placeholder="Ej. Fuerza Explosiva - Scrum"
                    className="w-full rounded border border-slate-200 px-3 py-2 font-sans text-xs text-slate-850 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Descripción / Enfoque General</label>
                <textarea
                  id="routine-input-desc"
                  rows={2}
                  value={routDesc}
                  onChange={(e) => setRoutDesc(e.target.value)}
                  placeholder="Ej. Fortalecimiento cervical, empuje simétrico y potencia explosiva en saltos."
                  className="w-full rounded border border-slate-200 px-3 py-1.5 font-sans text-xs text-slate-850 focus:outline-hidden"
                />
              </div>

              {/* Dynamic exercises lines list */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Lista de Ejercicios de Carga</span>
                  <button
                    id="btn-add-exercise-row"
                    type="button"
                    onClick={handleAddExerciseRow}
                    className="inline-flex items-center gap-1 font-sans text-[10px] font-bold text-purple-700 hover:text-purple-800 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" /> Agregar Ejercicio
                  </button>
                </div>

                <div className="space-y-2">
                  {exercises.map((ex, index) => (
                    <div key={index} className="flex gap-2 items-center bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      
                      <div className="grow space-y-1">
                        <input
                          id={`exercise-name-input-${index}`}
                          type="text"
                          required
                          placeholder="Nombre del Ejercicio (Ej. Peso Muerto)"
                          value={ex.ejercicio}
                          onChange={(e) => handleExerciseChange(index, 'ejercicio', e.target.value)}
                          className="w-full rounded border border-slate-350 bg-white px-2 py-1 font-sans text-xs"
                        />
                      </div>

                      <div className="w-16 space-y-1">
                        <input
                          id={`exercise-series-input-${index}`}
                          type="text"
                          required
                          placeholder="Series"
                          value={ex.series}
                          onChange={(e) => handleExerciseChange(index, 'series', e.target.value)}
                          className="w-full rounded border border-slate-350 bg-white px-2 py-1 text-center font-sans text-xs"
                        />
                      </div>

                      <div className="w-24 space-y-1">
                        <input
                          id={`exercise-reps-input-${index}`}
                          type="text"
                          required
                          placeholder="Repeticiones"
                          value={ex.repeticiones}
                          onChange={(e) => handleExerciseChange(index, 'repeticiones', e.target.value)}
                          className="w-full rounded border border-slate-350 bg-white px-2 py-1 text-center font-sans text-xs"
                        />
                      </div>

                      <div className="w-32 hidden sm:block space-y-1">
                        <input
                          id={`exercise-notes-input-${index}`}
                          type="text"
                          placeholder="Notas / RM %"
                          value={ex.notes}
                          onChange={(e) => handleExerciseChange(index, 'notes', e.target.value)}
                          className="w-full rounded border border-slate-350 bg-white px-2 py-1 font-sans text-xs"
                        />
                      </div>

                      {exercises.length > 1 && (
                        <button
                          id={`btn-remove-exercise-row-${index}`}
                          type="button"
                          onClick={() => handleRemoveExerciseRow(index)}
                          className="rounded p-1 text-slate-400 hover:text-red-500 hover:bg-slate-100 cursor-pointer"
                        >
                          <UserMinus className="h-4 w-4" />
                        </button>
                      )}

                    </div>
                  ))}
                </div>
              </div>

              {/* Form trigger save */}
              <div className="border-t border-slate-100 pt-4 flex justify-end">
                <button
                  id="btn-routine-submit"
                  type="submit"
                  className="rounded-lg bg-green-700 px-5 py-2 font-bold text-white hover:bg-green-800 transition shadow-xs cursor-pointer"
                >
                  Asignar Rutina Fisiológica
                </button>
              </div>

            </form>
          </div>

          {/* Recently assigned list */}
          <div className="rounded-xl border border-slate-150 bg-slate-50 p-5 shadow-inner space-y-4 lg:col-span-1">
            <h4 className="font-sans font-bold text-slate-800 text-sm">Rutinas Registradas</h4>
            
            <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
              {routines.filter(r => r.profesorId === professor.id).length === 0 ? (
                <p className="text-center py-8 text-slate-400 text-xs">No ha guardado rutinas deportivas en esta sesión todavía.</p>
              ) : (
                routines.filter(r => r.profesorId === professor.id).map(r => {
                  return (
                    <div key={r.id} className="rounded-lg border border-slate-200 bg-white p-3.5 space-y-2 text-xs text-slate-705">
                      <div className="flex items-center justify-between">
                        <strong className="text-slate-900 block font-bold text-xs truncate max-w-[170px]">{r.titulo}</strong>
                        <span className="text-[9px] text-slate-400 font-mono">{r.fechaAsignacion}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 italic truncate">{r.descripcion}</p>
                      
                      <div className="border-t border-slate-100 pt-2 flex items-center justify-between text-[11px] font-sans">
                        <span className="text-purple-750 font-bold">🏉 {r.posicion || 'General'}</span>
                        <span className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-[9px] font-bold text-slate-600">{r.ejercicios.length} Ejercicios</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
