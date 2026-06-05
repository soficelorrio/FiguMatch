import React, { useState, useMemo } from 'react';
import { StickerState, StickerStatus } from '../types';
import { Search, Plus, Sparkles, Filter, CheckCircle2, ChevronRight, Edit3 } from 'lucide-react';

interface MyAlbumScreenProps {
  stickers: StickerState[];
  albumName: string;
  totalStickers: number;
  onUpdateStickerStatus: (number: number, status: StickerStatus) => void;
  onBulkAdd: (numbers: number[], status: StickerStatus) => void;
}

const STATUS_CONFIG: {
  [key in StickerStatus]: {
    label: string;
    bgClass: string;
    textClass: string;
    borderClass: string;
    dotClass: string;
  };
} = {
  faltante: {
    label: 'Me Falta',
    bgClass: 'bg-red-50 hover:bg-red-100/70',
    textClass: 'text-red-700',
    borderClass: 'border-red-200',
    dotClass: 'bg-red-500'
  },
  tengo: {
    label: 'La Tengo',
    bgClass: 'bg-green-50 hover:bg-green-100/70',
    textClass: 'text-green-700',
    borderClass: 'border-green-200',
    dotClass: 'bg-green-500'
  },
  repetida: {
    label: 'Repetida',
    bgClass: 'bg-indigo-50 hover:bg-indigo-100/70',
    textClass: 'text-indigo-700',
    borderClass: 'border-indigo-200',
    dotClass: 'bg-indigo-500'
  },
  reservada: {
    label: 'Reservada',
    bgClass: 'bg-amber-50 hover:bg-amber-100/70',
    textClass: 'text-amber-700',
    borderClass: 'border-amber-200',
    dotClass: 'bg-amber-500'
  },
  intercambiada: {
    label: 'Cambiada',
    bgClass: 'bg-gray-50 hover:bg-gray-100/70',
    textClass: 'text-gray-500 line-through',
    borderClass: 'border-gray-200',
    dotClass: 'bg-gray-400'
  }
};

