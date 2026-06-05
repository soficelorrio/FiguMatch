import { useState, useMemo } from 'react';
import { SafePoint } from '../types';
import { 
  ShieldCheck, 
  MapPin, 
  Star, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  ThumbsUp, 
  Search, 
  Info, 
  ShieldCheck as ShieldIcon, 
  Flag,
  CheckCircle,
  HelpCircle,
  Check
} from 'lucide-react';

interface SafePointsScreenProps {
  safePoints: SafePoint[];
  onSelectSafePoint: (point: SafePoint) => void;
  onReportPoint: (pointId: string, reason: string) => void;
  onRatePoint: (pointId: string, stars: number, experienceText: string) => void;
  onBack?: () => void;
  activeTradeName?: string;
}

export default function SafePointsScreen({
  safePoints,
  onSelectSafePoint,
  onReportPoint,
  onRatePoint,
  onBack,
  activeTradeName
}: SafePointsScreenProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPoint, setSelectedPoint] = useState<SafePoint | null>(null);
  
  // Modals / sub-flows state
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('Lugar cerrado');
  const [customReportText, setCustomReportText] = useState('');
  
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewStars, setReviewStars] = useState(5);
  const [reviewExp, setReviewExp] = useState('Muy buena');

  // Success indicator notice
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Helper to get safety indicator text and color
  const getSafetyBadgeInfo = (safetyPercent: number) => {
    if (safetyPercent >= 90) {
      return { text: 'Muy seguro', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' };
    } else if (safetyPercent >= 80) {
      return { text: 'Seguro', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' };
    } else if (safetyPercent >= 60) {
      return { text: 'A revisar', color: 'bg-amber-500/10 text-amber-600 border-amber-500/20' };
    } else {
      return { text: 'No recomendado', color: 'bg-red-500/10 text-red-600 border-red-500/20' };
    }
  };

  const getSafetyLabel = (safetyPercent: number) => {
    if (safetyPercent >= 90) return 'Muy seguro';
    if (safetyPercent >= 80) return 'Seguro';
    if (safetyPercent >= 60) return 'A revisar';
    return 'No recomendado';
  };

  const getSafetyTextColor = (safetyPercent: number) => {
    if (safetyPercent >= 90) return 'text-emerald-600';
    if (safetyPercent >= 80) return 'text-emerald-650 text-emerald-600';
    if (safetyPercent >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  // Filtered points
  const filteredPoints = useMemo(() => {
    return safePoints.filter(p => {
      const term = searchTerm.toLowerCase().trim();
      return p.name.toLowerCase().includes(term) ||
             p.type.toLowerCase().includes(term) ||
             p.neighborhood.toLowerCase().includes(term) ||
             p.address.toLowerCase().includes(term);
    });
  }, [safePoints, searchTerm]);

  const triggerSuccessAlert = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  const handleSelectPointAction = (point: SafePoint) => {
    onSelectSafePoint(point);
    triggerSuccessAlert(`Seleccionaste "${point.name}" como punto seguro de encuentro.`);
    if (selectedPoint) setSelectedPoint(null);
  };

  const handleReportSubmit = () => {
    if (!selectedPoint) return;
    const finalReason = reportReason === 'Otro motivo' && customReportText 
      ? customReportText 
      : reportReason;
    onReportPoint(selectedPoint.id, finalReason);
    setReportModalOpen(false);
    triggerSuccessAlert(`Gracias. El reporte "${finalReason}" sobre ${selectedPoint.name} fue tomado y recalculará la seguridad del lugar.`);
    
    // update current modal view reference to see updated metrics if open
    const updated = safePoints.find(p => p.id === selectedPoint.id);
    if (updated) {
      // simulate the dynamic updates in report
      const newReportsCount = updated.reportsCount + 1;
      const calculatedSafety = Math.max(15, updated.safetyPercent - 15);
      setSelectedPoint({
        ...updated,
        reportsCount: newReportsCount,
        safetyPercent: calculatedSafety
      });
    } else {
      setSelectedPoint(null);
    }
    setCustomReportText('');
  };

  const handleRateSubmit = () => {
    if (!selectedPoint) return;
    onRatePoint(selectedPoint.id, reviewStars, reviewExp);
    setReviewModalOpen(false);
    triggerSuccessAlert(`¡Gracias por calificar tu experiencia! Tu reseña fue agregada.`);
    
    // update local reference inside details view if open
    const updated = safePoints.find(p => p.id === selectedPoint.id);
    if (updated) {
      setSelectedPoint({
        ...updated,
        rating: parseFloat(((updated.rating * updated.exchangesCount + reviewStars) / (updated.exchangesCount + 1)).toFixed(1)),
        exchangesCount: updated.exchangesCount + 1,
        lastActivity: 'hace unos instantes'
      });
    } else {
      setSelectedPoint(null);
    }
  };

  return (
    <div className="space-y-4 px-1 pb-16 font-sans">
      
      {/* Dynamic Slide Success Alert */}
      {successMessage && (
        <div className="fixed top-12 left-1/2 transform -translate-x-1/2 z-55 bg-indigo-900 border border-indigo-700/50 text-white font-extrabold text-xs py-3 px-5 rounded-2xl shadow-xl flex items-center gap-2 animate-fadeIn max-w-[340px]">
          <CheckCircle size={16} className="text-emerald-400 shrink-0" />
          <span className="text-left leading-tight">{successMessage}</span>
        </div>
      )}

      {/* Screen Title Page Layout */}
      <div className="text-left py-1">
        <h2 className="text-xl font-black text-slate-900 font-display flex items-center gap-2">
          <ShieldIcon className="text-indigo-600 fill-indigo-50" size={22} /> Puntos Seguros Oficiales
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Encontrá lugares confiables, recomendados por la comunidad de canje, con métricas de seguridad auditadas por tutores.
        </p>
      </div>

      {activeTradeName && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-3.5 text-left flex gap-2.5 items-start">
          <Info className="text-indigo-600 mt-0.5 shrink-0" size={16} />
          <div>
            <p className="text-[11px] font-black text-indigo-900 uppercase">Coordinando intercambio con {activeTradeName}</p>
            <p className="text-[10.5px] text-indigo-700 mt-0.5 leading-snug font-bold">
              Elegí uno de los siguientes puntos recomendados para que se asocie automáticamente a tu propuesta de de canje.
            </p>
          </div>
        </div>
      )}

      {/* Safety Notice Card Info */}
      <div className="bg-amber-50/50 border border-amber-200/40 p-3.5 rounded-2xl text-left text-amber-900 text-[11px] leading-relaxed flex gap-2">
        <AlertTriangle className="text-amber-600 mt-0.5 flex-shrink-0" size={14} />
        <div>
          <strong>Información sobre Puntos Seguros:</strong> Estos lugares sirven únicamente como puntos recomendados de encuentro. Son negocios, clubes o plazas públicas habilitadas y no corresponden a usuarios individuales. <strong>No chatean ni comercian figuritas de forma directa.</strong>
        </div>
      </div>

      {/* Search Input Box */}
      <div className="bg-white border border-slate-100 p-2.5 rounded-2xl shadow-3xs space-y-3">
        <div className="relative">
          <input
            id="safepoints-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, zona o tipo de punto..."
            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:bg-white text-slate-800 placeholder-slate-400"
          />
          <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2 text-[10px] text-slate-400 hover:text-slate-600 font-bold bg-slate-200/50 rounded px-1.5 py-0.5"
            >
              Borrar
            </button>
          )}
        </div>
      </div>

      {/* Main Grid Safe Points */}
      <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
        {filteredPoints.map((point) => {
          return (
            <div
              key={point.id}
              className="bg-white border border-slate-150 rounded-3xl p-5 shadow-3xs flex flex-col justify-between text-left relative overflow-hidden transition-all hover:border-slate-300"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl">🏪</span>
                    <h3 className="text-sm font-black text-slate-900 leading-tight">
                      {point.name}
                    </h3>
                  </div>
                  <p className="text-xs font-bold text-slate-500">
                    {point.type} · {point.neighborhood} · {point.distance}
                  </p>
                  <div className="pt-0.5">
                    {point.verificationState === 'verificado' ? (
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-black px-2 py-0.5 rounded-full uppercase tracking-wide inline-block">
                        Punto seguro verificado
                      </span>
                    ) : point.verificationState === 'comunidad' ? (
                      <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 font-black px-2 py-0.5 rounded-full uppercase tracking-wide inline-block">
                        Recomendado Comunidad
                      </span>
                    ) : (
                      <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 font-black px-2 py-0.5 rounded-full uppercase tracking-wide inline-block">
                        No verificado
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Safety & Performance Information */}
              <div className="my-3.5 pb-3.5 border-b border-slate-150 space-y-1.5 text-xs text-slate-700 font-bold">
                <p className="flex items-center gap-2">
                  <span className="text-sm">🔄</span>
                  <span>{point.exchangesCount} intercambios realizados</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-sm">🛡️</span>
                  <span>
                    Seguridad: <span className="font-extrabold">{point.safetyPercent}%</span> · <span className={`${getSafetyTextColor(point.safetyPercent)} font-extrabold`}>{getSafetyLabel(point.safetyPercent)}</span>
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-sm text-yellow-500">⭐</span>
                  <span>Calificación: {point.rating}</span>
                </p>
              </div>

              {/* Extra activity log label */}
              <p className="text-[10px] text-slate-400 font-bold mb-3">
                🕒 Última actividad: <strong className="text-slate-600">{point.lastActivity}</strong>
              </p>

              {/* Buttons row */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleSelectPointAction(point)}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-2 px-3 rounded-xl text-xs transition shadow-3xs cursor-pointer text-center order-2"
                >
                  Elegir como punto de encuentro
                </button>
                <button
                  onClick={() => setSelectedPoint(point)}
                  className="flex-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-extrabold py-2 px-3 rounded-xl text-xs transition cursor-pointer text-center order-1"
                >
                  Ver detalles
                </button>
              </div>
            </div>
          );
        })}

        {filteredPoints.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-3xl border border-slate-150 p-6">
            <HelpCircle size={32} className="text-slate-400 mx-auto stroke-1.5" />
            <p className="text-xs font-extrabold text-slate-600 mt-2">No encontramos puntos seguros para tu búsqueda</p>
            <p className="text-[10px] text-slate-400 mt-1">Intentá buscar con otros términos como 'Palermo' o 'Kiosco'.</p>
          </div>
        )}
      </div>

      {/* DETAIL MODAL SCREEN */}
      {selectedPoint && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-xs">
          <div className="bg-white rounded-[32px] w-full max-w-sm max-h-[85vh] overflow-y-auto p-5 shadow-2xl border border-slate-100 space-y-4 animate-slideUp text-left">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="bg-indigo-100 text-indigo-800 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                  Punto de encuentro recomendado
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1 leading-tight flex items-center gap-1.5">
                  🏪 {selectedPoint.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPoint(null)}
                className="p-1 px-2.5 bg-slate-50 rounded-full font-bold text-xs text-slate-500 hover:bg-slate-150 border border-slate-100"
              >
                Cerrar
              </button>
            </div>

            {/* General metrics */}
            <div className="space-y-3.5">
              
              {/* Verification & Address badge list */}
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold">Nombre del punto seguro:</span>
                  <span className="font-extrabold text-slate-800 text-right">{selectedPoint.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold">Tipo:</span>
                  <span className="font-extrabold text-slate-800">{selectedPoint.type}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold">Zona:</span>
                  <span className="font-extrabold text-slate-800">{selectedPoint.neighborhood}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold">Distancia:</span>
                  <span className="font-extrabold text-slate-800">{selectedPoint.distance}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold">Estado:</span>
                  <span className="font-extrabold text-emerald-700">
                    {selectedPoint.verificationState === 'verificado' ? "Punto seguro verificado" : 
                     selectedPoint.verificationState === 'comunidad' ? "Recomendado Comunidad" : "No verificado"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold">Intercambios realizados:</span>
                  <span className="font-extrabold text-slate-800">{selectedPoint.exchangesCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold">Seguridad:</span>
                  <span className="font-extrabold text-slate-800">
                    {selectedPoint.safetyPercent}% · <span className={`${getSafetyTextColor(selectedPoint.safetyPercent)} font-extrabold`}>{getSafetyLabel(selectedPoint.safetyPercent)}</span>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold">Calificación:</span>
                  <span className="font-extrabold text-slate-800">{selectedPoint.rating}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold">Reportes recientes:</span>
                  <span className={`font-bold ${selectedPoint.reportsCount > 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                    {selectedPoint.reportsCount} reportes en los últimos 30 días
                  </span>
                </div>
                {selectedPoint.hours && (
                  <div className="flex justify-between gap-1 border-t border-slate-200/55 pt-1.5 mt-1 text-[11px]">
                    <span className="text-slate-400 font-bold shrink-0">Horario sugerido:</span>
                    <span className="font-bold text-slate-600 text-right">{selectedPoint.hours}</span>
                  </div>
                )}
              </div>

              {/* Recommendation message block */}
              <div className="bg-indigo-50/50 border border-indigo-100 p-3.5 rounded-2xl">
                <span className="text-[10px] font-black uppercase text-indigo-700 flex items-center gap-1">
                  💡 Recomendación Oficial Segura:
                </span>
                <p className="text-[11px] font-bold text-slate-700 mt-1 leading-relaxed">
                  {selectedPoint.recommendations || 'Punto recomendado para tus encuentros. Cuenta con aprobación comunitaria.'}
                </p>
              </div>

              {/* REPORT & RATE ACCORDIONS */}
              <div id="report-accordion-container" className="border border-slate-150 rounded-2xl overflow-hidden divide-y divide-slate-150">
                
                {/* Rate point button/collapse trigger */}
                <button
                  onClick={() => setReviewModalOpen(!reviewModalOpen)}
                  className="w-full p-3 bg-slate-50 hover:bg-slate-100 font-bold text-xs text-indigo-650 flex justify-between items-center cursor-pointer"
                >
                  <span className="flex items-center gap-1">⭐ Calificar mi experiencia en este punto</span>
                  <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">Nueva reseña</span>
                </button>

                {reviewModalOpen && (
                  <div className="p-4 bg-slate-50 space-y-3 border-t border-slate-200 animate-fadeIn text-xs">
                    <p className="font-extrabold text-slate-700">¿Cómo fue tu experiencia en este punto seguro?</p>
                    
                    {/* Stars */}
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-semibold shrink-0">Puntaje:</span>
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            onClick={() => setReviewStars(s)}
                            className="text-lg focus:outline-none shrink-0"
                          >
                            <span className={s <= reviewStars ? 'text-amber-400' : 'text-gray-300'}>★</span>
                          </button>
                        ))}
                      </div>
                      <span className="font-extrabold text-slate-800 ml-1">{reviewStars} estrellas</span>
                    </div>

                    {/* Experiencia options */}
                    <div className="space-y-1">
                      <span className="text-slate-500 font-semibold block">Experiencia:</span>
                      <div className="flex gap-1 flex-wrap">
                        {['Muy buena', 'Buena', 'Regular', 'Mala'].map(opt => (
                          <button
                            key={opt}
                            onClick={() => setReviewExp(opt)}
                            className={`px-2 py-1 rounded-xl text-[10.5px] border cursor-pointer font-bold ${
                              reviewExp === opt 
                                ? 'bg-indigo-600 text-white border-indigo-600' 
                                : 'bg-white text-slate-600 border-slate-200'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleRateSubmit}
                      className="w-full bg-indigo-600 text-white font-extrabold text-[11px] py-2 rounded-xl uppercase tracking-wider block mt-2 text-center"
                    >
                      Enviar evaluación
                    </button>
                  </div>
                )}

                {/* Report problem selection menu */}
                <button
                  onClick={() => setReportModalOpen(!reportModalOpen)}
                  className="w-full p-3 bg-red-50/30 hover:bg-red-50/80 font-bold text-xs text-red-650 flex justify-between items-center cursor-pointer"
                >
                  <span className="flex items-center gap-1"><Flag size={12} className="text-red-500" /> Reportar un problema con este lugar</span>
                  <span className="text-[10px] text-red-650 bg-red-100 px-1.5 py-0.5 rounded-full font-black">!</span>
                </button>

                {reportModalOpen && (
                  <div className="p-4 bg-red-50/30 space-y-3.5 border-t border-slate-200 animate-fadeIn text-xs">
                    <p className="font-extrabold text-red-800">Seleccioná el motivo del reporte:</p>
                    
                    <select
                      id="report-reason-select"
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      className="w-full bg-white border border-red-200 rounded-xl py-2 px-3 font-semibold text-slate-700 cursor-pointer"
                    >
                      <option value="Lugar cerrado">Lugar cerrado</option>
                      <option value="Zona insegura">Zona insegura</option>
                      <option value="Mala experiencia">Mala experiencia</option>
                      <option value="No era un punto adecuado">No era un punto adecuado</option>
                      <option value="Información incorrecta">Información incorrecta</option>
                      <option value="Otro motivo">Otro motivo (Especificar abajo)...</option>
                    </select>

                    {reportReason === 'Otro motivo' && (
                      <textarea
                        value={customReportText}
                        onChange={(e) => setCustomReportText(e.target.value)}
                        placeholder="Descripción corta del inconveniente..."
                        className="w-full bg-white border border-red-200 p-2 text-xs rounded-xl h-16 focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-800"
                      />
                    )}

                    <div className="bg-red-50 border border-red-200/50 p-2 rounded-xl text-[10px] text-red-700">
                      ⚠️ Al enviar un reporte, se sumará a los registros mensuales de este punto de Palermo. Si se acumulan reportes la seguridad estimativa bajará de forma automática.
                    </div>

                    <button
                      onClick={handleReportSubmit}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold text-[11px] py-2 rounded-xl uppercase tracking-wider block text-center"
                    >
                      Enviar reporte
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* Actions row */}
            <div className="flex flex-col gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => handleSelectPointAction(selectedPoint)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-2.5 px-4 rounded-xl text-xs text-center shadow-md cursor-pointer transition-all"
              >
                Elegir este punto
              </button>
              <button
                onClick={() => {
                  setReportModalOpen(true);
                  setTimeout(() => {
                    const el = document.getElementById('report-accordion-container');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="w-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-extrabold py-2.5 px-4 rounded-xl text-xs text-center cursor-pointer transition-all"
              >
                Reportar problema con este lugar
              </button>
              <button
                onClick={() => setSelectedPoint(null)}
                className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 font-extrabold py-2 px-4 rounded-xl text-xs text-center cursor-pointer transition-all mt-1"
              >
                Cerrar detalles
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
