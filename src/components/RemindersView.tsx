import React, { useState } from 'react';
import { ReminderItem, FamilyMember, Language } from '../types';
import { 
  Check, 
  Calendar, 
  Plus, 
  ExternalLink, 
  MapPin, 
  Phone, 
  X, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';

interface RemindersViewProps {
  reminders: ReminderItem[];
  familyMembers: FamilyMember[];
  selectedMemberId: string | null;
  onSelectMember: (memberId: string | null) => void;
  language: Language;
  onOpenScanner: () => void;
  onAddReminder: (reminder: ReminderItem) => void;
}

export const RemindersView: React.FC<RemindersViewProps> = ({
  reminders,
  familyMembers,
  selectedMemberId,
  onSelectMember,
  language,
  onOpenScanner,
  onAddReminder,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'emergency_meds' | 'policy_renewal' | 'cardiac_lab'>('all');
  const [doseTaken, setDoseTaken] = useState(false);
  const [snoozeNotice, setSnoozeNotice] = useState(false);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [showPumpModal, setShowPumpModal] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);

  // Custom reminder form state
  const [customTitle, setCustomTitle] = useState('');
  const [customMember, setCustomMember] = useState('rajesh');
  const [customCategory, setCustomCategory] = useState<'emergency_meds' | 'policy_renewal' | 'cardiac_lab'>('emergency_meds');
  const [customDate, setCustomDate] = useState('');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;
    const memberObj = familyMembers.find(m => m.id === customMember);
    onAddReminder({
      id: `rem-${Date.now()}`,
      title: customTitle.trim(),
      titleHi: customTitle.trim(),
      category: customCategory,
      memberId: customMember,
      memberName: memberObj?.name || 'Rajesh',
      dueDate: customDate || 'Next week',
      dueText: 'Scheduled',
      dueTextHi: 'अनुसूचित',
      subtitle: `${memberObj?.name} • Custom Reminder`,
      subtitleHi: `${memberObj?.name} • कस्टम रिमाइंडर`,
      details: 'Syncing with WhatsApp & SMS',
    });
    setCustomTitle('');
    setShowCustomModal(false);
  };

  const filteredReminders = reminders.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesMember = !selectedMemberId || item.memberId === selectedMemberId || item.memberName.includes('All');
    return matchesCategory && matchesMember;
  });

  return (
    <div className="flex flex-col w-full space-y-4 max-w-2xl mx-auto pb-6 animate-in fade-in duration-200">
      {/* 1. Status / Channel Overview Banner */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#eaeef2]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-[#006d43]">
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                notifications_active
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider">
                {language === 'hi' ? 'स्मार्ट रिमाइंडर • Live Sync' : 'Smart Reminder • Live Sync'}
              </span>
            </div>
            <h1 className="text-lg font-bold text-[#001026] mt-0.5">
              {language === 'hi' ? 'परिवार रिमाइंडर' : 'Family Reminders'}
            </h1>
            <p className="text-xs text-[#44474e]">
              5 actionable tasks requiring attention
            </p>
          </div>
          <span className="px-2.5 py-1 bg-[#75f8b3]/20 text-[#006d43] text-xs font-bold rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#006d43] animate-pulse"></span>
            5 Active
          </span>
        </div>

        {/* Active Sync Channels */}
        <div className="mt-3.5 pt-3 bg-[#f0f4f8]/60 rounded-xl px-3 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-[#44474e]">Active Alerts:</span>
            <div className="flex items-center gap-1.5">
              {/* WhatsApp */}
              <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-full shadow-2xs border border-[#eaeef2]">
                <span className="material-symbols-outlined text-[14px] text-[#006d43]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  chat
                </span>
                <span className="text-[10px] font-semibold text-[#001026]">WhatsApp</span>
              </div>
              {/* SMS */}
              <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-full shadow-2xs border border-[#eaeef2]">
                <span className="material-symbols-outlined text-[14px] text-[#44474e]">sms</span>
                <span className="text-[10px] font-semibold text-[#001026]">SMS</span>
              </div>
              {/* GCal */}
              <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-full shadow-2xs border border-[#eaeef2]">
                <span className="material-symbols-outlined text-[14px] text-[#0b2545]">calendar_today</span>
                <span className="text-[10px] font-semibold text-[#001026]">G-Cal</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => alert('Configured automated WhatsApp & SMS alerts to Rajesh (+91 98100 12345) and Sunita.')}
            className="text-[#001026] text-[11px] font-bold hover:underline"
          >
            Config
          </button>
        </div>
      </div>

      {/* 2. Spotlight Urgent Due Alert Card (Car Insurance) */}
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-md border border-[#eaeef2]">
        {/* Amber Accent Top Bar */}
        <div className="h-1.5 w-full bg-[#ffb95f]"></div>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ffddb8]/60 text-[#2a1700] text-[11px] font-bold">
              <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                hourglass_top
              </span>
              <span>Due in 4 Days (18 Nov)</span>
            </div>
            <span className="text-[10px] text-[#44474e] font-medium">Rajesh (Honda City)</span>
          </div>

          <div className="mt-2.5 flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#f0f4f8] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl text-[#001026]">directions_car</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-1">
                <h2 className="text-sm font-bold text-[#001026] truncate">
                  HDFC ERGO Car Insurance
                </h2>
                <span className="text-sm font-bold text-[#001026]">₹8,420</span>
              </div>
              <p className="text-xs text-[#44474e] mt-0.5">Honda City ZX • DL-01-AB-4920</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[10px] font-semibold text-[#006d43] flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[12px]">verified</span>
                  NCB 35% Safe
                </span>
                <span className="text-[10px] text-[#74777f]">• IDV: ₹6.80 Lakh</span>
              </div>
            </div>
          </div>

          {snoozeNotice && (
            <div className="mt-2 text-[11px] text-[#006d43] font-semibold bg-[#75f8b3]/20 p-2 rounded-lg flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>Snoozed for 2 days. Reminder moved to 20 Nov.</span>
            </div>
          )}

          {/* Action Row */}
          <div className="grid grid-cols-2 gap-2 mt-3.5 pt-3 border-t border-[#f0f4f8]">
            <button
              onClick={() => setSnoozeNotice(true)}
              className="h-10 px-3 bg-[#f0f4f8] text-[#001026] text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 hover:bg-[#eaeef2] active:scale-[0.98] transition-transform"
              type="button"
            >
              <span className="material-symbols-outlined text-sm">snooze</span>
              Snooze 2 Days
            </button>
            <button
              onClick={() => setShowRenewModal(true)}
              className="h-10 px-3 bg-[#0b2545] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs active:scale-[0.98] transition-transform hover:bg-[#001026]"
              type="button"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Renew Online
            </button>
          </div>
        </div>
      </div>

      {/* 3. Smart Suggestion & Document Scan Strip */}
      <div className="p-3 bg-[#006d43]/10 rounded-2xl flex items-center justify-between gap-3 border border-[#006d43]/20 shadow-2xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[#006d43] text-white flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-lg">document_scanner</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#001026] truncate">AI Renewal & Rx Extractor</p>
            <p className="text-[11px] text-[#44474e] truncate">Snap paper notice to auto-schedule</p>
          </div>
        </div>
        <button
          onClick={onOpenScanner}
          className="h-8 px-3 rounded-full bg-[#006d43] text-white text-xs font-bold shrink-0 active:scale-95 transition-transform flex items-center gap-1"
          type="button"
        >
          <span className="material-symbols-outlined text-sm">photo_camera</span>
          Scan
        </button>
      </div>

      {/* 4. Category Filter Pills */}
      <div className="overflow-x-auto -mx-4 px-4 scrollbar-none flex items-center gap-2 py-1">
        <button
          onClick={() => setActiveCategory('all')}
          className={`h-8 px-3.5 rounded-full text-xs font-bold shrink-0 transition-all flex items-center gap-1 ${
            activeCategory === 'all'
              ? 'bg-[#0b2545] text-white shadow-xs'
              : 'bg-white text-[#44474e] border border-[#eaeef2] hover:bg-[#f0f4f8]'
          }`}
          type="button"
        >
          <span>All Reminders</span>
          <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">5</span>
        </button>

        <button
          onClick={() => setActiveCategory('emergency_meds')}
          className={`h-8 px-3.5 rounded-full text-xs font-medium shrink-0 transition-all flex items-center gap-1 ${
            activeCategory === 'emergency_meds'
              ? 'bg-[#0b2545] text-white font-bold shadow-xs'
              : 'bg-white text-[#44474e] border border-[#eaeef2] hover:bg-[#f0f4f8]'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[14px]">medication</span>
          <span>Emergency Meds</span>
          <span className="px-1.5 py-0.2 rounded-full bg-[#f0f4f8] text-[#171c1f] text-[10px]">2</span>
        </button>

        <button
          onClick={() => setActiveCategory('cardiac_lab')}
          className={`h-8 px-3.5 rounded-full text-xs font-medium shrink-0 transition-all flex items-center gap-1 ${
            activeCategory === 'cardiac_lab'
              ? 'bg-[#0b2545] text-white font-bold shadow-xs'
              : 'bg-white text-[#44474e] border border-[#eaeef2] hover:bg-[#f0f4f8]'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[14px]">ecg_heart</span>
          <span>Cardiac & Lab</span>
          <span className="px-1.5 py-0.2 rounded-full bg-[#f0f4f8] text-[#171c1f] text-[10px]">1</span>
        </button>

        <button
          onClick={() => setActiveCategory('policy_renewal')}
          className={`h-8 px-3.5 rounded-full text-xs font-medium shrink-0 transition-all flex items-center gap-1 ${
            activeCategory === 'policy_renewal'
              ? 'bg-[#0b2545] text-white font-bold shadow-xs'
              : 'bg-white text-[#44474e] border border-[#eaeef2] hover:bg-[#f0f4f8]'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[14px]">shield</span>
          <span>Cashless Policy</span>
          <span className="px-1.5 py-0.2 rounded-full bg-[#f0f4f8] text-[#171c1f] text-[10px]">1</span>
        </button>
      </div>

      {/* 5. Family Member Filter Strip */}
      <div className="bg-white rounded-2xl p-3 shadow-xs border border-[#eaeef2]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-[#001026]">
            {language === 'hi' ? 'परिवार दृश्य (कुटुंब सदस्य)' : 'Family View (कुटुंब सदस्य)'}
          </span>
          <span className="text-[11px] text-[#44474e]">Tap to isolate</span>
        </div>

        <div className="flex items-center justify-between gap-1 overflow-x-auto pt-1">
          {/* All */}
          <button
            onClick={() => onSelectMember(null)}
            className={`flex flex-col items-center gap-1.5 px-2 py-1.5 rounded-xl transition-colors ${
              !selectedMemberId ? 'bg-[#f0f4f8]' : 'hover:bg-[#f0f4f8]'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-[#0b2545] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
              <span className="material-symbols-outlined text-lg">groups</span>
            </div>
            <span className="text-[11px] font-bold text-[#001026]">All (5)</span>
          </button>

          {/* Members */}
          {familyMembers.map((m) => {
            const isSelected = selectedMemberId === m.id;
            return (
              <button
                key={m.id}
                onClick={() => onSelectMember(isSelected ? null : m.id)}
                className={`flex flex-col items-center gap-1.5 px-2 py-1.5 rounded-xl transition-colors ${
                  isSelected ? 'bg-[#f0f4f8] ring-2 ring-[#006d43]' : 'hover:bg-[#f0f4f8]'
                }`}
              >
                <img src={m.avatarUrl} alt={m.name} className="w-10 h-10 rounded-full object-cover shadow-2xs" />
                <span className="text-[11px] font-medium text-[#44474e] truncate max-w-[56px]">{m.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Reminders Content Sections */}

      {/* SECTION: Insurance & Documents */}
      {(activeCategory === 'all' || activeCategory === 'policy_renewal') && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#001026] text-base">verified_user</span>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#001026]">
                Insurance & Policies (बीमा एवं नीतियां)
              </h2>
            </div>
            <span className="text-[11px] text-[#44474e]">2 Pending</span>
          </div>

          {/* Star Health Floater Card */}
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#eaeef2]">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#f0f4f8] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#006d43] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                    health_and_safety
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#001026] leading-tight">Star Health Optima Floater</h3>
                  <span className="text-[11px] text-[#44474e]">Family Floater • ₹15 Lakh Cover</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-[#f0f4f8] text-[#001026] text-[10px] font-bold">
                42 Days Left
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 bg-[#f0f4f8]/50 rounded-xl p-2.5">
              <div>
                <span className="text-[10px] text-[#44474e] block">Renewal Premium</span>
                <span className="text-xs font-bold text-[#001026]">₹21,500 / year</span>
              </div>
              <div>
                <span className="text-[10px] text-[#44474e] block">Cashless Network</span>
                <span className="text-xs font-bold text-[#006d43] flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-xs">check_circle</span> 14,000+ Hosps
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 text-[11px] text-[#006d43]">
                <span className="material-symbols-outlined text-xs">sync</span>
                <span>IRDAI DigiLocker Sync Active</span>
              </div>
              <button
                onClick={() => alert('Star Health Family Floater details: Policy #SH-88392019 covers Rajesh, Sunita, Aarav, Dadi.')}
                className="h-8 px-3 rounded-lg bg-[#0b2545] text-white text-xs font-semibold flex items-center gap-1 hover:bg-[#001026]"
              >
                <span>Review Plan</span>
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* PUC Certificate Card */}
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#eaeef2]">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#f0f4f8] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#44474e] text-lg">co2</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#001026] leading-tight">Pollution Under Control (PUC)</h3>
                  <span className="text-[11px] text-[#44474e]">Rajesh's Honda City • DL-01-AB-4920</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-[#ffddb8]/60 text-[#2a1700] text-[10px] font-bold">
                28 Days
              </span>
            </div>

            <div className="mt-2.5 flex items-center justify-between text-xs text-[#44474e]">
              <span>Parivahan Vahan Sync: Valid till 12 Dec 2024</span>
              <button
                onClick={() => setShowPumpModal(true)}
                className="text-[#001026] font-bold text-xs flex items-center gap-0.5 hover:underline"
              >
                <span className="material-symbols-outlined text-xs text-[#006d43]">near_me</span>
                Nearest Pump
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: Vaccines & Health Tests */}
      {(activeCategory === 'all' || activeCategory === 'cardiac_lab') && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#001026] text-base">vaccines</span>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#001026]">
                Cardiac & Health Labs (जांच एवं लैब)
              </h2>
            </div>
            <span className="text-[11px] text-[#44474e]">2 Scheduled</span>
          </div>

          {/* Aarav Typhoid Booster */}
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#eaeef2]">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#75f8b3]/30 flex items-center justify-center text-[#006d43] font-bold text-xs">
                  AB
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-[#001026]">Typhoid Conjugate Booster</h3>
                    <span className="px-1.5 py-0.2 rounded bg-[#f0f4f8] text-[10px] text-[#44474e]">Aarav (8y)</span>
                  </div>
                  <span className="text-xs text-[#44474e]">Due in 18 Days • Max Healthcare Saket</span>
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => alert('Event added to Google Calendar: "Aarav Typhoid Booster @ Max Saket" on 5 Dec 2024.')}
                className="flex-1 h-9 px-2.5 rounded-xl bg-[#f0f4f8] text-[#001026] text-xs font-semibold flex items-center justify-center gap-1 hover:bg-[#eaeef2]"
              >
                <Calendar className="w-3.5 h-3.5 text-[#0b2545]" />
                Add G-Calendar
              </button>
              <button
                onClick={() => alert('Appointment booking simulator: Slot confirmed at Max Healthcare Saket with Dr. Sunita Rao (Pediatrics).')}
                className="flex-1 h-9 px-2.5 rounded-xl bg-[#006d43] text-white text-xs font-bold flex items-center justify-center gap-1 shadow-xs active:scale-95 transition-transform hover:bg-[#007147]"
              >
                <span className="material-symbols-outlined text-sm">medical_information</span>
                Book Slot
              </button>
            </div>
          </div>

          {/* Dadi Diabetic Screen */}
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#eaeef2]">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#ffddb8]/60 flex items-center justify-center text-[#2a1700] font-bold text-xs">
                  DM
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-[#001026] leading-tight">HbA1c & Diabetic Retina Exam</h3>
                    <span className="px-1.5 py-0.2 rounded bg-[#f0f4f8] text-[10px] text-[#44474e]">Dadi (68y)</span>
                  </div>
                  <span className="text-xs text-[#44474e]">Due in 12 Days (Dr. Mehta Clinic)</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-[#ffddb8]/40 text-[#2a1700] text-[10px] font-bold">
                Quarterly
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-[#f0f4f8] text-xs">
              <div className="flex items-center gap-1 text-[#44474e]">
                <MapPin className="w-3.5 h-3.5 text-[#006d43]" />
                <span>Home Sample Collection Available</span>
              </div>
              <button
                onClick={() => alert('Home phlebotomist request submitted for Dadi (Kanta Devi) on 30 Nov morning.')}
                className="font-bold text-[#001026] hover:underline flex items-center gap-0.5"
              >
                Order Lab Test
                <span className="material-symbols-outlined text-xs">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: Daily Chronic Dosing */}
      {(activeCategory === 'all' || activeCategory === 'emergency_meds') && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#006d43] text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                pill
              </span>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#001026]">
                Daily Chronic Dosing (दवाइयाँ)
              </h2>
            </div>
            <span className="text-[11px] text-[#006d43] font-bold">Today</span>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#eaeef2]">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#006d43] animate-ping"></span>
                  <h3 className="text-sm font-bold text-[#001026]">Metformin 500mg (Post-dinner)</h3>
                </div>
                <p className="text-xs text-[#44474e] mt-0.5">Dadi (Kanta Devi) • 9:00 PM Daily</p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#f0f4f8] text-[#001026] text-[10px] font-bold">
                9:00 PM
              </span>
            </div>

            <div className="mt-3 p-2.5 rounded-xl bg-[#f0f4f8] flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-[#44474e]">
                <span className="material-symbols-outlined text-sm text-[#006d43]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  alarm_on
                </span>
                <span>WhatsApp Alert to Sunita & Rajesh</span>
              </div>
              <span className="text-[10px] font-semibold text-[#006d43]">Ring Ready</span>
            </div>

            {/* Interactive Dose Confirmation */}
            <div className="mt-3">
              {doseTaken ? (
                <div className="w-full py-2.5 px-3 rounded-xl bg-[#006d43]/15 text-[#006d43] flex items-center justify-center gap-1.5 text-xs font-bold animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-[#006d43]" />
                  <span>Recorded! Notification sent to Sunita & Rajesh</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <a
                    href="tel:+919876543210"
                    className="flex-1 h-10 px-3 rounded-xl bg-[#f0f4f8] text-[#001026] text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-[#eaeef2] active:scale-95 transition-transform"
                  >
                    <Phone className="w-4 h-4 text-[#006d43]" />
                    Call Dadi
                  </a>
                  <button
                    onClick={() => setDoseTaken(true)}
                    className="flex-1 h-10 px-3 rounded-xl bg-[#006d43] hover:bg-[#007147] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-transform"
                  >
                    <Check className="w-4 h-4" />
                    Mark Taken
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom CTA: Add Custom Reminder */}
      <div className="pt-2">
        <button
          onClick={() => setShowCustomModal(true)}
          className="w-full h-12 rounded-2xl bg-[#0b2545] hover:bg-[#001026] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-transform"
        >
          <span className="material-symbols-outlined text-xl">add_circle</span>
          <span>{language === 'hi' ? 'कस्टम फैमिली रिमाइंडर सेट करें' : 'Set Custom Family Reminder'}</span>
        </button>
      </div>

      {/* DigiLocker / ABHA Trust Footer Notice */}
      <div className="py-3 text-center">
        <div className="inline-flex items-center gap-1.5 text-[11px] text-[#44474e]/80">
          <span className="material-symbols-outlined text-xs text-[#006d43]" style={{ fontVariationSettings: "'FILL' 1" }}>
            lock
          </span>
          <span>Encrypted & Auto-synced via DigiLocker • Parivahan • ABHA</span>
        </div>
      </div>

      {/* Modal: Renew Car Insurance Online */}
      {showRenewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-2xl border border-[#eaeef2] animate-in fade-in">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-[#001026]">HDFC ERGO Instant Renewal</h3>
              <button onClick={() => setShowRenewModal(false)} className="p-1 text-[#74777f]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3 bg-[#f0f4f8] rounded-xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#44474e]">Vehicle</span>
                <span className="font-bold text-[#001026]">Honda City ZX (DL-01-AB-4920)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#44474e]">IDV Cover</span>
                <span className="font-bold text-[#001026]">₹6,80,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#44474e]">NCB Discount</span>
                <span className="font-bold text-[#006d43]">35% Applied</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#c4c6cf]">
                <span className="font-bold text-[#001026]">Total Payable</span>
                <span className="font-extrabold text-base text-[#001026]">₹8,420</span>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  alert('Payment simulated! HDFC ERGO Policy renewed until 18 Nov 2025. Policy document automatically updated in vault.');
                  setShowRenewModal(false);
                }}
                className="w-full py-2.5 bg-[#006d43] text-white text-xs font-bold rounded-xl hover:bg-[#007147]"
              >
                Pay via UPI / Card (₹8,420)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Nearest PUC Pump */}
      {showPumpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-2xl border border-[#eaeef2] animate-in fade-in">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-[#001026]">Nearest Authorized PUC Stations</h3>
              <button onClick={() => setShowPumpModal(false)} className="p-1 text-[#74777f]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-[#f0f4f8] rounded-xl flex justify-between items-center">
                <div>
                  <p className="font-bold text-[#001026]">Indian Oil Petrol Pump</p>
                  <p className="text-[#44474e]">Sector 6, R.K. Puram • 800m away</p>
                </div>
                <span className="text-[#006d43] font-bold text-[11px]">Open 24/7</span>
              </div>
              <div className="p-2.5 bg-[#f0f4f8] rounded-xl flex justify-between items-center">
                <div>
                  <p className="font-bold text-[#001026]">Bharat Petroleum Station</p>
                  <p className="text-[#44474e]">Ring Road Moti Bagh • 1.4 km</p>
                </div>
                <span className="text-[#006d43] font-bold text-[11px]">Open</span>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={() => setShowPumpModal(false)}
                className="w-full py-2 bg-[#001026] text-white text-xs font-bold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Set Custom Family Reminder */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-2xl border border-[#eaeef2] animate-in fade-in">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-[#001026]">Set Custom Family Reminder</h3>
              <button onClick={() => setShowCustomModal(false)} className="p-1 text-[#74777f]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCustomSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-[#44474e] block mb-1">Reminder Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Life Certificate submission for Dadi"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#c4c6cf] focus:outline-none focus:border-[#006d43]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-[#44474e] block mb-1">Category</label>
                  <select
                    value={customCategory}
                    onChange={(e: any) => setCustomCategory(e.target.value)}
                    className="w-full px-2 py-2 rounded-xl border border-[#c4c6cf] focus:outline-none focus:border-[#006d43]"
                  >
                    <option value="policies">Policies & Docs</option>
                    <option value="meds">Daily Meds</option>
                    <option value="vaccines">Vaccines & Tests</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-[#44474e] block mb-1">Family Member</label>
                  <select
                    value={customMember}
                    onChange={(e) => setCustomMember(e.target.value)}
                    className="w-full px-2 py-2 rounded-xl border border-[#c4c6cf] focus:outline-none focus:border-[#006d43]"
                  >
                    {familyMembers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#44474e] block mb-1">Due Date</label>
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#c4c6cf] focus:outline-none focus:border-[#006d43]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-3 py-2 bg-[#f0f4f8] text-[#44474e] font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#001026] text-white font-bold rounded-xl hover:bg-[#0b2545]"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
