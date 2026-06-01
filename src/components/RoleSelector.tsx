import React from 'react';
import { UserRole, Manager, Professor, Player } from '../types';
import { ShieldAlert, Users, Dumbbell, UserCheck, RefreshCw } from 'lucide-react';
import GuaycuruesLogo from './GuaycuruesLogo';

interface RoleSelectorProps {
  currentRole: UserRole;
  selectedManagerId: string;
  selectedProfessorId: string;
  selectedPlayerId: string;
  managers: Manager[];
  professors: Professor[];
  players: Player[];
  onChangeRole: (role: UserRole) => void;
  onChangeManager: (id: string) => void;
  onChangeProfessor: (id: string) => void;
  onChangePlayer: (id: string) => void;
}

export default function RoleSelector({
  currentRole,
  selectedManagerId,
  selectedProfessorId,
  selectedPlayerId,
  managers,
  professors,
  players,
  onChangeRole,
  onChangeManager,
  onChangeProfessor,
  onChangePlayer,
}: RoleSelectorProps) {

  const selectedPlayer = players.find(p => p.id === selectedPlayerId);

  return (
    <div id="role-selector-container" className="border-b border-zinc-900 bg-zinc-950/70 backdrop-blur-md p-4 text-zinc-100 shadow-lg">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-stretch justify-between gap-4 md:flex-row md:items-center">
        
        {/* Title / Logo Component */}
        <div className="flex items-center gap-2.5">
          <GuaycuruesLogo />
          <div className="hidden sm:block border-l border-zinc-800 pl-3">
            <p className="font-mono text-[9px] uppercase tracking-widest text-[#2ECC71] font-bold">Portal Directivo</p>
            <p className="text-[10px] text-zinc-500 font-sans mt-0.5">Asignador de Roles Simulados</p>
          </div>
        </div>

        {/* Roles Toggles */}
        <div className="flex flex-wrap items-center gap-1.5 bg-zinc-900/50 p-1.5 rounded-xl border border-zinc-800">
          {/* Admin Toggle */}
          <button
            id="role-btn-admin"
            onClick={() => onChangeRole('admin')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-sans text-xs font-semibold tracking-wide transition-all border cursor-pointer ${
              currentRole === 'admin'
                ? 'bg-[#05472A] text-white border-[#2ECC71]/40 shadow-md font-bold'
                : 'bg-transparent text-zinc-400 border-transparent hover:text-white hover:bg-zinc-800'
            }`}
          >
            <ShieldAlert className="h-3.5 w-3.5 text-[#2ECC71]" />
            Admin (Yo)
          </button>

          {/* Manager Toggle */}
          <button
            id="role-btn-manager"
            onClick={() => onChangeRole('manager')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-sans text-xs font-semibold tracking-wide transition-all border cursor-pointer ${
              currentRole === 'manager'
                ? 'bg-[#05472A] text-white border-[#2ECC71]/40 shadow-md font-bold'
                : 'bg-transparent text-zinc-400 border-transparent hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Users className="h-3.5 w-3.5 text-[#2ECC71]" />
            Manager
          </button>

          {/* Profesor Toggle */}
          <button
            id="role-btn-profesor"
            onClick={() => onChangeRole('profesor')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-sans text-xs font-semibold tracking-wide transition-all border cursor-pointer ${
              currentRole === 'profesor'
                ? 'bg-[#05472A] text-white border-[#2ECC71]/40 shadow-md font-bold'
                : 'bg-transparent text-zinc-400 border-transparent hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Dumbbell className="h-3.5 w-3.5 text-[#2ECC71]" />
            Profesor / DT
          </button>

          {/* Jugador Toggle */}
          <button
            id="role-btn-jugador"
            onClick={() => onChangeRole('jugador')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-sans text-xs font-semibold tracking-wide transition-all border cursor-pointer ${
              currentRole === 'jugador'
                ? 'bg-[#05472A] text-white border-[#2ECC71]/40 shadow-md font-bold'
                : 'bg-transparent text-zinc-400 border-transparent hover:text-white hover:bg-zinc-800'
            }`}
          >
            <UserCheck className="h-3.5 w-3.5 text-[#2ECC71]" />
            Jugador
          </button>
        </div>

        {/* Dynamic Selector Dropdowns depending on current active role */}
        <div className="flex items-center gap-2 bg-zinc-900/40 px-3 py-2 rounded-xl border border-zinc-800 md:border-0 md:bg-transparent md:px-0 md:py-0 self-stretch sm:self-auto justify-between sm:justify-start">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
            <RefreshCw className="h-3 w-3 animate-spin duration-3000 text-[#2ECC71]" />
            <span>Ver como:</span>
          </div>

          {currentRole === 'admin' && (
            <span className="rounded-lg bg-emerald-950/30 border border-emerald-800 px-3 py-1.5 font-mono text-[10px] text-[#2ECC71] font-bold uppercase tracking-widest shadow-inner">
              Comisión de Control General
            </span>
          )}

          {currentRole === 'manager' && (
            <select
              id="manager-select-list"
              value={selectedManagerId}
              onChange={(e) => onChangeManager(e.target.value)}
              className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 font-sans text-xs text-zinc-100 hover:bg-zinc-900 hover:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-[#2ECC71]/50 cursor-pointer max-w-[240px] truncate"
            >
              {managers.map((m) => (
                <option key={m.id} value={m.id}>
                  Manager: {m.nombre} {m.apellido} ({m.categorias.join(', ')})
                </option>
              ))}
            </select>
          )}

          {currentRole === 'profesor' && (
            <select
              id="professor-select-list"
              value={selectedProfessorId}
              onChange={(e) => onChangeProfessor(e.target.value)}
              className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 font-sans text-xs text-zinc-100 hover:bg-zinc-900 hover:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-[#2ECC71]/50 cursor-pointer max-w-[240px] truncate"
            >
              {professors.map((p) => (
                <option key={p.id} value={p.id}>
                  Prof: {p.nombre} {p.apellido} ({p.categorias.join(', ')})
                </option>
              ))}
            </select>
          )}

          {currentRole === 'jugador' && (
            <select
              id="player-select-list"
              value={selectedPlayerId}
              onChange={(e) => onChangePlayer(e.target.value)}
              className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 font-sans text-xs text-zinc-100 hover:bg-zinc-900 hover:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-[#2ECC71]/50 cursor-pointer max-w-[240px] truncate"
            >
              {players.map((p) => (
                <option key={p.id} value={p.id}>
                  Jugador: {p.nombre} {p.apellido} ({p.categoria})
                </option>
              ))}
            </select>
          )}
        </div>

      </div>
    </div>
  );
}
