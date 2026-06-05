import { useState, useRef, useEffect } from 'react';
import { ChatMessage, NearbyCollector } from '../types';
import { Send, ArrowLeft, ShieldAlert, Sparkles, Smile, Radio } from 'lucide-react';

interface ChatScreenProps {
  collector: NearbyCollector;
  messages: ChatMessage[];
  currentUserId: string;
  onBack: () => void;
  onSendMessage: (text: string) => void;
  onSimulateResponse?: (collectorId: string, receivedText: string) => void;
}

const QUICK_MESSAGES = [
  'Hola, me interesa cambiar. 👋',
  '¿Seguís teniendo esta figurita? 🔍',
  'Te propongo este intercambio. 🤝',
  'Podemos encontrarnos en un punto seguro. 🏪',
  'Intercambio realizado. ✅'
];

export default function ChatScreen({
  collector,
  messages,
  currentUserId,
  onBack,
  onSendMessage,
  onSimulateResponse
}: ChatScreenProps) {
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    onSendMessage(text);
    setInputText('');

    // Trigger simulated response from the specific collector in 1.5 seconds if function is mapped
    if (onSimulateResponse) {
      setTimeout(() => {
        onSimulateResponse(collector.id, text);
      }, 1500);
    }
  };

  return (
    <div className="flex flex-col h-[75vh] px-1 relative">
      
      {/* Upper header */}
      <div className="flex items-center gap-3 bg-white py-2 border-b border-gray-50 flex-shrink-0">
        <button
          onClick={onBack}
          className="p-1.5 text-gray-500 hover:text-gray-700 bg-gray-50 rounded-lg transition"
        >
          <ArrowLeft size={16} />
        </button>
        
        {/* Avatar & Name */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-2xl p-1 bg-gray-100 rounded-full border border-gray-200">
            {collector.avatar}
          </span>
          <div className="min-w-0">
            <p className="text-xs font-black text-gray-900 leading-tight truncate">{collector.name}</p>
            <span className="text-[9px] text-green-500 font-bold flex items-center gap-1">
              <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-ping"></span>
              En línea - {collector.neighborhood}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[9px] bg-slate-50 text-indigo-600 font-bold px-2 py-1 rounded-md">
          <Radio size={10} className="text-indigo-600" /> Matches
        </div>
      </div>

      {/* Safety Banner */}
      <div className="bg-amber-50 text-amber-800 text-[10px] p-2.5 rounded-lg border border-amber-100/50 flex gap-2 items-start flex-shrink-0 my-2">
        <ShieldAlert size={14} className="text-amber-600 stroke-[2.5] flex-shrink-0" />
        <p className="leading-normal font-medium">
          <strong>Protección:</strong> No compartas dirección exacta, emails ni WhatsApp. Coordiná e interactuá con seguridad dentro del chat.
        </p>
      </div>

      {/* Message log list */}
      <div className="flex-1 overflow-y-auto space-y-2.5 py-2 pr-1 scrollbar-thin">
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUserId;
          return (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[85%] ${
                isMe ? 'ml-auto items-end' : 'mr-auto items-start'
              }`}
            >
              <div
                className={`p-3 rounded-2xl text-xs font-medium leading-relaxed shadow-3xs ${
                  isMe
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-800 rounded-bl-none border border-gray-200/50'
                }`}
              >
                {msg.text}
              </div>
              
              <span className="text-[8px] text-gray-400 mt-0.5 tracking-tight">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Quick messages drawer */}
      <div className="flex-shrink-0 py-1.5">
        <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
          Mensajes Rápidos sugeridos:
        </label>
        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
          {QUICK_MESSAGES.map((textOption) => (
            <button
              key={textOption}
              onClick={() => handleSend(textOption)}
              className="py-1.5 px-3 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition whitespace-nowrap cursor-pointer"
            >
              {textOption}
            </button>
          ))}
        </div>
      </div>

      {/* Input row */}
      <div className="border-t border-gray-100 py-2.5 flex items-center gap-2 bg-white flex-shrink-0">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend(inputText);
          }}
          placeholder="Escribí un mensaje seguro acá..."
          className="flex-1 bg-gray-50 border border-gray-100 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white text-gray-700 font-medium"
        />
        <button
          onClick={() => handleSend(inputText)}
          disabled={!inputText.trim()}
          className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 transition flex items-center justify-center disabled:opacity-40 flex-shrink-0 cursor-pointer"
        >
          <Send size={15} />
        </button>
      </div>

    </div>
  );
}
