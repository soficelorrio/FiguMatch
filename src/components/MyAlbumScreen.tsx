import React, { useState, useMemo } from 'react';
import { StickerState, StickerStatus } from '../types';
import { 
  SELECTIONS, 
  FWC_INITIAL_CODES, 
  FWC_FINAL_CODES, 
  CC_PROMO_CODES, 
  getAllMainAlbumCodes, 
  getAllStickerCodes,
  COPA_AMERICA_GROUPS,
  COPA_AMERICA_TEAMS,
  getCopaAmericaStickerCodes,
  INITIAL_COPA_STICKERS,
  INITIAL_STICKER_LIST
} from '../data';
import { Search, Plus, Sparkles, Filter, CheckCircle2, ChevronRight, ChevronDown, ChevronUp, X, Heart, Award, ArrowRight } from 'lucide-react';

interface WorldCupGroup {
  id: string;
  name: string;
  teams: string[];
}

const worldCupGroups: WorldCupGroup[] = [
  {
    id: "all",
    name: "Todas",
    teams: [
      "MEX", "RSA", "KOR", "CZE", "CAN", "BIH", "QAT", "SUI", "BRA", "MAR", "HAI", "SCO",
      "USA", "PAR", "AUS", "TUR", "GER", "CUW", "CIV", "ECU", "NED", "JPN", "SWE", "TUN",
      "BEL", "EGY", "IRN", "NZL", "ESP", "CPV", "KSA", "URU", "FRA", "SEN", "IRQ", "NOR",
      "ARG", "ALG", "AUT", "JOR", "POR", "COD", "UZB", "COL", "ENG", "CRO", "GHA", "PAN"
    ]
  },
  {
    id: "group-a",
    name: "Grupo A",
    teams: ["MEX", "RSA", "KOR", "CZE"]
  },
  {
    id: "group-b",
    name: "Grupo B",
    teams: ["CAN", "BIH", "QAT", "SUI"]
  },
  {
    id: "group-c",
    name: "Grupo C",
    teams: ["BRA", "MAR", "HAI", "SCO"]
  },
  {
    id: "group-d",
    name: "Grupo D",
    teams: ["USA", "PAR", "AUS", "TUR"]
  },
  {
    id: "group-e",
    name: "Grupo E",
    teams: ["GER", "CUW", "CIV", "ECU"]
  },
  {
    id: "group-f",
    name: "Grupo F",
    teams: ["NED", "JPN", "SWE", "TUN"]
  },
  {
    id: "group-g",
    name: "Grupo G",
    teams: ["BEL", "EGY", "IRN", "NZL"]
  },
  {
    id: "group-h",
    name: "Grupo H",
    teams: ["ESP", "CPV", "KSA", "URU"]
  },
  {
    id: "group-i",
    name: "Grupo I",
    teams: ["FRA", "SEN", "IRQ", "NOR"]
  },
  {
    id: "group-j",
    name: "Grupo J",
    teams: ["ARG", "ALG", "AUT", "JOR"]
  },
  {
    id: "group-k",
    name: "Grupo K",
    teams: ["POR", "COD", "UZB", "COL"]
  },
  {
    id: "group-l",
    name: "Grupo L",
    teams: ["ENG", "CRO", "GHA", "PAN"]
  }
];

const teamsData: Record<string, { name: string; code: string }> = {
  MEX: { name: "México", code: "MEX" },
  RSA: { name: "Sudáfrica", code: "RSA" },
  KOR: { name: "Corea del Sur", code: "KOR" },
  CZE: { name: "República Checa", code: "CZE" },
  CAN: { name: "Canadá", code: "CAN" },
  BIH: { name: "Bosnia y Herzegovina", code: "BIH" },
  QAT: { name: "Qatar", code: "QAT" },
  SUI: { name: "Suiza", code: "SUI" },
  BRA: { name: "Brasil", code: "BRA" },
  MAR: { name: "Marruecos", code: "MAR" },
  HAI: { name: "Haití", code: "HAI" },
  SCO: { name: "Escocia", code: "SCO" },
  USA: { name: "Estados Unidos", code: "USA" },
  PAR: { name: "Paraguay", code: "PAR" },
  AUS: { name: "Australia", code: "AUS" },
  TUR: { name: "Turquía", code: "TUR" },
  GER: { name: "Alemania", code: "GER" },
  CUW: { name: "Curazao", code: "CUW" },
  CIV: { name: "Costa de Marfil", code: "CIV" },
  ECU: { name: "Ecuador", code: "ECU" },
  NED: { name: "Países Bajos", code: "NED" },
  JPN: { name: "Japón", code: "JPN" },
  SWE: { name: "Suecia", code: "SWE" },
  TUN: { name: "Túnez", code: "TUN" },
  BEL: { name: "Bélgica", code: "BEL" },
  EGY: { name: "Egipto", code: "EGY" },
  IRN: { name: "Irán", code: "IRN" },
  NZL: { name: "Nueva Zelanda", code: "NZL" },
  ESP: { name: "España", code: "ESP" },
  CPV: { name: "Cabo Verde", code: "CPV" },
  KSA: { name: "Arabia Saudita", code: "KSA" },
  URU: { name: "Uruguay", code: "URU" },
  FRA: { name: "Francia", code: "FRA" },
  SEN: { name: "Senegal", code: "SEN" },
  IRQ: { name: "Irak", code: "IRQ" },
  NOR: { name: "Noruega", code: "NOR" },
  ARG: { name: "Argentina", code: "ARG" },
  ALG: { name: "Argelia", code: "ALG" },
  AUT: { name: "Austria", code: "AUT" },
  JOR: { name: "Jordania", code: "JOR" },
  POR: { name: "Portugal", code: "POR" },
  COD: { name: "República Democrática del Congo", code: "COD" },
  UZB: { name: "Uzbekistán", code: "UZB" },
  COL: { name: "Colombia", code: "COL" },
  ENG: { name: "Inglaterra", code: "ENG" },
  CRO: { name: "Croacia", code: "CRO" },
  GHA: { name: "Ghana", code: "GHA" },
  PAN: { name: "Panamá", code: "PAN" }
};

