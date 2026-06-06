import { useState } from 'react';
import { loginUser } from '../services/api';

// 1. Agregamos "userDoc: string" acá arriba para que el componente sepa que tiene que enviarlo
export default function LoginScreen({ onLoginSuccess }: { onLoginSuccess?: (role: string, userDoc: string) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setError('');
    setIsLoading(true);

    try {
      const result = await loginUser({ username, password });
      
      if (result.success) {
        if (onLoginSuccess) {
          // 2. Le pasamos el "username" (que es el DNI) como segundo dato a tu App.tsx
          onLoginSuccess(result.role, username); 
        }
      } else {
        setError(result.message || 'Usuario o contraseña incorrectos.');
      }
    } catch (err) {
      setError('Error al conectar con el servidor. Por favor, intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl max-w-md w-full border border-gray-700">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white tracking-wider">PORTAL DE GESTIÓN</h1>
          <p className="text-emerald-500 text-sm tracking-widest mt-1">GUAYCURUES RUGBY SUNCHALES</p>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded-lg text-sm mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-400 text-xs font-bold tracking-wider mb-2">
              DNI
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-gray-400 text-xs font-bold tracking-wider">CONTRASEÑA</label>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? 'VERIFICANDO...' : 'INGRESAR AL SISTEMA'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-xs tracking-widest">UNIÓN SANTAFESINA DE RUGBY</p>
        </div>
      </div>
    </div>
  );
}