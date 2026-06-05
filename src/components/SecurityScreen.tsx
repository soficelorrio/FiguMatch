import React, { useState } from 'react';
import { UserProfile, SafePoint } from '../types';
import { SUGGESTED_SAFE_POINTS } from '../data';
import { 
  ArrowLeft, 
  ShieldAlert, 
  MapPin, 
  Eye, 
  ThumbsUp, 
  Heart, 
  CheckCircle2, 
  ShieldCheck, 
  Edit3, 
  AlertTriangle,
  UserX,
  PlusCircle,
  HelpCircle
} from 'lucide-react';

interface SecurityScreenProps {
  onBack: () => void;
  userProfile: UserProfile;
  onUpdateUserProfile: (updated: UserProfile) => void;
  blockedUsersCount: number;
  reportedUsersCount: number;
}

export default function SecurityScreen({
  onBack,
  userProfile,
  onUpdateUserProfile,
  blockedUsersCount,
  reportedUsersCount
}: SecurityScreenProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);

  // Form states for editing adult info
  const [editAdultName, setEditAdultName] = useState(userProfile.adultName || 'Mariana');
  const [editAdultRelation, setEditAdultRelation] = useState(userProfile.adultRelation || 'Madre');
  const [editOnlySafePoints, setEditOnlySafePoints] = useState(userProfile.onlySafePointsActive ?? true);

  // Activation form states (if starting inactive)
  const [activateAdultName, setActivateAdultName] = useState('Mariana');
  const [activateAdultRelation, setActivateAdultRelation] = useState('Madre');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...userProfile,
      adultName: editAdultName,
      adultRelation: editAdultRelation,
      onlySafePointsActive: editOnlySafePoints
    };
    onUpdateUserProfile(updated);
    setIsEditing(false);
  };

  const handleToggleOnlySafePoints = (val: boolean) => {
    const updated = {
      ...userProfile,
      onlySafePointsActive: val
    };
    onUpdateUserProfile(updated);
    setEditOnlySafePoints(val);
  };

  const handleDeactivate = () => {
    const updated = {
      ...userProfile,
      minorModeActive: false,
      isSupervised: false,
      onlySafePointsActive: false
    };
    onUpdateUserProfile(updated);
    setShowDeactivateConfirm(false);
  };

  const handleActivateMode = () => {
    const updated = {
      ...userProfile,
      minorModeActive: true,
      isSupervised: true,
      adultName: activateAdultName,
      adultRelation: activateAdultRelation,
      onlySafePointsActive: true,
      adultConfirmedAcc: true
    };
    onUpdateUserProfile(updated);
  };

  return (
    <div className="space-y-4 px-2 pb-16 font-sans">
      
      {/* Header */}
      <div className="flex items-center gap-3 pb-2 border-b border-gray-50 text-left">
        <button
          onClick={onBack}
          className="p-2 text-gray-500 hover:text-gray-700 bg-gray-50 rounded-xl transition cursor-pointer"
        >
          <ArrowLeft size={18} />
        </button>
        <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">Seguridad para Menores & Privacidad</h2>
      </div>

      {/* Main Mode Status Notification Banner */}
      {userProfile.minorModeActive ? (
        <div className="bg-gradient-to-tr from-emerald-600 to-teal-600 text-white p-5 rounded-3xl shadow-sm space-y-2 relative overflow-hidden text-left">
          <div className="absolute -top-6 -right-6 h-24 w-24 bg-white/10 rounded-full blur-md"></div>
          <div className="flex items-start gap-2.5">
            <ShieldCheck size={32} className="text-white stroke-[2.25] flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="bg-emerald-500/80 text-white border border-emerald-400 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                Modo Activo
              </span>
              <h3 className="text-sm font-extrabold font-display">Modo Menor Acompañado</h3>
              <p className="text-[11px] font-medium leading-relaxed opacity-95">
                La app prioriza los puntos seguros de Palermo, muestra advertencias de chat y te guía para hacer intercambios responsables.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-tr from-slate-700 to-slate-900 text-white p-5 rounded-3xl shadow-sm space-y-2 relative overflow-hidden text-left">
          <div className="absolute -top-6 -right-6 h-24 w-24 bg-white/10 rounded-full blur-md"></div>
          <div className="flex items-start gap-2.5">
            <ShieldAlert size={32} className="text-slate-300 stroke-[2.25] flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="bg-slate-600 text-slate-300 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                Modo Desactivado
              </span>
              <h3 className="text-sm font-extrabold font-display">Modo Menor Desactivado</h3>
              <p className="text-[11px] font-medium leading-relaxed opacity-95">
                Esta es una cuenta estándar. Activá la supervisión si la cuenta será usada por un menor de edad.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SPECIAL SCREEN: SEGURIDAD PARA MENORES DETAILS */}
      {userProfile.minorModeActive ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-3xs space-y-4 text-left">
          
          {/* Header section with Shield */}
          <div className="flex items-center justify-between border-b border-dashed border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                🛡️ Control Parental & Supervisión
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Configurá el acompañamiento de tutores.</p>
            </div>
          </div>

          {/* Active stats */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-bold">Adulto Responsable:</span>
              <span className="font-extrabold text-slate-800">{userProfile.adultName} ({userProfile.adultRelation})</span>
            </div>
            <div className="flex justify-between text-xs pt-2 border-t border-slate-100 items-center">
              <div>
                <span className="text-slate-400 font-bold block">Solo puntos seguros:</span>
                <span className="text-[9px] text-indigo-600 font-bold block">Filtra y sugiere Kioscos/Plazas</span>
              </div>
              <input
                id="toggle-only-safepoints"
                type="checkbox"
                checked={!!userProfile.onlySafePointsActive}
                onChange={(e) => handleToggleOnlySafePoints(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4.5 w-4.5 accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>

          {/* EDIT FORM (Conditionally open) */}
          {isEditing ? (
            <form onSubmit={handleSaveSettings} className="bg-slate-50 p-4 border border-slate-200/65 rounded-2xl space-y-3 animate-fadeIn">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Editar Datos de Acompañante</p>
              
              <div className="space-y-1">
                <span className="text-[9.5px] font-bold text-slate-500">Nombre del Adulto</span>
                <input
                  id="edit-adult-name"
                  type="text"
                  value={editAdultName}
                  onChange={(e) => setEditAdultName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl py-1.5 px-3 text-xs font-bold text-slate-700"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[9.5px] font-bold text-slate-500">Relación / Parentesco</span>
                <select
                  id="edit-adult-relation"
                  value={editAdultRelation}
                  onChange={(e) => setEditAdultRelation(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl py-1.5 px-3 text-xs font-bold text-slate-700"
                >
                  <option value="Madre">Madre</option>
                  <option value="Padre">Padre</option>
                  <option value="Tutor">Tutor</option>
                  <option value="Familiar">Familiar u otro</option>
                </select>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-white border border-slate-200 text-slate-500 font-bold py-2 rounded-lg text-[10.5px] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white font-bold py-2 rounded-lg text-[10.5px] cursor-pointer hover:bg-indigo-700"
                >
                  Guardar
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => {
                setEditAdultName(userProfile.adultName || 'Mariana');
                setEditAdultRelation(userProfile.adultRelation || 'Madre');
                setIsEditing(true);
              }}
              id="btn-edit-minor-options"
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer border border-slate-150"
            >
              <Edit3 size={12} /> Editar configuración tutor
            </button>
          )}

          {/* STRICT RECOMMENDATIONS TEXT BLOCK (Point 10 Texts) */}
          <div className="bg-indigo-50/30 border border-indigo-100/60 p-4 rounded-2xl space-y-3">
            <p className="text-[10px] font-black uppercase text-indigo-700 tracking-wider flex items-center gap-1">
              📢 Recomendaciones de Seguridad Obligatorias:
            </p>
            <ul className="text-xs space-y-2.5 text-slate-700 font-bold pl-1.5">
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 text-xs mt-0.5 leading-none">•</span>
                <span>“FiguMatch recomienda que los menores realicen intercambios siempre acompañados por un adulto responsable.”</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 text-xs mt-0.5 leading-none">•</span>
                <span>“No compartas dirección exacta, teléfono ni datos personales.”</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 text-xs mt-0.5 leading-none">•</span>
                <span>“Usá puntos seguros siempre que sea posible.”</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 text-xs mt-0.5 leading-none">•</span>
                <span>“Si algo te parece raro, cancelá el intercambio y reportá al usuario.”</span>
              </li>
            </ul>
          </div>

          {/* DEACTIVATE BUTTON (Confirm Modal Trigger) */}
          <div className="pt-2">
            <button
              id="btn-deactivate-minormode"
              onClick={() => setShowDeactivateConfirm(true)}
              className="text-xs text-red-500 font-bold hover:underline py-1 px-2 border border-red-200/50 hover:bg-red-50 transition rounded-xl flex items-center gap-1.5 cursor-pointer ml-auto"
            >
              <UserX size={12} /> Desactivar Modo Menor
            </button>
          </div>

        </div>
      ) : (
        /* Setup activation for normal accounts to test activating it */
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-3xs space-y-3.5 text-left">
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
            🛡️ Activar Modo Menor en esta cuenta
          </h4>
          <p className="text-xs text-slate-400">
            Si sos menor o querés que un tutor monitoree los canjes de esta cuenta, configuralo de inmediato:
          </p>

          <div className="space-y-3">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Nombre del Tutor Acompañante</span>
              <input
                id="activate-adult-name"
                type="text"
                value={activateAdultName}
                onChange={(e) => setActivateAdultName(e.target.value)}
                placeholder="Ej: Mariana"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold text-slate-700"
              />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Parentesco</span>
              <select
                id="activate-adult-relation"
                value={activateAdultRelation}
                onChange={(e) => setActivateAdultRelation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold text-slate-700"
              >
                <option value="Madre">Madre</option>
                <option value="Padre">Padre</option>
                <option value="Tutor">Tutor</option>
                <option value="Familiar">Familiar u otro</option>
              </select>
            </div>

            <button
              onClick={handleActivateMode}
              id="btn-activate-minor-on-demand"
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-black uppercase tracking-wider rounded-xl hover:opacity-90 duration-200 cursor-pointer text-center flex items-center justify-center gap-1"
            >
              🔒 Activar Modo Menor Acompañado
            </button>
          </div>
        </div>
      )}

      {/* Suggested Safe Points List */}
      <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-2xs space-y-3 text-left">
        <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest pl-0.5 flex items-center gap-1.5">
          📍 Puntos Seguros de Palermo ({SUGGESTED_SAFE_POINTS.length})
        </h4>
        <p className="text-[10px] text-gray-400 leading-normal pl-0.5">
          Locales comerciales, clubes deportivos y cafeterías que funcionan como bases recomendadas para coleccionistas. ¡Elegilos siempre!
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

      {/* Block and Report counts */}
      <div className="grid grid-cols-2 gap-3 pb-2 text-left">
        <div className="bg-slate-50 border border-gray-100 p-3.5 rounded-2xl text-center">
          <p className="text-[9px] font-bold uppercase text-gray-450">Usuarios Bloqueados</p>
          <p className="text-base font-black text-gray-800 mt-1">{blockedUsersCount}</p>
        </div>
        <div className="bg-slate-50 border border-gray-100 p-3.5 rounded-2xl text-center">
          <p className="text-[9px] font-bold uppercase text-gray-455">Reportes Enviados</p>
          <p className="text-base font-black text-gray-800 mt-1">{reportedUsersCount}</p>
        </div>
      </div>

      {/* CONFIRM DEACTIVATE MODAL */}
      {showDeactivateConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 z-55 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xs space-y-4 shadow-xl text-center">
            <AlertTriangle className="text-red-500 mx-auto" size={32} />
            <h4 className="text-sm font-black text-slate-800">¿Estás seguro de que querés desactivar el Modo Menor?</h4>
            <p className="text-xs text-slate-400 leading-normal">
              Dejarás de recibir advertencias especiales al chatear y proponer canjes, y no contarás con las protecciones de visibilidad de datos sensibles del menor.
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setShowDeactivateConfirm(false)}
                className="flex-1 bg-slate-50 border border-slate-100 text-slate-500 font-bold py-2.5 rounded-xl text-xs cursor-pointer"
              >
                Cancelar
              </button>
              <button
                id="btn-confirm-deactivation"
                onClick={handleDeactivate}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer"
              >
                Sí, desactivar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
