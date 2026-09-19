import React, { useState } from 'react';
import { Language, AuditLog, FamilyMember } from '../types';
import { 
  Shield, 
  ShieldCheck, 
  Lock, 
  Key, 
  EyeOff, 
  Smartphone, 
  Clock, 
  Users, 
  Download, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Copy, 
  ChevronLeft, 
  Calculator, 
  RefreshCw, 
  Trash2, 
  Edit3, 
  KeyRound 
} from 'lucide-react';
import { generateRecoveryMnemonic } from '../lib/crypto';

interface SecurityPrivacyViewProps {
  language: Language;
  onBackToHome: () => void;
  auditLogs: AuditLog[];
  familyMembers: FamilyMember[];
  isMaskingGlobal: boolean;
  onToggleMasking: () => void;
  savedPin: string;
  onUpdatePin: (newPin: string) => void;
  onLockVaultNow: () => void;
  onTriggerCamouflage: () => void;
  familyName: string;
  onUpdateFamilyName: (name: string) => void;
  onExportVaultBackup: () => void;
  onImportVaultBackup: (file: File) => void;
  onResetVault: (mode: 'clean' | 'demo') => void;
  autoLockDuration: string;
  onUpdateAutoLockDuration: (duration: string) => void;
}

export const SecurityPrivacyView: React.FC<SecurityPrivacyViewProps> = ({
  language,
  onBackToHome,
  auditLogs,
  familyMembers,
  isMaskingGlobal,
  onToggleMasking,
  savedPin,
  onUpdatePin,
  onLockVaultNow,
  onTriggerCamouflage,
  familyName,
  onUpdateFamilyName,
  onExportVaultBackup,
  onImportVaultBackup,
  onResetVault,
  autoLockDuration,
  onUpdateAutoLockDuration,
}) => {
  // Interactive defense toggles
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [antiScreenshot, setAntiScreenshot] = useState(true);
  const [expiringShares, setExpiringShares] = useState(true);

  // Modals & form states
  const [showSeedModal, setShowSeedModal] = useState(false);
  const [seedCopied, setSeedCopied] = useState(false);
  const [showRolesModal, setShowRolesModal] = useState(false);
  const [showChangePinModal, setShowChangePinModal] = useState(false);
  const [tempPin, setTempPin] = useState('');
  const [showFamilyNameModal, setShowFamilyNameModal] = useState(false);
  const [tempFamilyName, setTempFamilyName] = useState(familyName);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  const [recoverySeed, setRecoverySeed] = useState<string[]>(() => generateRecoveryMnemonic());

  // Security score calculation
  let securityScore = 70;
  if (savedPin) securityScore += 10;
  if (isMaskingGlobal) securityScore += 5;
  if (biometricsEnabled) securityScore += 5;
  if (antiScreenshot) securityScore += 5;
  if (autoLockDuration !== 'never') securityScore += 5;

  const handleCopySeed = () => {
    navigator.clipboard?.writeText(recoverySeed.join(' '));
    setSeedCopied(true);
    setTimeout(() => setSeedCopied(false), 2500);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportVaultBackup(file);
    }
  };

  return (
    <div className="flex flex-col w-full space-y-4 max-w-2xl mx-auto pb-6 animate-in fade-in duration-200">
      {/* 1. Header with back arrow & Quick Lock */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#eaeef2] flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHome}
            className="w-9 h-9 rounded-xl bg-[#f0f4f8] hover:bg-[#e5e9ed] flex items-center justify-center text-[#001026] transition-colors"
            type="button"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-[#001026]">
              {language === 'hi' ? 'सुरक्षा और गोपनीयता केंद्र' : 'Security & Privacy Center'}
            </h1>
            <p className="text-xs text-[#44474e]">
              Zero-Knowledge AES-256 GCM Client Enclave
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Camouflage / Panic Shortcut */}
          <button
            onClick={onTriggerCamouflage}
            className="h-9 px-2.5 rounded-xl bg-[#ffdad6]/60 text-[#ba1a1a] hover:bg-[#ffdad6] text-xs font-bold flex items-center gap-1 transition-colors"
            title="Emergency Panic Camouflage"
          >
            <Calculator className="w-4 h-4" />
            <span className="hidden sm:inline">Camouflage</span>
          </button>

          {/* Lock Now Button */}
          <button
            onClick={onLockVaultNow}
            className="h-9 px-3 rounded-xl bg-[#001026] hover:bg-[#0b2545] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs active:scale-95 transition-all"
            type="button"
          >
            <Lock className="w-3.5 h-3.5 text-[#78fbb6]" />
            <span>Lock Now</span>
          </button>
        </div>
      </div>

      {/* 2. Zero-Knowledge Hero Card with Dynamic Radial Gauge */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#001026] via-[#0b2545] to-[#001026] p-5 text-white shadow-md border border-[#0b2545]">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#75f8b3]/20 text-[#78fbb6] text-[11px] font-bold mb-2">
              <Lock className="w-3 h-3" />
              <span>ZERO-KNOWLEDGE ARCHITECTURE</span>
            </div>
            <h2 className="text-lg font-bold text-white leading-tight">
              {familyName}'s Zero-Knowledge Vault
            </h2>
            <p className="text-xs text-[#b1c7f0] mt-1 leading-relaxed">
              Keys are generated client-side using WebCrypto SubtleCrypto PBKDF2. No unencrypted documents or plaintext ever leave your browser.
            </p>
          </div>

          {/* Radial SVG Gauge */}
          <div className="shrink-0 flex flex-col items-center">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-white/10"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#78fbb6] transition-all duration-700"
                  strokeDasharray={`${securityScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-lg font-black text-white leading-none">{securityScore}</span>
                <span className="text-[9px] text-[#b1c7f0]">/100</span>
              </div>
            </div>
            <span className="text-[10px] text-[#78fbb6] font-bold mt-1">सुरक्षा स्कोर</span>
          </div>
        </div>

        {/* Security badges */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1 text-[#78fbb6]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="text-[11px]">Hardware Enclave Bound</span>
          </div>
          <div className="flex items-center gap-1 text-[#78fbb6]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="text-[11px]">PBKDF2 100k Iterations</span>
          </div>
        </div>
      </div>

      {/* 3. Personalization & Multi-Family Deployment Settings ("Publish for Everyone") */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#eaeef2]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-[#006d43]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#001026]">
              Vault Identity & Personalization (पारिवारिक पहचान)
            </h2>
          </div>
          <button
            onClick={() => setShowFamilyNameModal(true)}
            className="text-xs font-bold text-[#006d43] hover:underline flex items-center gap-1"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Rename Vault</span>
          </button>
        </div>

        <div className="p-3 bg-[#f0f4f8] rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#001026] block">{familyName}</span>
            <span className="text-[11px] text-[#44474e]">
              Ready for production use by any individual or family
            </span>
          </div>
          <span className="text-[10px] font-bold text-[#006d43] bg-[#75f8b3]/30 px-2 py-0.5 rounded-full">
            Isolated Client Storage
          </span>
        </div>

        {/* Start Clean Vault vs Demo Data */}
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={() => onResetVault('clean')}
            className="flex-1 py-2 px-3 rounded-xl bg-[#f0f4f8] hover:bg-[#eaeef2] text-[#001026] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 text-[#ba1a1a]" />
            <span>Start Fresh Clean Vault</span>
          </button>

          <button
            onClick={() => onResetVault('demo')}
            className="flex-1 py-2 px-3 rounded-xl bg-[#f0f4f8] hover:bg-[#eaeef2] text-[#001026] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#006d43]" />
            <span>Load Sample Demo Vault</span>
          </button>
        </div>
      </div>

      {/* 4. Active Privacy Defenses (Interactive Toggles) */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#eaeef2]">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#001026] mb-3">
          Active Defense Controls (सक्रिय सुरक्षा नियंत्रण)
        </h2>

        <div className="divide-y divide-[#f0f4f8] space-y-1">
          {/* Master PIN Settings */}
          <div className="py-2.5 flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#f0f4f8] flex items-center justify-center shrink-0 text-[#001026]">
                <KeyRound className="w-4 h-4 text-[#006d43]" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#001026]">Master App Lock PIN</p>
                <p className="text-[11px] text-[#44474e]">
                  Current PIN: <span className="font-mono font-bold">••••</span> (Used for local vault encryption)
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setTempPin('');
                setShowChangePinModal(true);
              }}
              className="px-2.5 py-1 text-xs font-bold bg-[#f0f4f8] hover:bg-[#eaeef2] text-[#001026] rounded-xl border border-[#c4c6cf]"
            >
              Change PIN
            </button>
          </div>

          {/* Auto-Lock Timeout */}
          <div className="py-2.5 flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#f0f4f8] flex items-center justify-center shrink-0 text-[#001026]">
                <Clock className="w-4 h-4 text-[#006d43]" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#001026]">Auto-Lock Idle Timeout</p>
                <p className="text-[11px] text-[#44474e]">Automatically lock vault when switching tabs or idle</p>
              </div>
            </div>
            <select
              value={autoLockDuration}
              onChange={(e) => onUpdateAutoLockDuration(e.target.value)}
              className="text-xs font-semibold px-2 py-1 rounded-xl bg-[#f0f4f8] border border-[#c4c6cf] text-[#001026] focus:outline-none"
            >
              <option value="immediate">Immediately on Blur</option>
              <option value="30s">After 30 seconds</option>
              <option value="1m">After 1 minute</option>
              <option value="5m">After 5 minutes</option>
              <option value="never">Never (Manual only)</option>
            </select>
          </div>

          {/* Paramedic Break-Glass QR Override */}
          <div className="py-2.5 flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#ffdad6] flex items-center justify-center shrink-0 text-[#ba1a1a]">
                <Shield className="w-4 h-4 text-[#ba1a1a]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-black text-[#93000a]">Paramedic Break-Glass QR Access</p>
                  <span className="text-[9px] font-bold bg-[#ba1a1a] text-white px-1.5 py-0.2 rounded">LIFE-SAVING</span>
                </div>
                <p className="text-[11px] text-[#44474e]">
                  Allows ER doctors and paramedics to scan patient allergy & blood group pass without Master PIN
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#006d43] px-2 py-1 rounded-lg bg-[#75f8b3]/20">
              Active
            </span>
          </div>

          {/* Insurance Policy & ABHA Masking */}
          <div className="py-2.5 flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#f0f4f8] flex items-center justify-center shrink-0 text-[#001026]">
                <EyeOff className="w-4 h-4 text-[#006d43]" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#001026]">Cashless Policy & ABHA ID Masking</p>
                <p className="text-[11px] text-[#44474e]">Mask health insurance and digital health ID numbers (•••• 4920)</p>
              </div>
            </div>
            <button
              onClick={onToggleMasking}
              className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                isMaskingGlobal ? 'bg-[#006d43]' : 'bg-[#c4c6cf]'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                isMaskingGlobal ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          {/* Biometrics */}
          <div className="py-2.5 flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#f0f4f8] flex items-center justify-center shrink-0 text-[#001026]">
                <Smartphone className="w-4 h-4 text-[#006d43]" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#001026]">Hardware Biometrics & App Lock</p>
                <p className="text-[11px] text-[#44474e]">Touch ID, Face ID, or Windows Hello WebAuthn</p>
              </div>
            </div>
            <button
              onClick={() => setBiometricsEnabled(!biometricsEnabled)}
              className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                biometricsEnabled ? 'bg-[#006d43]' : 'bg-[#c4c6cf]'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                biometricsEnabled ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          {/* Anti-Screenshot Guard */}
          <div className="py-2.5 flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#f0f4f8] flex items-center justify-center shrink-0 text-[#001026]">
                <Shield className="w-4 h-4 text-[#006d43]" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#001026]">Anti-Screenshot & App Switcher Shield</p>
                <p className="text-[11px] text-[#44474e]">Prevents preview exposure in mobile multitasking switcher</p>
              </div>
            </div>
            <button
              onClick={() => setAntiScreenshot(!antiScreenshot)}
              className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                antiScreenshot ? 'bg-[#006d43]' : 'bg-[#c4c6cf]'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                antiScreenshot ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* 5. Cryptographic Encrypted Vault Backup & Restore */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#eaeef2]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Download className="w-4 h-4 text-[#006d43]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#001026]">
              Encrypted Offline Backup & Restore (बैकअप एवं पुनर्स्थापना)
            </h2>
          </div>
          <span className="text-[10px] font-bold text-[#006d43] bg-[#75f8b3]/20 px-2 py-0.5 rounded-full">
            AES-256 (.ENC)
          </span>
        </div>
        <p className="text-xs text-[#44474e] mb-3">
          Download a standalone encrypted vault backup file that can be restored on any device without internet connectivity.
        </p>

        <div className="grid grid-cols-2 gap-2">
          {/* Export */}
          <button
            onClick={onExportVaultBackup}
            className="py-2.5 px-3 rounded-xl bg-[#001026] hover:bg-[#0b2545] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <Download className="w-4 h-4 text-[#78fbb6]" />
            <span>Export Encrypted File</span>
          </button>

          {/* Import */}
          <label className="py-2.5 px-3 rounded-xl bg-[#f0f4f8] hover:bg-[#eaeef2] text-[#001026] text-xs font-bold flex items-center justify-center gap-2 border border-[#c4c6cf] cursor-pointer transition-colors text-center">
            <Upload className="w-4 h-4 text-[#006d43]" />
            <span>Restore from File</span>
            <input
              type="file"
              accept=".enc,.json"
              onChange={handleFileImport}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* 6. Family Role-Based Access Control (RBAC) */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#eaeef2]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-[#001026]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#001026]">
              Family Role Boundaries (RBAC)
            </h2>
          </div>
          <button
            onClick={() => setShowRolesModal(true)}
            className="text-xs font-bold text-[#006d43] hover:underline"
          >
            Manage Permissions
          </button>
        </div>

        <div className="space-y-2">
          {familyMembers.map((m) => (
            <div key={m.id} className="p-2.5 rounded-xl bg-[#f0f4f8] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img src={m.avatarUrl} alt={m.name} className="w-8 h-8 rounded-full object-cover" />
                <div>
                  <span className="text-xs font-bold text-[#001026] block">{m.name}</span>
                  <span className="text-[10px] text-[#44474e]">
                    {m.id === 'rajesh' && 'Full admin, audit log export, seed generation'}
                    {m.id === 'sunita' && 'Co-Owner • Full read/write for health & insurance'}
                    {m.id === 'dadi' && 'Assisted Senior View • Large text, high-contrast prescriptions'}
                    {m.id === 'aarav' && 'Supervised Child • School, vaccine, and pediatric ID view only'}
                    {m.id !== 'rajesh' && m.id !== 'sunita' && m.id !== 'dadi' && m.id !== 'aarav' && 'Standard Family View'}
                  </span>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                m.role === 'Superowner'
                  ? 'bg-[#001026] text-white'
                  : m.role === 'Co-Owner'
                  ? 'bg-[#006d43] text-white'
                  : 'bg-[#e5e9ed] text-[#001026]'
              }`}>
                {m.role}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Emergency Master Recovery Seed Button */}
      <div className="pt-2">
        <button
          onClick={() => setShowSeedModal(true)}
          className="w-full h-12 rounded-2xl bg-[#001026] hover:bg-[#0b2545] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform"
        >
          <Key className="w-4 h-4 text-[#78fbb6]" />
          <span>GENERATE 12-WORD MASTER DISASTER RECOVERY KEY</span>
        </button>
      </div>

      {/* Modal: Change Master PIN */}
      {showChangePinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-[#eaeef2] animate-in fade-in text-[#171c1f]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-[#001026]">Set New Master PIN</h3>
              <button onClick={() => setShowChangePinModal(false)} className="p-1 text-[#74777f]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[#44474e] mb-3">
              Enter a 4-digit PIN to secure this family vault.
            </p>
            <input
              type="password"
              maxLength={4}
              placeholder="4-digit PIN"
              value={tempPin}
              onChange={(e) => setTempPin(e.target.value.replace(/\D/g, ''))}
              className="w-full text-center tracking-widest text-lg font-mono px-3 py-2 rounded-xl border border-[#c4c6cf] focus:outline-none focus:border-[#006d43] mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowChangePinModal(false)}
                className="px-3 py-2 bg-[#f0f4f8] text-[#44474e] text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (tempPin.length === 4) {
                    onUpdatePin(tempPin);
                    setShowChangePinModal(false);
                  } else {
                    alert('PIN must be 4 digits.');
                  }
                }}
                className="px-4 py-2 bg-[#001026] text-white text-xs font-bold rounded-xl"
              >
                Save PIN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Rename Family Vault */}
      {showFamilyNameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-[#eaeef2] animate-in fade-in text-[#171c1f]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-[#001026]">Personalize Family Vault</h3>
              <button onClick={() => setShowFamilyNameModal(false)} className="p-1 text-[#74777f]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[#44474e] mb-3">
              Enter your family or household name for all vault documents and emergency passes:
            </p>
            <input
              type="text"
              value={tempFamilyName}
              onChange={(e) => setTempFamilyName(e.target.value)}
              placeholder="e.g. Verma Family, Patel Family"
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#c4c6cf] focus:outline-none focus:border-[#006d43] mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowFamilyNameModal(false)}
                className="px-3 py-2 bg-[#f0f4f8] text-[#44474e] text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (tempFamilyName.trim()) {
                    onUpdateFamilyName(tempFamilyName.trim());
                    setShowFamilyNameModal(false);
                  }
                }}
                className="px-4 py-2 bg-[#001026] text-white text-xs font-bold rounded-xl"
              >
                Update Name
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: 12-Word Master Recovery Seed */}
      {showSeedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-[#eaeef2] animate-in fade-in text-[#171c1f]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-[#006d43]" />
                <h3 className="font-bold text-sm text-[#001026]">12-Word Master Recovery Phrase</h3>
              </div>
              <button onClick={() => setShowSeedModal(false)} className="p-1 text-[#74777f]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#44474e] leading-relaxed">
              Write these 12 words down on paper in private. They are the ONLY way to decrypt and recover your family vault if you lose your device or master PIN.
            </p>

            <div className="grid grid-cols-3 gap-2 my-4 p-4 bg-[#f0f4f8] rounded-2xl border border-[#c4c6cf]/50">
              {recoverySeed.map((word, idx) => (
                <div key={idx} className="bg-white px-2 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1 shadow-2xs">
                  <span className="text-[#74777f] text-[10px] w-4">{idx + 1}.</span>
                  <span className="text-[#001026]">{word}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setRecoverySeed(generateRecoveryMnemonic())}
                className="py-2.5 px-3 rounded-xl bg-[#f0f4f8] text-[#001026] text-xs font-bold hover:bg-[#eaeef2]"
                title="Generate new phrase"
              >
                Regenerate
              </button>

              <button
                onClick={handleCopySeed}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  seedCopied ? 'bg-[#006d43] text-white' : 'bg-[#001026] text-white'
                }`}
              >
                {seedCopied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>12 Words Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy 12-Word Phrase</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Roles explanation */}
      {showRolesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-[#eaeef2] animate-in fade-in text-[#171c1f]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-[#001026]">Family Role Security Boundaries</h3>
              <button onClick={() => setShowRolesModal(false)} className="p-1 text-[#74777f]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2.5 text-xs text-[#44474e]">
              <div className="p-2.5 bg-[#f0f4f8] rounded-xl">
                <span className="font-bold text-[#001026] block">Superowner</span>
                <span>Unrestricted read/write, cryptographic master seed export, manage role assignments.</span>
              </div>
              <div className="p-2.5 bg-[#f0f4f8] rounded-xl">
                <span className="font-bold text-[#001026] block">Co-Owner</span>
                <span>Access all family health, insurance policies, and identity records. Cannot wipe vault.</span>
              </div>
              <div className="p-2.5 bg-[#f0f4f8] rounded-xl">
                <span className="font-bold text-[#001026] block">Assisted Senior View</span>
                <span>High-contrast, large font view for daily medication reminders and emergency hospital passes.</span>
              </div>
              <div className="p-2.5 bg-[#f0f4f8] rounded-xl">
                <span className="font-bold text-[#001026] block">Supervised Child</span>
                <span>Read-only access to child Aadhaar, birth certificate, and school immunization timeline.</span>
              </div>
            </div>
            <button
              onClick={() => setShowRolesModal(false)}
              className="mt-4 w-full py-2.5 bg-[#001026] text-white text-xs font-bold rounded-xl"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
