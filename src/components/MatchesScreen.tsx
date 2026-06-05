import { useState, useMemo } from 'react';
import { MatchResult, StickerStatus, UserProfile, SafePoint } from '../types';
import { 
  Search, 
  MapPin, 
  Star, 
  Sparkles, 
  ShieldCheck, 
  MessageSquare, 
  ArrowUpRight, 
  BadgeHelp,
  Clock,
  Handshake,
  RotateCcw,
  CheckCircle2,
  Calendar
} from 'lucide-react';

interface MatchesScreenProps {
  matches: MatchResult[];
  userProfile?: UserProfile;
  safePoints: SafePoint[];
  onSelectMatch: (collectorId: string) => void;
  onOpenChat: (collectorId: string) => void;
  onProposeTrade: (collectorId: string) => void;
  onSelectSafePoint: (point: SafePoint) => void;
}

type FilterType = 
  | 'todos' 
  | 'alta' 
  | 'media' 
  | 'baja' 
  | 'cercanos' 
  | 'calificados' 
  | 'activos' 
  | 'puntos_seguros';

const SELECTION_PREFIXES: Record<string, string> = {
  argentina: 'ARG',
  brasil: 'BRA',
  brazil: 'BRA',
  mexico: 'MEX',
  méxico: 'MEX',
  usa: 'USA',
  'estados unidos': 'USA',
  españa: 'ESP',
  espana: 'ESP',
  spain: 'ESP',
  francia: 'FRA',
  france: 'FRA',
  coca: 'CC',
  cola: 'CC'
};

const getActivityMinutes = (time: string) => {
  const t = time.toLowerCase();
  if (t.includes('ahora') || t.includes('10 min')) return 10;
  if (t.includes('25 min')) return 25;
  if (t.includes('1 hora')) return 60;
  if (t.includes('ayer')) return 1440;
  return 9999;
};

