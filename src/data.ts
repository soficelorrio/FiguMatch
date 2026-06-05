import { Album, NearbyCollector, SafePoint, UserProfile, MatchResult, ChatMessage, TradeProposal, StickerStatus, StickerState } from './types';

export const INITIAL_ALBUMS: Album[] = [
  {
    id: 'mundial_2026',
    name: 'Panini Mundial 2026',
    totalStickers: 980,
    category: 'Futbol',
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=200'
  }
];

export const SELECTIONS = [
  { code: 'MEX', name: 'México' },
  { code: 'RSA', name: 'Sudáfrica' },
  { code: 'KOR', name: 'Corea del Sur' },
  { code: 'CZE', name: 'República Checa' },
  { code: 'CAN', name: 'Canadá' },
  { code: 'BIH', name: 'Bosnia y Herzegovina' },
  { code: 'QAT', name: 'Qatar' },
  { code: 'SUI', name: 'Suiza' },
  { code: 'BRA', name: 'Brasil' },
  { code: 'MAR', name: 'Marruecos' },
  { code: 'HAI', name: 'Haití' },
  { code: 'SCO', name: 'Escocia' },
  { code: 'USA', name: 'Estados Unidos' },
  { code: 'PAR', name: 'Paraguay' },
  { code: 'AUS', name: 'Australia' },
  { code: 'TUR', name: 'Turquía' },
  { code: 'GER', name: 'Alemania' },
  { code: 'CUW', name: 'Curazao' },
  { code: 'CIV', name: 'Costa de Marfil' },
  { code: 'ECU', name: 'Ecuador' },
  { code: 'NED', name: 'Países Bajos' },
  { code: 'JPN', name: 'Japón' },
  { code: 'SWE', name: 'Suecia' },
  { code: 'TUN', name: 'Túnez' },
  { code: 'BEL', name: 'Bélgica' },
  { code: 'EGY', name: 'Egipto' },
  { code: 'IRN', name: 'Irán' },
  { code: 'NZL', name: 'Nueva Zelanda' },
  { code: 'ESP', name: 'España' },
  { code: 'CPV', name: 'Cabo Verde' },
  { code: 'KSA', name: 'Arabia Saudita' },
  { code: 'URU', name: 'Uruguay' },
  { code: 'FRA', name: 'Francia' },
  { code: 'SEN', name: 'Senegal' },
  { code: 'IRQ', name: 'Irak' },
  { code: 'NOR', name: 'Noruega' },
  { code: 'ARG', name: 'Argentina' },
  { code: 'ALG', name: 'Argelia' },
  { code: 'AUT', name: 'Austria' },
  { code: 'JOR', name: 'Jordania' },
  { code: 'POR', name: 'Portugal' },
  { code: 'COD', name: 'República Democrática del Congo' },
  { code: 'UZB', name: 'Uzbekistán' },
  { code: 'COL', name: 'Colombia' },
  { code: 'ENG', name: 'Inglaterra' },
  { code: 'CRO', name: 'Croacia' },
  { code: 'GHA', name: 'Ghana' },
  { code: 'PAN', name: 'Panamá' }
];

// Helper structures to list all official codes of the album in real order
export const FWC_INITIAL_CODES = ['00', 'FWC1', 'FWC2', 'FWC3', 'FWC4', 'FWC5', 'FWC6', 'FWC7', 'FWC8'];
export const FWC_FINAL_CODES = ['FWC9', 'FWC10', 'FWC11', 'FWC12', 'FWC13', 'FWC14', 'FWC15', 'FWC16', 'FWC17', 'FWC18', 'FWC19'];
export const CC_PROMO_CODES = ['CC1', 'CC2', 'CC3', 'CC4', 'CC5', 'CC6', 'CC7', 'CC8', 'CC9', 'CC10', 'CC11', 'CC12', 'CC13', 'CC14'];

export function getAllMainAlbumCodes(): string[] {
  const codes: string[] = [...FWC_INITIAL_CODES];
  for (const s of SELECTIONS) {
    for (let j = 1; j <= 20; j++) {
      codes.push(`${s.code}${j}`);
    }
  }
  codes.push(...FWC_FINAL_CODES);
  return codes;
}

export function getAllStickerCodes(): string[] {
  return [...getAllMainAlbumCodes(), ...CC_PROMO_CODES];
}

