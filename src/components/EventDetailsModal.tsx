import React, { useState } from 'react';
import { CampusEvent, StudentPass, StudentUser } from '../types';
import { StudentAvatar } from './StudentAvatar';
import { DEFAULT_SVU_LOGO, DEFAULT_CAMPUS_BANNER } from '../utils/imageFallback';

interface EventDetailsModalProps {
  event: CampusEvent;
  currentUser: StudentUser;
  existingPass: StudentPass | null;
  onClose: () => void;
  onClaimPass: (event: CampusEvent) => Promise<StudentPass>;
}

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  event,
  currentUser,
  existingPass,
  onClose,
  onClaimPass
}) => {
  const [activeTab, setActiveTab] = useState<'about' | 'lineup' | 'pass'>('about');
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimedPass, setClaimedPass] = useState<StudentPass | null>(existingPass);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleClaim = async () => {
    setIsClaiming(true);
    try {
      const pass = await onClaimPass(event);
      setClaimedPass(pass);
      setActiveTab('pass');
    } catch (e) {
      alert('Failed to generate pass. Please try again.');
    } finally {
      setIsClaiming(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${event.title} - SVU Campus Pulse`,
        text: `Join ${event.title} at Swami Vivekananda University!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Event link copied to clipboard!');
    }
  };

  const activePass = claimedPass || existingPass;

  return (
    <div className="fixed inset-0 z-50 bg-[#ecfdf6] flex flex-col overflow-y-auto no-scrollbar">
      {/* Top Header */}
      <header className="sticky top-0 inset-x-0 z-50 bg-[#ecfdf6]/90 backdrop-blur-xl pt-safe shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#003222]/10">
        <div className="h-16 px-4 max-w-2xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={onClose}
              aria-label="Go back"
              className="w-10 h-10 flex items-center justify-center rounded-full text-[#0f1e1a] hover:bg-[#e0f2eb] transition-colors -ml-1.5 shrink-0"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <img
              alt="SVU Crest"
              className="h-7 w-auto object-contain shrink-0"
              src="https://lh3.googleusercontent.com/aida/AEtjO1WiiBJPJHWOp9w12qrIJVV3UaTpWFl6cuxiFIzhwUevQXy42Db6LEpA-TCF1H6UE6kVlv0qCTP3FwyCySta5Eu7QfvmH3I4-bhsN_3g2vKU0H9GK9Uc97cmTP4bcw611TINsRhQq14WtroA7WJu20zSshRzc89UFqlW3VdmyoEUubyxUer7SEOVU4c3x3jUAC8kvfar691QPwcRjb_AQpkCaoRYrVj-QZyvL4VcSEynvV-dPFu_0m2XejcqL2Jz13B8JsylSyvzKw"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = DEFAULT_SVU_LOGO;
              }}
            />
            <div className="flex flex-col min-w-0">
              <span className="font-headline text-[10px] text-[#855300] truncate uppercase font-bold tracking-wider">
                SVU Campus Events
              </span>
              <h1 className="font-headline text-[15px] font-bold text-[#003222] truncate leading-tight">
                Event Details
              </h1>
            </div>
          </div>

          <div className="flex items-center shrink-0">
            <StudentAvatar
              name={currentUser.fullName}
              avatarUrl={currentUser.avatarUrl}
              size="sm"
              isOrganizer={currentUser.isOrganizer}
            />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-2xl mx-auto pb-28">
        {/* Interactive Action Header Strip */}
        <div className="px-4 py-2.5 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#dbece5] text-[#404944] font-headline text-[11px] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#fea619] animate-pulse"></span>
            Fest Season '26
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleShare}
              aria-label="Share Event"
              className="w-9 h-9 rounded-full bg-[#e6f8f1] flex items-center justify-center text-[#003222] active:scale-95 transition-transform hover:bg-[#e0f2eb]"
            >
              <span className="material-symbols-outlined text-[19px]">share</span>
            </button>
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              aria-label="Bookmark"
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform active:scale-95 ${
                isBookmarked ? 'bg-[#003222] text-white' : 'bg-[#e6f8f1] text-[#003222] hover:bg-[#e0f2eb]'
              }`}
            >
              <span className="material-symbols-outlined text-[19px]">
                {isBookmarked ? 'bookmark' : 'bookmark_border'}
              </span>
            </button>
          </div>
        </div>

        {/* Hero Visual Card with Fest Lights */}
        <div className="px-4 w-full">
          <div className="relative w-full h-56 rounded-2xl overflow-hidden shadow-md">
            <img
              alt={event.title}
              className="w-full h-full object-cover"
              src={event.bannerImage || DEFAULT_CAMPUS_BANNER}
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = DEFAULT_CAMPUS_BANNER;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#003222]/95 via-[#003222]/40 to-transparent"></div>

            {/* Top Overlay Badges */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fea619] text-[#684000] font-headline text-[10px] font-bold shadow-sm backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-[#684000] animate-ping"></span>
                {event.isHappeningNow ? 'Live Campus Event' : 'Official Fest'}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#0d4a36]/80 text-[#80b99f] font-headline text-[10px] font-bold backdrop-blur-md flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">local_activity</span>
                {event.isFreeForStudents ? 'Free Student Pass' : 'Student Special'}
              </span>
            </div>

            {/* Hero Bottom Label */}
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <span className="font-headline text-[10px] text-[#ffddb8] uppercase tracking-wider font-semibold">
                Swami Vivekananda University
              </span>
              <p className="font-headline text-[16px] font-bold text-white leading-tight">
                {event.venueName}
              </p>
            </div>
          </div>
        </div>

        {/* Main Event Header & Metadata */}
        <div className="px-4 pt-3 flex flex-col gap-2">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-emerald-600 fill-1">verified</span>
            <span className="font-headline text-[11px] text-[#855300] font-bold uppercase tracking-wider">
              Official University Approved Event
            </span>
          </div>

          <h2 className="font-headline text-[22px] sm:text-[24px] font-extrabold text-[#003222] tracking-tight leading-snug">
            {event.title}
          </h2>

          <p className="text-[12px] text-[#404944] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#707974]">account_balance</span>
            <span>Organized by {event.organizerName} • {event.department}</span>
          </p>

          {/* Logistics Grid */}
          <div className="mt-1 grid grid-cols-1 gap-2 bg-white p-3.5 rounded-2xl shadow-sm border border-[#003222]/8">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#e0f2eb] flex items-center justify-center text-[#003222] shrink-0">
                <span className="material-symbols-outlined text-[20px]">calendar_month</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-headline text-[13px] text-[#0f1e1a] font-bold">
                  {event.displayDate || event.date}
                </span>
                <span className="text-[11px] text-[#404944]">
                  {event.timeLabel}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 border-t border-[#003222]/5 pt-2">
              <div className="w-9 h-9 rounded-xl bg-[#e0f2eb] flex items-center justify-center text-[#003222] shrink-0">
                <span className="material-symbols-outlined text-[20px]">pin_drop</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-headline text-[13px] text-[#0f1e1a] font-bold truncate">
                  {event.venueName}
                </span>
                <span className="text-[11px] text-[#404944] truncate">
                  {event.venueDetails}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Segmented Navigation */}
        <div className="px-4 mt-4">
          <div className="flex bg-[#dbece5] p-1 rounded-xl gap-1">
            <button
              onClick={() => setActiveTab('about')}
              className={`flex-1 py-2 rounded-lg font-headline text-[12px] font-bold text-center transition-all ${
                activeTab === 'about'
                  ? 'bg-white text-[#003222] shadow-sm'
                  : 'text-[#404944] hover:text-[#003222]'
              }`}
            >
              About Event
            </button>
            <button
              onClick={() => setActiveTab('lineup')}
              className={`flex-1 py-2 rounded-lg font-headline text-[12px] font-bold text-center transition-all ${
                activeTab === 'lineup'
                  ? 'bg-white text-[#003222] shadow-sm'
                  : 'text-[#404944] hover:text-[#003222]'
              }`}
            >
              Lineup
            </button>
            <button
              onClick={() => setActiveTab('pass')}
              className={`flex-1 py-2 rounded-lg font-headline text-[12px] font-bold text-center transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'pass'
                  ? 'bg-white text-[#003222] shadow-sm'
                  : 'text-[#404944] hover:text-[#003222]'
              }`}
            >
              <span>My Pass</span>
              {activePass && <span className="w-2 h-2 rounded-full bg-[#fea619]"></span>}
            </button>
          </div>
        </div>

        {/* TAB PANES */}

        {/* 1. About Tab */}
        {activeTab === 'about' && (
          <div className="px-4 mt-3 flex flex-col gap-3">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#003222]/8 flex flex-col gap-2.5">
              <h3 className="font-headline text-[15px] font-bold text-[#003222] flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#855300]">celebration</span>
                <span>Grand Campus Spectacle</span>
              </h3>
              <p className="text-[13px] text-[#404944] leading-relaxed">
                {event.fullDescription}
              </p>

              {/* Key Attraction Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {event.perks?.map((perk, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-[#e0f2eb] text-[#003222] font-headline text-[11px] font-semibold flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[13px] text-[#0d4a36]">stars</span>
                    {perk}
                  </span>
                ))}
              </div>
            </div>

            {/* Venue & Atmosphere */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#003222]/8 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-headline text-[14px] font-bold text-[#003222]">
                  Venue & Atmosphere
                </span>
                <span className="text-[11px] text-[#855300] font-headline font-bold">
                  Campus Central
                </span>
              </div>
              <div className="w-full h-36 rounded-xl overflow-hidden relative shadow-inner">
                <img
                  className="w-full h-full object-cover"
                  alt="SVU Campus Amphitheatre"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRGb1BZyv3_1wLirO3YcvIeXfeGXLwz0KO-xS6NjT6PxOedqFSNyOnwZuoAg83pfGNqMDGr_8-mcxxZCRkYWO9r5Q8keWhOcrVv1D_5hWq2JrQ8m9wegE4RmBHOlbAq80o4flMjdPB7jgbgcv0aQb-G6XHUp6p5Uef2g7loGo6swRzC6wfb0ewzA0ePA4oQ8s3pNNQ2r5EDyZCrzCQN4ihIKYWDwmRT5jjr4Hr-IxWxYcyCuJBDJs2dupFLyBmowhyRSEdoTiJtG53Tw"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = DEFAULT_CAMPUS_BANNER;
                  }}
                />
                <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-[#003222]/80 backdrop-blur-sm text-white font-headline text-[11px] font-semibold">
                  {event.venueName}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Lineup / Schedule Tab */}
        {activeTab === 'lineup' && (
          <div className="px-4 mt-3 flex flex-col gap-3">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#003222]/8">
              <span className="font-headline text-[10px] text-[#855300] uppercase font-bold tracking-wider">
                Official Fest Schedule
              </span>
              <h3 className="font-headline text-[16px] font-bold text-[#003222] mt-0.5 mb-4">
                Stage Timelines
              </h3>

              <div className="relative pl-6 flex flex-col gap-5">
                {/* Connecting Line */}
                <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-[#d5e6e0]"></div>

                {event.lineup?.map((item, idx) => (
                  <div key={item.id || idx} className="relative flex flex-col gap-0.5">
                    <div
                      className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full shadow-sm ring-4 ring-white ${
                        idx === 0
                          ? 'bg-[#fea619]'
                          : idx === 1
                          ? 'bg-[#003222]'
                          : 'bg-[#fea619] animate-pulse'
                      }`}
                    />
                    <div className="flex items-center justify-between">
                      <span className="font-headline text-[11px] text-[#855300] font-bold">
                        {item.time}
                      </span>
                      <span className="font-headline text-[10px] px-2 py-0.5 rounded-md bg-[#e0f2eb] text-[#003222] font-semibold">
                        {item.stage}
                      </span>
                    </div>
                    <span className="font-headline text-[14px] font-bold text-[#0f1e1a]">
                      {item.title}
                    </span>
                    <span className="text-[12px] text-[#404944] leading-relaxed">
                      {item.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. My Pass Tab */}
        {activeTab === 'pass' && (
          <div className="px-4 mt-3 flex flex-col gap-3">
            {activePass ? (
              <div className="relative bg-white rounded-2xl shadow-lg border border-[#003222]/10 overflow-hidden">
                {/* Pass Header Notch */}
                <div className="bg-[#003222] p-4 text-white flex items-center justify-between">
                  <div>
                    <span className="font-headline text-[10px] text-[#ffddb8] uppercase tracking-wider font-bold">
                      SVU Student FastPass
                    </span>
                    <h4 className="font-headline text-[16px] font-bold text-white">
                      {event.title}
                    </h4>
                  </div>
                  <span className="material-symbols-outlined text-[28px] text-[#fea619]">
                    confirmation_number
                  </span>
                </div>

                {/* Pass Details */}
                <div className="p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[11px] text-[#707974]">Pass Holder</span>
                      <span className="font-headline text-[15px] font-bold text-[#003222]">
                        {activePass.studentName}
                      </span>
                      <span className="text-[12px] text-[#404944] font-mono font-medium">
                        ID: {activePass.studentRollNumber}
                      </span>
                      <span className="text-[11px] text-[#707974]">
                        {activePass.studentPhone}
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-[#e0f2eb] flex items-center justify-center text-[#003222] font-headline font-bold text-base border border-[#003222]/10">
                      {activePass.studentName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                  </div>

                  {/* Status Pills */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-full bg-[#e0f2eb] text-[#003222] font-headline text-[10px] font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Confirmed Admission
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-[#ffddb8] text-[#653e00] font-headline text-[10px] font-bold">
                      {activePass.gateName}
                    </span>
                  </div>

                  {/* Perforated Ticket Divider */}
                  <div className="relative py-2 flex items-center justify-center">
                    <div className="w-full border-t-2 border-dashed border-[#c0c9c2]"></div>
                    <div className="absolute -left-6 w-4 h-4 rounded-full bg-[#ecfdf6]"></div>
                    <div className="absolute -right-6 w-4 h-4 rounded-full bg-[#ecfdf6]"></div>
                  </div>

                  {/* Gate Scanner QR Code Matrix */}
                  <div className="flex flex-col items-center justify-center py-2 gap-2">
                    <div className="p-3 bg-[#ecfdf6] rounded-2xl shadow-inner border border-[#003222]/10 flex items-center justify-center">
                      <svg className="w-36 h-36 text-[#003222]" fill="currentColor" viewBox="0 0 100 100">
                        <path d="M0,0 h30 v30 h-30 z M6,6 v18 h18 v-18 z M10,10 h10 v10 h-10 z" />
                        <path d="M70,0 h30 v30 h-30 z M76,6 v18 h18 v-18 z M80,10 h10 v10 h-10 z" />
                        <path d="M0,70 h30 v30 h-30 z M6,76 v18 h18 v-18 z M10,80 h10 v10 h-10 z" />
                        <rect height="8" width="8" x="40" y="5" />
                        <rect height="8" width="8" x="52" y="5" />
                        <rect height="8" width="16" x="40" y="18" />
                        <rect height="10" width="10" x="15" y="40" />
                        <rect height="30" width="30" x="35" y="35" />
                        <rect fill="#ecfdf6" height="10" width="10" x="45" y="45" />
                        <rect height="6" width="12" x="75" y="40" />
                        <rect height="10" width="15" x="80" y="52" />
                        <rect height="18" width="12" x="40" y="75" />
                        <rect height="8" width="15" x="58" y="72" />
                        <rect height="14" width="14" x="78" y="78" />
                      </svg>
                    </div>
                    <span className="font-mono text-[10px] text-[#707974] tracking-wider uppercase font-semibold">
                      TOKEN: {activePass.passNumber}
                    </span>
                    <span className="font-headline text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                      SCAN AT GATE FOR ACCESS
                    </span>
                  </div>
                </div>

                {/* Pass Actions */}
                <div className="p-4 bg-[#e6f8f1] flex flex-col gap-2 border-t border-[#003222]/10">
                  <button
                    onClick={() => alert(`Digital Pass ${activePass.passNumber} saved to your device wallet!`)}
                    className="w-full h-11 rounded-xl bg-[#003222] text-white font-headline text-[13px] font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-md"
                  >
                    <span className="material-symbols-outlined text-[18px]">download</span>
                    <span>Download Pass / Add to Wallet</span>
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert('FastPass link copied! Send it to your SVU friends.');
                    }}
                    className="w-full h-10 rounded-xl bg-[#e0f2eb] text-[#003222] font-headline text-[12px] font-bold flex items-center justify-center gap-1.5 hover:bg-[#d5e6e0]"
                  >
                    <span className="material-symbols-outlined text-[17px]">group_add</span>
                    <span>Share with Batchmates</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#003222]/8 text-center flex flex-col items-center justify-center gap-3">
                <span className="material-symbols-outlined text-[44px] text-[#fea619]">
                  confirmation_number
                </span>
                <h4 className="font-headline text-[16px] font-bold text-[#003222]">
                  No Pass Claimed Yet
                </h4>
                <p className="text-[12px] text-[#404944] max-w-xs">
                  Claim your free entry pass with your verified Student Roll ID ({currentUser.rollNumber}).
                </p>
                <button
                  onClick={handleClaim}
                  disabled={isClaiming}
                  className="px-6 py-3 bg-[#003222] text-white font-headline text-[13px] font-bold rounded-xl shadow active:scale-95 transition-all"
                >
                  {isClaiming ? 'Generating Pass...' : 'Claim Free Student Pass'}
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Persistent Floating Bottom Action Bar */}
      <div className="fixed bottom-0 inset-x-0 p-3.5 bg-[#003222]/95 backdrop-blur-xl z-50 shadow-2xl border-t border-white/10">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          <div className="flex flex-col min-w-0">
            <span className="font-headline text-[10px] text-[#ffddb8] uppercase font-bold tracking-wider">
              {activePass ? 'Registration Confirmed' : 'Registration Active'}
            </span>
            <span className="font-headline text-[14px] font-bold text-white truncate">
              {activePass ? 'Pass Stored in Device' : '1-Tap Student Admission'}
            </span>
          </div>

          {activePass ? (
            <button
              onClick={() => setActiveTab('pass')}
              className="px-5 h-11 rounded-xl bg-[#fea619] text-[#684000] font-headline text-[13px] font-bold flex items-center gap-1.5 shrink-0 shadow-md active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[18px] fill-1">qr_code_scanner</span>
              <span>View Pass</span>
            </button>
          ) : (
            <button
              onClick={handleClaim}
              disabled={isClaiming}
              className="px-5 h-11 rounded-xl bg-[#fea619] text-[#684000] font-headline text-[13px] font-bold flex items-center gap-1.5 shrink-0 shadow-md active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
              <span>{isClaiming ? 'Registering...' : 'Claim Seat'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
