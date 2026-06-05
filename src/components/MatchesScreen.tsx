import { useState, useMemo } from 'react';
import { MatchResult, UserProfile, NearbyCollector } from '../types';
import { Search, MapPin, Star, Sparkles, Filter, ShieldCheck, ArrowRightLeft, MessageCircleCode } from 'lucide-react';

interface MatchesScreenProps {
  matches: MatchResult[];
  onSelectMatch: (collectorId: string) => void;
  onOpenChat: (collectorId: string) => void;
}

export default function MatchesScreen({
  matches,
  onSelectMatch,
  onOpenChat
}: MatchesScreenProps) {
  const [filterLevel, setFilterLevel] = useState<'todos' | 'alta' | 'media' | 'puntos_seguros'>('todos');
  const [filterDistance, setFilterDistance] = useState<number>(5); // max km
  const [sortCriteria, setSortCriteria] = useState<'score' | 'distance' | 'rating'>('score');
  const [searchTerm, setSearchTerm] = useState('');

  // Process filters
  const filteredMatches = useMemo(() => {
    let result = [...matches];

    // Search query (matches names or neighborhood)
    if (searchTerm.trim() !== '') {
      result = result.filter(
        (m) =>
          m.collector.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.collector.neighborhood.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by Match Level
    if (filterLevel === 'alta') {
      result = result.filter((m) => m.matchLevel === 'alta');
    } else if (filterLevel === 'media') {
      result = result.filter((m) => m.matchLevel === 'media');
    } else if (filterLevel === 'puntos_seguros') {
      result = result.filter(
        (m) => m.collector.userType === 'kiosco' || m.collector.userType === 'club'
      );
    }

    // Filter by distance
    result = result.filter((m) => m.collector.distance <= filterDistance);

    // Sorting logic
    if (sortCriteria === 'distance') {
      result.sort((a, b) => a.collector.distance - b.collector.distance);
    } else if (sortCriteria === 'rating') {
      result.sort((a, b) => b.collector.avgRating - a.collector.avgRating);
    } else {
      // score sorting (precalculated)
      result.sort((a, b) => b.matchScore - a.matchScore);
    }

    return result;
  }, [matches, filterLevel, filterDistance, sortCriteria, searchTerm]);

  return (
    <div className="space-y-4 px-2 pb-16">
      
      {/* Upper header */}
      <div className="text-left py-1">
        <h2 className="text-2xl font-black text-gray-900 font-display flex items-center gap-1.5">
          Canjes Cercanos <Sparkles size={20} className="text-indigo-600 fill-indigo-100" />
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          FiguMatch analiza tu álbum y te conecta automáticamente con quienes tienen las figuritas que te faltan.
        </p>
      </div>

      {/* Search and Filters Drawer Trigger */}
      <div className="space-y-3 bg-white border border-gray-100 p-3.5 rounded-3xl shadow-2xs">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por usuario o barrio..."
            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 pl-9 pr-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-gray-700"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={14} />
        </div>

        {/* Quick horizontal filter category toggles */}
        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'todos', label: 'Todos los Matches' },
            { id: 'alta', label: '🔥 Coincidencia Alta' },
            { id: 'media', label: '⚡ Coincidencia Media' },
            { id: 'puntos_seguros', label: '🏪 Puntos Seguros' }
          ].map((lvl) => (
            <button
              key={lvl.id}
              onClick={() => setFilterLevel(lvl.id as any)}
              className={`py-1.5 px-3 rounded-lg text-[11px] font-bold whitespace-nowrap transition cursor-pointer ${
                filterLevel === lvl.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-gray-50 text-gray-500 hover:text-gray-700'
              }`}
            >
              {lvl.label}
            </button>
          ))}
        </div>

        {/* Distance slider & Sort options */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-50">
          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400">
              Distancia máx: {filterDistance} km
            </label>
            <input
              type="range"
              min="0.5"
              max="5"
              step="0.5"
              value={filterDistance}
              onChange={(e) => setFilterDistance(parseFloat(e.target.value))}
              className="w-full accent-indigo-600 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer mt-1.5"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400">
              Ordenar canjes por
            </label>
            <select
              value={sortCriteria}
              onChange={(e) => setSortCriteria(e.target.value as any)}
              className="w-full bg-gray-50 border-0 rounded-xl py-1 px-2 text-[11px] font-bold text-gray-600 focus:ring-1 focus:ring-indigo-500 mt-1 cursor-pointer"
            >
              <option value="score">Mayor Match</option>
              <option value="distance">Cercanía (km)</option>
              <option value="rating">Reputación ★</option>
            </select>
          </div>
        </div>
      </div>

      {/* Match Results list */}
      <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
        {filteredMatches.map((m) => {
          const isPuntoSeguro = m.collector.userType === 'kiosco' || m.collector.userType === 'club';
          const matchCoincides = m.matchLevel === 'alta' || m.matchLevel === 'media';

          return (
            <div
              key={m.collector.id}
              className={`bg-white border rounded-3xl p-4.5 space-y-3.5 shadow-2xs transition-all relative overflow-hidden ${
                m.matchLevel === 'alta'
                  ? 'border-indigo-100 ring-2 ring-indigo-50/50'
                  : 'border-gray-100'
              }`}
            >
              {/* Badge Overlay */}
              <div className="absolute top-0 right-0 flex items-center">
                {isPuntoSeguro ? (
                  <span className="bg-amber-100 text-amber-800 text-[9px] font-black tracking-wider uppercase px-3 py-1 rounded-bl-2xl">
                    Punto Seguro 🤝
                  </span>
                ) : m.matchLevel === 'alta' ? (
                  <span className="bg-indigo-600 text-white text-[9px] font-black tracking-wider uppercase px-3 py-1 rounded-bl-xl flex items-center gap-0.5 animate-pulse">
                    Match Alto 🔥
                  </span>
                ) : m.matchLevel === 'media' ? (
                  <span className="bg-amber-50 text-amber-700 text-[9px] font-black tracking-wider uppercase px-3 py-1 rounded-bl-xl border-l border-b border-amber-100">
                    Match Medio ⚡
                  </span>
                ) : (
                  <span className="bg-gray-100 text-gray-500 text-[9px] font-bold uppercase px-3 py-1 rounded-bl-xl">
                    Cercano 📍
                  </span>
                )}
              </div>

              {/* Profile Details Bar */}
              <div className="flex items-center gap-2.5 pr-20">
                <span className="text-3xl p-1 bg-gray-50 rounded-full border border-gray-100 shadow-3xs">
                  {m.collector.avatar}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="font-extrabold text-sm text-gray-900 truncate">
                      {m.collector.name}
                    </p>
                    {m.collector.isVerified && (
                      <ShieldCheck size={14} className="text-blue-500 fill-blue-50 stroke-[2.5] flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-gray-400 mt-0.5 font-medium">
                    <span className="flex items-center gap-0.5">
                      <MapPin size={10} className="text-red-400" />
                      {m.collector.neighborhood} ({m.collector.distance} km)
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                      <Star size={10} className="fill-amber-400 stroke-amber-500" />
                      {m.collector.avgRating}
                    </span>
                    <span>•</span>
                    <span>{m.collector.exchangesCount} canjes</span>
                  </div>
                </div>
              </div>

              {/* Match Intersection Section */}
              {isPuntoSeguro ? (
                <div className="bg-amber-50/50 p-2.5 rounded-2xl border border-amber-100/50 text-[11px] text-amber-800">
                  <p className="font-bold flex items-center gap-1">
                    🏪 {m.collector.name} es un Kiosco/Club adherido
                  </p>
                  <p className="font-light mt-0.5 text-amber-700/90 leading-normal">
                    ¡Cuenta con un gran stock de figuritas libres para canje, facilidades de reunión y es recomendado como punto de encuentro en Palermo.
                  </p>
                </div>
              ) : matchCoincides ? (
                <div className="bg-indigo-50/45 p-3 rounded-2xl border border-indigo-100/50 space-y-2 text-xs">
                  
                  {/* Highly polished exact match descriptions required by the prompt */}
                  {m.matchLevel === 'alta' && (
                    <div className="bg-indigo-600/10 p-2.5 rounded-xl border border-indigo-200/55 text-indigo-900 font-bold mb-2">
                      ✨ Coincidencia alta: ambos tienen figuritas útiles para intercambiar.
                    </div>
                  )}

                  {m.theyOfferToUser.length > 0 && (
                    <div className="text-slate-700 font-semibold leading-relaxed">
                      👉 <strong className="text-slate-900">{m.collector.name}</strong> tiene {m.theyOfferToUser.map(code => `${code}`).join(' y ')}, que te faltan.
                    </div>
                  )}

                  {m.userOffersToThem.length > 0 && (
                    <div className="text-slate-700 font-semibold leading-relaxed pt-1.5 border-t border-dashed border-indigo-100">
                      👈 Vos tenés {m.userOffersToThem.map(code => `${code}`).join(' y ')}, que {m.collector.name} necesita.
                    </div>
                  )}

                </div>
              ) : (
                <div className="bg-gray-50 p-2.5 rounded-2xl text-[10px] text-gray-400 font-medium">
                  Completando el mismo álbum en Palermo. ¡Preguntale si quiere pactar intercambios a futuro!
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  id={`btn-matchDetail-${m.collector.id}`}
                  onClick={() => onSelectMatch(m.collector.id)}
                  className="flex-1 bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold py-2.5 px-4 rounded-xl text-xs hover:bg-indigo-100 transition flex items-center justify-center gap-1"
                >
                  <ArrowRightLeft size={13} />
                  Ver Match Completo
                </button>
                <button
                  id={`btn-chatOpen-${m.collector.id}`}
                  onClick={() => onOpenChat(m.collector.id)}
                  className="bg-indigo-600 text-white font-bold p-2.5 rounded-xl hover:bg-indigo-700 transition flex items-center justify-center aspect-square"
                  title="Chatear para cambiar"
                >
                  <MessageCircleCode size={16} />
                </button>
              </div>

            </div>
          );
        })}

        {filteredMatches.length === 0 && (
          <div className="text-center py-10 bg-gray-50 rounded-3xl">
            <p className="text-sm text-gray-400 font-bold">No se encontraron matches válidos</p>
            <p className="text-xs text-gray-400 mt-1">Modificá el rango de distancia o los filtros.</p>
          </div>
        )}
      </div>
    </div>
  );
}
