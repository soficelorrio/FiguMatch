import { useState, useEffect, useMemo } from 'react';
import {
  UserProfile,
  StickerState,
  StickerStatus,
  NearbyCollector,
  MatchResult,
  ChatMessage,
  TradeProposal,
  TradeStatus
} from './types';
import {
  INITIAL_USER,
  INITIAL_STICKER_LIST,
  INITIAL_COLLECTORS,
  INITIAL_CHATS,
  INITIAL_TRADES,
  calculateMatches,
  INITIAL_ALBUMS,
  SUGGESTED_SAFE_POINTS
} from './data';

// Component imports
import BottomNav from './components/BottomNav';
import WelcomeScreen from './components/WelcomeScreen';
import AuthScreen from './components/AuthScreen';
import ProfileCreationScreen from './components/ProfileCreationScreen';
import AlbumSelectionScreen from './components/AlbumSelectionScreen';
import MyAlbumScreen from './components/MyAlbumScreen';
import MatchesScreen from './components/MatchesScreen';
import MatchDetailScreen from './components/MatchDetailScreen';
import ChatScreen from './components/ChatScreen';
import ProposalScreen from './components/ProposalScreen';
import ProfileViewScreen from './components/ProfileViewScreen';
import SecurityScreen from './components/SecurityScreen';
import SafePointsScreen from './components/SafePointsScreen';import { SafePoint } from './types';

import {
  MessageSquare,
  ShieldCheck,
  Star,
  MapPin,
  RefreshCw,
  Bell,
  Clock,
  Award,
  Sparkles,
  Info
} from 'lucide-react';

const STORAGE_KEYS = {
  USER: 'figumatch_user_profile',
  STICKERS: 'figumatch_stickers_list',
  CHATS: 'figumatch_chats_list',
  TRADES: 'figumatch_trades_list',
  COLLECTORS: 'figumatch_collectors',
  SAFE_POINTS: 'figumatch_safe_points_list'
};

