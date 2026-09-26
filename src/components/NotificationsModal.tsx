import React from 'react';

interface NotificationItem {
  id: string;
  title: string;
  time: string;
  type: 'live' | 'pass' | 'event';
  read: boolean;
}

interface NotificationsModalProps {
  onClose: () => void;
  onClear: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  onClose,
  onClear
}) => {
  const notifications: NotificationItem[] = [
    {
      id: 'notif-1',
      title: 'SVU Rock Night Live Now: 1,420 students gathered at Mukta Mancha Open Air Theatre!',
      time: '10 mins ago',
      type: 'live',
      read: false
    },
    {
      id: 'notif-2',
      title: 'Pass Confirmed: Your fastpass SVU-PASS-2026-AK8891 for Aakash 2026 is ready to scan.',
      time: '1 hour ago',
      type: 'pass',
      read: false
    },
    {
      id: 'notif-3',
      title: 'HackSVU 2026 registration opened! ₹50,000 cash prize pool across AI & Web3 tracks.',
      time: 'Yesterday',
      type: 'event',
      read: true
    },
    {
      id: 'notif-4',
      title: 'Freshers Welcome 2026: "Aarohan" announced by Department of Engineering.',
      time: '2 days ago',
      type: 'event',
      read: true
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="bg-[#003222] p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#fea619] text-[22px]">notifications</span>
            <h3 className="font-headline text-[15px] font-bold text-white">
              Campus Notifications
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-4 flex flex-col gap-2.5 max-h-[70vh] overflow-y-auto">
          {notifications.map(n => (
            <div
              key={n.id}
              className={`p-3 rounded-2xl flex items-start gap-3 transition-colors ${
                n.read ? 'bg-gray-50' : 'bg-[#e6f8f1] border border-[#003222]/10'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  n.type === 'live'
                    ? 'bg-red-100 text-red-600'
                    : n.type === 'pass'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-[#e0f2eb] text-[#003222]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {n.type === 'live' ? 'radar' : n.type === 'pass' ? 'confirmation_number' : 'campaign'}
                </span>
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <p className="text-[12px] text-[#0f1e1a] font-medium leading-snug">
                  {n.title}
                </p>
                <span className="text-[10px] text-[#707974] mt-1">{n.time}</span>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between pt-2 border-t mt-1">
            <button
              onClick={onClear}
              className="text-[11px] text-[#855300] font-headline font-bold hover:underline"
            >
              Mark all as read
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#003222] text-white text-xs font-headline font-bold rounded-xl"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
