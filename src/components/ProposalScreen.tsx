import { useState } from 'react';
import { NearbyCollector, TradeProposal, TradeStatus, SafePoint } from '../types';
import { SUGGESTED_SAFE_POINTS } from '../data';
import { ArrowLeft, RefreshCw, Calendar, MapPin, ThumbsUp, Check, X, ShieldAlert, Award, Star } from 'lucide-react';

interface ProposalScreenProps {
  collector: NearbyCollector;
  userDuplicates: string[];
  userMissings: string[];
  onSubmitProposal: (proposal: TradeProposal) => void;
  onBack: () => void;
  activeProposals?: TradeProposal[];
  onUpdateProposalStatus?: (id: string, newStatus: TradeStatus, rating?: number) => void;
}

export default function ProposalScreen({
  collector,
  userDuplicates,
  userMissings,
  onSubmitProposal,
  onBack,
  activeProposals = [],
  onUpdateProposalStatus
}: ProposalScreenProps) {
  const [viewMode, setViewMode] = useState<'create' | 'list'>('create');
  
  // Create mode state using string codes
  const [offered, setOffered] = useState<string[]>(
    Object.keys(collector.stickers)
      .filter((code) => collector.stickers[code] === 'faltante' && userDuplicates.includes(code))
  );
  
  const [requested, setRequested] = useState<string[]>(
    Object.keys(collector.stickers)
      .filter((code) => collector.stickers[code] === 'repetida' && userMissings.includes(code))
  );

  const [selectedSafePoint, setSelectedSafePoint] = useState<string>(SUGGESTED_SAFE_POINTS[0].name);
  const [meetingTime, setMeetingTime] = useState('Hoy a las 18:00 hs');
  const [activeRating, setActiveRating] = useState<{ proposalId: string; stars: number } | null>(null);

  // Toggle selection
  const handleToggleOffered = (code: string) => {
    if (offered.includes(code)) {
      setOffered(offered.filter((item) => item !== code));
    } else {
      setOffered([...offered, code]);
    }
  };

  const handleToggleRequested = (code: string) => {
    if (requested.includes(code)) {
      setRequested(requested.filter((item) => item !== code));
    } else {
      setRequested([...requested, code]);
    }
  };

  const handleSubmit = () => {
    const newProposal: TradeProposal = {
      id: 'trade_' + Date.now(),
      senderId: 'sofi_user',
      receiverId: collector.id,
      receiverName: collector.name,
      receiverAvatar: collector.avatar,
      offeredStickers: offered,
      requestedStickers: requested,
      status: 'propuesto',
      date: new Date().toLocaleDateString('es-AR'),
      safePointName: selectedSafePoint,
      meetingTime
    };

    onSubmitProposal(newProposal);
    setViewMode('list');
  };

  const getStatusBadge = (status: TradeStatus) => {
    const map: { [key in TradeStatus]: { label: string; class: string } } = {
      propuesto: { label: 'Propuesto ⏳', class: 'bg-blue-100 text-blue-800' },
      aceptado: { label: 'Aceptado ✅', class: 'bg-indigo-150 text-indigo-800' },
      en_coordinacion: { label: 'Coordinando 🏪', class: 'bg-amber-100 text-amber-800 font-bold' },
      confirmado: { label: 'Confirmado 🔔', class: 'bg-purple-100 text-purple-800' },
      realizado: { label: 'Realizado 🎉', class: 'bg-green-100 text-green-800' },
      cancelado: { label: 'Cancelado ❌', class: 'bg-red-100 text-red-800' },
      no_presento: { label: 'No se Presentó ⚠️', class: 'bg-gray-150 text-gray-700' }
    };
    const details = map[status] || { label: status, class: 'bg-gray-100' };
    return <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${details.class}`}>{details.label}</span>;
  };

  return (
    <div className="space-y-4 px-2 pb-16">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-1 border-b border-gray-50">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-gray-500 hover:text-gray-700 bg-gray-50 rounded-xl transition"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h3 className="text-sm font-bold text-gray-800">Intercambios con {collector.name}</h3>
          </div>
        </div>
        
        {/* Toggle View Mode */}
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('create')}
            className={`py-1 px-3 text-[10px] font-bold rounded-lg transition ${
              viewMode === 'create' ? 'bg-white text-gray-900 shadow-3xs' : 'text-gray-500'
            }`}
          >
            Nueva
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`py-1 px-3 text-[10px] font-bold rounded-lg transition ${
              viewMode === 'list' ? 'bg-white text-gray-900 shadow-3xs' : 'text-gray-500'
            }`}
          >
            Activos
          </button>
        </div>
      </div>

      {viewMode === 'create' ? (
        /* Create Mode Form */
        <div className="space-y-4 font-sans animate-fade-in">
          
          <div className="bg-slate-50 border border-gray-100 rounded-3xl p-4.5 space-y-4 shadow-3xs">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-0.5">Armar Propuesta de Trueque</h4>
            
            {/* Yo ofrezco */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-700 flex justify-between">
                <span>Yo (Sofi) ofrezco:</span>
                <span className="text-indigo-600 font-extrabold">{offered.length} figus</span>
              </p>
              
              <div className="flex flex-wrap gap-1.5 min-h-[40px] p-2 bg-white rounded-xl border border-gray-100">
                {userDuplicates.map((num) => {
                  const isChecked = offered.includes(num);
                  return (
                    <button
                      key={num}
                      onClick={() => handleToggleOffered(num)}
                      className={`text-[11px] font-mono font-bold px-2 py-1 rounded-lg border transition ${
                        isChecked
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-3xs'
                          : 'bg-gray-50 text-gray-500 border-gray-100'
                      }`}
                    >
                      #{num}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Yo pido */}
            <div className="space-y-2 pt-3 border-t border-dashed border-gray-200">
              <p className="text-xs font-bold text-gray-700 flex justify-between">
                <span>Yo pido a {collector.name}:</span>
                <span className="text-green-700 font-extrabold">{requested.length} figus</span>
              </p>
              
              <div className="flex flex-wrap gap-1.5 min-h-[40px] p-2 bg-white rounded-xl border border-gray-100">
                {userMissings.map((num) => {
                  const isChecked = requested.includes(num);
                  return (
                    <button
                      key={num}
                      onClick={() => handleToggleRequested(num)}
                      className={`text-[11px] font-mono font-bold px-2 py-1 rounded-lg border transition ${
                        isChecked
                          ? 'bg-green-600 text-white border-green-600 shadow-3xs'
                          : 'bg-gray-50 text-gray-500 border-gray-100'
                      }`}
                    >
                      #{num}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Coordination Details */}
          <div className="bg-white border border-gray-100 rounded-3xl p-5 space-y-4 shadow-2xs">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <MapPin size={12} className="text-red-500" /> Pactar Punto de Encuentro Seguro
            </h4>

            {/* Safe Point Select */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-gray-400 uppercase">Punto Sugerido Oficial</label>
              <select
                value={selectedSafePoint}
                onChange={(e) => setSelectedSafePoint(e.target.value)}
                className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-bold text-gray-700 cursor-pointer"
              >
                {SUGGESTED_SAFE_POINTS.map((sp) => (
                  <option key={sp.id} value={sp.name}>
                    {sp.name} - {sp.address}
                  </option>
                ))}
              </select>
            </div>

            {/* Meet Hour */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                <Calendar size={10} /> Día y Horario aproximado
              </label>
              <input
                type="text"
                value={meetingTime}
                onChange={(e) => setMeetingTime(e.target.value)}
                placeholder="Hoy a las 18:00 hs o Sábado tarde"
                className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-bold text-gray-700"
              />
            </div>
          </div>

          <div className="bg-amber-50 rounded-2xl p-3 border border-amber-100 text-[10px] text-amber-800 leading-normal font-medium">
            🔒 <strong>Política de Seguridad:</strong> El punto de encuentro seleccionado es seguro por ser público e integrar circuito cerrado de cámaras. Nunca pactes reuniones en domicilios particulares.
          </div>

          <button
            onClick={handleSubmit}
            disabled={offered.length === 0 && requested.length === 0}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider shadow-md disabled:opacity-40 cursor-pointer"
          >
            Enviar Propuesta de Canje 🚀
          </button>

        </div>
      ) : (
        /* List Active Proposals Mode */
        <div className="space-y-3.5 max-h-[55vh] overflow-y-auto pr-1 animate-fade-in font-sans">
          
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Tus Intercambios Activos</h4>
          
          {activeProposals
            .filter((p) => p.receiverId === collector.id || p.senderId === collector.id)
            .map((p) => {
              const isCreator = p.senderId === 'sofi_user';
              
              return (
                <div key={p.id} className="bg-white border border-gray-100 rounded-3xl p-4.5 space-y-4 shadow-2xs">
                  
                  {/* Proposal Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl text-gray-50 p-1 bg-slate-100 rounded-full">{p.receiverAvatar}</span>
                      <div>
                        <p className="text-xs font-black text-slate-900">{p.receiverName}</p>
                        <p className="text-[9px] text-gray-400">Enviada: {p.date}</p>
                      </div>
                    </div>
                    {getStatusBadge(p.status)}
                  </div>

                  {/* Offered / Demanded */}
                  <div className="bg-slate-50/50 p-3 rounded-2xl border border-gray-50 flex justify-between gap-3 text-center text-xs">
                    <div className="flex-1">
                      <p className="text-[10px] uppercase font-bold text-gray-400 pl-0.5">Te doy</p>
                      <p className="font-extrabold text-indigo-700 text-sm mt-0.5">
                        {p.offeredStickers.length > 0 ? p.offeredStickers.map(n => `#${n}`).join(', ') : 'Ninguna'}
                      </p>
                    </div>
                    <div className="w-px bg-gray-200 self-stretch"></div>
                    <div className="flex-1">
                      <p className="text-[10px] uppercase font-bold text-gray-400 pl-0.5">Me da</p>
                      <p className="font-extrabold text-green-700 text-sm mt-0.5">
                        {p.requestedStickers.length > 0 ? p.requestedStickers.map(n => `#${n}`).join(', ') : 'Ninguna'}
                      </p>
                    </div>
                  </div>

                  {/* Meet point data */}
                  {p.safePointName && (
                    <div className="bg-amber-50/30 p-2.5 rounded-xl border border-amber-100/30 text-[10px] text-slate-600 leading-normal font-semibold space-y-1">
                      <p className="font-bold text-amber-900 flex items-center gap-1.5">
                        📍 {p.safePointName}
                      </p>
                      <p className="text-[9px] text-gray-400 pl-4">{p.meetingTime}</p>
                    </div>
                  )}

                  {/* Transition actions */}
                  {onUpdateProposalStatus && (
                    <div className="flex gap-2 pt-2 border-t border-gray-50">
                      {p.status === 'propuesto' && (
                        <>
                          <button
                            onClick={() => onUpdateProposalStatus(p.id, 'cancelado')}
                            className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-bold py-2 rounded-xl border border-red-100"
                          >
                            Rechazar/Cancelar ❌
                          </button>
                          
                          <button
                            onClick={() => onUpdateProposalStatus(p.id, 'aceptado')}
                            className="flex-grow flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold py-2 rounded-xl shadow-xs"
                          >
                            Aceptar Trueque ✅
                          </button>
                        </>
                      )}

                      {p.status === 'aceptado' && (
                        <button
                          onClick={() => onUpdateProposalStatus(p.id, 'en_coordinacion')}
                          className="w-full bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold py-2 rounded-xl flex items-center justify-center gap-1"
                        >
                          Coordinar Encuentro 🏪
                        </button>
                      )}

                      {p.status === 'en_coordinacion' && (
                        <>
                          <button
                            onClick={() => onUpdateProposalStatus(p.id, 'no_presento')}
                            className="flex-1 bg-gray-50 text-gray-600 text-[11px] font-bold py-2 rounded-xl"
                          >
                            No se presentó ⚠️
                          </button>
                          
                          <button
                            onClick={() => {
                              // Marks as realizado and open rating state
                              onUpdateProposalStatus(p.id, 'realizado');
                              setActiveRating({ proposalId: p.id, stars: 5 });
                            }}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white text-[11px] font-bold py-2 rounded-xl shadow-xs flex items-center justify-center gap-1"
                          >
                            <Check size={14} /> ¡Lo cambiamos! (Fin)
                          </button>
                        </>
                      )}

                      {p.status === 'realizado' && (
                        <div className="w-full py-1.5 text-center text-xs text-green-600 font-bold bg-green-50/50 rounded-xl border border-green-100">
                          🎉 Canje Completado Exitosamente
                        </div>
                      )}

                      {p.status === 'cancelado' && (
                        <div className="w-full py-1.5 text-center text-xs text-red-500 font-medium bg-red-50 rounded-xl">
                          Intercambio Cancelado
                        </div>
                      )}
                    </div>
                  )}

                  {/* Rating Selector Block */}
                  {activeRating?.proposalId === p.id && (
                    <div className="pt-3 border-t border-dashed border-gray-100 space-y-2 text-center animate-bounce">
                      <p className="text-xs font-black text-slate-800 flex items-center justify-center gap-1">
                        🏆 ¡Calificá tu experiencia con {p.receiverName}!
                      </p>
                      
                      <div className="flex justify-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((starIdx) => (
                          <button
                            key={starIdx}
                            onClick={() => {
                              onUpdateProposalStatus!(p.id, 'realizado', starIdx);
                              setActiveRating(null);
                            }}
                            className="p-1 cursor-pointer bg-slate-50 hover:bg-indigo-50 border border-gray-100 rounded-lg hover:scale-110 active:scale-95 transition"
                          >
                            <Star
                              size={20}
                              className={`stroke-amber-500 ${
                                starIdx <= activeRating.stars ? 'fill-amber-400' : 'fill-none'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      <p className="text-[10px] text-gray-400">Toca las estrellas para registrar tu puntaje seguro</p>
                    </div>
                  )}

                </div>
              );
            })}

          {activeProposals.filter((p) => p.receiverId === collector.id || p.senderId === collector.id).length === 0 && (
            <div className="text-center py-8 bg-gray-50 rounded-2xl">
              <p className="text-xs text-gray-400 font-bold">No hay intercambios activos con {collector.name}.</p>
              <p className="text-[10px] text-gray-400 mt-1">Armá una nueva propuesta arriba o por el chat.</p>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