function generateTeamStickers(teamCode: string) {
  return Array.from({ length: 20 }, (_, index) => {
    const number = index + 1;
    return {
      id: `${teamCode}${number}`,
      code: `${teamCode}${number}`,
      teamCode: teamCode,
      number: number,
      type:
        number === 1
          ? "Escudo / Emblema"
          : number === 13
          ? "Foto grupal"
          : "Jugador",
      status: "Me falta"
    };
  });
}

interface AlbumSection {
  id: "all" | "fwc-inicial" | "selecciones" | "fwc-history" | "coca-cola";
  name: string;
  order: number;
}

const albumSections: AlbumSection[] = [
  {
    id: "all",
    name: "Todas",
    order: 1
  },
  {
    id: "fwc-inicial",
    name: "FWC Inicial",
    order: 2
  },
  {
    id: "selecciones",
    name: "Selecciones",
    order: 3
  },
  {
    id: "fwc-history",
    name: "FWC History",
    order: 4
  },
  {
    id: "coca-cola",
    name: "Coca-Cola Promo Stickers",
    order: 5
  }
];

const defaultActiveSection = "all";

interface MyAlbumScreenProps {
  stickers: StickerState[];
  albumName: string;
  totalStickers: number;
  onUpdateStickerStatus: (code: string, status: StickerStatus) => void;
  onBulkAdd: (codes: string[], status: StickerStatus) => void;
  activeAlbumId: string;
  onSelectAlbum: (albumId: string) => void;
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
  onBulkAdd,
  activeAlbumId,
  onSelectAlbum
}: MyAlbumScreenProps) {
  const [selectedTab, setSelectedTab] = useState<'grilla' | 'detallado'>('grilla');
  
  // High fidelity Multi-Album browsing state
  const [browsingAlbums, setBrowsingAlbums] = useState(true);
  
  // Filtering states
  const [statusFilter, setStatusFilter] = useState<'todos' | StickerStatus>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Section layout selector
  const [activeSection, setActiveSection] = useState<any>(defaultActiveSection);
  const [selectedSelection, setSelectedSelection] = useState<string>('ARG'); // default to Argentina

  // Selecciones-specific dynamic state
  const [activeGroupTab, setActiveGroupTab] = useState<string>('all');
  const [selectionsFilter, setSelectionsFilter] = useState<'todos' | StickerStatus>('todos');
  const [expandedTeams, setExpandedTeams] = useState<Record<string, boolean>>({ ARG: true });

  // Copa América specific dynamic states
  const [activeGroupTabCopa, setActiveGroupTabCopa] = useState<string>('all');
  const [selectedSelectionCopa, setSelectedSelectionCopa] = useState<string>('ARG');
  const [expandedTeamsCopa, setExpandedTeamsCopa] = useState<Record<string, boolean>>({ ARG: true });

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
    const isCopa = activeAlbumId === 'copa_america_2024';
    let baseCodes: string[] = [];

    if (isCopa) {
      if (activeSection === 'all') {
        baseCodes = getCopaAmericaStickerCodes();
      } else if (activeSection === 'introduccion') {
        baseCodes = Array.from({ length: 4 }, (_, i) => `INTR${i + 1}`);
      } else if (activeSection === 'sedes') {
        baseCodes = Array.from({ length: 14 }, (_, i) => `HCI${i + 1}`);
      } else if (activeSection === 'selecciones') {
        baseCodes = Array.from({ length: 22 }, (_, i) => `${selectedSelectionCopa}${i + 1}`);
      } else if (activeSection === 'leyendas') {
        baseCodes = Array.from({ length: 18 }, (_, i) => `LEG${i + 1}`);
      } else if (activeSection === 'roll-of-honour') {
        baseCodes = ['ROH1', 'ROH2'];
      } else if (activeSection === 'extra-stickers') {
        baseCodes = Array.from({ length: 16 }, (_, i) => `EXT${i + 1}`);
      } else {
        baseCodes = getCopaAmericaStickerCodes();
      }
    } else {
      if (activeSection === 'all') {
        baseCodes = getAllStickerCodes();
      } else if (activeSection === 'fwc-inicial') {
        baseCodes = FWC_INITIAL_CODES;
      } else if (activeSection === 'selecciones') {
        baseCodes = Array.from({ length: 20 }, (_, i) => `${selectedSelection}${i + 1}`);
      } else if (activeSection === 'fwc-history') {
        baseCodes = FWC_FINAL_CODES;
      } else if (activeSection === 'coca-cola') {
        baseCodes = CC_PROMO_CODES;
      } else {
        baseCodes = getAllStickerCodes();
      }
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
  }, [activeAlbumId, activeSection, selectedSelection, selectedSelectionCopa, stickerStateDict, statusFilter, searchQuery]);

  // Calculate high-fidelity stats breakdown
  const stats = useMemo(() => {
    const isCopa = activeAlbumId === 'copa_america_2024';

    if (isCopa) {
      const allCopaCodes = getCopaAmericaStickerCodes();
      let mainOwned = 0;
      let totalMainFaltantes = 0;
      let totalMainRepetidas = 0;

      let extraOwned = 0;
      let totalExtraFaltantes = 0;
      let totalExtraRepetidas = 0;

      allCopaCodes.forEach((code) => {
        const isExtra = code.startsWith('EXT');
        const status = stickerStateDict[code] || 'faltante';

        if (isExtra) {
          if (status !== 'faltante') {
            extraOwned++;
          }
          if (status === 'faltante') {
            totalExtraFaltantes++;
          } else if (status === 'repetida') {
            totalExtraRepetidas++;
          }
        } else {
          if (status !== 'faltante') {
            mainOwned++;
          }
          if (status === 'faltante') {
            totalMainFaltantes++;
          } else if (status === 'repetida') {
            totalMainRepetidas++;
          }
        }
      });

      return {
        mainOwned,
        mainPercent: Math.min(100, Math.round((mainOwned / 430) * 100)),
        ccOwned: extraOwned,
        ccPercent: Math.min(100, Math.round((extraOwned / 16) * 100)),
        fwcOwned: 0,
        totalMainFaltantes,
        totalMainRepetidas,
        ccFaltantes: totalExtraFaltantes,
        ccRepetidas: totalExtraRepetidas
      };
    } else {
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
    }
  }, [activeAlbumId, stickerStateDict]);

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

    const isCopa = activeAlbumId === 'copa_america_2024';
    const validCodesPool = isCopa ? getCopaAmericaStickerCodes() : getAllStickerCodes();
    
    // Check if any entered code does not exist in the whole database
    const invalidCodes = enteredCodes.filter(code => !validCodesPool.includes(code));
    if (invalidCodes.length > 0) {
      const displayAlbumName = isCopa ? "Panini Copa América USA 2024" : "Panini Mundial 2026";
      setBulkError(`Ese código no existe en el álbum ${displayAlbumName}: ${invalidCodes[0]}`);
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
    const isCopa = activeAlbumId === 'copa_america_2024';
    if (isCopa) {
      if (code.startsWith('INTR')) {
        return `Introducción - Sticker #${code.slice(4)}`;
      }
      if (code.startsWith('HCI')) {
        return `Sede / Host City - Sticker #${code.slice(3)}`;
      }
      if (code.startsWith('LEG')) {
        return `Copa América Leyenda #${code.slice(3)}`;
      }
      if (code.startsWith('ROH')) {
        return `Roll of Honour #${code.slice(3)}`;
      }
      if (code.startsWith('EXT')) {
        return `Extra Sticker #${code.slice(3)}`;
      }
      const countryCode = code.slice(0, 3);
      const num = parseInt(code.slice(3));
      const country = COPA_AMERICA_TEAMS[countryCode]?.name || 'Selección';
      if (num === 1) return `${country} - Escudos / Emblemas`;
      if (num === 13) return `${country} - Foto Grupal Team Photo`;
      return `${country} - Jugador #${num}`;
    }

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
    const isCopa = activeAlbumId === 'copa_america_2024';
    const limit = isCopa ? 22 : 20;
    let owned = 0;
    for (let i = 1; i <= limit; i++) {
      const status = stickerStateDict[`${code}${i}`] || 'faltante';
      if (status !== 'faltante') owned++;
    }
    return {
      owned,
      percent: Math.round((owned / limit) * 100)
    };
  };

  // Standalone storage-based tracker for Mis Álbumes overview statistics
  const getAlbumStatistics = (albumId: string) => {
    let list: StickerState[] = [];
    if (albumId === 'mundial_2026') {
      const stored = localStorage.getItem('figumatch_stickers_list');
      list = stored ? JSON.parse(stored) : INITIAL_STICKER_LIST;
      const mainCodes = getAllMainAlbumCodes();
      let owned = 0;
      list.forEach(s => {
        if (mainCodes.includes(s.code) && s.status !== 'faltante') {
          owned++;
        }
      });
      return { owned, total: 980 };
    } else {
      const stored = localStorage.getItem('figumatch_stickers_list_copa_america_2024');
      list = stored ? JSON.parse(stored) : INITIAL_COPA_STICKERS;
      let owned = 0;
      list.forEach(s => {
        if (!s.code.startsWith('EXT') && s.status !== 'faltante') {
          owned++;
        }
      });
      return { owned, total: 430 };
    }
  };

  const isCopa = activeAlbumId === 'copa_america_2024';

  const currentSections = isCopa
    ? [
        { id: 'all', name: 'Todos los stickers', order: 1 },
        { id: 'introduccion', name: 'Introducción', order: 2 },
        { id: 'sedes', name: 'Sedes / Host Cities', order: 3 },
        { id: 'selecciones', name: 'Selecciones', order: 4 },
        { id: 'leyendas', name: 'Leyendas Copa América', order: 5 },
        { id: 'roll-of-honour', name: 'Roll of Honour', order: 6 },
        { id: 'extra-stickers', name: 'Extra Stickers', order: 7 }
      ]
    : [
        { id: 'all', name: 'Todas', order: 1 },
        { id: 'fwc-inicial', name: 'FIFA Inicial', order: 2 },
        { id: 'selecciones', name: 'Selecciones', order: 3 },
        { id: 'fwc-history', name: 'FIFA Historial', order: 4 },
        { id: 'coca-cola', name: 'Coca-Cola Promo', order: 5 }
      ];

  const statsMundial = getAlbumStatistics('mundial_2026');
  const statsCopa = getAlbumStatistics('copa_america_2024');

  if (browsingAlbums) {
    return (
      <div className="space-y-5 px-2 pb-16 font-sans">
        <div className="text-left py-2">
          <h2 className="text-2xl font-black text-gray-950 font-display flex items-center gap-2">
            Mis Álbumes 📚
          </h2>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
            Elegí entre tus colecciones activas para gestionar tus figuritas, revisar el progreso y ver sugerencias de canjes óptimos.
          </p>
        </div>

        {/* List of cards */}
        <div className="space-y-4">
          {/* Card 1: Panini Mundial 2026 */}
          <div className="bg-gradient-to-tr from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between min-h-[180px]">
            <div className="absolute -top-10 -right-10 h-32 w-32 bg-indigo-500 rounded-full opacity-10 filter blur-xl"></div>
            <div>
              <span className="text-[10px] bg-indigo-500/30 border border-indigo-400/20 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Álbum Oficial
              </span>
              <h3 className="text-xl font-black mt-1.5 font-display text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-white">
                Panini Mundial 2026
              </h3>
              
              <div className="mt-4 space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-slate-300">
                  <span>Progreso de Colección</span>
                  <span className="text-amber-300 font-extrabold">{statsMundial.owned} / {statsMundial.total}</span>
                </div>
                <div className="w-full h-1.5 bg-indigo-950/60 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-rose-500 via-amber-400 to-yellow-400"
                    style={{ width: `${(statsMundial.owned / statsMundial.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onSelectAlbum('mundial_2026');
                setBrowsingAlbums(false);
              }}
              className="mt-5 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold py-3 rounded-2xl shadow-md text-xs tracking-wider uppercase transition-all duration-150 transform active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              Abrir álbum <ArrowRight size={14} />
            </button>
          </div>

          {/* Card 2: Panini Copa América USA 2024 */}
          <div className="bg-gradient-to-tr from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between min-h-[180px]">
            <div className="absolute -top-10 -right-10 h-32 w-32 bg-emerald-500 rounded-full opacity-10 filter blur-xl"></div>
            <div>
              <span className="text-[10px] bg-emerald-500/30 border border-emerald-400/20 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Álbum Oficial
              </span>
              <h3 className="text-xl font-black mt-1.5 font-display text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-white">
                Panini Copa América USA 2024
              </h3>
              
              <div className="mt-4 space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-slate-300">
                  <span>Progreso de Colección</span>
                  <span className="text-emerald-300 font-extrabold">{statsCopa.owned} / {statsCopa.total}</span>
                </div>
                <div className="w-full h-1.5 bg-emerald-950/60 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
                    style={{ width: `${(statsCopa.owned / statsCopa.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onSelectAlbum('copa_america_2024');
                setBrowsingAlbums(false);
              }}
              className="mt-5 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3 rounded-2xl shadow-md text-xs tracking-wider uppercase transition-all duration-150 transform active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              Abrir álbum <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 px-2 pb-16 font-sans">
      
      {/* Back to Albums list indicator */}
      <div className="flex justify-between items-center py-1">
        <button
          onClick={() => setBrowsingAlbums(true)}
          className="text-xs font-black text-slate-550 hover:text-slate-900 transition flex items-center gap-1 cursor-pointer"
        >
          ⬅️ Volver a mis álbumes
        </button>
        <span className="text-[10px] font-mono text-slate-400 font-bold bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full uppercase leading-none">
          Cod: {activeAlbumId === 'copa_america_2024' ? 'COPA24' : 'MUND26'}
        </span>
      </div>

      {/* High-Fidelity Stats Showcase Banner */}
      <div className={`bg-gradient-to-tr ${isCopa ? 'from-emerald-950 via-slate-900 to-emerald-900' : 'from-indigo-950 via-slate-900 to-indigo-900'} text-white rounded-3xl p-5 shadow-lg relative overflow-hidden`}>
        <div className={`absolute -top-10 -right-10 h-32 w-32 ${isCopa ? 'bg-emerald-500' : 'bg-indigo-500'} rounded-full opacity-20 filter blur-xl`}></div>
        <div className="relative space-y-4">
          <div>
            <span className={`text-[10px] ${isCopa ? 'bg-emerald-500/40' : 'bg-indigo-500/40'} backdrop-blur-md px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider`}>
              Álbum Oficial
            </span>
            <h2 className="text-xl font-black mt-1 leading-none font-display text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-indigo-100 to-white">
              {albumName}
            </h2>
          </div>

          {/* Core breakdown progress values */}
          <div className="space-y-3 pt-1">
            {/* Main World Cup Progess */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-300 tracking-wider">
                <span>🏆 Álbum Principal</span>
                <span className="text-amber-300 font-extrabold font-mono text-xs">
                  {stats.mainPercent}% ({stats.mainOwned}/{isCopa ? 430 : 980})
                </span>
              </div>
              <p className="text-[10.5px] text-indigo-200/90 leading-none">
                “Tenés {stats.mainOwned} de {isCopa ? 430 : 980} stickers.”
              </p>
              <div className="w-full h-1.5 bg-indigo-950/60 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${isCopa ? 'from-emerald-500 to-teal-400' : 'from-rose-500 via-amber-400 to-yellow-400'} transition-all duration-500`}
                  style={{ width: `${stats.mainPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Minor Promo Progress */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-300 tracking-wider">
                <span>{isCopa ? '✨ Extra Stickers' : '🥤 Coca-Cola Promo Stickers'}</span>
                <span className={`${isCopa ? 'text-emerald-400' : 'text-rose-400'} font-extrabold font-mono text-xs`}>
                  {stats.ccPercent}% ({stats.ccOwned}/{isCopa ? 16 : 14})
                </span>
              </div>
              <p className="text-[10.5px] leading-none text-slate-300">
                {isCopa ? `“Tenés ${stats.ccOwned} de 16 extras.”` : `“Tenés ${stats.ccOwned} de 14 stickers promocionales.”`}
              </p>
              <div className="w-full h-1.5 bg-indigo-950/60 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${isCopa ? 'bg-emerald-500' : 'bg-rose-500'} transition-all duration-500`}
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
                {currentSections
                  .sort((a, b) => a.order - b.order)
                  .map((sec) => {
                    const badge = isCopa
                      ? (sec.id === 'all' ? '446 códigos' :
                         sec.id === 'introduccion' ? 'INTR1-INTR4' :
                         sec.id === 'sedes' ? 'HCI1-HCI14' :
                         sec.id === 'selecciones' ? '18 Selecciones' :
                         sec.id === 'leyendas' ? 'LEG1-LEG18' :
                         sec.id === 'roll-of-honour' ? 'ROH1-ROH2' :
                         'EXT1-EXT16')
                      : (sec.id === 'all' ? '994 códigos' :
                         sec.id === 'fwc-inicial' ? '00-FWC8' :
                         sec.id === 'selecciones' ? '48 Selecciones' :
                         sec.id === 'fwc-history' ? 'FWC9-FWC19' :
                         'CC1-CC14');
                    return (
                      <button
                        key={sec.id}
                        onClick={() => {
                          setActiveSection(sec.id);
                        }}
                        className={`py-2 px-3.5 rounded-xl text-xs font-black whitespace-nowrap flex flex-col items-start transition-all cursor-pointer ${
                          activeSection === sec.id
                            ? (isCopa ? 'bg-emerald-950 text-white shadow-xs' : 'bg-slate-950 text-white shadow-xs')
                            : 'bg-slate-50 text-slate-550 hover:bg-slate-100'
                        }`}
                      >
                        <span>{sec.name}</span>
                        <span className="text-[8px] font-bold opacity-60 mt-0.5">{badge}</span>
                      </button>
                    );
                  })
                }
              </div>
            </div>

            {activeSection !== 'selecciones' ? (
              <>
                {/* Quick status button toggles & query */}
                <div className="pt-2 border-t border-slate-55 flex flex-col gap-2">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar código de figurita (ej: FWC3)..."
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
                      return (
                        <button
                          key={st}
                          onClick={() => setStatusFilter(st)}
                          className={`py-1.5 px-3 rounded-lg text-[10px] uppercase font-black tracking-wider whitespace-nowrap flex items-center gap-1 transition-all ${
                            statusFilter === st
                              ? `${STATUS_CONFIG[st].bgClass} ${STATUS_CONFIG[st].textClass} border border-indigo-200`
                              : 'bg-slate-50 text-slate-550 hover:bg-slate-100'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[st].dotClass}`}></span>
                          {STATUS_CONFIG[st].label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : null}
          </div>

          {activeSection !== 'selecciones' ? (
            <>
              {activeSection === 'coca-cola' && (
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
            /* Sub-tab y sistema de carrusel interactivo para SELECCIONES */
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Selecciones por Grupos</p>
                <div className="flex gap-1 overflow-x-auto pb-1 mt-1.5 scrollbar-none">
                  {isCopa ? (
                    [{ id: 'all', name: 'Todos' }, ...COPA_AMERICA_GROUPS].map((group) => (
                      <button
                        key={group.id}
                        onClick={() => {
                          setActiveGroupTabCopa(group.id);
                        }}
                        className={`py-1.5 px-3.5 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                          activeGroupTabCopa === group.id
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-50 text-slate-550 hover:bg-slate-100'
                        }`}
                      >
                        {group.name}
                      </button>
                    ))
                  ) : (
                    worldCupGroups.map((group) => (
                      <button
                        key={group.id}
                        onClick={() => {
                          setActiveGroupTab(group.id);
                        }}
                        className={`py-1.5 px-3.5 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                          activeGroupTab === group.id
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-slate-50 text-slate-500 hover:bg-slate-105'
                        }`}
                      >
                        {group.name}
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Dynamic computed Progress Banner for group */}
              {(() => {
                if (isCopa) {
                  if (activeGroupTabCopa === 'all') {
                    const totalSel = 18 * 22; // 396
                    let ownedSel = 0;
                    Object.keys(COPA_AMERICA_TEAMS).forEach(teamCode => {
                      for (let i = 1; i <= 22; i++) {
                        const status = stickerStateDict[`${teamCode}${i}`] || 'faltante';
                        if (status !== 'faltante') ownedSel++;
                      }
                    });
                    const percent = Math.round((ownedSel / totalSel) * 105) / 1.05;
                    const roundedPercent = Math.min(100, Math.round(percent));
                    return (
                      <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-3xl space-y-2">
                        <div className="flex justify-between items-center text-xs font-bold text-emerald-900 leading-none">
                          <span>Todas las selecciones (Copa América)</span>
                          <span className="text-[11px] font-black font-mono bg-emerald-100 text-emerald-850 px-2 py-0.5 rounded-md">
                            {ownedSel} / {totalSel} ({roundedPercent}%)
                          </span>
                        </div>
                        <p className="text-xs text-emerald-800 font-bold leading-none">
                          Tenés {ownedSel} de {totalSel} stickers de selecciones.
                        </p>
                        <div className="w-full h-1.5 bg-emerald-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-600 transition-all duration-305"
                            style={{ width: `${roundedPercent}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  } else {
                    const groupObj = COPA_AMERICA_GROUPS.find(g => g.id === activeGroupTabCopa);
                    if (!groupObj) return null;
                    let ownedGroup = 0;
                    const totalGroup = groupObj.teams.length * 22; // 88
                    groupObj.teams.forEach(teamCode => {
                      for (let i = 1; i <= 22; i++) {
                        const status = stickerStateDict[`${teamCode}${i}`] || 'faltante';
                        if (status !== 'faltante') ownedGroup++;
                      }
                    });
                    const percent = Math.round((ownedGroup / totalGroup) * 100);
                    return (
                      <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-3xl space-y-2">
                        <div className="flex justify-between items-center text-xs font-bold text-emerald-900 leading-none">
                          <span>{groupObj.name}</span>
                          <span className="text-[11px] font-black font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                            {ownedGroup} / {totalGroup} ({percent}%)
                          </span>
                        </div>
                        <p className="text-xs text-emerald-850 font-bold leading-none">
                          Tenés {ownedGroup} de {totalGroup} stickers de {groupObj.name}.
                        </p>
                        <div className="w-full h-1.5 bg-emerald-100/70 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-600 transition-all duration-300"
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  }
                } else {
                  if (activeGroupTab === 'all') {
                    const totalSel = 48 * 20; // 960
                    let ownedSel = 0;
                    Object.keys(teamsData).forEach(teamCode => {
                      for (let i = 1; i <= 20; i++) {
                        const status = stickerStateDict[`${teamCode}${i}`] || 'faltante';
                        if (status !== 'faltante') ownedSel++;
                      }
                    });
                    const percent = Math.round((ownedSel / totalSel) * 100);
                    return (
                      <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-3xl space-y-2">
                        <div className="flex justify-between items-center text-xs font-bold text-indigo-900 leading-none">
                          <span>Todas las selecciones</span>
                          <span className="text-[11px] font-black font-mono bg-indigo-100 text-indigo-850 px-2 py-0.5 rounded-md">
                            {ownedSel} / {totalSel} ({percent}%)
                          </span>
                        </div>
                        <p className="text-xs text-indigo-800 font-bold leading-none">
                          Tenés {ownedSel} de {totalSel} figuritas de selecciones.
                        </p>
                        <div className="w-full h-1.5 bg-indigo-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-600 transition-all duration-300"
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  } else {
                    const groupObj = worldCupGroups.find(g => g.id === activeGroupTab);
                    if (!groupObj) return null;
                    let ownedGroup = 0;
                    const totalGroup = groupObj.teams.length * 20; // 80
                    groupObj.teams.forEach(teamCode => {
                      for (let i = 1; i <= 20; i++) {
                        const status = stickerStateDict[`${teamCode}${i}`] || 'faltante';
                        if (status !== 'faltante') ownedGroup++;
                      }
                    });
                    const percent = Math.round((ownedGroup / totalGroup) * 100);
                    return (
                      <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-3xl space-y-2">
                        <div className="flex justify-between items-center text-xs font-bold text-indigo-900 leading-none">
                          <span>{groupObj.name}</span>
                          <span className="text-[11px] font-black font-mono bg-indigo-100 text-indigo-805 px-2 py-0.5 rounded-md">
                            {ownedGroup} / {totalGroup} ({percent}%)
                          </span>
                        </div>
                        <p className="text-xs text-indigo-855 font-bold leading-none select-none">
                          Tenés {ownedGroup} de {totalGroup} figuritas del {groupObj.name}.
                        </p>
                        <div className="w-full h-1.5 bg-indigo-100/70 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-600 transition-all duration-300"
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  }
                }
              })()}

              {/* Selections Specific Status Filters Pills Menu */}
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Filtrar figuritas</p>
                <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
                  {[
                    { id: 'todos', label: 'Todas las figuritas' },
                    { id: 'faltante', label: 'Me faltan' },
                    { id: 'tengo', label: 'Las tengo' },
                    { id: 'repetida', label: 'Repetidas' },
                    { id: 'reservada', label: 'Reservadas' },
                    { id: 'intercambiada', label: 'Intercambiadas' }
                  ].map((opt) => {
                    const isCurrent = selectionsFilter === opt.id;
                    const colorClass = opt.id === 'todos' 
                      ? (isCopa ? 'bg-emerald-500' : 'bg-indigo-500')
                      : STATUS_CONFIG[opt.id as StickerStatus]?.dotClass || 'bg-slate-400';
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setSelectionsFilter(opt.id as any)}
                        className={`py-1.5 px-3 rounded-xl text-[10px] uppercase font-black tracking-wider whitespace-nowrap flex items-center gap-1 transition-all cursor-pointer ${
                          isCurrent
                            ? (isCopa ? 'bg-emerald-600 text-white shadow-xs' : 'bg-indigo-650 bg-indigo-600 text-white shadow-xs')
                            : 'bg-slate-50 text-slate-555 hover:bg-slate-100'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${colorClass}`}></span>
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Accordions list of Selections */}
              <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                {(() => {
                  if (isCopa) {
                    const activeGroupObj = COPA_AMERICA_GROUPS.find(g => g.id === activeGroupTabCopa);
                    const activeTeamsList = activeGroupObj 
                      ? activeGroupObj.teams 
                      : (activeGroupTabCopa === 'all' ? Object.keys(COPA_AMERICA_TEAMS) : []);

                    return activeTeamsList.map((teamCode) => {
                      const teamObj = COPA_AMERICA_TEAMS[teamCode];
                      if (!teamObj) return null;

                      let owned = 0;
                      for (let i = 1; i <= 22; i++) {
                        const status = stickerStateDict[`${teamCode}${i}`] || 'faltante';
                        if (status !== 'faltante') owned++;
                      }

                      const isExpanded = !!expandedTeamsCopa[teamCode];
                      const parentGroup = COPA_AMERICA_GROUPS.find(g => g.teams.includes(teamCode))?.name || 'Copa América';

                      const stickerList = Array.from({ length: 22 }, (_, idx) => {
                        const number = idx + 1;
                        return {
                          id: `${teamCode}${number}`,
                          code: `${teamCode}${number}`,
                          teamCode: teamCode,
                          number: number,
                          type: number === 1 ? "Escudo / Emblema" : number === 13 ? "Foto grupal" : "Jugador",
                          status: stickerStateDict[`${teamCode}${number}`] || 'faltante'
                        };
                      });

                      const displayedStickers = stickerList.filter(s => {
                        if (selectionsFilter === 'todos') return true;
                        return s.status === selectionsFilter;
                      });

                      return (
                        <div key={teamCode} className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-2xs">
                          <div 
                            onClick={() => {
                              setExpandedTeamsCopa(prev => ({
                                ...prev,
                                [teamCode]: !prev[teamCode]
                              }));
                            }}
                            className="p-4 flex justify-between items-center hover:bg-slate-50/50 transition cursor-pointer select-none"
                          >
                            <div className="min-w-0 pr-3">
                              <p className="text-sm font-extrabold text-slate-900 leading-tight flex items-center gap-1.5">
                                <span>{teamObj.name}</span>
                                <span className="font-mono text-[9px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                                  {teamCode}
                                </span>
                              </p>
                              <p className="text-[10px] text-slate-400 mt-1 font-bold">
                                {parentGroup} — {owned} de 22 un. ({Math.round(owned / 22 * 100)}%)
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="text-right">
                                <span className="text-[10px] font-extrabold text-emerald-600 font-mono bg-emerald-50 px-2 py-0.5 rounded-full">
                                  {owned}/22
                                </span>
                              </div>
                              {isExpanded ? (
                                <ChevronUp className="text-slate-400 h-4 w-4" />
                              ) : (
                                <ChevronDown className="text-slate-400 h-4 w-4" />
                              )}
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="p-4 bg-slate-50/30 border-t border-slate-50 space-y-3">
                              {displayedStickers.length > 0 ? (
                                <div className="grid grid-cols-2 gap-2">
                                  {displayedStickers.map((sticker) => {
                                    const cfg = STATUS_CONFIG[sticker.status];
                                    return (
                                      <div 
                                        key={sticker.code}
                                        className={`p-3 rounded-2xl border flex flex-col justify-between ${cfg.bgClass} ${cfg.borderClass} shadow-2xs`}
                                      >
                                        <div className="space-y-1 min-w-0">
                                          <div className="flex justify-between items-center">
                                            <span className="text-xs font-black text-slate-800 font-mono">
                                              {sticker.code}
                                            </span>
                                            <span className={`w-2 h-2 rounded-full ${cfg.dotClass}`}></span>
                                          </div>
                                          <p className="text-[9px] text-slate-400 font-black uppercase tracking-tight truncate leading-none">
                                            {sticker.type}
                                          </p>
                                          <p className={`text-[10.5px] font-black leading-tight ${cfg.textClass}`}>
                                            {cfg.label}
                                          </p>
                                        </div>

                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveCode(sticker.code);
                                          }}
                                          className="w-full mt-2 py-1 px-2 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 rounded-xl text-[10px] text-emerald-700 font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                                        >
                                          📌 Editar
                                        </button>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <p className="text-[10px] text-slate-400 font-bold text-center py-4">
                                  No hay figuritas en estado "{selectionsFilter === 'todos' ? 'Todas' : STATUS_CONFIG[selectionsFilter as StickerStatus]?.label}" para esta selección.
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    });
                  } else {
                    const activeGroupObj = worldCupGroups.find(g => g.id === activeGroupTab);
                    const activeTeamsList = activeGroupObj ? activeGroupObj.teams : [];

                    return activeTeamsList.map((teamCode) => {
                      const teamObj = teamsData[teamCode];
                      if (!teamObj) return null;

                      let owned = 0;
                      for (let i = 1; i <= 20; i++) {
                        const status = stickerStateDict[`${teamCode}${i}`] || 'faltante';
                        if (status !== 'faltante') owned++;
                      }

                      const isExpanded = !!expandedTeams[teamCode];
                      const parentGroup = worldCupGroups.find(g => g.id !== 'all' && g.teams.includes(teamCode))?.name || 'Mundial';

                      const stickerList = generateTeamStickers(teamCode).map(s => ({
                        ...s,
                        status: stickerStateDict[s.code] || 'faltante'
                      }));

                      const displayedStickers = stickerList.filter(s => {
                        if (selectionsFilter === 'todos') return true;
                        return s.status === selectionsFilter;
                      });

                      return (
                        <div key={teamCode} className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-2xs">
                          <div 
                            onClick={() => {
                              setExpandedTeams(prev => ({
                                ...prev,
                                [teamCode]: !prev[teamCode]
                              }));
                            }}
                            className="p-4 flex justify-between items-center hover:bg-slate-50/50 transition cursor-pointer select-none"
                          >
                            <div className="min-w-0 pr-3">
                              <p className="text-sm font-extrabold text-slate-900 leading-tight flex items-center gap-1.5">
                                <span>{teamObj.name}</span>
                                <span className="font-mono text-[9px] font-black text-indigo-650 bg-indigo-50 px-1.5 py-0.5 rounded">
                                  {teamCode}
                                </span>
                              </p>
                              <p className="text-[10px] text-slate-400 mt-1 font-bold">
                                {parentGroup} — {owned} de 20 un. ({Math.round(owned / 20 * 100)}%)
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="text-right">
                                <span className="text-[10px] font-extrabold text-indigo-600 font-mono bg-indigo-50 px-2 py-0.5 rounded-full">
                                  {owned}/20
                                </span>
                              </div>
                              {isExpanded ? (
                                <ChevronUp className="text-slate-400 h-4 w-4" />
                              ) : (
                                <ChevronDown className="text-slate-400 h-4 w-4" />
                              )}
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="p-4 bg-slate-50/30 border-t border-slate-50 space-y-3">
                              {displayedStickers.length > 0 ? (
                                <div className="grid grid-cols-2 gap-2">
                                  {displayedStickers.map((sticker) => {
                                    const cfg = STATUS_CONFIG[sticker.status];
                                    return (
                                      <div 
                                        key={sticker.code}
                                        className={`p-3 rounded-2xl border flex flex-col justify-between ${cfg.bgClass} ${cfg.borderClass} shadow-2xs`}
                                      >
                                        <div className="space-y-1 min-w-0">
                                          <div className="flex justify-between items-center">
                                            <span className="text-xs font-black text-slate-800 font-mono">
                                              {sticker.code}
                                            </span>
                                            <span className={`w-2 h-2 rounded-full ${cfg.dotClass}`}></span>
                                          </div>
                                          <p className="text-[9px] text-slate-405 font-black uppercase tracking-tight truncate leading-none">
                                            {sticker.type}
                                          </p>
                                          <p className={`text-[10.5px] font-black leading-tight ${cfg.textClass}`}>
                                            {cfg.label}
                                          </p>
                                        </div>

                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveCode(sticker.code);
                                          }}
                                          className="w-full mt-2 py-1 px-2 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-xl text-[10px] text-slate-700 font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                                        >
                                          📌 Editar
                                        </button>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <p className="text-[10px] text-slate-400 font-bold text-center py-4">
                                  No hay figuritas en estado "{selectionsFilter === 'todos' ? 'Todas' : STATUS_CONFIG[selectionsFilter as StickerStatus]?.label}" para esta selección.
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    });
                  }
                })()}
              </div>
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
              {(isCopa ? Object.values(COPA_AMERICA_TEAMS) : SELECTIONS).map((country) => {
                const cStats = getCountryStats(country.code);
                return (
                  <div key={country.code} className="flex justify-between items-center text-xs pt-2.5 first:pt-0 animate-fade-in">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className={`font-mono font-black ${isCopa ? 'text-emerald-700 bg-emerald-50/65' : 'text-indigo-650 bg-indigo-50/65'} px-1.5 py-0.5 rounded text-[10px]`}>
                        {country.code}
                      </span>
                      <span className="font-bold text-slate-800 truncate pr-2">{country.name}</span>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[10px] font-bold text-slate-500">
                        {cStats.owned} de {isCopa ? 22 : 20} un.
                      </span>
                      <span 
                        onClick={() => {
                          setActiveSection('selecciones');
                          setSelectedSelection(country.code);
                          setSelectedTab('grilla');
                        }}
                        className={`text-[9px] hover:underline font-black cursor-pointer bg-slate-50 px-2 py-0.5 rounded-md ${isCopa ? 'text-emerald-700' : 'text-indigo-600'}`}
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
                  {isCopa ? "Panini Copa América USA 2024" : "Panini Mundial 2026"}
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