export default function App() {
  // Navigation states
  const [activeTab, setActiveTab] = useState<'inicio' | 'album' | 'matches' | 'chat' | 'perfil' | 'puntos_seguros'>('inicio');
  const [subView, setSubView] = useState<{
    type: 'welcome' | 'auth' | 'create_profile' | 'select_album' | 'match_detail' | 'chat_room' | 'trade_offer' | 'security_center';
    paramId?: string; // collectorId
  }>({ type: 'welcome' });

  // Core state declarations
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [stickersList, setStickersList] = useState<StickerState[]>([]);
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [trades, setTrades] = useState<TradeProposal[]>([]);
  const [collectors, setCollectors] = useState<NearbyCollector[]>([]);
  const [safePoints, setSafePoints] = useState<SafePoint[]>([]);
  const [preselectedPointName, setPreselectedPointName] = useState<string | null>(null);

  // Simulated push notifications state
  const [notifications, setNotifications] = useState<string[]>([
    '🔥 ¡Tenés un nuevo match con Martina a 1,2 km!',
    '🏪 Registramos un punto seguro cerca de tu zona.',
    '💬 Martina te envió un mensaje'
  ]);

  // Auth helper buffer
  const [authBuffer, setAuthBuffer] = useState<{ name: string; email: string } | null>(null);

  // 1. Initial State Hydration with local storage loops
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
      const storedStickers = localStorage.getItem(STORAGE_KEYS.STICKERS);
      const storedChats = localStorage.getItem(STORAGE_KEYS.CHATS);
      const storedTrades = localStorage.getItem(STORAGE_KEYS.TRADES);
      const storedCollectors = localStorage.getItem(STORAGE_KEYS.COLLECTORS);
      const storedSafePoints = localStorage.getItem(STORAGE_KEYS.SAFE_POINTS);

      if (storedUser) {
        setUserProfile(JSON.parse(storedUser));
        setSubView({ type: 'match_detail' }); // default view after login, or home
        // Reset subView to none so that the app starts inside the dashboard
        setSubView({ type: 'match_detail', paramId: 'none' }); // acts as normal main view
      } else {
        // Preset default state first but prompt Welcome
        setUserProfile(INITIAL_USER);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(INITIAL_USER));
      }

      setStickersList(storedStickers ? JSON.parse(storedStickers) : INITIAL_STICKER_LIST);
      setChats(storedChats ? JSON.parse(storedChats) : INITIAL_CHATS);
      setTrades(storedTrades ? JSON.parse(storedTrades) : INITIAL_TRADES);
      setCollectors(storedCollectors ? JSON.parse(storedCollectors) : INITIAL_COLLECTORS);
      setSafePoints(storedSafePoints ? JSON.parse(storedSafePoints) : SUGGESTED_SAFE_POINTS);
    } catch (e) {
      console.error('Failed reading storage defaults', e);
      // Fallback
      setUserProfile(INITIAL_USER);
      setStickersList(INITIAL_STICKER_LIST);
      setChats(INITIAL_CHATS);
      setTrades(INITIAL_TRADES);
      setCollectors(INITIAL_COLLECTORS);
      setSafePoints(SUGGESTED_SAFE_POINTS);
    }
  }, []);

  // Quick helper to write state updates back to LocalStorage
  const persistState = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn('Could not store update', e);
    }
  };

  const handleResetData = () => {
    localStorage.clear();
    setUserProfile(INITIAL_USER);
    setStickersList(INITIAL_STICKER_LIST);
    setChats(INITIAL_CHATS);
    setTrades(INITIAL_TRADES);
    setCollectors(INITIAL_COLLECTORS);
    setActiveTab('inicio');
    setSubView({ type: 'match_detail', paramId: 'none' });
    setNotifications([
      '♻️ Se restablecieron las figuritas y chats de prueba.',
      '🔥 Tenés coincidencia alta con Martina cerca tuyo.'
    ]);
  };

  // 2. Matching calculation trigger
  const matchedResults = useMemo(() => {
    if (!userProfile) return [];
    return calculateMatches(
      userProfile.activeAlbumId,
      stickersList,
      collectors,
      userProfile.blockedUsers
    );
  }, [userProfile, stickersList, collectors]);

  // Read unread chat badge
  const unreadMessagesCount = useMemo(() => {
    // Return mock unread count
    return 1;
  }, []);

  const totalHighMatchesCount = useMemo(() => {
    return matchedResults.filter((m) => m.matchLevel === 'alta').length;
  }, [matchedResults]);

  // 3. Mutation handlers
  const handleUpdateStickerStatus = (code: string, status: StickerStatus) => {
    const updated = [...stickersList];
    const index = updated.findIndex((s) => s.code === code);
    if (index >= 0) {
      updated[index] = { code, status };
    } else {
      updated.push({ code, status });
    }
    setStickersList(updated);
    persistState(STORAGE_KEYS.STICKERS, updated);

    // Dynamic push notifier
    if (status === 'faltante') {
      addNotification(`🔍 Buscando quién tiene la figurita #${code} cerca tuyo...`);
    } else if (status === 'repetida') {
      addNotification(`🔵 Pusiste la figurita #${code} a disposición para canje.`);
    }
  };

  const handleBulkAddStickers = (codes: string[], status: StickerStatus) => {
    const updated = [...stickersList];
    codes.forEach((code) => {
      const idx = updated.findIndex((s) => s.code === code);
      if (idx >= 0) {
        updated[idx] = { code, status };
      } else {
        updated.push({ code, status });
      }
    });
    setStickersList(updated);
    persistState(STORAGE_KEYS.STICKERS, updated);
    addNotification(`⚡ Se cargaron ${codes.length} figuritas como ${status === 'faltante' ? 'Faltantes' : 'Repetidas'}.`);
  };

  const addNotification = (text: string) => {
    setNotifications((prev) => [text, ...prev.slice(0, 5)]);
  };

  // Chat message submission
  const handleSendMessage = (receiverId: string, text: string) => {
    const newMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      senderId: 'sofi_user',
      receiverId,
      text,
      timestamp: new Date().toISOString()
    };
    const updated = [...chats, newMsg];
    setChats(updated);
    persistState(STORAGE_KEYS.CHATS, updated);
  };

  // Automated reply simulation engine
  const handleSimulateResponse = (collectorId: string, textSent: string) => {
    const responder = collectors.find((c) => c.id === collectorId);
    if (!responder) return;

    let textReply = '¡De una! Dejame revisar las figuritas que tengo guardadas en casa y coordinamos de toque por acá. 😊';
    const cleanWord = textSent.toLowerCase();

    if (cleanWord.includes('seguro') || cleanWord.includes('punto') || cleanWord.includes('donde')) {
      textReply = `¡Sii, me viene genial encontrarnos en el Kiosco El Álbum de Av. Santa Fe en Palermo o en la plaza. ¿Te queda cómodo hoy a las 18?`;
    } else if (cleanWord.includes('interes') || cleanWord.includes('cambio') || cleanWord.includes('puedo')) {
      textReply = `¡Hola! Sí, vi que tenemos un Match Alto. Te cargué la propuesta formal de canje por la app, tocala arriba en "Propuesta" para aceptar.`;
    } else if (cleanWord.includes('hola') || cleanWord.includes('buenas')) {
      textReply = `¡Hola! Todo bien por acá. Sii me interesa de una cambiar las que tenemos cruzadas.`;
    } else if (cleanWord.includes('hecho') || cleanWord.includes('listo') || cleanWord.includes('complete') || cleanWord.includes('cambiado')) {
      textReply = `¡Perfecto! Ya marqué el intercambio como completado. ¡Muchísimas gracias por la seriedad, ya sumás puntos!`;
    }

    const simMsg: ChatMessage = {
      id: 'msg_sim_' + Date.now(),
      senderId: collectorId,
      receiverId: 'sofi_user',
      text: textReply,
      timestamp: new Date().toISOString()
    };

    const updated = [...chats, simMsg];
    setChats(updated);
    persistState(STORAGE_KEYS.CHATS, updated);
    addNotification(`💬 Nuevo mensaje seguro recibido de ${responder.name}`);
  };

  // Trade Proposals Actions
  const handleAddTradeProposal = (proposal: TradeProposal) => {
    const updated = [proposal, ...trades];
    setTrades(updated);
    persistState(STORAGE_KEYS.TRADES, updated);
    addNotification(`🤝 Enviasta propuesta de trueque a ${proposal.receiverName}.`);
  };

  const handleUpdateProposalStatus = (
    id: string,
    newStatus: TradeStatus,
    rating?: number,
    safePointRating?: { stars: number; experienceText: string }
  ) => {
    // Rule 7: Increment exchanges count in safe points database if trade is completed ('realizado')
    if (newStatus === 'realizado') {
      const proposal = trades.find((p) => p.id === id);
      if (proposal && proposal.safePointName) {
        setSafePoints((currentPts) => {
          let found = false;
          const updatedPts = currentPts.map((sp) => {
            if (sp.name === proposal.safePointName) {
              found = true;
              return {
                ...sp,
                exchangesCount: sp.exchangesCount + 1,
                lastActivity: 'intercambio concretado hace unos instantes'
              };
            }
            return sp;
          });
          if (found) {
            persistState(STORAGE_KEYS.SAFE_POINTS, updatedPts);
          }
          return updatedPts;
        });
      }
    }

    // Dynamic rating evaluation for safe point
    if (safePointRating) {
      const proposal = trades.find((p) => p.id === id);
      if (proposal && proposal.safePointName) {
        setSafePoints((currentPts) => {
          const updatedPts = currentPts.map((sp) => {
            if (sp.name === proposal.safePointName) {
              const divisor = sp.exchangesCount || 1;
              const oldTotalSum = sp.rating * Math.max(0, sp.exchangesCount - 1);
              const nextRating = parseFloat(((oldTotalSum + safePointRating.stars) / divisor).toFixed(1));

              let safetyAdjustment = 0;
              if (safePointRating.experienceText === 'Mala') {
                safetyAdjustment = -10;
              } else if (safePointRating.experienceText === 'Muy buena') {
                safetyAdjustment = 2;
              } else if (safePointRating.experienceText === 'Buena') {
                safetyAdjustment = 1;
              }
              const nextSafety = Math.min(100, Math.max(15, sp.safetyPercent + safetyAdjustment));

              return {
                ...sp,
                rating: nextRating,
                safetyPercent: nextSafety,
                lastActivity: 'calificado por usuario hace unos instantes'
              };
            }
            return sp;
          });
          persistState(STORAGE_KEYS.SAFE_POINTS, updatedPts);
          return updatedPts;
        });
      }
    }

    const updated = trades.map((t) => {
      if (t.id === id) {
        const changes: Partial<TradeProposal> = { status: newStatus };
        if (rating) {
          changes.ratingGivenForThem = rating;
          changes.feedbackText = `Calificado positivamente con ${rating} estrellas.`;
          
          // Dynamically adjust exchange statistics for counterparty
          adjustCounterpartyExchanges(t.receiverId);
        }
        return { ...t, ...changes };
      }
      return t;
    });
    setTrades(updated);
    persistState(STORAGE_KEYS.TRADES, updated);
    addNotification(`🔔 El intercambio cambió de estado a "${newStatus.toUpperCase()}"`);
  };

  const adjustCounterpartyExchanges = (userId: string) => {
    const updatedCollectors = collectors.map((c) => {
      if (c.id === userId) {
        return {
          ...c,
          exchangesCount: c.exchangesCount + 1,
          avgRating: parseFloat(((c.avgRating * c.exchangesCount + 5) / (c.exchangesCount + 1)).toFixed(1))
        };
      }
      return c;
    });
    setCollectors(updatedCollectors);
    persistState(STORAGE_KEYS.COLLECTORS, updatedCollectors);
  };

  // Safe Points action handlers
  const handleReportSafePoint = (pointId: string, reason: string) => {
    const updated = safePoints.map((sp) => {
      if (sp.id === pointId) {
        const nextReports = sp.reportsCount + 1;
        // Deduct 15% safety per report
        const nextSafety = Math.max(15, sp.safetyPercent - 15);
        return {
          ...sp,
          reportsCount: nextReports,
          safetyPercent: nextSafety,
          lastActivity: `reportado (${reason}) hace unos instantes`
        };
      }
      return sp;
    });
    setSafePoints(updated);
    persistState(STORAGE_KEYS.SAFE_POINTS, updated);
    addNotification(`⚠️ Reporte registrado para punto seguro. Calificación de seguridad recalculada.`);
  };

  const handleRateSafePointDirectly = (pointId: string, stars: number, experienceText: string) => {
    const updated = safePoints.map((sp) => {
      if (sp.id === pointId) {
        const nextExchanges = sp.exchangesCount + 1;
        const nextRating = parseFloat(
          ((sp.rating * sp.exchangesCount + stars) / nextExchanges).toFixed(1)
        );
        let safetyAdjustment = 0;
        if (experienceText === 'Mala') {
          safetyAdjustment = -10;
        } else if (experienceText === 'Muy buena') {
          safetyAdjustment = 2;
        } else if (experienceText === 'Buena') {
          safetyAdjustment = 1;
        }
        const nextSafety = Math.min(105, Math.max(15, sp.safetyPercent + safetyAdjustment));

        return {
          ...sp,
          rating: nextRating,
          exchangesCount: nextExchanges,
          safetyPercent: nextSafety > 100 ? 100 : nextSafety,
          lastActivity: 'calificado hace unos instantes'
        };
      }
      return sp;
    });
    setSafePoints(updated);
    persistState(STORAGE_KEYS.SAFE_POINTS, updated);
    addNotification(`⭐ Calificación registrada para el punto seguro.`);
  };

  // Block & Report actions
  const handleBlockUser = (collectorId: string) => {
    if (!userProfile) return;
    const blockedList = [...userProfile.blockedUsers, collectorId];
    const newProfile = { ...userProfile, blockedUsers: blockedList };
    setUserProfile(newProfile);
    persistState(STORAGE_KEYS.USER, newProfile);
    addNotification('🔒 Usuario bloqueado. No volverá a figurar en tus coincidencias.');
  };

  const handleReportUser = (collectorId: string, reason: string) => {
    if (!userProfile) return;
    const reportedList = [...userProfile.reportedUsers, collectorId];
    const newProfile = { ...userProfile, reportedUsers: reportedList };
    setUserProfile(newProfile);
    persistState(STORAGE_KEYS.USER, newProfile);
    addNotification('⚠️ Reporte registrado en el sistema. Moderación procederá a auditar.');
  };

  const handleToggleSupervision = (val: boolean) => {
    if (!userProfile) return;
    const newProfile = { ...userProfile, isSupervised: val };
    setUserProfile(newProfile);
    persistState(STORAGE_KEYS.USER, newProfile);
  };

  // Screen Dispatcher / Router
  const renderDashboardScreen = () => {
    if (!userProfile) return null;
    
    // Select active album descriptor
    const currentAlbum = INITIAL_ALBUMS.find((a) => a.id === userProfile.activeAlbumId) || INITIAL_ALBUMS[0];

    // Filter active trades to show on Home
    const activeExchanges = trades.filter(
      (t) => t.status !== 'realizado' && t.status !== 'cancelado'
    );

    return (
      <div className="space-y-4 px-2 pb-16 font-sans">
        
        {/* Dynamic Greeting */}
        <div className="flex justify-between items-center bg-white py-2 border-b border-gray-50">
          <div>
            <h1 className="text-xl font-black text-gray-950 font-display flex items-center gap-1.5">
              ¡Hola, {userProfile.name}! {userProfile.avatar}
            </h1>
            <p className="text-[10px] text-gray-400 mt-0.5 font-semibold flex items-center gap-0.5">
              <MapPin size={10} className="text-red-400" /> Palermo, capital federal
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleResetData()}
              className="p-1.5 rounded-xl border border-gray-100 text-[10px] font-bold text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 flex items-center gap-1 transition-all"
              title="Volver a los valores predeterminados"
            >
              <RefreshCw size={11} /> Reiniciar datos
            </button>
          </div>
        </div>

        {/* Big Slogan Card */}
        <div className="bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-700 text-white rounded-3xl p-5 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 h-32 w-32 bg-indigo-500 rounded-full opacity-20 filter blur-xl"></div>
          <div className="relative space-y-2.5">
            <span className="text-[9px] bg-indigo-500/50 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              ¿Por qué FiguMatch?
            </span>
            <p className="text-xs font-semibold leading-relaxed">
              “Encontrá las figuritas que te faltan cerca tuyo y cambiá tus repetidas de forma simple, rápida y segura.”
            </p>
          </div>
        </div>

        {/* Notifications push alerts dashboard */}
        {notifications.length > 0 && (
          <div className="bg-white border border-gray-50 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-indigo-500 tracking-wider">
              <Bell size={12} className="animate-bounce" /> Alertas del Día
            </div>
            <div className="text-[11px] font-semibold text-gray-700 divide-y divide-gray-50">
              {notifications.map((note, index) => (
                <div key={index} className="py-2.5 first:pt-0 last:pb-0 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full flex-shrink-0"></span>
                  <span className="leading-tight">{note}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic statistics metrics box */}
        <div className="grid grid-cols-2 gap-3.5">
          <button
            onClick={() => {
              setActiveTab('album');
              setSubView({ type: 'match_detail', paramId: 'none' });
            }}
            className="bg-white border border-gray-100 p-4 rounded-3xl text-left hover:scale-[1.02] active:scale-95 transition flex flex-col justify-between h-24 shadow-2xs"
          >
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Álbum en curso</p>
            <p className="text-xs font-extrabold text-indigo-600 leading-snug tracking-tight truncate w-full">
              {currentAlbum.name}
            </p>
            <span className="text-[10px] text-gray-400 underline font-semibold mt-1">Cargar figus y grid</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('matches');
              setSubView({ type: 'match_detail', paramId: 'none' });
            }}
            className="bg-white border border-indigo-50 p-4 rounded-3xl text-left hover:scale-[1.02] active:scale-95 transition flex flex-col justify-between h-24 shadow-2xs relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 h-10 w-10 bg-indigo-100/30 rounded-bl-3xl flex items-center justify-center">
              <Sparkles size={14} className="text-indigo-600 animate-spin-slow" />
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Coincidencias</p>
            <div>
              <p className="text-lg font-black text-indigo-600 leading-none">
                {totalHighMatchesCount} altas
              </p>
              <span className="text-[9px] text-gray-400 block mt-0.5">con usuarios cercanos</span>
            </div>
          </button>
        </div>

        {/* Active Exchanges section code */}
        {activeExchanges.length > 0 && (
          <div className="bg-slate-50 border border-indigo-100/50 rounded-3xl p-4.5 space-y-3">
            <p className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1">
              🤝 Canjes en Marcha ({activeExchanges.length})
            </p>

            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {activeExchanges.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    const matchedCol = collectors.find((c) => c.id === p.receiverId || c.id === p.senderId);
                    if (matchedCol) {
                      setSubView({ type: 'trade_offer', paramId: matchedCol.id });
                    }
                  }}
                  className="bg-white p-3 rounded-2xl border border-gray-150 flex justify-between items-center hover:bg-slate-50 transition cursor-pointer"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-2xl">{p.receiverAvatar}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{p.receiverName}</p>
                      <p className="text-[9px] text-gray-400">Punto: {p.safePointName || 'No fijado'}</p>
                    </div>
                  </div>
                  
                  <span className="text-[9px] uppercase font-black bg-amber-100 text-amber-800 py-1 px-2.5 rounded-full">
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommended point security boxes */}
        <div className="bg-amber-50/50 border border-amber-100/50 rounded-3xl p-4.5 space-y-2">
          <p className="text-xs font-black text-amber-900 flex items-center gap-1 leading-none">
            🛡️ Zona Palermo: Punto Seguro Recomendado
          </p>
          <p className="text-[11px] text-amber-800/90 leading-relaxed font-medium">
            <strong>Kiosco El Álbum:</strong> Av. Santa Fe 3432. Es un socio oficial FiguMatch. Tiene cámaras de seguridad las 24hs, mesas de canje cómodas y amplia circulación de chicos y padres los viernes por la tarde.
          </p>
        </div>

      </div>
    );
  };

  const renderActiveScreen = () => {
    // If we're inside standard bottom navigations
    if (subView.type === 'match_detail' && subView.paramId !== 'none') {
      const selectedId = subView.paramId;
      const matchResult = matchedResults.find((m) => m.collector.id === selectedId);
      if (matchResult) {
        return (
          <MatchDetailScreen
            matchResult={matchResult}
            onBack={() => setSubView({ type: 'match_detail', paramId: 'none' })}
            onOpenChat={() => setSubView({ type: 'chat_room', paramId: selectedId })}
            onProposeTrade={() => setSubView({ type: 'trade_offer', paramId: selectedId })}
            onBlockUser={handleBlockUser}
            onReportUser={handleReportUser}
            isSupervised={userProfile?.isSupervised}
          />
        );
      }
    }

    if (subView.type === 'chat_room' && subView.paramId) {
      const selectedId = subView.paramId;
      const collector = collectors.find((c) => c.id === selectedId);
      if (collector && userProfile) {
        // filter messages between user and this collector
        const roomMsgs = chats.filter(
          (m) =>
            (m.senderId === 'sofi_user' && m.receiverId === selectedId) ||
            (m.senderId === selectedId && m.receiverId === 'sofi_user')
        );
        return (
          <ChatScreen
            collector={collector}
            messages={roomMsgs}
            currentUserId="sofi_user"
            onBack={() => setSubView({ type: 'match_detail', paramId: 'none' })}
            onSendMessage={(txt) => handleSendMessage(selectedId, txt)}
            onSimulateResponse={handleSimulateResponse}
            userProfile={userProfile}
          />
        );
      }
    }

    if (subView.type === 'trade_offer' && subView.paramId) {
      const selectedId = subView.paramId;
      const collector = collectors.find((c) => c.id === selectedId);
      if (collector && userProfile) {
        // filter missing / duplicates for trade constructor
        const userDuplicates = stickersList
          .filter((s) => s.status === 'repetida')
          .map((s) => s.number);
        const userMissings = stickersList
          .filter((s) => s.status === 'faltante')
          .map((s) => s.number);

        return (
          <ProposalScreen
            collector={collector}
            userDuplicates={userDuplicates}
            userMissings={userMissings}
            onSubmitProposal={(prop) => {
              handleAddTradeProposal(prop);
              setPreselectedPointName(null); // clear preselected safe point after trade is submitted
            }}
            onBack={() => setSubView({ type: 'match_detail', paramId: 'none' })}
            activeProposals={trades}
            onUpdateProposalStatus={handleUpdateProposalStatus}
            userProfile={userProfile}
            safePoints={safePoints}
            initialSafePointName={preselectedPointName}
          />
        );
      }
    }

    if (subView.type === 'security_center') {
      return (
        <SecurityScreen
          onBack={() => setSubView({ type: 'match_detail', paramId: 'none' })}
          userProfile={userProfile!}
          onUpdateUserProfile={(updated) => {
            setUserProfile(updated);
            persistState(STORAGE_KEYS.USER, updated);
          }}
          blockedUsersCount={userProfile?.blockedUsers.length || 0}
          reportedUsersCount={userProfile?.reportedUsers.length || 0}
        />
      );
    }

    // Default tabs Router
    switch (activeTab) {
      case 'inicio':
        return renderDashboardScreen();
      case 'album':
        return (
          <MyAlbumScreen
            activeAlbumId={userProfile?.activeAlbumId || 'mundial_2026'}
            onSelectAlbum={(albumId) => {
              if (userProfile) {
                const updated = { ...userProfile, activeAlbumId: albumId };
                setUserProfile(updated);
                persistState(STORAGE_KEYS.USER, updated);
              }
            }}
            stickers={stickersList}
            albumName={
              INITIAL_ALBUMS.find((a) => a.id === userProfile?.activeAlbumId)?.name || 'Panini Mundial 2026'
            }
            totalStickers={
              INITIAL_ALBUMS.find((a) => a.id === userProfile?.activeAlbumId)?.totalStickers || 250
            }
            onUpdateStickerStatus={handleUpdateStickerStatus}
            onBulkAdd={handleBulkAddStickers}
          />
        );
      case 'matches':
        return (
          <MatchesScreen
            matches={matchedResults}
            userProfile={userProfile!}
            safePoints={safePoints}
            onSelectMatch={(id) => setSubView({ type: 'match_detail', paramId: id })}
            onOpenChat={(id) => setSubView({ type: 'chat_room', paramId: id })}
            onProposeTrade={(id) => setSubView({ type: 'trade_offer', paramId: id })}
            onSelectSafePoint={(point) => {
              setPreselectedPointName(point.name);
              addNotification(`📍 Fijaste "${point.name}" como punto seguro para tu canje. Coordiná ahora un trueque!`);
            }}
          />
        );
      case 'puntos_seguros':
        return (
          <SafePointsScreen
            safePoints={safePoints}
            onSelectSafePoint={(point) => {
              setPreselectedPointName(point.name);
              addNotification(`📍 Elegiste "${point.name}". Podés usarlo para proponer un trueque seguro!`);
            }}
            onReportPoint={handleReportSafePoint}
            onRatePoint={handleRateSafePointDirectly}
            onBack={() => setActiveTab('inicio')}
          />
        );
      case 'chat':
        // list conversations
        return (
          <div className="space-y-4 px-2 pb-16 font-sans">
            <h2 className="text-xl font-black text-gray-950 font-display">Mensajes</h2>
            
            <div className="space-y-2.5 max-h-[64vh] overflow-y-auto pr-1">
              {collectors
                .filter((c) => !userProfile?.blockedUsers.includes(c.id))
                .map((c) => {
                  // Get last message in this room
                  const roomMsgs = chats.filter(
                    (m) =>
                      (m.senderId === 'sofi_user' && m.receiverId === c.id) ||
                      (m.senderId === c.id && m.receiverId === 'sofi_user')
                  );
                  const lastMsg = roomMsgs[roomMsgs.length - 1];

                  return (
                    <button
                      key={c.id}
                      onClick={() => setSubView({ type: 'chat_room', paramId: c.id })}
                      className="w-full flex items-center justify-between p-3.5 bg-white border border-gray-150 hover:bg-slate-50 transition text-left rounded-3xl"
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-4">
                        <span className="text-3xl p-1 bg-gray-50 rounded-full border border-gray-100">{c.avatar}</span>
                        <div className="min-w-0">
                          <p className="text-xs font-extrabold text-slate-900 leading-tight">{c.name}</p>
                          <p className="text-[10px] text-gray-400 mt-1 truncate leading-none">
                            {lastMsg ? lastMsg.text : 'Hacer primer canje con este usuario...'}
                          </p>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className="text-[8px] text-gray-400 font-bold block">{c.activityTime}</span>
                        {roomMsgs.length > 0 && !lastMsg.senderId.startsWith('sofi') && (
                          <span className="h-2 w-2 rounded-full bg-red-500 inline-block mt-1 animate-ping"></span>
                        )}
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>
        );
      case 'perfil':
        return (
          <ProfileViewScreen
            userProfile={userProfile!}
            onOpenAlbumSelector={() => setSubView({ type: 'select_album' })}
            onOpenSecurityCenter={() => setSubView({ type: 'security_center' })}
            onLogout={() => {
              // Sign out simulation
              setUserProfile(null);
              setSubView({ type: 'welcome' });
              setActiveTab('inicio');
            }}
          />
        );
      default:
        return renderDashboardScreen();
    }
  };

  // If user profile is not configured yet (Onboarding Flow)
  const renderOnboardingFlow = () => {
    switch (subView.type) {
      case 'welcome':
        return (
          <WelcomeScreen
            onStart={(mode) => setSubView({ type: 'auth', paramId: mode })}
          />
        );
      case 'auth':
        return (
          <AuthScreen
            initialMode={(subView.paramId as 'login' | 'register') || 'register'}
            onBack={() => setSubView({ type: 'welcome' })}
            onSubmit={(data) => {
              setAuthBuffer(data);
              if (data.isNewUser) {
                setSubView({ type: 'create_profile' });
              } else {
                // Instantly login as original Sofi profiles
                setUserProfile(INITIAL_USER);
                persistState(STORAGE_KEYS.USER, INITIAL_USER);
                setSubView({ type: 'match_detail', paramId: 'none' });
                addNotification('🔑 Sesión restablecida como Sofi.');
              }
            }}
          />
        );
      case 'create_profile':
        return (
          <ProfileCreationScreen
            initialName={authBuffer?.name || 'Sofi'}
            initialEmail={authBuffer?.email || 'sofi.figumatch@gmail.com'}
            onProfileCreated={(newProfile) => {
              setUserProfile(newProfile);
              persistState(STORAGE_KEYS.USER, newProfile);
              setSubView({ type: 'select_album' });
              addNotification('🎉 Tu perfil FiguMatch se creó de manera segura!');
            }}
          />
        );
      case 'select_album':
        return (
          <AlbumSelectionScreen
            activeAlbumId={userProfile?.activeAlbumId || 'mundial_2026'}
            onSelectAlbum={(albumId) => {
              if (userProfile) {
                const updated = { ...userProfile, activeAlbumId: albumId };
                setUserProfile(updated);
                persistState(STORAGE_KEYS.USER, updated);
                addNotification('📖 Álbum de colección activo cambiado.');
              }
            }}
            onNext={() => {
              setSubView({ type: 'match_detail', paramId: 'none' });
              setActiveTab('album');
              addNotification('🌟 Álbum listo. Tocá números para cargar tus faltantes u repetidas.');
            }}
            hideNextButton={false}
          />
        );
      default:
        return (
          <WelcomeScreen
            onStart={(mode) => setSubView({ type: 'auth', paramId: mode })}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-800 flex flex-col justify-center items-center py-6 px-4">
      
      {/* Physical Device Frame Wrap for Desktop viewports */}
      <div className="relative w-full max-w-md bg-white border-[10px] border-slate-950 rounded-[44px] shadow-2xl h-[92vh] overflow-hidden flex flex-col">
        
        {/* Dynamic Mobile Notch / Camera layout */}
        <div className="absolute top-0 inset-x-0 h-7 bg-slate-950 flex justify-center items-center rounded-b-2xl z-50">
          <div className="w-24 h-4 bg-slate-900 rounded-full flex items-center justify-between px-3">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-800 animate-pulse"></span>
            <span className="w-6 h-1 bg-slate-800 rounded-full"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-800"></span>
          </div>
        </div>

        {/* Dynamic status line layout */}
        <div className="h-6 flex justify-between items-center px-6 mt-7 text-[10px] font-extrabold text-gray-500 bg-white select-none z-10">
          <span>{new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</span>
          <div className="flex gap-1.5 items-center">
            <span className="inline-block tracking-tight bg-green-150 text-green-700 px-1 py-0.2 rounded font-black uppercase text-[8px]">
              FiguMatch Safe 🔒
            </span>
            <div className="flex gap-0.5">
              <span className="h-1.5 w-1 rounded-full bg-green-500"></span>
              <span className="h-2 w-1 rounded-full bg-green-500"></span>
              <span className="h-2.5 w-1 rounded-full bg-green-500"></span>
            </div>
          </div>
        </div>

        {/* Scrollable Container Content */}
        <main className="flex-1 overflow-y-auto px-4 py-3 bg-white scrollbar-thin">
          {userProfile ? renderActiveScreen() : renderOnboardingFlow()}
        </main>

        {/* Persistent bottom toolbar for app */}
        {userProfile && (
          <div className="flex-shrink-0 h-16 bg-white border-t border-gray-50 relative z-30">
            <BottomNav
              activeTab={activeTab}
              setActiveTab={(tab) => {
                setActiveTab(tab);
                setSubView({ type: 'match_detail', paramId: 'none' }); // back to general tabs view
              }}
              unreadCount={unreadMessagesCount}
              matchCount={totalHighMatchesCount}
            />
          </div>
        )}
      </div>

      {/* Under Frame helpful info lines for review */}
      <div className="w-full max-w-md mt-4 text-center text-xs text-slate-500 font-sans tracking-tight leading-relaxed">
        <p className="font-semibold flex justify-center items-center gap-1">
          <Info size={13} className="text-indigo-400" /> Prototipo de Alta Fidelidad - FiguMatch
        </p>
        <p className="text-[10px] opacity-80 mt-1">
          Usa almacenamiento local para mantener tus cambios. Para reiniciar colecciones de prueba presiona "Reiniciar datos" arriba.
        </p>
      </div>

    </div>
  );
}
