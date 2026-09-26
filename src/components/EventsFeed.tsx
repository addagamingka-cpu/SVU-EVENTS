import React, { useState, useMemo } from 'react';
import { CampusEvent, EventCategory } from '../types';

interface EventsFeedProps {
  events: CampusEvent[];
  onSelectEvent: (event: CampusEvent) => void;
  onGoToPostEvent: () => void;
  onClaimPass: (event: CampusEvent) => void;
  userPassEventIds: string[];
  isOwner?: boolean;
}

export const EventsFeed: React.FC<EventsFeedProps> = ({
  events,
  onSelectEvent,
  onGoToPostEvent,
  onClaimPass,
  userPassEventIds,
  isOwner = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTabMode, setActiveTabMode] = useState<'all' | 'live' | 'upcoming'>('all');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterDepartment, setFilterDepartment] = useState('all');

  const categories: { id: string; label: string; icon: string }[] = [
    { id: 'all', label: 'All', icon: '🔥' },
    { id: 'fest', label: 'Fests', icon: '🎉' },
    { id: 'hackathon', label: 'Hackathons', icon: '⚡' },
    { id: 'freshers', label: 'Freshers', icon: '🌟' },
    { id: 'workshop', label: 'Workshops', icon: '🤖' },
    { id: 'sports', label: 'Sports', icon: '⚽' },
    { id: 'cultural', label: 'Cultural', icon: '🎭' }
  ];

  // Dynamic count of events per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: events.length };
    events.forEach(e => {
      counts[e.category] = (counts[e.category] || 0) + 1;
    });
    return counts;
  }, [events]);

  // Filtering logic
  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = e.title.toLowerCase().includes(q);
        const matchesDept = (e.department || '').toLowerCase().includes(q);
        const matchesVenue = (e.venueName || '').toLowerCase().includes(q);
        const matchesDesc = (e.shortDescription || '').toLowerCase().includes(q);
        const matchesCat = (e.categoryLabel || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesDept && !matchesVenue && !matchesDesc && !matchesCat) return false;
      }

      // Category filter chip
      if (selectedCategory !== 'all' && e.category !== selectedCategory) {
        return false;
      }

      // Tab Mode: Live vs Upcoming
      if (activeTabMode === 'live' && !e.isHappeningNow) {
        return false;
      }
      if (activeTabMode === 'upcoming' && e.isHappeningNow) {
        return false;
      }

      // Department filter from tune modal
      if (filterDepartment !== 'all' && !e.department.toLowerCase().includes(filterDepartment.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [events, searchQuery, selectedCategory, activeTabMode, filterDepartment]);

  // Live Spotlight Event (either happening now, or highest registered live fest)
  const liveSpotlight = useMemo(() => {
    // If category or search is active, find live spotlight within filtered events
    if (selectedCategory !== 'all' || searchQuery.trim()) {
      return filteredEvents.find(e => e.isHappeningNow) || null;
    }
    return events.find(e => e.isHappeningNow) || events[0] || null;
  }, [events, filteredEvents, selectedCategory, searchQuery]);

  // Upcoming / Regular list (excluding spotlight if displayed in hero)
  const displayList = useMemo(() => {
    if (liveSpotlight && activeTabMode !== 'upcoming') {
      return filteredEvents.filter(e => e.id !== liveSpotlight.id);
    }
    return filteredEvents;
  }, [filteredEvents, liveSpotlight, activeTabMode]);

  const handleShare = (e: React.MouseEvent, event: CampusEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: `${event.title} - SVU Campus Pulse`,
        text: `Check out ${event.title} happening at Swami Vivekananda University!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(`Event link for "${event.title}" copied to clipboard!`);
    }
  };

  return (
    <div className="flex flex-col w-full pb-28">
      {/* Sticky Search & Filter Header Area */}
      <div className="px-4 py-3 flex flex-col gap-2.5 sticky top-16 z-30 bg-[#ecfdf6]/95 backdrop-blur-md border-b border-[#003222]/8 shadow-[0_2px_10px_rgba(0,50,34,0.04)]">
        {/* Search Bar */}
        <div className="relative w-full group">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#707974] group-focus-within:text-[#003222] text-[20px] transition-colors pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Escape') setSearchQuery('');
            }}
            placeholder="Search fests, hackathons, freshers, workshops..."
            className="w-full h-11 pl-10 pr-24 rounded-2xl bg-[#dbece5] text-[#0f1e1a] placeholder:text-[#404944]/70 font-body text-[14px] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#003222]/20 border border-transparent focus:border-[#003222]/30 transition-all shadow-inner"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {searchQuery && (
              <>
                <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-[#003222] text-white">
                  {filteredEvents.length}
                </span>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[#707974] hover:text-[#ba1a1a] hover:bg-black/5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => setShowFilterModal(true)}
              aria-label="Filter Settings"
              className="w-8 h-8 rounded-xl flex items-center justify-center text-[#707974] hover:text-[#003222] hover:bg-black/5 transition-colors cursor-pointer"
              title="Advanced Filters"
            >
              <span className="material-symbols-outlined text-[19px]">tune</span>
            </button>
          </div>
        </div>

        {/* Filter Chips Horizontal Rail (e.g., 'All', 'Fests', 'Hackathons') */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 no-scrollbar">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat.id;
            const count = categoryCounts[cat.id] || 0;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 h-9 px-3.5 rounded-full font-headline text-[12px] font-bold transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-sm ${
                  isSelected
                    ? 'bg-[#003222] text-white ring-2 ring-[#003222]/30'
                    : 'bg-[#dbece5] text-[#0f1e1a] hover:bg-[#d0e4dc] border border-[#003222]/5'
                }`}
              >
                <span className="text-[14px]">{cat.icon}</span>
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold transition-colors ${
                    isSelected
                      ? 'bg-[#fea619] text-[#684000]'
                      : 'bg-black/8 text-[#404944]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Filter Summary Bar */}
        {(selectedCategory !== 'all' || searchQuery.trim() || activeTabMode !== 'all' || filterDepartment !== 'all') && (
          <div className="flex items-center justify-between gap-2 pt-0.5 text-[11px] text-[#404944]">
            <div className="flex items-center gap-1.5 flex-wrap min-w-0">
              <span className="font-semibold text-[#003222]">Active:</span>
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#003222] text-white text-[10px] font-bold">
                  {categories.find(c => c.id === selectedCategory)?.label}
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('all')}
                    className="hover:text-[#fea619]"
                  >
                    ×
                  </button>
                </span>
              )}
              {searchQuery.trim() && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#e0f2eb] text-[#003222] border border-[#003222]/15 text-[10px] font-bold">
                  "{searchQuery}"
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="hover:text-red-600"
                  >
                    ×
                  </button>
                </span>
              )}
              {activeTabMode !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ffddb8] text-[#855300] text-[10px] font-bold">
                  {activeTabMode === 'live' ? 'Live Only' : 'Upcoming Only'}
                  <button
                    type="button"
                    onClick={() => setActiveTabMode('all')}
                    className="hover:text-red-700"
                  >
                    ×
                  </button>
                </span>
              )}
              <span className="text-[#707974] font-medium">({filteredEvents.length} events)</span>
            </div>

            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setActiveTabMode('all');
                setFilterDepartment('all');
              }}
              className="text-[#855300] hover:text-[#003222] font-headline font-bold text-[11px] underline shrink-0 cursor-pointer"
            >
              Reset all
            </button>
          </div>
        )}

        {/* Segmented Live / Upcoming Toggle */}
        <div className="bg-[#dbece5] p-1 rounded-xl flex items-center justify-between gap-1 shadow-inner">
          <button
            onClick={() => setActiveTabMode(activeTabMode === 'live' ? 'all' : 'live')}
            className={`flex-1 py-2 px-3 rounded-lg font-headline text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTabMode === 'live'
                ? 'bg-white text-[#003222] shadow-sm font-bold'
                : 'text-[#404944] hover:text-[#003222]'
            }`}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#fea619] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#fea619]"></span>
            </span>
            <span>Happening Now (Live)</span>
          </button>

          <button
            onClick={() => setActiveTabMode(activeTabMode === 'upcoming' ? 'all' : 'upcoming')}
            className={`flex-1 py-2 px-3 rounded-lg font-headline text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTabMode === 'upcoming'
                ? 'bg-white text-[#003222] shadow-sm font-bold'
                : 'text-[#404944] hover:text-[#003222]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">calendar_today</span>
            <span>Upcoming Events</span>
          </button>
        </div>
      </div>

      {/* Main Content List Container */}
      <div className="px-4 flex flex-col gap-6 mt-3 max-w-2xl mx-auto w-full">
        {/* Section 1: Happening on Campus Today (Live Spotlight) */}
        {activeTabMode !== 'upcoming' && liveSpotlight && (
          <section className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#fea619] animate-pulse"></div>
                <h2 className="font-headline text-[18px] font-bold text-[#003222]">
                  Happening on Campus Today
                </h2>
              </div>
              <span className="font-headline text-[10px] text-[#855300] bg-[#ffddb8]/80 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
                {liveSpotlight.activeDayLabel || 'Day 2 Active'}
              </span>
            </div>

            {/* Live Hero Featured Card */}
            <div
              onClick={() => onSelectEvent(liveSpotlight)}
              className="relative w-full rounded-2xl overflow-hidden shadow-lg bg-[#24332f] text-white cursor-pointer group transition-transform active:scale-[0.99]"
            >
              {/* Fest Scrim & Image Container */}
              <div
                className="relative w-full h-64 bg-cover bg-center flex flex-col justify-between p-4"
                style={{ backgroundImage: `url("${liveSpotlight.bannerImage}")` }}
              >
                {/* Gradient Scrim Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/25"></div>

                {/* Top Row Status Badges */}
                <div className="relative z-10 flex items-center justify-between w-full">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ba1a1a] text-white font-headline text-[10px] font-bold uppercase shadow-md">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                    Live Now
                  </span>
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[#ffddb8] font-headline text-[11px] font-medium">
                    <span className="material-symbols-outlined text-[14px]">groups</span>
                    <span>{liveSpotlight.liveStudentsCount || 1420} Students Inside</span>
                  </div>
                </div>

                {/* Bottom Card Content Floating in Scrim */}
                <div className="relative z-10 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-[#ffddb8] font-headline text-[11px] uppercase tracking-wider font-semibold">
                    <span className="material-symbols-outlined text-[14px]">local_activity</span>
                    <span>{liveSpotlight.organizerName} Presents</span>
                  </div>
                  <h3 className="font-headline text-[22px] sm:text-[26px] font-extrabold text-white leading-tight">
                    {liveSpotlight.title}
                  </h3>
                  <p className="font-headline text-[13px] text-[#6ffbbe] font-semibold">
                    {liveSpotlight.shortDescription}
                  </p>
                </div>
              </div>

              {/* Meta Details Box & Primary Action Button */}
              <div className="p-4 bg-[#0d4a36] flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2 text-[#80b99f] text-[12px]">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="material-symbols-outlined text-[18px] text-[#fea619] shrink-0">schedule</span>
                    <span className="truncate font-semibold text-white">{liveSpotlight.timeLabel}</span>
                  </div>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="material-symbols-outlined text-[18px] text-[#fea619] shrink-0">pin_drop</span>
                    <span className="truncate text-white/90">{liveSpotlight.venueName}</span>
                  </div>
                </div>

                {/* Action Button Grid */}
                <div className="flex items-center gap-2 pt-0.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectEvent(liveSpotlight);
                    }}
                    className="flex-1 h-12 rounded-xl bg-[#fea619] text-[#684000] font-headline text-[14px] font-bold flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-transform"
                  >
                    <span className="material-symbols-outlined text-[20px]">confirmation_number</span>
                    <span>Get Pass / View Live Schedule</span>
                  </button>
                  <button
                    onClick={(e) => handleShare(e, liveSpotlight)}
                    aria-label="Share Event"
                    className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center shrink-0 active:scale-95 transition-transform"
                  >
                    <span className="material-symbols-outlined text-[20px]">share</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Section 2: Upcoming Major Highlights / Filtered Results */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-headline text-[18px] font-bold text-[#003222]">
                {searchQuery.trim()
                  ? `Results for "${searchQuery}"`
                  : selectedCategory !== 'all'
                  ? `${categories.find(c => c.id === selectedCategory)?.label || 'Filtered'} Events`
                  : activeTabMode === 'live'
                  ? 'Current Live Sessions'
                  : 'Upcoming Major Highlights'}
              </h2>
              <p className="text-[12px] text-[#404944]">
                {searchQuery.trim()
                  ? `Found ${filteredEvents.length} event${filteredEvents.length === 1 ? '' : 's'} matching your search`
                  : selectedCategory !== 'all'
                  ? `Showing all ${categories.find(c => c.id === selectedCategory)?.label.toLowerCase()} at SVU Barrackpore`
                  : 'Confirmed technical symposiums, welcomes & meets'}
              </p>
            </div>
            {(selectedCategory !== 'all' || searchQuery.trim() || activeTabMode !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setActiveTabMode('all');
                }}
                className="text-[#855300] font-headline text-[12px] font-bold flex items-center gap-0.5 hover:underline cursor-pointer"
              >
                <span>Clear</span>
                <span className="material-symbols-outlined text-[15px]">close</span>
              </button>
            )}
          </div>

          {/* Event Cards List */}
          {displayList.length === 0 && !liveSpotlight ? (
            <div className="bg-white rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-3 shadow-sm border border-[#003222]/10">
              <span className="material-symbols-outlined text-[40px] text-[#707974]">search_off</span>
              <p className="font-headline text-[16px] font-bold text-[#003222]">
                No events match your criteria
              </p>
              <p className="text-[12px] text-[#404944] max-w-xs">
                {searchQuery.trim()
                  ? `No events matching "${searchQuery}". Try different keywords or select another filter chip.`
                  : `No events in this category yet. Browse all college events or hackathons.`}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setActiveTabMode('all');
                  setFilterDepartment('all');
                }}
                className="px-4 py-2 bg-[#003222] text-white rounded-xl text-xs font-bold shadow hover:bg-[#0d4a36] cursor-pointer active:scale-95 transition-transform"
              >
                Show All Events ({events.length})
              </button>
            </div>
          ) : (
            displayList.map((event) => {
              const hasPass = userPassEventIds.includes(event.id);

              return (
                <div
                  key={event.id}
                  onClick={() => onSelectEvent(event)}
                  className="rounded-2xl bg-white p-4 shadow-sm border border-[#003222]/8 flex flex-col gap-3 hover:shadow-md transition-shadow cursor-pointer"
                >
                  {/* Banner Image */}
                  <div
                    className="relative w-full h-36 rounded-xl bg-cover bg-center overflow-hidden flex flex-col justify-between p-3"
                    style={{ backgroundImage: `url("${event.bannerImage}")` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-[#003222]/90 via-[#003222]/30 to-transparent"></div>
                    
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#fea619] text-[#684000] font-headline text-[10px] font-bold uppercase shadow-sm">
                        {event.activeDayLabel || event.categoryLabel}
                      </span>
                      <button
                        onClick={(e) => handleShare(e, event)}
                        className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm text-[#003222] flex items-center justify-center shadow hover:bg-white"
                      >
                        <span className="material-symbols-outlined text-[18px]">share</span>
                      </button>
                    </div>

                    <div className="relative z-10 flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-white/95 text-[#003222] font-headline text-[11px] font-bold">
                        {event.displayDate || event.date}
                      </span>
                      <span className="text-white text-[12px] drop-shadow-sm flex items-center gap-1 font-medium truncate">
                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                        {event.venueName}
                      </span>
                    </div>
                  </div>

                  {/* Info & Badges */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-full bg-[#e0f2eb] text-[#003222] font-headline text-[11px] font-semibold">
                        {event.department}
                      </span>
                      {event.cashPrize && (
                        <span className="text-[#855300] font-headline text-[11px] font-bold flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[14px]">emoji_events</span>
                          {event.cashPrize}
                        </span>
                      )}
                    </div>

                    <h3 className="font-headline text-[16px] font-bold text-[#0f1e1a] leading-snug">
                      {event.title}
                    </h3>
                    <p className="text-[12px] text-[#404944] line-clamp-2 leading-relaxed">
                      {event.shortDescription}
                    </p>
                  </div>

                  {/* Perks Pills */}
                  {event.perks && event.perks.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {event.perks.slice(0, 3).map((perk, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-lg bg-[#dbece5] text-[#003222] font-headline text-[11px] flex items-center gap-1 font-medium"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0d4a36]"></span>
                          {perk}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Card Action Footer */}
                  <div className="flex items-center justify-between pt-1 border-t border-[#003222]/5">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-1.5">
                        <div className="w-6 h-6 rounded-full bg-[#d5e6e0] flex items-center justify-center text-[10px] font-bold text-[#003222] ring-2 ring-white">
                          AK
                        </div>
                        <div className="w-6 h-6 rounded-full bg-[#b5efd3] flex items-center justify-center text-[10px] font-bold text-[#002115] ring-2 ring-white">
                          RD
                        </div>
                        <div className="w-6 h-6 rounded-full bg-[#ffddb8] flex items-center justify-center text-[10px] font-bold text-[#2a1700] ring-2 ring-white">
                          +{Math.max(12, event.registeredCount % 80)}
                        </div>
                      </div>
                      <span className="text-[11px] text-[#404944]">
                        {event.registeredCount} registered
                      </span>
                    </div>

                    {hasPass ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectEvent(event);
                        }}
                        className="h-9 px-3.5 rounded-xl bg-[#003222]/10 text-[#003222] font-headline text-[12px] font-bold flex items-center gap-1 hover:bg-[#003222]/20 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px] text-emerald-600">verified</span>
                        <span>Pass Ready</span>
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onClaimPass(event);
                        }}
                        className="h-9 px-3.5 rounded-xl bg-[#003222] text-white font-headline text-[12px] font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-transform"
                      >
                        <span>RSVP / Register ID</span>
                        <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </section>

        {/* Campus Host CTA Banner */}
        <div
          onClick={onGoToPostEvent}
          className="rounded-2xl p-4 bg-gradient-to-r from-[#003222] via-[#0d4a36] to-[#004b32] text-white flex items-center justify-between gap-3 shadow-md cursor-pointer hover:opacity-95 transition-opacity"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-full bg-[#fea619] text-[#684000] flex items-center justify-center shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[22px]">
                {isOwner ? 'campaign' : 'verified_user'}
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-headline text-[14px] font-bold leading-tight truncate">
                {isOwner ? '👑 Broadcast Campus Event' : 'Official Campus Broadcasting'}
              </span>
              <span className="text-[12px] text-[#80b99f] truncate">
                {isOwner
                  ? 'Tap to publish new fests, hackathons & notices'
                  : 'Broadcasted exclusively by Website Owner & Chief Admin'}
              </span>
            </div>
          </div>
          <button className="shrink-0 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Filter / Tune Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md p-5 flex flex-col gap-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#003222]">tune</span>
                <h3 className="font-headline font-bold text-lg text-[#003222]">Filter Campus Events</h3>
              </div>
              <button
                onClick={() => setShowFilterModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Department */}
            <div className="flex flex-col gap-1.5">
              <label className="font-headline text-xs font-semibold text-[#003222]">Department</label>
              <select
                value={filterDepartment}
                onChange={e => setFilterDepartment(e.target.value)}
                className="w-full bg-[#dbece5] rounded-xl px-3 py-2 text-sm outline-none"
              >
                <option value="all">All Departments</option>
                <option value="CSE">Department of CSE & IT</option>
                <option value="Engineering">Department of Engineering</option>
                <option value="ECE">Department of ECE & AI/ML</option>
                <option value="Cultural">University Cultural Wing</option>
                <option value="Physical">Department of Physical Education</option>
              </select>
            </div>

            {/* Event Type */}
            <div className="flex flex-col gap-1.5">
              <label className="font-headline text-xs font-semibold text-[#003222]">Category</label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                      selectedCategory === cat.id ? 'bg-[#003222] text-white' : 'bg-[#e0f2eb] text-[#003222]'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span className="truncate">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2 border-t">
              <button
                onClick={() => {
                  setFilterDepartment('all');
                  setSelectedCategory('all');
                  setShowFilterModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-xs font-semibold"
              >
                Reset All
              </button>
              <button
                onClick={() => setShowFilterModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#003222] text-white text-xs font-semibold"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
