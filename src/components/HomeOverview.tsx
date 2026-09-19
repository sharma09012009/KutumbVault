import React, { useState } from 'react';
import { FamilyMember, TabView, Language, AuditLog } from '../types';

interface HomeOverviewProps {
  language: Language;
  familyMembers: FamilyMember[];
  selectedMemberId: string | null;
  onSelectMember: (memberId: string | null) => void;
  onSelectTab: (tab: TabView) => void;
  onOpenScanner: () => void;
  onOpenAssistant: () => void;
  auditLogs: AuditLog[];
  onAddMember: (newMember: Partial<FamilyMember>) => void;
}

export const HomeOverview: React.FC<HomeOverviewProps> = ({
  language,
  familyMembers,
  selectedMemberId,
  onSelectMember,
  onSelectTab,
  onOpenScanner,
  onOpenAssistant,
  auditLogs,
  onAddMember,
}) => {
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRelation, setNewMemberRelation] = useState('Daughter');
  const [newMemberAge, setNewMemberAge] = useState('');
  const [newMemberBlood, setNewMemberBlood] = useState('O+');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    onAddMember({
      name: newMemberName.trim(),
      relation: newMemberRelation,
      relationHi: newMemberRelation,
      age: parseInt(newMemberAge) || 12,
      bloodGroup: newMemberBlood,
      role: 'Supervised',
      roleHi: 'निगरानी में',
      docCount: 0,
      healthRecordsCount: 0,
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXbZiR2GFpfb6YVfxAhAcUS0CuUzP9vTnRjxjqy4HcNmi-NiYgk8lMThz1INsT448Inwsz4rASldw1Ntvz1TyBR4GbmrRFh5KDuWqvCjMwYdcESx_IDSRKC-tsxhKrtI8DFfGtehqlXwd-W8RCz12j2V6knAtyqgWIIZBR56-6vmimSMZAz-PD-wrZGylKl3sS6tgkEsJIKN1NSPzKGJriBBXqfMHR0HmjhYTWCw3Qvkon9D1p8lYcOQ',
    });
    setNewMemberName('');
    setNewMemberAge('');
    setShowAddMemberModal(false);
  };

  return (
    <div className="flex flex-col w-full space-y-4 max-w-2xl mx-auto pb-6 animate-in fade-in duration-200">
      {/* 1. Hero Card (Zero-Knowledge & Encryption Status) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0b2545] via-[#001026] to-[#0b2545] p-4 text-white shadow-md">
        <div className="relative z-10 flex items-start justify-between gap-3">
          <div className="flex flex-col min-w-0">
            <div className="inline-flex items-center gap-1.5 self-start px-2.5 py-0.5 rounded-full bg-[#006d43]/30 text-[#78fbb6] text-[11px] font-medium mb-1.5 border border-[#78fbb6]/20">
              <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified_user
              </span>
              <span>256-bit Encrypted • Offline Ready</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white truncate">
              {language === 'hi' ? 'नमस्ते, शर्मा परिवार' : 'Namaste, Sharma Family'}
            </h1>
            <p className="text-xs text-[#b1c7f0] mt-0.5">
              {language === 'hi'
                ? '4 सदस्य सुरक्षित • सभी महत्वपूर्ण दस्तावेज सिंक'
                : '4 members safe • All vital records synchronized'}
            </p>
          </div>
          
          <button
            id="hero-security-vault-btn"
            aria-label="Vault Security Audit"
            onClick={() => onSelectTab('security')}
            className="shrink-0 p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center text-white border border-white/10 active:scale-95"
            type="button"
          >
            <span className="material-symbols-outlined text-xl text-[#78fbb6]">shield_lock</span>
          </button>
        </div>

        <div className="mt-3.5 pt-2 bg-white/5 rounded-xl p-2.5 flex items-center justify-between border border-white/5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#78fbb6] text-lg">cloud_done</span>
            <span className="text-[11px] font-medium text-white/90">
              {language === 'hi' ? 'डिजिलॉकर और आभा आईडी लिंक सक्रिय' : 'DigiLocker & ABHA linked'}
            </span>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-[#78fbb6] font-bold bg-[#006d43]/50 px-2 py-0.5 rounded-md">
            Active
          </span>
        </div>
      </div>

      {/* 2. Family Profiles Carousel */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-baseline gap-1.5">
            <h2 className="text-sm font-bold text-[#171c1f]">
              {language === 'hi' ? 'परिवार के सदस्य' : 'Family Profiles'}
            </h2>
            <span className="text-[11px] text-[#44474e]">
              {selectedMemberId ? `(Filtered)` : `(4 members)`}
            </span>
          </div>
          {selectedMemberId ? (
            <button
              onClick={() => onSelectMember(null)}
              className="text-xs font-semibold text-[#006d43] hover:underline"
              type="button"
            >
              {language === 'hi' ? 'सभी दिखाएं' : 'Show All'}
            </button>
          ) : (
            <button
              onClick={() => onSelectTab('security')}
              className="text-xs font-semibold text-[#006d43] hover:underline"
              type="button"
            >
              {language === 'hi' ? 'अनुमतियाँ' : 'Manage Roles'}
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-1.5 -mx-4 px-4 scrollbar-none">
          {familyMembers.map((member) => {
            const isSelected = selectedMemberId === member.id;
            return (
              <div
                key={member.id}
                id={`member-profile-${member.id}`}
                onClick={() => onSelectMember(isSelected ? null : member.id)}
                className="flex flex-col items-center shrink-0 cursor-pointer group"
              >
                <div
                  className={`relative w-14 h-14 rounded-full p-0.5 transition-all shadow-sm ${
                    isSelected
                      ? 'ring-3 ring-[#006d43] scale-105 bg-[#75f8b3]'
                      : 'bg-white hover:scale-105 ring-1 ring-[#eaeef2]'
                  }`}
                >
                  <img
                    alt={member.name}
                    className="w-full h-full rounded-full object-cover"
                    src={member.avatarUrl}
                  />
                  {member.isUser && (
                    <span className="absolute -bottom-1 -right-0.5 bg-[#006d43] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full ring-2 ring-white">
                      YOU
                    </span>
                  )}
                  {member.id === 'dadi' && (
                    <span className="absolute -bottom-1 -right-0.5 bg-[#ba1a1a] text-white text-[9px] font-bold px-1 rounded-full ring-2 ring-white">
                      B+
                    </span>
                  )}
                  {member.id === 'sunita' && (
                    <span className="absolute -bottom-1 -right-0.5 bg-[#0b2545] text-white text-[8px] font-bold px-1 rounded-full ring-2 ring-white">
                      A+
                    </span>
                  )}
                </div>
                <span className={`text-xs font-bold mt-1.5 leading-tight ${
                  isSelected ? 'text-[#006d43]' : 'text-[#171c1f]'
                }`}>
                  {member.name}
                </span>
                <span className="text-[10px] text-[#44474e]">
                  {member.docCount} docs
                </span>
              </div>
            );
          })}

          {/* Add Member Button */}
          <div 
            onClick={() => setShowAddMemberModal(true)}
            className="flex flex-col items-center shrink-0 cursor-pointer group"
          >
            <div className="w-14 h-14 rounded-full bg-[#e5e9ed] flex flex-col items-center justify-center text-[#001026] group-hover:bg-[#dfe3e7] transition-colors shadow-xs">
              <span className="material-symbols-outlined text-2xl">person_add</span>
            </div>
            <span className="text-xs font-semibold text-[#001026] mt-1.5 leading-tight">+ Add</span>
            <span className="text-[10px] text-[#44474e]">Member</span>
          </div>
        </div>
      </div>

      {/* 3. AI Smart Scanner Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#001026] via-[#0b2545] to-[#495f82] p-3.5 text-white shadow-sm overflow-hidden border border-[#0b2545]">
        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="flex items-start gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#006d43] flex items-center justify-center shrink-0 text-white shadow-xs">
              <span className="material-symbols-outlined text-xl">document_scanner</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white">
                  {language === 'hi' ? 'AI स्मार्ट स्कैनर' : 'AI Smart Scanner'}
                </span>
                <span className="px-1.5 py-0.2 rounded bg-[#75f8b3] text-[#007147] text-[9px] font-extrabold uppercase">
                  Fast OCR
                </span>
              </div>
              <p className="text-[11px] text-[#b1c7f0] leading-snug truncate">
                {language === 'hi'
                  ? 'आधार, बीमा, आरसी व पर्चियां तुरंत स्कैन करें'
                  : 'Auto-classify Aadhaar, Insurance & Prescriptions'}
              </p>
            </div>
          </div>
          <button
            id="home-scan-doc-btn"
            onClick={onOpenScanner}
            className="shrink-0 h-9 px-3.5 rounded-xl bg-[#006d43] hover:bg-[#007147] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-base">photo_camera</span>
            <span>{language === 'hi' ? 'स्कैन' : 'Scan'}</span>
          </button>
        </div>
      </div>

      {/* 4. Vault Modules 2x2 Grid */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-[#171c1f]">
            {language === 'hi' ? 'वॉल्ट अनुभाग' : 'Vault Modules'}
          </h2>
          <span className="text-[11px] text-[#44474e]">
            {language === 'hi' ? 'क्विक एक्सेस' : 'Quick Access'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Digital Vault */}
          <div
            id="home-module-docs"
            onClick={() => onSelectTab('records')}
            className="bg-white rounded-2xl p-3.5 shadow-xs border border-[#eaeef2] flex flex-col justify-between hover:shadow-md hover:border-[#75f8b3] transition-all cursor-pointer group"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#75f8b3]/30 flex items-center justify-center text-[#007147]">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    folder_special
                  </span>
                </div>
                <span className="text-[10px] font-bold text-[#006d43] bg-[#75f8b3]/20 px-2 py-0.5 rounded-full">
                  Encrypted
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#171c1f] mt-2.5">
                {language === 'hi' ? 'डिजिटल वॉल्ट' : 'Digital Vault'}
              </h3>
              <p className="text-[11px] text-[#44474e] leading-tight mt-0.5">
                {language === 'hi' ? 'आधार, पैन, रजिस्ट्री एवं बीमा' : 'Aadhaar, PAN, Property & Policies'}
              </p>
            </div>
            <div className="flex items-center justify-between mt-3 pt-2.5 bg-[#f0f4f8] -mx-3.5 -mb-3.5 px-3.5 py-2 rounded-b-2xl">
              <span className="text-xs font-bold text-[#001026]">24 Documents</span>
              <span className="material-symbols-outlined text-sm text-[#44474e] group-hover:translate-x-0.5 transition-transform">
                arrow_forward_ios
              </span>
            </div>
          </div>

          {/* Health Records */}
          <div
            id="home-module-health"
            onClick={() => onSelectTab('records')}
            className="bg-white rounded-2xl p-3.5 shadow-xs border border-[#eaeef2] flex flex-col justify-between hover:shadow-md hover:border-[#b1c7f0] transition-all cursor-pointer group"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#d5e3ff] flex items-center justify-center text-[#0b2545]">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    medical_information
                  </span>
                </div>
                <span className="text-[10px] font-bold text-[#0b2545] bg-[#b1c7f0]/40 px-2 py-0.5 rounded-full">
                  ABHA Ready
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#171c1f] mt-2.5">
                {language === 'hi' ? 'स्वास्थ्य रिकॉर्ड' : 'Health Records'}
              </h3>
              <p className="text-[11px] text-[#44474e] leading-tight mt-0.5">
                {language === 'hi' ? 'वाइटल्स, लैब रिपोर्ट, दवाएं व टीके' : 'Vitals, Lab tests, Rx & Vaccines'}
              </p>
            </div>
            <div className="flex items-center justify-between mt-3 pt-2.5 bg-[#f0f4f8] -mx-3.5 -mb-3.5 px-3.5 py-2 rounded-b-2xl">
              <span className="text-xs font-bold text-[#001026]">18 Reports</span>
              <span className="material-symbols-outlined text-sm text-[#44474e] group-hover:translate-x-0.5 transition-transform">
                arrow_forward_ios
              </span>
            </div>
          </div>

          {/* Emergency SOS */}
          <div
            id="home-module-sos"
            onClick={() => onSelectTab('sos')}
            className="bg-[#ffdad6]/40 rounded-2xl p-3.5 shadow-xs border border-[#ffdad6] flex flex-col justify-between hover:shadow-md transition-all cursor-pointer group"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#ba1a1a] flex items-center justify-center text-white shadow-xs">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    emergency_home
                  </span>
                </div>
                <span className="text-[10px] font-extrabold text-[#93000a] bg-[#ffdad6] px-2 py-0.5 rounded-full uppercase">
                  1-Tap Care
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#171c1f] mt-2.5">
                {language === 'hi' ? 'आपातकालीन SOS' : 'Emergency SOS'}
              </h3>
              <p className="text-[11px] text-[#44474e] leading-tight mt-0.5">
                {language === 'hi' ? 'ब्लड ग्रुप, एलर्जी व इमरजेंसी संपर्क' : 'Blood groups, ICU allergies & ICE'}
              </p>
            </div>
            <div className="flex items-center justify-between mt-3 pt-2.5 bg-[#ffdad6]/70 -mx-3.5 -mb-3.5 px-3.5 py-2 rounded-b-2xl">
              <span className="text-xs font-bold text-[#93000a]">Instant Sharing</span>
              <span className="material-symbols-outlined text-sm text-[#93000a]">
                contact_phone
              </span>
            </div>
          </div>

          {/* Smart Reminders */}
          <div
            id="home-module-reminders"
            onClick={() => onSelectTab('records')}
            className="bg-white rounded-2xl p-3.5 shadow-xs border border-[#eaeef2] flex flex-col justify-between hover:shadow-md hover:border-[#ffddb8] transition-all cursor-pointer group"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#ffddb8] flex items-center justify-center text-[#372000]">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    notifications_active
                  </span>
                </div>
                <span className="text-[10px] font-bold text-[#c47d00] bg-[#ffb95f]/30 px-2 py-0.5 rounded-full">
                  Due Soon
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#171c1f] mt-2.5">
                {language === 'hi' ? 'स्मार्ट रिमाइंडर' : 'Smart Reminders'}
              </h3>
              <p className="text-[11px] text-[#44474e] leading-tight mt-0.5">
                {language === 'hi' ? 'बीमा देय तिथि एवं टीकाकरण' : 'Insurance dues & immunization'}
              </p>
            </div>
            <div className="flex items-center justify-between mt-3 pt-2.5 bg-[#f0f4f8] -mx-3.5 -mb-3.5 px-3.5 py-2 rounded-b-2xl">
              <span className="text-xs font-bold text-[#372000]">3 Pending</span>
              <span className="material-symbols-outlined text-sm text-[#44474e] group-hover:translate-x-0.5 transition-transform">
                arrow_forward_ios
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Smart Voice Assistant Quick Bar */}
      <div 
        id="home-voice-bar"
        onClick={onOpenAssistant}
        className="bg-white rounded-2xl p-3 shadow-xs border border-[#eaeef2] flex items-center justify-between gap-2 cursor-pointer hover:border-[#006d43] transition-colors"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-full bg-[#f0f4f8] flex items-center justify-center shrink-0 text-[#001026]">
            <span className="material-symbols-outlined text-xl">mic</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-[#171c1f]">
              {language === 'hi' ? 'स्मार्ट वॉइस सहायक' : 'Smart Voice Assistant'}
            </span>
            <span className="text-[11px] text-[#44474e] truncate">
              "Dadi ki prescription dikhao" or "Find Aarav PAN"
            </span>
          </div>
        </div>
        <button
          className="h-8 px-3 rounded-full bg-[#e5e9ed] text-[#001026] text-xs font-bold shrink-0 hover:bg-[#dfe3e7] transition-colors flex items-center gap-1"
          type="button"
        >
          <span>{language === 'hi' ? 'बोलें' : 'Ask AI'}</span>
          <span className="material-symbols-outlined text-sm">graphic_eq</span>
        </button>
      </div>

      {/* 6. Recent Vault Activity */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-[#171c1f]">
            {language === 'hi' ? 'हालिया गतिविधियां' : 'Recent Vault Activity'}
          </h2>
          <button
            onClick={() => onSelectTab('security')}
            className="text-xs font-semibold text-[#44474e] hover:text-[#001026]"
            type="button"
          >
            {language === 'hi' ? 'सुरक्षा लॉग' : 'Security Log'}
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xs border border-[#eaeef2] overflow-hidden flex flex-col divide-y divide-[#f0f4f8]">
          {auditLogs.slice(0, 3).map((log) => (
            <div key={log.id} className="flex items-center gap-3 p-3 hover:bg-[#f0f4f8] transition-colors">
              <div className="w-9 h-9 rounded-xl bg-[#75f8b3]/30 flex items-center justify-center shrink-0 text-[#006d43]">
                <span className="material-symbols-outlined text-xl">
                  {log.icon === 'badge' ? 'verified' : log.icon === 'pill' ? 'pill' : 'sync'}
                </span>
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#171c1f] truncate">
                    {language === 'hi' ? log.actionHi : log.action}
                  </span>
                  <span className="text-[10px] text-[#44474e] shrink-0">{log.timeAgo}</span>
                </div>
                <p className="text-[11px] text-[#44474e] truncate mt-0.5">
                  {log.details}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-2xl border border-[#eaeef2] animate-in fade-in">
            <h3 className="font-bold text-base text-[#001026] mb-3">
              {language === 'hi' ? 'नया परिवार सदस्य जोड़ें' : 'Add Family Member'}
            </h3>
            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#44474e] block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#c4c6cf] focus:outline-none focus:border-[#006d43]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-[#44474e] block mb-1">
                    Relation
                  </label>
                  <select
                    value={newMemberRelation}
                    onChange={(e) => setNewMemberRelation(e.target.value)}
                    className="w-full px-2 py-2 text-xs rounded-xl border border-[#c4c6cf] focus:outline-none focus:border-[#006d43]"
                  >
                    <option value="Daughter">Daughter</option>
                    <option value="Son">Son</option>
                    <option value="Grandfather">Grandfather (Dadaji)</option>
                    <option value="Brother">Brother</option>
                    <option value="Sister">Sister</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#44474e] block mb-1">
                    Blood Group
                  </label>
                  <select
                    value={newMemberBlood}
                    onChange={(e) => setNewMemberBlood(e.target.value)}
                    className="w-full px-2 py-2 text-xs rounded-xl border border-[#c4c6cf] focus:outline-none focus:border-[#006d43]"
                  >
                    <option value="O+">O+</option>
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="AB+">AB+</option>
                    <option value="O-">O-</option>
                    <option value="A-">A-</option>
                    <option value="B-">B-</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#44474e] block mb-1">
                  Age (Years)
                </label>
                <input
                  type="number"
                  placeholder="Age"
                  value={newMemberAge}
                  onChange={(e) => setNewMemberAge(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#c4c6cf] focus:outline-none focus:border-[#006d43]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="px-3 py-2 text-xs font-semibold rounded-xl bg-[#f0f4f8] text-[#44474e]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-[#001026] text-white hover:bg-[#0b2545]"
                >
                  Add to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
