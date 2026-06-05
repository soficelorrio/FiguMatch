import { UserProfile, Album } from '../types';
import { INITIAL_ALBUMS } from '../data';
import { Star, Award, ShieldCheck, RefreshCw, Settings, ShieldAlert, ChevronRight, UserMinus } from 'lucide-react';

interface ProfileViewScreenProps {
  userProfile: UserProfile;
  onOpenAlbumSelector: () => void;
  onOpenSecurityCenter: () => void;
  onLogout: () => void;
}

export default function ProfileViewScreen({
  userProfile,
  onOpenAlbumSelector,
  onOpenSecurityCenter,
  onLogout
}: ProfileViewScreenProps) {
  const currentAlbum = INITIAL_ALBUMS.find((a) => a.id === userProfile.activeAlbumId) || {
    name: 'Álbum Desconocido / Alternativo',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=200'
  };

  return (
    <div className="space-y-4 px-2 pb-16 font-sans">
      
      {/* Settings Row */}
      <div className="flex justify-between items-center pb-2 border-b border-gray-50">
        <h2 className="text-xl font-black text-gray-950 font-display">Mi Perfil</h2>
        <div className="flex gap-2">
          <button
            onClick={onOpenSecurityCenter}
            className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition flex items-center justify-center"
            title="Centro de Seguridad"
          >
            <ShieldAlert size={16} />
          </button>
          <button
            onClick={onLogout}
            className="p-1.5 text-xs text-red-500 font-bold bg-red-50 hover:bg-red-100 rounded-xl transition"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Main Stats Header Card */}
      <div className="bg-white border border-gray-100 p-5 rounded-3xl shadow-2xs text-center space-y-4 relative overflow-hidden">
        
        {/* Background accent */}
        <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-r from-indigo-50 to-indigo-100/30"></div>

        <div className="relative pt-3 flex flex-col items-center">
          {/* Avatar frame */}
          <div className="text-6xl p-4 bg-white rounded-full border-2 border-indigo-600 w-20 h-20 shadow-md flex items-center justify-center">
            {userProfile.avatar}
          </div>

          <div className="flex items-center gap-1.5 mt-3">
            <h3 className="text-lg font-black text-slate-900">{userProfile.name}</h3>
            {userProfile.userType === 'coleccionista' && (
              <span className="bg-indigo-50 text-indigo-600 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Coleccionista
              </span>
            )}
          </div>

          <p className="text-[11px] text-gray-400 font-medium">Barrio: {userProfile.neighborhood}</p>

          {/* Supervisor tag */}
          {userProfile.minorModeActive && (
            <div className="bg-emerald-50 text-emerald-800 text-[10.5px] py-1 px-3.5 rounded-full font-black border border-emerald-200 mt-2 flex items-center gap-1 uppercase tracking-wider shadow-3xs hover:bg-emerald-100 transition">
              🛡️ Cuenta Supervisada
            </div>
          )}

          {/* Rating counter bar */}
          <div className="grid grid-cols-2 gap-4 w-full mt-5 pt-4 border-t border-gray-50 text-center">
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Reputación ★</p>
              <p className="text-lg font-black text-slate-900 flex items-center justify-center gap-0.5 mt-0.5">
                <Star className="fill-amber-400 stroke-amber-500" size={16} />
                <span>{userProfile.avgRating}</span>
              </p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Total Canjes</p>
              <p className="text-lg font-black text-slate-900 mt-0.5">{userProfile.exchangesCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modo Menor Acompañado Supervisor Card */}
      {userProfile.minorModeActive && (
        <div className="bg-white border-2 border-indigo-100 rounded-3xl p-5 shadow-3xs space-y-3.5 relative overflow-hidden animate-fadeIn">
          <div className="absolute top-0 right-0 p-2 text-indigo-500 opacity-20">
            <ShieldAlert size={48} />
          </div>
          
          <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2.5">
            <span className="text-base">🛡️</span>
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest leading-none">
              Modo Menor Acompañado: Activo
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-3 text-left">
            <div>
              <span className="block text-[9px] font-black uppercase text-slate-400 tracking-wider">Menor a cargo</span>
              <p className="text-xs font-bold text-slate-800 mt-0.5">{userProfile.name}</p>
            </div>
            <div>
              <span className="block text-[9px] font-black uppercase text-slate-400 tracking-wider">Zona aproximada</span>
              <p className="text-xs font-bold text-slate-800 mt-0.5">{userProfile.neighborhood}</p>
            </div>
            <div>
              <span className="block text-[9px] font-black uppercase text-slate-400 tracking-wider">Adulto Responsable</span>
              <p className="text-xs font-bold text-slate-800 mt-0.5">{userProfile.adultName || 'Mariana'}</p>
            </div>
            <div>
              <span className="block text-[9px] font-black uppercase text-slate-400 tracking-wider">Parentesco / Relación</span>
              <p className="text-xs font-bold text-slate-800 mt-0.5">{userProfile.adultRelation || 'Madre'}</p>
            </div>
          </div>

          <div className="bg-emerald-50/50 p-2.5 rounded-2xl border border-emerald-100/50 text-left text-[11px] text-emerald-950 font-bold flex flex-col gap-1">
            <p className="flex items-center gap-1.5 text-emerald-800 text-[10px] uppercase tracking-wider font-extrabold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Preferencia de Seguridad
            </p>
            <p className="font-semibold text-emerald-700">
              {userProfile.onlySafePointsActive ? 'Solo se permiten intercambios en puntos recomendados y seguros.' : 'Acompañamiento y encuentros seguros sugeridos.'}
            </p>
          </div>

          {/* Privacy and Hidden sensitive data block */}
          <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100 text-left text-[10px] leading-relaxed text-slate-500 font-semibold space-y-1">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">🔒 Privacidad activa del menor:</span>
            <p className="flex items-center gap-1">🔴 Dirección exacta: <span className="bg-slate-200 text-slate-600 px-1 py-0.2 rounded font-mono text-[9px]">OCULTA por seguridad</span></p>
            <p className="flex items-center gap-1">🔴 Teléfono: <span className="bg-slate-200 text-slate-600 px-1 py-0.2 rounded font-mono text-[9px]">OCULTO por seguridad</span></p>
            <p className="flex items-center gap-1">🔴 Correo electrónico: <span className="bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-mono text-[8px] truncate">{userProfile.email.replace(/(.{2}).+(@.+)/, "$1***$2")} (REGISTRADO)</span></p>
            <p className="flex items-center gap-1">🔴 Ubicación en vivo (GPS): <span className="bg-slate-200 text-slate-600 px-1 py-0.2 rounded font-mono text-[9px]">DESACTIVADA</span></p>
          </div>
        </div>
      )}

      {/* Badges list */}
      <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-2xs space-y-3">
        <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest pl-0.5 flex items-center gap-1.5">
          <Award size={14} className="text-indigo-600" /> Mis Insignias Unlocked ({userProfile.badges.length})
        </h4>

        <div className="grid grid-cols-1 gap-2">
          {userProfile.badges.map((badge) => (
            <div
              key={badge}
              className="flex items-center gap-2.5 p-2 px-3 bg-gray-50 border border-gray-100/50 rounded-xl"
            >
              <span className="text-xl">🏅</span>
              <div>
                <p className="text-xs font-bold text-gray-800 leading-none">{badge}</p>
                <p className="text-[9px] text-gray-450 mt-0.5 font-light">Otorgado por la comunidad tras excelentes intercambios.</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Album settings */}
      <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-2xs space-y-3">
        <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest pl-0.5">Álbum en Curso</h4>

        <div className="flex items-center gap-3 p-3 bg-indigo-50/20 rounded-2xl border border-indigo-100/30">
          <div
            className="w-12 h-14 rounded-lg bg-cover bg-center flex-shrink-0"
            style={{ backgroundImage: `url(${currentAlbum.imageUrl})` }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-slate-900 truncate leading-tight">{currentAlbum.name}</p>
            <p className="text-[9px] text-indigo-500 font-bold mt-0.5 uppercase tracking-wider">Completa tus faltantes cerca</p>
          </div>
          <button
            onClick={onOpenAlbumSelector}
            className="p-2 text-indigo-600 bg-white border border-indigo-100 rounded-xl hover:bg-indigo-50 transition"
            title="Cambiar Álbum"
          >
            <RefreshCw size={14} className="stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Settings Direct triggers */}
      <div className="bg-white border border-gray-100 rounded-3xl p-3 shadow-2xs space-y-1.5">
        <button
          onClick={onOpenSecurityCenter}
          className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 text-left transition"
        >
          <div>
            <p className="text-xs font-bold text-gray-800">Centro de Seguridad & Puntos de Interés</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Normas del canje, ver bloqueos y asambleas seguras.</p>
          </div>
          <ChevronRight size={14} className="text-gray-400" />
        </button>
      </div>

    </div>
  );
}
