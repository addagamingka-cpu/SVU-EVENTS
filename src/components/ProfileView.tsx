import React, { useState, useRef } from 'react';
import { StudentUser } from '../types';
import { INITIAL_STUDENTS } from '../initialData';
import { StudentAvatar } from './StudentAvatar';

interface ProfileViewProps {
  currentUser: StudentUser;
  onSwitchUser: (user: StudentUser) => void;
  onOpenLogin: () => void;
  onUpdateAvatar: (newAvatarUrl: string) => Promise<void>;
}

// Curated collegiate presets
const CAMPUS_AVATAR_PRESETS = [
  {
    id: 'scholar',
    label: 'Scholar Graduate',
    icon: '🎓',
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'coder',
    label: 'Tech Hacker',
    icon: '💻',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'robotics',
    label: 'AI & Robotics',
    icon: '🤖',
    url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'culture',
    label: 'Fest Performer',
    icon: '🎭',
    url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'sports',
    label: 'Sports Captain',
    icon: '⚽',
    url: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'science',
    label: 'Lab Innovator',
    icon: '🔬',
    url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=300&q=80'
  }
];

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  onSwitchUser,
  onOpenLogin,
  onUpdateAvatar
}) => {
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUser.avatarUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert('Please choose an image under 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setPreviewUrl(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAvatar = async () => {
    setIsUploading(true);
    try {
      await onUpdateAvatar(previewUrl || '');
      setShowAvatarModal(false);
    } catch (e) {
      alert('Failed to update profile picture. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setIsUploading(true);
    try {
      setPreviewUrl('');
      await onUpdateAvatar('');
      setShowAvatarModal(false);
    } catch (e) {
      alert('Failed to remove profile picture');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col w-full pb-28 pt-2">
      <div className="px-4 max-w-2xl mx-auto w-full flex flex-col gap-4">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#003222]/10 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            {/* Interactive Avatar with Edit Button */}
            <div className="relative group">
              <StudentAvatar
                name={currentUser.fullName}
                avatarUrl={currentUser.avatarUrl}
                size="xl"
                isOrganizer={currentUser.isOrganizer}
                showBadge
              />
              <button
                type="button"
                onClick={() => {
                  setPreviewUrl(currentUser.avatarUrl || '');
                  setShowAvatarModal(true);
                }}
                title="Change Profile Picture"
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#003222] hover:bg-[#0d4a36] text-white rounded-full border-2 border-white flex items-center justify-center shadow-md active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-[15px]">photo_camera</span>
              </button>
            </div>

            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                {currentUser.isOwner || currentUser.role === 'owner' ? (
                  <span className="font-headline text-[10px] uppercase px-2.5 py-0.5 rounded-full bg-[#fea619] text-[#684000] font-extrabold tracking-wider flex items-center gap-1">
                    <span>👑 Website Owner</span>
                  </span>
                ) : (
                  <span className="font-headline text-[10px] uppercase px-2 py-0.5 rounded-full bg-[#e0f2eb] text-[#003222] font-bold">
                    🎓 Student Member
                  </span>
                )}
                {currentUser.organizerBadge && (
                  <span className="font-headline text-[10px] text-[#003222] font-bold bg-[#e0f2eb] px-2 py-0.5 rounded-full">
                    {currentUser.organizerBadge}
                  </span>
                )}
              </div>

              <h2 className="font-headline text-[18px] font-extrabold text-[#0f1e1a] truncate mt-0.5">
                {currentUser.fullName}
              </h2>
              <span className="font-mono text-[12px] text-[#707974] truncate">
                Roll: {currentUser.rollNumber} {currentUser.isOwner ? '• Master Admin' : ''}
              </span>

              {/* Quick action button to edit profile pic */}
              <button
                type="button"
                onClick={() => {
                  setPreviewUrl(currentUser.avatarUrl || '');
                  setShowAvatarModal(true);
                }}
                className="text-[11px] text-[#003222] font-headline font-bold flex items-center gap-1 mt-1 hover:underline text-left"
              >
                <span className="material-symbols-outlined text-[14px]">edit</span>
                <span>Change Profile Picture</span>
              </button>
            </div>
          </div>

          {/* Academic & University Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-[#003222]/5">
            <div className="bg-[#e6f8f1] p-3 rounded-xl flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#003222] text-[20px]">school</span>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-[#707974] uppercase font-headline font-semibold">
                  Department
                </span>
                <span className="font-headline text-[12px] font-bold text-[#003222] truncate">
                  {currentUser.department}
                </span>
              </div>
            </div>

            <div className="bg-[#e6f8f1] p-3 rounded-xl flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#003222] text-[20px]">phone</span>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-[#707974] uppercase font-headline font-semibold">
                  Registered Mobile
                </span>
                <span className="font-mono text-[12px] font-bold text-[#003222]">
                  +91 {currentUser.phoneNumber}
                </span>
              </div>
            </div>

            <div className="bg-[#e6f8f1] p-3 rounded-xl flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#003222] text-[20px]">history_edu</span>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-[#707974] uppercase font-headline font-semibold">
                  Academic Year
                </span>
                <span className="font-headline text-[12px] font-bold text-[#003222]">
                  {currentUser.year}
                </span>
              </div>
            </div>

            <div className="bg-[#e6f8f1] p-3 rounded-xl flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#003222] text-[20px]">apartment</span>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-[#707974] uppercase font-headline font-semibold">
                  Campus
                </span>
                <span className="font-headline text-[12px] font-bold text-[#003222] truncate">
                  Barrackpore, Kolkata
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-[#707974] flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-emerald-600 fill-1">verified</span>
              Linked to University Roll Registry
            </span>
            <button
              onClick={onOpenLogin}
              className="text-[#855300] font-headline text-[12px] font-bold hover:underline flex items-center gap-1"
            >
              <span>Change Roll / Re-login</span>
              <span className="material-symbols-outlined text-[15px]">sync_alt</span>
            </button>
          </div>
        </div>

        {/* Website Owner Status & Privileges Card */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#003222]/10 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-headline text-[13px] font-bold text-[#003222] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#fea619] text-[18px]">verified</span>
              <span>Website Owner & Administrator Status</span>
            </span>
            <span className="text-[10px] bg-[#fea619]/20 text-[#684000] font-headline font-bold px-2 py-0.5 rounded-full">
              Exclusive Access
            </span>
          </div>

          <div className="bg-[#e6f8f1] rounded-2xl p-3.5 border border-[#003222]/10 flex flex-col gap-2">
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-[#404944]">Designated Owner:</span>
              <span className="font-headline font-bold text-[#003222]">AYUSH JANA</span>
            </div>
            <div className="flex justify-between text-[12px]">
              <span className="text-[#404944]">Master Roll ID:</span>
              <span className="font-mono font-bold text-[#003222]">006-121-2023-305</span>
            </div>
            <div className="flex justify-between text-[12px]">
              <span className="text-[#404944]">Broadcast Permission:</span>
              <span className="font-headline font-bold text-emerald-700 flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] fill-1">lock_open</span>
                <span>Owner Only Allowed</span>
              </span>
            </div>
            <div className="flex justify-between text-[12px]">
              <span className="text-[#404944]">Other Student Accounts:</span>
              <span className="font-bold text-[#707974]">Read-Only / FastPass Access</span>
            </div>
          </div>

          {currentUser.id !== 'user-1' && (
            <button
              type="button"
              onClick={() => onSwitchUser(INITIAL_STUDENTS[0])}
              className="w-full py-2.5 px-3 rounded-xl bg-[#003222] hover:bg-[#0d4a36] text-white font-headline text-[12px] font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">switch_account</span>
              <span>Switch to Website Owner Profile (AYUSH JANA)</span>
            </button>
          )}
        </div>

        {/* University Info & Helplines */}
        <div className="bg-[#e6f8f1] rounded-2xl p-4 border border-[#003222]/10 flex flex-col gap-2">
          <span className="font-headline text-[12px] font-bold text-[#003222] uppercase tracking-wider">
            Swami Vivekananda University (SVU)
          </span>
          <p className="text-[12px] text-[#404944] leading-relaxed">
            Vivekananda Knowledge City, Barrackpore-Barasat Road, Kolkata, West Bengal 700121.
          </p>
          <div className="text-[11px] text-[#707974] pt-1 border-t border-[#003222]/10 flex justify-between items-center">
            <span>Student Welfare Portal v2.6.4</span>
            <span className="font-mono">Java Spring Core Active</span>
          </div>
        </div>
      </div>

      {/* CHANGE PROFILE PICTURE MODAL */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-[#003222] p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#fea619] text-[22px]">photo_camera</span>
                <div>
                  <h3 className="font-headline text-[15px] font-bold text-white">
                    Update Student Profile Picture
                  </h3>
                  <span className="text-[11px] text-[#ffddb8]">
                    {currentUser.fullName} ({currentUser.rollNumber})
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAvatarModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 flex flex-col gap-4">
              {/* Live Preview */}
              <div className="flex flex-col items-center justify-center gap-2 py-2">
                <StudentAvatar
                  name={currentUser.fullName}
                  avatarUrl={previewUrl}
                  size="2xl"
                  isOrganizer={currentUser.isOrganizer}
                  showBadge
                />
                <span className="text-[11px] text-[#707974]">
                  {previewUrl ? 'Custom photo selected' : 'Default SVU Monogram'}
                </span>
              </div>

              {/* Upload from file button */}
              <div className="flex flex-col gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 px-4 rounded-xl bg-[#e0f2eb] hover:bg-[#d5e6e0] text-[#003222] font-headline text-[13px] font-bold flex items-center justify-center gap-2 transition-colors border border-[#003222]/15 active:scale-95"
                >
                  <span className="material-symbols-outlined text-[20px]">upload_file</span>
                  <span>Upload Image from Device / Camera</span>
                </button>
              </div>

              {/* Campus Presets Rail */}
              <div className="flex flex-col gap-2">
                <span className="font-headline text-[12px] font-bold text-[#003222]">
                  Or choose a collegiate campus avatar:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {CAMPUS_AVATAR_PRESETS.map(preset => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setPreviewUrl(preset.url)}
                      className={`p-2 rounded-xl flex flex-col items-center gap-1 border transition-all text-center ${
                        previewUrl === preset.url
                          ? 'border-[#003222] bg-[#e6f8f1] ring-2 ring-[#003222]/20'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <span className="text-[10px] font-headline font-semibold text-[#0f1e1a] truncate w-full">
                        {preset.icon} {preset.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-2 border-t">
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={handleSaveAvatar}
                  className="w-full py-3 rounded-xl bg-[#003222] text-white font-headline text-[13px] font-bold flex items-center justify-center gap-1.5 shadow active:scale-95 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[18px]">check</span>
                  <span>{isUploading ? 'Updating Avatar...' : 'Save Profile Picture'}</span>
                </button>

                {previewUrl && (
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={handleRemoveAvatar}
                    className="w-full py-2.5 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 font-headline text-[12px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                    <span>Remove Photo & Use Initials</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
