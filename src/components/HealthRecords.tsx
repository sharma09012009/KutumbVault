import React, { useState } from 'react';
import { HealthRecord, FamilyMember, Language } from '../types';
import { 
  Heart, 
  Activity, 
  FileCheck, 
  Plus, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Pill,
  Syringe,
  ClipboardList,
  AlertTriangle,
  Hospital,
  ShieldCheck
} from 'lucide-react';

interface HealthRecordsProps {
  healthRecords: HealthRecord[];
  familyMembers: FamilyMember[];
  selectedMemberId: string | null;
  onSelectMember: (memberId: string | null) => void;
  language: Language;
  onOpenScanner: () => void;
  onAddRecord: (record: HealthRecord) => void;
}

export const HealthRecords: React.FC<HealthRecordsProps> = ({
  healthRecords,
  familyMembers,
  selectedMemberId,
  onSelectMember,
  language,
  onOpenScanner,
  onAddRecord,
}) => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newMemberId, setNewMemberId] = useState('dadi');
  const [newType, setNewType] = useState<'Prescription' | 'Lab Report' | 'Vaccine' | 'Vital' | 'Discharge'>('Vital');
  const [newDoctor, setNewDoctor] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [metricLabel, setMetricLabel] = useState('SpO2 / Pulse');
  const [metricValue, setMetricValue] = useState('98% • 76 bpm');
  const [metricStatus, setMetricStatus] = useState<'normal' | 'attention' | 'good'>('good');

  const filteredRecords = healthRecords.filter((rec) => {
    const matchesType = 
      selectedType === 'all' || 
      rec.type.toLowerCase().includes(selectedType.toLowerCase());
    const matchesMember = !selectedMemberId || rec.memberId === selectedMemberId;
    return matchesType && matchesMember;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const member = familyMembers.find(m => m.id === newMemberId);
    
    onAddRecord({
      id: `health-${Date.now()}`,
      title: newTitle.trim(),
      titleHi: newTitle.trim(),
      memberId: newMemberId,
      memberName: member?.name || 'Family Member',
      type: newType,
      date: 'Today, Just now',
      doctorHospital: newDoctor.trim() || 'Omron Digital Enclave / ER Triage',
      abhaLinked: true,
      notes: newNotes.trim() || 'Record saved to encrypted emergency health vault.',
      metric: metricLabel && metricValue ? {
        label: metricLabel,
        value: metricValue,
        status: metricStatus,
      } : undefined,
      tags: ['Encrypted', 'ABHA Synced', newType, 'Emergency Priority'],
    });

    setNewTitle('');
    setNewDoctor('');
    setNewNotes('');
    setShowAddModal(false);
  };

  return (
    <div className="flex flex-col w-full space-y-4 max-w-2xl mx-auto pb-6 animate-in fade-in duration-200">
      {/* 1. ABHA & Digital Health Card Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#001026] via-[#0b2545] to-[#006d43] p-4 text-white shadow-md">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#75f8b3]/20 text-[#78fbb6] text-[11px] font-semibold mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Ayushman Bharat Digital Mission (ABHA) Sandbox</span>
            </div>
            <h1 className="text-lg font-black text-white leading-tight">
              {language === 'hi' ? 'आपातकालीन वाइटल्स एवं मेडिकल रिकॉर्ड' : 'Emergency Vitals & Clinical History'}
            </h1>
            <p className="text-xs text-[#b1c7f0] mt-0.5">
              ABHA ID: <span className="font-mono text-white font-bold">91-8274-1923-8821</span> • 4 Patient Profiles
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="shrink-0 h-9 px-3 rounded-xl bg-[#ba1a1a] hover:bg-[#93000a] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform"
            type="button"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'hi' ? 'वाइटल्स दर्ज करें' : 'Log Vitals'}</span>
          </button>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 rounded-xl bg-white/10 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#78fbb6] text-lg">check_circle</span>
            <div>
              <span className="text-[10px] text-[#b1c7f0] block leading-none">ABHA HIE-CM Gateway</span>
              <span className="font-bold text-white text-[11px]">Synced Active</span>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-white/10 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#78fbb6] text-lg">medical_services</span>
            <div>
              <span className="text-[10px] text-[#b1c7f0] block leading-none">Emergency Cashless</span>
              <span className="font-bold text-white text-[11px]">14,000+ Hospitals</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Vitals Timeline Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        <div className="bg-white rounded-2xl p-3 shadow-xs border border-[#eaeef2]">
          <div className="flex items-center justify-between text-[#44474e]">
            <span className="text-[11px] font-bold">Dadi (Stent Pulse)</span>
            <Activity className="w-4 h-4 text-[#ba1a1a]" />
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-lg font-black text-[#001026]">74 bpm</span>
            <span className="text-[10px] text-[#006d43] font-bold bg-[#75f8b3]/20 px-1.5 py-0.2 rounded">
              Regular
            </span>
          </div>
          <span className="text-[10px] text-[#74777f] block mt-0.5">SpO2: 98% • Room Air</span>
        </div>

        <div className="bg-white rounded-2xl p-3 shadow-xs border border-[#eaeef2]">
          <div className="flex items-center justify-between text-[#44474e]">
            <span className="text-[11px] font-bold">Dadi (Blood Pressure)</span>
            <Heart className="w-4 h-4 text-[#006d43]" />
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-lg font-black text-[#001026]">132/84</span>
            <span className="text-[10px] text-[#006d43] font-bold bg-[#75f8b3]/20 px-1.5 py-0.2 rounded">
              Controlled
            </span>
          </div>
          <span className="text-[10px] text-[#74777f] block mt-0.5">Sorbitrate 5mg SOS ready</span>
        </div>

        <div className="bg-white rounded-2xl p-3 shadow-xs border border-[#eaeef2] col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-[#44474e]">
            <span className="text-[11px] font-bold">Aarav (Asthma PEFR)</span>
            <AlertCircle className="w-4 h-4 text-[#006d43]" />
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-lg font-black text-[#006d43]">240 L/m</span>
            <span className="text-[10px] text-[#006d43] font-bold bg-[#75f8b3]/20 px-1.5 py-0.2 rounded">
              Green Zone
            </span>
          </div>
          <span className="text-[10px] text-[#74777f] block mt-0.5">Asthalin inhaler on standby</span>
        </div>
      </div>

      {/* 3. Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'All Records', icon: ClipboardList },
          { id: 'vital', label: 'Cardiac & Vitals', icon: Heart },
          { id: 'discharge', label: 'Discharges', icon: Hospital },
          { id: 'lab report', label: 'Lab Reports', icon: Activity },
          { id: 'prescription', label: 'Emergency Rx', icon: Pill },
        ].map((tab) => {
          const isActive = selectedType === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id)}
              className={`h-8 px-3 rounded-full text-xs font-medium flex items-center gap-1.5 shrink-0 transition-all ${
                isActive
                  ? 'bg-[#001026] text-white font-bold shadow-xs'
                  : 'bg-white text-[#44474e] border border-[#eaeef2] hover:bg-[#f0f4f8]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. Family Member Switcher */}
      <div className="bg-white rounded-2xl p-2.5 shadow-xs border border-[#eaeef2] flex items-center justify-between gap-1 overflow-x-auto">
        <button
          onClick={() => onSelectMember(null)}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
            !selectedMemberId ? 'bg-[#001026] text-white' : 'bg-[#f0f4f8] text-[#44474e]'
          }`}
        >
          All Members ({healthRecords.length})
        </button>
        {familyMembers.map((m) => {
          const isSelected = selectedMemberId === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onSelectMember(isSelected ? null : m.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                isSelected ? 'bg-[#ba1a1a] text-white' : 'bg-[#f0f4f8] text-[#44474e]'
              }`}
            >
              <img src={m.avatarUrl} alt={m.name} className="w-5 h-5 rounded-full object-cover" />
              <span>{m.name}</span>
              <span className="text-[10px] opacity-75 font-mono">({m.bloodGroup})</span>
            </button>
          );
        })}
      </div>

      {/* 5. Health Records List */}
      <div className="space-y-3">
        {filteredRecords.map((rec) => (
          <div
            key={rec.id}
            onClick={() => setSelectedRecord(rec)}
            className="bg-white rounded-2xl p-4 shadow-xs border border-[#eaeef2] hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#f0f4f8] flex items-center justify-center shrink-0 group-hover:bg-[#d5e3ff] transition-colors">
                  {rec.type === 'Vital' ? (
                    <Heart className="w-5 h-5 text-[#ba1a1a]" />
                  ) : rec.type === 'Discharge' ? (
                    <Hospital className="w-5 h-5 text-[#006d43]" />
                  ) : rec.type === 'Lab Report' ? (
                    <Activity className="w-5 h-5 text-[#0b2545]" />
                  ) : (
                    <Pill className="w-5 h-5 text-[#c47d00]" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-[#001026] truncate">
                      {language === 'hi' ? rec.titleHi || rec.title : rec.title}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-[#f0f4f8] text-[10px] font-semibold text-[#44474e]">
                      {rec.memberName}
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#ffdad6] text-[#ba1a1a] uppercase">
                      {rec.type}
                    </span>
                  </div>

                  <p className="text-xs text-[#44474e] mt-0.5">{rec.doctorHospital}</p>
                  <p className="text-[11px] text-[#74777f] mt-1 line-clamp-2">{rec.notes}</p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[11px] font-medium text-[#74777f] block">{rec.date}</span>
                {rec.abhaLinked && (
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-[#006d43] bg-[#75f8b3]/20 px-1.5 py-0.2 rounded-full mt-1">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    ABHA
                  </span>
                )}
              </div>
            </div>

            {/* Metric pill if available */}
            {rec.metric && (
              <div className="mt-3 p-2 rounded-xl bg-[#f0f4f8] flex items-center justify-between text-xs">
                <span className="text-[#44474e] font-medium">{rec.metric.label}:</span>
                <span className={`font-black ${
                  rec.metric.status === 'attention' ? 'text-[#ba1a1a]' : 'text-[#006d43]'
                }`}>
                  {rec.metric.value}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Record Inspection Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-[#eaeef2] overflow-hidden animate-in fade-in">
            <div className="p-4 bg-[#0b2545] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[#78fbb6]" />
                <h3 className="font-bold text-sm truncate">{selectedRecord.title}</h3>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1 text-white/80 hover:bg-white/10 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-[#f0f4f8]">
                <span className="text-[#44474e]">Patient Member</span>
                <span className="font-bold text-[#171c1f]">{selectedRecord.memberName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#f0f4f8]">
                <span className="text-[#44474e]">Record Category</span>
                <span className="font-bold text-[#ba1a1a] uppercase">{selectedRecord.type}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#f0f4f8]">
                <span className="text-[#44474e]">Healthcare Provider / Monitor</span>
                <span className="font-bold text-[#171c1f]">{selectedRecord.doctorHospital}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#f0f4f8]">
                <span className="text-[#44474e]">Date of Record</span>
                <span className="font-bold text-[#171c1f]">{selectedRecord.date}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#f0f4f8]">
                <span className="text-[#44474e]">National ABHA Record</span>
                <span className="text-[#006d43] font-bold">Verified & Linked</span>
              </div>

              {selectedRecord.metric && (
                <div className="p-2.5 rounded-xl bg-[#f0f4f8] flex items-center justify-between">
                  <span className="text-[#44474e] font-semibold">{selectedRecord.metric.label}:</span>
                  <span className="font-black text-sm text-[#001026]">{selectedRecord.metric.value}</span>
                </div>
              )}

              <div className="pt-2">
                <span className="font-bold text-[#171c1f] block mb-1">Clinical Notes & ER Protocol</span>
                <p className="text-xs text-[#44474e] bg-[#f0f4f8] p-3 rounded-xl leading-relaxed">
                  {selectedRecord.notes}
                </p>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="px-4 py-2 rounded-xl bg-[#001026] text-white font-bold hover:bg-[#0b2545]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-[#eaeef2] overflow-hidden animate-in fade-in">
            <div className="p-4 bg-gradient-to-r from-[#001026] to-[#0b2545] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#ba1a1a]" />
                <h3 className="font-bold text-sm">Log Emergency Medical Reading</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-white/80 hover:bg-white/10 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-[#44474e] font-semibold mb-1">Family Member</label>
                <select
                  value={newMemberId}
                  onChange={(e) => setNewMemberId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#eaeef2] bg-[#f8fafc] text-[#001026] font-medium"
                >
                  {familyMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.bloodGroup} • {m.relation})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#44474e] font-semibold mb-1">Record Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Vital', 'Discharge', 'Prescription', 'Lab Report', 'Vaccine'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewType(t)}
                      className={`py-1.5 rounded-lg font-bold text-center border ${
                        newType === t
                          ? 'bg-[#001026] text-white border-[#001026]'
                          : 'bg-[#f8fafc] text-[#44474e] border-[#eaeef2]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[#44474e] font-semibold mb-1">Title / Test Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Resting BP & Pulse, Cardiac Stent Follow-up"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#eaeef2] bg-[#f8fafc] text-[#001026]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#44474e] font-semibold mb-1">Metric (Label)</label>
                  <input
                    type="text"
                    placeholder="e.g. BP, SpO2, Pulse"
                    value={metricLabel}
                    onChange={(e) => setMetricLabel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#eaeef2] bg-[#f8fafc]"
                  />
                </div>
                <div>
                  <label className="block text-[#44474e] font-semibold mb-1">Value</label>
                  <input
                    type="text"
                    placeholder="e.g. 130/85, 98%"
                    value={metricValue}
                    onChange={(e) => setMetricValue(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#eaeef2] bg-[#f8fafc]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#44474e] font-semibold mb-1">Doctor / Diagnostic Facility</label>
                <input
                  type="text"
                  placeholder="e.g. Max Hospital ER, Apollo Cath Lab"
                  value={newDoctor}
                  onChange={(e) => setNewDoctor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#eaeef2] bg-[#f8fafc]"
                />
              </div>

              <div>
                <label className="block text-[#44474e] font-semibold mb-1">Clinical Notes & Rescue Instructions</label>
                <textarea
                  rows={2}
                  placeholder="Emergency warnings, contraindications, or dosage..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#eaeef2] bg-[#f8fafc]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#f0f4f8] text-[#44474e] font-semibold hover:bg-[#e5e9ed]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#ba1a1a] text-white font-bold hover:bg-[#93000a]"
                >
                  Save to Health Enclave
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
