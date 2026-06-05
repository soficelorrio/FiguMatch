import React, { useState, useMemo } from 'react';
import { StickerState, StickerStatus } from '../types';
import { 
  SELECTIONS, 
  FWC_INITIAL_CODES, 
  FWC_FINAL_CODES, 
  CC_PROMO_CODES, 
  getAllMainAlbumCodes, 
  getAllStickerCodes 
} from '../data';
import { Search, Plus, Sparkles, Filter, CheckCircle2, ChevronRight, X, Heart, Award, ArrowRight } from 'lucide-react';

interface MyAlbumScreenProps {
  stickers: StickerState[];
  albumName: string;
  totalStickers: number;
  onUpdateStickerStatus: (code: string, status: StickerStatus) => void;
  onBulkAdd: (codes: string[], status: StickerStatus) => void;
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
  totalStickers = 980,
  onUpdateStickerStatus,
  onBulkAdd
}: MyAlbumScreenProps) {
  const [selectedTab, setSelectedTab] = useState<'grilla' | 'detallado'>('grilla');
  
  // Filtering states
  const [statusFilter, setStatusFilter] = useState<'todos' | StickerStatus>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Section layout selector
  // Sections: 'inicio' (FWC 00 to 8), 'selecciones', 'history' (FWC 9 to 19), 'cocacola'
  const [activeSection, setActiveSection] = useState<'todos' | 'inicio' | 'selecciones' | 'history' | 'cocacola'>('inicio');
  const [selectedSelection, setSelectedSelection] = useState<string>('ARG'); // default to Argentina

  const [activeCode, setActiveCode] = useState<string | null>(null);

  // Bulk input
  const [bulkInput, setBulkInput] = useState('');
  const [bulkType, setBulkType] = useState<StickerStatus>('faltante');
  const [bulkSuccess, setBulkSuccess] = useState('');
  const [bulkError, setBulkError] = useState('');

  // Re-map actual state of every sticker code in a dictionary
  const stickerStateDict = useMemo(() => {
    const dict: { [code: string]: StickerStatus } = {};
    stickers.forEach((s) => {
      dict[s.code] = s.status;
    });
    return dict;
  }, [stickers]);

  // Generate full sticker list with statuses based on selection/section filters
  const visibleStickers = useMemo(() => {
    let baseCodes: string[] = [];

    if (activeSection === 'todos') {
      baseCodes = getAllStickerCodes();
    } else if (activeSection === 'inicio') {
      baseCodes = FWC_INITIAL_CODES;
    } else if (activeSection === 'selecciones') {
      // Pick stickers of currently selected selection
      baseCodes = Array.from({ length: 20 }, (_, i) => `${selectedSelection}${i + 1}`);
    } else if (activeSection === 'history') {
      baseCodes = FWC_FINAL_CODES;
    } else if (activeSection === 'cocacola') {
      baseCodes = CC_PROMO_CODES;
    }

    // Convert into elements
    const result = baseCodes.map((code) => ({
      code,
      status: stickerStateDict[code] || 'faltante'
    }));

    // Apply status and text query filters
    return result.filter((sticker) => {
      const matchesStatus = statusFilter === 'todos' || sticker.status === statusFilter;
      const matchesSearch = searchQuery === '' || sticker.code.toUpperCase().includes(searchQuery.toUpperCase());
      return matchesStatus && matchesSearch;
    });
  }, [activeSection, selectedSelection, stickerStateDict, statusFilter, searchQuery]);

  // Calculate high-fidelity stats breakdown
  const stats = useMemo(() => {
    // 1. Progress total del album principal (980 codes)
    const mainCodes = getAllMainAlbumCodes();
    let mainOwned = 0;
    let totalMainFaltantes = 0;
    let totalMainRepetidas = 0;

    mainCodes.forEach((code) => {
      const status = stickerStateDict[code] || 'faltante';
      if (status !== 'faltante') {
        mainOwned++;
      }
      if (status === 'faltante') {
        totalMainFaltantes++;
      } else if (status === 'repetida') {
        totalMainRepetidas++;
      }
    });

    // 2. Progress opcional de Coca-Cola por separado (14 codes)
    let ccOwned = 0;
    let ccRepetidas = 0;
    let ccFaltantes = 0;
    CC_PROMO_CODES.forEach((code) => {
      const status = stickerStateDict[code] || 'faltante';
      if (status !== 'faltante') {
        ccOwned++;
      }
      if (status === 'faltante') {
        ccFaltantes++;
      } else if (status === 'repetida') {
        ccRepetidas++;
      }
    });

    // 3. Progreso FWC Especiales (Seccion inicial + final = 20 codes)
    const fwcCodes = [...FWC_INITIAL_CODES, ...FWC_FINAL_CODES];
    let fwcOwned = 0;
    fwcCodes.forEach((code) => {
      const status = stickerStateDict[code] || 'faltante';
      if (status !== 'faltante') {
        fwcOwned++;
      }
    });

    return {
      mainOwned,
      mainPercent: Math.min(100, Math.round((mainOwned / 980) * 100)),
      ccOwned,
      ccPercent: Math.min(100, Math.round((ccOwned / 14) * 100)),
      fwcOwned,
      totalMainFaltantes,
      totalMainRepetidas,
      ccFaltantes,
      ccRepetidas
    };
  }, [stickerStateDict]);

  // Bulk addition parse + validation
  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBulkError('');
    setBulkSuccess('');
    if (!bulkInput.trim()) return;

    // Split and format codes
    const enteredCodes = bulkInput
      .toUpperCase()
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    const validCodesPool = getAllStickerCodes();
    
    // Check if any entered code does not exist in the whole database
    const invalidCodes = enteredCodes.filter(code => !validCodesPool.includes(code));
    if (invalidCodes.length > 0) {
      setBulkError(`Ese código no existe en el álbum Panini Mundial 2026: ${invalidCodes[0]}`);
      return;
    }

    if (enteredCodes.length > 0) {
      onBulkAdd(enteredCodes, bulkType);
      setBulkInput('');
      setBulkSuccess(`¡Se cargaron ${enteredCodes.length} figuritas como ${STATUS_CONFIG[bulkType].label}!`);
      setTimeout(() => setBulkSuccess(''), 3000);
    }
  };

  // Suffix visual label helper
  const getStickerDescription = (code: string) => {
    if (code === '00') return 'Emblema Panini Logo';
    if (code.startsWith('FWC')) {
      if (code === 'FWC1' || code === 'FWC2') return 'Official Emblem';
      if (code === 'FWC3') return 'Official Mascots';
      if (code === 'FWC4') return 'Official Slogan';
      if (code === 'FWC5') return 'Official Ball';
      if (code === 'FWC6') return 'Host Country: Canada';
      if (code === 'FWC7') return 'Host Country: Mexico';
      if (code === 'FWC8') return 'Host Country: USA';
      return 'FIFA World Cup History';
    }
    if (code.startsWith('CC')) {
      return 'Coca-Cola Promo Sticker';
    }

    // Is a national team selection code
    const countryCode = code.slice(0, 3);
    const num = parseInt(code.slice(3));
    const country = SELECTIONS.find(s => s.code === countryCode)?.name || 'Selección';

    if (num === 1) return `${country} - Escudo / Emblema`;
    if (num === 13) return `${country} - Foto Grupal Team Photo`;
    if ((num >= 2 && num <= 12) || (num >= 14 && num <= 20)) {
      return `${country} - Jugador #${num}`;
    }
    return `${country} - Figurita`;
  };

  // Get count by country selection directly
  const getCountryStats = (code: string) => {
    let owned = 0;
    for (let i = 1; i <= 20; i++) {
      const status = stickerStateDict[`${code}${i}`] || 'faltante';
      if (status !== 'faltante') owned++;
    }
    return {
      owned,
      percent: Math.round((owned / 20) * 100)
    };
  };

  return (
    <div className="space-y-4 px-2 pb-16 font-sans">
      
      {/* High-Fidelity Stats Showcase Banner */}
      <div className="bg-gradient-to-tr from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden">
        <div className="absolute -top-10 -right-10 h-32 w-32 bg-indigo-500 rounded-full opacity-20 filter blur-xl"></div>
        <div className="relative space-y-4">
          <div>
            <span className="text-[10px] bg-indigo-500/40 backdrop-blur-md px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
              Álbum Oficial
            </span>
            <h2 className="text-xl font-black mt-1 leading-none font-display text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-indigo-100 to-white">
              {albumName}
            </h2>
          </div>

          {/* Core breakdown progress values */}
          <div className="space-y-3 pt-1">
            {/* Main World Cup Progess (980 figus) */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-300 tracking-wider">
                <span>🏆 Álbum Principal</span>
                <span className="text-amber-300 font-extrabold font-mono text-xs">
                  {stats.mainPercent}% ({stats.mainOwned}/980)
                </span>
              </div>
              <p className="text-[10.5px] text-indigo-200/90 leading-none">
                “Tenés {stats.mainOwned} de 980 figuritas.”
              </p>
              <div className="w-full h-1.5 bg-indigo-950/60 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-rose-500 via-amber-400 to-yellow-400 transition-all duration-500"
                  style={{ width: `${stats.mainPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Minor Coca-Cola Promo Progress (14 figus) */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-300 tracking-wider">
                <span>🥤 Coca-Cola Promo Stickers</span>
                <span className="text-rose-400 font-extrabold font-mono text-xs">
                  {stats.ccPercent}% ({stats.ccOwned}/14)
                </span>
              </div>
              <p className="text-[10.5px] text-rose-200/90 leading-none">
                “Tenés {stats.ccOwned} de 14 stickers promocionales.”
              </p>
              <div className="w-full h-1.5 bg-indigo-950/60 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-rose-500 transition-all duration-500"
                  style={{ width: `${stats.ccPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Mini Counter Quick Badges */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
            <div className="bg-slate-900/40 p-2 rounded-2xl border border-slate-800 text-center">
              <p className="text-[9px] text-slate-400 font-black uppercase">Faltantes Totales</p>
              <p className="text-sm font-black text-white mt-0.5">{stats.totalMainFaltantes + stats.ccFaltantes}</p>
            </div>
            <div className="bg-slate-900/40 p-2 rounded-2xl border border-slate-800 text-center">
              <p className="text-[9px] text-slate-400 font-black uppercase">Repetidas para Canje</p>
              <p className="text-sm font-black text-indigo-300 mt-0.5">{stats.totalMainRepetidas + stats.ccRepetidas}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Primary tab switcher */}
      <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100 gap-0.5">
        <button
          onClick={() => setSelectedTab('grilla')}
          className={`flex-1 py-2 text-xs font-black rounded-xl transition-all duration-150 ${
            selectedTab === 'grilla' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          🗂️ Cuadrícula de Secciones
        </button>
        <button
          onClick={() => setSelectedTab('detallado')}
          className={`flex-1 py-2 text-xs font-black rounded-xl transition-all duration-150 ${
            selectedTab === 'detallado' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          ⚡ Carga Rápida o Resumen
        </button>
      </div>

      {selectedTab === 'grilla' ? (
        <>
          {/* Sectional Area Navigation Tabs */}
          <div className="bg-white border border-slate-100 p-3 rounded-3xl shadow-2xs space-y-3.5">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Navegación del Álbum</p>
              
              <div className="flex gap-1 overflow-x-auto pb-1 mt-1.5 scrollbar-none">
                {[
                  { id: 'inicio', label: '1. FWC Inicial', badge: '00-FWC8' },
                  { id: 'selecciones', label: '2. Selecciones', badge: '48 Equipos' },
                  { id: 'history', label: '3. FWC History', badge: 'FWC9-FWC19' },
                  { id: 'cocacola', label: '4. Coca-Cola Promo', badge: 'CC1-CC14 (Opcional)' },
                  { id: 'todos', label: '🔍 Ver Todo', badge: '994 códigos' }
                ].map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => {
                      setActiveSection(sec.id as any);
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-black whitespace-nowrap flex flex-col items-start transition-all ${
                      activeSection === sec.id
                        ? 'bg-slate-950 text-white shadow-xs'
                        : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <span>{sec.label}</span>
                    <span className="text-[8px] font-bold opacity-60 mt-0.5">{sec.badge}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Selection Custom Dropdown filter */}
            {activeSection === 'selecciones' && (
              <div className="pt-1 border-t border-slate-50 flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap leading-none">
                  Filtro por Selección:
                </label>
                <div className="flex-1 flex gap-2">
                  <select
                    value={selectedSelection}
                    onChange={(e) => setSelectedSelection(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-black text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white"
                  >
                    {SELECTIONS.map((team) => {
                      const cStats = getCountryStats(team.code);
                      return (
                        <option key={team.code} value={team.code}>
                          {team.code} - {team.name} ({cStats.owned}/20)
                        </option>
                      );
                    })}
                  </select>

                  {/* Visual fast rating indicator for selected country */}
                  <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 flex items-center justify-center text-xs font-bold text-amber-800 whitespace-nowrap">
                    ⭐ {getCountryStats(selectedSelection).owned}/20
                  </div>
                </div>
              </div>
            )}

            {/* Quick status button toggles & query */}
            <div className="pt-2 border-t border-slate-55 flex flex-col gap-2">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar código de figurita (ej: ARG17)..."
                  className="w-full bg-slate-50 border border-slate-150 rounded-xl py-2 pl-9 pr-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-600 text-slate-700"
                />
                <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
              </div>

              {/* Status scroll menu */}
              <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => setStatusFilter('todos')}
                  className={`py-1.5 px-3 rounded-lg text-[10px] uppercase font-black tracking-wider whitespace-nowrap transition-all ${
                    statusFilter === 'todos' ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  Todas ({visibleStickers.length})
                </button>
                {(Object.keys(STATUS_CONFIG) as StickerStatus[]).map((st) => {
                  const filteredCount = visibleStickers.filter(item => item.status === st).length;
                  return (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`py-1.5 px-3 rounded-lg text-[10px] uppercase font-black tracking-wider whitespace-nowrap flex items-center gap-1 transition-all ${
                        statusFilter === st
                          ? `${STATUS_CONFIG[st].bgClass} ${STATUS_CONFIG[st].textClass} border border-indigo-200`
                          : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[st].dotClass}`}></span>
                      {STATUS_CONFIG[st].label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Current Selection Progress details */}
          {activeSection === 'selecciones' && (
            <div className="bg-indigo-50/50 border border-indigo-100 pl-3.5 pr-2.5 py-2.5 rounded-2xl flex justify-between items-center text-[11px] font-bold text-indigo-900 leading-tight">
              <span>{SELECTIONS.find(s=>s.code === selectedSelection)?.name}: <strong>Tenés {getCountryStats(selectedSelection).owned} de 20 figuritas.</strong></span>
              <span className="text-[10px] bg-indigo-100/70 text-indigo-800 px-2.5 py-0.5 rounded-md font-black">
                {getCountryStats(selectedSelection).percent}%
              </span>
            </div>
          )}

          {activeSection === 'cocacola' && (
            <div className="bg-rose-50/50 border border-rose-100 pl-3.5 pr-2.5 py-2.5 rounded-2xl flex justify-between items-center text-[11px] font-bold text-rose-900 leading-tight">
              <span>Promo Coca-Cola: <strong>Tenés {stats.ccOwned} de 14 stickers.</strong></span>
              <span className="text-[10px] bg-rose-100/70 text-rose-800 px-2.5 py-0.5 rounded-md font-black">
                {stats.ccPercent}%
              </span>
            </div>
          )}

          {/* Dynamic Sticker Grid container with small screen optimization */}
          <div className="grid grid-cols-4 gap-2.5 max-h-[44vh] overflow-y-auto pr-1">
            {visibleStickers.map((sticker) => {
              const cfg = STATUS_CONFIG[sticker.status];
              return (
                <button
                  key={sticker.code}
                  id={`sticker-cell-${sticker.code}`}
                  onClick={() => setActiveCode(sticker.code)}
                  className={`aspect-square flex flex-col items-center justify-center p-2 rounded-2xl border transition-all duration-150 cursor-pointer relative ${cfg.bgClass} ${cfg.borderClass} hover:scale-105 active:scale-95 shadow-2xs`}
                >
                  {/* Status Indicator circle */}
                  <span className={`absolute top-2 right-2 w-2 h-2 rounded-full ${cfg.dotClass}`}></span>
                  
                  <span className="text-xs font-black text-slate-850 leading-none">
                    {sticker.code}
                  </span>
                  
                  {/* Minified descriptor */}
                  <span className="text-[7.5px] font-black tracking-tight text-slate-500/80 mt-1.5 leading-none uppercase truncate max-w-full">
                    {cfg.label}
                  </span>
                </button>
              );
            })}
          </div>

          {visibleStickers.length === 0 && (
            <div className="text-center py-10 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <p className="text-xs text-slate-400 font-bold">No se encontraron figuritas con estas características.</p>
              <p className="text-[10px] text-slate-400 mt-1">Intentá cambiar los filtros o el buscador de códigos.</p>
            </div>
          )}
        </>
      ) : (
        /* Summary & Bulk Add Screen */
        <div className="space-y-4">
          
          {/* Comma-separated Quick Add Form */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-1.5">
              <Sparkles className="text-yellow-500" size={16} />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest pl-0.5">Carga Rápida de Lotes</h3>
            </div>
            
            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
              Escribí los códigos de figuritas separados por comas para cargarlos todos juntos. Se validará que pertenezcan al álbum oficial.
            </p>

            {bulkSuccess && (
              <div className="bg-green-50 text-green-700 p-2.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 border border-green-200 animate-pulse">
                <CheckCircle2 size={14} className="text-green-600" /> {bulkSuccess}
              </div>
            )}

            {bulkError && (
              <div className="bg-red-50 text-red-700 p-3 rounded-2xl text-[11px] font-black border border-red-200 leading-snug">
                ⚠️ {bulkError}
              </div>
            )}

            <form onSubmit={handleBulkSubmit} className="space-y-3.5">
              <div>
                <textarea
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                  placeholder="Ej: ARG17, BRA10, MEX4, FWC11"
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-150 rounded-2xl py-3 px-4 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-slate-700 uppercase"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setBulkType('faltante')}
                  className={`flex-1 py-2 text-center rounded-xl text-xs font-black transition border-2 ${
                    bulkType === 'faltante'
                      ? 'bg-red-50 text-red-750 border-red-350 shadow-2xs'
                      : 'bg-slate-50 text-slate-400 border-transparent hover:bg-slate-100'
                  }`}
                >
                  Me falta 🔴
                </button>
                <button
                  type="button"
                  onClick={() => setBulkType('repetida')}
                  className={`flex-1 py-2 text-center rounded-xl text-xs font-black transition border-2 ${
                    bulkType === 'repetida'
                      ? 'bg-indigo-50 text-indigo-750 border-indigo-350 shadow-2xs'
                      : 'bg-slate-50 text-slate-400 border-transparent hover:bg-slate-100'
                  }`}
                >
                  Repetida 🔵
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-950 text-white font-black py-3 px-4 rounded-xl text-xs hover:bg-slate-900 transition flex items-center justify-center gap-1"
              >
                <Plus size={15} /> Confirmar Carga por Lote
              </button>
            </form>
          </div>

          {/* Quick list view of current selection elements */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-2xs space-y-4">
            <div>
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest pl-0.5">🏆 Progreso por Selección</h4>
              <p className="text-[10px] text-slate-400 pl-0.5 mt-0.5">Presiona "Ver Todo" para editar estados correspondientes:</p>
            </div>

            <div className="space-y-3 divide-y divide-slate-100 max-h-48 overflow-y-auto pr-1">
              {SELECTIONS.map((country) => {
                const cStats = getCountryStats(country.code);
                return (
                  <div key={country.code} className="flex justify-between items-center text-xs pt-2.5 first:pt-0">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="font-mono font-black text-indigo-600 bg-indigo-50/65 px-1.5 py-0.5 rounded text-[10px]">{country.code}</span>
                      <span className="font-bold text-slate-800 truncate pr-2">{country.name}</span>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[10px] font-bold text-slate-500">
                        {cStats.owned} de 20 un.
                      </span>
                      <span 
                        onClick={() => {
                          setActiveSection('selecciones');
                          setSelectedSelection(country.code);
                          setSelectedTab('grilla');
                        }}
                        className="text-[9px] bg-slate-10s0 text-indigo-600 hover:underline font-black cursor-pointer bg-slate-50 px-2 py-0.5 rounded-md"
                      >
                        Ver Grid ➔
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Interactive Sticker Status Editor Drawer/Modal Overlay */}
      {activeCode !== null && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-end justify-center backdrop-blur-xs">
          <div className="bg-white rounded-t-3xl max-w-sm w-full p-6 space-y-4.5 animate-slide-up shadow-2xl">
            {/* Drawer Header */}
            <div className="flex justify-between items-center pb-2 border-b border-slate-50">
              <div className="pr-4">
                <span className="text-[10px] bg-indigo-150 text-indigo-700 font-extrabold px-2 py-0.5 rounded-full uppercase leading-none">
                  Panini Mundial 2026
                </span>
                <h4 className="text-base font-black text-slate-900 mt-1 flex items-center gap-1">
                  Figurita #{activeCode}
                </h4>
                <p className="text-[10.5px] text-indigo-700 font-bold mt-1 bg-indigo-50 px-2 py-1 rounded-lg">
                  📋 {getStickerDescription(activeCode)}
                </p>
              </div>
              <button
                onClick={() => setActiveCode(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm bg-slate-100 hover:bg-slate-200 h-8 w-8 rounded-full flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            {/* Quick status selector buttons */}
            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 font-sans">
                Elegir el estado de esta figurita:
              </p>
              
              <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto pr-1">
                {[
                  { id: 'faltante', label: '🔴 Me Falta', desc: 'Sofi necesita esta figurita para completar el álbum.' },
                  { id: 'tengo', label: '✅ La Tengo (Ya la pegué)', desc: 'Ya pegada en el álbum. No se ofrece para canje.' },
                  { id: 'repetida', label: '🔵 Tengo Repetida (Para Canje)', desc: 'Duplicado disponible para emparejar con otros usuarios.' },
                  { id: 'reservada', label: '🟠 Reservada (Pactada)', desc: 'Reservada para un matching o trueque en proceso.' },
                  { id: 'intercambiada', label: 'White Intercambiada / Cambiada', desc: 'Figurita que ya lograste canjear.' }
                ].map((sOption) => {
                  const isCurrent = (stickerStateDict[activeCode] || 'faltante') === sOption.id;
                  return (
                    <button
                      key={sOption.id}
                      onClick={() => {
                        onUpdateStickerStatus(activeCode, sOption.id as StickerStatus);
                        setActiveCode(null);
                      }}
                      className={`w-full p-2.5 text-left rounded-xl border-2 flex items-center justify-between transition-all duration-150 ${
                        isCurrent
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-2xs'
                          : 'border-slate-50 bg-slate-50 hover:bg-slate-100/90'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-black text-slate-800">{sOption.label}</p>
                        <p className="text-[9.5px] text-slate-400 mt-0.5 leading-tight">{sOption.desc}</p>
                      </div>
                      {isCurrent && (
                        <div className="bg-indigo-605 text-indigo-600 rounded-full">
                          <CheckCircle2 size={16} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            
            <button
              onClick={() => setActiveCode(null)}
              className="w-full bg-slate-900 text-white font-black py-2.5 rounded-2xl text-xs hover:bg-slate-800 transition-all text-center uppercase"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
