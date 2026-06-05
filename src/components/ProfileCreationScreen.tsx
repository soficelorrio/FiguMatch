import { useState } from 'react';
import { UserProfile, UserType } from '../types';
import { ArrowRight, MapPin, Sparkles, Shield, Eye } from 'lucide-react';

interface ProfileCreationScreenProps {
  initialName: string;
  initialEmail: string;
  onProfileCreated: (profile: UserProfile) => void;
}

const AVATARS = ['👧', '👦', '👩', '🧑', '👨', '👩‍🦰', '👱‍♂️', '🦁', '🦉', '🦊', '⚽', '🎒'];

const NEIGHBORHOODS = [
  'Palermo',
  'Belgrano',
  'Recoleta',
  'Caballito',
  'Villa Urquiza',
  'Almagro',
  'Colegiales',
  'San Telmo'
];

export default function ProfileCreationScreen({
  initialName,
  initialEmail,
  onProfileCreated
}: ProfileCreationScreenProps) {
  const [name, setName] = useState(initialName || 'Sofi');
  const [selectedAvatar, setSelectedAvatar] = useState('👧');
  const [neighborhood, setNeighborhood] = useState('Palermo');
  const [userType, setUserType] = useState<UserType>('coleccionista');
  const [minorModeActive, setMinorModeActive] = useState(true);
  const [adultName, setAdultName] = useState('Mariana');
  const [adultRelation, setAdultRelation] = useState('Madre');
  const [adultConfirmedAcc, setAdultConfirmedAcc] = useState(true);
  const [onlySafePointsActive, setOnlySafePointsActive] = useState(true);

  const handleNext = () => {
    if (!name.trim()) return;

    const badges = ['Nuevo ingresante'];
    if (userType === 'padre_madre') {
      badges.push('Padre Colaborador');
    }
    if (minorModeActive) {
      badges.push('Cuenta Supervisada');
    }

    const newProfile: UserProfile = {
      id: 'custom_user_id_' + Date.now(),
      name: name.trim(),
      email: initialEmail,
      avatar: selectedAvatar,
      neighborhood,
      userType,
      isSupervised: minorModeActive,
      avgRating: 5.0, // starts flat
      exchangesCount: 0,
      badges,
      activeAlbumId: 'mundial_2026', // defaults to Panini Mundial 2026
      blockedUsers: [],
      reportedUsers: [],
      
      // Modo Menor Acompañado:
      minorModeActive,
      adultName: minorModeActive ? adultName.trim() : undefined,
      adultRelation: minorModeActive ? adultRelation : undefined,
      adultConfirmedAcc: minorModeActive ? adultConfirmedAcc : undefined,
      onlySafePointsActive: minorModeActive ? onlySafePointsActive : undefined
    };

    onProfileCreated(newProfile);
  };

  return (
    <div className="px-6 py-6 max-w-sm mx-auto w-full space-y-6">
      <div className="text-left">
        <h2 className="text-2xl font-black text-gray-900 font-display flex items-center gap-2">
          Personalizá tu Perfil <Sparkles size={20} className="text-yellow-500 fill-yellow-500" />
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Completá tus datos para empezar a hacer canjes inteligentes en tu barrio.
        </p>
      </div>

      {/* Avatar Picker */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
          Elegí tu Avatar o Emoji
        </label>
        <div className="flex flex-col items-center p-3 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="text-5xl p-4 bg-white rounded-full shadow-md border border-gray-100 mb-3 w-16 h-16 flex items-center justify-center">
            {selectedAvatar}
          </div>
          <div className="grid grid-cols-6 gap-2 w-full max-h-24 overflow-y-auto">
            {AVATARS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => setSelectedAvatar(emoji)}
                className={`text-xl p-1.5 rounded-lg border-2 transition ${
                  selectedAvatar === emoji
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-transparent hover:bg-gray-100'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Nickname */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
          Nombre o Apodo de Coleccionista
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Sofi_Arg"
          className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-gray-700"
        />
      </div>

      {/* Neighborhood selector */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
          <MapPin size={14} className="text-red-500" /> Zona o Barrio (Aproximado)
        </label>
        <select
          value={neighborhood}
          onChange={(e) => setNeighborhood(e.target.value)}
          className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-gray-700"
        >
          {NEIGHBORHOODS.map((zone) => (
            <option key={zone} value={zone}>
              {zone}
            </option>
          ))}
        </select>
        <p className="text-[10px] text-gray-400 pl-1">
          🔒 Nunca mostraremos tu dirección exacta ni mapa en vivo por motivos de seguridad.
        </p>
      </div>

      {/* Type selection */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
          ¿Qué tipo de usuario sos?
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'coleccionista', label: 'Coleccionista', desc: 'Canjes personales' },
            { id: 'padre_madre', label: 'Padre / Madre', desc: 'Ayudo a mis hijos' },
            { id: 'kiosco', label: 'Kiosco', desc: 'Punto de encuentro' },
            { id: 'club', label: 'Club / Colegio', desc: 'Lugar comunitario' }
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => {
                setUserType(type.id as UserType);
                if (type.id === 'kiosco' || type.id === 'club') {
                  setMinorModeActive(false);
                }
              }}
              className={`p-3 text-left rounded-2xl border-2 transition duration-200 ${
                userType === type.id
                  ? 'border-indigo-600 bg-indigo-50/50'
                  : 'border-gray-100 bg-gray-50 hover:bg-slate-100'
              }`}
            >
              <p className="text-xs font-bold text-gray-800">{type.label}</p>
              <p className="text-[9px] text-gray-400 mt-0.5 leading-tight">{type.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Modo Menor Acompañado Setup Block */}
      <div className="bg-slate-50 border border-slate-100 p-4 rounded-3xl space-y-4">
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Shield size={15} className="text-indigo-600" />
            ¿Esta cuenta será usada por un menor de edad?
          </label>
          <p className="text-[10px] text-slate-400 leading-normal">
            Buscamos proteger a los chicos y adolescentes que intercambian figuritas en sus barrios.
          </p>
        </div>

        {/* Buttons for Options */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            id="btn-minor-mode-yes"
            onClick={() => setMinorModeActive(true)}
            className={`py-3 px-3 rounded-xl text-left border-2 transition text-xs font-bold ${
              minorModeActive
                ? 'border-indigo-600 bg-indigo-50/60 text-indigo-900'
                : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-100'
            }`}
          >
            <span className="block text-sm mb-0.5">👦 Yes</span>
            Sí, activar Modo Menor Acompañado
          </button>
          <button
            type="button"
            id="btn-minor-mode-no"
            onClick={() => setMinorModeActive(false)}
            className={`py-3 px-3 rounded-xl text-left border-2 transition text-xs font-bold ${
              !minorModeActive
                ? 'border-slate-800 bg-slate-900 text-white'
                : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-100'
            }`}
          >
            <span className="block text-sm mb-0.5">👤 No</span>
            No, continuar como cuenta normal
          </button>
        </div>

        {/* Display when minor mode active */}
        {minorModeActive && (
          <div className="space-y-3.5 pt-3.5 border-t border-dashed border-slate-200 animate-fadeIn">
            {/* Advice message in requirements */}
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl text-[10.5px] text-amber-900 font-semibold leading-relaxed">
              ⚠️ <strong>Mensaje de seguridad:</strong> Para mayor seguridad, los intercambios deberán coordinarse con acompañamiento de un adulto responsable y preferentemente en puntos seguros.
            </div>

            {/* Adult Responsible fields */}
            <div className="space-y-2.5">
              <p className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">
                Datos del Adulto Responsable (Simulado)
              </p>

              {/* Adult Name input */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500">Nombre o apodo del adulto</span>
                <input
                  id="adult-name-input"
                  type="text"
                  value={adultName}
                  onChange={(e) => setAdultName(e.target.value)}
                  placeholder="Ej: Mariana"
                  className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 font-sans"
                />
              </div>

              {/* Adult relation select */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500">Relación con el menor</span>
                <select
                  id="adult-relation-select"
                  value={adultRelation}
                  onChange={(e) => setAdultRelation(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700"
                >
                  <option value="Madre">Madre</option>
                  <option value="Padre">Padre</option>
                  <option value="Tutor">Tutor</option>
                  <option value="Familiar">Familiar u otro</option>
                </select>
              </div>

              {/* Confirmation of accompaniment checkbox */}
              <label className="flex items-start gap-2 bg-white p-2 px-2.5 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  id="adult-confirmed-checkbox"
                  type="checkbox"
                  checked={adultConfirmedAcc}
                  onChange={(e) => setAdultConfirmedAcc(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 mt-0.5 accent-indigo-600"
                />
                <span className="text-[10px] font-bold text-slate-600 leading-normal">
                  Confirmo compromiso de acompañamiento en los encuentros.
                </span>
              </label>

              {/* Only Safe Points toggle option */}
              <label className="flex items-start gap-2 bg-indigo-50/50 p-2 px-2.5 rounded-xl border border-indigo-100 cursor-pointer">
                <input
                  id="only-safe-points-checkbox"
                  type="checkbox"
                  checked={onlySafePointsActive}
                  onChange={(e) => setOnlySafePointsActive(e.target.checked)}
                  className="rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 mt-0.5 accent-indigo-600"
                />
                <div className="text-[10px] leading-normal font-bold">
                  <span className="text-indigo-900 block font-black">🏪 Permitir solo intercambios en puntos seguros</span>
                  <span className="text-indigo-700 font-medium. opacity-80 block text-[9.5px]">Prioriza locales y plazas vigiladas en Palermo.</span>
                </div>
              </label>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handleNext}
        id="btn-confirm-profile"
        className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
      >
        <span>Confirmar y Configurar Álbum</span>
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
