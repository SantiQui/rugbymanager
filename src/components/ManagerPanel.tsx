import React, { useState, useRef } from 'react';
import { Manager, Player, Professor, Match, FundraiserCampaign, FichajeInstallment } from '../types';
import { CLUB_CATEGORIES, RUGBY_POSITIONS } from "../constants";
import { Users, UserPlus, Trophy, Calendar, CheckCircle2, ShieldAlert, BadgeInfo, Mail, Phone, CalendarRange, Trash2, Edit, Megaphone, DollarSign, Plus, Check, Info, FileUp } from 'lucide-react';
import MedicalFileViewer from './MedicalFileViewer';
import { saveTercerTiempoAPI } from '../services/api';

interface ManagerPanelProps {
  manager: Manager;
  players: Player[];
  professors: Professor[];
  matches: Match[];
  campaigns: FundraiserCampaign[];
  onUpdateCampaigns: (campaigns: FundraiserCampaign[]) => void;
  onAddPlayer: (player: Player) => void;
  onUpdatePlayer: (player: Player) => void;
  onDeletePlayer: (id: string) => void;
  onAddProfessor: (prof: Professor) => void;
  onUpdateProfessor?: (prof: Professor) => void;
  onDeleteProfessor?: (id: string) => void;
  onAddMatch: (match: Match) => void;
  onDeleteMatch: (id: string) => void;
  onUpdateMatch?: (match: Match) => void;
  
}

