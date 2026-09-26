import React from 'react';

export type NavigationTab = 'events' | 'post-event' | 'my-passes' | 'profile';

interface NavigationProps {
  currentTab: NavigationTab;
  onChangeTab: (tab: NavigationTab) => void;
  passesCount: number;
  isOwner?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onChangeTab,
  passesCount,
  isOwner = false
}) => {
  const tabs = [
    { id: 'events' as NavigationTab, label: 'Events', icon: 'event' },
    { 
      id: 'post-event' as NavigationTab, 
      label: isOwner ? 'Post Event' : 'Admin Post', 
      icon: isOwner ? 'add_circle' : 'lock', 
      adminTag: !isOwner 
    },
    { id: 'my-passes' as NavigationTab, label: 'My Passes', icon: 'confirmation_number', badge: passesCount },
    { id: 'profile' as NavigationTab, label: 'Profile', icon: 'badge' }
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 pb-safe bg-[#ecfdf6]/95 backdrop-blur-xl border-t border-[#003222]/10 shadow-[0_-4px_20px_rgba(0,50,34,0.08)]">
      <div className="flex items-center justify-around h-16 max-w-2xl mx-auto px-2">
        {tabs.map(tab => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 h-14 relative transition-all duration-200 ${
                isActive
                  ? 'text-[#003222] font-semibold scale-105'
                  : 'text-[#404944] hover:text-[#003222]'
              }`}
            >
              <div className="relative">
                <span
                  className={`material-symbols-outlined text-[24px] ${
                    isActive ? 'fill-1' : ''
                  }`}
                >
                  {tab.icon}
                </span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-2 px-1.5 py-0.2 bg-[#fea619] text-[#684000] text-[10px] font-bold rounded-full min-w-4 text-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="font-headline text-[11px] mt-0.5 tracking-tight">
                {tab.label}
              </span>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#fea619] absolute bottom-1"></div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
