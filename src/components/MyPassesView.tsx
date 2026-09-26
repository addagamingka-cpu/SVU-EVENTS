import React, { useState } from 'react';
import { StudentPass, StudentUser } from '../types';

interface MyPassesViewProps {
  passes: StudentPass[];
  currentUser: StudentUser;
  onExploreEvents: () => void;
  onSelectPass: (pass: StudentPass) => void;
}

export const MyPassesView: React.FC<MyPassesViewProps> = ({
  passes,
  currentUser,
  onExploreEvents,
  onSelectPass
}) => {
  const [selectedPassForModal, setSelectedPassForModal] = useState<StudentPass | null>(null);

  return (
    <div className="flex flex-col w-full pb-28 pt-2">
      <div className="px-4 max-w-2xl mx-auto w-full flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="font-headline text-[22px] font-extrabold text-[#003222] tracking-tight">
              My Student Passes
            </h1>
            <p className="text-[12px] text-[#404944]">
              Verified entry badges linked to Roll No. {currentUser.rollNumber}
            </p>
          </div>
          <span className="font-headline text-[11px] font-bold text-[#855300] bg-[#ffddb8] px-2.5 py-1 rounded-full">
            {passes.length} Issued
          </span>
        </div>

        {passes.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-3 shadow-sm border border-[#003222]/8 mt-4">
            <div className="w-16 h-16 rounded-full bg-[#e0f2eb] flex items-center justify-center text-[#003222]">
              <span className="material-symbols-outlined text-[32px]">confirmation_number</span>
            </div>
            <h3 className="font-headline text-[16px] font-bold text-[#003222]">
              No Passes Claimed Yet
            </h3>
            <p className="text-[13px] text-[#404944] max-w-xs">
              Explore college fests, freshers parties, and hackathons to claim your 1-tap fast pass.
            </p>
            <button
              onClick={onExploreEvents}
              className="mt-2 px-5 py-2.5 bg-[#003222] text-white font-headline text-[13px] font-bold rounded-xl shadow active:scale-95 transition-transform"
            >
              Browse Campus Events
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3.5">
            {passes.map(pass => (
              <div
                key={pass.id}
                onClick={() => setSelectedPassForModal(pass)}
                className="bg-white rounded-2xl shadow-sm border border-[#003222]/10 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              >
                {/* Top notch */}
                <div className="bg-[#003222] p-3.5 text-white flex items-center justify-between">
                  <div className="flex flex-col min-w-0">
                    <span className="font-headline text-[10px] text-[#ffddb8] uppercase font-bold tracking-wider">
                      SVU Student FastPass
                    </span>
                    <h3 className="font-headline text-[15px] font-bold text-white truncate">
                      {pass.eventTitle}
                    </h3>
                  </div>
                  <span className="material-symbols-outlined text-[24px] text-[#fea619] shrink-0">
                    qr_code_2
                  </span>
                </div>

                {/* Pass Content */}
                <div className="p-4 flex items-center justify-between gap-3">
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-[12px] text-[#404944]">
                      <span className="material-symbols-outlined text-[16px] text-[#fea619]">schedule</span>
                      <span className="font-medium truncate">{pass.eventDate} • {pass.eventTime}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[12px] text-[#404944]">
                      <span className="material-symbols-outlined text-[16px] text-[#003222]">pin_drop</span>
                      <span className="truncate">{pass.venueName}</span>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 rounded-full bg-[#e0f2eb] text-[#003222] font-headline text-[10px] font-bold">
                        {pass.gateName}
                      </span>
                      <span className="text-[10px] text-[#707974] font-mono">
                        {pass.passNumber}
                      </span>
                    </div>
                  </div>

                  {/* QR Preview Thumbnail */}
                  <div className="w-16 h-16 bg-[#e6f8f1] rounded-xl flex items-center justify-center p-1.5 shrink-0 border border-[#003222]/10">
                    <svg className="w-full h-full text-[#003222]" fill="currentColor" viewBox="0 0 100 100">
                      <path d="M0,0 h30 v30 h-30 z M6,6 v18 h18 v-18 z M10,10 h10 v10 h-10 z" />
                      <path d="M70,0 h30 v30 h-30 z M76,6 v18 h18 v-18 z M80,10 h10 v10 h-10 z" />
                      <path d="M0,70 h30 v30 h-30 z M6,76 v18 h18 v-18 z M10,80 h10 v10 h-10 z" />
                      <rect height="12" width="12" x="44" y="44" />
                    </svg>
                  </div>
                </div>

                <div className="px-4 py-2.5 bg-[#e6f8f1] border-t border-[#003222]/5 flex items-center justify-between">
                  <span className="font-headline text-[11px] text-[#003222] font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-emerald-600 fill-1">verified</span>
                    Tap to show Gate Scanner
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-[#003222]">
                    chevron_right
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for full QR code display */}
        {selectedPassForModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="bg-[#003222] p-4 text-white flex items-center justify-between">
                <div>
                  <span className="font-headline text-[10px] text-[#ffddb8] uppercase font-bold tracking-wider">
                    Gate Access QR Code
                  </span>
                  <h4 className="font-headline text-[15px] font-bold text-white truncate max-w-[220px]">
                    {selectedPassForModal.eventTitle}
                  </h4>
                </div>
                <button
                  onClick={() => setSelectedPassForModal(null)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              <div className="p-6 flex flex-col items-center justify-center gap-4 text-center">
                <div className="p-4 bg-[#e6f8f1] rounded-2xl shadow-inner border border-[#003222]/10">
                  <svg className="w-48 h-48 text-[#003222]" fill="currentColor" viewBox="0 0 100 100">
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

                <div className="flex flex-col gap-0.5">
                  <span className="font-headline text-[15px] font-bold text-[#003222]">
                    {selectedPassForModal.studentName}
                  </span>
                  <span className="font-mono text-[12px] text-[#404944]">
                    Roll: {selectedPassForModal.studentRollNumber}
                  </span>
                  <span className="font-headline text-[11px] text-[#855300] font-bold bg-[#ffddb8] px-2 py-0.5 rounded-full mt-1">
                    {selectedPassForModal.gateName}
                  </span>
                </div>

                <div className="w-full flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      alert('Pass ticket saved as offline pass on your device!');
                      setSelectedPassForModal(null);
                    }}
                    className="flex-1 py-3 rounded-xl bg-[#003222] text-white font-headline text-[12px] font-bold flex items-center justify-center gap-1.5 shadow active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[16px]">download</span>
                    <span>Save to Photos</span>
                  </button>
                  <button
                    onClick={() => {
                      alert('Gate scanner simulated: Admission Granted! Welcome to Swami Vivekananda University.');
                      setSelectedPassForModal(null);
                    }}
                    className="py-3 px-4 rounded-xl bg-[#fea619] text-[#684000] font-headline text-[12px] font-bold flex items-center justify-center gap-1 shadow active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[16px]">qr_code_scanner</span>
                    <span>Test Gate Scan</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
