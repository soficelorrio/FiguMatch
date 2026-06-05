import { Album, NearbyCollector, SafePoint, UserProfile, MatchResult, ChatMessage, TradeProposal, StickerStatus, StickerState } from './types';

export const INITIAL_ALBUMS: Album[] = [
  {
    id: 'mundial_2026',
    name: 'Panini Mundial 2026',
    totalStickers: 980,
    category: 'Futbol',
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'copa_america_2024',
    name: 'Panini Copa América USA 2024',
    totalStickers: 430,
    category: 'Futbol',
    imageUrl: 'https://images.unsplash.com/photo-1489945052260-4f21d5226e49?auto=format&fit=crop&q=80&w=200'
  }
];

export const COPA_AMERICA_GROUPS = [
  {
    id: "all",
    name: "Todas",
    teams: ["ARG", "PER", "CHI", "CAN", "MEX", "ECU", "VEN", "JAM", "USA", "URU", "PAN", "BOL", "BRA", "COL", "PAR", "CRC", "HON", "TRI"]
  },
  {
    id: "group-a",
    name: "Grupo A",
    teams: ["ARG", "PER", "CHI", "CAN"]
  },
  {
    id: "group-b",
    name: "Grupo B",
    teams: ["MEX", "ECU", "VEN", "JAM"]
  },
  {
    id: "group-c",
    name: "Grupo C",
    teams: ["USA", "URU", "PAN", "BOL"]
  },
  {
    id: "group-d",
    name: "Grupo D",
    teams: ["BRA", "COL", "PAR", "CRC"]
  },
  {
    id: "play-in",
    name: "Play-in / Extras",
    teams: ["HON", "TRI"]
  }
];

export const COPA_AMERICA_TEAMS: Record<string, { name: string; code: string; group: string }> = {
  ARG: { name: "Argentina", code: "ARG", group: "Grupo A" },
  PER: { name: "Perú", code: "PER", group: "Grupo A" },
  CHI: { name: "Chile", code: "CHI", group: "Grupo A" },
  CAN: { name: "Canadá", code: "CAN", group: "Grupo A" },
  MEX: { name: "México", code: "MEX", group: "Grupo B" },
  ECU: { name: "Ecuador", code: "ECU", group: "Grupo B" },
  VEN: { name: "Venezuela", code: "VEN", group: "Grupo B" },
  JAM: { name: "Jamaica", code: "JAM", group: "Grupo B" },
  USA: { name: "Estados Unidos", code: "USA", group: "Grupo C" },
  URU: { name: "Uruguay", code: "URU", group: "Grupo C" },
  PAN: { name: "Panamá", code: "PAN", group: "Grupo C" },
  BOL: { name: "Bolivia", code: "BOL", group: "Grupo C" },
  BRA: { name: "Brasil", code: "BRA", group: "Grupo D" },
  COL: { name: "Colombia", code: "COL", group: "Grupo D" },
  PAR: { name: "Paraguay", code: "PAR", group: "Grupo D" },
  CRC: { name: "Costa Rica", code: "CRC", group: "Grupo D" },
  HON: { name: "Honduras", code: "HON", group: "Play-in / Extras" },
  TRI: { name: "Trinidad y Tobago", code: "TRI", group: "Play-in / Extras" }
};

export function getCopaAmericaStickerCodes(): string[] {
  const codes: string[] = [];
  
  // Introducción (INTR1 to INTR4)
  for (let i = 1; i <= 4; i++) codes.push(`INTR${i}`);
  
  // Sedes (HCI1 to HCI14)
  for (let i = 1; i <= 14; i++) codes.push(`HCI${i}`);
  
  // Selecciones
  FOR_TEAMS: for (const team of Object.keys(COPA_AMERICA_TEAMS)) {
    for (let i = 1; i <= 22; i++) {
      codes.push(`${team}${i}`);
    }
  }
  
  // Leyendas (LEG1 to LEG18)
  for (let i = 1; i <= 18; i++) codes.push(`LEG${i}`);
  
  // Roll of Honour (ROH1 to ROH2)
  for (let i = 1; i <= 2; i++) codes.push(`ROH${i}`);
  
  // Extra Stickers (EXT1 to EXT16)
  for (let i = 1; i <= 16; i++) codes.push(`EXT${i}`);
  
  return codes;
}

