import React, { useState } from 'react';
import { MatchResult, UserProfile } from '../types';
import { ArrowLeft, Star, ShieldCheck, MapPin, MessageSquare, Plus, ShieldAlert, CheckCircle2 } from 'lucide-react';

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
  const { collector, matchLevel, theyOfferToUser, userOffersToThem } = matchResult;
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

  return (
    <div className="space-y-4 px-2 pb-16 relative">
      
      {/* Upper header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 text-gray-500 hover:text-gray-700 bg-gray-50 rounded-xl transition"
        >
          <ArrowLeft size={18} />
        </button>
        <h3 className="text-sm font-bold text-gray-800">Detalle del Coleccionista</h3>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-2xs space-y-4 text-center relative overflow-hidden">
        
        {/* Background Accent */}
        <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-r from-indigo-50 to-violet-50/50"></div>

        <div className="relative pt-4 flex flex-col items-center">
          <span className="text-6xl p-3 bg-white rounded-full shadow-md border-2 border-indigo-100 w-20 h-20 flex items-center justify-center">
            {collector.avatar}
          </span>

          <div className="flex items-center gap-1.5 mt-3">
            <h2 className="text-xl font-black text-gray-900 font-display">{collector.name}</h2>
            {collector.isVerified && (
              <ShieldCheck className="text-indigo-600 fill-indigo-50 stroke-[2.5]" size={18} />
            )}
          </div>

          <p className="text-xs text-gray-400 font-medium flex items-center gap-1 mt-0.5">
            <MapPin size={12} className="text-red-400" />
            {collector.neighborhood} (a {collector.distance} km de distancia)
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-2.5 bg-amber-50/70 border border-amber-100/50 py-1 px-3 rounded-full text-xs text-amber-800 font-extrabold shadow-3xs">
            <Star className="fill-amber-400 stroke-amber-500" size={13} />
            <span>{collector.avgRating} de Calificación</span>
            <span className="text-gray-300 mx-1">•</span>
            <span className="text-gray-400 font-normal">{collector.exchangesCount} canjes hechos</span>
          </div>

          {/* Badges/Insignias */}
          <div className="flex flex-wrap justify-center gap-1.5 mt-4">
            {collector.badges.map((badge) => (
              <span
                key={badge}
                className="bg-indigo-50 text-indigo-700 text-[10px] font-black px-2.5 py-1 rounded-full border border-indigo-100/50"
              >
                🏅 {badge}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Match offer / needs intersection lists */}
      <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-2xs space-y-4">
        <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest pl-0.5">
          Intercambio Inteligente Sugerido
        </h4>

        {/* They offer you */}
        <div className="space-y-2">
          <p className="text-[11px] font-extrabold text-green-700 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-green-500"></span> Lo que Martina/él te canjea ({theyOfferToUser.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {theyOfferToUser.map((n) => (
              <span
                key={n}
                className="bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 font-mono text-xs font-bold px-2 py-1 rounded-xl"
              >
                #{n}
              </span>
            ))}
            {theyOfferToUser.length === 0 && (
              <p className="text-xs text-gray-400 italic">No tiene figuritas repetidas que te falten.</p>
            )}
          </div>
        </div>

        {/* You offer them */}
        <div className="space-y-2 pt-3 border-t border-dashed border-gray-100">
          <p className="text-[11px] font-extrabold text-indigo-700 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-indigo-500"></span> Lo que vos le podés dar en canje ({userOffersToThem.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {userOffersToThem.map((n) => (
              <span
                key={n}
                className="bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-mono text-xs font-bold px-2 py-1 rounded-xl"
              >
                #{n}
              </span>
            ))}
            {userOffersToThem.length === 0 && (
              <p className="text-xs text-gray-400 italic">No tenés repetidas que le falten a este usuario.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recommended meeting points */}
      <div className="bg-amber-50/40 border border-amber-100/50 rounded-3xl p-5 shadow-2xs space-y-2 text-amber-900">
        <p className="text-xs font-bold flex items-center gap-1">
          🛡️ Puntos Seguros sugeridos para coordinar el canje:
        </p>
        <ul className="text-[11px] space-y-1.5 text-amber-800 leading-relaxed font-medium list-disc pl-4 mt-1.5">
          <li><strong>Kiosco El Álbum:</strong> A 800 m (adherido y filmado con cámaras).</li>
          <li><strong>Club Atlético Palermo:</strong> Calle Fitz Roy 2238 (oficinas y confitería concurrida).</li>
          <li><strong>Plazas muy concurridas:</strong> Costa Rica & Medrano (Plaza Unidad Latinoamericana).</li>
        </ul>
        {isSupervised && (
          <p className="text-[10px] text-amber-700 font-bold bg-white/70 p-2 rounded-xl border border-amber-200/50 mt-2">
            ⚠️ Recordatorio de menores: Siempre coordiná el encuentro con un adulto o tutor responsable en un lugar público, nunca en domicilios particulares.
          </p>
        )}
      </div>

      {/* Primary Communication & Trade buttons */}
      <div className="grid grid-cols-2 gap-3.5 pt-2">
        <button
          onClick={onProposeTrade}
          className="bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold py-3.5 px-4 rounded-xl text-xs shadow-md shadow-indigo-100 transition flex items-center justify-center gap-1 cursor-pointer"
        >
          Proponer Canje
        </button>
        <button
          onClick={onOpenChat}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-xl text-xs transition flex items-center justify-center gap-1 cursor-pointer"
        >
          <MessageSquare size={14} /> Chatear
        </button>
      </div>

      {/* Block or Report triggers */}
      <div className="pt-4 border-t border-gray-100 flex justify-between">
        <button
          onClick={() => setShowBlockConfirm(true)}
          className="text-xs text-red-500 font-bold hover:underline bg-transparent border-0 p-1 cursor-pointer flex items-center gap-1"
        >
          🔒 Bloquear Usuario
        </button>
        <button
          onClick={() => setShowReportModal(true)}
          className="text-xs text-gray-400 hover:text-red-500 font-bold hover:underline bg-transparent border-0 p-1 cursor-pointer flex items-center gap-1"
        >
          ⚠️ Reportar
        </button>
      </div>

      {/* Block Confirmation Modal Overlay */}
      {showBlockConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xs space-y-4 shadow-xl">
            <h4 className="text-sm font-black text-slate-900 text-center">¿Quieres bloquear a {collector.name}?</h4>
            <p className="text-xs text-gray-400 text-center leading-normal">
              No vas a ver más a este usuario en tus mapas ni listados de coincidencia, y no podrá chatear con vos.
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setShowBlockConfirm(false)}
                className="flex-1 bg-gray-50 border border-gray-100 text-gray-600 font-bold py-2.5 rounded-xl text-xs"
              >
                Cancelar
              </button>
              <button
                onClick={handleBlockSubmit}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md shadow-red-100"
              >
                Confirmar
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
                  Por seguridad de la comunidad, informanos si este usuario tiene conductas dudosas o pide datos personales fuera de la app (teléfono/dirección).
                </p>

                <div className="space-y-2">
                  {[
                    'Comportamiento sospechoso / pide WhatsApp',
                    'Falta a los encuentros acordados',
                    'Intenta cambiar figuritas rotas',
                    'Lenguaje inapropiado o violento',
                    'Otro motivo de seguridad'
                  ].map((option) => (
                    <label key={option} className="flex items-start gap-2 text-xs font-semibold text-gray-700 py-1 hover:bg-gray-50 rounded px-1 cursor-pointer">
                      <input
                        type="radio"
                        name="reportReason"
                        checked={reportReason === option}
                        onChange={() => setReportReason(option)}
                        className="rounded-full border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4.5 w-4.5"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="flex-1 bg-gray-50 border border-gray-100 text-gray-600 font-bold py-2.5 rounded-xl text-xs"
                  >
                    Salir
                  </button>
                  <button
                    type="submit"
                    disabled={!reportReason}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md disabled:opacity-50"
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