export default function MyAlbumScreen({
  stickers,
  albumName,
  totalStickers,
  onUpdateStickerStatus,
  onBulkAdd
}: MyAlbumScreenProps) {
  const [selectedTab, setSelectedTab] = useState<'grilla' | 'detallado'>('grilla');
  const [filter, setFilter] = useState<'todos' | StickerStatus>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNumber, setActiveNumber] = useState<number | null>(null);
  
  // Bulk inputs
  const [bulkInput, setBulkInput] = useState('');
  const [bulkType, setBulkType] = useState<StickerStatus>('faltante');
  const [bulkSuccess, setBulkSuccess] = useState('');

  // Normalize full album state (1 to totalStickers)
  const fullAlbumStickers = useMemo(() => {
    const map = new Map<number, StickerStatus>();
    stickers.forEach((s) => map.set(s.number, s.status));

    const result: StickerState[] = [];
    for (let i = 1; i <= totalStickers; i++) {
      result.push({
        number: i,
        status: map.get(i) || 'tengo' // defaults to 'tengo' unless overridden
      });
    }
    return result;
  }, [stickers, totalStickers]);

  // Filter & Search stickers
  const filteredStickers = useMemo(() => {
    return fullAlbumStickers.filter((sticker) => {
      const matchesFilter = filter === 'todos' || sticker.status === filter;
      const matchesSearch = searchQuery === '' || sticker.number.toString() === searchQuery;
      return matchesFilter && matchesSearch;
    });
  }, [fullAlbumStickers, filter, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    let faltantesCount = 0;
    let repetidasCount = 0;
    let tieneCount = 0;

    fullAlbumStickers.forEach((s) => {
      if (s.status === 'faltante') faltantesCount++;
      else if (s.status === 'repetida') repetidasCount++;
      else if (s.status === 'tengo' || s.status === 'reservada' || s.status === 'intercambiada') tieneCount++;
    });

    return {
      faltantesCount,
      repetidasCount,
      tieneCount,
      percent: Math.min(100, Math.round((tieneCount / totalStickers) * 100))
    };
  }, [fullAlbumStickers, totalStickers]);

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkInput.trim()) return;

    // parse comma-separated numbers
    const numbers = bulkInput
      .split(',')
      .map((n) => parseInt(n.trim()))
      .filter((n) => !isNaN(n) && n >= 1 && n <= totalStickers);

    if (numbers.length > 0) {
      onBulkAdd(numbers, bulkType);
      setBulkInput('');
      setBulkSuccess(`¡Se cargaron ${numbers.length} figuritas como ${STATUS_CONFIG[bulkType].label}!`);
      setTimeout(() => setBulkSuccess(''), 3000);
    }
  };

  return (
    <div className="space-y-4 px-2 pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-tr from-indigo-900 to-indigo-800 text-white rounded-3xl p-5 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500 rounded-full mix-blend-multiply opacity-20 filter blur-xl transform translate-x-12 -translate-y-12"></div>
        <div className="relative">
          <span className="text-[10px] bg-indigo-500/50 backdrop-blur-md px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
            Álbum Activo
          </span>
          <h2 className="text-xl font-black mt-1 leading-tight">{albumName}</h2>
          
          {/* Progress Bar */}
          <div className="mt-4 space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-indigo-200">Completado: {stats.percent}% ({stats.tieneCount}/{totalStickers})</span>
            </div>
            <div className="w-full h-2 bg-indigo-950/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-linear-to-r from-yellow-400 to-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${stats.percent}%` }}
              ></div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-indigo-700/50 text-center">
            <div className="bg-indigo-950/30 p-2 rounded-2xl border border-indigo-700/20">
              <p className="text-[10px] text-indigo-300 font-semibold uppercase">Faltantes 🔴</p>
              <p className="text-base font-extrabold text-white mt-0.5">{stats.faltantesCount}</p>
            </div>
            <div className="bg-indigo-950/30 p-2 rounded-2xl border border-indigo-700/20">
              <p className="text-[10px] text-indigo-300 font-semibold uppercase">Repetidas 🔵</p>
              <p className="text-base font-extrabold text-white mt-0.5">{stats.repetidasCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mode Select Tabs */}
      <div className="flex bg-gray-100 p-1.5 rounded-2xl gap-1">
        <button
          onClick={() => setSelectedTab('grilla')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
            selectedTab === 'grilla' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Cuadrícula Visual
        </button>
        <button
          onClick={() => setSelectedTab('detallado')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
            selectedTab === 'detallado' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Resumen & Carga Rápida
        </button>
      </div>

      {selectedTab === 'grilla' ? (
        <>
          {/* Filters & Search */}
          <div className="space-y-2 bg-white border border-gray-100 p-3.5 rounded-2xl shadow-xs">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar número exacto de figurita..."
                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 pl-9 pr-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-gray-700"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={14} />
            </div>

            {/* Quick Status Filters */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 mt-1 scrollbar-none">
              <button
                onClick={() => setFilter('todos')}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                  filter === 'todos' ? 'bg-slate-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                Todas
              </button>
              {(Object.keys(STATUS_CONFIG) as StickerStatus[]).map((statusKey) => (
                <button
                  key={statusKey}
                  onClick={() => setFilter(statusKey)}
                  className={`py-1.5 px-3 rounded-lg text-xs font-bold whitespace-nowrap flex items-center gap-1 transition ${
                    filter === statusKey
                      ? `${STATUS_CONFIG[statusKey].bgClass} ${STATUS_CONFIG[statusKey].textClass} border-2 ${STATUS_CONFIG[statusKey].borderClass}`
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[statusKey].dotClass}`}></span>
                  {STATUS_CONFIG[statusKey].label}
                </button>
              ))}
            </div>
          </div>

          <div className="text-center py-1">
            <p className="text-[11px] text-gray-400 font-medium">💡 Tocá un número para editar su estado en el álbum.</p>
          </div>

          {/* Sticker Grid container with small screen optimization */}
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 max-h-[48vh] overflow-y-auto pr-1">
            {filteredStickers.map((sticker) => {
              const cfg = STATUS_CONFIG[sticker.status];
              return (
                <button
                  key={sticker.number}
                  id={`sticker-cell-${sticker.number}`}
                  onClick={() => setActiveNumber(sticker.number)}
                  className={`aspect-square flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-150 cursor-pointer relative ${cfg.bgClass} ${cfg.borderClass} hover:scale-105 active:scale-95 shadow-xs`}
                >
                  {/* Visual mini status dot inside square */}
                  <span className={`absolute top-2 right-2 w-2 h-2 rounded-full ${cfg.dotClass}`}></span>
                  
                  <span className="text-base font-black text-slate-800 leading-none">
                    #{sticker.number}
                  </span>
                  
                  <span className="text-[9px] font-black tracking-tight text-slate-600/90 mt-1 leading-none uppercase">
                    {cfg.label}
                  </span>
                </button>
              );
            })}
          </div>

          {filteredStickers.length === 0 && (
            <div className="text-center py-10 bg-gray-50 rounded-2xl">
              <p className="text-sm text-gray-400 font-bold">No se encontraron figuritas</p>
              <p className="text-xs text-gray-400 mt-1">Intentá ajustar o borrar los filtros cargados.</p>
            </div>
          )}
        </>
      ) : (
        /* Summary & Bulk Add Screen */
        <div className="space-y-4">
          
          {/* Comma-separated Quick Add Form */}
          <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-1.5">
              <Sparkles className="text-yellow-500" size={16} />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Carga Rápida de Lotes</h3>
            </div>
            
            <p className="text-[11px] text-gray-400 leading-normal">
              ¿Tenés una lista larga? Escribí los números de figurita separados por comas para cargarlos todos juntos.
            </p>

            {bulkSuccess && (
              <div className="bg-green-50 text-green-700 p-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 animate-bounce">
                <CheckCircle2 size={14} /> {bulkSuccess}
              </div>
            )}

            <form onSubmit={handleBulkSubmit} className="space-y-3.5">
              <div>
                <textarea
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                  placeholder="Ej: 12, 45, 78, 120, 134"
                  rows={3}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-gray-700"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setBulkType('faltante')}
                  className={`flex-1 py-2 text-center rounded-xl text-xs font-bold transition border ${
                    bulkType === 'faltante'
                      ? 'bg-red-50 text-red-600 border-red-200'
                      : 'bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100'
                  }`}
                >
                  Marcar como Faltantes 🔴
                </button>
                <button
                  type="button"
                  onClick={() => setBulkType('repetida')}
                  className={`flex-1 py-2 text-center rounded-xl text-xs font-bold transition border ${
                    bulkType === 'repetida'
                      ? 'bg-indigo-50 text-indigo-600 border-indigo-200'
                      : 'bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100'
                  }`}
                >
                  Marcar como Repetidas 🔵
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 text-white font-bold py-3 px-4 rounded-xl text-xs hover:bg-slate-800 transition flex items-center justify-center gap-1"
              >
                <Plus size={16} /> Bulk Agregar Lote
              </button>
            </form>
          </div>

          {/* Faltantes List */}
          <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                🔴 Mis Faltantes ({stats.faltantesCount})
              </h3>
              <button
                onClick={() => {
                  setFilter('faltante');
                  setSelectedTab('grilla');
                }}
                className="text-xs text-indigo-600 font-bold flex items-center hover:underline"
              >
                <span>Editar</span>
                <ChevronRight size={14} />
              </button>
            </div>
            
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {fullAlbumStickers
                .filter((s) => s.status === 'faltante')
                .map((s) => (
                  <span
                    key={s.number}
                    className="bg-red-50 text-red-700 font-mono text-[10px] font-bold px-2 py-1 rounded-lg border border-red-100"
                  >
                    #{s.number}
                  </span>
                ))}
              {stats.faltantesCount === 0 && (
                <p className="text-xs text-gray-400 pl-1 py-2">No agregaste figuritas faltantes aún.</p>
              )}
            </div>
          </div>

          {/* Repetidas List */}
          <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                🔵 Mis Repetidas ({stats.repetidasCount})
              </h3>
              <button
                onClick={() => {
                  setFilter('repetida');
                  setSelectedTab('grilla');
                }}
                className="text-xs text-indigo-600 font-bold flex items-center hover:underline"
              >
                <span>Editar</span>
                <ChevronRight size={14} />
              </button>
            </div>
            
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {fullAlbumStickers
                .filter((s) => s.status === 'repetida')
                .map((s) => (
                  <span
                    key={s.number}
                    className="bg-indigo-50 text-indigo-700 font-mono text-[10px] font-bold px-2 py-1 rounded-lg border border-indigo-100"
                  >
                    #{s.number}
                  </span>
                ))}
              {stats.repetidasCount === 0 && (
                <p className="text-xs text-gray-400 pl-1 py-2">No agregaste repetidas aún.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Interactive Sticker Status Editor Drawer/Modal Overlay */}
      {activeNumber !== null && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-end justify-center backdrop-blur-xs">
          <div className="bg-white rounded-t-3xl max-w-sm w-full p-6 space-y-5 animate-slide-up shadow-2xl">
            {/* Drawer Header */}
            <div className="flex justify-between items-center pb-2 border-b border-gray-50">
              <div>
                <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full uppercase">
                  {albumName}
                </span>
                <h4 className="text-lg font-black text-slate-900 mt-1">Figurita #{activeNumber}</h4>
              </div>
              <button
                onClick={() => setActiveNumber(null)}
                className="text-gray-400 hover:text-gray-600 font-bold text-sm bg-gray-100 hover:bg-gray-200 h-8 w-8 rounded-full flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            {/* Quick status selector buttons */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1 font-sans">
                Elegir el estado de esta figurita:
              </p>
              
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'faltante', label: '🔴 Me Falta', desc: 'Sofi necesita esta figurita para completar el álbum.' },
                  { id: 'tengo', label: '✅ La Tengo (Ya la pegué)', desc: 'Ya pegada en el álbum. No se ofrece para canje.' },
                  { id: 'repetida', label: '🔵 Tengo Repetida (Para Canje)', desc: 'Duplicado disponible para emparejar con otros usuarios.' },
                  { id: 'reservada', label: '🟠 Reservada (Pactada)', desc: 'Reservada para un matching o trueque en proceso.' },
                  { id: 'intercambiada', label: '⚪ Intercambiada / Cambiada', desc: 'Figurita que ya lograste canjear.' }
                ].map((sOption) => {
                  const isCurrent = fullAlbumStickers.find((s) => s.number === activeNumber)?.status === sOption.id;
                  return (
                    <button
                      key={sOption.id}
                      onClick={() => {
                        onUpdateStickerStatus(activeNumber, sOption.id as StickerStatus);
                        setActiveNumber(null);
                      }}
                      className={`w-full p-3 text-left rounded-xl border-2 flex items-center justify-between transition-all duration-150 ${
                        isCurrent
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                          : 'border-gray-50 bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-extrabold text-gray-800">{sOption.label}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{sOption.desc}</p>
                      </div>
                      {isCurrent && (
                        <div className="bg-indigo-600 text-white rounded-full p-0.5">
                          <CheckCircle2 size={16} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            
            <button
              onClick={() => setActiveNumber(null)}
              className="w-full bg-slate-900 text-white font-bold py-3 rounded-2xl text-xs hover:bg-slate-800 transition-all text-center uppercase"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
