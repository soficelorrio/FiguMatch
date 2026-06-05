import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Shield, RefreshCw } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: (mode: 'login' | 'register') => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-between min-h-[80vh] px-6 py-8 bg-gradient-to-b from-indigo-50/50 via-white to-white text-center">
      
      {/* Brand Icon & Heading */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center mt-6"
      >
        <div className="relative mb-4">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-violet-500 rounded-2xl blur-sm opacity-30 animate-pulse"></div>
          <div className="relative bg-gradient-to-tr from-indigo-600 to-violet-500 text-white p-4 rounded-2xl shadow-xl flex items-center justify-center">
            <RefreshCw size={44} className="animate-spin-slow stroke-[2.5]" />
          </div>
          <div className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-slate-900 p-1 rounded-full shadow-md text-xs font-bold flex items-center justify-center">
            <Sparkles size={12} className="fill-slate-900" />
          </div>
        </div>
        
        <h1 className="text-4xl font-black tracking-tight text-gray-900 font-display">
          Figu<span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Match</span>
        </h1>
        <p className="text-xs font-medium text-indigo-500 uppercase tracking-widest mt-1">Conectando Coleccionistas</p>
      </motion.div>

      {/* Main Slogan & Value Prop Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.6 }}
        className="my-8 max-w-sm bg-white border border-gray-100 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)]"
      >
        <p className="text-base text-gray-700 leading-relaxed font-sans font-medium">
          “Encontrá las figuritas que te faltan cerca tuyo y cambiá tus repetidas de forma simple, rápida y segura.”
        </p>

        <div className="mt-6 space-y-4 text-left border-t border-gray-50 pt-5">
          <div className="flex items-start gap-3">
            <div className="bg-green-50 p-2 rounded-xl text-green-600 mt-1">
              <Sparkles size={16} />
            </div>
            <div>
              <p className="font-semibold text-xs text-gray-900">Matches directos</p>
              <p className="text-[11px] text-gray-400">Te juntamos solo con quienes tienen lo que necesitás.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-blue-50 p-2 rounded-xl text-blue-600 mt-1">
              <Shield size={16} />
            </div>
            <div>
              <p className="font-semibold text-xs text-gray-900">Puntos seguros de encuentro</p>
              <p className="text-[11px] text-gray-400">Coordiná en Kioscos adheridos o clubes del barrio.</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Primary Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.6 }}
        className="w-full max-w-xs space-y-3"
      >
        <button
          id="btn-empezar"
          onClick={() => onStart('register')}
          className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
        >
          <span>Empezar ahora</span>
          <ArrowRight size={18} />
        </button>

        <button
          id="btn-tengo-cuenta"
          onClick={() => onStart('login')}
          className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold py-3 px-6 rounded-2xl transition-all"
        >
          Ya tengo cuenta
        </button>

        <p className="text-[10px] text-gray-400 mt-4 leading-normal">
          Uso libre y autogestionado. <br />
          Sugerimos siempre supervisión adulta para menores.
        </p>
      </motion.div>
    </div>
  );
}
