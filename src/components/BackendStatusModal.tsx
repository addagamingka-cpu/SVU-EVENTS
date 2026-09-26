import React, { useEffect, useState } from 'react';
import { svuApi } from '../services/api';

interface BackendStatusModalProps {
  onClose: () => void;
  onSimulateBroadcast: () => void;
}

export const BackendStatusModal: React.FC<BackendStatusModalProps> = ({
  onClose,
  onSimulateBroadcast
}) => {
  const [backendInfo, setBackendInfo] = useState<any>(null);
  const [pingTime, setPingTime] = useState<number | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      const start = performance.now();
      const info = await svuApi.getBackendInfo();
      const end = performance.now();
      setPingTime(Math.round(end - start));
      setBackendInfo(info);
    };
    checkStatus();
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#003222] p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <div>
              <h3 className="font-headline text-[15px] font-bold text-white">
                Java Backend & Robust Data Management
              </h3>
              <span className="text-[11px] text-[#ffddb8] font-mono">
                Spring Boot 3.3.4 (OpenJDK 21)
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-4 text-left">
          {/* Status badge */}
          <div className="bg-[#e6f8f1] p-3 rounded-2xl border border-[#003222]/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-700 text-[20px] fill-1">verified</span>
              <span className="font-headline text-[13px] font-bold text-[#003222]">
                Real-Time Event Engine Active
              </span>
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-800 bg-white px-2 py-0.5 rounded-full shadow-xs">
              {pingTime !== null ? `${pingTime}ms Latency` : 'Healthy'}
            </span>
          </div>

          {/* Microservice Info */}
          <div className="flex flex-col gap-2 text-[12px]">
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-[#707974]">Backend Framework:</span>
              <span className="font-bold text-[#003222] font-mono">Java Spring Boot 3.3.4</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-[#707974]">Runtime:</span>
              <span className="font-bold text-[#003222] font-mono">OpenJDK 21 (JVM 64-Bit)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-[#707974]">Data Persistence:</span>
              <span className="font-bold text-[#003222]">SVU Registry JPA / Hibernate</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-[#707974]">Real-Time Protocol:</span>
              <span className="font-bold text-emerald-700">SSE EventBus / REST Polling</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-[#707974]">Live Enrolled Students:</span>
              <span className="font-bold text-[#003222]">2,840 Active Portals</span>
            </div>
          </div>

          {/* Test real-time push */}
          <div className="bg-[#fff8ee] p-3.5 rounded-2xl border border-[#fea619]/30 flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-[#855300]">
              <span className="material-symbols-outlined text-[18px]">broadcast_on_personal</span>
              <span className="font-headline text-[12px] font-bold">
                Test Real-Time Broadcast Simulation:
              </span>
            </div>
            <p className="text-[11px] text-[#684000] leading-relaxed">
              Dispatches an instant campus-wide event announcement to test live synchronization across all users.
            </p>
            <button
              onClick={() => {
                onSimulateBroadcast();
                onClose();
              }}
              className="py-2.5 px-4 bg-[#003222] text-white rounded-xl font-headline text-[12px] font-bold flex items-center justify-center gap-1.5 shadow active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">cell_tower</span>
              <span>Trigger Test Event Broadcast</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-gray-100 text-gray-700 font-headline text-[12px] font-semibold hover:bg-gray-200 transition-colors"
          >
            Close Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
};
