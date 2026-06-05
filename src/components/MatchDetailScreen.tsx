import React, { useState } from 'react';
import { MatchResult } from '../types';
import { 
  ArrowLeft, 
  Star, 
  ShieldCheck, 
  MapPin, 
  MessageSquare, 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles, 
  Flame,
  Info,
  Calendar,
  Layers
} from 'lucide-react';

interface MatchDetailScreenProps {
  matchResult: MatchResult;
  onBack: () => void;
  onOpenChat: () => void;
  onProposeTrade: () => void;
  onBlockUser: (collectorId: string) => void;
  onReportUser: (collectorId: string, reason: string) => void;
  isSupervised?: boolean;
}

export default function MatchDetailScreen({
  matchResult,
  onBack,
  onOpenChat,
  onProposeTrade,
  onBlockUser,
  onReportUser,
  isSupervised = true
}: MatchDetailScreenProps) {
  const { collector, matchLevel, theyOfferToUser, userOffersToThem, compatibilityPercent, explanation } = matchResult;
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  const handleBlockSubmit = () => {
    onBlockUser(collector.id);
    setShowBlockConfirm(false);
    onBack();
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason.trim()) return;
    onReportUser(collector.id, reportReason);
    setReportSuccess(true);
    setTimeout(() => {
      setReportSuccess(false);
      setShowReportModal(false);
      onBack();
    }, 2000);
  };

  const isKiosco = collector.userType === 'kiosco' || collector.userType === 'club';

  // Dynamic advice phrase
  let suitabilityPhrase = "";
  if (matchLevel === "alta") {
    suitabilityPhrase = "Este intercambio es conveniente porque ambos usuarios reciben figuritas que necesitan.";
  } else if (matchLevel === "media") {
    suitabilityPhrase = "Este intercambio es provechoso para vos porque recibís figuritas que te faltan. Podés chatear para ver si acordás algún canje asimétrico o compensatorio.";
  } else {
    suitabilityPhrase = "Por el momento hay pocas coincidencias directas en sus listas, pero comparten el mismo álbum en la misma zona.";
  }

  return (
    <div className="space-y-4 px-2 pb-16 relative">
      
      {/* Back button header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 text-slate-500 hover:text-slate-800 bg-slate-50 rounded-xl transition cursor-pointer"
        >
          <ArrowLeft size={18} />
        </button>
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Detalle del Match</h3>
      </div>

      {/* Main Profile Info Card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-3xs text-center relative overflow-hidden">
        {/* Background Accent banner */}
        <div className={`absolute top-0 inset-x-0 h-16 ${
          isKiosco ? 'bg-amber-50' : 
          matchLevel === 'alta' ? 'bg-emerald-50/55' : 
          matchLevel === 'media' ? 'bg-amber-50/50' : 'bg-slate-50'
        }`}></div>

        <div className="relative pt-4 flex flex-col items-center">
          <span className="text-6.5xl p-2.5 bg-white rounded-full shadow-xs border-2 border-slate-100 w-20 h-20 flex items-center justify-center">
            {collector.avatar}
          </span>

          <div className="flex items-center gap-1 mt-3">
            <h2 className="text-xl font-black text-slate-900 font-display">{collector.name}</h2>
            {collector.isVerified && (
              <ShieldCheck className="text-blue-500 fill-blue-50 stroke-[2.5]" size={18} />
            )}
          </div>

          {/* Approx Zone & Estimated Distance */}
          <p className="text-xs text-slate-400 font-bold flex items-center gap-1 mt-1 justify-center">
            <MapPin size={12} className="text-red-400" />
            Zona: {collector.neighborhood} · A {collector.distance} km de distancia
          </p>

          {/* Rating, Exchanges and Recency */}
          <div className="grid grid-cols-3 gap-2 w-full mt-4 border-t border-b border-dashed border-slate-100 py-3 text-slate-600">
            <div className="text-center">
              <span className="block text-xs font-black text-slate-400 uppercase tracking-widest">Calificación</span>
              <span className="inline-flex items-center justify-center gap-0.5 mt-0.5 text-amber-600 font-black text-xs">
                <Star className="fill-amber-400 stroke-amber-500" size={12} />
                {collector.avgRating}
              </span>
            </div>
            <div className="text-center border-l border-r border-slate-100">
              <span className="block text-xs font-black text-slate-400 uppercase tracking-widest">Intercambios</span>
              <span className="block text-slate-800 font-extrabold text-xs mt-0.5">
                {collector.exchangesCount} realizados
              </span>
            </div>
            <div className="text-center">
              <span className="block text-xs font-black text-slate-400 uppercase tracking-widest">Actividad</span>
              <span className="block text-slate-800 font-extrabold text-xs mt-0.5">
                {collector.activityTime}
              </span>
            </div>
          </div>

          {/* Active Album */}
          <div className="mt-3 flex items-center gap-1 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-100 text-[11px] text-slate-500 font-bold">
            <Layers size={12} className="text-indigo-500" />
            <span>Álbum activo: <strong>Panini Mundial 2026</strong></span>
          </div>

          {/* Badges/Insignias */}
          <div className="flex flex-wrap justify-center gap-1 mt-3">
            {collector.badges.map((badge) => (
              <span
                key={badge}
                className="bg-indigo-50 text-indigo-700 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg border border-indigo-100/40"
              >
                🏅 {badge}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Compatibility Status Block */}
      <div className={`border rounded-3xl p-5 shadow-3xs space-y-3.5 bg-white ${
        isKiosco ? 'border-amber-100 ring-2 ring-amber-50/50' :
        matchLevel === 'alta' ? 'border-emerald-100 ring-2 ring-emerald-50/50' :
        matchLevel === 'media' ? 'border-amber-100 ring-2 ring-amber-50/30' : 'border-slate-100'
      }`}>
        <div className="flex justify-between items-center pb-2.5 border-b border-dashed border-slate-100">
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">
            Porcentaje de Compatibilidad
          </h4>
          <span className={`text-xs font-black py-1 px-3 rounded-xl uppercase ${
            isKiosco ? 'bg-amber-500 text-white' :
            matchLevel === 'alta' ? 'bg-emerald-600 text-white' :
            matchLevel === 'media' ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-700'
          }`}>
            {matchLevel === 'alta' ? 'Coincidencia Alta' : matchLevel === 'media' ? 'Coincidencia Media' : 'Coincidencia Baja'} · {compatibilityPercent}%
          </span>
        </div>

        {isKiosco ? (
          <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-100 text-xs text-amber-900 leading-normal font-medium space-y-1">
            <p className="font-extrabold text-[11px] uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
              🏪 Punto Seguro Palermo
            </p>
            <p>{explanation}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* They have for you */}
            <div className="space-y-1.5">
              <p className="text-[11px] font-black text-emerald-700 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span> figuritas que {collector.name} tiene y te faltan ({theyOfferToUser.length})
              </p>
              <div className="flex flex-wrap gap-1.5 pl-3.5">
                {theyOfferToUser.map((code) => (
                  <span
                    key={code}
                    className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-250 text-emerald-800 font-mono text-[11px] font-extrabold px-2.5 py-1 rounded-lg"
                  >
                    {code}
                  </span>
                ))}
                {theyOfferToUser.length === 0 && (
                  <p className="text-[11px] text-slate-400 italic">No tiene repetidas que cargues como faltantes.</p>
                )}
              </div>
            </div>

            {/* You have for them */}
            <div className="space-y-1.5 pt-3.5 border-t border-dashed border-slate-100">
              <p className="text-[11px] font-black text-indigo-700 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-indigo-505 bg-indigo-500"></span> figuritas que vos tenés y {collector.name} necesita ({userOffersToThem.length})
              </p>
              <div className="flex flex-wrap gap-1.5 pl-3.5">
                {userOffersToThem.map((code) => (
                  <span
                    key={code}
                    className="bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-800 font-mono text-[11px] font-extrabold px-2.5 py-1 rounded-lg"
                  >
                    {code}
                  </span>
                ))}
                {userOffersToThem.length === 0 && (
                  <p className="text-[11px] text-slate-400 italic">No tenés repetidas declaradas útiles para {collector.name}.</p>
                )}
              </div>
            </div>

            {/* Suggeested trade constructor */}
            <div className="pt-3.5 border-t border-dashed border-slate-100 space-y-1.5">
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Intercambio sugerido</p>
              <div className="bg-slate-50/80 border border-slate-100 p-3.5 rounded-2xl text-xs space-y-2">
                <div className="text-slate-700 font-bold leading-normal">
                  {theyOfferToUser.length > 0 && userOffersToThem.length > 0 ? (
                    <div>
                      <p className="mb-1"><span className="text-indigo-600">👉 Vos entregás:</span> {userOffersToThem.join(' y ')}.</p>
                      <p><span className="text-emerald-700">👉 {collector.name} entrega:</span> {theyOfferToUser.join(' y ')}.</p>
                    </div>
                  ) : theyOfferToUser.length > 0 ? (
                    <p>{collector.name} te entrega {theyOfferToUser.join(', ')} (acordar compensación o trueque asimétrico).</p>
                  ) : userOffersToThem.length > 0 ? (
                    <p>Le entregás {userOffersToThem.join(', ')} (acordar compensación o recibir futuras repetidas).</p>
                  ) : (
                    <p className="text-slate-400 italic">Sin trueque pre-calculado disponible.</p>
                  )}
                </div>

                {/* Suitability sentence explanation phrase */}
                <p className="text-[11px] text-slate-500 italic bg-white p-2 border border-slate-100 rounded-xl leading-normal font-semibold">
                  “{suitabilityPhrase}”
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Punto Seguro notice box */}
      <div className="bg-amber-50/45 border border-amber-100 rounded-3xl p-4.5 shadow-3xs space-y-2 text-amber-900">
        <p className="text-xs font-black text-amber-800 flex items-center gap-1">
          🛡️ Lugares recomendados para realizar el canje seguro:
        </p>
        <ul className="text-[10px] space-y-1 text-amber-800 leading-normal font-bold list-disc pl-4">
          <li><strong>Kiosco El Álbum:</strong> Av. Santa Fe 3432, Palermo (Punto oficial monitoreado).</li>
          <li><strong>Club Atlético Palermo:</strong> Fitz Roy 2238 (Confitería pública vigilada).</li>
        </ul>
        {isSupervised && (
          <p className="text-[10px] text-amber-700 font-semibold bg-white p-2 rounded-xl border border-amber-100 mt-2 leading-relaxed">
            ⚠️ Recordatorio para menores: Recordá que la seguridad es lo más importante. Coordiná el intercambio junto a un adulto responsable en lugares concurridos de Palermo.
          </p>
        )}
      </div>

      {/* Direct actions */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        {!isKiosco ? (
          <button
            onClick={onProposeTrade}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3.5 px-4 rounded-2xl text-xs transition flex items-center justify-center gap-1 cursor-pointer"
          >
            Proponer intercambio
          </button>
        ) : (
          <div className="bg-slate-100 text-slate-500 h-11 flex items-center justify-center font-bold rounded-2xl text-xs border border-slate-200">
            Punto Físico Directo
          </div>
        )}
        <button
          onClick={onOpenChat}
          className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3.5 px-4 rounded-2xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <MessageSquare size={14} /> Chatear
        </button>
      </div>

      {/* Block or Report option links */}
      <div className="pt-4 border-t border-slate-100 flex justify-between px-1">
        <button
          onClick={() => setShowBlockConfirm(true)}
          className="text-xs text-red-500 font-extrabold hover:underline bg-transparent border-0 p-1 cursor-pointer"
        >
          🔒 Bloquear Usuario
        </button>
        <button
          onClick={() => setShowReportModal(true)}
          className="text-xs text-slate-400 hover:text-red-500 font-extrabold hover:underline bg-transparent border-0 p-1 cursor-pointer flex items-center gap-1"
        >
          ⚠️ Reportar usuario
        </button>
      </div>

      {/* Block Confirmation Modal Overlay */}
      {showBlockConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xs space-y-4 shadow-xl">
            <h4 className="text-sm font-black text-slate-905 bg-transparent text-slate-900 text-center">¿Querés bloquear a {collector.name}?</h4>
            <p className="text-xs text-slate-400 text-center leading-normal">
              No vas a ver más a este usuario en tus listados y no podrá enviarte mensajes.
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setShowBlockConfirm(false)}
                className="flex-1 bg-slate-50 border border-slate-100 text-slate-500 font-bold py-2.5 rounded-xl text-xs cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleBlockSubmit}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer"
              >
                Bloquear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal Overlay */}
      {showReportModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xs space-y-4 shadow-xl">
            <div className="flex items-center gap-1.5 border-b border-gray-50 pb-2">
              <ShieldAlert className="text-red-500" size={18} />
              <h4 className="text-sm font-black text-slate-900">Reportar a {collector.name}</h4>
            </div>

            {reportSuccess ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 size={32} className="text-green-500 mx-auto fill-green-50" />
                <p className="text-xs font-bold text-gray-700">¡Tu reporte fue enviado!</p>
                <p className="text-[10px] text-gray-400">Moderación analizará la cuenta del usuario de inmediato.</p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <p className="text-[11px] text-gray-400 leading-normal">
                  Por favor, indicanos el motivo del reporte por la seguridad de la comunidad:
                </p>

                <div className="space-y-2">
                  {[
                    'Comportamiento sospechoso / pide WhatsApp',
                    'Falta a los encuentros acordados',
                    'Intenta cambiar figuritas dañadas',
                    'Lenguaje inadecuado',
                    'Otro motivo de seguridad'
                  ].map((option) => (
                    <label key={option} className="flex items-center gap-2 text-xs font-bold text-slate-700 py-1 hover:bg-slate-50 rounded px-1 cursor-pointer">
                      <input
                        type="radio"
                        name="reportReason"
                        checked={reportReason === option}
                        onChange={() => setReportReason(option)}
                        className="rounded-full border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="flex-1 bg-slate-50 border border-slate-100 text-slate-500 font-bold py-2.5 rounded-xl text-xs cursor-pointer"
                  >
                    Salir
                  </button>
                  <button
                    type="submit"
                    disabled={!reportReason}
                    className="flex-1 bg-red-650 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer disabled:opacity-50"
                  >
                    Enviar Reporte
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
