import React, { useState } from 'react';
import { Shield, Key, Mail, Lock, CheckCircle, HelpCircle, Users } from 'lucide-react';
import { Manager, Professor, Player, UserRole } from '../types';

interface LoginScreenProps {
  onLoginSuccess: (role: UserRole, id?: string) => void;
  managers: Manager[];
  professors: Professor[];
  players: Player[];
}

export default function LoginScreen({ onLoginSuccess, managers, professors, players }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Simulate network delay for frontend feel
    setTimeout(() => {
      setIsSubmitting(false);
      const cleanEmail = email.trim().toLowerCase();

      if (!cleanEmail) {
        setError('Por favor, ingrese un correo electrónico o usuario.');
        return;
      }

      // Check for Admin
      if (cleanEmail === 'admin' || cleanEmail === 'admin@rugbyclub.com') {
        onLoginSuccess('admin');
        return;
      }

      // Check if it's a Manager
      const foundManager = managers.find(m => m.correo.toLowerCase() === cleanEmail);
      if (foundManager) {
        onLoginSuccess('manager', foundManager.id);
        return;
      }

      // Check if it's a Professor
      const foundProf = professors.find(p => p.correo.toLowerCase() === cleanEmail);
      if (foundProf) {
        onLoginSuccess('profesor', foundProf.id);
        return;
      }

      // Check if it's a Player
      const foundPlayer = players.find(p => p.correo.toLowerCase() === cleanEmail);
      if (foundPlayer) {
        onLoginSuccess('jugador', foundPlayer.id);
        return;
      }

      // Fallback: If they typed anything else, we can let them log in as Admin for demo friendliness,
      // but let's notify them or let it pass with a nice feedback.
      onLoginSuccess('admin');
    }, 600);
  };

  const handleQuickLogin = (role: UserRole, id?: string) => {
    setError(null);
    onLoginSuccess(role, id);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center p-4 font-sans text-zinc-100">
      {/* Container card */}
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-2xl space-y-6">
        
        {/* Header / Logo banner */}
        <div className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 rounded-xl bg-[#05472A] border border-[#2ECC71]/30 flex items-center justify-center text-[#2ECC71]">
            <Shield className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase">
              Club Guaycurúes
            </h1>
            <p className="text-xs text-[#2ECC71] font-bold tracking-widest uppercase">
              Sunchales • Portal de Gestión
            </p>
          </div>
        </div>

        {/* Info banner */}
        <div className="bg-zinc-950 border border-zinc-850 rounded-xl p-3 text-xs text-zinc-400 space-y-1">
          <p className="font-bold text-zinc-300">💡 Acceso de Demostración:</p>
          <p>Puede ingresar con cualquier correo oficial del club o usar los accesos directos de abajo.</p>
        </div>

        {/* Main form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-rose-950/40 border border-rose-900 text-rose-300 text-xs rounded-lg font-medium">
              {error}
            </div>
          )}

          {/* Email input */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              Correo Electrónico / No. Ficha
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                placeholder="ejemplo@rugbyclub.com o 'admin'"
                className="w-full h-11 pl-10 pr-3 rounded-lg bg-zinc-950 border border-zinc-800 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#2ECC71] focus:ring-1 focus:ring-[#2ECC71] transition"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                Contraseña
              </label>
              <span className="text-[10px] text-[#2ECC71] hover:underline cursor-pointer">
                ¿Olvidó su contraseña?
              </span>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 pl-10 pr-3 rounded-lg bg-zinc-950 border border-zinc-800 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#2ECC71] focus:ring-1 focus:ring-[#2ECC71] transition"
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 rounded-lg bg-[#05472A] border border-[#2ECC71]/40 text-[#2ECC71] hover:bg-[#2ECC71]/10 text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span className="h-4 w-4 border-2 border-[#2ECC71] border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <Key className="h-4 w-4" />
                <span>Ingresar al Sistema</span>
              </>
            )}
          </button>
        </form>

        {/* Separator */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-zinc-800"></div>
          <span className="flex-shrink mx-4 text-zinc-500 text-[10px] uppercase font-bold tracking-widest">
            Accesos Rápidos
          </span>
          <div className="flex-grow border-t border-zinc-800"></div>
        </div>

        {/* Quick Role buttons */}
        <div className="grid grid-cols-2 gap-2 text-center">
          {/* Admin */}
          <button
            type="button"
            onClick={() => handleQuickLogin('admin')}
            className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-blue-500 hover:bg-zinc-900/50 transition cursor-pointer text-left space-y-1"
          >
            <span className="block text-[10px] text-zinc-500 uppercase font-black">Súper Usuario</span>
            <span className="block text-xs font-bold text-white">Administrador</span>
          </button>

          {/* Manager */}
          <button
            type="button"
            onClick={() => handleQuickLogin('manager', 'm1')}
            className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-emerald-500 hover:bg-zinc-900/50 transition cursor-pointer text-left space-y-1"
          >
            <span className="block text-[10px] text-zinc-500 uppercase font-black">Manager</span>
            <span className="block text-xs font-bold text-white">G. Quesada (U19/PS)</span>
          </button>

          {/* Professor */}
          <button
            type="button"
            onClick={() => handleQuickLogin('profesor', 'p1')}
            className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-amber-500 hover:bg-zinc-900/50 transition cursor-pointer text-left space-y-1"
          >
            <span className="block text-[10px] text-zinc-500 uppercase font-black">Entrenador / PF</span>
            <span className="block text-xs font-bold text-white">M. Ledesma</span>
          </button>

          {/* Player */}
          <button
            type="button"
            onClick={() => handleQuickLogin('jugador', 'j1')}
            className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-purple-500 hover:bg-zinc-900/50 transition cursor-pointer text-left space-y-1"
          >
            <span className="block text-[10px] text-zinc-500 uppercase font-black">Atleta</span>
            <span className="block text-xs font-bold text-white">E. Boffelli</span>
          </button>
        </div>

        {/* Footer info */}
        <div className="text-center pt-2">
          <p className="text-[10px] text-zinc-500 font-sans uppercase">
            Unión Santafesina de Rugby • Ciclo 2026
          </p>
          <div className="mt-2 text-[9px] text-[#2ECC71]/70 font-mono uppercase bg-[#2ECC71]/5 border border-[#2ECC71]/10 rounded py-1 px-2 inline-block">
            Django & REST API Integrable Ready
          </div>
        </div>

      </div>
    </div>
  );
}