export const INITIAL_USER: UserProfile = {
  id: 'sofi_user',
  name: 'Sofi',
  email: 'sofi.figumatch@gmail.com',
  avatar: '👧',
  neighborhood: 'Palermo',
  userType: 'coleccionista',
  isSupervised: true,
  avgRating: 4.9,
  exchangesCount: 15,
  badges: ['Coleccionista activo', 'Usuario confiable', 'Buen intercambiador'],
  activeAlbumId: 'mundial_2026',
  blockedUsers: [],
  reportedUsers: []
};

// GENERATE SOFI'S INITIAL STICKERS WITH PRECISE STATS:
// 1. Faltantes: ARG17, ARG20, BRA10, MEX4, FWC11, CC3
// 2. Repetidas: ARG4, MEX12, BRA7, USA5, FWC2
// 3. Album principal: Tenés exactly 245 of 980
// 4. Argentina: Tenés exactly 14 of 20
// 5. Coca-Cola Promo: Tenés exactly 3 of 14 (separate progess)
const buildInitialStickerList = (): StickerState[] => {
  const list: StickerState[] = [];
  const mainCodes = getAllMainAlbumCodes();

  // Explicit status definitions
  const explicitFaltantes = ['ARG17', 'ARG20', 'BRA10', 'MEX4', 'FWC11', 'CC3'];
  const explicitRepetidas = ['ARG4', 'MEX12', 'BRA7', 'USA5', 'FWC2'];

  const initialTengoMap = new Set<string>();

  // We need 14 of 20 for Argentina.
  // ARG17 & ARG20 are faltante. ARG4 is repetida (owned). We need 13 other ARG stickers to be "tengo"
  const argTengos = ['ARG1', 'ARG2', 'ARG3', 'ARG5', 'ARG6', 'ARG7', 'ARG8', 'ARG9', 'ARG10', 'ARG11', 'ARG12', 'ARG13', 'ARG14'];
  argTengos.forEach(c => initialTengoMap.add(c));

  // Coca-Cola needs 3 of 14.
  // CC3 is faltante. We need 3 other CC stickers to be "tengo"
  const ccTengos = ['CC1', 'CC2', 'CC4'];
  ccTengos.forEach(c => initialTengoMap.add(c));

  // Main Album requires 245 owned total.
  // We already have:
  // - 13 ARG tengos + 1 ARG repetida = 14 owned
  // - 1 MEX12 repetida = 1 owned
  // - 1 BRA7 repetida = 1 owned
  // - 1 USA5 repetida = 1 owned
  // - 1 FWC2 repetida = 1 owned
  // Total pre-assigned owned in main album = 18 owned.
  // Left to distribute owned in main album = 245 - 18 = 227 "tengo" stickers
  
  // Let's add some typical tengos in other teams to meet the 227 owned requirement
  // Let's make RSA1 to RSA20 owned (20)
  // KOR1 to KOR20 owned (20)
  // CZE1 to CZE20 owned (20)
  // CAN1 to CAN20 owned (20)
  // BIH1 to BIH20 owned (20)
  // QAT1 to QAT20 owned (20)
  // SUI1 to SUI20 owned (20)
  // MAR1 to MAR20 owned (20)
  // HAI1 to HAI20 owned (20)
  // SCO1 to SCO20 owned (20)
  // USA1 to USA4 owned (4) -> already USA5 is repetida
  // GER1 to GER20 owned (20)
  // That's 11 selections * 20 = 220 + 4 = 224 owned.
  // We need 3 more owned: let's make MEX1, MEX2, MEX3 owned (3).
  // Total is exactly 227 owned distributed!
  const bulkTengos = [
    ...Array.from({ length: 20 }, (_, i) => `RSA${i + 1}`),
    ...Array.from({ length: 20 }, (_, i) => `KOR${i + 1}`),
    ...Array.from({ length: 20 }, (_, i) => `CZE${i + 1}`),
    ...Array.from({ length: 20 }, (_, i) => `CAN${i + 1}`),
    ...Array.from({ length: 20 }, (_, i) => `BIH${i + 1}`),
    ...Array.from({ length: 20 }, (_, i) => `QAT${i + 1}`),
    ...Array.from({ length: 20 }, (_, i) => `SUI${i + 1}`),
    ...Array.from({ length: 20 }, (_, i) => `MAR${i + 1}`),
    ...Array.from({ length: 20 }, (_, i) => `HAI${i + 1}`),
    ...Array.from({ length: 20 }, (_, i) => `SCO${i + 1}`),
    ...Array.from({ length: 4 }, (_, i) => `USA${i + 1}`),
    ...Array.from({ length: 20 }, (_, i) => `GER${i + 1}`),
    'MEX1', 'MEX2', 'MEX3'
  ];
  bulkTengos.forEach(c => initialTengoMap.add(c));

  // Loop through all codes to populate initial values
  const allCodes = getAllStickerCodes();
  for (const code of allCodes) {
    if (explicitFaltantes.includes(code)) {
      list.push({ code, status: 'faltante' });
    } else if (explicitRepetidas.includes(code)) {
      list.push({ code, status: 'repetida' });
    } else if (initialTengoMap.has(code)) {
      list.push({ code, status: 'tengo' });
    } else {
      // Everything else defaults to "faltante" to replicate standard collecting state
      list.push({ code, status: 'faltante' });
    }
  }

  return list;
};

