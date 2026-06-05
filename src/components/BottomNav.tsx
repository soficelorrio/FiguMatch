import { Home, BookOpen, Users, MessageSquare, User } from 'lucide-react';

interface NavItem {
  id: 'inicio' | 'album' | 'matches' | 'chat' | 'perfil';
  label: string;
  icon: any;
  badge?: number;
}

interface BottomNavProps {
  activeTab: 'inicio' | 'album' | 'matches' | 'chat' | 'perfil';
  setActiveTab: (tab: 'inicio' | 'album' | 'matches' | 'chat' | 'perfil') => void;
  unreadCount?: number;
  matchCount?: number;
}

export default function BottomNav({ activeTab, setActiveTab, unreadCount = 0, matchCount = 0 }: BottomNavProps) {
  const navItems: NavItem[] = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'album', label: 'Mi Álbum', icon: BookOpen },
    { id: 'matches', label: 'Matches', icon: Users, badge: matchCount },
    { id: 'chat', label: 'Chats', icon: MessageSquare, badge: unreadCount },
    { id: 'perfil', label: 'Mi Perfil', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 px-2 py-2 flex justify-around items-center z-40 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] rounded-t-2xl">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            id={`nav-tab-${item.id}`}
            onClick={() => setActiveTab(item.id)}
            className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-300 ${
              isActive
                ? 'text-indigo-600 font-semibold'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-indigo-50/80 text-indigo-600' : ''}`}>
              <Icon size={20} className="stroke-[2.25]" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            
            {item.badge && item.badge > 0 ? (
              <span className="absolute top-1 right-2 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center animate-pulse shadow-md border border-white">
                {item.badge}
              </span>
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}
