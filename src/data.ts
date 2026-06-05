import { Album, NearbyCollector, SafePoint, UserProfile, MatchResult, ChatMessage, TradeProposal, StickerStatus } from './types';

export const INITIAL_ALBUMS: Album[] = [
  {
    id: 'mundial_2026',
    name: 'Mundial de Fútbol 2026',
    totalStickers: 250,
    category: 'Futbol',
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'copa_america_25',
    name: 'Copa América 2024/2025',
    totalStickers: 180,
    category: 'Futbol',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'liga_arg_26',
    name: 'Liga Profesional de Fútbol',
    totalStickers: 300,
    category: 'Futbol',
    imageUrl: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'disney_magia',
    name: 'Disney 100: Álbum Mágico',
    totalStickers: 150,
    category: 'Animacion',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'pokemon_tcg',
    name: 'Pokémon: Gotta Catch \'Em All',
    totalStickers: 151,
    category: 'Anime',
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'marvel_heroes',
    name: 'Marvel Heroes & Villains',
    totalStickers: 200,
    category: 'Mundo Geek',
    imageUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&q=80&w=200'
  }
];

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

// Initial sticker states for Sofi in her active album 'mundial_2026'
// Faltantes: 12, 45, 78, 120, 134
// Repetidas: 4, 9, 34, 87, 92
// Tengo (owned but not duplicate): e.g. 5, 23, 100, 150
export const INITIAL_STICKER_LIST = [
  { number: 12, status: 'faltante' as const },
  { number: 45, status: 'faltante' as const },
  { number: 78, status: 'faltante' as const },
  { number: 120, status: 'faltante' as const },
  { number: 134, status: 'faltante' as const },
  { number: 4, status: 'repetida' as const },
  { number: 9, status: 'repetida' as const },
  { number: 34, status: 'repetida' as const },
  { number: 87, status: 'repetida' as const },
  { number: 92, status: 'repetida' as const },
  // Some others that are just "tengo"
  { number: 5, status: 'tengo' as const },
  { number: 10, status: 'tengo' as const },
  { number: 15, status: 'tengo' as const },
  { number: 23, status: 'tengo' as const },
  { number: 50, status: 'tengo' as const },
  { number: 100, status: 'tengo' as const },
  { number: 110, status: 'tengo' as const },
  { number: 150, status: 'tengo' as const },
  { number: 200, status: 'tengo' as const },
];

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
      // Tiene (repetidas): 45, 120, 200
      45: 'repetida',
      120: 'repetida',
      200: 'repetida',
      // Necesita (faltantes): 87, 92
      87: 'faltante',
      92: 'faltante',
      // Others
      4: 'tengo',
      9: 'tengo',
      12: 'tengo',
      78: 'tengo',
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
      // Tiene (repetidas): 78, 134
      78: 'repetida',
      134: 'repetida',
      // Necesita (faltantes): 4
      4: 'faltante',
      // Others
      12: 'tengo',
      45: 'tengo',
      87: 'tengo',
      120: 'tengo',
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
      // Tiene (repetidas): 12
      12: 'repetida',
      // Necesita (faltantes): 150
      150: 'faltante',
      // Others
      45: 'tengo',
      78: 'tengo',
      120: 'tengo',
    }
  },
  {
    id: 'lucas_collector',
    name: 'Lucas',
    avatar: '👨',
    neighborhood: 'Palermo',
    distance: 0.5,
    avgRating: 4.7,
    exchangesCount: 22,
    userType: 'coleccionista',
    badges: ['Usuario verificado', 'Buen intercambiador'],
    isVerified: true,
    activeAlbumId: 'mundial_2026',
    activityTime: 'Hace 2 horas',
    stickers: {
      // Tiene (repetidas): none that Sofi needs, but has 45, 120 (which Sofi needs but Lucas has them as 'tengo', not duplicate)
      45: 'tengo',
      120: 'tengo',
      // Needs (faltantes): 9 (which Sofi has)
      9: 'faltante',
      // He has repetida 15 (which Sofi has as tengo)
      15: 'repetida'
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
      // Kiosco has many stickers or helps matchmaking! Let's say he has repetida 12, 45, 78, 120, 134! That's why he is a punto seguro
      12: 'repetida',
      45: 'repetida',
      78: 'repetida',
      120: 'repetida',
      134: 'repetida',
    }
  },
  {
    id: 'club_estudiantes',
    name: 'Club Atlético Palermo',
    avatar: '🏟️',
    neighborhood: 'Palermo',
    distance: 1.5,
    avgRating: 5.0,
    exchangesCount: 504,
    userType: 'club',
    badges: ['Punto Seguro Ofic.', 'Verificado'],
    isVerified: true,
    activeAlbumId: 'mundial_2026',
    activityTime: 'Activo fines de semana',
    stickers: {
      12: 'repetida',
      78: 'repetida',
      134: 'repetida',
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
  // Initial conversations
  {
    id: 'msg_1',
    senderId: 'martina_collector',
    receiverId: 'sofi_user',
    text: '¡Hola Sofi! Vi que tenés la 87 y 92 repetidas, a mí me faltan justo esas. Yo tengo la 45 y 120 para vos. ¿Hacemos el trueque?',
    timestamp: '2026-06-05T14:30:00Z'
  },
  {
    id: 'msg_2',
    senderId: 'sofi_user',
    receiverId: 'martina_collector',
    text: 'Hola Martina! Sii me re sirve, te guardo las mías.',
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
    offeredStickers: [45, 120],
    requestedStickers: [87, 92],
    status: 'en_coordinacion',
    date: '2026-06-05',
    safePointName: 'Kiosco El Álbum',
    meetingTime: 'Hoy a las 17:30'
  },
  {
    id: 'trade_2',
    senderId: 'sofi_user',
    receiverId: 'tomas_collector',
    receiverName: 'Tomás',
    receiverAvatar: '🧑',
    offeredStickers: [],
    requestedStickers: [12],
    status: 'propuesto',
    date: '2026-06-05'
  },
  {
    id: 'trade_history_1',
    senderId: 'sofi_user',
    receiverId: 'lucas_collector',
    receiverName: 'Lucas',
    receiverAvatar: '👨',
    offeredStickers: [34],
    requestedStickers: [5],
    status: 'realizado',
    date: '2026-06-01',
    safePointName: 'Plaza Unidad Latinoamericana',
    ratingGivenForThem: 5,
    feedbackText: '¡Súper confiable e imprimió las figuritas impecables!'
  }
];

// Matching algorithm function
export function calculateMatches(
  userAlbumId: string,
  userStickers: { number: number; status: StickerStatus }[],
  collectors: NearbyCollector[],
  blockedUserIds: string[]
): MatchResult[] {
  // Extract user's actual missing and duplicates
  // Ensure we fall back to defaults if not found
  const userFaltantes = userStickers
    .filter((s) => s.status === 'faltante')
    .map((s) => s.number);
  const userRepetidas = userStickers
    .filter((s) => s.status === 'repetida')
    .map((s) => s.number);

  const activeCollectors = collectors.filter(
    (c) => c.activeAlbumId === userAlbumId && !blockedUserIds.includes(c.id)
  );

  const results: MatchResult[] = activeCollectors.map((collector) => {
    // collector's duplicates (repetidas)
    const collectorRepetidas = Object.entries(collector.stickers)
      .filter(([_, status]) => status === 'repetida')
      .map(([num]) => parseInt(num));

    // collector's missing (faltantes)
    const collectorFaltantes = Object.entries(collector.stickers)
      .filter(([_, status]) => status === 'faltante')
      .map(([num]) => parseInt(num));

    // What C has that User needs
    // Intersection of user's missing and collector's duplicates
    const theyOfferToUser = collectorRepetidas.filter((num) =>
      userFaltantes.includes(num)
    );

    // What User has that C needs
    // Intersection of collector's missing and user's duplicates
    const userOffersToThem = userRepetidas.filter((num) =>
      collectorFaltantes.includes(num)
    );

    let matchLevel: 'alta' | 'media' | 'baja' = 'baja';
    if (theyOfferToUser.length > 0 && userOffersToThem.length > 0) {
      matchLevel = 'alta';
    } else if (theyOfferToUser.length > 0 || userOffersToThem.length > 0) {
      matchLevel = 'media';
    }

    // Scoring to tie-break / sort matches:
    // 1. match Level (alta = 300, media = 100, baja = 0)
    // 2. total matches count (theyOfferToUser + userOffersToThem) * 10
    // 3. Distance multiplier (fewer km -> higher score, e.g. (10 - distance) * 5)
    // 4. Rating modifier (avgRating * 2)
    // 5. Verification status (verified = +20)
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

  // Sort by matches calculation:
  // 1. Highest match score (which encodes matches count, distance, rating, verified state)
  return results.sort((a, b) => b.matchScore - a.matchScore);
}