export default function ManagerPanel({
  manager, players, professors, matches, campaigns, onUpdateCampaigns,
  onAddPlayer, onUpdatePlayer, onDeletePlayer, 
  onAddProfessor, onUpdateProfessor, onDeleteProfessor,
  onAddMatch, onDeleteMatch, onUpdateMatch,
}: ManagerPanelProps) {
  const [activeTab, setActiveTab] = useState<'players' | 'professors' | 'matches' | 'fichajes' | 'campanas'>('players');

  // Modals
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);
  const [isAddingProf, setIsAddingProf] = useState(false);
  const [isAddingMatch, setIsAddingMatch] = useState(false);
  const [uploadMedicalPlayer, setUploadMedicalPlayer] = useState<Player | null>(null);
  const [viewingPlayerMedical, setViewingPlayerMedical] = useState<Player | null>(null);

  // States Jugador
  const [playNombre, setPlayNombre] = useState(''); const [playApellido, setPlayApellido] = useState('');
  const [playDni, setPlayDni] = useState(''); const [playNacimiento, setPlayNacimiento] = useState('');
  const [playTelefono, setPlayTelefono] = useState(''); const [playCorreo, setPlayCorreo] = useState('');
  const [playCategoria, setPlayCategoria] = useState(manager.categorias[0] || CLUB_CATEGORIES[0]);
  
  // TRES POSICIONES
  const [playPos1, setPlayPos1] = useState(RUGBY_POSITIONS[0]);
  const [playPos2, setPlayPos2] = useState('');
  const [playPos3, setPlayPos3] = useState('');
  
  const [playerEditId, setPlayerEditId] = useState<string | null>(null);

  // States Profesor
  const [profNombre, setProfNombre] = useState(''); const [profApellido, setProfApellido] = useState('');
  const [profDni, setProfDni] = useState(''); const [profNacimiento, setProfNacimiento] = useState('');
  const [profTelefono, setProfTelefono] = useState(''); const [profCorreo, setProfCorreo] = useState('');
  const [profSelectedCats, setProfSelectedCats] = useState<string[]>([]);
  const [profEditId, setProfEditId] = useState<string | null>(null);

  // States Partidos y Campañas
  const [matchFecha, setMatchFecha] = useState(''); const [matchHora, setMatchHora] = useState('');
  const [matchRival, setMatchRival] = useState(''); const [matchCategoria, setMatchCategoria] = useState(manager.categorias[0] || CLUB_CATEGORIES[0]);
  const [matchLugar, setMatchLugar] = useState<'Local' | 'Visitante'>('Local');
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [editMatchFecha, setEditMatchFecha] = useState(''); const [editMatchHora, setEditMatchHora] = useState('');

  const [uploadedFileName, setUploadedFileName] = useState('');

  const [selectedFichajePlayerId, setSelectedFichajePlayerId] = useState<string | null>(null);
  const [newFichajeMonto, setNewFichajeMonto] = useState<number>(45000);
  const [newFichajeCuotas, setNewFichajeCuotas] = useState<number>(3);

  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [isCreatingCampaign, setIsCreatingCampaign] = useState<boolean>(false);
  const [newCampTitle, setNewCampTitle] = useState<string>(''); const [newCampDesc, setNewCampDesc] = useState<string>('');
  const [newCampDesde, setNewCampDesde] = useState<string>(''); const [newCampHasta, setNewCampHasta] = useState<string>('');
  const [newCampQty, setNewCampQty] = useState<number>(10);
  const [newCampPresetColor, setNewCampPresetColor] = useState<string>('emerald');

  const [showTercerTiempoModal, setShowTercerTiempoModal] = useState<boolean>(false);
  const [tercerTiempoForm, setTercerTiempoForm] = useState({ partido_id: '', costo_comida: 0, costo_bebida: 0, otros_gastos: 0, alias_transferencia: '' });

  const [playerCatFilter, setPlayerCatFilter] = useState<string>('all');
  const [profCatFilter, setProfCatFilter] = useState<string>('all');
  const [matchCatFilter, setMatchCatFilter] = useState<string>('all');

  const managerCategories = manager.categorias;
  const filteredPlayers = players.filter(p => managerCategories.includes(p.categoria) && (playerCatFilter === 'all' || p.categoria === playerCatFilter));
  const filteredProfessors = professors.filter(p => p.categorias.some(cat => managerCategories.includes(cat)) && (profCatFilter === 'all' || p.categorias.includes(profCatFilter)));
  const filteredMatches = matches.filter(m => managerCategories.includes(m.categoria) && (matchCatFilter === 'all' || m.categoria === matchCatFilter));

  const handleSaveTercerTiempo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveTercerTiempoAPI(tercerTiempoForm);
      setShowTercerTiempoModal(false);
      const matchToUpdate = matches.find(m => m.id === tercerTiempoForm.partido_id);
      if (matchToUpdate && onUpdateMatch) {
        const cantJugadores = (matchToUpdate.titulares?.length || 0) + (matchToUpdate.suplentes?.length || 0);
        const costoTotal = tercerTiempoForm.costo_comida + tercerTiempoForm.costo_bebida + tercerTiempoForm.otros_gastos;
        onUpdateMatch({
          ...matchToUpdate,
          tercerTiempo: { ...tercerTiempoForm, costo_total: costoTotal, costo_por_jugador: cantJugadores > 0 ? costoTotal / cantJugadores : 0 }
        });
      }
    } catch (error) { console.error(error); }
  };

  const handleOpenAddPlayer = () => {
    setPlayNombre(''); setPlayApellido(''); setPlayDni(''); setPlayNacimiento(''); setPlayTelefono(''); setPlayCorreo(''); 
    setPlayPos1(RUGBY_POSITIONS[0]); setPlayPos2(''); setPlayPos3('');
    setPlayCategoria(playerCatFilter !== 'all' ? playerCatFilter : (manager.categorias[0] || CLUB_CATEGORIES[0])); 
    setPlayerEditId(null); setIsAddingPlayer(true);
  };

  const handleOpenEditPlayer = (p: Player) => {
    setPlayNombre(p.nombre); setPlayApellido(p.apellido); setPlayDni(p.documento); setPlayNacimiento(p.fecha_nacimiento);
    setPlayTelefono(p.telefono); setPlayCorreo(p.correo); setPlayCategoria(p.categoria); 
    
    // Separamos el string guardado en un array para llenar los 3 selects
    const posicionesArray = p.posicion ? p.posicion.split(', ') : [];
    setPlayPos1(posicionesArray[0] || RUGBY_POSITIONS[0]);
    setPlayPos2(posicionesArray[1] || '');
    setPlayPos3(posicionesArray[2] || '');
    
    setPlayerEditId(p.id); setIsAddingPlayer(true);
  };

  const handleSubmitPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    const posicionesFinales = [playPos1, playPos2, playPos3].filter(pos => pos !== '').join(', ');

    if (playerEditId) {
      const original = players.find(p => p.id === playerEditId);
      onUpdatePlayer({ id: playerEditId, nombre: playNombre, apellido: playApellido, documento: playDni, fecha_nacimiento: playNacimiento, telefono: playTelefono, correo: playCorreo, categoria: playCategoria, posicion: posicionesFinales, fichaMedicaUrl: original?.fichaMedicaUrl || null, fichaMedicaNombre: original?.fichaMedicaNombre || null, fichaMedicaFecha: original?.fichaMedicaFecha || null, justificaciones: original?.justificaciones || [], fichajeInstalments: original?.fichajeInstalments || [] });
    } else {
      onAddPlayer({ id: 'j_' + Date.now(), nombre: playNombre, documento: playDni, apellido: playApellido, fecha_nacimiento: playNacimiento, telefono: playTelefono, correo: playCorreo, categoria: playCategoria, posicion: posicionesFinales, fichaMedicaUrl: null, fichaMedicaNombre: null, fichaMedicaFecha: null, justificaciones: [], fichajeInstalments: [] });
    }
    setIsAddingPlayer(false);
  };

  const handleOpenAddProf = () => {
    setProfNombre(''); setProfApellido(''); setProfDni(''); setProfNacimiento(''); setProfTelefono(''); setProfCorreo('');
    setProfSelectedCats(profCatFilter !== 'all' ? [profCatFilter] : [managerCategories[0] || CLUB_CATEGORIES[0]]); 
    setProfEditId(null); setIsAddingProf(true);
  };

  const handleOpenEditProf = (p: Professor) => {
    setProfNombre(p.nombre); setProfApellido(p.apellido); setProfDni(p.documento); setProfNacimiento(p.fecha_nacimiento);
    setProfTelefono(p.telefono); setProfCorreo(p.correo); setProfSelectedCats(p.categorias);
    setProfEditId(p.id); setIsAddingProf(true);
  };

  const handleProfCatToggle = (cat: string) => { setProfSelectedCats(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]); };

  const handleSubmitProf = (e: React.FormEvent) => {
    e.preventDefault();
    if (profEditId) {
      if (onUpdateProfessor) onUpdateProfessor({ id: profEditId, nombre: profNombre, apellido: profApellido, documento: profDni, fecha_nacimiento: profNacimiento, telefono: profTelefono, correo: profCorreo, categorias: profSelectedCats });
    } else {
      onAddProfessor({ id: 'p_' + Date.now(), nombre: profNombre, apellido: profApellido, documento: profDni, fecha_nacimiento: profNacimiento, telefono: profTelefono, correo: profCorreo, categorias: profSelectedCats });
    }
    setIsAddingProf(false);
  };

  const handleSubmitMatch = (e: React.FormEvent) => {
    e.preventDefault();
    onAddMatch({ id: 'match_' + Date.now(), fecha: matchFecha, hora: matchHora, rival: matchRival, categoria: matchCategoria, lugar: matchLugar, estado: 'Programado', resultadoClub: null, resultadoRival: null, titulares: [], suplentes: [], estadisticas: {}, });
    setIsAddingMatch(false);
  };

  const handleOpenAddMatch = () => {
    setMatchRival(''); setMatchFecha(''); setMatchHora(''); setMatchLugar('Local');
    setMatchCategoria(matchCatFilter !== 'all' ? matchCatFilter : (manager.categorias[0] || CLUB_CATEGORIES[0])); setIsAddingMatch(true);
  };

  const handleOpenEditMatch = (m: Match) => { setEditingMatch(m); setEditMatchFecha(m.fecha); setEditMatchHora(m.hora); };
  const handleUpdateMatchSubmit = (e: React.FormEvent) => { e.preventDefault(); if (editingMatch && onUpdateMatch) { onUpdateMatch({ ...editingMatch, fecha: editMatchFecha, hora: editMatchHora }); setEditingMatch(null); } };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files && e.target.files[0]) setUploadedFileName(e.target.files[0].name); };

  const handleSaveMedicalFile = () => {
    if (!uploadMedicalPlayer) return;
    onUpdatePlayer({ ...uploadMedicalPlayer, fichaMedicaUrl: `simulated_pdf_${uploadMedicalPlayer.id}`, fichaMedicaNombre: uploadedFileName || `Ficha.pdf`, fichaMedicaFecha: new Date().toISOString().split('T')[0] });
    setUploadMedicalPlayer(null); setUploadedFileName('');
  };

  const handleGenerateFichajePlan = (playerId: string) => {
    const playerObj = players.find(p => p.id === playerId);
    if (!playerObj) return;
    const montoCuota = Math.round(newFichajeMonto / newFichajeCuotas);
    const generated: FichajeInstallment[] = [];
    for (let i = 1; i <= newFichajeCuotas; i++) generated.push({ id: `f-${playerId}-${i}-${Date.now()}`, numeroCuota: i, monto: montoCuota, pagado: false });
    onUpdatePlayer({ ...playerObj, fichajeInstalments: generated });
  };

  const handleToggleInstallmentPaid = (playerId: string, installmentId: string) => {
    const playerObj = players.find(p => p.id === playerId);
    if (!playerObj || !playerObj.fichajeInstalments) return;
    const updated = playerObj.fichajeInstalments.map(ins => ins.id === installmentId ? { ...ins, pagado: !ins.pagado, fechaPago: !ins.pagado ? new Date().toISOString().split('T')[0] : undefined, medioPago: !ins.pagado ? 'Transferencia' : undefined } : ins);
    onUpdatePlayer({ ...playerObj, fichajeInstalments: updated });
  };

  const handleCreateCampaignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCampaign: FundraiserCampaign = {
      id: `c-${Date.now()}`, titulo: newCampTitle.trim(), descripcion: newCampDesc.trim(),
      fechaDesde: newCampDesde, fechaHasta: newCampHasta, fotoFlyer: newCampPresetColor, cantidadPorJugador: newCampQty || 10, ventasRegistradas: {}
    };
    onUpdateCampaigns([newCampaign, ...campaigns]);
    setNewCampTitle(''); setNewCampDesc(''); setIsCreatingCampaign(false);
  };

  const handleDeleteCampaign = (campaignId: string) => {
    if (window.confirm('¿Eliminar campaña?')) onUpdateCampaigns(campaigns.filter(c => c.id !== campaignId));
  };

  return (
    <div id="manager-panel-root" className="space-y-6">
      <div className="rounded-xl bg-[#05472A] border border-[#2ECC71]/30 p-6 text-white shadow-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-emerald-950 border border-[#2ECC71]/20 px-2.5 py-0.5 text-[9px] font-mono font-bold tracking-widest uppercase text-[#2ECC71]">Staff del Club</span>
              <span className="font-mono text-center text-[9px] text-emerald-200/80">ID: {manager.id.toUpperCase()}</span>
            </div>
            <h2 className="mt-1 font-sans font-extrabold text-2xl text-white tracking-tight">Hola, {manager.nombre} {manager.apellido}</h2>
            <p className="mt-1 font-sans text-xs text-emerald-100">Categorías designadas: <strong className="text-white font-bold">{managerCategories.join(', ')}</strong></p>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-300">
        <div className="flex overflow-x-auto whitespace-nowrap space-x-6 pb-2">
          {['players', 'professors', 'matches', 'fichajes', 'campanas'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} className={`pb-4 font-sans text-xs font-bold uppercase tracking-wider transition-all border-b-2 relative -mb-[2px] ${activeTab === tab ? 'border-gray-900 text-gray-900 font-extrabold' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              <span className="flex items-center gap-1.5">
                {tab === 'players' && <><Users className="h-4 w-4" /> Jugadores</>}
                {tab === 'professors' && <><UserPlus className="h-4 w-4" /> Profesores</>}
                {tab === 'matches' && <><Calendar className="h-4 w-4" /> Partidos</>}
                {tab === 'fichajes' && <><DollarSign className="h-4 w-4" /> Fichaje UAR</>}
                {tab === 'campanas' && <><Megaphone className="h-4 w-4" /> Campañas</>}
              </span>
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'players' && (
        <div className="space-y-4">
          <button type="button" onClick={handleOpenAddPlayer} className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 hover:bg-black px-3.5 py-2 font-sans text-xs font-bold text-white transition-colors cursor-pointer shadow-xs"><UserPlus className="h-3.5 w-3.5" /> Registrar Jugador</button>
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-gray-200 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Filtrar por Categoría:</span>
              <div className="flex flex-wrap gap-1">
                <button type="button" onClick={() => setPlayerCatFilter('all')} className={`rounded-lg px-2.5 py-1 text-xs font-bold uppercase ${playerCatFilter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 border text-gray-600 hover:bg-gray-200'}`}>Todas</button>
                {managerCategories.map(cat => (
                  <button type="button" key={cat} onClick={() => setPlayerCatFilter(cat)} className={`rounded-lg px-2.5 py-1 text-xs font-bold uppercase ${playerCatFilter === cat ? 'bg-gray-900 text-white' : 'bg-gray-100 border text-gray-600 hover:bg-gray-200'}`}>{cat}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-xs">
            <div className="overflow-x-auto text-left">
              <table className="w-full text-xs font-sans">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-bold">
                  <tr><th className="px-6 py-3">Jugador</th><th className="px-6 py-3">Categoría</th><th className="px-6 py-3">Posiciones</th><th className="px-6 py-3">Documento</th><th className="px-6 py-3">Ficha Médica</th><th className="px-6 py-3 text-right">Acciones</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPlayers.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4"><strong className="text-gray-900 font-bold block">{p.apellido}, {p.nombre}</strong></td>
                      <td className="px-6 py-4 font-bold text-gray-900">{p.categoria}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                           {p.posicion?.split(', ').map((pos, i) => (
                              <span key={i} className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${i === 0 ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>{pos}</span>
                           ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{p.documento}</td>
                      <td className="px-6 py-4">{p.fichaMedicaUrl ? <span className="text-gray-900 font-bold">APTO</span> : <button type="button" onClick={() => { setUploadMedicalPlayer(p); setUploadedFileName(''); }} className="text-blue-600 font-bold underline">Cargar PDF</button>}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button type="button" onClick={() => handleOpenEditPlayer(p)} className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-md transition-colors cursor-pointer" title="Modificar"><Edit className="h-4 w-4" /></button>
                          
                          {/* NUEVO: Confirmación al borrar Jugador */}
                          <button type="button" onClick={() => { if(window.confirm(`¿Estás seguro de eliminar a ${p.nombre} ${p.apellido}?`)) onDeletePlayer(p.id); }} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer" title="Borrar"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'professors' && (
        <div className="space-y-4">
          <button type="button" onClick={handleOpenAddProf} className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-4 py-2 font-sans text-xs font-bold text-white hover:bg-black transition-colors cursor-pointer"><UserPlus className="h-3.5 w-3.5" /> Alta Profesor / DT</button>
          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-xs">
            <div className="overflow-x-auto text-left">
              <table className="w-full text-xs font-sans">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-bold">
                  <tr><th className="px-6 py-3">Profesor / DT</th><th className="px-6 py-3">Categorías</th><th className="px-6 py-3">Documento</th><th className="px-6 py-3">Contacto</th><th className="px-6 py-3 text-right">Acciones</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProfessors.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4"><strong className="text-gray-900 font-bold block">{p.apellido}, {p.nombre}</strong></td>
                      <td className="px-6 py-4"><div className="flex flex-wrap gap-1">{p.categorias.map(cat => (<span key={cat} className="bg-gray-100 border border-gray-300 px-1.5 py-0.5 rounded text-[9px] font-bold text-gray-900">{cat}</span>))}</div></td>
                      <td className="px-6 py-4 text-gray-700">{p.documento}</td>
                      <td className="px-6 py-4 text-gray-700"><div className="flex flex-col gap-0.5">{p.correo && <span className="flex items-center gap-1"><Mail className="h-3 w-3 text-gray-400"/> {p.correo}</span>}{p.telefono && <span className="flex items-center gap-1 mt-1 text-[10px] text-gray-500"><Phone className="h-3 w-3 text-gray-400"/> {p.telefono}</span>}</div></td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button type="button" onClick={() => handleOpenEditProf(p)} className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-md transition-colors cursor-pointer" title="Modificar"><Edit className="h-4 w-4" /></button>
                          
                          {/* Confirmación al borrar Profesor */}
<button type="button" onClick={() => { if(window.confirm(`¿Borrar al Prof. ${p.nombre} ${p.apellido}?`)) { onDeleteProfessor && onDeleteProfessor(p.id) } }} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer" title="Borrar"><Trash2 className="h-4 w-4" /></button>                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'matches' && (
        <div className="space-y-6">
          <button type="button" onClick={handleOpenAddMatch} className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 hover:bg-black px-4 py-2 text-xs font-bold text-white transition-colors cursor-pointer"><Trophy className="h-3.5 w-3.5" /> Cargar Nuevo Partido</button>
          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-xs">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold">
                <tr><th className="px-6 py-3">Oponente</th><th className="px-6 py-3">Categoría</th><th className="px-6 py-3">Fecha y Hora</th><th className="px-6 py-3">Condición</th><th className="px-6 py-3">Estado</th><th className="px-6 py-3 text-right">Acciones</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredMatches.map(m => (
                  <tr key={m.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4"><strong className="text-gray-900 block">{m.rival}</strong></td><td className="px-6 py-4 font-bold text-gray-900">{m.categoria}</td><td className="px-6 py-4 text-gray-700">{m.fecha} a las {m.hora}</td><td className="px-6 py-4"><span className="bg-gray-100 border border-gray-200 px-2 py-1 rounded text-gray-800 font-bold">{m.lugar}</span></td><td className="px-6 py-4 text-gray-700">{m.estado}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button type="button" onClick={() => handleOpenEditMatch(m)} className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-md transition-colors cursor-pointer" title="Modificar"><Edit className="h-4 w-4" /></button>
                        
                        {/* NUEVO: Confirmación al borrar Partido */}
                        <button type="button" onClick={() => { if(window.confirm(`¿Eliminar partido programado contra ${m.rival}?`)) onDeleteMatch(m.id); }} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer" title="Borrar"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'fichajes' && (
        <div id="manager-fichajes-tab" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-4 bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <h4 className="font-sans font-bold text-xs uppercase text-gray-500 border-b pb-2">Nómina ({filteredPlayers.length})</h4>
              <div className="space-y-2 mt-2 max-h-[480px] overflow-y-auto pr-1">
                {filteredPlayers.map(p => (
                  <button type="button" key={p.id} onClick={() => setSelectedFichajePlayerId(p.id)} className={`w-full text-left rounded-lg p-3 border ${selectedFichajePlayerId === p.id ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <div className="flex justify-between font-sans text-xs"><span className="font-bold text-gray-900">{p.nombre} {p.apellido}</span></div>
                    <div className="text-[10px] text-gray-500 mt-1 font-mono">DNI: {p.documento}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="lg:col-span-8 bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              {!selectedFichajePlayerId ? (
                <div className="text-center py-16 text-gray-400">Seleccione un jugador de la nómina para gestionar su plan.</div>
              ) : (
                (() => {
                  const selPlayer = players.find(p => p.id === selectedFichajePlayerId);
                  if (!selPlayer) return null;
                  const hasPlan = selPlayer.fichajeInstalments && selPlayer.fichajeInstalments.length > 0;
                  return (
                    <div className="space-y-6">
                      <div className="border-b pb-4"><h4 className="font-sans font-extrabold text-lg text-gray-900">{selPlayer.nombre} {selPlayer.apellido}</h4></div>
                      {!hasPlan ? (
                        <div className="rounded-xl bg-gray-50 border border-gray-200 p-5 space-y-4">
                          <p className="text-xs text-gray-600 mb-3">Defina el monto anual y la cantidad de cuotas para generar la libreta de pagos.</p>
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div><label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Monto Total ($)</label><input type="number" value={newFichajeMonto} onChange={e => setNewFichajeMonto(Number(e.target.value))} className="w-full border border-gray-300 rounded p-2 text-sm bg-white text-gray-900" /></div>
                            <div><label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Cant. Cuotas</label><select value={newFichajeCuotas} onChange={e => setNewFichajeCuotas(Number(e.target.value))} className="w-full border border-gray-300 rounded p-2 text-sm bg-white text-gray-900"><option value={1}>Pago Único (1)</option><option value={2}>2 Cuotas</option><option value={3}>3 Cuotas</option><option value={4}>4 Cuotas</option><option value={6}>6 Cuotas</option></select></div>
                          </div>
                          <button type="button" onClick={() => handleGenerateFichajePlan(selPlayer.id)} className="w-full sm:w-auto rounded-lg bg-gray-900 hover:bg-black font-bold text-white px-5 py-2.5 transition-colors cursor-pointer">Generar Cronograma de Cuotas</button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {selPlayer.fichajeInstalments?.map(ins => (
                            <div key={ins.id} className="flex items-center justify-between border-b border-gray-100 py-3">
                              <div className="font-bold text-gray-700 text-sm">Cuota #{ins.numeroCuota} - <span className="font-mono">${ins.monto}</span></div>
                              <button type="button" onClick={() => handleToggleInstallmentPaid(selPlayer.id, ins.id)} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${ins.pagado ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-gray-900 text-white hover:bg-black'}`}>{ins.pagado ? 'Cobrado ✓' : 'Marcar como Pagado'}</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'campanas' && (
        <div id="manager-campanas-tab" className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm text-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div><h3 className="font-sans font-extrabold text-base text-gray-900 flex items-center gap-2"><Megaphone className="h-5 w-5 text-gray-900" />Campañas de Recaudación y Financiamiento</h3><p className="font-sans text-xs text-gray-500 mt-1">Estructure campañas del club asignando metas específicas por deportista y audite la recaudación.</p></div>
            <button type="button" onClick={() => setIsCreatingCampaign(true)} className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 hover:bg-black px-4 py-2 font-sans text-xs font-bold text-white transition-colors cursor-pointer shadow-xs whitespace-nowrap"><Plus className="h-4 w-4" />Nueva Campaña</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.length === 0 ? (
              <div className="col-span-full bg-white rounded-xl border p-12 text-center text-gray-400 space-y-2"><Megaphone className="mx-auto h-12 w-12 text-gray-300 stroke-1" /><p className="font-bold text-sm">No hay campañas especiales activas en el sistema</p></div>
            ) : (
              campaigns.map(c => {
                const totalTarget = filteredPlayers.length * (c.cantidadPorJugador || 10);
                let totalSold = 0; filteredPlayers.forEach(p => { totalSold += (c.ventasRegistradas?.[p.id] || 0); });
                const percentage = totalTarget > 0 ? Math.min(100, Math.round((totalSold / totalTarget) * 100)) : 0;
                return (
                  <div key={c.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs flex flex-col justify-between text-gray-800">
                    <div className="p-5">
                      <div className="flex justify-between items-start"><h4 className="font-black text-gray-900">{c.titulo}</h4><button type="button" onClick={() => handleDeleteCampaign(c.id)} className="text-gray-400 hover:text-red-600"><Trash2 className="h-4 w-4"/></button></div>
                      <p className="text-xs text-gray-500 mt-1">{c.descripcion}</p>
                    </div>
                    <div className="p-5 pt-0"><button type="button" onClick={() => setSelectedCampaignId(c.id)} className="w-full bg-gray-100 py-2 rounded-lg text-xs font-bold">Ver Planilla</button></div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ================= ÚNICA ZONA DE MODALES ================= */}
      {isAddingPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
            <h4 className="font-bold mb-4 text-gray-900">{playerEditId ? 'Modificar Jugador' : 'Registrar Jugador'}</h4>
            <form onSubmit={handleSubmitPlayer} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <input type="text" required placeholder="Nombre" value={playNombre} onChange={e => setPlayNombre(e.target.value)} className="w-full border border-gray-300 p-2 rounded text-sm text-gray-900" />
                <input type="text" required placeholder="Apellido" value={playApellido} onChange={e => setPlayApellido(e.target.value)} className="w-full border border-gray-300 p-2 rounded text-sm text-gray-900" />
              </div>
              <input type="text" required placeholder="DNI" value={playDni} onChange={e => setPlayDni(e.target.value)} className="w-full border border-gray-300 p-2 rounded text-sm text-gray-900" />
              <input type="date" required value={playNacimiento} onChange={e => setPlayNacimiento(e.target.value)} className="w-full border border-gray-300 p-2 rounded text-sm text-gray-900" />
              <input type="email" required placeholder="Correo" value={playCorreo} onChange={e => setPlayCorreo(e.target.value)} className="w-full border border-gray-300 p-2 rounded text-sm text-gray-900" />
              <select value={playCategoria} onChange={e => setPlayCategoria(e.target.value)} className="w-full border border-gray-300 p-2 rounded text-sm text-gray-900">
                {managerCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              
              <div className="border-t border-gray-200 pt-3 mt-3">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Posiciones de Juego</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-gray-500 block mb-1">Principal *</label>
                    <select required value={playPos1} onChange={e => setPlayPos1(e.target.value)} className="w-full border border-gray-300 rounded p-1.5 text-xs text-gray-900">
                      {RUGBY_POSITIONS.map(pos => <option key={pos} value={pos}>{pos}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 block mb-1">Alternativa 1</label>
                    <select value={playPos2} onChange={e => setPlayPos2(e.target.value)} className="w-full border border-gray-300 rounded p-1.5 text-xs text-gray-900">
                      <option value="">Ninguna</option>
                      {RUGBY_POSITIONS.map(pos => <option key={pos} value={pos}>{pos}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 block mb-1">Alternativa 2</label>
                    <select value={playPos3} onChange={e => setPlayPos3(e.target.value)} className="w-full border border-gray-300 rounded p-1.5 text-xs text-gray-900">
                      <option value="">Ninguna</option>
                      {RUGBY_POSITIONS.map(pos => <option key={pos} value={pos}>{pos}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-2">
                <button type="button" onClick={() => setIsAddingPlayer(false)} className="px-4 py-2 border rounded text-gray-600 font-bold text-sm hover:bg-gray-50">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded font-bold text-sm hover:bg-black">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAddingProf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6">
            <h4 className="font-bold mb-4 text-gray-900">{profEditId ? 'Modificar Profesor / DT' : 'Registrar Profesor / DT'}</h4>
            <form onSubmit={handleSubmitProf} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <input type="text" required placeholder="Nombre" value={profNombre} onChange={e => setProfNombre(e.target.value)} className="w-full border border-gray-300 p-2 rounded text-sm text-gray-900" />
                <input type="text" required placeholder="Apellido" value={profApellido} onChange={e => setProfApellido(e.target.value)} className="w-full border border-gray-300 p-2 rounded text-sm text-gray-900" />
              </div>
              <input type="text" required placeholder="DNI" value={profDni} onChange={e => setProfDni(e.target.value)} className="w-full border border-gray-300 p-2 rounded text-sm text-gray-900" />
              <input type="date" required value={profNacimiento} onChange={e => setProfNacimiento(e.target.value)} className="w-full border border-gray-300 p-2 rounded text-sm text-gray-900" />
              <input type="email" required placeholder="Correo" value={profCorreo} onChange={e => setProfCorreo(e.target.value)} className="w-full border border-gray-300 p-2 rounded text-sm text-gray-900" />
              
              <div className="space-y-1 mt-2">
                <label className="block text-xs font-bold text-gray-500">Categorías Asignadas</label>
                <div className="flex flex-wrap gap-2">
                  {managerCategories.map(cat => (
                    <button key={cat} type="button" onClick={() => handleProfCatToggle(cat)} className={`px-3 py-1.5 rounded border text-xs font-bold transition-colors ${profSelectedCats.includes(cat) ? 'bg-gray-900 text-white border-gray-900' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4 pt-2">
                <button type="button" onClick={() => setIsAddingProf(false)} className="px-4 py-2 border rounded font-bold text-sm text-gray-600 hover:bg-gray-50">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-gray-900 text-white font-bold text-sm rounded hover:bg-black">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAddingMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl p-6">
            <h4 className="font-bold mb-4 text-gray-900">Cargar Partido</h4>
            <form onSubmit={handleSubmitMatch} className="space-y-4">
              <input type="text" required placeholder="Rival" value={matchRival} onChange={e => setMatchRival(e.target.value)} className="w-full border border-gray-300 p-2 rounded text-sm text-gray-900" />
              <div className="grid grid-cols-2 gap-3">
                <input type="date" required value={matchFecha} onChange={e => setMatchFecha(e.target.value)} className="w-full border border-gray-300 p-2 rounded text-sm text-gray-900" />
                <input type="time" required value={matchHora} onChange={e => setMatchHora(e.target.value)} className="w-full border border-gray-300 p-2 rounded text-sm text-gray-900" />
              </div>
              <select value={matchLugar} onChange={e => setMatchLugar(e.target.value as 'Local' | 'Visitante')} className="w-full border border-gray-300 p-2 rounded text-sm text-gray-900">
                <option value="Local">Local</option><option value="Visitante">Visitante</option>
              </select>
              <select value={matchCategoria} onChange={e => setMatchCategoria(e.target.value)} className="w-full border border-gray-300 p-2 rounded text-sm text-gray-900">
                {managerCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <div className="flex justify-end gap-2 mt-4 pt-2">
                <button type="button" onClick={() => setIsAddingMatch(false)} className="px-4 py-2 border rounded font-bold text-sm text-gray-600 hover:bg-gray-50">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-gray-900 font-bold text-sm text-white rounded hover:bg-black">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {uploadMedicalPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6">
            <h4 className="font-bold mb-4 text-gray-900">Cargar Ficha Médica - {uploadMedicalPlayer.nombre}</h4>
            <input type="file" accept=".pdf" onChange={handleFileSelect} className="w-full mb-6 text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-bold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100" />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setUploadMedicalPlayer(null)} className="px-4 py-2 border rounded font-bold text-sm text-gray-600 hover:bg-gray-50">Cancelar</button>
              <button type="button" onClick={handleSaveMedicalFile} disabled={!uploadedFileName} className="px-4 py-2 bg-gray-900 font-bold text-sm text-white rounded cursor-pointer hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed">Subir PDF</button>
            </div>
          </div>
        </div>
      )}

      {viewingPlayerMedical && (
        <MedicalFileViewer player={viewingPlayerMedical} onClose={() => setViewingPlayerMedical(null)} />
      )}
    </div>
  );
}