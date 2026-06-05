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
  const [isSupervised, setIsSupervised] = useState(true);

  const handleNext = () => {
    if (!name.trim()) return;

    const badges = ['Nuevo ingresante'];
    if (userType === 'padre_madre') {
      badges.push('Padre Colaborador');
    }

    const newProfile: UserProfile = {
      id: 'custom_user_id_' + Date.now(),
      name: name.trim(),
      email: initialEmail,
      avatar: selectedAvatar,
      neighborhood,
      userType,
      isSupervised,
      avgRating: 5.0, // starts flat
      exchangesCount: 0,
      badges,
      activeAlbumId: 'mundial_2026', // defaults to Mundial de Futbol
      blockedUsers: [],
      reportedUsers: []
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
                  setIsSupervised(false);
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

      {/* Supervised toggle for minors */}
      <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-2xl space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-amber-600" />
            <span className="text-xs font-bold text-slate-800">¿Cuenta Supervisada?</span>
          </div>
          <input
            type="checkbox"
            checked={isSupervised}
            onChange={(e) => setIsSupervised(e.target.checked)}
            className="rounded border-amber-300 text-amber-600 focus:ring-amber-500 h-4.5 w-4.5 accent-amber-600"
          />
        </div>
        <p className="text-[10px] text-amber-700/80 leading-normal">
          Para menores de edad, se activa el modo de supervisión parental. El chat y los encuentros seguros recuerdan siempre implicar a un tutor.
        </p>
      </div>

      <button
        onClick={handleNext}
        className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs"
      >
        <span>Confirmar y Configurar Álbum</span>
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
