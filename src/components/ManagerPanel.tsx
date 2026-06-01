import React, { useState, useRef } from 'react';
import { Manager, Player, Professor, Match, FundraiserCampaign, FichajeInstallment } from '../types';
import { CLUB_CATEGORIES, RUGBY_POSITIONS } from '../mockData';
import { Users, UserPlus, Trophy, Calendar, FileText, CheckCircle2, ShieldAlert, BadgeInfo, Upload, Mail, Phone, CalendarRange, Eye, FileUp, Trash2, Edit, Megaphone, DollarSign, Plus, Check, Percent, Smartphone, Info } from 'lucide-react';
import MedicalFileViewer from './MedicalFileViewer';

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
  onAddMatch: (match: Match) => void;
  onDeleteMatch: (id: string) => void;
  onUpdateMatch?: (match: Match) => void;
}

export default function ManagerPanel({
  manager,
  players,
  professors,
  matches,
  campaigns,
  onUpdateCampaigns,
  onAddPlayer,
  onUpdatePlayer,
  onDeletePlayer,
  onAddProfessor,
  onAddMatch,
  onDeleteMatch,
  onUpdateMatch,
}: ManagerPanelProps) {
  // Tabs: 'players' | 'professors' | 'matches' | 'fichajes' | 'campanas'
  const [activeTab, setActiveTab] = useState<'players' | 'professors' | 'matches' | 'fichajes' | 'campanas'>('players');

  // Modal control states
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);
  const [isAddingProf, setIsAddingProf] = useState(false);
  const [isAddingMatch, setIsAddingMatch] = useState(false);
  const [uploadMedicalPlayer, setUploadMedicalPlayer] = useState<Player | null>(null);
  const [viewingPlayerMedical, setViewingPlayerMedical] = useState<Player | null>(null);

  // Player Form States
  const [playNombre, setPlayNombre] = useState('');
  const [playApellido, setPlayApellido] = useState('');
  const [playDni, setPlayDni] = useState('');
  const [playNacimiento, setPlayNacimiento] = useState('');
  const [playTelefono, setPlayTelefono] = useState('');
  const [playCorreo, setPlayCorreo] = useState('');
  const [playCategoria, setPlayCategoria] = useState(manager.categorias[0] || CLUB_CATEGORIES[0]);
  const [playPosicion, setPlayPosicion] = useState(RUGBY_POSITIONS[0]);
  const [playerEditId, setPlayerEditId] = useState<string | null>(null);

  // Professor Form States
  const [profNombre, setProfNombre] = useState('');
  const [profApellido, setProfApellido] = useState('');
  const [profDni, setProfDni] = useState('');
  const [profNacimiento, setProfNacimiento] = useState('');
  const [profTelefono, setProfTelefono] = useState('');
  const [profCorreo, setProfCorreo] = useState('');
  const [profSelectedCats, setProfSelectedCats] = useState<string[]>([]);

  // Match Form States
  const [matchFecha, setMatchFecha] = useState('');
  const [matchHora, setMatchHora] = useState('');
  const [matchRival, setMatchRival] = useState('');
  const [matchCategoria, setMatchCategoria] = useState(manager.categorias[0] || CLUB_CATEGORIES[0]);
  const [matchLugar, setMatchLugar] = useState<'Local' | 'Visitante'>('Local');

  // Match Edit Form States (date & time)
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [editMatchFecha, setEditMatchFecha] = useState('');
  const [editMatchHora, setEditMatchHora] = useState('');

  // File Upload State Mockup
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');

  // UAR Fees (Fichajes) State
  const [selectedFichajePlayerId, setSelectedFichajePlayerId] = useState<string | null>(null);
  const [newFichajeMonto, setNewFichajeMonto] = useState<number>(45000);
  const [newFichajeCuotas, setNewFichajeCuotas] = useState<number>(3);
  const [notifyingPlayer, setNotifyingPlayer] = useState<Player | null>(null);
  const [notificationMethod, setNotificationMethod] = useState<'whatsapp' | 'email' | null>(null);

  // Fundraiser Campaigns State
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [isCreatingCampaign, setIsCreatingCampaign] = useState<boolean>(false);
  const [newCampTitle, setNewCampTitle] = useState<string>('');
  const [newCampDesc, setNewCampDesc] = useState<string>('');
  const [newCampDesde, setNewCampDesde] = useState<string>('');
  const [newCampHasta, setNewCampHasta] = useState<string>('');
  const [newCampQty, setNewCampQty] = useState<number>(10);
  const [newCampPresetColor, setNewCampPresetColor] = useState<string>('emerald');

  // Category filters per section
  const [playerCatFilter, setPlayerCatFilter] = useState<string>('all');
  const [profCatFilter, setProfCatFilter] = useState<string>('all');
  const [matchCatFilter, setMatchCatFilter] = useState<string>('all');

  // Filtering data for the categories supervised by this manager
  const managerCategories = manager.categorias;

  const filteredPlayers = players.filter(p => {
    const belongsToManager = managerCategories.includes(p.categoria);
    if (!belongsToManager) return false;
    if (playerCatFilter !== 'all') return p.categoria === playerCatFilter;
    return true;
  });

  const filteredProfessors = professors.filter(p => {
    const belongsToManager = p.categorias.some(cat => managerCategories.includes(cat));
    if (!belongsToManager) return false;
    if (profCatFilter !== 'all') return p.categorias.includes(profCatFilter);
    return true;
  });

  const filteredMatches = matches.filter(m => {
    const belongsToManager = managerCategories.includes(m.categoria);
    if (!belongsToManager) return false;
    if (matchCatFilter !== 'all') return m.categoria === matchCatFilter;
    return true;
  });

  const handleOpenAddPlayer = () => {
    setPlayNombre('');
    setPlayApellido('');
    setPlayDni('');
    setPlayNacimiento('');
    setPlayTelefono('');
    setPlayCorreo('');
    setPlayPosicion(RUGBY_POSITIONS[0]);
    // pre-fill category filter if a specific one is selected
    setPlayCategoria(playerCatFilter !== 'all' ? playerCatFilter : (manager.categorias[0] || CLUB_CATEGORIES[0]));
    setPlayerEditId(null);
    setIsAddingPlayer(true);
  };

  const handleOpenAddProf = () => {
    setProfNombre('');
    setProfApellido('');
    setProfDni('');
    setProfNacimiento('');
    setProfTelefono('');
    setProfCorreo('');
    if (profCatFilter !== 'all') {
      setProfSelectedCats([profCatFilter]);
    } else {
      setProfSelectedCats([managerCategories[0] || CLUB_CATEGORIES[0]]);
    }
    setIsAddingProf(true);
  };

  const handleOpenEditPlayer = (p: Player) => {
    setPlayNombre(p.nombre);
    setPlayApellido(p.apellido);
    setPlayDni(p.documento);
    setPlayNacimiento(p.fecha_nacimiento);
    setPlayTelefono(p.telefono);
    setPlayCorreo(p.correo);
    setPlayCategoria(p.categoria);
    setPlayPosicion(p.posicion || RUGBY_POSITIONS[0]);
    setPlayerEditId(p.id);
    setIsAddingPlayer(true);
  };

  const handleSubmitPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playNombre || !playApellido || !playDni || !playNacimiento || !playCorreo) {
      alert('Por favor complete todos los datos obligatorios.');
      return;
    }

    if (playerEditId) {
      const original = players.find(p => p.id === playerEditId);
      onUpdatePlayer({
        id: playerEditId,
        nombre: playNombre,
        apellido: playApellido,
        documento: playDni,
        fecha_nacimiento: playNacimiento,
        telefono: playTelefono,
        correo: playCorreo,
        categoria: playCategoria,
        posicion: playPosicion,
        fichaMedicaUrl: original?.fichaMedicaUrl || null,
        fichaMedicaNombre: original?.fichaMedicaNombre || null,
        fichaMedicaFecha: original?.fichaMedicaFecha || null,
        justificaciones: original?.justificaciones || [],
      });
    } else {
      const newP: Player = {
        id: 'j_' + Date.now(),
        nombre: playNombre,
        apellido: playApellido,
        documento: playDni,
        fecha_nacimiento: playNacimiento,
        telefono: playTelefono,
        correo: playCorreo,
        categoria: playCategoria,
        posicion: playPosicion,
        fichaMedicaUrl: null,
        fichaMedicaNombre: null,
        fichaMedicaFecha: null,
        justificaciones: [],
      };
      onAddPlayer(newP);
    }
    setIsAddingPlayer(false);
  };

  const handleProfCatToggle = (cat: string) => {
    if (profSelectedCats.includes(cat)) {
      setProfSelectedCats(profSelectedCats.filter(c => c !== cat));
    } else {
      setProfSelectedCats([...profSelectedCats, cat]);
    }
  };

  const handleSubmitProf = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profNombre || !profApellido || !profDni || !profNacimiento || !profCorreo) {
      alert('Por favor complete los datos obligatorios.');
      return;
    }
    if (profSelectedCats.length === 0) {
      alert('Asigne al menos una categoría de entrenamiento al profesor.');
      return;
    }

    const newP: Professor = {
      id: 'p_' + Date.now(),
      nombre: profNombre,
      apellido: profApellido,
      documento: profDni,
      fecha_nacimiento: profNacimiento,
      telefono: profTelefono,
      correo: profCorreo,
      categorias: profSelectedCats,
    };

    onAddProfessor(newP);
    setIsAddingProf(false);
    // clean
    setProfNombre('');
    setProfApellido('');
    setProfDni('');
    setProfNacimiento('');
    setProfTelefono('');
    setProfCorreo('');
    setProfSelectedCats([]);
  };

  const handleSubmitMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchFecha || !matchHora || !matchRival) {
      alert('Debe definir fecha, hora y el club rival.');
      return;
    }

    const newM: Match = {
      id: 'match_' + Date.now(),
      fecha: matchFecha,
      hora: matchHora,
      rival: matchRival,
      categoria: matchCategoria,
      lugar: matchLugar,
      estado: 'Programado',
      resultadoClub: null,
      resultadoRival: null,
      titulares: [],
      suplentes: [],
      estadisticas: {},
    };

    onAddMatch(newM);
    setIsAddingMatch(false);
    // clean
    setMatchFecha('');
    setMatchHora('');
    setMatchRival('');
  };

  const handleOpenAddMatch = () => {
    setMatchRival('');
    setMatchFecha('');
    setMatchHora('');
    setMatchLugar('Local');
    setMatchCategoria(matchCatFilter !== 'all' ? matchCatFilter : (manager.categorias[0] || CLUB_CATEGORIES[0]));
    setIsAddingMatch(true);
  };

  const handleOpenEditMatch = (m: Match) => {
    setEditingMatch(m);
    setEditMatchFecha(m.fecha);
    setEditMatchHora(m.hora);
  };

  const handleUpdateMatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMatch || !onUpdateMatch) return;

    onUpdateMatch({
      ...editingMatch,
      fecha: editMatchFecha,
      hora: editMatchHora,
    });
    setEditingMatch(null);
  };

  // Drag-and-drop file simulation
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf" || file.name.endsWith('.pdf')) {
        setUploadedFileName(file.name);
      } else {
        alert("Únicamente se permiten archivos PDF autorizados por la UAR.");
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFileName(file.name);
    }
  };

  const handleSaveMedicalFile = () => {
    if (!uploadMedicalPlayer) return;
    const finalName = uploadedFileName || `Ficha_Medica_UAR_${uploadMedicalPlayer.apellido}.pdf`;
    
    // update player with new medical sheet
    onUpdatePlayer({
      ...uploadMedicalPlayer,
      fichaMedicaUrl: `simulated_pdf_${uploadMedicalPlayer.id}`,
      fichaMedicaNombre: finalName,
      fichaMedicaFecha: new Date().toISOString().split('T')[0]
    });

    setUploadMedicalPlayer(null);
    setUploadedFileName('');
  };

  const handleDeleteMedicalFile = (p: Player) => {
    if (window.confirm(`¿Seguro que quiere desvincular la ficha médica de ${p.nombre} ${p.apellido}? Perderá el apto deportivo.`)) {
      onUpdatePlayer({
        ...p,
        fichaMedicaUrl: null,
        fichaMedicaNombre: null,
        fichaMedicaFecha: null
      });
    }
  };

  // --- ACTIONS HANDLERS FOR FEES & CAMPAIGNS ---

  const handleGenerateFichajePlan = (playerId: string) => {
    const playerObj = players.find(p => p.id === playerId);
    if (!playerObj) return;

    const montoTotal = newFichajeMonto || 45000;
    const cantCuotas = newFichajeCuotas || 3;
    const montoCuota = Math.round(montoTotal / cantCuotas);
    
    const generated: FichajeInstallment[] = [];
    for (let i = 1; i <= cantCuotas; i++) {
      generated.push({
        id: `f-${playerId}-${i}-${Date.now()}`,
        numeroCuota: i,
        monto: montoCuota,
        pagado: false
      });
    }

    onUpdatePlayer({
      ...playerObj,
      fichajeInstalments: generated
    });
  };

  const handleToggleInstallmentPaid = (playerId: string, installmentId: string) => {
    const playerObj = players.find(p => p.id === playerId);
    if (!playerObj || !playerObj.fichajeInstalments) return;

    const updatedInstalments = playerObj.fichajeInstalments.map(ins => {
      if (ins.id === installmentId) {
        const isPayingNow = !ins.pagado;
        return {
          ...ins,
          pagado: isPayingNow,
          fechaPago: isPayingNow ? new Date().toISOString().split('T')[0] : undefined,
          medioPago: isPayingNow ? 'Transferencia' : undefined
        };
      }
      return ins;
    });

    onUpdatePlayer({
      ...playerObj,
      fichajeInstalments: updatedInstalments
    });
  };

  const handleSaveInstallmentDetails = (playerId: string, installmentId: string, updatedFields: Partial<FichajeInstallment>) => {
    const playerObj = players.find(p => p.id === playerId);
    if (!playerObj || !playerObj.fichajeInstalments) return;

    const updatedInstalments = playerObj.fichajeInstalments.map(ins => {
      if (ins.id === installmentId) {
        return {
          ...ins,
          ...updatedFields
        };
      }
      return ins;
    });

    onUpdatePlayer({
      ...playerObj,
      fichajeInstalments: updatedInstalments
    });
  };

  const handleCreateCampaignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampTitle.trim()) {
      alert('Por favor ingrese un título');
      return;
    }

    const newCampaign: FundraiserCampaign = {
      id: `c-${Date.now()}`,
      titulo: newCampTitle.trim(),
      descripcion: newCampDesc.trim(),
      fechaDesde: newCampDesde || new Date().toISOString().split('T')[0],
      fechaHasta: newCampHasta || new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
      fotoFlyer: newCampPresetColor,
      cantidadPorJugador: newCampQty || 10,
      ventasRegistradas: {}
    };

    onUpdateCampaigns([newCampaign, ...campaigns]);

    // Reset form fields
    setNewCampTitle('');
    setNewCampDesc('');
    setNewCampDesde('');
    setNewCampHasta('');
    setNewCampQty(10);
    setNewCampPresetColor('emerald');
    setIsCreatingCampaign(false);
  };

  const handleUpdatePlayerCampaignSales = (campaignId: string, playerId: string, amount: number) => {
    const updatedCampaigns = campaigns.map(c => {
      if (c.id === campaignId) {
        const currentSales = c.ventasRegistradas || {};
        const newSales = {
          ...currentSales,
          [playerId]: Math.max(0, amount)
        };
        return {
          ...c,
          ventasRegistradas: newSales
        };
      }
      return c;
    });
    onUpdateCampaigns(updatedCampaigns);
  };

  const handleDeleteCampaign = (campaignId: string) => {
    if (window.confirm('¿Seguro que desea eliminar esta campaña de recaudación? Se perderán las ventas cargadas.')) {
      onUpdateCampaigns(campaigns.filter(c => c.id !== campaignId));
      if (selectedCampaignId === campaignId) {
        setSelectedCampaignId(null);
      }
    }
  };

  return (
    <div id="manager-panel-root" className="space-y-6">
      
      {/* Upper banner profile info */}
      <div className="rounded-xl bg-[#05472A] border border-[#2ECC71]/30 p-6 text-white shadow-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-emerald-950 border border-[#2ECC71]/20 px-2.5 py-0.5 text-[9px] font-mono font-bold tracking-widest uppercase text-[#2ECC71]">
                Staff del Club
              </span>
              <span className="font-mono text-center text-[9px] text-emerald-200/80">ID: {manager.id.toUpperCase()}</span>
            </div>
            <h2 className="mt-1 font-sans font-extrabold text-2xl text-white tracking-tight">
              Hola, {manager.nombre} {manager.apellido}
            </h2>
            <p className="mt-1 font-sans text-xs text-emerald-100">
              Categorías designadas: <strong className="text-white font-bold">{managerCategories.join(', ')}</strong>
            </p>
          </div>
          
          {/* Contact block removed as requested */}
        </div>
      </div>

      {/* Categories supervised disclaimer helper */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 font-sans text-xs text-slate-700 flex items-start gap-2.5 shadow-xs">
        <BadgeInfo className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-900">Guía de gestión técnica:</span> Como manager federado de la institución, su cuenta tiene permisos sobre las planillas de las categorías <strong className="underline font-semibold text-white">{managerCategories.join(', ')}</strong>. Los planteles, entrenadores y cotejos añadidos repercuten en tiempo real en los accesos de los atletas.
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-slate-200">
        <div className="flex overflow-x-auto whitespace-nowrap space-x-6 pb-2">
          <button
            id="tab-players-trigger"
            onClick={() => setActiveTab('players')}
            className={`pb-4 font-sans text-xs font-bold uppercase tracking-wider transition-all border-b-2 relative -mb-[2px] ${
              activeTab === 'players'
                ? 'border-slate-950 text-slate-950 font-extrabold'
                : 'border-transparent text-slate-400 hover:text-slate-650'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              Jugadores ({filteredPlayers.length})
            </span>
          </button>
          
          <button
            id="tab-professors-trigger"
            onClick={() => setActiveTab('professors')}
            className={`pb-4 font-sans text-xs font-bold uppercase tracking-wider transition-all border-b-2 relative -mb-[2px] ${
              activeTab === 'professors'
                ? 'border-slate-950 text-slate-950 font-extrabold'
                : 'border-transparent text-slate-400 hover:text-slate-650'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <UserPlus className="h-4 w-4" />
              Profesores / DTs ({filteredProfessors.length})
            </span>
          </button>

          <button
            id="tab-matches-trigger"
            onClick={() => setActiveTab('matches')}
            className={`pb-4 font-sans text-xs font-bold uppercase tracking-wider transition-all border-b-2 relative -mb-[2px] ${
              activeTab === 'matches'
                ? 'border-slate-950 text-slate-950 font-extrabold'
                : 'border-transparent text-slate-400 hover:text-slate-650'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              Partidos Convocados ({filteredMatches.length})
            </span>
          </button>

          <button
            id="tab-fichajes-trigger"
            onClick={() => setActiveTab('fichajes')}
            className={`pb-4 font-sans text-xs font-bold uppercase tracking-wider transition-all border-b-2 relative -mb-[2px] ${
              activeTab === 'fichajes'
                ? 'border-slate-950 text-slate-950 font-extrabold'
                : 'border-transparent text-slate-400 hover:text-slate-650'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <DollarSign className="h-4 w-4" />
              Fichaje UAR
            </span>
          </button>

          <button
            id="tab-campanas-trigger"
            onClick={() => setActiveTab('campanas')}
            className={`pb-4 font-sans text-xs font-bold uppercase tracking-wider transition-all border-b-2 relative -mb-[2px] ${
              activeTab === 'campanas'
                ? 'border-slate-950 text-slate-950 font-extrabold'
                : 'border-transparent text-slate-400 hover:text-slate-650'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Megaphone className="h-4 w-4" />
              Campañas ({campaigns.length})
            </span>
          </button>
        </div>
      </div>

      {/* TAB CONTENT: PLAYERS */}
      {activeTab === 'players' && (
        <div id="manager-players-tab" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <button
              id="btn-add-player-dialog"
              onClick={handleOpenAddPlayer}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 font-sans text-xs font-bold text-white transition-colors cursor-pointer shadow-xs"
            >
              <UserPlus className="h-3.5 w-3.5" />
              Registrar Jugador
            </button>
          </div>

          {/* Sub-header Filter bar for Players */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Filtrar por Categoría:</span>
              <div className="flex flex-wrap gap-1">
                <button
                  id="filter-player-all"
                  onClick={() => setPlayerCatFilter('all')}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold uppercase transition-all cursor-pointer ${
                    playerCatFilter === 'all'
                      ? 'bg-slate-950 text-white shadow-xs font-extrabold'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Todas
                </button>
                {managerCategories.map(cat => (
                  <button
                    id={`filter-player-${cat}`}
                    key={cat}
                    onClick={() => setPlayerCatFilter(cat)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold uppercase transition-all cursor-pointer ${
                      playerCatFilter === cat
                        ? 'bg-slate-950 text-white shadow-xs font-extrabold'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <span className="font-mono text-[9px] text-slate-450 uppercase tracking-widest">
              Mostrando {filteredPlayers.length} jugadores
            </span>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            {filteredPlayers.length === 0 ? (
              <div className="p-8 text-center text-slate-450 font-sans">
                No hay jugadores registrados bajo las categorías de su tutela ({managerCategories.join(', ')}).
              </div>
            ) : (
              <div className="overflow-x-auto text-left">
                <table className="w-full text-xs font-sans">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                    <tr>
                      <th className="px-6 py-3 text-[10px]">Jugador</th>
                      <th className="px-6 py-3 text-[10px]">Categoría</th>
                      <th className="px-6 py-3 text-[10px]">Documento / DNI</th>
                      <th className="px-6 py-3 text-[10px]">Ficha Médica UAR</th>
                      <th className="px-6 py-3 text-[10px]">Contacto / Correo</th>
                      <th className="px-6 py-3 text-right text-[10px]">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPlayers.map(p => {
                      const hasFicha = p.fichaMedicaUrl !== null;
                      return (
                        <tr key={p.id} className="hover:bg-slate-550/10 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <strong className="text-slate-800 font-bold block text-sm">{p.apellido}, {p.nombre}</strong>
                              <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                                <span className="font-mono text-[9px] text-slate-400">F.Nac: {p.fecha_nacimiento}</span>
                                {p.posicion && (
                                  <span className="inline-flex rounded bg-slate-100 border border-slate-200 px-1.5 py-0.5 text-[8px] font-extrabold uppercase text-slate-700 font-sans tracking-tight">
                                    🏉 {p.posicion}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-bold text-[#2ECC71] uppercase">
                            {p.categoria}
                          </td>
                          <td className="px-6 py-4 font-mono text-slate-650">
                            {p.documento}
                          </td>
                          <td className="px-6 py-4">
                            {hasFicha ? (
                              <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1 rounded bg-green-50 border border-green-200 px-2 py-0.5 text-[9px] font-bold text-green-700 font-sans">
                                  <CheckCircle2 className="h-3 w-3" /> APTO
                                </span>
                                <button
                                  id={`btn-view-medical-${p.id}`}
                                  onClick={() => setViewingPlayerMedical(p)}
                                  className="inline-flex items-center gap-1 font-sans text-[10px] font-bold text-slate-600 hover:text-blue-650 underline cursor-pointer"
                                  title="Ver Ficha Médica"
                                >
                                  Ver documento
                                </button>
                                <button
                                  onClick={() => handleDeleteMedicalFile(p)}
                                  className="text-red-500 hover:text-red-700 font-mono tracking-tight text-[10px] ml-2 hover:underline cursor-pointer"
                                  title="Eliminar Ficha"
                                >
                                  Quitar
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1 rounded bg-amber-50 border border-amber-200 px-2 py-0.5 text-[9px] font-bold text-amber-600 font-sans">
                                  <ShieldAlert className="h-3 w-3" /> Faltante
                                </span>
                                <button
                                  id={`btn-upload-medical-trigger-${p.id}`}
                                  onClick={() => {
                                    setUploadMedicalPlayer(p);
                                    setUploadedFileName('');
                                  }}
                                  className="inline-flex items-center gap-1 font-sans text-[10px] font-bold text-blue-600 hover:text-blue-700 underline cursor-pointer"
                                >
                                  <FileUp className="h-3.5 w-3.5 inline" /> Cargar PDF
                                </button>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-slate-600 space-y-0.5 font-sans">
                            <div className="flex items-center gap-1 text-[11px]">
                              <Mail className="h-3 w-3 text-slate-450" />
                              <span>{p.correo}</span>
                            </div>
                            {p.telefono && (
                              <div className="flex items-center gap-1 text-[11px]">
                                <Phone className="h-3 w-3 text-slate-450" />
                                <span>{p.telefono}</span>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-1.5">
                              <button
                                id={`btn-edit-player-${p.id}`}
                                onClick={() => handleOpenEditPlayer(p)}
                                className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-blue-650 transition cursor-pointer"
                                title="Editar Datos"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                id={`btn-delete-player-${p.id}`}
                                onClick={() => {
                                  if (window.confirm(`¿Seguro que desea eliminar al jugador ${p.nombre} ${p.apellido}?`)) {
                                    onDeletePlayer(p.id);
                                  }
                                }}
                                className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-red-650 transition cursor-pointer"
                                title="Dar de baja"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
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
      )}

      {/* TAB CONTENT: PROFESSORS */}
      {activeTab === 'professors' && (
        <div id="manager-professors-tab" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <button
               id="btn-add-prof-dialog"
              onClick={handleOpenAddProf}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-950 px-4 py-2 font-sans text-xs font-bold text-white hover:bg-slate-800 shadow-sm transition-colors cursor-pointer"
            >
              <UserPlus className="h-3.5 w-3.5" />
              Alta nuevo Profesor / DT
            </button>
          </div>

          {/* Sub-header Filter bar for Professors */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Filtrar por Categoría:</span>
              <div className="flex flex-wrap gap-1">
                <button
                  id="filter-prof-all"
                  onClick={() => setProfCatFilter('all')}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold uppercase transition-all cursor-pointer ${
                    profCatFilter === 'all'
                      ? 'bg-slate-950 text-white shadow-xs font-extrabold'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Todas
                </button>
                {managerCategories.map(cat => (
                  <button
                    id={`filter-prof-${cat}`}
                    key={cat}
                    onClick={() => setProfCatFilter(cat)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold uppercase transition-all cursor-pointer ${
                      profCatFilter === cat
                        ? 'bg-slate-950 text-white shadow-xs font-extrabold'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            {profCatFilter !== 'all' ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 rounded border border-amber-200 px-2.5 py-1 shadow-2xs">
                ⚡ Categoría Activa: El profesor será de alta solo en {profCatFilter}
              </span>
            ) : (
              <span className="font-mono text-[9px] text-slate-450 uppercase tracking-widest">
                Mostrando {filteredProfessors.length} profesores
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProfessors.map(p => (
              <div key={p.id} className="rounded-xl border border-slate-150 bg-white p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] font-bold text-slate-400">ID: #{p.id.toUpperCase()}</span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[9px] font-mono font-bold text-purple-700">Prof / Preparador</span>
                  </div>
                  <h4 className="mt-2 font-sans font-extrabold text-base text-slate-800">{p.nombre} {p.apellido}</h4>
                  <div className="mt-3 space-y-1.5 font-sans text-xs text-slate-650">
                    <p className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      {p.correo}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      {p.telefono || 'Sin teléfono'}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <CalendarRange className="h-3.5 w-3.5 text-slate-400" />
                      Nac: {p.fecha_nacimiento}
                    </p>
                  </div>
                </div>

                <div className="mt-4 border-t border-slate-100 pt-3">
                  <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Categorías asociadas</span>
                  <div className="flex flex-wrap gap-1">
                    {p.categorias.map(cat => (
                      <span key={cat} className="rounded bg-purple-50 border border-purple-100 px-1.5 py-0.5 text-[9px] font-bold text-purple-700 uppercase">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: MATCHES */}
      {activeTab === 'matches' && (
        <div id="manager-matches-tab" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <button
              id="btn-add-match-dialog"
              onClick={handleOpenAddMatch}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-950 px-4 py-2 font-sans text-xs font-bold text-white hover:bg-slate-800 shadow-sm transition-colors cursor-pointer"
            >
              <Trophy className="h-3.5 w-3.5" />
              Cargar Nuevo Partido
            </button>
          </div>

          {/* Sub-header Filter bar for Matches */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Filtrar por Categoría:</span>
              <div className="flex flex-wrap gap-1">
                <button
                  id="filter-match-all"
                  onClick={() => setMatchCatFilter('all')}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold uppercase transition-all cursor-pointer ${
                    matchCatFilter === 'all'
                      ? 'bg-slate-950 text-white shadow-xs font-extrabold'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Todas
                </button>
                {managerCategories.map(cat => (
                  <button
                    id={`filter-match-${cat}`}
                    key={cat}
                    onClick={() => setMatchCatFilter(cat)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold uppercase transition-all cursor-pointer ${
                      matchCatFilter === cat
                        ? 'bg-slate-950 text-white shadow-xs font-extrabold'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <span className="font-mono text-[9px] text-slate-450 uppercase tracking-widest">
              Mostrando {filteredMatches.length} partidos
            </span>
          </div>

          <div className="rounded-xl border border-slate-150 bg-white overflow-hidden shadow-xs">
            {filteredMatches.length === 0 ? (
              <div className="p-8 text-center text-slate-450 font-sans">
                No hay partidos registrados para sus categorías.
              </div>
            ) : (
              <div className="overflow-x-auto text-left">
                <table className="w-full text-xs font-sans">
                  <thead className="bg-slate-50 text-slate-400 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3 text-[10px]">Oponente</th>
                      <th className="px-6 py-3 text-[10px]">Categoría</th>
                      <th className="px-6 py-3 text-[10px]">Fecha y Hora</th>
                      <th className="px-6 py-3 text-[10px]">Condición</th>
                      <th className="px-6 py-3 text-[10px]">Estado / Marcador</th>
                      <th className="px-6 py-3 text-right text-[10px]">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredMatches.map(m => (
                      <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <strong className="text-slate-800 font-bold block text-sm">{m.rival}</strong>
                          <span className="font-mono text-[9px] text-slate-400">ID: #{m.id}</span>
                        </td>
                        <td className="px-6 py-4 font-bold text-purple-750 uppercase">
                          {m.categoria}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 font-medium">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            <span>{m.fecha} a las {m.hora}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold ${
                            m.lugar === 'Local' ? 'bg-slate-100 text-slate-800 border-slate-250 border' : 'bg-amber-50 text-amber-700 border-amber-200 border'
                          }`}>
                            {m.lugar}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {m.estado === 'Jugado' ? (
                            <div className="flex items-center gap-2">
                              <span className="rounded bg-slate-800 px-2 py-0.5 font-mono font-bold text-xs text-white">
                                {m.resultadoClub} - {m.resultadoRival}
                              </span>
                              <span className="text-[10px] font-medium text-slate-500">Completado</span>
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 border border-blue-150">
                              Faltan cargar estadísticas
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            id={`btn-edit-match-${m.id}`}
                            onClick={() => handleOpenEditMatch(m)}
                            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-green-650 transition cursor-pointer mr-1 inline-flex items-center justify-center"
                            title="Modificar fecha/hora"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            id={`btn-delete-match-${m.id}`}
                            onClick={() => {
                              if (window.confirm(`¿Seguro que desea eliminar este partido contra ${m.rival}? Se cancelará de la agenda del club.`)) {
                                onDeleteMatch(m.id);
                              }
                            }}
                            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-red-650 transition cursor-pointer inline-flex items-center justify-center"
                            title="Desconvocar partido"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: FICHAJES UAR */}
      {activeTab === 'fichajes' && (
        <div id="manager-fichajes-tab" className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm text-slate-800">
            <h3 className="font-sans font-extrabold text-base text-slate-900 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-600 animate-pulse" />
              Gestión de Cuotas de Fichaje UAR 2026
            </h3>
            <p className="font-sans text-xs text-slate-500 mt-1">
              Configure planes de pago obligatorios de la Unión Argentina de Rugby, realice auditorías de deudas deportivas, y despache alertas por WhatsApp o Correo en caso de atraso en el pago de cuotas.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left side: Players List */}
            <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-4 shadow-xs text-slate-850 space-y-4">
              <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-500 border-b pb-2">
                Nómina de Jugadores ({filteredPlayers.length})
              </h4>
              <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                {filteredPlayers.map(p => {
                  const hasPlan = p.fichajeInstalments && p.fichajeInstalments.length > 0;
                  const totalCuotas = p.fichajeInstalments?.length || 0;
                  const pagadasCuotas = p.fichajeInstalments?.filter(ins => ins.pagado).length || 0;
                  const adeudaCuotas = totalCuotas - pagadasCuotas;
                  const isAlDia = hasPlan && adeudaCuotas === 0;

                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedFichajePlayerId(p.id)}
                      className={`w-full text-left rounded-lg p-3 border transition flex flex-col gap-1.5 focus:outline-none ${
                        selectedFichajePlayerId === p.id
                          ? 'border-emerald-600 bg-emerald-50/20 text-slate-900 shadow-xs'
                          : 'border-slate-100 hover:bg-slate-50 text-slate-700 font-medium'
                      }`}
                    >
                      <div className="flex items-center justify-between font-sans text-xs">
                        <span className="font-bold">{p.nombre} {p.apellido}</span>
                        <span className="text-[10px] font-mono text-slate-400">{p.categoria}</span>
                      </div>
                      
                      <div className="flex items-center justify-between font-sans text-[10px]">
                        <span>DNI: {p.documento}</span>
                        {hasPlan ? (
                          isAlDia ? (
                            <span className="rounded-full bg-green-50 border border-green-250 text-green-700 px-2 py-0.5 font-bold">
                              Al Día (Monto Pago)
                            </span>
                          ) : (
                            <span className="rounded-full bg-rose-50 border border-rose-200 text-rose-700 px-2 py-0.5 font-bold">
                              Debe {adeudaCuotas} de {totalCuotas} cuotas
                            </span>
                          )
                        ) : (
                          <span className="rounded-full bg-amber-50 border border-amber-250 text-amber-800 px-2 py-0.5 font-bold">
                            Sin Plan Asignado
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right side: Selected Player Details / Setup */}
            <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-5 shadow-xs text-slate-855">
              {(() => {
                const selPlayer = players.find(p => p.id === selectedFichajePlayerId);
                if (!selPlayer) {
                  return (
                    <div className="text-center py-16 text-slate-400 space-y-2">
                      <DollarSign className="mx-auto h-12 w-12 text-slate-300 stroke-1" />
                      <p className="font-bold text-sm">Seleccione un jugador de la nómina para gestionar su plan</p>
                      <p className="text-xs">Podrá estructurar el costo federativo anual, registrar cheques/transferencias y enviar intimaciones de pago.</p>
                    </div>
                  );
                }

                const hasPlan = selPlayer.fichajeInstalments && selPlayer.fichajeInstalments.length > 0;
                const totalCuotas = selPlayer.fichajeInstalments?.length || 0;
                const pagadasCuotas = selPlayer.fichajeInstalments?.filter(ins => ins.pagado).length || 0;
                const adeudas = selPlayer.fichajeInstalments?.filter(ins => !ins.pagado) || [];
                const adeudaMontoTotal = adeudas.reduce((acc, curr) => acc + curr.monto, 0);

                return (
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b pb-4">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Carpeta Financiera</span>
                        <h4 className="font-sans font-extrabold text-base text-slate-900 mt-0.5">
                          {selPlayer.nombre} {selPlayer.apellido}
                        </h4>
                        <p className="text-xs text-slate-500 font-sans mt-0.5">
                          Categoría: <strong className="text-slate-800 font-semibold">{selPlayer.categoria}</strong> • DNI: {selPlayer.documento} • Teléfono: {selPlayer.telefono}
                        </p>
                      </div>
                      {hasPlan && (
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 uppercase font-black">Monto Restante Adeudado</span>
                          <p className="font-sans font-black text-xl text-rose-600">${adeudaMontoTotal.toLocaleString('es-AR')}</p>
                        </div>
                      )}
                    </div>

                    {!hasPlan ? (
                      /* Setup Form */
                      <div className="rounded-xl bg-slate-50 border p-5 space-y-4">
                        <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider">
                          <Plus className="h-4 w-4 text-emerald-600" />
                          <span>Estructurar Plan Deportivo Anual 2026</span>
                        </div>
                        <p className="text-xs text-slate-500">
                          El jugador actualmente no dispone de una acotación de cuotas configurada para el ciclo activo. Indique el monto consolidado de la matrícula y la cantidad de desembolsos autorizados.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase">Monto Total de Inscripción ($)</label>
                            <input
                              type="number"
                              value={newFichajeMonto}
                              onChange={(e) => setNewFichajeMonto(Number(e.target.value))}
                              className="w-full rounded border px-3 py-1.5 font-sans text-xs text-slate-800 bg-white"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase">Cantidad de Cuotas</label>
                            <select
                              value={newFichajeCuotas}
                              onChange={(e) => setNewFichajeCuotas(Number(e.target.value))}
                              className="w-full rounded border px-3 py-1.5 font-sans text-xs bg-white text-slate-800"
                            >
                              <option value={1}>Pago Único (1 Cuota)</option>
                              <option value={2}>2 Cuotas</option>
                              <option value={3}>3 Cuotas (Standard Trimestral)</option>
                              <option value={4}>4 Cuotas</option>
                              <option value={6}>6 Cuotas (Semestral)</option>
                              <option value={10}>10 Cuotas (Mensualizado)</option>
                            </select>
                          </div>
                        </div>
                        <button
                          onClick={() => handleGenerateFichajePlan(selPlayer.id)}
                          className="w-full sm:w-auto rounded-lg bg-emerald-700 hover:bg-emerald-800 font-bold font-sans text-xs text-white px-5 py-2.5 transition cursor-pointer"
                        >
                          Generar Cronograma de Cuotas
                        </button>
                      </div>
                    ) : (
                      /* Installments List & Notifier */
                      <div className="space-y-6">
                        <div className="flex justify-between items-center bg-slate-50 border border-slate-200 rounded-lg p-3">
                          <div className="flex items-center gap-1.5 text-xs text-slate-850">
                            <Percent className="h-4 w-4 text-emerald-600" />
                            <span>Progreso de Pago: <strong>{pagadasCuotas} de {totalCuotas} cuotas cobradas</strong></span>
                          </div>
                          <button
                            onClick={() => {
                              if (window.confirm('¿Seguro que desea remover todos los registros de pago y reiniciar la estructuración de cuotas?')) {
                                onUpdatePlayer({
                                  ...selPlayer,
                                  fichajeInstalments: []
                                });
                              }
                            }}
                            className="font-sans text-[10px] font-bold text-red-500 hover:text-red-700"
                          >
                            Reiniciar Plan
                          </button>
                        </div>

                        {/* List of instalments */}
                        <div className="space-y-3">
                          {selPlayer.fichajeInstalments?.map(ins => {
                            return (
                              <div
                                key={ins.id}
                                className={`rounded-xl border p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center transition ${
                                  ins.pagado 
                                    ? 'bg-emerald-50/15 border-emerald-250' 
                                    : 'bg-rose-50/15 border-rose-200'
                                }`}
                              >
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-extrabold text-sm text-slate-805">Cuota #{ins.numeroCuota}</span>
                                    <span className={`text-[9px] font-bold rounded px-1.5 py-0.5 font-sans uppercase border ${
                                      ins.pagado 
                                        ? 'bg-green-100 border-green-200 text-green-700' 
                                        : 'bg-rose-100 border-rose-200 text-rose-700'
                                    }`}>
                                      {ins.pagado ? 'Cobrado' : 'Deuda Activa'}
                                    </span>
                                  </div>
                                  <p className="text-xs font-mono font-bold text-slate-700">Monto: ${ins.monto.toLocaleString('es-AR')}</p>
                                </div>

                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                                  {ins.pagado && (
                                    <div className="grid grid-cols-2 gap-2 items-center text-[11px] font-sans">
                                      {/* Payment Method selector */}
                                      <div className="space-y-0.5">
                                        <span className="text-[8px] uppercase font-bold text-slate-400">Medio</span>
                                        <select
                                          value={ins.medioPago || 'Transferencia'}
                                          onChange={(e) => handleSaveInstallmentDetails(selPlayer.id, ins.id, { medioPago: e.target.value })}
                                          className="block w-full rounded border px-1.5 py-0.5 text-[10px] bg-white text-slate-800 font-sans"
                                        >
                                          <option value="Transferencia">Transferencia</option>
                                          <option value="Tarjeta">Tarjeta</option>
                                          <option value="Efectivo">Efectivo</option>
                                        </select>
                                      </div>
                                      
                                      {/* Payment Date input */}
                                      <div className="space-y-0.5">
                                        <span className="text-[8px] uppercase font-bold text-slate-400">Fecha</span>
                                        <input
                                          type="date"
                                          value={ins.fechaPago || ''}
                                          onChange={(e) => handleSaveInstallmentDetails(selPlayer.id, ins.id, { fechaPago: e.target.value })}
                                          className="block w-full rounded border px-1.5 py-0.5 text-[10px] bg-white text-slate-855 font-sans"
                                        />
                                      </div>
                                    </div>
                                  )}

                                  <button
                                    onClick={() => handleToggleInstallmentPaid(selPlayer.id, ins.id)}
                                    className={`rounded-lg px-3 py-1.5 font-sans text-[11px] font-bold text-center transition cursor-pointer flex items-center justify-center gap-1.5 ${
                                      ins.pagado
                                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                    }`}
                                  >
                                    {ins.pagado ? (
                                      <>Cobrado ✓</>
                                    ) : (
                                      <>Registrar Cobro</>
                                    )}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Notifications Module */}
                        {adeudaMontoTotal > 0 && (
                          <div className="rounded-xl bg-orange-50 border border-orange-200 p-4 space-y-3">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-orange-950">
                              <Smartphone className="h-4 w-4 text-orange-600" />
                              <span>Notificación de Mora Activa (${adeudaMontoTotal.toLocaleString('es-AR')})</span>
                            </div>
                            <p className="text-xs text-orange-850">
                              El deportista registra atrasos en el pago de su ficha oficial de la UAR. Despache un recordatorio automático utilizando las plantillas directas del club:
                            </p>
                            <div className="flex flex-wrap gap-2.5 pt-1">
                              <button
                                onClick={() => {
                                  setNotifyingPlayer(selPlayer);
                                  setNotificationMethod('whatsapp');
                                }}
                                className="rounded bg-green-700 hover:bg-green-800 text-white px-3.5 py-2 text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer"
                              >
                                <Smartphone className="h-3.5 w-3.5" />
                                Recordatorio por WhatsApp
                              </button>
                              <button
                                onClick={() => {
                                  setNotifyingPlayer(selPlayer);
                                  setNotificationMethod('email');
                                }}
                                className="rounded bg-sky-700 hover:bg-sky-800 text-white px-3.5 py-2 text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer"
                              >
                                <Mail className="h-3.5 w-3.5 text-sky-200" />
                                Notificar por Correo Electrónico
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: CAMPAÑAS ESPECIALES */}
      {activeTab === 'campanas' && (
        <div id="manager-campanas-tab" className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm text-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-sans font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-emerald-600" />
                Campañas de Recaudación y Financiamiento
              </h3>
              <p className="font-sans text-xs text-slate-500 mt-1">
                Estructure campañas del club (venta de milanesas, rifas, locros) asignando metas específicas por deportista y audite el nivel de recaudación en tiempo real.
              </p>
            </div>
            <button
              onClick={() => setIsCreatingCampaign(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 font-sans text-xs font-bold text-white transition-colors cursor-pointer shadow-xs whitespace-nowrap animate-in fade-in"
            >
              <Plus className="h-4 w-4" />
              Nueva Campaña
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.length === 0 ? (
              <div className="col-span-full bg-white rounded-xl border p-12 text-center text-slate-400 space-y-2">
                <Megaphone className="mx-auto h-12 w-12 text-slate-300 stroke-1" />
                <p className="font-bold text-sm">No hay campañas especiales activas en el sistema</p>
                <p className="text-xs">Haga click en "Nueva Campaña" para estructurar un objetivo de ventas para las divisiones.</p>
              </div>
            ) : (
              campaigns.map(c => {
                const totalTarget = filteredPlayers.length * c.cantidadPorJugador;
                
                // calculate actual registered sales
                let totalSold = 0;
                filteredPlayers.forEach(p => {
                  totalSold += (c.ventasRegistradas?.[p.id] || 0);
                });

                const percentage = totalTarget > 0 ? Math.min(100, Math.round((totalSold / totalTarget) * 100)) : 0;
                const progressColor = percentage >= 100 ? 'bg-green-600' : percentage >= 50 ? 'bg-emerald-500' : 'bg-amber-500';

                // flyers presets styles mapping
                const isRifa = c.fotoFlyer === 'rifa_flyer' || c.fotoFlyer === 'sky';
                const presetBg = isRifa 
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
                      <div className={`${presetBg} px-5 py-6 text-white text-sans relative h-36 flex flex-col justify-end`}>
                        <div className="absolute top-2 right-2 flex gap-1.5">
                          <button
                            onClick={() => handleDeleteCampaign(c.id)}
                            className="bg-black/30 hover:bg-red-700 text-white p-1 rounded-md transition cursor-pointer"
                            title="Eliminar campaña"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className="text-[9px] uppercase font-extrabold bg-white/20 px-2 py-0.5 rounded tracking-widest w-fit">Recaudación Club</span>
                        <h4 className="font-sans font-black text-sm text-white tracking-tight mt-1 leading-snug">{c.titulo}</h4>
                        <p className="text-[10px] text-white/80 font-sans mt-0.5">Asignación por Jugador: <strong>{c.cantidadPorJugador} unidades</strong></p>
                      </div>

                      {/* Info body */}
                      <div className="p-5 font-sans space-y-4">
                        <p className="text-xs text-slate-600 leading-relaxed min-h-[48px] line-clamp-3">
                          {c.descripcion}
                        </p>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-400">
                            <span>Ventas Registradas</span>
                            <span>{totalSold} / {totalTarget} u. ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border">
                            <div className={`${progressColor} h-2 rounded-full transition-all duration-300`} style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 border-t pt-3 text-[10px] font-sans text-slate-500">
                          <div>
                            <span className="block uppercase text-[8px] font-bold text-slate-400">Fecha Lanzamiento</span>
                            <span className="font-semibold text-slate-700">{c.fechaDesde}</span>
                          </div>
                          <div className="text-right">
                            <span className="block uppercase text-[8px] font-bold text-slate-400">Fecha Límite</span>
                            <span className="font-semibold text-rose-700">{c.fechaHasta}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      <button
                        onClick={() => setSelectedCampaignId(c.id)}
                        className="w-full rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 px-4 py-2 font-sans font-bold text-xs text-slate-700 hover:text-slate-900 transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        Planilla de Ventas ({filteredPlayers.length} Jugadores)
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Detailed Player sales grid inside selected campaign */}
          {selectedCampaignId && (() => {
            const campObj = campaigns.find(c => c.id === selectedCampaignId);
            if (!campObj) return null;

            return (
              <div id="campaign-progress-drawer" className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4 text-slate-800 animate-in slide-in-from-bottom border-t-4 border-emerald-700">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-3">
                  <div>
                    <span className="text-[9px] uppercase font-black text-slate-400 tracking-widest">Planilla General del Manager</span>
                    <h4 className="font-sans font-extrabold text-base text-slate-900 mt-0.5">Ventas: {campObj.titulo}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Escriba o aumente la cantidad de artículos entregados por cada atleta.</p>
                  </div>
                  <button
                    onClick={() => setSelectedCampaignId(null)}
                    className="text-xs font-bold text-slate-500 hover:text-slate-900 bg-slate-50 border px-3 py-1.5 rounded-md cursor-pointer transition hover:bg-slate-100 text-sans"
                  >
                    Ocultar Planilla
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPlayers.map(p => {
                    const count = campObj.ventasRegistradas?.[p.id] || 0;
                    const isCompleted = count >= campObj.cantidadPorJugador;
                    const percent = Math.min(100, Math.round((count / campObj.cantidadPorJugador) * 100));

                    return (
                      <div
                        key={p.id}
                        className={`rounded-xl border p-4 space-y-3 font-sans transition ${
                          isCompleted 
                            ? 'bg-green-50/10 border-green-250' 
                            : 'bg-slate-50/40 border-slate-200'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="block font-bold text-xs text-slate-900 leading-tight">{p.nombre} {p.apellido}</span>
                            <span className="font-mono text-[9px] text-slate-405 uppercase font-semibold">{p.categoria}</span>
                          </div>
                          {isCompleted ? (
                            <span className="bg-green-100 border border-green-200 text-green-700 text-[8px] font-black rounded px-1.5 py-0.5 uppercase">Meta Cumplida</span>
                          ) : (
                            <span className="bg-amber-100 border border-amber-200 text-amber-800 text-[8px] font-bold rounded px-1.5 py-0.5">En Progreso ({percent}%)</span>
                          )}
                        </div>

                        {/* Interactive counters */}
                        <div className="flex items-center justify-between gap-3 bg-white border rounded-lg px-2 py-1">
                          <span className="text-[10px] text-slate-500 uppercase font-bold">Unidades vendidas:</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleUpdatePlayerCampaignSales(campObj.id, p.id, count - 1)}
                              className="w-6 h-6 rounded bg-slate-105 border flex items-center justify-center font-bold font-mono text-slate-700 hover:bg-slate-200 cursor-pointer text-xs"
                            >
                              -
                            </button>
                            <span className="font-bold text-xs w-8 text-center">{count}</span>
                            <button
                              onClick={() => handleUpdatePlayerCampaignSales(campObj.id, p.id, count + 1)}
                              className="w-6 h-6 rounded bg-slate-105 border flex items-center justify-center font-bold font-mono text-slate-700 hover:bg-slate-200 cursor-pointer text-xs"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="space-y-0.5">
                          <div className="flex justify-between text-[8px] text-slate-400 font-bold uppercase">
                            <span>Meta: {campObj.cantidadPorJugador} unidades</span>
                            <span>{count} / {campObj.cantidadPorJugador} u.</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1 border overflow-hidden">
                            <div
                              className={`h-1 rounded-full transition-all ${
                                isCompleted ? 'bg-green-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${percent}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* MODAL: NOTIFICATIONS SENDER PREVIEW */}
      {notifyingPlayer && notificationMethod && (() => {
        const hasPlan = notifyingPlayer.fichajeInstalments && notifyingPlayer.fichajeInstalments.length > 0;
        const totalCuotas = notifyingPlayer.fichajeInstalments?.length || 0;
        const pagadasCuotas = notifyingPlayer.fichajeInstalments?.filter(ins => ins.pagado).length || 0;
        const adeudas = notifyingPlayer.fichajeInstalments?.filter(ins => !ins.pagado) || [];
        const adeudaMontoTotal = adeudas.reduce((acc, curr) => acc + curr.monto, 0);

        const customMessage = `Hola ${notifyingPlayer.nombre}, te recordamos desde la Coordinación de Guaycurúes Rugby Club que registrás un saldo pendiente de pago por la Ficha Médica y Fichaje UAR 2026. Adeudas ${adeudas.length} cuotas por un total de $${adeudaMontoTotal.toLocaleString('es-AR')}. Por favor, realizá la transferencia correspondiente o contactate con la secretaría del club para regularizar tu situación. ¡Muchas gracias y buenas tardes!`;

        const encodedMsg = encodeURIComponent(customMessage);
        const relativePhone = notifyingPlayer.telefono.replace(/[^0-9+]/g, '');
        const waUrl = `https://api.whatsapp.com/send?phone=${relativePhone}&text=${encodedMsg}`;
        const mailUrl = `mailto:${notifyingPlayer.correo}?subject=Aviso de Deuda - Fichaje UAR 2026 - Guaycurúes Rugby&body=${encodedMsg}`;

        return (
          <div id="notification-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-155 text-slate-805 text-sans">
              <div className="bg-slate-900 px-6 py-4 text-white">
                <h4 className="font-sans font-bold text-base flex items-center gap-1.5">
                  <Smartphone className="h-5 w-5 text-emerald-400" />
                  Despacho de Notificación Deportiva
                </h4>
                <p className="font-sans text-xs text-slate-400">
                  Destinatario: <strong>{notifyingPlayer.nombre} {notifyingPlayer.apellido}</strong>
                </p>
              </div>

              <div className="p-6 space-y-4 text-xs font-sans">
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase">Canal de Envío</label>
                  <div className="rounded-lg bg-slate-105 border p-2 flex items-center justify-between font-bold text-[10px] uppercase text-slate-805">
                    <span>{notificationMethod === 'whatsapp' ? '🟢 Canal Directo WhatsApp Web' : '🔵 Canal Correo Electrónico (mailto)'}</span>
                    <span className="text-emerald-700 font-extrabold">Configurado</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase">Texto Informativo Confeccionado</span>
                  <div className="rounded-lg bg-orange-50 border border-orange-200 p-3 text-[11px] text-orange-950 leading-relaxed font-semibold whitespace-pre-wrap select-all">
                    {customMessage}
                  </div>
                  <p className="text-[9px] text-slate-400 mt-0.5">El recuadro anterior es copiable y fue generado automáticamente de la base de deudores del club.</p>
                </div>

                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 border-t border-slate-100 pt-4 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setNotifyingPlayer(null);
                      setNotificationMethod(null);
                    }}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Salir sin Enviar
                  </button>
                  <a
                    href={notificationMethod === 'whatsapp' ? waUrl : mailUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => {
                      setTimeout(() => {
                        setNotifyingPlayer(null);
                        setNotificationMethod(null);
                      }, 500);
                    }}
                    className="rounded-lg bg-emerald-700 hover:bg-emerald-800 px-4 py-2 font-bold text-white cursor-pointer inline-flex items-center gap-1.5 text-center justify-center whitespace-nowrap"
                  >
                    {notificationMethod === 'whatsapp' ? 'Despachar WhatsApp' : 'Abrir Correo'}
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* MODAL: CAMPAÑA CREATION FORM */}
      {isCreatingCampaign && (
        <div id="campaign-create-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm overflow-hidden rounded-xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-150 text-slate-855 text-sans">
            <div className="bg-slate-900 px-6 py-4 text-white">
              <h4 className="font-sans font-bold text-base flex items-center gap-1.5">
                <Megaphone className="h-5 w-5 text-emerald-400" />
                Nueva Campaña de Recaudación
              </h4>
              <p className="font-sans text-xs text-slate-400">
                Estructure un objetivo de recaudación para toda la categoría.
              </p>
            </div>

            <form onSubmit={handleCreateCampaignSubmit} className="p-6 space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Título de la Campaña *</label>
                <input
                  type="text"
                  required
                  placeholder="Por ejemplo: Venta de Milanesas"
                  value={newCampTitle}
                  onChange={(e) => setNewCampTitle(e.target.value)}
                  className="w-full rounded border px-3 py-1.5 font-sans text-xs text-slate-805 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Descripción / Finalidad del dinero</label>
                <textarea
                  placeholder="Para comprar equipamiento o financiar viáticos..."
                  value={newCampDesc}
                  onChange={(e) => setNewCampDesc(e.target.value)}
                  className="w-full rounded border px-3 py-1.5 font-sans text-xs text-slate-805 bg-white h-16 min-h-[48px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Inicio</label>
                  <input
                    type="date"
                    value={newCampDesde}
                    onChange={(e) => setNewCampDesde(e.target.value)}
                    className="w-full rounded border px-3 py-1.5 font-sans text-xs text-slate-805 bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Vencimiento</label>
                  <input
                    type="date"
                    value={newCampHasta}
                    onChange={(e) => setNewCampHasta(e.target.value)}
                    className="w-full rounded border px-3 py-1.5 font-sans text-xs text-slate-855 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Cantidad por Jugador</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={newCampQty}
                    onChange={(e) => setNewCampQty(Number(e.target.value))}
                    className="w-full rounded border px-3 py-1.5 font-sans text-xs text-slate-850 bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Paleta Temática Flyer</label>
                  <select
                    value={newCampPresetColor}
                    onChange={(e) => setNewCampPresetColor(e.target.value)}
                    className="w-full rounded border px-3 py-1.5 font-sans text-xs bg-white text-slate-805"
                  >
                    <option value="emerald">Verde Club (Standard)</option>
                    <option value="sky">Azul Celeste (Rifas)</option>
                    <option value="amber">Naranja (Comidas/Locros)</option>
                    <option value="rose">Rosa / Violeta (Merchandising)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 border-t border-slate-100 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsCreatingCampaign(false)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-705 hover:bg-slate-50 cursor-pointer"
                  id="btn-campaign-create-cancel"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-green-700 hover:bg-green-800 px-4 py-2 font-bold text-white cursor-pointer"
                  id="btn-campaign-create-submit"
                >
                  Crear Campaña
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: MOCK PDF FILE UPLOAD FOR PLAYERS MEDICAL RECORD */}
      {uploadMedicalPlayer && (
        <div id="upload-medical-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#05472A] border-b border-[#2ECC71]/30 px-6 py-4 text-white">
              <h4 className="font-sans font-bold text-base flex items-center gap-1.5">
                <Upload className="h-5 w-5 text-emerald-400" />
                Cargar Ficha Médica Única UAR
              </h4>
              <p className="font-sans text-xs text-emerald-200/80">
                Jugador: <strong>{uploadMedicalPlayer.nombre} {uploadMedicalPlayer.apellido}</strong> (DNI: {uploadMedicalPlayer.documento})
              </p>
            </div>

            <div className="p-6 space-y-4 font-sans text-xs">
              
              {/* Drag/drop box simulation */}
              <div
                id="dropzone-area"
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition ${
                  dragActive 
                    ? 'border-[#2ECC71] bg-emerald-50/50' 
                    : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <FileText className="h-10 w-10 text-slate-400 mb-2" />
                <p className="font-semibold text-slate-700">Arrastre y suelte el archivo PDF aquí</p>
                <p className="text-slate-400 text-[10px] mt-1">O haga click para examinar su dispositivo</p>
                
                <input
                  id="medical-file-input"
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                <button
                  id="btn-trigger-file-click"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-bold text-slate-700 hover:bg-slate-50 transition shadow-xs cursor-pointer"
                >
                  Examinar Archivos
                </button>
              </div>

              {/* Status or selection view */}
              {uploadedFileName ? (
                <div className="rounded-lg border border-green-200 bg-green-50/50 p-3 flex items-center justify-between">
                  <div className="truncate pr-4">
                    <span className="block text-[9px] uppercase tracking-wider font-bold text-green-800">Archivo seleccionado</span>
                    <strong className="text-slate-700 font-mono truncate block">{uploadedFileName}</strong>
                  </div>
                  <button
                    onClick={() => setUploadedFileName('')}
                    className="text-slate-400 hover:text-red-500 font-bold"
                  >
                    Remover
                  </button>
                </div>
              ) : (
                <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-3 text-blue-800 leading-relaxed font-light text-[11px]">
                  <strong>Certificado Oficial:</strong> Se requiere subir un documento PDF firmado y sellado digital u holográficamente por un médico cardiólogo acreditado por la UAR para validar el alta deportivo del jugador.
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 border-t border-slate-100 pt-4 mt-6">
                <button
                  id="btn-upload-cancel"
                  onClick={() => {
                    setUploadMedicalPlayer(null);
                    setUploadedFileName('');
                  }}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-550/10 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  id="btn-upload-save"
                  onClick={handleSaveMedicalFile}
                  disabled={!uploadedFileName}
                  className={`rounded-lg px-4 py-2 font-bold text-white transition ${
                    uploadedFileName 
                      ? 'bg-green-700 hover:bg-green-800 cursor-pointer' 
                      : 'bg-slate-350 cursor-not-allowed'
                  }`}
                >
                  Confirmar Carga de Ficha
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* MODAL: PLAYER FORM (ADD OR EDIT) */}
      {isAddingPlayer && (
        <div id="player-form-modal" className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 px-6 py-4 text-white">
              <h4 className="font-sans font-bold text-base">
                {playerEditId ? 'Editar Datos del Jugador' : 'Registrar Nuevo Jugador'}
              </h4>
              <p className="font-sans text-xs text-slate-400">Ingrese datos personales de la UAR y asigne la categoría de juego del atleta.</p>
            </div>

            <form onSubmit={handleSubmitPlayer} className="p-6 space-y-4 text-xs font-sans">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Nombre *</label>
                  <input
                    id="player-input-nombre"
                    type="text"
                    required
                    value={playNombre}
                    onChange={(e) => setPlayNombre(e.target.value)}
                    className="w-full rounded border border-slate-200 px-3 py-1.5 font-sans text-xs text-slate-850 focus:outline-hidden"
                    placeholder="Ej. Emiliano"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Apellido *</label>
                  <input
                    id="player-input-apellido"
                    type="text"
                    required
                    value={playApellido}
                    onChange={(e) => setPlayApellido(e.target.value)}
                    className="w-full rounded border border-slate-200 px-3 py-1.5 font-sans text-xs text-slate-850 focus:outline-hidden"
                    placeholder="Ej. Boffelli"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Documento / DNI *</label>
                  <input
                    id="player-input-dni"
                    type="text"
                    required
                    value={playDni}
                    onChange={(e) => setPlayDni(e.target.value)}
                    className="w-full rounded border border-slate-200 px-3 py-1.5 font-sans text-xs text-slate-850 focus:outline-hidden"
                    placeholder="Ej. 38123456"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Fecha Nacimiento *</label>
                  <input
                    id="player-input-nacimiento"
                    type="date"
                    required
                    value={playNacimiento}
                    onChange={(e) => setPlayNacimiento(e.target.value)}
                    className="w-full rounded border border-slate-200 px-3 py-1.5 font-sans text-xs text-slate-850 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Correo Electrónico *</label>
                  <input
                    id="player-input-correo"
                    type="email"
                    required
                    value={playCorreo}
                    onChange={(e) => setPlayCorreo(e.target.value)}
                    className="w-full rounded border border-slate-200 px-3 py-1.5 font-sans text-xs text-slate-850 focus:outline-hidden"
                    placeholder="jugador@correo.com"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Celular / Teléfono</label>
                  <input
                    id="player-input-telefono"
                    type="text"
                    value={playTelefono}
                    onChange={(e) => setPlayTelefono(e.target.value)}
                    className="w-full rounded border border-slate-200 px-3 py-1.5 font-sans text-xs text-slate-855 focus:outline-hidden"
                    placeholder="+54 ..."
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Categoría Asignada *</label>
                <select
                  id="player-input-categoria"
                  value={playCategoria}
                  onChange={(e) => setPlayCategoria(e.target.value)}
                  className="w-full rounded border border-slate-200 px-3 py-2 font-sans text-xs text-slate-850 focus:outline-hidden bg-white"
                >
                  {managerCategories.map(cat => (
                    <option key={cat} value={cat}>{cat} (Tutela Activa)</option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400 mt-0.5">La asignación habilita el acceso prioritario al panel deportivo del atleta.</p>
              </div>

              <div className="space-y-1 mt-4">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Posición en Cancha *</label>
                <select
                  id="player-input-posicion"
                  value={playPosicion}
                  onChange={(e) => setPlayPosicion(e.target.value)}
                  className="w-full rounded border border-slate-200 px-3 py-2 font-sans text-xs text-slate-850 focus:outline-hidden bg-white"
                >
                  {RUGBY_POSITIONS.map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400 mt-0.5">Asigna la posición para optimizar la carga automática de rutinas deportivas preparadas por kinesiología/DT.</p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 border-t border-slate-100 pt-4 mt-6">
                <button
                  id="btn-player-cancel"
                  type="button"
                  onClick={() => setIsAddingPlayer(false)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-705 hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  id="btn-player-save"
                  type="submit"
                  className="rounded-lg bg-green-700 px-4 py-2 font-bold text-white hover:bg-green-800 cursor-pointer"
                >
                  Registrar Jugador
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PROFESSOR FORM */}
      {isAddingProf && (
        <div id="professor-form-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-155">
            <div className="bg-slate-900 px-6 py-4 text-white">
              <h4 className="font-sans font-bold text-base">Registrar Profesor / DT</h4>
              <p className="font-sans text-xs text-slate-400">Cree la cuenta de entrenador o preparador físico en el sistema.</p>
            </div>

            <form onSubmit={handleSubmitProf} className="p-6 space-y-4 text-xs font-sans">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Nombre *</label>
                  <input
                    id="prof-input-nombre"
                    type="text"
                    required
                    value={profNombre}
                    onChange={(e) => setProfNombre(e.target.value)}
                    className="w-full rounded border border-slate-200 px-3 py-1.5 font-sans text-xs text-slate-850 focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Apellido *</label>
                  <input
                    id="prof-input-apellido"
                    type="text"
                    required
                    value={profApellido}
                    onChange={(e) => setProfApellido(e.target.value)}
                    className="w-full rounded border border-slate-200 px-3 py-1.5 font-sans text-xs text-slate-850 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Documento / DNI *</label>
                  <input
                    id="prof-input-dni"
                    type="text"
                    required
                    value={profDni}
                    onChange={(e) => setProfDni(e.target.value)}
                    className="w-full rounded border border-slate-200 px-3 py-1.5 font-sans text-xs text-slate-850"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Fecha Nacimiento *</label>
                  <input
                    id="prof-input-nacimiento"
                    type="date"
                    required
                    value={profNacimiento}
                    onChange={(e) => setProfNacimiento(e.target.value)}
                    className="w-full rounded border border-slate-200 px-3 py-1.5 font-sans text-xs text-slate-850"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Correo *</label>
                  <input
                    id="prof-input-correo"
                    type="email"
                    required
                    value={profCorreo}
                    onChange={(e) => setProfCorreo(e.target.value)}
                    className="w-full rounded border border-slate-200 px-3 py-1.5 font-sans text-xs text-slate-850"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Celular / Teléfono</label>
                  <input
                    id="prof-input-telefono"
                    type="text"
                    value={profTelefono}
                    onChange={(e) => setProfTelefono(e.target.value)}
                    className="w-full rounded border border-slate-200 px-3 py-1.5 font-sans text-xs text-slate-850"
                  />
                </div>
              </div>

              {/* Class Checkbox toggles */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Categorías asignadas para entrenamiento *</label>
                {profCatFilter !== 'all' ? (
                  <div className="rounded-lg bg-slate-100 border border-slate-250 p-2.5 text-slate-800 font-sans font-bold text-xs uppercase tracking-wide flex items-center justify-between">
                    <span>{profCatFilter} (Categoría Activa)</span>
                    <span className="text-[9px] text-slate-500 uppercase font-bold">Asignado automáticamente</span>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {managerCategories.map(cat => {
                      const active = profSelectedCats.includes(cat);
                      return (
                        <button
                          id={`btn-prof-cat-${cat}`}
                          key={cat}
                          type="button"
                          onClick={() => handleProfCatToggle(cat)}
                          className={`rounded-lg border px-2.5 py-1.5 text-[10px] font-bold uppercase cursor-pointer transition ${
                            active 
                              ? 'bg-slate-950 border-slate-950 text-white shadow-xs' 
                              : 'bg-slate-50 border-slate-200 text-slate-705 hover:bg-slate-100'
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                )}
                {profCatFilter === 'all' && (
                  <p className="text-[10px] text-slate-400 mt-1">
                    Solo puede asignar categorías bajo su supervisión ({managerCategories.join(', ')}).
                  </p>
                )}
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 border-t border-slate-100 pt-4 mt-6">
                <button
                  id="btn-prof-cancel"
                  type="button"
                  onClick={() => setIsAddingProf(false)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-750 hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  id="btn-prof-save"
                  type="submit"
                  className="rounded-lg bg-green-700 px-4 py-2 font-bold text-white hover:bg-green-800 cursor-pointer"
                >
                  Registrar Profesor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: MATCH FORM */}
      {isAddingMatch && (
        <div id="match-form-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm overflow-hidden rounded-xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 px-6 py-4 text-white">
              <h4 className="font-sans font-bold text-base flex items-center gap-1">
                <Trophy className="h-5 w-5 text-amber-400" />
                Cargar Próximo Partido
              </h4>
              <p className="font-sans text-xs text-slate-400">Programe partidos para que los DT preparen la planilla médica e hito estadístico.</p>
            </div>

            <form onSubmit={handleSubmitMatch} className="p-6 space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Club Oponente / Rival *</label>
                <input
                  id="match-input-rival"
                  type="text"
                  required
                  value={matchRival}
                  onChange={(e) => setMatchRival(e.target.value)}
                  placeholder="Ej. S.I.C."
                  className="w-full rounded border border-slate-200 px-3 py-1.5 font-sans text-xs text-slate-850"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Fecha *</label>
                  <input
                    id="match-input-fecha"
                    type="date"
                    required
                    value={matchFecha}
                    onChange={(e) => setMatchFecha(e.target.value)}
                    className="w-full rounded border border-slate-200 px-3 py-1.5 font-sans text-xs text-slate-850"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Hora de inicio *</label>
                  <input
                    id="match-input-hora"
                    type="time"
                    required
                    value={matchHora}
                    onChange={(e) => setMatchHora(e.target.value)}
                    className="w-full rounded border border-slate-200 px-3 py-1.5 font-sans text-xs text-slate-850"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Condición *</label>
                  <select
                    id="match-input-lugar"
                    value={matchLugar}
                    onChange={(e) => setMatchLugar(e.target.value as 'Local' | 'Visitante')}
                    className="w-full rounded border border-slate-200 px-3 py-1.5 font-sans text-xs text-slate-850 bg-white"
                  >
                    <option value="Local">Local (En nuestro club)</option>
                    <option value="Visitante">Visitante</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Categoría Convocada *</label>
                  <select
                    id="match-input-categoria"
                    value={matchCategoria}
                    onChange={(e) => setMatchCategoria(e.target.value)}
                    className="w-full rounded border border-slate-200 px-3 py-1.5 font-sans text-xs text-slate-850 bg-white"
                  >
                    {managerCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 border-t border-slate-100 pt-4 mt-6">
                <button
                  id="btn-match-cancel"
                  type="button"
                  onClick={() => setIsAddingMatch(false)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-705 hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  id="btn-match-save"
                  type="submit"
                  className="rounded-lg bg-green-700 px-4 py-2 font-bold text-white hover:bg-green-850 cursor-pointer"
                >
                  Confirmar Convocatoria
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: MATCH EDIT FORM */}
      {editingMatch && (
        <div id="match-edit-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm overflow-hidden rounded-xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 px-6 py-4 text-white">
              <h4 className="font-sans font-bold text-base flex items-center gap-1.5">
                <CalendarRange className="h-5 w-5 text-green-400" />
                Modificar Fecha y Hora
              </h4>
              <p className="font-sans text-xs text-slate-400">
                Ajuste la agenda del partido contra <strong>{editingMatch.rival}</strong> ({editingMatch.categoria}).
              </p>
            </div>

            <form onSubmit={handleUpdateMatchSubmit} className="p-6 space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Fecha del Partido</label>
                <input
                  id="match-edit-input-fecha"
                  type="date"
                  required
                  value={editMatchFecha}
                  onChange={(e) => setEditMatchFecha(e.target.value)}
                  className="w-full rounded border border-slate-200 px-3 py-1.5 font-sans text-xs text-slate-850"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Hora de Inicio</label>
                <input
                  id="match-edit-input-hora"
                  type="time"
                  required
                  value={editMatchHora}
                  onChange={(e) => setEditMatchHora(e.target.value)}
                  className="w-full rounded border border-slate-200 px-3 py-1.5 font-sans text-xs text-slate-850"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 border-t border-slate-100 pt-4 mt-6">
                <button
                  id="btn-match-edit-cancel"
                  type="button"
                  onClick={() => setEditingMatch(null)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-705 hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  id="btn-match-edit-save"
                  type="submit"
                  className="rounded-lg bg-green-700 px-4 py-2 font-bold text-white hover:bg-green-850 cursor-pointer"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RENDER MEDICAL SHEET VIEW MODAL */}
      {viewingPlayerMedical && (
        <MedicalFileViewer 
          player={viewingPlayerMedical} 
          onClose={() => setViewingPlayerMedical(null)} 
        />
      )}

    </div>
  );
}
