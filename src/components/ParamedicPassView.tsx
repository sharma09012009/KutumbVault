import React, { useState } from 'react';
import { FamilyMember, Language } from '../types';
import { 
  AlertTriangle, 
  Heart, 
  QrCode, 
  PhoneCall, 
  ShieldAlert, 
  Pill, 
  FileText, 
  Check, 
  Share2, 
  Printer, 
  Activity, 
  CreditCard,
  UserCheck
} from 'lucide-react';

interface ParamedicPassViewProps {
  familyMembers: FamilyMember[];
  selectedMemberId: string | null;
  onSelectMember: (id: string) => void;
  language: Language;
  onOpenSOS: () => void;
}

export const ParamedicPassView: React.FC<ParamedicPassViewProps> = ({
  familyMembers,
  selectedMemberId,
  onSelectMember,
  language,
  onOpenSOS,
}) => {
  const currentMember = 
    familyMembers.find(m => m.id === selectedMemberId) || familyMembers[2] || familyMembers[0]; // defaults to Dadi (highest risk) or Rajesh
  
  const [showQRFullscreen, setShowQRFullscreen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShareMedicalPass = () => {
    const text = `EMERGENCY MEDICAL PASS:
Patient: ${currentMember.name} (${currentMember.age}y)
Blood Group: ${currentMember.bloodGroup}
Critical Allergies: ${currentMember.criticalAllergies.join(', ') || 'None Known'}
Conditions: ${currentMember.chronicConditions.join(', ')}
Emergency Contact: ${currentMember.emergencyContactName} (${currentMember.emergencyContactPhone})
Cashless Policy: ${currentMember.insurancePolicyNumber} (${currentMember.insuranceTpa})
ABHA ID: ${currentMember.abhaId}`;

    if (navigator.share) {
      navigator.share({
        title: `Emergency Medical Pass - ${currentMember.name}`,
        text,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col w-full space-y-4 max-w-2xl mx-auto pb-8 animate-in fade-in duration-200">
      {/* 1. Header Alert Banner */}
      <div className="bg-[#ba1a1a] text-white p-4 rounded-2xl shadow-md border border-[#ffdad6]/20">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-white/20 text-white">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black tracking-tight text-white">
                  {language === 'hi' ? 'पैरामेडिक ब्रेक-ग्लास पास' : 'Paramedic Break-Glass Pass'}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-white text-[#ba1a1a] uppercase">
                  No PIN Required
                </span>
              </div>
              <p className="text-xs text-white/90">
                {language === 'hi'
                  ? 'आपातकालीन रिस्पॉन्डर और डॉक्टरों के लिए त्वरित जीवन रक्षक डेटा'
                  : 'Instant vital medical profile for ER doctors, ambulances & first responders'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowQRFullscreen(true)}
            className="shrink-0 px-3 py-2 rounded-xl bg-white text-[#ba1a1a] font-black text-xs flex items-center gap-1.5 shadow-xs hover:bg-white/90 active:scale-95 transition-transform"
            type="button"
          >
            <QrCode className="w-4 h-4" />
            <span>QR Pass</span>
          </button>
        </div>
      </div>

      {/* 2. Patient Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {familyMembers.map((member) => {
          const isSelected = member.id === currentMember.id;
          const hasCriticalAllergy = member.criticalAllergies && member.criticalAllergies.some(a => a.toLowerCase().includes('severe') || a.toLowerCase().includes('penicillin') || a.toLowerCase().includes('sulfa'));
          return (
            <button
              key={member.id}
              onClick={() => onSelectMember(member.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                isSelected
                  ? 'bg-[#001026] text-white border-[#001026] shadow-sm scale-102'
                  : 'bg-white text-[#44474e] border-[#eaeef2] hover:bg-[#f0f4f8]'
              }`}
              type="button"
            >
              <img
                src={member.avatarUrl}
                alt={member.name}
                className="w-6 h-6 rounded-full object-cover border border-white/20"
              />
              <span>{member.name.split(' ')[0]}</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-black ${
                isSelected ? 'bg-white/20 text-white' : 'bg-[#f0f4f8] text-[#ba1a1a]'
              }`}>
                {member.bloodGroup.split(' ')[0]}
              </span>
              {hasCriticalAllergy && (
                <span className="w-2 h-2 rounded-full bg-[#ba1a1a] animate-ping" title="Critical Drug Allergy" />
              )}
            </button>
          );
        })}
      </div>

      {/* 3. Primary Medical Pass Card */}
      <div className="bg-white rounded-2xl p-5 shadow-xs border-2 border-[#ba1a1a]/20 space-y-5">
        {/* Patient Top Summary */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#eaeef2]">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={currentMember.avatarUrl}
                alt={currentMember.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-[#eaeef2] shadow-xs"
              />
              <span className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 rounded-md bg-[#ba1a1a] text-white text-[10px] font-black shadow-xs">
                {currentMember.bloodGroup.split(' ')[0]}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-[#001026] tracking-tight">
                  {currentMember.name}
                </h2>
                <span className="text-xs text-[#44474e] font-semibold">
                  ({currentMember.age}y / {language === 'hi' ? currentMember.relationHi : currentMember.relation})
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-[#44474e]">
                <span>Weight: <strong>{currentMember.weightKg || 65} kg</strong></span>
                <span>•</span>
                <span>ABHA ID: <strong>{currentMember.abhaId}</strong></span>
              </div>
              {currentMember.organDonor && (
                <div className="inline-flex items-center gap-1 mt-1 text-[11px] font-bold text-[#006d43]">
                  <Heart className="w-3 h-3 fill-[#006d43]" />
                  <span>NOTTO Pledged Organ Donor</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className="text-[10px] uppercase font-bold text-[#44474e]">Blood Group</span>
            <div className="px-3.5 py-1.5 rounded-xl bg-[#ffdad6] text-[#ba1a1a] text-xl font-black border border-[#ba1a1a]/30 shadow-xs">
              {currentMember.bloodGroup.split(' ')[0]}
            </div>
            <span className="text-[10px] text-[#44474e] text-right font-medium max-w-[100px]">
              {currentMember.donorStatus || 'Certified'}
            </span>
          </div>
        </div>

        {/* Severe Drug Allergy Red-Flag Alert */}
        {currentMember.criticalAllergies && currentMember.criticalAllergies.length > 0 && (
          <div className="p-3.5 rounded-xl bg-[#ffdad6] border-2 border-[#ba1a1a] text-[#410002]">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-[#ba1a1a] shrink-0 mt-0.5 animate-bounce" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wide text-[#ba1a1a]">
                    CRITICAL DRUG ALLERGIES (CONTRAINDICATED)
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#ba1a1a] text-white">
                    HIGH RISK
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {currentMember.criticalAllergies.map((allergy, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-white font-black text-xs text-[#93000a] shadow-xs border border-[#ba1a1a]/40"
                    >
                      ⚠️ {allergy}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] font-semibold text-[#680005] mt-2">
                  DO NOT ADMINISTER drugs from contraindicated families. Use alternative non-cross-reacting agents.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Chronic Conditions & Stents */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#001026] flex items-center gap-1.5 mb-2">
            <Activity className="w-3.5 h-3.5 text-[#0b2545]" />
            <span>Pre-Existing Chronic Conditions & Implants</span>
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {currentMember.chronicConditions.map((cond, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-[#f0f4f8] border border-[#eaeef2] text-xs font-bold text-[#001026] flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-[#0b2545]" />
                <span>{cond}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Active Emergency & Routine Medications */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#001026] flex items-center gap-1.5 mb-2">
            <Pill className="w-3.5 h-3.5 text-[#006d43]" />
            <span>Current Emergency & Ongoing Medications</span>
          </span>
          <div className="space-y-2">
            {currentMember.emergencyMedications.map((med, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border flex items-start justify-between gap-3 ${
                  med.isRescue
                    ? 'bg-[#ffdad6]/40 border-[#ba1a1a]/40'
                    : 'bg-white border-[#eaeef2]'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                    med.isRescue ? 'bg-[#ba1a1a] text-white' : 'bg-[#f0f4f8] text-[#006d43]'
                  }`}>
                    <Pill className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-[#001026]">
                        {med.name}
                      </span>
                      <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-white text-[#44474e] border border-[#eaeef2]">
                        {med.dosage}
                      </span>
                      {med.isRescue && (
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-[#ba1a1a] text-white">
                          SOS RESCUE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#44474e] mt-0.5 font-medium">
                      {med.timing}
                    </p>
                    <p className="text-[11px] text-[#006d43] font-semibold mt-0.5">
                      Target: {med.purpose}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cashless Hospital Insurance Card & TPA Desk */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-[#001026] to-[#0b2545] text-white shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-[#75f8b3] font-bold mb-1">
                <CreditCard className="w-4 h-4" />
                <span>24x7 EMERGENCY CASHLESS ADMISSION</span>
              </div>
              <h3 className="text-base font-black text-white">
                {currentMember.insuranceTpa}
              </h3>
              <p className="text-xs text-white/80 mt-0.5">
                Policy No: <strong className="text-white font-mono">{currentMember.insurancePolicyNumber}</strong>
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-white/70 block uppercase">Sum Insured</span>
              <span className="text-sm font-black text-[#75f8b3]">
                {currentMember.sumInsured}
              </span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-white/90">
              Emergency Pre-Auth Desk: <strong>1800-425-2255</strong>
            </span>
            <a
              href="tel:18004252255"
              className="px-3 py-1.5 rounded-lg bg-[#75f8b3] text-[#001026] text-xs font-black flex items-center gap-1 hover:bg-[#52db96] transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call TPA Desk</span>
            </a>
          </div>
        </div>

        {/* In Case of Emergency (ICE) Contacts */}
        <div className="p-3.5 rounded-xl bg-[#f0f4f8] border border-[#eaeef2]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#001026] flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-[#006d43]" />
              <span>In Case of Emergency (ICE) Next of Kin</span>
            </span>
            <span className="text-[10px] font-bold text-[#006d43] px-1.5 py-0.5 rounded bg-[#75f8b3]/30">
              Authorized Decision Maker
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-sm font-bold text-[#001026] block">
                {currentMember.emergencyContactName}
              </span>
              <span className="text-xs text-[#44474e] font-mono">
                {currentMember.emergencyContactPhone}
              </span>
            </div>
            <a
              href={`tel:${currentMember.emergencyContactPhone.replace(/\s+/g, '')}`}
              className="px-3.5 py-2 rounded-xl bg-[#006d43] text-white font-bold text-xs flex items-center gap-1.5 hover:bg-[#005333] transition-colors shadow-xs"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call ICE Contact</span>
            </a>
          </div>
        </div>

        {/* Emergency Notes */}
        {currentMember.emergencyNotes && (
          <div className="p-3 rounded-xl bg-[#fff8e1] border border-[#ffe082] text-xs text-[#5d4037]">
            <strong>Physician Directive:</strong> {currentMember.emergencyNotes}
          </div>
        )}

        {/* Action Controls */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <button
            onClick={() => setShowQRFullscreen(true)}
            className="py-2.5 px-2 rounded-xl bg-[#001026] text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#0b2545] transition-colors shadow-xs"
            type="button"
          >
            <QrCode className="w-4 h-4" />
            <span>Show QR</span>
          </button>

          <button
            onClick={handleShareMedicalPass}
            className="py-2.5 px-2 rounded-xl bg-[#f0f4f8] text-[#001026] font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#eaeef2] transition-colors border border-[#eaeef2]"
            type="button"
          >
            {copiedLink ? <Check className="w-4 h-4 text-[#006d43]" /> : <Share2 className="w-4 h-4" />}
            <span>{copiedLink ? 'Copied!' : 'Share Pass'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="py-2.5 px-2 rounded-xl bg-[#f0f4f8] text-[#001026] font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#eaeef2] transition-colors border border-[#eaeef2]"
            type="button"
          >
            <Printer className="w-4 h-4" />
            <span>Print Pass</span>
          </button>
        </div>
      </div>

      {/* 4. Fullscreen Break-Glass QR Modal */}
      {showQRFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ba1a1a] animate-ping" />
                <span className="text-xs font-black uppercase text-[#ba1a1a] tracking-wide">
                  Paramedic Break-Glass
                </span>
              </div>
              <button
                onClick={() => setShowQRFullscreen(false)}
                className="w-8 h-8 rounded-full bg-[#f0f4f8] text-[#44474e] flex items-center justify-center font-bold"
                type="button"
              >
                ✕
              </button>
            </div>

            <div className="text-center">
              <h3 className="text-lg font-black text-[#001026]">
                {currentMember.name}
              </h3>
              <p className="text-xs text-[#ba1a1a] font-black mt-0.5">
                BLOOD GROUP: {currentMember.bloodGroup} • ALLERGIES: {currentMember.criticalAllergies.join(', ')}
              </p>
            </div>

            {/* Generated QR Representation */}
            <div className="p-4 bg-white rounded-2xl border-4 border-[#ba1a1a] flex flex-col items-center justify-center shadow-inner">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
                  `MED_PASS|PATIENT:${currentMember.name}|BLOOD:${currentMember.bloodGroup}|ALLERGY:${currentMember.criticalAllergies.join(',')}|COND:${currentMember.chronicConditions.join(',')}|ICE:${currentMember.emergencyContactPhone}|INS:${currentMember.insurancePolicyNumber}`
                )}`}
                alt="Emergency Medical QR"
                className="w-52 h-52 object-contain"
              />
              <span className="text-[11px] font-bold text-[#44474e] mt-2">
                Scan with any mobile camera / ER tablet
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#f0f4f8] text-[11px] text-[#44474e] text-center">
              Does not expose personal financial docs or Aadhaar — only verifies life-saving clinical allergies, medications, and insurance TPA.
            </div>

            <button
              onClick={() => setShowQRFullscreen(false)}
              className="w-full py-3 rounded-xl bg-[#001026] text-white font-bold text-xs hover:bg-[#0b2545] transition-colors"
              type="button"
            >
              Close Pass
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
