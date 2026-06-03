import React, { useState } from 'react';
import { Manager, Player, Professor } from '../types';
import { CLUB_CATEGORIES } from "../constants";import { UserPlus, Shield, ClipboardList, CheckCircle2, AlertTriangle, Users2, AtSign, Phone, Calendar, IdCard, Trash2, Edit } from 'lucide-react';

interface AdminPanelProps {
  managers: Manager[];
  players: Player[];
  professors: Professor[];
  onAddManager: (manager: Manager) => void;
  onDeleteManager: (id: string) => void;
  onUpdateManager: (manager: Manager) => void;
}

export default function AdminPanel({
  managers,
  players,
  professors,
  onAddManager,
  onDeleteManager,
  onUpdateManager,
}: AdminPanelProps) {
  // Adding manager states
  const [isAdding, setIsAdding] = useState(false);
  const [editingManager, setEditingManager] = useState<Manager | null>(null);

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [documento, setDocumento] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  
  // Validation error state
  const [error, setError] = useState('');

  const handleToggleCat = (cat: string) => {
    if (selectedCats.includes(cat)) {
      setSelectedCats(selectedCats.filter(c => c !== cat));
    } else {
      setSelectedCats([...selectedCats, cat]);
    }
  };

  const handleOpenAdd = () => {
    setNombre('');
    setApellido('');
    setDocumento('');
    setFechaNacimiento('');
    setTelefono('');
    setCorreo('');
    setSelectedCats([]);
    setEditingManager(null);
    setError('');
    setIsAdding(true);
  };

  const handleOpenEdit = (m: Manager) => {
    setNombre(m.nombre);
    setApellido(m.apellido);
    setDocumento(m.documento);
    setFechaNacimiento(m.fecha_nacimiento);
    setTelefono(m.telefono);
    setCorreo(m.correo);
    setSelectedCats(m.categorias);
    setEditingManager(m);
    setError('');
    setIsAdding(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !apellido || !documento || !fechaNacimiento || !correo) {
      setError('Por favor complete todos los datos obligatorios.');
      return;
    }
    if (selectedCats.length === 0) {
      setError('Debe asignar al menos una categoría al manager.');
      return;
    }

    // Adaptamos el objeto al formato que espera tu App.tsx y el backend
    const managerData: Manager = {
      id: editingManager ? editingManager.id : 'temp_id', // El ID real lo pone el backend
      nombre: nombre,
      apellido: apellido,
      documento: documento, // CAMBIADO: Usando 'documento' como acordamos
      fecha_nacimiento: fechaNacimiento,
      telefono: telefono,
      correo: correo,
      categorias: selectedCats,
    };

    if (editingManager) {
      onUpdateManager(managerData);
    } else {
      onAddManager(managerData);
    }

    setIsAdding(false);
    setError('');
  };

  // Stats calculation
  const totalPlayers = players.length;
  const playersWithFicha = players.filter(p => p.fichaMedicaUrl !== null).length;
  const playersMissingFicha = totalPlayers - playersWithFicha;
  const healthPercent = totalPlayers > 0 ? Math.round((playersWithFicha / totalPlayers) * 100) : 0;

  return (
    <div id="admin-panel-root" className="space-y-6">
      
      {/* Intro Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="font-sans font-bold text-2xl text-slate-900 tracking-tight flex items-center gap-2">
            <Shield className="h-6 w-6 text-slate-900" />
            Panel de Administración General
          </h2>
          <p className="mt-1 font-sans text-xs text-slate-550">
            Control de managers, auditoría de fichas médicas de la UAR y métricas globales del club.
          </p>
        </div>
      </div>

      {/* Metrics bento-styled */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Total Managers */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-sans text-[10px] font-bold text-slate-400 uppercase tracking-wider">Managers del Club</span>
            <Users2 className="h-4.5 w-4.5 text-slate-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-sans font-extrabold text-3xl text-slate-900">{managers.length}</span>
            <span className="font-sans text-xs text-slate-400">activos</span>
          </div>
          <p className="mt-2 font-mono text-[10px] text-slate-400">Encargados de categorías y fichas</p>
        </div>

        {/* Total Professors */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-sans text-[10px] font-bold text-slate-400 uppercase tracking-wider">Profesores / DTs</span>
            <Users2 className="h-4.5 w-4.5 text-slate-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-sans font-extrabold text-3xl text-slate-900">{professors.length}</span>
            <span className="font-sans text-xs text-slate-400">entrenadores</span>
          </div>
          <p className="mt-2 font-mono text-[10px] text-slate-400">Encargados de rutinas y tácticas</p>
        </div>

        {/* Total Players */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-sans text-[10px] font-bold text-slate-400 uppercase tracking-wider">Jugadores Totales</span>
            <Users2 className="h-4.5 w-4.5 text-slate-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-sans font-extrabold text-3xl text-slate-900">{totalPlayers}</span>
            <span className="font-sans text-xs text-slate-400">fichados UAR</span>
          </div>
          <p className="mt-2 font-mono text-[10px] text-slate-400">Distribuidos en subdivisiones</p>
        </div>

        {/* UAR Medical Stats */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-sans text-[10px] font-bold text-slate-400 uppercase tracking-wider">Apto Médico General</span>
            <div className="flex items-center gap-1">
              {playersMissingFicha > 0 ? (
                <AlertTriangle className="h-4 w-4 text-amber-500 animate-pulse" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              )}
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="font-sans font-extrabold text-3xl text-slate-900">{healthPercent}%</span>
            <span className="font-sans text-xs text-slate-500">({playersWithFicha}/{totalPlayers})</span>
          </div>
          {/* Progress Bar */}
          <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${healthPercent > 70 ? 'bg-emerald-500' : 'bg-amber-450'}`}
              style={{ width: `${healthPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end mt-4 mb-2">
        <button
          id="btn-add-manager-trigger"
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2 font-sans text-xs font-bold text-white hover:bg-slate-800 transition-all cursor-pointer shadow-xs"
        >
          <UserPlus className="h-4 w-4" />
          Registrar Nuevo Manager
        </button>
      </div>

      {/* Managers Table & Details */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50/75 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-slate-705" />
            <h3 className="font-sans font-bold text-slate-850 text-xs uppercase tracking-wide">Registro Oficial de Managers</h3>
          </div>
          <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 font-mono text-[10px] font-bold text-slate-600">
            {managers.length} Managers
          </span>
        </div>

        {managers.length === 0 ? (
          <div className="p-8 text-center text-slate-400 font-sans">
            No hay managers cargados en el sistema. Registre uno para comenzar.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-semibold text-[10px]">Manager</th>
                  <th className="px-6 py-3 font-semibold text-[10px]">Documento / DNI</th>
                  <th className="px-6 py-3 font-semibold text-[10px]">Categorías Asignadas</th>
                  <th className="px-6 py-3 font-semibold text-[10px]">Contacto</th>
                  <th className="px-6 py-3 text-right font-semibold text-[10px]">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {managers.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-slate-750">
                      <div>
                        <strong className="text-slate-900 font-bold block text-[13px]">{m.apellido}, {m.nombre}</strong>
                        <span className="font-mono text-[9px] text-slate-400">ID: {m.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-650 font-mono text-[11px]">
                      {m.documento}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {m.categorias.map(cat => (
                          <span 
                            key={cat} 
                            className="inline-block rounded bg-slate-50 border border-slate-200 px-1.5 py-0.5 text-[9px] font-semibold text-slate-700 uppercase"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-650 space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <AtSign className="h-3.5 w-3.5 text-slate-400" />
                        <span>{m.correo}</span>
                      </div>
                      {m.telefono && (
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Phone className="h-3.5 w-3.5 text-slate-400" />
                          <span>{m.telefono}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          id={`btn-edit-manager-${m.id}`}
                          onClick={() => handleOpenEdit(m)}
                          className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-blue-700 transition"
                          title="Editar Manager"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          id={`btn-delete-manager-${m.id}`}
                          onClick={() => {
                            if (window.confirm(`¿Seguro que desea eliminar al manager ${m.nombre} ${m.apellido}? Se desvinculará de sus categorías.`)) {
                              onDeleteManager(m.id);
                            }
                          }}
                          className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-red-600 transition"
                          title="Eliminar Manager"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal / Overlay for Adding or Editing Manager */}
      {isAdding && (
        <div id="manager-form-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 px-6 py-4 text-white">
              <h4 className="font-sans font-bold text-base">
                {editingManager ? 'Editar Datos del Manager' : 'Registrar Nuevo Manager'}
              </h4>
              <p className="font-sans text-xs text-slate-400">Asigne información personal y las categorías del Rugby Club bajo su tutela.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 font-sans text-xs text-red-700-600 font-medium">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Nombre *</label>
                  <input
                    id="manager-input-nombre"
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full rounded border border-slate-200 px-3 py-1.5 font-sans text-xs text-slate-800 focus:outline-hidden focus:border-slate-500"
                    placeholder="Ej. Gonzalo"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Apellido *</label>
                  <input
                    id="manager-input-apellido"
                    type="text"
                    required
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    className="w-full rounded border border-slate-200 px-3 py-1.5 font-sans text-xs text-slate-800 focus:outline-hidden focus:border-slate-500"
                    placeholder="Ej. Quesada"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Documento / DNI *</label>
                  <input
                    id="manager-input-documento"
                    type="text"
                    required
                    value={documento}
                    onChange={(e) => setDocumento(e.target.value)}
                    className="w-full rounded border border-slate-200 px-3 py-1.5 font-sans text-xs text-slate-800 focus:outline-hidden focus:border-slate-500"
                    placeholder="Ej. 28456123"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Fecha Nacimiento *</label>
                  <input
                    id="manager-input-fecha-nacimiento"
                    type="date"
                    required
                    value={fechaNacimiento}
                    onChange={(e) => setFechaNacimiento(e.target.value)}
                    className="w-full rounded border border-slate-200 px-3 py-1.5 font-sans text-xs text-slate-800 focus:outline-hidden focus:border-slate-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Correo Electrónico *</label>
                  <input
                    id="manager-input-correo"
                    type="email"
                    required
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    className="w-full rounded border border-slate-200 px-3 py-1.5 font-sans text-xs text-slate-800 focus:outline-hidden focus:border-slate-500"
                    placeholder="gonzalo@club.com"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Teléfono de Contacto</label>
                  <input
                    id="manager-input-telefono"
                    type="text"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="w-full rounded border border-slate-200 px-3 py-1.5 font-sans text-xs text-slate-800 focus:outline-hidden focus:border-slate-500"
                    placeholder="+54 11 ..."
                  />
                </div>
              </div>

              {/* Category checkboxes */}
              <div className="space-y-2 pt-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Categorías Bajo Responsabilidad (Puede elegir varias) *</label>
                <div className="flex flex-wrap gap-1.5">
                  {CLUB_CATEGORIES.map(cat => {
                    const active = selectedCats.includes(cat);
                    return (
                      <button
                        id={`btn-cat-choice-${cat}`}
                        key={cat}
                        type="button"
                        onClick={() => handleToggleCat(cat)}
                        className={`rounded-lg border px-3 py-1 font-sans text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                          active
                            ? 'bg-slate-950 border-slate-950 text-white'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Form buttons */}
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 border-t border-slate-200 pt-4 mt-6">
                <button
                  id="btn-manager-cancel"
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 font-sans text-xs font-medium text-slate-650 hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  id="btn-manager-save"
                  type="submit"
                  className="rounded-lg bg-emerald-600 hover:bg-emerald-700 px-4 py-2 font-sans text-xs font-bold text-white cursor-pointer shadow-xs transition-colors"
                >
                  Guardar Manager
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