export default function MatchesScreen({
  matches,
  userProfile,
  safePoints = [],
  onSelectMatch,
  onOpenChat,
  onProposeTrade,
  onSelectSafePoint
}: MatchesScreenProps) {
  const [filterType, setFilterType] = useState<FilterType>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [successPointAlert, setSuccessPointAlert] = useState<string | null>(null);

  const handleSelectPointAction = (sp: any) => {
    onSelectSafePoint(sp);
    setSuccessPointAlert(`Elegiste "${sp.name}" como punto de encuentro seguro.`);
    setTimeout(() => {
      setSuccessPointAlert(null);
    }, 3500);
  };

  // Filtering + Sorting Engine
  const processedMatches = useMemo(() => {
    let result = [...matches];

    // Search filter
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter((m) => {
        // Find selection mapping
        const matchedPrefix = Object.entries(SELECTION_PREFIXES).find(
          ([key]) => key.includes(term) || term.includes(key)
        )?.[1];

        const matchesName = m.collector.name.toLowerCase().includes(term);
        const matchesNeighborhood = m.collector.neighborhood.toLowerCase().includes(term);

        const collectorRepetidas = Object.entries(m.collector.stickers)
          .filter(([_, status]) => status === 'repetida')
          .map(([code]) => code.toLowerCase());
        const collectorFaltantes = Object.entries(m.collector.stickers)
          .filter(([_, status]) => status === 'faltante')
          .map(([code]) => code.toLowerCase());

        const matchesCode = collectorRepetidas.includes(term) || collectorFaltantes.includes(term);

        const matchesSelection = matchedPrefix ? (
          collectorRepetidas.some(code => code.toUpperCase().startsWith(matchedPrefix)) ||
          collectorFaltantes.some(code => code.toUpperCase().startsWith(matchedPrefix))
        ) : false;

        const matchesCodePartial = collectorRepetidas.some(code => code.includes(term)) ||
                                   collectorFaltantes.some(code => code.includes(term));

        return matchesName || matchesNeighborhood || matchesCode || matchesSelection || matchesCodePartial;
      });
    }

    // Filter type presets
    if (filterType === 'alta') {
      result = result.filter(m => m.matchLevel === 'alta' && m.collector.userType !== 'kiosco');
    } else if (filterType === 'media') {
      result = result.filter(m => m.matchLevel === 'media');
    } else if (filterType === 'baja') {
      result = result.filter(m => m.matchLevel === 'baja');
    } else if (filterType === 'puntos_seguros') {
      result = result.filter(m => m.collector.userType === 'kiosco' || m.collector.userType === 'club');
    }

    // Sorting overrides based on selected filter option
    result.sort((a, b) => {
      // Prioritize points of interest (kiosco and club) at the very top if Modo Menor & "Solo puntos seguros" is active
      if (userProfile?.minorModeActive && userProfile?.onlySafePointsActive) {
        const isASafe = a.collector.userType === 'kiosco' || a.collector.userType === 'club';
        const isBSafe = b.collector.userType === 'kiosco' || b.collector.userType === 'club';
        if (isASafe && !isBSafe) return -1;
        if (!isASafe && isBSafe) return 1;
      }

      if (filterType === 'cercanos') {
        return a.collector.distance - b.collector.distance;
      }
      if (filterType === 'calificados') {
        return b.collector.avgRating - a.collector.avgRating;
      }
      if (filterType === 'activos') {
        return getActivityMinutes(a.collector.activityTime) - getActivityMinutes(b.collector.activityTime);
      }
      // Default: dynamic compatibility sort (score ranks first)
      return b.matchScore - a.matchScore;
    });

    return result;
  }, [matches, filterType, searchTerm, userProfile?.minorModeActive, userProfile?.onlySafePointsActive]);

  return (
    <div className="space-y-4 px-2 pb-16">
      
      {/* Header section */}
      <div className="text-left py-1">
        <h2 className="text-2xl font-black text-slate-900 font-display flex items-center gap-1.5">
          Matches de Canje <Sparkles size={20} className="text-indigo-600 fill-indigo-100" />
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Encontrá coleccionistas cerca que tienen las figuritas que te faltan y necesitan las tuyas puestas en canje.
        </p>
      </div>

      {/* Alerta de Modo Menor Acompañado */}
      {userProfile?.minorModeActive && (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-4 space-y-2 text-left text-amber-900 shadow-3xs animate-fadeIn">
          <p className="text-xs font-black text-amber-800 flex items-center gap-1.5">
            🛡️ Modo Menor Acompañado Activado
          </p>
          <p className="text-[10.5px] font-bold text-amber-850 leading-normal">
            {userProfile?.onlySafePointsActive 
              ? "Para tu protección, se ha habilitado la opción 'Solo Puntos Seguros'. Los Kioscos y Clubes barriales de Palermo se muestran prioritariamente destacados al inicio." 
              : "Recomendamos que concretes todos tus trueques en puntos de encuentro oficiales en Palermo acompañado por tu tutor de confianza."}
          </p>
          <div className="flex gap-2">
            <span className="text-[9px] bg-white text-amber-800 font-extrabold px-2 py-0.5 rounded-full border border-amber-100 uppercase">
              Tutor: {userProfile.adultName || 'Mariana'}
            </span>
            {userProfile.onlySafePointsActive && (
              <span className="text-[9px] bg-amber-500 text-white font-extrabold px-2 py-0.5 rounded-full border border-amber-400 uppercase">
                Solo Puntos Seguros
              </span>
            )}
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="bg-white border border-slate-100 p-3 rounded-2xl shadow-3xs space-y-3">
        <div className="relative">
          <input
            id="searchmatches-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por usuario (Martina), figurita (ARG17), selección o zona..."
            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-slate-800 placeholder-slate-400"
          />
          <Search className="absolute left-3.5 top-3 text-slate-400" size={14} />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-2.5 text-xs text-slate-400 hover:text-slate-600 font-bold bg-slate-200/50 rounded px-1.5 py-0.5"
            >
              Borrar
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div>
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">Filtrar canjes</p>
          <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
            {[
              { id: 'todos', label: 'Todos' },
              { id: 'alta', label: '🔥 Coincidencia Alta' },
              { id: 'media', label: '⚡ Coincidencia Media' },
              { id: 'baja', label: '💤 Coincidencia Baja' },
              { id: 'cercanos', label: '📍 Más Cercanos' },
              { id: 'calificados', label: '⭐ Mejor Calificados' },
              { id: 'activos', label: '🕒 Activos Recientemente' },
              { id: 'puntos_seguros', label: '🏪 Puntos Seguros' }
            ].map((pill) => (
              <button
                key={pill.id}
                onClick={() => setFilterType(pill.id as FilterType)}
                className={`py-1.5 px-3 rounded-xl text-xs font-black whitespace-nowrap transition cursor-pointer flex-shrink-0 ${
                  filterType === pill.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Success point selected notifier */}
      {successPointAlert && (
        <div id="status-point-alert" className="bg-indigo-900 border border-indigo-700 text-white p-3.5 rounded-2xl text-xs font-black text-left animate-fadeIn flex items-center gap-2">
          <span className="text-emerald-400">🛡️</span>
          <span>{successPointAlert}</span>
        </div>
      )}

      {/* Puntos de encuentro alternativos / Puntos Seguros slider */}
      <div className="bg-slate-50/50 border border-slate-200/50 rounded-3xl p-4.5 space-y-3 text-left">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-black text-indigo-900 uppercase tracking-wider flex items-center gap-1.5 font-display">
            📍 Puntos seguros cercanos
          </h3>
          <span className="text-[10px] bg-indigo-100 text-indigo-800 font-extrabold px-2 py-0.5 rounded-full">
            Palermo
          </span>
        </div>
        <p className="text-[10.5px] font-bold text-slate-400 leading-snug">
          Lugares recomendados para intercambios seguros. Elegí uno para coordinar con tu coleccionista.
        </p>

        <div className="flex gap-3.5 overflow-x-auto pb-2 scrollbar-none">
          {safePoints.filter(p => p.neighborhood?.toLowerCase() === 'palermo').map((sp) => {
            const isVerySafe = sp.safetyPercent >= 90;
            const statusLabel = isVerySafe ? 'Muy seguro' : sp.safetyPercent >= 80 ? 'Seguro' : 'A revisar';
            const statusColor = isVerySafe 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
              : sp.safetyPercent >= 80 
                ? 'bg-emerald-50/55 text-emerald-600 border-emerald-200/50' 
                : 'bg-amber-50 text-amber-700 border-amber-200';

            return (
              <div 
                key={sp.id} 
                className="w-60 bg-white border border-slate-150 p-4 rounded-2xl shrink-0 flex flex-col justify-between space-y-2.5 hover:border-slate-350 transition-all shadow-3xs"
              >
                <div>
                  <div className="flex justify-between items-start gap-1">
                    <span className="text-xs font-black text-slate-850 truncate max-w-[150px]" title={sp.name}>
                      🏪 {sp.name}
                    </span>
                    <span className={`text-[8px] font-extrabold uppercase tracking-wide px-1.5 py-0.5 rounded border flex-shrink-0 ${statusColor}`}>
                      {statusLabel}
                    </span>
                  </div>
                  <p className="text-[9.5px] text-slate-400 mt-1 font-bold">
                    {sp.distance} · {statusLabel} · {sp.exchangesCount} intercambios
                  </p>
                </div>

                <div className="flex justify-between text-[10px] font-black bg-slate-50 border border-slate-100 p-1.5 rounded-xl text-slate-600">
                  <span>Seguridad: {sp.safetyPercent}%</span>
                  <span>⭐ {sp.rating}</span>
                </div>

                <p className="text-[10px] text-slate-650 leading-snug font-medium">
                  {sp.name} es un punto seguro cercano para concretar tus intercambios.
                </p>

                <button
                  id={`btn-choose-matches-${sp.id}`}
                  onClick={() => handleSelectPointAction(sp)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-2 px-2.5 rounded-xl text-[10.5px] transition cursor-pointer text-center flex items-center justify-center gap-1.5"
                >
                  Elegir como punto de encuentro
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Match Results list */}
      <div className="space-y-4 max-h-[58vh] overflow-y-auto pr-1">
        {processedMatches.map((m) => {
          const isKiosco = m.collector.userType === 'kiosco' || m.collector.userType === 'club';
          
          // Match level visual styling properties
          let badgeBg = 'bg-slate-100 text-slate-700';
          let compatibilityTag = 'Coincidencia baja';
          let badgeBorder = 'border-slate-200';
          let ringColor = 'border-slate-100';

          if (isKiosco) {
            badgeBg = 'bg-amber-500 text-white';
            compatibilityTag = 'Punto Seguro Oficial';
            badgeBorder = 'border-amber-400';
            ringColor = 'border-amber-100 ring-2 ring-amber-50';
          } else if (m.matchLevel === 'alta') {
            badgeBg = 'bg-emerald-600 text-white';
            compatibilityTag = 'Coincidencia alta';
            badgeBorder = 'border-emerald-500';
            ringColor = 'border-emerald-100 ring-2 ring-emerald-50/50';
          } else if (m.matchLevel === 'media') {
            badgeBg = 'bg-amber-500 text-white';
            compatibilityTag = 'Coincidencia media';
            badgeBorder = 'border-amber-400';
            ringColor = 'border-amber-100 ring-2 ring-amber-50/50';
          }

          return (
            <div
              key={m.collector.id}
              className={`bg-white border rounded-3xl p-5 shadow-3xs transition-all relative overflow-hidden ${ringColor}`}
            >
              {/* Top Banner with Badges / Match level */}
              <div className="flex justify-between items-start mb-3.5">
                <div className="flex items-center gap-2">
                  <span className="text-3xl p-1 bg-slate-50 rounded-full border border-slate-100 block">
                    {m.collector.avatar}
                  </span>
                  <div>
                    <div className="flex items-center gap-1">
                      <h4 className="font-extrabold text-[15px] text-slate-900 leading-tight">
                        {m.collector.name}
                      </h4>
                      {m.collector.isVerified && (
                        <ShieldCheck size={14} className="text-blue-500 fill-blue-50 stroke-[2.5]" />
                      )}
                    </div>
                    {/* Zone name */}
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      {m.collector.neighborhood} · {m.collector.distance} km
                    </p>
                  </div>
                </div>

                {/* Match level compatibility tag */}
                <div className="flex flex-col items-end">
                  <span className={`text-[9px] font-black uppercase tracking-wider py-1 px-2.5 rounded-full ${badgeBg} ${badgeBorder} border`}>
                    {compatibilityTag} · {m.compatibilityPercent}%
                  </span>
                  <span className="text-[9px] text-slate-400 font-bold flex items-center gap-0.5 mt-1">
                    <Clock size={10} /> {m.collector.activityTime}
                  </span>
                </div>
              </div>

              {/* Collector rating statistics */}
              <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 bg-slate-50/50 px-3 py-1.5 rounded-xl border border-slate-100 mb-3.5">
                <span className="flex items-center gap-0.5 text-amber-500 font-extrabold">
                  <Star size={11} className="fill-amber-400 stroke-amber-500" /> {m.collector.avgRating}
                </span>
                <span>•</span>
                <span>{m.collector.exchangesCount} intercambios realizados</span>
              </div>

              {/* Intersection detail lists */}
              <div className="space-y-2.5 bg-slate-50/40 p-3.5 rounded-2xl border border-slate-100">
                {isKiosco ? (
                  <div className="text-xs text-amber-900 font-medium leading-relaxed">
                    <p className="font-extrabold text-[11px] uppercase tracking-wide text-amber-700 flex items-center gap-1.5 mb-1">
                      🏪 ¿Por qué conviene este punto seguro?
                    </p>
                    {m.explanation}
                  </div>
                ) : (
                  <>
                    {/* Offers to User */}
                    <div>
                      <p className="text-[11px] font-black text-emerald-700 flex items-center gap-1 mb-1">
                        🎁 {m.collector.name} tiene estas que te faltan:
                      </p>
                      {m.theyOfferToUser.length > 0 ? (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {m.theyOfferToUser.map((code) => (
                            <span
                              key={code}
                              className="bg-emerald-50 text-emerald-800 font-mono text-[10px] font-extrabold px-2 py-0.5 rounded-lg border border-emerald-100"
                            >
                              {code}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-400 italic">No tiene figuritas de tus faltantes inmediatas.</p>
                      )}
                    </div>

                    {/* Needs from User */}
                    <div className="pt-2 border-t border-dashed border-slate-200">
                      <p className="text-[11px] font-black text-indigo-700 flex items-center gap-1 mb-1">
                        🤝 Vos tenés estas que {m.collector.name} necesita:
                      </p>
                      {m.userOffersToThem.length > 0 ? (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {m.userOffersToThem.map((code) => (
                            <span
                              key={code}
                              className="bg-indigo-50 text-indigo-800 font-mono text-[10px] font-extrabold px-2 py-0.5 rounded-lg border border-indigo-100"
                            >
                              {code}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-400 italic">No tenés repetidas declaradas útiles para esta persona.</p>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Explanatory custom text phrase */}
              <div className="mt-3 bg-indigo-50/30 border border-indigo-100/40 p-3 rounded-2xl text-[11px] text-slate-700 leading-normal font-semibold">
                {m.explanation}
              </div>

              {/* Actions row: Ver match, Chatear, Proponer intercambio */}
              <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <button
                  id={`btn-vermatch-${m.collector.id}`}
                  onClick={() => onSelectMatch(m.collector.id)}
                  className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-2.5 px-3 rounded-xl text-xs transition border border-slate-200 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Ver match
                </button>
                <button
                  id={`btn-chat-${m.collector.id}`}
                  onClick={() => onOpenChat(m.collector.id)}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare size={13} /> Chatear
                </button>
                {!isKiosco && (
                  <button
                    id={`btn-proponer-${m.collector.id}`}
                    onClick={() => onProposeTrade(m.collector.id)}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Proponer intercambio
                  </button>
                )}
              </div>

            </div>
          );
        })}

        {processedMatches.length === 0 && (
          <div className="text-center py-10 bg-slate-50 rounded-3xl border border-slate-150 p-6">
            <BadgeHelp size={36} className="text-slate-400 mx-auto stroke-1" />
            <p className="text-sm text-slate-600 font-extrabold mt-2.5">No se encontraron matches para tu búsqueda</p>
            <p className="text-xs text-slate-400 mt-1">Intentá escribir otro código (como ARG17) o cambiar el filtro.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterType('todos');
              }}
              className="mt-4 bg-white border border-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs hover:bg-slate-50 transition cursor-pointer"
            >
              Restablecer filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
