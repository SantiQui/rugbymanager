import { useState } from 'react';
import { loginUser } from '../services/api';

// Modificamos la prop para que pueda enviar el rol hacia arriba
export default function LoginScreen({ onLoginSuccess }: { onLoginSuccess?: (role: string) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setError('');
    setIsLoading(true);

    try {
      // Cambio clave: usamos loginUser y le pasamos el objeto con las credenciales
      const result = await loginUser({ username, password });
      
      if (result.success) {
        // Le pasamos el rol que devolvió el backend a la función padre
        if (onLoginSuccess) {
          onLoginSuccess(result.role); 
        }
      } else {
        // Si el backend dice success: false, mostramos el mensaje de error de Django
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
          <h1 className="text-2xl font-bold text-white tracking-wider">CLUB GUAYCURÚES</h1>
          <p className="text-emerald-500 text-sm tracking-widest mt-1">SUNCHALES • PORTAL DE GESTIÓN</p>
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
              <button type="button" className="text-emerald-500 text-xs hover:text-emerald-400">
                ¿Olvidó su contraseña?
              </button>
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
          <p className="text-gray-500 text-xs tracking-widest">UNIÓN SANTAFESINA DE RUGBY • CICLO 2026</p>
          <span className="inline-block border border-emerald-900 text-emerald-700 text-[10px] px-2 py-1 rounded mt-2">
            DJANGO & REST API INTEGRABLE READY
          </span>
        </div>
      </div>
    </div>
  );
}