export const INITIAL_STICKER_LIST: StickerState[] = buildInitialStickerList();

export const INITIAL_COLLECTORS: NearbyCollector[] = [
  {
    id: 'martina_collector',
    name: 'Martina',
    avatar: '👩',
    neighborhood: 'Palermo',
    distance: 1.2,
    avgRating: 4.8,
    exchangesCount: 12,
    userType: 'coleccionista',
    badges: ['Buen intercambiador', 'Usuario confiable'],
    isVerified: true,
    activeAlbumId: 'mundial_2026',
    activityTime: 'Hace 5 min',
    stickers: {
      // Tiene repetidas: ARG17, BRA10, FWC11
      'ARG17': 'repetida',
      'BRA10': 'repetida',
      'FWC11': 'repetida',
      // Le faltan: ARG4, MEX12
      'ARG4': 'faltante',
      'MEX12': 'faltante'
    }
  },
  {
    id: 'juan_collector',
    name: 'Juan',
    avatar: '👦',
    neighborhood: 'Belgrano',
    distance: 3.0,
    avgRating: 4.5,
    exchangesCount: 8,
    userType: 'coleccionista',
    badges: ['Coleccionista activo'],
    isVerified: false,
    activeAlbumId: 'mundial_2026',
    activityTime: 'Hace 15 min',
    stickers: {
      // Tiene repetidas: MEX4, ARG20
      'MEX4': 'repetida',
      'ARG20': 'repetida',
      // Le faltan: BRA7, USA5
      'BRA7': 'faltante',
      'USA5': 'faltante'
    }
  },
  {
    id: 'tomas_collector',
    name: 'Tomás',
    avatar: '🧑',
    neighborhood: 'Recoleta',
    distance: 2.5,
    avgRating: 4.1,
    exchangesCount: 3,
    userType: 'coleccionista',
    badges: ['Primer intercambio'],
    isVerified: false,
    activeAlbumId: 'mundial_2026',
    activityTime: 'Hace 1 hora',
    stickers: {
      // Tiene repetidas: CC3
      'CC3': 'repetida',
      // Le faltan: PAN8
      'PAN8': 'faltante'
    }
  },
  {
    id: 'mati_kiosquero',
    name: 'Kiosco El Álbum',
    avatar: '🏪',
    neighborhood: 'Palermo',
    distance: 0.8,
    avgRating: 4.9,
    exchangesCount: 142,
    userType: 'kiosco',
    badges: ['Punto Seguro', 'Usuario verificado'],
    isVerified: true,
    activeAlbumId: 'mundial_2026',
    activityTime: 'Abierto ahora',
    stickers: {
      // Has some repetidas to behave as a trading base
      'MEX4': 'repetida',
      'ARG20': 'repetida',
      'ARG17': 'repetida',
      'BRA10': 'repetida',
      'FWC11': 'repetida',
      'CC3': 'repetida'
    }
  }
];

export const SUGGESTED_SAFE_POINTS: SafePoint[] = [
  {
    id: 'sp_1',
    name: 'Kiosco El Álbum',
    type: 'kiosco',
    address: 'Av. Santa Fe 3432, Palermo',
    distance: '0,8 km',
    rating: 4.9,
    hours: 'Lunes a Sábado, 8:00 a 21:00'
  },
  {
    id: 'sp_2',
    name: 'Plaza Unidad Latinoamericana',
    type: 'plaza',
    address: 'Costa Rica & Medrano, Palermo',
    distance: '1,1 km',
    rating: 4.5,
    hours: 'Público, recomendado fines de semana 14:00 a 18:00'
  },
  {
    id: 'sp_3',
    name: 'Club Atlético Palermo',
    type: 'club',
    address: 'Fitz Roy 2238, Palermo',
    distance: '1,5 km',
    rating: 5.0,
    hours: 'Miércoles y Viernes, 16:00 a 20:00'
  },
  {
    id: 'sp_4',
    name: 'Cafetería El Faro',
    type: 'otros',
    address: 'Gorriti 4120, Palermo',
    distance: '0,9 km',
    rating: 4.7,
    hours: 'Todos los días, 7:00 a 20:00'
  }
];

