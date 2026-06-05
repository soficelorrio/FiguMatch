import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, User, ArrowLeft, KeyRound, Sparkles } from 'lucide-react';

interface AuthScreenProps {
  initialMode: 'login' | 'register';
  onBack: () => void;
  onSubmit: (data: { name: string; email: string; isNewUser: boolean }) => void;
}

export default function AuthScreen({ initialMode, onBack, onSubmit }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [name, setName] = useState('Sofi');
  const [email, setEmail] = useState('sofi.figumatch@gmail.com');
  const [password, setPassword] = useState('********');
  const [error, setError] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Por favor, ingresá un mail simulado.');
      return;
    }
    if (!isLogin && !name) {
      setError('Por favor, ingresá un apodo o nombre.');
      return;
    }
    setError('');
    onSubmit({
      name: isLogin ? (email.split('@')[0]) || 'Sofi' : name,
      email,
      isNewUser: !isLogin,
    });
  };

  return (
    <div className="px-6 py-6 min-h-[75vh] flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="p-2 text-gray-500 hover:text-gray-700 bg-gray-50 rounded-xl transition"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex items-center gap-1">
          <span className="font-display font-extrabold text-lg text-slate-800">FiguMatch</span>
        </div>
        <div className="w-8"></div> {/* Spacer balance */}
      </div>

      {/* Main Content Card */}
      <div className="flex-1 max-w-sm mx-auto w-full">
        <div className="text-left mb-6">
          <h2 className="text-2xl font-black text-gray-900 font-display">
            {isLogin ? '¡Hola de nuevo!' : 'Creá tu Cuenta'}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {isLogin 
              ? 'Ingresá tus credenciales simuladas para continuar juntando.' 
              : 'Registrate para cargar tu álbum y encontrar matches en tu zona.'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
                Tu Apodo o Nombre
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Sofi_92"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-11 pr-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-gray-700"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
              Correo Electrónico
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail size={16} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@ejemplo.com"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-11 pr-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-gray-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
              Contraseña Simulada
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <KeyRound size={16} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-11 pr-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-gray-700"
              />
            </div>
          </div>

          {isLogin ? (
            <div className="text-right">
              <button type="button" className="text-[11px] text-indigo-500 font-semibold hover:underline bg-transparent border-0 p-0 cursor-pointer">
                ¿Olvidaste tu contraseña? (Simulado)
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 py-1">
              <input 
                type="checkbox" 
                id="check-terms" 
                defaultChecked 
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
              />
              <label htmlFor="check-terms" className="text-[10px] text-gray-400 leading-normal">
                Acepto los lineamientos de encuentro seguro en vía pública.
              </label>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-indigo-100 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-xs tracking-wider uppercase mt-4"
          >
            {isLogin ? 'Ingresar' : 'Crear mi Cuenta'}
          </button>
        </form>
      </div>

      {/* Switch mode */}
      <div className="mt-8 text-center pt-4 border-t border-gray-50">
        <p className="text-xs text-gray-400">
          {isLogin ? '¿No tenés una cuenta?' : '¿Ya formás parte de la comunidad?'}
        </p>
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-indigo-600 font-bold text-xs mt-1 bg-transparent border-0 py-1 px-4 cursor-pointer hover:underline"
        >
          {isLogin ? 'Registrate gratis' : 'Iniciá sesión acá'}
        </button>
      </div>
    </div>
  );
}
