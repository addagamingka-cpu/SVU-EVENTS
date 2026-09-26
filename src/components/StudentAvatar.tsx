import React from 'react';

interface StudentAvatarProps {
  name: string;
  avatarUrl?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  isOrganizer?: boolean;
  showBadge?: boolean;
}

export function getInitials(name: string): string {
  if (!name) return 'SV';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Consistent collegiate background colors for monograms
const MONOGRAM_COLORS = [
  { bg: 'bg-[#003222]', text: 'text-[#6ffbbe]', ring: 'ring-[#003222]/20' }, // Forest Emerald
  { bg: 'bg-[#0d4a36]', text: 'text-[#fea619]', ring: 'ring-[#0d4a36]/20' }, // University Teal
  { bg: 'bg-[#855300]', text: 'text-[#ffddb8]', ring: 'ring-[#855300]/20' }, // Fest Amber
  { bg: 'bg-[#004b32]', text: 'text-[#b5efd3]', ring: 'ring-[#004b32]/20' }, // Heritage Green
  { bg: 'bg-[#1e293b]', text: 'text-[#93c5fd]', ring: 'ring-gray-700/20' }   // Slate Scholar
];

function getMonogramTheme(name: string) {
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % MONOGRAM_COLORS.length;
  return MONOGRAM_COLORS[index];
}

export const StudentAvatar: React.FC<StudentAvatarProps> = ({
  name,
  avatarUrl,
  size = 'md',
  className = '',
  isOrganizer = false,
  showBadge = false
}) => {
  const [imageError, setImageError] = React.useState(false);
  const initials = getInitials(name);
  const theme = getMonogramTheme(name);

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-[12px]',
    md: 'w-10 h-10 text-[14px]',
    lg: 'w-12 h-12 text-[16px]',
    xl: 'w-16 h-16 text-[20px]',
    '2xl': 'w-20 h-20 text-[26px]'
  };

  const badgeSizeClasses = {
    xs: 'w-2 h-2 bottom-0 right-0',
    sm: 'w-2.5 h-2.5 bottom-0 right-0',
    md: 'w-3 h-3 bottom-0 right-0',
    lg: 'w-3.5 h-3.5 bottom-0 right-0',
    xl: 'w-4 h-4 bottom-0.5 right-0.5',
    '2xl': 'w-5 h-5 bottom-1 right-1'
  };

  const hasValidImage = Boolean(avatarUrl && avatarUrl.trim() && !imageError);

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      {hasValidImage ? (
        <img
          src={avatarUrl!}
          alt={name}
          onError={() => setImageError(true)}
          className={`${sizeClasses[size]} rounded-2xl object-cover ring-2 ring-[#003222]/15 shadow-xs`}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} rounded-2xl ${theme.bg} ${theme.text} ring-2 ${theme.ring} shadow-xs flex items-center justify-center font-headline font-extrabold select-none tracking-wider`}
        >
          {initials}
        </div>
      )}

      {showBadge && isOrganizer && (
        <span
          title="Verified University Organizer"
          className={`absolute ${badgeSizeClasses[size]} bg-[#fea619] rounded-full border-2 border-white flex items-center justify-center shadow-xs`}
        >
          {size === 'xl' || size === '2xl' ? (
            <span className="material-symbols-outlined text-[10px] text-[#684000] fill-1">star</span>
          ) : null}
        </span>
      )}
    </div>
  );
};
