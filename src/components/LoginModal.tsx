import React, { useState, useRef, useEffect } from 'react';
import { StudentUser } from '../types';
import { INITIAL_STUDENTS } from '../initialData';
import { svuApi } from '../services/api';
import { DEFAULT_SVU_LOGO, DEFAULT_CAMPUS_BANNER } from '../utils/imageFallback';
import { StudentAvatar } from './StudentAvatar';

interface LoginModalProps {
  onSuccess: (user: StudentUser) => void;
  onClose?: () => void;
  isDismissible?: boolean;
}

interface IncomingMessageAlert {
  otpCode: string;
  phoneNumber: string;
  channel: 'whatsapp' | 'sms';
  smsText: string;
  timestamp: string;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  onSuccess,
  onClose,
  isDismissible = true
}) => {
  const [rollNumber, setRollNumber] = useState('006-121-2023-305');
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  const [channel, setChannel] = useState<'whatsapp' | 'sms'>('whatsapp');
  const [authStep, setAuthStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [countdown, setCountdown] = useState(45);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Real received OTP message state
  const [incomingAlert, setIncomingAlert] = useState<IncomingMessageAlert | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showSimNotification, setShowSimNotification] = useState(false);

  const input1Ref = useRef<HTMLInputElement>(null);
  const input2Ref = useRef<HTMLInputElement>(null);
  const input3Ref = useRef<HTMLInputElement>(null);
  const input4Ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let timer: any;
    if (authStep === 'OTP' && countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [authStep, countdown]);

  const handleSendCode = async () => {
    if (!rollNumber.trim()) {
      setErrorMsg('Please enter your University Roll No. or Student ID');
      return;
    }
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit registered mobile number');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);
    setOtpDigits(['', '', '', '']);

    try {
      const response = await svuApi.sendOtp(rollNumber, cleanPhone, channel);
      const code = response.otpCode || '2026';

      setIncomingAlert({
        otpCode: code,
        phoneNumber: cleanPhone,
        channel,
        smsText: response.smsText || `[SVU Campus Pulse] ${code} is your verification code to attach ID ${rollNumber} to phone +91 ${cleanPhone}. Valid for 5 mins.`,
        timestamp: response.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      // Trigger incoming phone notification animation
      setShowSimNotification(true);
      setAuthStep('OTP');
      setCountdown(45);

      setTimeout(() => {
        input1Ref.current?.focus();
      }, 300);
    } catch (e: any) {
      setErrorMsg(e?.message || 'Failed to dispatch code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoFillOtp = (code: string) => {
    if (!code || code.length !== 4) return;
    const digits = code.split('');
    setOtpDigits(digits);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
    input4Ref.current?.focus();
  };

  const handleVerifyOtp = async () => {
    const fullOtp = otpDigits.join('');
    if (fullOtp.length !== 4) {
      setErrorMsg(`Please enter the complete 4-digit code received on +91 ${phoneNumber.replace(/\D/g, '')}`);
      return;
    }

    setErrorMsg('');
    setIsLoading(true);
    try {
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      const user = await svuApi.verifyOtp(rollNumber, cleanPhone, fullOtp);
      onSuccess(user);
    } catch (e: any) {
      setErrorMsg(e?.message || `Invalid code. Please enter the OTP sent to +91 ${phoneNumber.replace(/\D/g, '')}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    const char = val.slice(-1);
    const updated = [...otpDigits];
    updated[index] = char;
    setOtpDigits(updated);

    if (char) {
      if (index === 0) input2Ref.current?.focus();
      if (index === 1) input3Ref.current?.focus();
      if (index === 2) input4Ref.current?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      if (index === 3) input3Ref.current?.focus();
      if (index === 2) input2Ref.current?.focus();
      if (index === 1) input1Ref.current?.focus();
    }
  };

  const handleQuickStudentSelect = (student: StudentUser) => {
    setRollNumber(student.rollNumber);
    setPhoneNumber(student.phoneNumber);
    onSuccess(student);
  };

  const cleanCurrentPhone = phoneNumber.replace(/\D/g, '');

  return (
    <div className="fixed inset-0 z-50 bg-[#ecfdf6] overflow-y-auto no-scrollbar flex flex-col pt-safe pb-safe">
      {/* SIMULATED INCOMING PHONE SMS / WHATSAPP PUSH BANNER (Slides from top) */}
      {showSimNotification && incomingAlert && (
        <div className="fixed top-3 inset-x-3 max-w-md mx-auto z-50 animate-in slide-in-from-top-6 duration-300">
          <div className="bg-[#1f2937]/95 backdrop-blur-xl text-white rounded-2xl p-3.5 shadow-2xl border border-white/20 flex flex-col gap-2">
            {/* Header row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                  incomingAlert.channel === 'whatsapp' ? 'bg-[#25D366] text-white' : 'bg-[#3b82f6] text-white'
                }`}>
                  <span className="material-symbols-outlined text-[15px]">
                    {incomingAlert.channel === 'whatsapp' ? 'chat' : 'sms'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-headline text-[11px] font-bold text-white uppercase tracking-wider">
                    {incomingAlert.channel === 'whatsapp' ? 'WhatsApp' : 'Messages'} • Just Now
                  </span>
                  <span className="text-[10px] text-gray-300 font-mono">
                    SVU-CAMPUS → +91 {incomingAlert.phoneNumber}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowSimNotification(false)}
                className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            </div>

            {/* Message Body */}
            <div className="bg-black/30 rounded-xl p-2.5 flex items-center justify-between gap-2 border border-white/10">
              <p className="text-[12px] text-gray-100 font-mono leading-tight flex-1">
                Your SVU Campus OTP is <strong className="text-[#fea619] text-[15px] font-bold tracking-widest">{incomingAlert.otpCode}</strong>
              </p>
              <button
                onClick={() => handleAutoFillOtp(incomingAlert.otpCode)}
                className="px-2.5 py-1.5 bg-[#fea619] text-[#684000] font-headline text-[11px] font-bold rounded-lg shadow active:scale-95 shrink-0 flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[13px]">bolt</span>
                <span>Auto-Fill</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 w-full max-w-md mx-auto flex flex-col min-h-screen">
        {/* Visual Campus Showcase Header */}
        <div className="relative w-full h-56 overflow-hidden bg-[#0d4a36]">
          <img
            alt="SVU Campus Building"
            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRGb1BZyv3_1wLirO3YcvIeXfeGXLwz0KO-xS6NjT6PxOedqFSNyOnwZuoAg83pfGNqMDGr_8-mcxxZCRkYWO9r5Q8keWhOcrVv1D_5hWq2JrQ8m9wegE4RmBHOlbAq80o4flMjdPB7jgbgcv0aQb-G6XHUp6p5Uef2g7loGo6swRzC6wfb0ewzA0ePA4oQ8s3pNNQ2r5EDyZCrzCQN4ihIKYWDwmRT5jjr4Hr-IxWxYcyCuJBDJs2dupFLyBmowhyRSEdoTiJtG53Tw"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = DEFAULT_CAMPUS_BANNER;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#ecfdf6] via-[#0d4a36]/60 to-transparent"></div>

          {/* Top Floating Crest & Quick Badges */}
          <div className="absolute inset-x-0 top-0 p-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm">
              <img
                alt="SVU Crest"
                className="w-6 h-6 object-contain"
                src="https://lh3.googleusercontent.com/aida/AEtjO1WiiBJPJHWOp9w12qrIJVV3UaTpWFl6cuxiFIzhwUevQXy42Db6LEpA-TCF1H6UE6kVlv0qCTP3FwyCySta5Eu7QfvmH3I4-bhsN_3g2vKU0H9GK9Uc97cmTP4bcw611TINsRhQq14WtroA7WJu20zSshRzc89UFqlW3VdmyoEUubyxUer7SEOVU4c3x3jUAC8kvfar691QPwcRjb_AQpkCaoRYrVj-QZyvL4VcSEynvV-dPFu_0m2XejcqL2Jz13B8JsylSyvzKw"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = DEFAULT_SVU_LOGO;
                }}
              />
              <span className="font-headline text-[10px] text-[#003222] tracking-wider uppercase font-bold">
                SVU Portal
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1.5 bg-[#fea619]/20 border border-[#fea619]/30 backdrop-blur-md px-2.5 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-[#fea619] animate-pulse"></span>
                <span className="font-headline text-[10px] text-[#855300] font-bold">
                  FEST SEASON '26
                </span>
              </div>
              {isDismissible && onClose && (
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/50"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>
          </div>

          {/* Hero Title Over Campus Backdrop */}
          <div className="absolute bottom-3 inset-x-0 px-4 flex flex-col">
            <div className="flex items-center gap-1 text-[#fea619] font-headline text-[12px] font-semibold mb-0.5">
              <span className="material-symbols-outlined text-[16px]">school</span>
              <span>Collegiate Access</span>
            </div>
            <h1 className="font-headline text-[22px] font-extrabold text-[#0f1e1a] leading-tight">
              Welcome to SVU Campus Pulse
            </h1>
            <p className="text-[12px] text-[#404944] truncate">
              Connect with university events, fests, hackathons & clubs
            </p>
          </div>
        </div>

        {/* Form Interactive Container */}
        <div className="px-4 flex flex-col gap-4 -mt-2 z-20 pb-12">
          {/* Main Student Authorization Card */}
          <div className="bg-white rounded-2xl p-5 shadow-md border border-[#003222]/10 flex flex-col gap-3.5">
            {errorMsg && (
              <div className="bg-red-50 text-red-700 text-xs p-2.5 rounded-xl border border-red-200 flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] shrink-0">error</span>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Academic ID Section */}
            <div className="flex flex-col gap-1.5">
              <label className="font-headline text-[12px] text-[#0f1e1a] font-semibold flex items-center justify-between" htmlFor="svu-roll-input">
                <span>University Roll No. / Student ID</span>
                <span className="font-headline text-[10px] text-[#16503c] bg-[#e0f2eb] px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                  <span className="material-symbols-outlined text-[13px] text-[#004b32] fill-1">verified</span>
                  <span>SVU Registry</span>
                </span>
              </label>

              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-[#707974] text-[20px] pointer-events-none">
                  badge
                </span>
                <input
                  id="svu-roll-input"
                  type="text"
                  value={rollNumber}
                  onChange={e => setRollNumber(e.target.value)}
                  placeholder="e.g. SVU/2023/BTECH/CS/042"
                  className="w-full bg-[#e6f8f1] text-[#0f1e1a] text-[13px] pl-10 pr-9 py-2.5 rounded-xl outline-none placeholder:text-[#707974] focus:bg-white border border-[#003222]/10 transition-colors font-mono"
                />
                {rollNumber && (
                  <button
                    onClick={() => setRollNumber('')}
                    type="button"
                    className="absolute right-3 text-[#707974] hover:text-[#0f1e1a] p-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">cancel</span>
                  </button>
                )}
              </div>
              <p className="text-[11px] text-[#404944] flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-[#004b32]">info</span>
                <span>Attaches your verified student badge to event RSVPs & voting</span>
              </p>
            </div>

            {/* Phone Number Field */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="font-headline text-[12px] text-[#0f1e1a] font-semibold" htmlFor="student-phone-input">
                  Registered Mobile Number
                </label>
                {authStep === 'OTP' && (
                  <button
                    type="button"
                    onClick={() => setAuthStep('PHONE')}
                    className="text-[11px] text-[#855300] font-headline font-bold hover:underline flex items-center gap-0.5"
                  >
                    <span className="material-symbols-outlined text-[13px]">edit</span>
                    <span>Change Number</span>
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                <div className="bg-[#e6f8f1] px-3 py-2.5 rounded-xl flex items-center gap-1.5 shrink-0 select-none border border-[#003222]/10">
                  <span className="text-base leading-none">🇮🇳</span>
                  <span className="font-headline text-[12px] text-[#0f1e1a] font-bold">+91</span>
                </div>
                <div className="relative flex-1 flex items-center">
                  <input
                    id="student-phone-input"
                    type="tel"
                    maxLength={10}
                    disabled={authStep === 'OTP'}
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="98765 43210"
                    className={`w-full text-[#0f1e1a] text-[13px] px-3.5 py-2.5 rounded-xl outline-none placeholder:text-[#707974] border transition-colors font-mono ${
                      authStep === 'OTP'
                        ? 'bg-gray-100 text-gray-700 border-gray-200 cursor-not-allowed'
                        : 'bg-[#e6f8f1] focus:bg-white border-[#003222]/10'
                    }`}
                  />
                  <span className="material-symbols-outlined absolute right-3 text-[#707974] text-[18px] pointer-events-none">
                    smartphone
                  </span>
                </div>
              </div>
            </div>

            {/* Channel Dispatch Options */}
            <div className="bg-[#e6f8f1]/80 p-2.5 rounded-xl flex flex-col gap-2 border border-[#003222]/10">
              <div className="flex items-center justify-between">
                <span className="font-headline text-[10px] uppercase tracking-wider text-[#404944] font-bold">
                  Authentication Route
                </span>
                <span className="font-headline text-[10px] text-[#855300] font-bold flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[13px]">bolt</span>
                  <span>Direct Delivery to Num</span>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setChannel('whatsapp')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-headline text-[12px] font-semibold transition-all ${
                    channel === 'whatsapp'
                      ? 'bg-white text-[#003222] shadow-sm font-bold border border-[#003222]/10'
                      : 'text-[#404944] hover:text-[#003222]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">chat</span>
                  <span>WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={() => setChannel('sms')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-headline text-[12px] font-semibold transition-all ${
                    channel === 'sms'
                      ? 'bg-white text-[#003222] shadow-sm font-bold border border-[#003222]/10'
                      : 'text-[#404944] hover:text-[#003222]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">sms</span>
                  <span>SMS OTP</span>
                </button>
              </div>
            </div>

            {/* OTP DYNAMIC SECTION (ACTIVATES AFTER CODE DISPATCH) */}
            {authStep === 'OTP' && (
              <div className="flex flex-col gap-3 pt-2 border-t border-[#003222]/10 animate-in fade-in duration-300">
                {/* Received SMS verification box */}
                <div className="bg-[#e0f2eb] rounded-xl p-3 border border-[#003222]/15 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-headline text-[11px] font-bold text-[#003222] flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                      OTP Delivered to +91 {cleanCurrentPhone}
                    </span>
                    <span className="text-[10px] text-[#404944] font-mono">
                      via {channel === 'sms' ? 'SMS' : 'WhatsApp'}
                    </span>
                  </div>

                  {incomingAlert && (
                    <div className="bg-white/80 rounded-lg p-2.5 flex items-center justify-between gap-2 border border-[#003222]/10">
                      <div className="flex flex-col min-w-0">
                        <span className="text-[11px] text-[#404944] line-clamp-1 font-mono">
                          Code: <strong className="text-[#003222] text-[14px] font-bold">{incomingAlert.otpCode}</strong>
                        </span>
                        <span className="text-[9px] text-[#707974] truncate">
                          Valid for 5 minutes
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAutoFillOtp(incomingAlert.otpCode)}
                        className="px-2.5 py-1 bg-[#003222] text-white font-headline text-[11px] font-bold rounded-md shadow-xs active:scale-95 shrink-0"
                      >
                        {copiedCode ? 'Filled! ✓' : 'Auto-fill'}
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-headline text-[12px] text-[#0f1e1a] font-bold">
                    Enter 4-Digit Code
                  </span>
                  <button
                    type="button"
                    disabled={countdown > 0}
                    onClick={handleSendCode}
                    className={`text-[11px] font-semibold ${
                      countdown > 0 ? 'text-gray-400' : 'text-[#855300] hover:underline'
                    }`}
                  >
                    {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
                  </button>
                </div>

                {/* 4 Digit Boxes */}
                <div className="flex justify-between gap-2">
                  <input
                    ref={input1Ref}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otpDigits[0]}
                    onChange={e => handleOtpChange(0, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(0, e)}
                    className="w-12 h-12 text-center font-headline text-xl font-bold bg-[#dbece5] rounded-xl text-[#003222] outline-none focus:bg-white border focus:border-[#003222] shadow-inner"
                  />
                  <input
                    ref={input2Ref}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otpDigits[1]}
                    onChange={e => handleOtpChange(1, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(1, e)}
                    className="w-12 h-12 text-center font-headline text-xl font-bold bg-[#dbece5] rounded-xl text-[#003222] outline-none focus:bg-white border focus:border-[#003222] shadow-inner"
                  />
                  <input
                    ref={input3Ref}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otpDigits[2]}
                    onChange={e => handleOtpChange(2, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(2, e)}
                    className="w-12 h-12 text-center font-headline text-xl font-bold bg-[#dbece5] rounded-xl text-[#003222] outline-none focus:bg-white border focus:border-[#003222] shadow-inner"
                  />
                  <input
                    ref={input4Ref}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otpDigits[3]}
                    onChange={e => handleOtpChange(3, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(3, e)}
                    className="w-12 h-12 text-center font-headline text-xl font-bold bg-[#dbece5] rounded-xl text-[#003222] outline-none focus:bg-white border focus:border-[#003222] shadow-inner"
                  />
                </div>
              </div>
            )}

            {/* Main Action Button */}
            <button
              type="button"
              disabled={isLoading}
              onClick={authStep === 'PHONE' ? handleSendCode : handleVerifyOtp}
              className="w-full bg-[#003222] hover:bg-[#0d4a36] text-white py-3.5 px-4 rounded-xl font-headline text-[14px] font-bold flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] transition-transform disabled:opacity-50 mt-1"
            >
              <span>
                {isLoading
                  ? 'Connecting to SVU Gateway...'
                  : authStep === 'PHONE'
                  ? `Send Code to +91 ${cleanCurrentPhone || 'Mobile'}`
                  : 'Verify & Enter Campus'}
              </span>
              <span className="material-symbols-outlined text-[18px]">
                {authStep === 'PHONE' ? 'send' : 'done_all'}
              </span>
            </button>

            {/* Trust & SSO Security Footer */}
            <div className="pt-1 flex items-center justify-center gap-1.5 text-center text-[#707974] text-[11px]">
              <span className="material-symbols-outlined text-[15px] text-[#003222]">lock_clock</span>
              <span>Protected with University SSO & Roll Registry, Barrackpore</span>
            </div>
          </div>

          {/* Quick Website Owner Login Card */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-3.5 border border-[#fea619]/30 flex flex-col gap-2">
            <span className="font-headline text-[11px] font-bold text-[#003222] uppercase tracking-wider flex items-center gap-1">
              <span>👑 Website Owner One-Tap Login:</span>
            </span>
            {INITIAL_STUDENTS.map(student => (
              <button
                key={student.id}
                type="button"
                onClick={() => handleQuickStudentSelect(student)}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-[#e6f8f1] hover:bg-[#dbece5] transition-colors text-left border border-[#003222]/10"
              >
                <StudentAvatar
                  name={student.fullName}
                  avatarUrl={student.avatarUrl}
                  size="sm"
                  isOrganizer={student.isOrganizer}
                />
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-headline text-[12px] font-bold text-[#0f1e1a] truncate">
                      {student.fullName}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded font-bold uppercase bg-[#fea619] text-[#684000]">
                      Owner
                    </span>
                  </div>
                  <span className="text-[10px] text-[#707974] truncate font-mono">
                    Roll: {student.rollNumber} • +91 {student.phoneNumber}
                  </span>
                </div>
                <span className="material-symbols-outlined text-[18px] text-[#003222]">
                  arrow_forward
                </span>
              </button>
            ))}
          </div>

          {/* Campus Live Perks Card */}
          <div className="bg-[#e6f8f1] rounded-2xl p-3.5 shadow-sm border border-[#003222]/10 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#d5e6e0] flex items-center justify-center text-[#003222] shrink-0">
              <span className="material-symbols-outlined text-[20px]">confirmation_number</span>
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="font-headline text-[13px] text-[#0f1e1a] font-bold">
                Fest Pass Pre-registration
              </span>
              <p className="text-[11px] text-[#404944] leading-relaxed">
                Sync roll records directly for Swami Vivekananda University TechExpo & Rhapsody 2026 entry badge.
              </p>
            </div>
          </div>

          {/* IT Desk & Student Helpline */}
          <div className="flex flex-col items-center justify-center gap-1 py-1">
            <p className="text-[12px] text-[#404944] text-center">Need help accessing your student account?</p>
            <a
              href="#helpdesk"
              onClick={(e) => {
                e.preventDefault();
                alert('SVU IT Help Desk: registrar@svu.ac.in | Toll-free: 1800-SVU-CAMPUS');
              }}
              className="inline-flex items-center gap-1 font-headline text-[12px] text-[#003222] font-bold hover:underline"
            >
              <span className="material-symbols-outlined text-[16px]">contact_support</span>
              <span>Contact SVU Campus IT Desk</span>
            </a>
            <span className="text-[10px] text-[#707974]">
              Office of Registrar • Vivekananda Knowledge City, Barrackpore
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};
