/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useCallback } from 'react';
import { CampusEvent, StudentPass, StudentUser } from './types';
import { INITIAL_STUDENTS } from './initialData';
import { initLocalData, svuApi } from './services/api';
import { Header } from './components/Header';
import { Navigation, NavigationTab } from './components/Navigation';
import { EventsFeed } from './components/EventsFeed';
import { PostEventView } from './components/PostEventView';
import { MyPassesView } from './components/MyPassesView';
import { ProfileView } from './components/ProfileView';
import { EventDetailsModal } from './components/EventDetailsModal';
import { LoginModal } from './components/LoginModal';
import { BackendStatusModal } from './components/BackendStatusModal';
import { NotificationsModal } from './components/NotificationsModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<StudentUser | null>(null);
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [passes, setPasses] = useState<StudentPass[]>([]);
  const [currentTab, setCurrentTab] = useState<NavigationTab>('events');
  const [selectedEvent, setSelectedEvent] = useState<CampusEvent | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showBackendModal, setShowBackendModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);
  const [bannerToast, setBannerToast] = useState<{ title: string; subtitle: string } | null>(null);
  const [backendOnline, setBackendOnline] = useState(true);

  // Initialize data on mount
  useEffect(() => {
    initLocalData();
    let user = svuApi.getCurrentUser();
    // Clean old hardcoded sample image if present so everyone starts with clean monogram
    if (user && user.avatarUrl && user.avatarUrl.includes('AB6AXuAlyPd408KMj4U8ribICXzDMAeL4KLLSZhMFtEgj')) {
      user.avatarUrl = '';
      svuApi.setCurrentUser(user);
    }
    setCurrentUser(user);

    // Initial fetch of events & passes
    const loadData = async () => {
      const allEvents = await svuApi.getEvents();
      setEvents(allEvents);
      if (user) {
        const userPasses = await svuApi.getMyPasses(user.rollNumber);
        setPasses(userPasses);
      }
    };
    loadData();

    // Setup SSE live stream listener if supported
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/events/stream');
      eventSource.onmessage = (event) => {
        try {
          const packet = JSON.parse(event.data);
          if (packet.action === 'EVENT_CREATED' && packet.payload) {
            setEvents(prev => {
              const exists = prev.some(e => e.id === packet.payload.id);
              if (exists) return prev;
              return [packet.payload, ...prev];
            });
            // Show top alert
            setBannerToast({
              title: 'New Campus Event Broadcasted! 📢',
              subtitle: `"${packet.payload.title}" just published by ${packet.payload.organizerName}`
            });
            setTimeout(() => setBannerToast(null), 4500);
            setUnreadCount(c => c + 1);
          } else if (packet.action === 'PASS_CLAIMED') {
            setEvents(prev => prev.map(e => e.id === packet.payload.eventId ? { ...e, registeredCount: packet.payload.count } : e));
          }
        } catch (err) {
          // ignore
        }
      };
      eventSource.onerror = () => {
        setBackendOnline(false);
      };
      eventSource.onopen = () => {
        setBackendOnline(true);
      };
    } catch (e) {
      // fallback
    }

    return () => {
      eventSource?.close();
    };
  }, []);

  // Sync passes when user changes
  useEffect(() => {
    if (currentUser) {
      svuApi.getMyPasses(currentUser.rollNumber).then(setPasses);
    } else {
      setPasses([]);
    }
  }, [currentUser]);

  // Handle create event
  const handleEventCreated = async (eventData: Partial<CampusEvent>) => {
    const created = await svuApi.createEvent(eventData);
    setEvents(prev => [created, ...prev.filter(e => e.id !== created.id)]);
    // Switch to events tab immediately and open details
    setCurrentTab('events');
    setSelectedEvent(created);
    setBannerToast({
      title: 'Event Broadcasted Live! 🚀',
      subtitle: `"${created.title}" is now published on the SVU Campus Pulse feed.`
    });
    setTimeout(() => setBannerToast(null), 5000);
  };

  // Handle claim pass
  const handleClaimPass = async (event: CampusEvent): Promise<StudentPass> => {
    if (!currentUser) {
      setShowLoginModal(true);
      throw new Error('Please login to claim a pass');
    }
    const newPass = await svuApi.claimPass(event.id, currentUser);
    setPasses(prev => [newPass, ...prev.filter(p => p.id !== newPass.id)]);
    // Increment event local registered count
    setEvents(prev => prev.map(e => e.id === event.id ? { ...e, registeredCount: e.registeredCount + 1 } : e));
    setBannerToast({
      title: 'Pass Issued! 🎟️',
      subtitle: `FastPass generated for "${event.title}". Saved to My Passes.`
    });
    setTimeout(() => setBannerToast(null), 4000);
    return newPass;
  };

  // Handle test broadcast simulation
  const handleSimulateBroadcast = useCallback(async () => {
    const mockTitles = [
      '⚡ SVU HackSprint: 12-Hour AI Bot Challenge',
      '🎭 SVU Drama Club: Shakespeare at Mukta Mancha',
      '🎸 Battle of the Bands: Soundcheck Commenced',
      '🏸 Inter-Collegiate Badminton Finals Today'
    ];
    const pickedTitle = mockTitles[Math.floor(Math.random() * mockTitles.length)];
    const mockBroadcast: Partial<CampusEvent> = {
      title: pickedTitle,
      category: 'fest',
      categoryLabel: 'College Fest',
      categoryIcon: '🎉',
      isHappeningNow: true,
      timeLabel: 'Happening Live Right Now',
      venueName: 'SVU Central Lawn & Lawns',
      organizerName: currentUser?.fullName || 'AYUSH JANA (Tech Wing)',
      organizerRole: 'Verified University Organizer',
      organizerRegNo: currentUser?.rollNumber || '006-121-2023-305',
      shortDescription: 'Live campus broadcast triggered via Java Spring Boot Microservice Bus.',
      fullDescription: 'Dispatched in real-time across all active connected student devices.',
      perks: ['Free FastPass', 'Live Attendance', 'Snacks Provided']
    };
    const created = await svuApi.createEvent(mockBroadcast);
    setEvents(prev => [created, ...prev.filter(e => e.id !== created.id)]);
    setBannerToast({
      title: 'Live Campus Broadcast Dispatched! 🚀',
      subtitle: `"${created.title}" broadcasted across all SVU devices.`
    });
    setTimeout(() => setBannerToast(null), 4000);
    setCurrentTab('events');
  }, [currentUser]);

  // Handle user login success
  const handleLoginSuccess = (user: StudentUser) => {
    setCurrentUser(user);
    svuApi.setCurrentUser(user);
    setShowLoginModal(false);
    setBannerToast({
      title: `Welcome, ${user.fullName}! 🎓`,
      subtitle: `Roll ID ${user.rollNumber} attached to student session.`
    });
    setTimeout(() => setBannerToast(null), 4000);
  };

  // Handle avatar update
  const handleUpdateAvatar = async (newAvatarUrl: string) => {
    if (!currentUser) return;
    const updated = await svuApi.updateProfilePic(currentUser.id, newAvatarUrl);
    setCurrentUser({ ...currentUser, avatarUrl: newAvatarUrl });
    setBannerToast({
      title: newAvatarUrl ? 'Profile Picture Updated! 📸' : 'Avatar Reset to SVU Monogram',
      subtitle: 'Changes applied to your student ID and passes.'
    });
    setTimeout(() => setBannerToast(null), 3500);
  };

  // Pass ids registered by user
  const userPassEventIds = passes.map(p => p.eventId);
  const isOwner = Boolean(currentUser?.isOwner || currentUser?.role === 'owner' || currentUser?.rollNumber === '006-121-2023-305');

  return (
    <div className="min-h-screen bg-[#ecfdf6] text-[#0f1e1a] flex flex-col font-body antialiased">
      {/* Real-time Broadcast Floating Banner Toast */}
      {bannerToast && (
        <div className="fixed top-20 inset-x-4 max-w-md mx-auto z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-[#003222] text-white rounded-2xl p-3.5 shadow-2xl flex items-center gap-3 border border-[#fea619]/40 backdrop-blur-md">
            <div className="w-9 h-9 rounded-xl bg-[#fea619] text-[#684000] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">notifications_active</span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-headline text-[13px] font-bold text-white truncate">
                {bannerToast.title}
              </span>
              <span className="text-[11px] text-[#99d3b8] line-clamp-1">
                {bannerToast.subtitle}
              </span>
            </div>
            <button
              onClick={() => setBannerToast(null)}
              className="text-white/60 hover:text-white p-1"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        </div>
      )}

      {/* Main App Bar Header */}
      <Header
        currentUser={currentUser}
        onOpenProfile={() => setCurrentTab('profile')}
        onOpenNotifications={() => setShowNotificationsModal(true)}
        onOpenBackendInfo={() => setShowBackendModal(true)}
        unreadCount={unreadCount}
        backendOnline={backendOnline}
      />

      {/* Active Tab View */}
      <main className="flex-1 w-full pt-16 flex flex-col">
        {currentTab === 'events' && (
          <EventsFeed
            events={events}
            onSelectEvent={setSelectedEvent}
            onGoToPostEvent={() => {
              if (!currentUser) {
                setShowLoginModal(true);
              } else {
                setCurrentTab('post-event');
              }
            }}
            onClaimPass={handleClaimPass}
            userPassEventIds={userPassEventIds}
            isOwner={isOwner}
          />
        )}

        {currentTab === 'post-event' && (
          currentUser ? (
            <PostEventView
              currentUser={currentUser}
              onEventCreated={handleEventCreated}
              onCancel={() => setCurrentTab('events')}
              onSwitchToOwner={() => {
                const owner = INITIAL_STUDENTS[0];
                setCurrentUser(owner);
                svuApi.setCurrentUser(owner);
                setBannerToast({
                  title: 'Switched to Website Owner 👑',
                  subtitle: 'Authenticated as Ayush Jana (Master Admin).'
                });
                setTimeout(() => setBannerToast(null), 3000);
              }}
              onGrantOwnerRole={() => {
                if (currentUser) {
                  const upgraded: StudentUser = {
                    ...currentUser,
                    isOwner: true,
                    role: 'owner',
                    organizerBadge: 'Authorized Chief Administrator'
                  };
                  setCurrentUser(upgraded);
                  svuApi.setCurrentUser(upgraded);
                }
              }}
            />
          ) : (
            <div className="p-8 text-center flex flex-col items-center justify-center gap-4 max-w-md mx-auto my-auto">
              <div className="w-16 h-16 rounded-3xl bg-[#e0f2eb] flex items-center justify-center text-[#003222]">
                <span className="material-symbols-outlined text-[36px]">badge</span>
              </div>
              <h2 className="font-headline text-[20px] font-bold text-[#003222]">
                Website Owner Login Required
              </h2>
              <p className="text-[13px] text-[#404944]">
                Only the verified Website Owner (Ayush Jana) can broadcast events to Swami Vivekananda University students.
              </p>
              <div className="flex flex-col gap-2 w-full">
                <button
                  onClick={() => {
                    const owner = INITIAL_STUDENTS[0];
                    setCurrentUser(owner);
                    svuApi.setCurrentUser(owner);
                    setBannerToast({
                      title: 'Authenticated as Ayush Jana 👑',
                      subtitle: 'Website Owner permissions enabled.'
                    });
                    setTimeout(() => setBannerToast(null), 3000);
                  }}
                  className="w-full py-3.5 px-4 bg-[#003222] text-white font-headline text-[13px] font-bold rounded-xl shadow active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#fea619]">key</span>
                  <span>Continue as Ayush Jana (Website Owner)</span>
                </button>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="w-full py-2.5 px-4 bg-[#e0f2eb] text-[#003222] font-headline text-[12px] font-semibold rounded-xl hover:bg-[#d5e6e0]"
                >
                  Login with Mobile Number & OTP
                </button>
              </div>
            </div>
          )
        )}

        {currentTab === 'my-passes' && (
          currentUser ? (
            <MyPassesView
              passes={passes}
              currentUser={currentUser}
              onExploreEvents={() => setCurrentTab('events')}
              onSelectPass={(pass) => {
                const ev = events.find(e => e.id === pass.eventId);
                if (ev) setSelectedEvent(ev);
              }}
            />
          ) : (
            <div className="p-8 text-center flex flex-col items-center justify-center gap-4 max-w-md mx-auto my-auto">
              <span className="material-symbols-outlined text-[44px] text-[#fea619]">
                confirmation_number
              </span>
              <h2 className="font-headline text-[18px] font-bold text-[#003222]">
                Login to Access Your Passes
              </h2>
              <p className="text-[13px] text-[#404944]">
                Log in with your registered phone number to sync your fastpasses.
              </p>
              <button
                onClick={() => setShowLoginModal(true)}
                className="px-6 py-3 bg-[#003222] text-white font-headline text-[13px] font-bold rounded-xl shadow active:scale-95"
              >
                Log In with Student ID
              </button>
            </div>
          )
        )}

        {currentTab === 'profile' && (
          currentUser ? (
            <ProfileView
              currentUser={currentUser}
              onSwitchUser={(user) => {
                setCurrentUser(user);
                svuApi.setCurrentUser(user);
                setBannerToast({
                  title: `Switched Persona to ${user.fullName}`,
                  subtitle: `Roll: ${user.rollNumber} • ${user.department}`
                });
                setTimeout(() => setBannerToast(null), 3000);
              }}
              onOpenLogin={() => setShowLoginModal(true)}
              onUpdateAvatar={handleUpdateAvatar}
            />
          ) : (
            <div className="p-8 text-center flex flex-col items-center justify-center gap-4 max-w-md mx-auto my-auto">
              <span className="material-symbols-outlined text-[40px] text-[#003222]">account_circle</span>
              <h2 className="font-headline text-[18px] font-bold text-[#003222]">
                Student Profile
              </h2>
              <p className="text-[13px] text-[#404944]">
                Attach your student roll ID to view your collegiate badge.
              </p>
              <button
                onClick={() => setShowLoginModal(true)}
                className="px-6 py-3 bg-[#003222] text-white font-headline text-[13px] font-bold rounded-xl shadow active:scale-95"
              >
                Log In
              </button>
            </div>
          )
        )}
      </main>

      {/* Floating Bottom Navigation Bar */}
      <Navigation
        currentTab={currentTab}
        onChangeTab={setCurrentTab}
        passesCount={passes.length}
        isOwner={isOwner}
      />

      {/* Event Details Fullscreen Modal */}
      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          currentUser={currentUser || {
            id: 'guest',
            fullName: 'SVU Student',
            rollNumber: 'SVU/2026/GUEST',
            phoneNumber: '9876543210',
            department: 'Student Affairs',
            year: 'Undergraduate',
            avatarUrl: '',
            isOrganizer: false,
            registeredPassIds: []
          }}
          existingPass={passes.find(p => p.eventId === selectedEvent.id) || null}
          onClose={() => setSelectedEvent(null)}
          onClaimPass={handleClaimPass}
        />
      )}

      {/* Login / Collegiate Access Modal */}
      {showLoginModal && (
        <LoginModal
          onSuccess={handleLoginSuccess}
          onClose={() => setShowLoginModal(false)}
          isDismissible={currentUser !== null}
        />
      )}

      {/* Java Backend Diagnostics Modal */}
      {showBackendModal && (
        <BackendStatusModal
          onClose={() => setShowBackendModal(false)}
          onSimulateBroadcast={handleSimulateBroadcast}
        />
      )}

      {/* Campus Notifications Modal */}
      {showNotificationsModal && (
        <NotificationsModal
          onClose={() => setShowNotificationsModal(false)}
          onClear={() => setUnreadCount(0)}
        />
      )}
    </div>
  );
}