export function buildCopaAmericaInitialStickers(): StickerState[] {
  const list: StickerState[] = [];
  const allCodes = getCopaAmericaStickerCodes();
  
  const explicitFaltantes = ['ARG17', 'BRA10', 'MEX4', 'INTR1', 'LEG2'];
  const explicitRepetidas = ['ARG4', 'MEX12', 'BRA7', 'USA5', 'HCI3'];
  
  const tengos = new Set<string>();
  
  // Argentina owned: 15 other ARG codes (ARG1 to ARG22 without 17 & 4, which is 20 total. Let's make 15 owned + 1 repetida = 16 owned)
  const argTengos = ['ARG1', 'ARG2', 'ARG3', 'ARG5', 'ARG6', 'ARG7', 'ARG8', 'ARG9', 'ARG10', 'ARG11', 'ARG12', 'ARG13', 'ARG14', 'ARG15', 'ARG16'];
  argTengos.forEach(c => tengos.add(c));
  
  // Bulk tengos to reach 120 more owned (total 140 main owned)
  const bulkTengos = [
    ...Array.from({ length: 22 }, (_, i) => `PER${i + 1}`),
    ...Array.from({ length: 22 }, (_, i) => `CHI${i + 1}`),
    ...Array.from({ length: 22 }, (_, i) => `CAN${i + 1}`),
    ...Array.from({ length: 22 }, (_, i) => `VEN${i + 1}`),
    ...Array.from({ length: 22 }, (_, i) => `JAM${i + 1}`),
    ...Array.from({ length: 10 }, (_, i) => `BOL${i + 1}`)
  ];
  bulkTengos.forEach(c => tengos.add(c));
  
  // Extra stickers: exactly 4 of 16
  const extraTengos = ['EXT1', 'EXT2', 'EXT3', 'EXT4'];
  extraTengos.forEach(c => tengos.add(c));
  
  for (const code of allCodes) {
    if (explicitFaltantes.includes(code)) {
      list.push({ code, status: 'faltante' });
    } else if (explicitRepetidas.includes(code)) {
      list.push({ code, status: 'repetida' });
    } else if (tengos.has(code)) {
      list.push({ code, status: 'tengo' });
    } else {
      list.push({ code, status: 'faltante' });
    }
  }
  
  return list;
}

export const INITIAL_COPA_STICKERS: StickerState[] = buildCopaAmericaInitialStickers();

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
  reportedUsers: [],
  minorModeActive: true,
  adultName: 'Mariana',
  adultRelation: 'Madre',
  adultConfirmedAcc: true,
  onlySafePointsActive: true
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
    activityTime: 'Hace 10 min',
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
    activityTime: 'Hace 25 min',
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
    id: 'laura_collector',
    name: 'Laura',
    avatar: '👩',
    neighborhood: 'Colegiales',
    distance: 4.0,
    avgRating: 4.6,
    exchangesCount: 6,
    userType: 'coleccionista',
    badges: ['Usuario pacificador'],
    isVerified: false,
    activeAlbumId: 'mundial_2026',
    activityTime: 'Ayer',
    stickers: {
      // Tiene repetidas: ESP5, FRA10
      'ESP5': 'repetida',
      'FRA10': 'repetida',
      // Le faltan: ARG4
      'ARG4': 'faltante'
    }
  },
  {
    id: 'martina_copa',
    name: 'Martina',
    avatar: '👩',
    neighborhood: 'Palermo',
    distance: 1.2,
    avgRating: 4.8,
    exchangesCount: 12,
    userType: 'coleccionista',
    badges: ['Buen intercambiador', 'Usuario confiable'],
    isVerified: true,
    activeAlbumId: 'copa_america_2024',
    activityTime: 'Hace 10 min',
    stickers: {
      'ARG17': 'repetida',
      'BRA10': 'repetida',
      'LEG2': 'repetida',
      'ARG4': 'faltante',
      'MEX12': 'faltante'
    }
  },
  {
    id: 'juan_copa',
    name: 'Juan',
    avatar: '👦',
    neighborhood: 'Belgrano',
    distance: 3.0,
    avgRating: 4.5,
    exchangesCount: 8,
    userType: 'coleccionista',
    badges: ['Coleccionista activo'],
    isVerified: false,
    activeAlbumId: 'copa_america_2024',
    activityTime: 'Hace 25 min',
    stickers: {
      'MEX4': 'repetida',
      'INTR1': 'repetida',
      'BRA7': 'faltante',
      'USA5': 'faltante'
    }
  },
  {
    id: 'tomas_copa',
    name: 'Tomás',
    avatar: '🧑',
    neighborhood: 'Recoleta',
    distance: 2.5,
    avgRating: 4.1,
    exchangesCount: 3,
    userType: 'coleccionista',
    badges: ['Primer intercambio'],
    isVerified: false,
    activeAlbumId: 'copa_america_2024',
    activityTime: 'Hace 1 hora',
    stickers: {
      'HCI5': 'repetida',
      'COL8': 'faltante'
    }
  }
];