export const INITIAL_CHATS: ChatMessage[] = [
  {
    id: 'msg_1',
    senderId: 'martina_collector',
    receiverId: 'sofi_user',
    text: '¡Hola Sofi! Vi que tenés la ARG4 y MEX12 repetidas, a mí me faltan justo esas. Yo tengo la ARG17 y BRA10 para vos. ¿Hacemos el trueque?',
    timestamp: '2026-06-05T14:30:00Z'
  },
  {
    id: 'msg_2',
    senderId: 'sofi_user',
    receiverId: 'martina_collector',
    text: '¡Hola Martina! Sii me re sirve, te guardo las mías.',
    timestamp: '2026-06-05T14:35:00Z'
  },
  {
    id: 'msg_3',
    senderId: 'martina_collector',
    receiverId: 'sofi_user',
    text: 'Bárbaro, ¿podemos encontrarnos en el Kiosco El Álbum de Av. Santa Fe? Es re seguro.',
    timestamp: '2026-06-05T14:36:00Z'
  }
];

export const INITIAL_TRADES: TradeProposal[] = [
  {
    id: 'trade_1',
    senderId: 'martina_collector',
    receiverId: 'sofi_user',
    receiverName: 'Martina',
    receiverAvatar: '👩',
    offeredStickers: ['ARG17', 'BRA10'],
    requestedStickers: ['ARG4', 'MEX12'],
    status: 'en_coordinacion',
    date: '2026-06-05',
    safePointName: 'Kiosco El Álbum',
    meetingTime: 'Hoy a las 17:30'
  },
  {
    id: 'trade_2',
    senderId: 'sofi_user',
    receiverId: 'juan_collector',
    receiverName: 'Juan',
    receiverAvatar: '👦',
    offeredStickers: ['BRA7', 'USA5'],
    requestedStickers: ['MEX4', 'ARG20'],
    status: 'propuesto',
    date: '2026-06-05'
  }
];

export function calculateMatches(
  userAlbumId: string,
  userStickers: { code: string; status: StickerStatus }[],
  collectors: NearbyCollector[],
  blockedUserIds: string[]
): MatchResult[] {
  const userFaltantes = userStickers
    .filter((s) => s.status === 'faltante')
    .map((s) => s.code);
  const userRepetidas = userStickers
    .filter((s) => s.status === 'repetida')
    .map((s) => s.code);

  const activeCollectors = collectors.filter(
    (c) => c.activeAlbumId === userAlbumId && !blockedUserIds.includes(c.id)
  );

  const results: MatchResult[] = activeCollectors.map((collector) => {
    const collectorRepetidas = Object.entries(collector.stickers)
      .filter(([_, status]) => status === 'repetida')
      .map(([code]) => code);

    const collectorFaltantes = Object.entries(collector.stickers)
      .filter(([_, status]) => status === 'faltante')
      .map(([code]) => code);

    // What they have that you need
    const theyOfferToUser = collectorRepetidas.filter((code) =>
      userFaltantes.includes(code)
    );

    // What you have that they need
    const userOffersToThem = userRepetidas.filter((code) =>
      collectorFaltantes.includes(code)
    );

    let matchLevel: 'alta' | 'media' | 'baja' = 'baja';
    if (theyOfferToUser.length > 0 && userOffersToThem.length > 0) {
      matchLevel = 'alta';
    } else if (theyOfferToUser.length > 0 || userOffersToThem.length > 0) {
      matchLevel = 'media';
    }

    const lvlScore = matchLevel === 'alta' ? 300 : matchLevel === 'media' ? 100 : 0;
    const countScore = (theyOfferToUser.length + userOffersToThem.length) * 15;
    const distScore = Math.max(0, 10 - collector.distance) * 8;
    const ratingScore = collector.avgRating * 5;
    const verifiedScore = collector.isVerified ? 30 : 0;

    const matchScore = lvlScore + countScore + distScore + ratingScore + verifiedScore;

    return {
      collector,
      matchLevel,
      userOffersToThem,
      theyOfferToUser,
      matchScore
    };
  });

  return results.sort((a, b) => b.matchScore - a.matchScore);
}
