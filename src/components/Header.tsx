import React from 'react';
import { StudentUser } from '../types';
import { StudentAvatar } from './StudentAvatar';
import { DEFAULT_SVU_LOGO } from '../utils/imageFallback';

interface HeaderProps {
  currentUser: StudentUser | null;
  onOpenProfile: () => void;
  onOpenNotifications: () => void;
  onOpenBackendInfo: () => void;
  unreadCount?: number;
  backendOnline?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onOpenProfile,
  onOpenNotifications,
  onOpenBackendInfo,
  unreadCount = 2,
  backendOnline = true
}) => {
  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-[#ecfdf6]/90 backdrop-blur-xl pt-safe shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#003222]/10">
      <div className="h-16 px-4 max-w-2xl mx-auto flex items-center justify-between gap-2">
        {/* Left: SVU Crest & App Name */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <img
            alt="Swami Vivekananda University Logo"
            className="h-9 w-auto object-contain shrink-0"
            src="https://lh3.googleusercontent.com/aida/AEtjO1WiiBJPJHWOp9w12qrIJVV3UaTpWFl6cuxiFIzhwUevQXy42Db6LEpA-TCF1H6UE6kVlv0qCTP3FwyCySta5Eu7QfvmH3I4-bhsN_3g2vKU0H9GK9Uc97cmTP4bcw611TINsRhQq14WtroA7WJu20zSshRzc89UFqlW3VdmyoEUubyxUer7SEOVU4c3x3jUAC8kvfar691QPwcRjb_AQpkCaoRYrVj-QZyvL4VcSEynvV-dPFu_0m2XejcqL2Jz13B8JsylSyvzKw"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = DEFAULT_SVU_LOGO;
            }}
          />
          <div className="flex flex-col min-w-0">
            <span className="font-headline text-[10px] tracking-wider text-[#855300] uppercase font-bold truncate">
              Swami Vivekananda University
            </span>
            <div className="flex items-center gap-1.5">
              <span className="font-headline text-[16px] text-[#003222] font-bold leading-tight truncate">
                Campus Pulse
              </span>
              <button
                onClick={onOpenBackendInfo}
                title="View Java Backend Status"
                className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#0d4a36]/10 text-[#003222] text-[10px] font-semibold hover:bg-[#0d4a36]/20 transition-colors"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${backendOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                <span>Java API</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Quick Java backend pill on mobile */}
          <button
            onClick={onOpenBackendInfo}
            className="sm:hidden flex items-center gap-1 px-2 py-1 rounded-full bg-[#003222]/10 text-[#003222] text-[11px] font-semibold"
            title="Java Backend Status"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Java Bus</span>
          </button>

          {/* Notifications */}
          <button
            onClick={onOpenNotifications}
            aria-label="Notifications"
            className="w-10 h-10 flex items-center justify-center rounded-full text-[#003222] hover:bg-[#e0f2eb] transition-colors relative"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#fea619] border-2 border-[#ecfdf6] animate-pulse"></span>
            )}
          </button>

          {/* Profile Avatar */}
          <button
            onClick={onOpenProfile}
            aria-label="User Profile"
            className="flex items-center justify-center hover:opacity-90 transition-opacity p-0.5"
          >
            <StudentAvatar
              name={currentUser?.fullName || 'SVU Student'}
              avatarUrl={currentUser?.avatarUrl}
              size="sm"
              isOrganizer={currentUser?.isOrganizer}
              showBadge
            />
          </button>
        </div>
      </div>
    </header>
  );
};
