import React, { useState } from 'react';
import { CampusEvent, EventCategory, StudentUser } from '../types';
import { CAMPUS_VENUES } from '../initialData';
import { DEFAULT_CAMPUS_BANNER, HACKATHON_BANNER } from '../utils/imageFallback';

interface PostEventViewProps {
  currentUser: StudentUser;
  onEventCreated: (event: Partial<CampusEvent>) => Promise<void>;
  onCancel?: () => void;
  onSwitchToOwner?: () => void;
  onGrantOwnerRole?: () => void;
}

export const PostEventView: React.FC<PostEventViewProps> = ({
  currentUser,
  onEventCreated,
  onCancel,
  onSwitchToOwner,
  onGrantOwnerRole
}) => {
  const isOwner = Boolean(
    currentUser?.isOwner ||
    currentUser?.role === 'owner' ||
    currentUser?.rollNumber === '006-121-2023-305' ||
    currentUser?.phoneNumber === '9876543210' ||
    currentUser?.fullName?.toUpperCase().includes('AYUSH JANA')
  );

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('fest');
  const [mode, setMode] = useState<'scheduled' | 'now'>('scheduled');
  const [eventDate, setEventDate] = useState('2026-10-28');
  const [startTime, setStartTime] = useState('10:30');
  const [endTime, setEndTime] = useState('17:00');
  const [venueId, setVenueId] = useState('central_lawn');
  const [requireIdCheckin, setRequireIdCheckin] = useState(true);
  const [freeForStudents, setFreeForStudents] = useState(true);
  const [capacity, setCapacity] = useState(500);
  const [bannerPreview, setBannerPreview] = useState(
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCRGb1BZyv3_1wLirO3YcvIeXfeGXLwz0KO-xS6NjT6PxOedqFSNyOnwZuoAg83pfGNqMDGr_8-mcxxZCRkYWO9r5Q8keWhOcrVv1D_5hWq2JrQ8m9wegE4RmBHOlbAq80o4flMjdPB7jgbgcv0aQb-G6XHUp6p5Uef2g7loGo6swRzC6wfb0ewzA0ePA4oQ8s3pNNQ2r5EDyZCrzCQN4ihIKYWDwmRT5jjr4Hr-IxWxYcyCuJBDJs2dupFLyBmowhyRSEdoTiJtG53Tw'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ title: string; subtitle: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const categories: { id: EventCategory; label: string; icon: string; emoji: string }[] = [
    { id: 'fest', label: 'College Fest', icon: 'celebration', emoji: '🎉' },
    { id: 'freshers', label: 'Freshers Party', icon: 'party_mode', emoji: '🌟' },
    { id: 'hackathon', label: 'Hackathon / Coding', icon: 'terminal', emoji: '⚡' },
    { id: 'workshop', label: 'Workshop / Seminar', icon: 'school', emoji: '🤖' },
    { id: 'sports', label: 'Sports', icon: 'sports_cricket', emoji: '⚽' },
    { id: 'cultural', label: 'Cultural', icon: 'theater_comedy', emoji: '🎭' }
  ];

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (!result) return;
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 1200;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL('image/jpeg', 0.85);
            setBannerPreview(compressed);
          } else {
            setBannerPreview(result);
          }
        };
        img.src = result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQuickPreset = (presetUrl: string) => {
    setBannerPreview(presetUrl);
  };

  const showToast = (titleText: string, subtitleText: string) => {
    setToastMessage({ title: titleText, subtitle: subtitleText });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title.trim()) {
      setErrorMessage('Please enter an event title before publishing.');
      const titleElem = document.getElementById('eventTitle');
      titleElem?.focus();
      return;
    }

    setIsSubmitting(true);
    const selectedVenue = CAMPUS_VENUES.find(v => v.id === venueId) || CAMPUS_VENUES[0];
    const catObj = categories.find(c => c.id === category) || categories[0];

    let displayDateStr = 'Upcoming';
    if (mode === 'now') {
      displayDateStr = 'Happening Now (Live)';
    } else if (eventDate) {
      const parts = eventDate.split('-');
      if (parts.length === 3) {
        displayDateStr = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
      }
    }

    const newEventData: Partial<CampusEvent> = {
      title: title.trim(),
      category,
      categoryLabel: catObj.label,
      categoryIcon: catObj.emoji,
      isHappeningNow: mode === 'now',
      date: mode === 'now' ? new Date().toISOString().split('T')[0] : eventDate,
      displayDate: displayDateStr,
      startTime,
      endTime,
      timeLabel: mode === 'now' ? 'Right Now on Campus' : `${startTime} – ${endTime}`,
      venueId: selectedVenue.id,
      venueName: selectedVenue.name,
      venueDetails: selectedVenue.location,
      organizerName: currentUser?.fullName || 'AYUSH JANA (Website Owner)',
      organizerRole: 'Verified Website Owner • Chief Portal Administrator',
      organizerRegNo: currentUser?.rollNumber || '006-121-2023-305',
      department: currentUser?.department || 'Department of Computer Science & Engineering',
      bannerImage: bannerPreview,
      shortDescription: `Official SVU Campus Event: ${title.trim()}. Broadcasted by Website Owner.`,
      fullDescription: `Official collegiate event published to the SVU Campus Pulse portal by the website owner and central administration. Open for all enrolled students. Entry verified at gate via QR code scanner.`,
      requiresStudentId: requireIdCheckin,
      isFreeForStudents: freeForStudents,
      capacity,
      registeredCount: 1,
      perks: [
        freeForStudents ? 'Free Entry for SVU Students' : 'Ticketed Admission',
        requireIdCheckin ? 'Student ID Check-in' : 'Open Entry',
        'Official University Certified',
        catObj.label
      ]
    };

    try {
      showToast('Publishing Event... 🚀', `Broadcasting "${title}" to SVU Campus Feed`);
      await onEventCreated(newEventData);
      setTitle('');
    } catch (err: any) {
      console.error('Submit error:', err);
      setErrorMessage(err?.message || 'Publishing failed. Please verify your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDraft = () => {
    showToast('Saved to Drafts 📁', 'Your event draft has been saved locally');
  };

  // If user is not Website Owner, show clear authorization screen with instant switcher
  if (!isOwner) {
    return (
      <div className="flex flex-col w-full px-4 max-w-md mx-auto py-12 items-center text-center gap-5">
        <div className="w-16 h-16 rounded-3xl bg-[#ffddb8] text-[#855300] flex items-center justify-center shadow-inner">
          <span className="material-symbols-outlined text-[36px]">lock</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="font-headline text-[11px] uppercase tracking-wider font-extrabold text-[#855300] bg-[#ffddb8]/80 px-3 py-1 rounded-full w-fit mx-auto">
            👑 Website Owner Access Only
          </span>
          <h2 className="font-headline text-[22px] font-bold text-[#003222]">
            Broadcasting Restricted
          </h2>
          <p className="text-[13px] text-[#404944] leading-relaxed">
            Only the verified <strong>Website Owner & Chief Administrator (Ayush Jana)</strong> can publish new fests, hackathons, and announcements to all student feeds.
          </p>
        </div>

        <div className="w-full bg-white rounded-2xl p-4 border border-[#003222]/10 flex items-center gap-3 text-left shadow-sm">
          <div className="w-10 h-10 rounded-full bg-[#e0f2eb] flex items-center justify-center font-headline font-bold text-[#003222]">
            {currentUser?.fullName ? currentUser.fullName.charAt(0) : 'U'}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="font-headline text-[13px] font-bold text-[#003222] truncate">
              {currentUser?.fullName || 'Logged In Student'}
            </span>
            <span className="text-[11px] text-[#707974] font-mono truncate">
              Roll ID: {currentUser?.rollNumber} • Standard Student Access
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 w-full">
          <button
            type="button"
            onClick={onSwitchToOwner}
            className="w-full py-3.5 px-4 bg-[#003222] text-white font-headline text-[13px] font-bold rounded-xl shadow-md hover:bg-[#0d4a36] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px] text-[#fea619]">key</span>
            <span>Switch to Ayush Jana (Website Owner)</span>
          </button>

          <button
            type="button"
            onClick={onGrantOwnerRole}
            className="w-full py-3 px-4 bg-[#e0f2eb] text-[#003222] font-headline text-[13px] font-semibold rounded-xl hover:bg-[#d5e6e0] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            <span>Grant Owner Role to This Account</span>
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-[12px] text-[#707974] hover:text-[#003222] font-medium py-1"
            >
              ← Back to Campus Events Feed
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full pb-28 pt-2">
      <div className="px-4 max-w-2xl mx-auto w-full flex flex-col gap-4">
        {/* Organizer Verification Card */}
        <div className="bg-[#003222] text-white rounded-2xl p-4 shadow-md border border-[#fea619]/40 flex items-start gap-3 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-[#fea619] text-[#684000] flex items-center justify-center shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[24px]">verified</span>
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-headline text-[10px] uppercase px-2.5 py-0.5 rounded-full bg-[#fea619] text-[#684000] font-extrabold tracking-wider">
                👑 Website Owner & Chief Administrator
              </span>
              <span className="font-headline text-[10px] text-[#ffddb8] font-bold">
                Live Broadcast Console
              </span>
            </div>
            <p className="font-headline text-[17px] font-extrabold text-white truncate mt-1">
              {currentUser.fullName || 'AYUSH JANA'}
            </p>
            <p className="text-[11px] text-[#99d3b8] truncate font-mono">
              REG NO - {currentUser.rollNumber || '006-121-2023-305'} • Authorized Event Publisher
            </p>
          </div>
          <div className="w-3 h-3 rounded-full bg-[#fea619] shrink-0 mt-1 animate-pulse"></div>
        </div>

        {/* Intro Headline Context */}
        <div className="flex flex-col">
          <h1 className="font-headline text-[22px] font-extrabold text-[#003222] tracking-tight">
            Create & Broadcast Event
          </h1>
          <p className="text-[13px] text-[#404944] mt-0.5">
            Admin console: Publish directly to all 2,840 SVU student portal feeds with real-time updates.
          </p>
        </div>

        {/* In-form Error message if any */}
        {errorMessage && (
          <div className="bg-red-50 text-red-700 p-3 rounded-xl border border-red-200 text-xs font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Main Event Creation Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Section 1: Event Identity */}
          <section className="bg-white rounded-2xl p-4 shadow-sm border border-[#003222]/8 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-[#003222]/5 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#003222]"></span>
                <span className="font-headline text-[12px] text-[#003222] font-bold uppercase tracking-wider">
                  1. Event Identity
                </span>
              </div>
              <span className="text-[11px] text-[#707974] font-medium">Step 1 of 5</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-headline text-[13px] text-[#0f1e1a] font-semibold" htmlFor="eventTitle">
                Event Title *
              </label>
              <div className="bg-[#e6f8f1] rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 focus-within:bg-[#e0f2eb] border border-[#003222]/10 transition-colors">
                <span className="material-symbols-outlined text-[#707974] text-[20px]">campaign</span>
                <input
                  id="eventTitle"
                  type="text"
                  required
                  value={title}
                  onChange={e => {
                    setTitle(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="e.g., Inter-Department Cricket Tournament 2026"
                  className="w-full bg-transparent text-[14px] text-[#0f1e1a] placeholder:text-[#707974] outline-none"
                />
              </div>
            </div>

            {/* Event Categories */}
            <div className="flex flex-col gap-2 pt-1">
              <label className="font-headline text-[13px] text-[#0f1e1a] font-semibold">
                Event Category
              </label>
              <div className="flex gap-2 overflow-x-auto pb-1 -mx-2 px-2 no-scrollbar">
                {categories.map(cat => {
                  const isSelected = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`shrink-0 px-3.5 py-2 rounded-xl font-headline text-[12px] font-semibold transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#003222] text-white shadow-sm'
                          : 'bg-[#e0f2eb] text-[#0f1e1a] hover:bg-[#dbece5]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">{cat.icon}</span>
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Section 2: Visual Banner */}
          <section className="bg-white rounded-2xl p-4 shadow-sm border border-[#003222]/8 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-[#003222]/5 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#fea619]"></span>
                <span className="font-headline text-[12px] text-[#003222] font-bold uppercase tracking-wider">
                  2. Visual Banner
                </span>
              </div>
              <span className="text-[11px] text-[#707974] font-medium">16:9 Landscape</span>
            </div>

            <div className="relative w-full rounded-xl overflow-hidden bg-[#e0f2eb] shadow-inner group aspect-[16/9]">
              <img
                src={bannerPreview}
                alt="Banner preview"
                className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = DEFAULT_CAMPUS_BANNER;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#003222]/90 via-[#003222]/30 to-transparent flex flex-col justify-end p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-col text-white min-w-0">
                    <span className="font-headline text-[10px] uppercase tracking-wider text-[#ffddb8] font-bold">
                      Campus Landmark Visual
                    </span>
                    <span className="font-headline text-[13px] truncate font-semibold">
                      SVU Campus Central Yard
                    </span>
                  </div>
                  <label
                    htmlFor="bannerUpload"
                    className="cursor-pointer px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-md text-[#003222] font-headline text-[12px] font-bold flex items-center gap-1 shadow hover:bg-white transition-all active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[16px]">add_photo_alternate</span>
                    <span>Replace</span>
                    <input
                      id="bannerUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleBannerUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Quick banner presets */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <span className="text-[11px] text-[#707974] shrink-0 font-medium">Quick Presets:</span>
              <button
                type="button"
                onClick={() => handleQuickPreset(DEFAULT_CAMPUS_BANNER)}
                className="px-2 py-1 bg-[#003222] text-white rounded-md text-[10px] font-bold shrink-0"
              >
                ★ SVU Official Fest
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset(HACKATHON_BANNER)}
                className="px-2 py-1 bg-[#e0f2eb] rounded-md text-[10px] font-bold text-[#003222] hover:bg-[#dbece5] shrink-0"
              >
                ⚡ Hackathon Matrix
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset('https://lh3.googleusercontent.com/aida-public/AB6AXuCRGb1BZyv3_1wLirO3YcvIeXfeGXLwz0KO-xS6NjT6PxOedqFSNyOnwZuoAg83pfGNqMDGr_8-mcxxZCRkYWO9r5Q8keWhOcrVv1D_5hWq2JrQ8m9wegE4RmBHOlbAq80o4flMjdPB7jgbgcv0aQb-G6XHUp6p5Uef2g7loGo6swRzC6wfb0ewzA0ePA4oQ8s3pNNQ2r5EDyZCrzCQN4ihIKYWDwmRT5jjr4Hr-IxWxYcyCuJBDJs2dupFLyBmowhyRSEdoTiJtG53Tw')}
                className="px-2 py-1 bg-[#e0f2eb] rounded-md text-[10px] font-semibold text-[#003222] hover:bg-[#dbece5] shrink-0"
              >
                Daylight Campus
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset('https://lh3.googleusercontent.com/aida-public/AB6AXuCeMMrKqfba7AWZebctS-6V8cUauEGNTzrqF1sdCKSSXnI_2nlYnnEVA_4QveTxROT9BlSJgtgkQG67BKN89-cPKTebj2f6RkqHGvl8Ay8gCPOpW1idABpTf5vRL_QZPHKDo5QIaOlhzXV_IBMP0i_dyo9Re0NHL0tuI37soP15c8GQWJWhrMPAJhBepDjm_Lx64BhPW5F-YbrI9bRnKpTQ-LpVlUMkW1KVQ--R55LNgQxp31U7KkLELdKlusaKir4X-g')}
                className="px-2 py-1 bg-[#e0f2eb] rounded-md text-[10px] font-semibold text-[#003222] hover:bg-[#dbece5] shrink-0"
              >
                Fest Night Lights
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset('https://lh3.googleusercontent.com/aida-public/AB6AXuAjjQB5r7wEyQjTYrQdiHGqj5Z_MGgiPy1dbP7_uw9h-VdMBf6Hc54BK5LmT_qAlkM0pNNW2-NufyDXnstHSUu178yRJ8AaCpxc0B2VFjn0YeWMxx7F3nRmEwFq_ceRpent6LuSjii9s1ol9U3J5t9enj6b7eo9qZb6K2QZXMkDirbO6VYWSB3SJsHKlL005vAepMGQjtIT0mQ1JymFWb800srhfiomiO7GtWHZ59IKq2lxaBdeTWuPfELVXZzA4ZKZXlZilVM6v2BNlQ')}
                className="px-2 py-1 bg-[#e0f2eb] rounded-md text-[10px] font-semibold text-[#003222] hover:bg-[#dbece5] shrink-0"
              >
                Hackathon Lab
              </button>
            </div>
            <p className="text-[11px] text-[#707974] leading-relaxed">
              Recommended 16:9 poster or high-res campus snapshot. Automatically scaled for student mobile feed notifications.
            </p>
          </section>

          {/* Section 3: Schedule & Mode */}
          <section className="bg-white rounded-2xl p-4 shadow-sm border border-[#003222]/8 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-[#003222]/5 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#003222]"></span>
                <span className="font-headline text-[12px] text-[#003222] font-bold uppercase tracking-wider">
                  3. Schedule & Mode
                </span>
              </div>
              <span className="text-[11px] text-[#707974] font-medium">Timeline</span>
            </div>

            {/* Segmented Mode Button */}
            <div className="grid grid-cols-2 p-1 bg-[#e6f8f1] rounded-xl border border-[#003222]/10">
              <button
                type="button"
                onClick={() => setMode('scheduled')}
                className={`py-2 rounded-lg font-headline text-[12px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                  mode === 'scheduled'
                    ? 'bg-white text-[#003222] shadow-sm'
                    : 'text-[#404944] hover:text-[#003222]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">event_upcoming</span>
                <span>Schedule for Future</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('now')}
                className={`py-2 rounded-lg font-headline text-[12px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                  mode === 'now'
                    ? 'bg-white text-[#ba1a1a] shadow-sm'
                    : 'text-[#404944] hover:text-[#ba1a1a]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px] text-[#ba1a1a] animate-pulse">radar</span>
                <span>Happening Now</span>
              </button>
            </div>

            {mode === 'scheduled' ? (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-headline text-[12px] text-[#0f1e1a] font-semibold" htmlFor="eventDate">
                    Date of Event
                  </label>
                  <div className="bg-[#e6f8f1] rounded-xl px-3 py-2 flex items-center gap-2 border border-[#003222]/10">
                    <span className="material-symbols-outlined text-[#707974] text-[18px]">calendar_today</span>
                    <input
                      id="eventDate"
                      type="date"
                      value={eventDate}
                      onChange={e => setEventDate(e.target.value)}
                      className="w-full bg-transparent text-[13px] text-[#0f1e1a] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="font-headline text-[12px] text-[#0f1e1a] font-semibold" htmlFor="startTime">
                      Start Time
                    </label>
                    <div className="bg-[#e6f8f1] rounded-xl px-3 py-2 flex items-center gap-1.5 border border-[#003222]/10">
                      <span className="material-symbols-outlined text-[#707974] text-[16px]">schedule</span>
                      <input
                        id="startTime"
                        type="time"
                        value={startTime}
                        onChange={e => setStartTime(e.target.value)}
                        className="w-full bg-transparent text-[13px] text-[#0f1e1a] outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-headline text-[12px] text-[#0f1e1a] font-semibold" htmlFor="endTime">
                      End Time
                    </label>
                    <div className="bg-[#e6f8f1] rounded-xl px-3 py-2 flex items-center gap-1.5 border border-[#003222]/10">
                      <span className="material-symbols-outlined text-[#707974] text-[16px]">history_toggle_off</span>
                      <input
                        id="endTime"
                        type="time"
                        value={endTime}
                        onChange={e => setEndTime(e.target.value)}
                        className="w-full bg-transparent text-[13px] text-[#0f1e1a] outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#ffdad6]/60 border border-[#ba1a1a]/30 p-3 rounded-xl flex items-center gap-2.5 text-[#93000a]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a] animate-ping shrink-0"></span>
                <p className="text-[12px] leading-tight">
                  <strong className="font-bold">Flash Live broadcast:</strong> This event will instantly trigger emergency priority cards in campus feed for 2 hours with live student counters.
                </p>
              </div>
            )}
          </section>

          {/* Section 4: Campus Venue */}
          <section className="bg-white rounded-2xl p-4 shadow-sm border border-[#003222]/8 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-[#003222]/5 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#003222]"></span>
                <span className="font-headline text-[12px] text-[#003222] font-bold uppercase tracking-wider">
                  4. Campus Venue
                </span>
              </div>
              <span className="text-[11px] text-[#707974] font-medium">Barrackpore</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-headline text-[13px] text-[#0f1e1a] font-semibold" htmlFor="venueSelect">
                Select Campus Location *
              </label>
              <div className="bg-[#e6f8f1] rounded-xl px-3 py-2.5 flex items-center gap-2 border border-[#003222]/10">
                <span className="material-symbols-outlined text-[#855300] text-[20px]">location_on</span>
                <select
                  id="venueSelect"
                  value={venueId}
                  onChange={e => setVenueId(e.target.value)}
                  className="w-full bg-transparent text-[13px] text-[#0f1e1a] outline-none cursor-pointer"
                >
                  {CAMPUS_VENUES.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-[#e0f2eb] p-2.5 rounded-xl border border-[#003222]/10">
              <span className="material-symbols-outlined text-[#003222] text-[18px]">near_me</span>
              <div className="flex flex-col min-w-0">
                <span className="font-headline text-[11px] font-bold text-[#003222]">
                  Map Direction Pinning
                </span>
                <span className="text-[11px] text-[#404944] truncate">
                  Attached with SVU Interactive Campus Wayfinder
                </span>
              </div>
            </div>
          </section>

          {/* Section 5: Entry & Access Rules */}
          <section className="bg-white rounded-2xl p-4 shadow-sm border border-[#003222]/8 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-[#003222]/5 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#003222]"></span>
                <span className="font-headline text-[12px] text-[#003222] font-bold uppercase tracking-wider">
                  5. Entry & Access Rules
                </span>
              </div>
              <span className="text-[11px] text-[#707974] font-medium">Security</span>
            </div>

            {/* Toggle 1: Student ID Check-in */}
            <div className="flex items-center justify-between gap-2 py-1">
              <div className="flex flex-col min-w-0">
                <span className="font-headline text-[13px] text-[#0f1e1a] font-semibold">
                  Require Student ID Check-in
                </span>
                <span className="text-[11px] text-[#404944]">
                  Scan University RFID / digital QR badge at the gate
                </span>
              </div>
              <button
                type="button"
                onClick={() => setRequireIdCheckin(!requireIdCheckin)}
                className={`w-12 h-6 rounded-full transition-colors relative shrink-0 p-0.5 ${
                  requireIdCheckin ? 'bg-[#003222]' : 'bg-[#d5e6e0]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                    requireIdCheckin ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Toggle 2: Free for SVU Students */}
            <div className="flex items-center justify-between gap-2 py-1 border-t border-[#003222]/5">
              <div className="flex flex-col min-w-0">
                <span className="font-headline text-[13px] text-[#0f1e1a] font-semibold">
                  Free for SVU Students
                </span>
                <span className="text-[11px] text-[#404944]">
                  Zero fee for all current undergraduate & postgraduate batches
                </span>
              </div>
              <button
                type="button"
                onClick={() => setFreeForStudents(!freeForStudents)}
                className={`w-12 h-6 rounded-full transition-colors relative shrink-0 p-0.5 ${
                  freeForStudents ? 'bg-[#003222]' : 'bg-[#d5e6e0]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                    freeForStudents ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Seat Capacity Slider */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-[#003222]/5">
              <div className="flex items-center justify-between">
                <label className="font-headline text-[13px] text-[#0f1e1a] font-semibold" htmlFor="seatCapacity">
                  Capacity & Seat Limit
                </label>
                <span className="font-headline text-[12px] text-[#855300] font-bold bg-[#ffddb8]/60 px-2 py-0.5 rounded-full">
                  {capacity} Seats
                </span>
              </div>
              <input
                id="seatCapacity"
                type="range"
                min="50"
                max="2500"
                step="50"
                value={capacity}
                onChange={e => setCapacity(Number(e.target.value))}
                className="w-full accent-[#003222] h-2 bg-[#dbece5] rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#707974] mt-0.5 font-medium">
                <span>50 (Classroom)</span>
                <span>500 (Auditorium)</span>
                <span>2000+ (Fest Grounds)</span>
              </div>
            </div>
          </section>

          {/* Campus Reach Advisory */}
          <div className="bg-[#dbece5] rounded-2xl p-3.5 flex items-start gap-2.5 border border-[#003222]/10">
            <span className="material-symbols-outlined text-[#fea619] text-[22px] shrink-0 mt-0.5">
              notification_important
            </span>
            <p className="text-[12px] text-[#003222] leading-relaxed">
              <strong className="font-bold">Official Campus Broadcast Advisory:</strong> Only authorized website owner announcements are published to enrolled student feeds. Dispatched with instant sync.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 pt-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-[#003222] text-white font-headline text-[15px] font-bold flex items-center justify-center gap-2 shadow-md active:scale-[0.99] hover:bg-[#0d4a36] transition-all disabled:opacity-50 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
              <span>{isSubmitting ? 'Broadcasting as Website Owner...' : 'Publish Event to Campus Feed'}</span>
            </button>

            <button
              type="button"
              onClick={handleDraft}
              className="w-full py-3 px-4 rounded-xl bg-[#e0f2eb] text-[#003222] font-headline text-[13px] font-bold flex items-center justify-center gap-1.5 hover:bg-[#dbece5] transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">bookmark</span>
              <span>Save as Draft</span>
            </button>
          </div>
        </form>

        {/* Delight Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-24 inset-x-4 max-w-sm mx-auto z-50 animate-in fade-in slide-in-from-bottom duration-300">
            <div className="bg-[#003222] text-white rounded-xl p-3.5 shadow-xl flex items-center gap-3 border border-[#fea619]/40">
              <div className="w-8 h-8 rounded-full bg-[#fea619] text-[#684000] flex items-center justify-center shrink-0 font-bold">
                <span className="material-symbols-outlined text-[18px]">done_all</span>
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-headline text-[13px] font-bold text-white">
                  {toastMessage.title}
                </span>
                <span className="text-[11px] text-[#99d3b8] truncate">
                  {toastMessage.subtitle}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