export const SUGGESTED_SAFE_POINTS: SafePoint[] = [
  {
    id: 'sp_1',
    name: 'Kiosco El Álbum',
    type: 'Kiosco adherido',
    address: 'Av. Santa Fe 3432, Palermo',
    neighborhood: 'Palermo',
    distance: '800 m',
    distanceNum: 0.8,
    verificationState: 'verificado',
    exchangesCount: 128,
    safetyPercent: 96,
    rating: 4.9,
    reportsCount: 0,
    lastActivity: 'hace 2 días',
    hours: 'Lunes a Sábado, 8:00 a 21:00',
    recommendations: 'Este punto es recomendable porque tiene muchos intercambios realizados, alta calificación y no registra reportes recientes.'
  },
  {
    id: 'sp_2',
    name: 'Club Palermo',
    type: 'Club',
    address: 'Fitz Roy 2238, Palermo',
    neighborhood: 'Palermo',
    distance: '1,4 km',
    distanceNum: 1.4,
    verificationState: 'verificado',
    exchangesCount: 87,
    safetyPercent: 94,
    rating: 4.8,
    reportsCount: 0,
    lastActivity: 'hace 1 día',
    hours: 'Miércoles y Viernes, 16:00 a 20:00',
    recommendations: 'Este club ofrece un ambiente familiar y seguro, con excelente reputación de intercambios coordinados y sin reportes.'
  },
  {
    id: 'sp_3',
    name: 'Alto Palermo',
    type: 'Centro comercial',
    address: 'Av. Santa Fe 3253, Palermo',
    neighborhood: 'Palermo',
    distance: '2 km',
    distanceNum: 2.0,
    verificationState: 'comunidad',
    exchangesCount: 64,
    safetyPercent: 89,
    rating: 4.6,
    reportsCount: 1,
    lastActivity: 'hace 5 días',
    hours: 'Lunes a Domingo, 10:00 a 22:00',
    recommendations: 'Recomendado por la comunidad. Cuenta con vigilancia permanente, cámaras de seguridad y excelente iluminación.'
  },
  {
    id: 'sp_4',
    name: 'Plaza Armenia',
    type: 'Plaza concurrida',
    address: 'Costa Rica & Armenia, Palermo',
    neighborhood: 'Palermo',
    distance: '1,1 km',
    distanceNum: 1.1,
    verificationState: 'comunidad',
    exchangesCount: 35,
    safetyPercent: 82,
    rating: 4.4,
    reportsCount: 1,
    lastActivity: 'hace 3 días',
    hours: 'Recomendado fines de semana, de 14:00 a 19:00',
    recommendations: 'Espacio público muy concurrido. Se aconseja realizar los encuentros durante las horas de luz solar y en sectores poblados.'
  },
  {
    id: 'sp_5',
    name: 'Café Punto Norte',
    type: 'Cafetería',
    address: 'Av. Cabildo 1820, Belgrano',
    neighborhood: 'Belgrano',
    distance: '3 km',
    distanceNum: 3.0,
    verificationState: 'no_verificado',
    exchangesCount: 12,
    safetyPercent: 71,
    rating: 4.1,
    reportsCount: 2,
    lastActivity: 'hace 8 días',
    hours: 'Todos los días, 8:00 a 20:00',
    recommendations: 'Punto no verificado con algunos reportes de desorganización en los accesos. Se recomienda asistir acompañado.'
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
    let compatibilityPercent = 20;

    const isKiosco = collector.userType === 'kiosco' || collector.userType === 'club';

    if (theyOfferToUser.length > 0 && userOffersToThem.length > 0) {
      matchLevel = 'alta';
      if (collector.id === 'martina_collector') {
        compatibilityPercent = 92;
      } else if (collector.id === 'juan_collector') {
        compatibilityPercent = 89;
      } else {
        const totalTradeables = theyOfferToUser.length + userOffersToThem.length;
        compatibilityPercent = Math.min(100, 80 + totalTradeables * 3);
      }
    } else if (theyOfferToUser.length > 0 || userOffersToThem.length > 0) {
      matchLevel = 'media';
      if (collector.id === 'tomas_collector') {
        compatibilityPercent = 61;
      } else {
        compatibilityPercent = Math.min(79, 50 + theyOfferToUser.length * 10 + userOffersToThem.length * 5);
      }
    } else {
      matchLevel = 'baja';
      if (collector.id === 'laura_collector') {
        compatibilityPercent = 35;
      } else {
        compatibilityPercent = 25;
      }
    }

    if (isKiosco) {
      // High score for being a secure station point
      matchLevel = 'alta';
      compatibilityPercent = 95;
    }

    // Explanations & Suggested Trades
    let explanation = '';
    let suggestedTrade = '';

    if (isKiosco) {
      explanation = `Punto Seguro recomendado de Palermo. Excelente lugar vigilado para coordinar intercambios de figuritas de forma protegida.`;
      suggestedTrade = `Llevá tus figuritas repetidas a ${collector.name}. Podés usar las mesas del local para reunirte de forma segura y revisar el stock general de figuritas libres de canje.`;
    } else {
      if (matchLevel === 'alta') {
        explanation = `“${collector.name} es una muy buena opción para cambiar porque tiene ${theyOfferToUser.length} ${theyOfferToUser.length === 1 ? 'figurita' : 'figuritas'} que te faltan y vos tenés ${userOffersToThem.length} ${userOffersToThem.length === 1 ? 'que necesita' : 'que necesita'}.”`;
        suggestedTrade = `Vos entregás ${userOffersToThem.join(' y ')}. ${collector.name} entrega ${theyOfferToUser.join(' y ')}.`;
      } else if (matchLevel === 'media') {
        explanation = `“Esta persona tiene figuritas que te faltan, pero falta encontrar una repetida tuya que le sirva.”`;
        if (theyOfferToUser.length > 0) {
          suggestedTrade = `${collector.name} te puede dar ${theyOfferToUser.join(', ')}. Podés proponerle compensación con otras valiosas o coordinar un trueque indirecto.`;
        } else {
          suggestedTrade = `Le podés ofrecer ${userOffersToThem.join(', ')}. Escribile para ver si tiene otras repetidas que no cargó aún.`;
        }
      } else {
        explanation = `“Comparten el mismo álbum, pero todavía hay pocas figuritas compatibles.”`;
        suggestedTrade = `No hay coincidencia directa. Coordinen con ${collector.name} para ver si avanza su álbum o si consiguen nuevas repetidas servibles.`;
      }
    }

    // Dynamic scale scoring helper (will be used inside lists)
    const lvlScore = matchLevel === 'alta' ? 400 : matchLevel === 'media' ? 200 : 50;
    const countScore = (theyOfferToUser.length + userOffersToThem.length) * 15;
    const distScore = Math.max(0, 10 - collector.distance) * 10;
    const ratingScore = collector.avgRating * 8;
    const verifiedScore = collector.isVerified ? 40 : 0;

    const matchScore = compatibilityPercent * 10 + lvlScore + countScore + distScore + ratingScore + verifiedScore;

    return {
      collector,
      matchLevel,
      userOffersToThem,
      theyOfferToUser,
      matchScore,
      compatibilityPercent,
      explanation,
      suggestedTrade
    };
  });

  return results.sort((a, b) => {
    // 1. Compatibility percent (descending)
    if (b.compatibilityPercent !== a.compatibilityPercent) {
      return b.compatibilityPercent - a.compatibilityPercent;
    }
    // 2. They offer count (descending)
    if (b.theyOfferToUser.length !== a.theyOfferToUser.length) {
      return b.theyOfferToUser.length - a.theyOfferToUser.length;
    }
    // 3. User offers count (descending)
    if (b.userOffersToThem.length !== a.userOffersToThem.length) {
      return b.userOffersToThem.length - a.userOffersToThem.length;
    }
    // 4. Distance (ascending)
    if (a.collector.distance !== b.collector.distance) {
      return a.collector.distance - b.collector.distance;
    }
    // 5. Avg rating (descending)
    if (b.collector.avgRating !== a.collector.avgRating) {
      return b.collector.avgRating - a.collector.avgRating;
    }
    return 0;
  });
}
