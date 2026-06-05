export type UserType = 'coleccionista' | 'padre_madre' | 'kiosco' | 'club';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  neighborhood: string;
  userType: UserType;
  isSupervised: boolean;
  avgRating: number;
  exchangesCount: number;
  badges: string[];
  activeAlbumId: string;
  blockedUsers: string[]; // List of user IDs blocked
  reportedUsers: string[]; // List of user IDs reported
}

export type AlbumCategory = 'Futbol' | 'Animacion' | 'Anime' | 'Mundo Geek' | 'Otros';

export interface Album {
  id: string;
  name: string;
  totalStickers: number;
  category: AlbumCategory;
  imageUrl: string;
}

export type StickerStatus = 'faltante' | 'tengo' | 'repetida' | 'reservada' | 'intercambiada';

export interface StickerState {
  number: number;
  status: StickerStatus;
}

export interface NearbyCollector {
  id: string;
  name: string;
  avatar: string;
  neighborhood: string;
  distance: number; // in km
  avgRating: number;
  exchangesCount: number;
  userType: UserType;
  badges: string[];
  isVerified: boolean;
  activeAlbumId: string;
  stickers: { [num: number]: StickerStatus }; // Sticker state mapping
  activityTime: string; // e.g. "Hace 5 min", "Hace 2 horas"
}

export interface MatchResult {
  collector: NearbyCollector;
  matchLevel: 'alta' | 'media' | 'baja';
  userOffersToThem: number[]; // stickers you have as 'repetida' that they have as 'faltante'
  theyOfferToUser: number[]; // stickers they have as 'repetida' that you have as 'faltante'
  matchScore: number; // helper score to rank
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string; // ISO String
}

export type TradeStatus =
  | 'propuesto'
  | 'aceptado'
  | 'en_coordinacion'
  | 'confirmado'
  | 'realizado'
  | 'cancelado'
  | 'no_presento';

export interface TradeProposal {
  id: string;
  senderId: string;
  receiverId: string;
  receiverName: string;
  receiverAvatar: string;
  offeredStickers: number[];
  requestedStickers: number[];
  status: TradeStatus;
  date: string; // ISO String or date label
  safePointName?: string;
  meetingTime?: string;
  ratingGivenForThem?: number;
  feedbackText?: string;
}

export interface SafePoint {
  id: string;
  name: string;
  type: 'kiosco' | 'club' | 'plaza' | 'centro_comercial' | 'otros';
  address: string;
  distance: string;
  rating: number;
  hours: string;
}
