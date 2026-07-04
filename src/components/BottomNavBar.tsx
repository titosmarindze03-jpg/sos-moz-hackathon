interface BottomNavBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function BottomNavBar({ activeTab, onTabChange }: BottomNavBarProps) {
  const tabs = [
    { id: 'dashboard', label: 'Início', icon: 'dashboard' },
    { id: 'report-isolated', label: 'SOS', icon: 'emergency', filled: true },
    { id: 'family', label: 'Família', icon: 'group' },
    { id: 'map', label: 'Mapa', icon: 'map' },
  ];

  // If currently viewing the admin console, add it to the bottom nav bar dynamically so it's fully highlighted
  const displayTabs = activeTab === 'admin' 
    ? [...tabs, { id: 'admin', label: 'Admin', icon: 'admin_panel_settings', filled: true }]
    : tabs;

  return (
    <nav className="absolute bottom-0 left-0 right-0 w-full z-50 bg-white/95 backdrop-blur-md border-t border-gray-150 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] rounded-t-2xl">
      <div className="max-w-5xl mx-auto w-full flex justify-around items-center px-2 py-2 pb-3">
        {displayTabs.map((tab) => {
          const isActive = activeTab === tab.id || 
            (tab.id === 'report-isolated' && activeTab === 'request-help');
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center py-2 px-3.5 rounded-2xl transition-all duration-300 ease-out cursor-pointer group ${
                isActive
                  ? tab.id === 'admin'
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20 scale-105'
                    : 'bg-red-600 text-white shadow-lg shadow-red-600/20 scale-105'
                  : 'text-gray-500 hover:text-red-600 active:scale-95'
              }`}
            >
              {/* Pulsing indicator for active SOS */}
              {tab.id === 'report-isolated' && !isActive && (
                <span className="absolute top-1 right-3 flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-600"></span>
                </span>
              )}

              <span
                className={`material-symbols-outlined transition-transform duration-300 group-hover:scale-110 ${
                  isActive ? 'scale-110' : ''
                }`}
                style={{
                  fontVariationSettings: isActive || tab.filled ? "'FILL' 1, 'wght' 600" : "'FILL' 0, 'wght' 400"
                }}
              >
                {tab.icon}
              </span>
              
              <span className={`text-[10px] font-black tracking-tight mt-0.5 transition-all duration-200 ${
                isActive ? 'opacity-100' : 'text-gray-500'
              }`}>
                {tab.label}
              </span>

              {/* Little active pill indicator underneath */}
              {isActive && (
                <span className={`absolute -bottom-1 w-5 h-1 rounded-full ${
                  tab.id === 'admin' ? 'bg-white' : 'bg-white/80'
                }`} />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
