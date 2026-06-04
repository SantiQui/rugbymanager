import React, { useState, useRef } from 'react';
import { Player, Match, GymRoutine, JustificationDoc, FundraiserCampaign, FichajeInstallment } from '../types';
import { Award, CheckCircle2, ShieldAlert, Heart, Calendar, PlaySquare, Dumbbell, Clipboard, Activity, Star, Eye, Check, Upload, Trash2, FileText, Info, Clock, MapPin, Trophy, DollarSign, Megaphone, Percent, Smartphone, Mail, Plus, Minus } from 'lucide-react';
import MedicalFileViewer from './MedicalFileViewer';

interface PlayerPanelProps {
  player: Player;
  matches: Match[];
  routines: GymRoutine[];
  onUpdatePlayer: (updatedP: Player) => void;
  campaigns?: FundraiserCampaign[];
  onUpdateCampaigns?: (updatedCampaigns: FundraiserCampaign[]) => void;
}

export default function PlayerPanel({ 
  player, 
  matches, 
  routines, 
  onUpdatePlayer,
  campaigns = [],
  onUpdateCampaigns
}: PlayerPanelProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'stats' | 'routines' | 'fixture' | 'fichajes' | 'campanas'>('profile');
  const [viewingMedicalCard, setViewingMedicalCard] = useState(false);
  const [fixtureFilter, setFixtureFilter] = useState<'all' | 'scheduled' | 'played'>('all');

  // Absence/injury justification states
  const [justMotivo, setJustMotivo] = useState('Lesión / Afección Médica');
  const [justFileName, setJustFileName] = useState('');
  const [justFileBase64, setJustFileBase64] = useState('');
  const justFileInputRef = useRef<HTMLInputElement>(null);

  const handleJustificationFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setJustFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setJustFileBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveJustification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!justFileName) {
      console.log('Por favor, examine e introduzca un archivo de certificado primero.');
      return;
    }

    const newJust: JustificationDoc = {
      id: 'just_' + Date.now(),
      nombreArchivo: justFileName,
      fechaCarga: new Date().toISOString().split('T')[0],
      motivo: justMotivo,
      datosBase64: justFileBase64 || 'data:application/pdf;base64,...'
    };

    const currentJustificaciones = player.justificaciones || [];
    onUpdatePlayer({
      ...player,
      justificaciones: [...currentJustificaciones, newJust]
    });

    // Reset fields
    setJustFileName('');
    setJustFileBase64('');
    if (justFileInputRef.current) justFileInputRef.current.value = '';
    console.log('¡Justificativo digital cargado y guardado con éxito! El profesor podrá constatar la justificación en la asistencia.');
  };

  const handleDeleteJustification = (justId: string) => {
    if (window.confirm('¿Seguro que quiere desvincular y eliminar este justificativo? El profesor verá la falta como injustificada si corresponde.')) {
      const currentJustificaciones = player.justificaciones || [];
      onUpdatePlayer({
        ...player,
        justificaciones: currentJustificaciones.filter(j => j.id !== justId)
      });
    }
  };

  // Completed items checklist inside fitness routines
  const [completedExercises, setCompletedExercises] = useState<{ [id: string]: boolean }>({});

  const handleToggleExerciseCheck = (exerciseKey: string) => {
    setCompletedExercises(prev => ({
      ...prev,
      [exerciseKey]: !prev[exerciseKey]
    }));
  };

  // Extract matches of player's category or where player is convocated
  const playerCategoryMatches = matches.filter(m => 
    m.categoria === player.categoria || m.titulares.includes(player.id) || m.suplentes.includes(player.id)
  );

  // Extract matches played by this player
  const playedMatchesWithPlayer = matches.filter(m => {
    return m.estado === 'Jugado' && (m.titulares.includes(player.id) || m.suplentes.includes(player.id));
  });

  // Calculate stats totals
  let totalTackles = 0;
  let totalTries = 0;
  let totalConversiones = 0;
  let totalPenales = 0;
  let totalPoints = 0;

  playedMatchesWithPlayer.forEach(m => {
    const pStats = m.estadisticas[player.id];
    if (pStats) {
      totalTackles += pStats.tackles;
      totalTries += pStats.tries;
      totalConversiones += pStats.conversiones;
      totalPenales += pStats.penales;
      // Rugby Scoring: Try = 5pts, Conversion = 2pts, Penal = 3pts
      totalPoints += (pStats.tries * 5) + (pStats.conversiones * 2) + (pStats.penales * 3);
    }
  });

  const assignedRoutines = routines.filter(r => 
    r.jugadorId === player.id || 
    (r.posicion && player.posicion && player.posicion.includes(r.posicion))
  );
  const isMedicalApproved = player.fichaMedicaUrl !== null;

  // Sorting and filtering matches for fixture view
  const sortedMatches = [...playerCategoryMatches].sort((a, b) => a.fecha.localeCompare(b.fecha));
  const nextScheduledMatch = sortedMatches.find(m => m.estado === 'Programado');

  const getMonthLabel = (dateStr: string) => {
    const parts = dateStr.split('-');
    if (parts.length < 2) return 'Otros';
    const monthNum = parseInt(parts[1], 10);
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return `${months[monthNum - 1]} ${parts[0]}`;
  };

  const filteredFixtureMatches = sortedMatches.filter(m => {
    if (fixtureFilter === 'scheduled') return m.estado === 'Programado';
    if (fixtureFilter === 'played') return m.estado === 'Jugado';
    return true;
  });

  const groupedMonthsKeys: string[] = [];
  const groupedMatches: { [key: string]: Match[] } = {};

  filteredFixtureMatches.forEach(m => {
    const key = getMonthLabel(m.fecha);
    if (!groupedMatches[key]) {
      groupedMatches[key] = [];
      groupedMonthsKeys.push(key);
    }
    groupedMatches[key].push(m);
  });

  return (
    <div id="player-panel-root" className="space-y-6">
      
      {/* Top Profile Banner Card */}
      <div className="rounded-xl border border-[#2ECC71]/30 bg-[#05472A] p-6 text-white shadow-md relative overflow-hidden">
        
        {/* Subtle glow */}
        <div className="absolute top-0 right-0 h-44 w-44 rounded-full bg-emerald-950/40 blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-emerald-950 text-[#2ECC71] font-sans font-black flex items-center justify-center text-lg border border-[#2ECC71]/30 shadow-sm">
              {player.nombre.charAt(0)}{player.apellido.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-emerald-950 border border-[#2ECC71]/20 px-2 py-0.5 font-sans font-bold text-[9px] tracking-wider uppercase text-[#2ECC71]">
                  Acreditación Deportiva - UAR
                </span>
                <span className="font-mono text-[9px] text-emerald-200/80">DNI: {player.documento}</span>
              </div>
              <h2 className="mt-1 font-sans font-black text-xl text-white tracking-tight">
                {player.nombre} {player.apellido}
              </h2>
              <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded bg-gray-900 px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-widest">{player.categoria}</span>

                    {/* Mostrar Posiciones del Jugador */}
                    {player.posicion?.split(', ').map((pos, index) => (
                    <span key={index} className={`rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest border ${index === 0 ? 'bg-gray-200 border-gray-300 text-gray-800' : 'bg-white border-gray-200 text-gray-500'}`}>
                    {pos}
                  </span>
                    ))}
                </div>
              <p className="mt-0.5 font-sans text-xs text-emerald-100 font-semibold uppercase">
                Categoría Oficial: <span className="text-white font-bold">{player.categoria}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {isMedicalApproved ? (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5 font-sans text-xs font-extrabold text-emerald-800 shadow-sm uppercase tracking-wide">
                <CheckCircle2 className="h-4 w-4 text-emerald-650" /> APTO DEPORTIVO
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 border border-red-200 px-3 py-1.5 font-sans text-xs font-extrabold text-red-800 shadow-sm uppercase tracking-wide">
                <ShieldAlert className="h-4 w-4 text-red-600" /> NO HABILITADO
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="border-b border-slate-200">
        <div className="flex overflow-x-auto whitespace-nowrap space-x-6 pb-2">
          <button
            id="player-tab-profile-trigger"
            onClick={() => setActiveTab('profile')}
            className={`pb-4 font-sans text-xs font-bold uppercase tracking-wider transition-all border-b-2 relative -mb-[2px] ${
              activeTab === 'profile'
                ? 'border-slate-950 text-slate-950 font-extrabold'
                : 'border-transparent text-slate-400 hover:text-slate-655'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Clipboard className="h-4 w-4" />
              Perfil & Ficha Médica
            </span>
          </button>
          
          <button
            id="player-tab-stats-trigger"
            onClick={() => setActiveTab('stats')}
            className={`pb-4 font-sans text-xs font-bold uppercase tracking-wider transition-all border-b-2 relative -mb-[2px] ${
              activeTab === 'stats'
                ? 'border-slate-950 text-slate-950 font-extrabold'
                : 'border-transparent text-slate-400 hover:text-slate-655'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Activity className="h-4 w-4" />
              Estadísticas ({playedMatchesWithPlayer.length})
            </span>
          </button>

          <button
            id="player-tab-fixture-trigger"
            onClick={() => setActiveTab('fixture')}
            className={`pb-4 font-sans text-xs font-bold uppercase tracking-wider transition-all border-b-2 relative -mb-[2px] ${
              activeTab === 'fixture'
                ? 'border-slate-950 text-slate-950 font-extrabold'
                : 'border-transparent text-slate-400 hover:text-slate-655'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              Fixture ({playerCategoryMatches.length})
            </span>
          </button>

          <button
            id="player-tab-routines-trigger"
            onClick={() => setActiveTab('routines')}
            className={`pb-4 font-sans text-xs font-bold uppercase tracking-wider transition-all border-b-2 relative -mb-[2px] ${
              activeTab === 'routines'
                ? 'border-slate-950 text-slate-950 font-extrabold'
                : 'border-transparent text-slate-400 hover:text-slate-655'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Dumbbell className="h-4 w-4" />
              Rutinas ({assignedRoutines.length})
            </span>
          </button>

          <button
            id="player-tab-fichajes-trigger"
            onClick={() => setActiveTab('fichajes')}
            className={`pb-4 font-sans text-xs font-bold uppercase tracking-wider transition-all border-b-2 relative -mb-[2px] ${
              activeTab === 'fichajes'
                ? 'border-slate-950 text-slate-950 font-extrabold'
                : 'border-transparent text-slate-400 hover:text-slate-655'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <DollarSign className="h-4 w-4" />
              Mi Fichaje UAR
            </span>
          </button>

          <button
            id="player-tab-campanas-trigger"
            onClick={() => setActiveTab('campanas')}
            className={`pb-4 font-sans text-xs font-bold uppercase tracking-wider transition-all border-b-2 relative -mb-[2px] ${
              activeTab === 'campanas'
                ? 'border-slate-950 text-[#05472A] font-extrabold border-b-[#05472A]'
                : 'border-transparent text-slate-400 hover:text-slate-655'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Megaphone className="h-4 w-4 text-emerald-600" />
              Campaña Cooperativa
            </span>
          </button>
        </div>
      </div>

      {/* TAB: PROFILE & ACCREDITED MEDICAL CARD */}
      {activeTab === 'profile' && (
        <div id="player-profile-tab" className="grid grid-cols-1 gap-6 md:grid-cols-3">
          
          {/* Demographic Data */}
          <div className="rounded-xl border border-slate-150 bg-white p-6 shadow-xs space-y-4 md:col-span-1">
            <h3 className="font-sans font-bold text-slate-800 text-sm border-b border-slate-100 pb-2">Datos de Fichaje Club</h3>
            
            <div className="space-y-3.5 text-xs font-sans text-slate-650">
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400">Nombre Completo</span>
                <strong className="text-slate-850 text-sm font-semibold">{player.apellido}, {player.nombre}</strong>
              </div>
              
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400">DNI Oficial</span>
                <strong className="font-mono text-slate-850 font-medium">{player.documento}</strong>
              </div>

              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400">Fecha de Nacimiento</span>
                <span className="font-medium text-slate-805">{player.fecha_nacimiento}</span>
              </div>

              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400">Correo Electrónico</span>
                <span className="font-medium text-slate-805 select-all">{player.correo}</span>
              </div>

              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400">Teléfono Celular</span>
                <span className="font-medium text-slate-805">{player.telefono || 'No registrado'}</span>
              </div>

              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400">Categoría Deportiva</span>
                <span className="rounded bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800 uppercase block w-fit mt-1">
                  UAR {player.categoria}
                </span>
              </div>
            </div>
          </div>

          {/* Medical Clearance Box tab */}
          <div className="rounded-xl border border-slate-150 bg-white p-6 shadow-xs space-y-4 md:col-span-2">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Heart className="h-5 w-5 text-[#2ECC71] fill-[#2ECC71]/20" />
              <h3 className="font-sans font-bold text-slate-800 text-sm">Ficha Médica firmada de la UAR</h3>
            </div>

            {isMedicalApproved ? (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-50 p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-sans font-bold text-emerald-800 text-xs">Apto Médico Validado para Rugby de Alta Competencia</h4>
                    <p className="mt-1 font-sans text-xs text-slate-700 leading-relaxed font-normal">
                      Su Ficha Médica digital certificada por la Unión Argentina de Rugby ha sido presentada y auditada eficazmente por el Manager del Club el día <strong>{player.fichaMedicaFecha}</strong>. Su habilitación administrativa para partidos de torneo nacional es <strong className="text-emerald-800">vigente</strong>.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="h-6 w-6 text-amber-500 flex-shrink-0" />
                  <div className="space-y-2">
                    <h4 className="text-amber-800 font-bold text-sm uppercase tracking-wider">Falta Ficha Médica Certificada</h4>
                    <p className="text-amber-700 text-xs leading-relaxed">
                      Se encuentra en situación de <strong>No Habilitado</strong>. La UAR exige subir anualmente la ficha de apto físico firmada por un médico cardiólogo acreditado.
                    </p>
                    <div className="bg-amber-100/50 border border-amber-200 rounded-lg p-3 mt-3">
                      <p className="text-amber-800 text-xs font-semibold">
                        Entregue su certificado al Manager de la categoría para que efectúe la carga digital.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* TABLA DE JUSTIFICATIVOS DE LESIÓN O INASISTENCIA */}
          <div className="rounded-xl border border-slate-150 bg-white p-6 shadow-xs space-y-5 md:col-span-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <FileText className="h-5 w-5 text-indigo-650" />
              <div>
                <h3 className="font-sans font-bold text-slate-800 text-sm">Justificativos de Inasistencia o Lesión</h3>
                <p className="text-[10px] font-mono text-slate-400">Presente sus certificados para justificar sanciones o faltas registradas por los preparadores</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Form de presentación */}
              <form onSubmit={handleSaveJustification} className="space-y-4 rounded-lg border border-slate-100 bg-slate-50/50 p-4">
                <span className="block text-xs font-bold text-slate-700">Presentar Certificado Justificatorio</span>
                
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Motivo / Causa de la Inasistencia</label>
                  <select
                    value={justMotivo}
                    onChange={(e) => setJustMotivo(e.target.value)}
                    className="w-full rounded-md border border-slate-250 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-slate-400"
                  >
                    <option value="Lesión / Afección Médica">Lesión / Afección Médica (Kinesiología)</option>
                    <option value="Licencia por Estudio/Examen">Licencia por Estudio o Examen</option>
                    <option value="Compromiso Laboral">Compromiso Laboral / Viaje de Trabajo</option>
                    <option value="Asunto Familiar o Fuerza Mayor">Asunto Familiar o de Fuerza Mayor</option>
                    <option value="Otro">Otro (Especificar en archivo)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Archivo Certificado (PDF / Imagen)</label>
                  <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-250 bg-white p-4 text-center cursor-pointer hover:bg-slate-100/50 transition"
                       onClick={() => justFileInputRef.current?.click()}>
                    <Upload className="h-6 w-6 text-slate-400 mb-1.5" />
                    {justFileName ? (
                      <div className="space-y-1">
                        <span className="block text-xs font-bold text-emerald-700 truncate max-w-xs">{justFileName}</span>
                        <span className="text-[9px] text-slate-400">Haga click para cambiar</span>
                      </div>
                    ) : (
                      <div className="space-y-0.5">
                        <span className="block text-xs font-semibold text-slate-655">Seleccionar Archivo</span>
                        <span className="text-[9px] text-slate-400">Se aceptan PDF o imágenes de aval médico</span>
                      </div>
                    )}
                  </div>
                  <input
                    ref={justFileInputRef}
                    type="file"
                    accept=".pdf,image/*"
                    onChange={handleJustificationFileSelect}
                    className="hidden"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded bg-slate-900 py-2 text-xs font-bold text-white hover:bg-slate-800 transition cursor-pointer"
                >
                  Subir y Registrar Justificativo
                </button>
              </form>

              {/* Historial de justificativos cargados */}
              <div className="space-y-4">
                <span className="block text-xs font-bold text-slate-755">Historial de Certificados Presentados</span>
                
                {(!player.justificaciones || player.justificaciones.length === 0) ? (
                  <div className="rounded-lg border border-dashed border-slate-200 bg-white p-8 text-center text-slate-400">
                    <Info className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-sans text-xs font-medium">Usted no registra inasistencias cargadas todavía.</p>
                    <p className="text-[10px] text-slate-400 mt-1">Cargue su documento digital de aval a la izquierda si el cuerpo docente registra su inasistencia.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {player.justificaciones.map((just) => (
                      <div
                        key={just.id}
                        className="rounded-lg border border-slate-150 bg-white p-3 flex items-center justify-between hover:border-slate-300 transition-colors"
                      >
                        <div className="truncate pr-4 space-y-0.5">
                          <span className="inline-flex rounded-sm bg-slate-100 px-1 py-0.2 text-[8px] font-extrabold uppercase font-sans text-slate-600 tracking-tight">
                            📝 {just.motivo}
                          </span>
                          <span className="block text-xs font-semibold text-slate-800 truncate">{just.nombreArchivo}</span>
                          <span className="block text-[9px] font-mono text-slate-400">Fecha Carga: {just.fechaCarga}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => console.log(`Visualizando / Descargando justificativo: ${just.nombreArchivo} (Certificado de inasistencia oficial digitalizado)`)}
                            className="rounded p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 transition-colors cursor-pointer"
                            title="Descargar Certificado"
                          >
                            <span className="text-[10px] font-bold underline">Descargar</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteJustification(just.id)}
                            className="rounded p-1.5 text-slate-450 hover:text-rose-600 hover:bg-slate-50 transition cursor-pointer"
                            title="Eliminar justificativo"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      )}

      {/* TAB: MATCH STATISTICS AND PERFORMANCE CHARTS */}
      {activeTab === 'stats' && (
        <div id="player-stats-tab" className="space-y-6">
          
          {/* Summary metrics row/grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            
            <div className="rounded-xl border border-slate-100 bg-white p-4 text-center shadow-xs">
              <span className="block font-sans text-[10px] uppercase font-bold text-slate-400">Total Puntos</span>
              <strong className="block text-2xl font-sans font-black text-slate-900 mt-1">{totalPoints}</strong>
              <span className="text-[9px] font-serif italic text-slate-400">temporada</span>
            </div>

            <div className="rounded-xl border border-slate-100 bg-white p-4 text-center shadow-xs">
              <span className="block font-sans text-[10px] uppercase font-bold text-slate-400">Tackles</span>
              <strong className="block text-2xl font-sans font-black text-slate-900 mt-1">{totalTackles}</strong>
              <span className="text-[9px] font-sans text-emerald-600 block font-medium">Avg: {(playedMatchesWithPlayer.length ? (totalTackles/playedMatchesWithPlayer.length).toFixed(1) : 0)} / game</span>
            </div>

            <div className="rounded-xl border border-slate-100 bg-white p-4 text-center shadow-xs">
              <span className="block font-sans text-[10px] uppercase font-bold text-slate-400">Tries</span>
              <strong className="block text-2xl font-sans font-black text-slate-900 mt-1">{totalTries}</strong>
              <span className="text-[9px] font-sans text-indigo-650 block font-bold">{totalTries * 5} pts</span>
            </div>

            <div className="rounded-xl border border-slate-100 bg-white p-4 text-center shadow-xs">
              <span className="block font-sans text-[10px] uppercase font-bold text-slate-400">Conversiones</span>
              <strong className="block text-2xl font-sans font-black text-slate-900 mt-1">{totalConversiones}</strong>
              <span className="text-[9px] font-sans text-purple-650 block font-bold">{totalConversiones * 2} pts</span>
            </div>

            <div className="rounded-xl border border-slate-100 bg-white p-4 text-center shadow-xs">
              <span className="block font-sans text-[10px] uppercase font-bold text-slate-400">Penales</span>
              <strong className="block text-2xl font-sans font-black text-slate-900 mt-1">{totalPenales}</strong>
              <span className="text-[9px] font-sans text-amber-655 block font-bold">{totalPenales * 3} pts</span>
            </div>

          </div>

          <div className="w-full">
            
            {/* Matches history list table */}
            <div className="rounded-xl border border-slate-150 bg-white shadow-xs overflow-hidden">
              <div className="border-b border-slate-100 bg-slate-50 px-5 py-3">
                <span className="text-xs font-sans font-bold text-slate-800">Historial Individual de Fichas de Partido</span>
              </div>

              {playedMatchesWithPlayer.length === 0 ? (
                <div className="p-8 text-center text-slate-450 font-sans text-xs">
                  No se registran estadísticas cargadas para este jugador en la base actual.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-slate-50 text-slate-400 uppercase tracking-wider font-semibold">
                      <tr>
                        <th className="px-5 py-2.5 text-[9px]">Fecha / Rival</th>
                        <th className="px-5 py-2.5 text-center text-[9px]">Tackles</th>
                        <th className="px-5 py-2.5 text-center text-[9px]">Tries</th>
                        <th className="px-5 py-2.5 text-center text-[9px]">Convs.</th>
                        <th className="px-5 py-2.5 text-center text-[9px]">Penales</th>
                        <th className="px-5 py-2.5 text-right text-[9px]">Rol</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {playedMatchesWithPlayer.map(m => {
                        const pStats = m.estadisticas[player.id];
                        const isTitular = m.titulares.includes(player.id);
                        return (
                          <tr key={m.id} className="hover:bg-slate-50/50">
                            <td className="px-5 py-3">
                              <strong className="text-slate-805 block font-bold">vs {m.rival}</strong>
                              <span className="text-[10px] text-slate-400">{m.fecha} ({m.lugar})</span>
                            </td>
                            <td className="px-5 py-3 text-center font-bold text-slate-800 font-mono">
                              {pStats?.tackles || 0}
                            </td>
                            <td className="px-5 py-3 text-center font-bold text-slate-800 font-mono">
                              {pStats?.tries || 0}
                            </td>
                            <td className="px-5 py-3 text-center font-bold text-slate-800 font-mono">
                              {pStats?.conversiones || 0}
                            </td>
                            <td className="px-5 py-3 text-center font-bold text-slate-800 font-mono">
                              {pStats?.penales || 0}
                            </td>
                            <td className="px-5 py-3 text-right">
                              <span className={`inline-block rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                                isTitular ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-slate-100 text-slate-655 border border-slate-200'
                              }`}>
                                {isTitular ? 'Titular XV' : 'Suplente'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* TAB: PRESCRIBED GYM GYMNASTICS REGIMENS OR ROUTINES */}
      {activeTab === 'routines' && (
        <div id="player-routines-tab" className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 font-sans text-sm text-slate-700 flex items-start gap-3 shadow-xs">
            <Info className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block mb-1">Planillas de Acondicionamiento</strong> 
              Revise las rutinas elaboradas por sus profesores según los focos tácticos de entrenamiento. Puede tachar las series ejecutadas conforme las realiza en el gimnasio del club.
            </div>
          </div>

          {assignedRoutines.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white py-12 text-center text-slate-400">
              <Dumbbell className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="font-sans font-bold text-slate-700 text-base">No conserva ninguna gama de ejercicios actualmente.</p>
              <p className="text-sm text-slate-400 mt-1">Los profesores y preparadores físicos publicarán sus rutinas aquí mismo.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {assignedRoutines.map(r => (
                <div key={r.id} className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                  
                  {/* Routine card header */}
                  <div className="border-b border-slate-100 bg-slate-50/70 p-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold uppercase tracking-wide">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span>Publicado: {r.fechaAsignacion}</span>
                      </div>
                      <h4 className="mt-1.5 font-sans font-black text-slate-900 text-lg">{r.titulo}</h4>
                      {r.descripcion && (
                        <p className="mt-1 font-sans text-sm text-slate-600 italic">{r.descripcion}</p>
                      )}
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="block text-xs text-slate-400 font-bold uppercase mb-0.5">Asignado por</span>
                      <strong className="text-slate-900 font-black text-sm block">{r.profesorNombre}</strong>
                    </div>
                  </div>

                  {/* Exercises Checklist interactive body */}
                  <div className="p-5 font-sans">
                    <span className="block font-bold text-slate-500 text-xs uppercase mb-3">Guía de ejercicios del preparador físico</span>
                    
                    <div className="space-y-3">
                      {r.ejercicios.map((ex, idx) => {
                        const exerciseKey = `${r.id}_${idx}`;
                        const isDone = completedExercises[exerciseKey] || false;

                        return (
                          <div 
                            key={idx}
                            onClick={() => handleToggleExerciseCheck(exerciseKey)}
                            className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-lg border transition cursor-pointer ${
                              isDone 
                                ? 'bg-slate-50 border-slate-200 text-slate-400 line-through' 
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50/80'
                            }`}
                          >
                            <div className="flex items-center gap-3.5">
                              <div className={`h-5 w-5 rounded-full border flex items-center justify-center transition shrink-0 ${
                                isDone ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                              }`}>
                                {isDone && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                              </div>
                              <div>
                                <span className={`text-sm font-bold ${isDone ? 'font-normal text-slate-400' : 'text-slate-900'}`}>{ex.ejercicio}</span>
                                {ex.notas && (
                                  <span className={`block text-xs italic mt-0.5 ${isDone ? 'text-slate-400' : 'text-slate-500'}`}>{ex.notas}</span>
                                )}
                              </div>
                            </div>

                            <div className="flex gap-6 mt-3 sm:mt-0 font-sans pl-8 sm:pl-0">
                              <div className="text-center sm:text-left">
                                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Series</span>
                                <span className={`text-sm font-black ${isDone ? 'text-slate-400' : 'text-slate-800'}`}>{ex.series}</span>
                              </div>
                              <div className="text-center sm:text-left">
                                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Repeticiones</span>
                                <span className={`text-sm font-black ${isDone ? 'text-slate-400' : 'text-slate-800'}`}>{ex.repeticiones}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* TAB: FIXTURE & SCHEDULE */}
      {activeTab === 'fixture' && (
        <div id="player-fixture-tab" className="space-y-6 animate-in fade-in duration-150">
          {/* Header instructions summary */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 font-sans text-xs text-slate-700 flex items-start gap-2.5 shadow-xs">
            <Info className="h-4.5 w-4.5 text-[#2ECC71] shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Fixture Oficial UAR:</strong> Calendario de compromisos, partidos de campeonato, y convocatorias para la categoría <strong className="text-white">{player.categoria}</strong>. Revise las sedes, fechas oficiales, resultados, y constate si se encuentra convocado.
            </div>
          </div>

          {/* NEXT MATCH HERO CARD */}
          {nextScheduledMatch ? (
            <div className="rounded-xl border border-emerald-500/30 bg-[#05472A] p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-[#2ECC71]/10 blur-2xl pointer-events-none"></div>
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950 border border-[#2ECC71]/30 px-3 py-1 text-[10px] font-bold text-[#2ECC71] uppercase tracking-wider">
                    <Trophy className="h-3 w-3" /> PRÓXIMO COMPROMISO
                  </span>
                  <div>
                    <h3 className="font-sans font-black text-xl md:text-2xl tracking-tight">vs {nextScheduledMatch.rival}</h3>
                    <p className="font-sans text-xs text-emerald-200/80 flex items-center gap-3 mt-1 text-wrap">
                      <span className="flex items-center gap-1 font-semibold">
                        <Calendar className="h-3.5 w-3.5 text-[#2ECC71]" /> {nextScheduledMatch.fecha}
                      </span>
                      <span className="hidden sm:inline text-emerald-400">•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-[#2ECC71]" /> {nextScheduledMatch.hora} hs
                      </span>
                      <span className="hidden sm:inline text-emerald-400">•</span>
                      <span className="flex items-center gap-1 font-medium capitalize">
                        <MapPin className="h-3.5 w-3.5 text-[#2ECC71]" /> {nextScheduledMatch.lugar}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Summon/Convocatoria Alert status */}
                <div className="w-full md:w-auto">
                  {nextScheduledMatch.titulares.includes(player.id) ? (
                    <div className="rounded-lg bg-[#2ECC71]/15 border border-[#2ECC71]/40 p-3 flex items-center gap-3">
                      <span className="h-2 w-2 rounded-full bg-[#2ECC71] animate-ping shrink-0" />
                      <div>
                        <strong className="block text-xs text-[#2ECC71] uppercase font-bold">¡Estás Convocado!</strong>
                        <span className="text-[10px] text-zinc-150 block mt-0.5 font-medium">Fichas oficiales: Formás parte de la escuadra titular (<strong>Titular XV</strong>).</span>
                      </div>
                    </div>
                  ) : nextScheduledMatch.suplentes.includes(player.id) ? (
                    <div className="rounded-lg bg-indigo-500/15 border border-indigo-400/40 p-3 flex items-center gap-3">
                      <span className="h-2 w-2 rounded-full bg-indigo-400 animate-ping shrink-0" />
                      <div>
                        <strong className="block text-xs text-indigo-300 uppercase font-bold">¡Estás Convocado!</strong>
                        <span className="text-[10px] text-zinc-150 block mt-0.5 font-medium">Fichas oficiales: Formás parte de la escuadra calificada (<strong>Suplente Relevo</strong>).</span>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-lg bg-zinc-900/40 border border-zinc-700 p-3 flex items-center gap-2.5">
                      <Info className="h-4 w-4 text-emerald-400 shrink-0" />
                      <div>
                        <strong className="block text-[10px] text-zinc-350 uppercase font-black">Planilla Pendiente</strong>
                        <span className="text-[10px] text-zinc-300 block">El Prof. asignará la convocatoria de partido en breves.</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}

          {/* CONTROLES DE FILTRADO */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3.5">
            <div>
              <h3 className="font-sans font-bold text-slate-800 text-sm">Fixture de Partidos - {player.categoria}</h3>
              <p className="text-[10px] font-mono text-slate-400 mt-0.5">Calendario de partidos anuales y mensuales de la temporada actual.</p>
            </div>

            <div className="flex rounded-md border border-slate-200 bg-white p-0.5 shadow-xs">
              <button
                type="button"
                onClick={() => setFixtureFilter('all')}
                className={`rounded px-3 py-1 font-sans text-[10px] font-bold uppercase transition ${
                  fixtureFilter === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                Todos
              </button>
              <button
                type="button"
                onClick={() => setFixtureFilter('scheduled')}
                className={`rounded px-3 py-1 font-sans text-[10px] font-bold uppercase transition ${
                  fixtureFilter === 'scheduled'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                Próximos
              </button>
              <button
                type="button"
                onClick={() => setFixtureFilter('played')}
                className={`rounded px-3 py-1 font-sans text-[10px] font-bold uppercase transition ${
                  fixtureFilter === 'played'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                Jugados
              </button>
            </div>
          </div>

          {/* MATCHES TIMELINE OR GROUPED LIST */}
          {groupedMonthsKeys.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white py-12 text-center text-slate-400">
              <Calendar className="h-10 w-10 text-slate-300 mx-auto mb-2" />
              <p className="font-sans font-bold text-slate-700 text-sm">Sin compromisos para mostrar.</p>
              <p className="text-xs text-slate-400 mt-1">No se hallaron compromisos que correspondan a su criterio seleccionado.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {groupedMonthsKeys.map(monthKey => (
                <div key={monthKey} className="space-y-3">
                  {/* Monthly bar indicator */}
                  <h4 className="font-sans font-black text-slate-700 text-xs uppercase tracking-wider flex items-center gap-2">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#2ECC71]"></span>
                    {monthKey}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {groupedMatches[monthKey].map(m => {
                      const dayNumber = m.fecha.split('-')[2] || '??';
                      const isPlayed = m.estado === 'Jugado';
                      const isHome = m.lugar === 'Local';
                      
                      // Check if the player is summoned for this match
                      const isTitularForThis = m.titulares.includes(player.id);
                      const isSuplenteForThis = m.suplentes.includes(player.id);
                      const isSummonedForThis = isTitularForThis || isSuplenteForThis;

                      // Win/loss assessment
                      let resultBadge = null;
                      if (isPlayed && m.resultadoClub !== null && m.resultadoRival !== null) {
                        const win = m.resultadoClub > m.resultadoRival;
                        const draw = m.resultadoClub === m.resultadoRival;
                        if (win) {
                           resultBadge = (
                             <span className="rounded bg-emerald-50 border border-emerald-250 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">
                               Victoria {m.resultadoClub} - {m.resultadoRival}
                             </span>
                           );
                        } else if (draw) {
                           resultBadge = (
                             <span className="rounded bg-slate-100 border border-slate-200 px-1.5 py-0.5 text-[10px] font-bold text-slate-700">
                               Empate {m.resultadoClub} - {m.resultadoRival}
                             </span>
                           );
                        } else {
                           resultBadge = (
                             <span className="rounded bg-rose-50 border border-rose-200 px-1.5 py-0.5 text-[10px] font-bold text-rose-800">
                               Derrota {m.resultadoClub} - {m.resultadoRival}
                             </span>
                           );
                        }
                      }

                      return (
                        <div 
                          key={m.id}
                          className={`rounded-xl border p-4 bg-white shadow-xs flex items-center gap-4 transition hover:shadow-2xs ${
                            isSummonedForThis && !isPlayed
                              ? 'border-l-4 border-l-[#2ECC71] border-slate-200 animate-pulse' 
                              : isSummonedForThis && isPlayed
                                ? 'border-l-4 border-l-[#2ECC71] border-slate-200'
                                : isHome
                                  ? 'border-l-4 border-l-emerald-600 border-slate-150'
                                  : 'border-l-4 border-l-slate-400 border-slate-150'
                          }`}
                        >
                          {/* Left calendar day box */}
                          <div className={`h-11 w-11 rounded-lg flex flex-col items-center justify-center font-mono ${
                            isPlayed 
                              ? 'bg-[#27272a] border border-slate-700' 
                              : isHome 
                                ? 'bg-emerald-50 border border-[#2ECC71]/40' 
                                : 'bg-zinc-800 border border-zinc-700'
                          }`}>
                            <span className="text-base font-extrabold leading-none text-white">{dayNumber}</span>
                            <span className={`text-[9px] font-black uppercase tracking-wider mt-0.5 ${
                              isPlayed 
                                ? 'text-slate-400' 
                                : isHome 
                                  ? 'text-[#2ECC71]' 
                                  : 'text-zinc-400'
                            }`}>UAR</span>
                          </div>

                          {/* Center info */}
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <strong className="font-sans font-extrabold text-slate-900 text-sm truncate">vs {m.rival}</strong>
                              <span className={`inline-block px-1.5 py-0.5 rounded text-[9.5px] font-bold uppercase ${
                                isHome 
                                  ? 'bg-emerald-50 text-emerald-705 border border-emerald-100' 
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}>
                                {isHome ? 'Local' : 'Visitante'}
                              </span>
                            </div>

                            <p className="text-xs text-slate-400 font-sans flex items-center gap-2">
                              <b>{m.hora} hs</b>
                              <span>•</span>
                              <span className="capitalize">{m.lugar}</span>
                            </p>

                            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                              {/* Played vs Programmed */}
                              {isPlayed ? (
                                resultBadge
                              ) : (
                                <span className="rounded bg-sky-50 border border-sky-200 px-1.5 py-0.5 text-[10px] font-bold text-sky-800">
                                  Programado
                                </span>
                              )}

                              {/* Player summon tag */}
                              {isTitularForThis && (
                                <span className="rounded bg-[#05472A] border border-[#2ECC71]/30 px-1.5 py-0.5 text-[10px] font-bold text-[#2ECC71]">
                                  ✓ Convocado (Titular)
                                </span>
                              )}
                              {isSuplenteForThis && (
                                <span className="rounded bg-indigo-950 border border-indigo-500/30 px-1.5 py-0.5 text-[10px] font-bold text-indigo-300">
                                  ✓ Convocado (Suplente)
                                </span>
                              )}
                              {!isPlayed && !isSummonedForThis && (
                                <span className="rounded bg-slate-50 border border-slate-150 px-1.5 py-0.5 text-[10px] font-bold text-slate-450">
                                  Ficha Abierta
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: FICHAJES UAR */}
      {activeTab === 'fichajes' && (
        <div id="player-fichajes-tab" className="space-y-6 animate-in fade-in duration-155">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm text-slate-800">
            <h3 className="font-sans font-extrabold text-[#05472A] text-base flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-600 animate-pulse" />
              Mi Cuenta Deportiva & Matrícula UAR 2026
            </h3>
            <p className="font-sans text-xs text-slate-500 mt-1">
              Consulte el estado financiero del fichaje de la Unión Argentina de Rugby, sus comprobantes y fechas registradas por la secretaría técnica.
            </p>
          </div>

          {(!player.fichajeInstalments || player.fichajeInstalments.length === 0) ? (
            <div className="bg-white rounded-xl border border-slate-150 p-12 text-center text-slate-400 space-y-3">
              <DollarSign className="mx-auto h-12 w-12 text-slate-300 stroke-1" />
              <p className="font-sans font-bold text-sm text-slate-700">No registrás un plan de pago activo</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Tu mánager todavía no ha estructurado tu cronograma de cuotas federativas anuales para la matrícula 2026. Coordina en secretaría para dar de alta tu plan.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Summary card */}
              {(() => {
                const installments = player.fichajeInstalments || [];
                const paidCount = installments.filter(i => i.pagado).length;
                const totalCount = installments.length;
                const unpaid = installments.filter(i => !i.pagado);
                const totalDebt = unpaid.reduce((total, i) => total + i.monto, 0);
                const isAlDia = unpaid.length === 0;

                return (
                  <>
                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4 md:col-span-1 h-fit">
                      <div className="border-b pb-3 text-slate-805">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Resumen Financiero</span>
                        <h4 className="font-sans font-extrabold text-sm mt-0.5">Fichajes Consolidados</h4>
                      </div>

                      <div className="space-y-4 font-sans">
                        <div>
                          <span className="block text-[10px] uppercase font-bold text-slate-400">Estado de Cuenta</span>
                          {isAlDia ? (
                            <span className="inline-block mt-1.5 rounded-full bg-green-50 border border-green-250 text-green-700 px-3 py-1 text-xs font-bold font-sans">
                              ✓ AL DÍA (SALDO CUBIERTO)
                            </span>
                          ) : (
                            <span className="inline-block mt-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 px-3 py-1 text-xs font-bold font-sans">
                              ⚠️ REGISTRA DEUDA (${totalDebt.toLocaleString('es-AR')})
                            </span>
                          )}
                        </div>

                        <div>
                          <span className="block text-[10px] uppercase font-bold text-slate-400">Progreso de Cuotas</span>
                          <span className="block mt-1 font-bold text-slate-800 text-xs">
                            {paidCount} de {totalCount} cuotas saldadas
                          </span>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 border overflow-hidden mt-1.5">
                            <div 
                              className={`h-1.5 rounded-full transition-all ${isAlDia ? 'bg-green-600' : 'bg-emerald-600'}`}
                              style={{ width: `${(paidCount / totalCount) * 100}%` }}
                            ></div>
                          </div>
                        </div>

                        {!isAlDia && (
                          <div className="rounded-lg bg-yellow-50 border border-yellow-250 p-3.5 space-y-2 text-[11px] text-yellow-950 font-sans">
                            <span className="font-bold flex items-center gap-1">
                              <Info className="h-3.5 w-3.5 text-yellow-700" />
                              ¿Cómo regularizar mis cuotas?
                            </span>
                            <p className="leading-relaxed text-yellow-900 font-medium">
                              Puedes realizar una transferencia directa con el CBU del club o entregar el pago en efectivo o cheques directamente a tu mánager para que registre tu recibo digital.
                            </p>
                            <a
                              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Hola, quería coordinar el pago de mi cuota adeudada del Fichaje UAR 2026. Mi nombre es ${player.nombre} ${player.apellido}.`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-2 text-center rounded block bg-emerald-700 text-white font-bold p-1.5 hover:bg-emerald-800 transition text-[10px]"
                            >
                              Informar Pago por WhatsApp
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Detailed instalments list */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs md:col-span-2 space-y-4">
                      <div className="border-b pb-3 text-slate-805 flex justify-between items-center">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400">Detalle de Cuotas</span>
                          <h4 className="font-sans font-black text-sm mt-0.5">Plan de Pagos 2026</h4>
                        </div>
                        <span className="font-mono text-[10px] text-slate-450">Referencia: #{player.id}</span>
                      </div>

                      <div className="space-y-3">
                        {installments.map(ins => {
                          return (
                            <div
                              key={ins.id}
                              className={`rounded-lg border p-3.5 flex items-center justify-between transition ${
                                ins.pagado 
                                  ? 'bg-emerald-50/10 border-emerald-250' 
                                  : 'bg-slate-50/30 border-slate-250'
                              }`}
                            >
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <span className="font-extrabold text-sm text-slate-850">Cuota #{ins.numeroCuota}</span>
                                  {ins.pagado ? (
                                    <span className="rounded bg-green-105 border border-green-250 text-green-700 text-[8px] font-black uppercase px-1.5 py-0.2">
                                      ✓ Cobrado
                                    </span>
                                  ) : (
                                    <span className="rounded bg-rose-50 border border-rose-200 text-rose-700 text-[8px] font-bold uppercase px-1.5 py-0.2">
                                      Deuda Pendiente
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs font-mono font-bold text-[#05472A]">Monto: ${ins.monto.toLocaleString('es-AR')}</p>
                              </div>

                              <div className="text-right text-xs font-sans text-slate-500">
                                {ins.pagado ? (
                                  <div className="space-y-0.5">
                                    <span className="block text-[8px] text-slate-405 font-bold uppercase">Medio de Pago</span>
                                    <strong className="text-slate-805 text-[11px]">{ins.medioPago || 'Transferencia'}</strong>
                                    {ins.fechaPago && <span className="block text-[9px] text-slate-400">Registrado el {ins.fechaPago}</span>}
                                  </div>
                                ) : (
                                  <span className="text-slate-400 italic text-[11px]">Esperando pago...</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* TAB: CAMPAÑAS ESPECIALES */}
      {activeTab === 'campanas' && (
        <div id="player-campanas-tab" className="space-y-6 animate-in fade-in duration-155">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm text-slate-800">
            <h3 className="font-sans font-extrabold text-[#05472A] text-base flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-emerald-600 animate-bounce" />
              Mis Campañas y Autoservicio de Ventas
            </h3>
            <p className="font-sans text-xs text-slate-500 mt-1">
              Registre las de milanesas, rifas o locros que haya vendido. Su información se sincroniza instantáneamente con la planilla del mánager.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.length === 0 ? (
              <div className="col-span-full bg-white rounded-xl border p-12 text-center text-slate-400 space-y-2">
                <Megaphone className="mx-auto h-12 w-12 text-slate-300 stroke-1" />
                <p className="font-bold text-sm">No hay campañas de recaudación asignadas todavía</p>
                <p className="text-xs">Cuando tu coordinador lance un nuevo evento cooperativo de ventas, aparecerá en esta pestaña.</p>
              </div>
            ) : (
              campaigns.map(c => {
                const count = c.ventasRegistradas?.[player.id] || 0;
                const target = c.cantidadPorJugador;
                const remaining = Math.max(0, target - count);
                const isCompleted = count >= target;
                const personalPercent = Math.min(100, Math.round((count / target) * 100));

                // overall performance of the club
                let overallSold = 0;
                if (c.ventasRegistradas) {
                  Object.values(c.ventasRegistradas).forEach(v => {
                    overallSold += v;
                  });
                }

                const presetBg = c.fotoFlyer === 'sky'
                  ? 'bg-gradient-to-r from-sky-700 to-indigo-900'
                  : c.fotoFlyer === 'rose'
                    ? 'bg-gradient-to-r from-rose-700 to-purple-900'
                    : c.fotoFlyer === 'amber'
                      ? 'bg-gradient-to-r from-amber-600 to-orange-850'
                      : 'bg-gradient-to-r from-[#05472A] to-emerald-900';

                return (
                  <div key={c.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between text-slate-805">
                    <div>
                      {/* Flyer banner */}
                      <div className={`${presetBg} px-5 py-5 text-white text-sans relative h-36 flex flex-col justify-end`}>
                        <span className="text-[8px] uppercase font-bold bg-white/20 px-2 py-0.5 rounded tracking-widest w-fit mb-1">Campaña Activa</span>
                        <h4 className="font-sans font-black text-sm text-white tracking-tight leading-snug">{c.titulo}</h4>
                        <p className="text-[10px] text-white/80 font-sans mt-0.5">Meta Asignada: <strong>{target} unidades</strong></p>
                      </div>

                      <div className="p-5 font-sans space-y-4">
                        <p className="text-xs text-slate-600 leading-relaxed min-h-[44px] line-clamp-3">
                          {c.descripcion}
                        </p>

                        {/* Interactive sales counters for self reporting */}
                        <div className="rounded-xl bg-slate-50 border p-3 space-y-2.5">
                          <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Planilla de Autoservicio</span>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-700 font-bold">Mis Ventas:</span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  if (!onUpdateCampaigns) return;
                                  const updatedVentas = { ...(c.ventasRegistradas || {}) };
                                  updatedVentas[player.id] = Math.max(0, count - 1);
                                  const updatedCampaigns = campaigns.map(camp => 
                                    camp.id === c.id ? { ...camp, ventasRegistradas: updatedVentas } : camp
                                  );
                                  onUpdateCampaigns(updatedCampaigns);
                                }}
                                className="w-7 h-7 rounded-lg bg-white border flex items-center justify-center font-bold font-mono text-slate-700 hover:bg-slate-200 cursor-pointer text-xs transition"
                              >
                                -
                              </button>
                              <span className="font-black text-sm w-8 text-center text-slate-900">{count}</span>
                              <button
                                onClick={() => {
                                  if (!onUpdateCampaigns) return;
                                  const updatedVentas = { ...(c.ventasRegistradas || {}) };
                                  updatedVentas[player.id] = count + 1;
                                  const updatedCampaigns = campaigns.map(camp => 
                                    camp.id === c.id ? { ...camp, ventasRegistradas: updatedVentas } : camp
                                  );
                                  onUpdateCampaigns(updatedCampaigns);
                                }}
                                className="w-7 h-7 rounded-lg bg-white border flex items-center justify-center font-bold font-mono text-slate-700 hover:bg-slate-200 cursor-pointer text-xs transition"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Visual meter */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[9px] uppercase font-bold text-slate-400">
                            <span>Mi Meta Personal</span>
                            <span>{count} / {target} u. ({personalPercent}%)</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden border">
                            <div 
                              className={`h-1.5 rounded-full transition-all duration-300 ${isCompleted ? 'bg-green-600' : 'bg-emerald-600'}`} 
                              style={{ width: `${personalPercent}%` }}
                            ></div>
                          </div>
                          {isCompleted ? (
                            <span className="text-[9px] text-green-700 font-bold block">✓ ¡Felicitaciones! Has completado tu meta asignada.</span>
                          ) : (
                            <span className="text-[9px] text-amber-800 font-medium block">Te restan {remaining} unidades para cubrir tu cuota de campaña.</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0 border-t mt-4 bg-slate-50/50">
                      <div className="flex justify-between items-center text-[10px] font-sans text-slate-500 pt-3">
                        <span className="uppercase text-[8px] font-bold text-slate-400">Progreso del Plantel</span>
                        <strong className="text-slate-700">{overallSold} u. vendidas</strong>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Render medical file if prompt toggle active */}
      {viewingMedicalCard && (
        <MedicalFileViewer player={player} onClose={() => setViewingMedicalCard(false)} />
      )}

    </div>
  );
}
