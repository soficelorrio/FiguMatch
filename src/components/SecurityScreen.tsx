import { SafePoint } from '../types';
import { SUGGESTED_SAFE_POINTS } from '../data';
import { ArrowLeft, ShieldAlert, MapPin, Eye, ThumbsUp, Heart, CheckCircle2 } from 'lucide-react';

interface SecurityScreenProps {
  onBack: () => void;
  isSupervised: boolean;
  onToggleSupervision: (val: boolean) => void;
  blockedUsersCount: number;
  reportedUsersCount: number;
}

export default function SecurityScreen({
  onBack,
  isSupervised,
  onToggleSupervision,
  blockedUsersCount,
  reportedUsersCount
}: SecurityScreenProps) {
  return (
    <div className="space-y-4 px-2 pb-16 font-sans">
      
      {/* Header */}
      <div className="flex items-center gap-3 pb-2 border-b border-gray-50">
        <button
          onClick={onBack}
          className="p-2 text-gray-500 hover:text-gray-700 bg-gray-50 rounded-xl transition"
        >
          <ArrowLeft size={18} />
        </button>
        <h2 className="text-sm font-black text-slate-800">Centro de Seguridad & Privacidad</h2>
      </div>

      {/* Main warning container */}
      <div className="bg-gradient-to-tr from-amber-500 to-yellow-500 text-slate-950 p-5 rounded-3xl shadow-sm space-y-2 relative overflow-hidden">
        <div className="absolute -top-6 -right-6 h-20 w-20 bg-white/20 rounded-full blur-md"></div>
        <div className="flex items-start gap-2.5">
          <ShieldAlert size={28} className="text-slate-950 stroke-[2.25] flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-sm font-extrabold font-display">Consejos de Encuentro Seguro</h3>
            <p className="text-[11px] font-medium leading-relaxed opacity-95">
              “Encontrá las figuritas que te faltan cerca de tu zona, pero siempre tomando los debidos resguardos para resguardar tu privacidad.”
            </p>
          </div>
        </div>
      </div>

      {/* Parental supervise control */}
      <div className="bg-white border border-gray-100 p-4 rounded-3xl shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-black text-slate-900">Menores de Edad / Supervisión</h4>
            <p className="text-[10px] text-gray-400 mt-0.5">Alertas continuas de acompañamiento de tutores.</p>
          </div>
          <input
            type="checkbox"
            checked={isSupervised}
            onChange={(e) => onToggleSupervision(e.target.checked)}
            className="rounded border-amber-300 text-indigo-600 focus:ring-indigo-500 h-4.5 w-4.5 cursor-pointer accent-indigo-600"
          />
        </div>
        
        {isSupervised && (
          <p className="text-[10px] text-amber-700 font-bold bg-amber-50 p-2.5 rounded-xl border border-amber-100">
            ⚠️ Recordatorio activado: Si sos menor de edad, acordá tus trueques de repetidas acompañado de un adulto o familiar. No brindes teléfonos personales.
          </p>
        )}
      </div>

      {/* Approved Meeting Points Lists */}
      <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-2xs space-y-3">
        <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest pl-0.5 flex items-center gap-1.5ClassName">
          📍 Puntos Sugeridos de Intercambio Cercanos ({SUGGESTED_SAFE_POINTS.length})
        </h4>
        <p className="text-[10px] text-gray-400 leading-normal pl-0.5">
          Locales comerciales, clubes deportivos y cafeterías que funcionan como bases recomendadas para coleccionistas:
        </p>

        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {SUGGESTED_SAFE_POINTS.map((sp) => (
            <div
              key={sp.id}
              className="p-3 bg-slate-50 rounded-2xl border border-slate-100/50 space-y-1.5"
            >
              <div className="flex justify-between items-start">
                <p className="text-xs font-bold text-gray-800 leading-tight">
                  🏪 {sp.name}
                </p>
                <span className="text-[9px] bg-indigo-50 text-indigo-600 font-black px-1.5 py-0.5 rounded-md">
                  {sp.distance}
                </span>
              </div>
              <p className="text-[10px] text-gray-400 leading-tight">Dirección: {sp.address}</p>
              <div className="flex items-center justify-between text-[9px] text-gray-400 border-t border-gray-200/40 pt-1.5">
                <span>Calidad: {sp.rating} ★</span>
                <span className="font-light">{sp.hours}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy settings and safe disclosures */}
      <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-2xs space-y-3 text-[11px] text-gray-500 leading-normal">
        <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest leading-none">
          🔒 Tu Privacidad es Prioridad
        </h4>
        <p className="pl-0.5">
          - <strong>Ubicación Aproximada:</strong> La app solo calcula la distancia radial (por ejemplo: "a 1.2 km de distancia") y tu zona aproximada ("Palermo"), protegiendo tu domicilio de miradas extrañas.
        </p>
        <p className="pl-0.5">
          - <strong>Chat Integrado:</strong> Mantené todas tus conversaciones de canje dentro de FiguMatch. Nunca reveles tu dirección de mail, teléfono o cuenta de redes.
        </p>
      </div>

      {/* User metrics blocklists */}
      <div className="grid grid-cols-2 gap-3 pb-2">
        <div className="bg-slate-50 border border-gray-100 p-3.5 rounded-2xl text-center">
          <p className="text-[9px] font-bold uppercase text-gray-455">Usuarios Bloqueados</p>
          <p className="text-base font-black text-gray-800 mt-1">{blockedUsersCount}</p>
        </div>
        <div className="bg-slate-50 border border-gray-100 p-3.5 rounded-2xl text-center">
          <p className="text-[9px] font-bold uppercase text-gray-455">Reportados por Seguridad</p>
          <p className="text-base font-black text-gray-800 mt-1">{reportedUsersCount}</p>
        </div>
      </div>

    </div>
  );
}
