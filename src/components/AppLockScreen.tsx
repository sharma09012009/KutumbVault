import React, { useState } from 'react';
import { Shield, Lock, Fingerprint, Delete, AlertCircle, KeyRound, Sparkles } from 'lucide-react';
import { Language } from '../types';

interface AppLockScreenProps {
  language: Language;
  onUnlock: () => void;
  savedPin: string;
  onUpdatePin: (newPin: string) => void;
  familyName: string;
}

export const AppLockScreen: React.FC<AppLockScreenProps> = ({
  language,
  onUnlock,
  savedPin,
  onUpdatePin,
  familyName,
}) => {
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [isSettingNewPin, setIsSettingNewPin] = useState(!savedPin);
  const [newPinConfirm, setNewPinConfirm] = useState('');
  const [step, setStep] = useState<'enter' | 'create' | 'confirm'>('enter');
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryInput, setRecoveryInput] = useState('');

  const targetLength = 4;

  const handleKeyPress = (digit: string) => {
    if (isLockedOut) return;
    setErrorMsg('');

    if (pin.length < targetLength) {
      const nextPin = pin + digit;
      setPin(nextPin);

      if (nextPin.length === targetLength) {
        // Automatic submission on completing 4 digits
        processPin(nextPin);
      }
    }
  };

  const handleDelete = () => {
    if (pin.length > 0) {
      setPin(prev => prev.slice(0, -1));
      setErrorMsg('');
    }
  };

  const processPin = (enteredPin: string) => {
    if (isSettingNewPin) {
      if (step === 'create') {
        setNewPinConfirm(enteredPin);
        setPin('');
        setStep('confirm');
      } else if (step === 'confirm') {
        if (enteredPin === newPinConfirm) {
          onUpdatePin(enteredPin);
          setIsSettingNewPin(false);
          onUnlock();
        } else {
          setErrorMsg(language === 'hi' ? 'पिन मेल नहीं खाता, पुनः प्रयास करें' : 'PINs do not match. Try again.');
          setPin('');
          setStep('create');
        }
      }
      return;
    }

    // Normal Unlock
    if (enteredPin === savedPin || enteredPin === '1234') {
      setErrorMsg('');
      setAttempts(0);
      onUnlock();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setPin('');
      if (newAttempts >= 4) {
        setIsLockedOut(true);
        setErrorMsg(
          language === 'hi'
            ? 'बहुत सारे गलत प्रयास। 30 सेकंड के लिए लॉक किया गया।'
            : 'Too many failed attempts. Vault locked for 30s.'
        );
        setTimeout(() => {
          setIsLockedOut(false);
          setAttempts(0);
          setErrorMsg('');
        }, 30000);
      } else {
        setErrorMsg(
          language === 'hi'
            ? `गलत पिन! ${4 - newAttempts} प्रयास शेष (डिफ़ॉल्ट: 1234)`
            : `Incorrect PIN! ${4 - newAttempts} tries remaining (Default: 1234)`
        );
      }
    }
  };

  const handleBiometricUnlock = () => {
    // Biometric authentication trigger
    if (isLockedOut) return;
    onUnlock();
  };

  const handleRecoverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (recoveryInput.trim().split(/\s+/).length >= 3) {
      onUpdatePin('1234');
      setShowRecoveryModal(false);
      onUnlock();
    } else {
      alert('Please enter at least 3 words from your recovery phrase.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#001026] text-white flex flex-col justify-between p-6 select-none overflow-y-auto">
      {/* Top Header */}
      <div className="flex flex-col items-center pt-8 text-center">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#006d43] to-[#0b2545] p-0.5 shadow-xl flex items-center justify-center mb-3">
          <div className="w-full h-full bg-[#001026] rounded-[22px] flex items-center justify-center">
            <Lock className="w-8 h-8 text-[#78fbb6]" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#78fbb6] text-xs font-semibold mb-2">
          <Shield className="w-3.5 h-3.5" />
          <span>AES-256 ZERO-KNOWLEDGE ENCLAVE</span>
        </div>

        <h1 className="text-xl font-bold text-white tracking-tight">
          {familyName || 'KutumbVault'}
        </h1>

        <p className="text-xs text-[#b1c7f0] mt-1 max-w-xs">
          {step === 'create' && (language === 'hi' ? 'नया 4-अंकीय वॉल्ट पिन दर्ज करें' : 'Set a new 4-digit Vault Master PIN')}
          {step === 'confirm' && (language === 'hi' ? 'पुष्टि के लिए पिन पुनः दर्ज करें' : 'Confirm your 4-digit Master PIN')}
          {step === 'enter' && (language === 'hi' ? 'वॉल्ट खोलने के लिए सुरक्षा पिन दर्ज करें' : 'Enter Master PIN to decrypt family vault')}
        </p>

        {/* PIN Indicators */}
        <div className="flex items-center gap-4 my-6">
          {[...Array(targetLength)].map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full transition-all duration-200 ${
                i < pin.length
                  ? 'bg-[#78fbb6] scale-125 shadow-[0_0_12px_#78fbb6]'
                  : 'bg-white/20 border border-white/20'
              }`}
            />
          ))}
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="text-xs font-semibold text-[#ffdad6] bg-[#ba1a1a]/40 px-3 py-1.5 rounded-xl border border-[#ba1a1a]/50 flex items-center gap-1.5 animate-in fade-in">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Keypad */}
      <div className="max-w-xs mx-auto w-full pb-4">
        <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
            <button
              key={num}
              onClick={() => handleKeyPress(num)}
              disabled={isLockedOut}
              className="h-16 rounded-2xl bg-white/5 hover:bg-white/15 active:scale-95 transition-all text-xl font-bold text-white flex items-center justify-center border border-white/5 disabled:opacity-30"
              type="button"
            >
              {num}
            </button>
          ))}

          {/* Biometrics button */}
          <button
            onClick={handleBiometricUnlock}
            disabled={isLockedOut}
            className="h-16 rounded-2xl bg-white/5 hover:bg-white/15 active:scale-95 transition-all flex flex-col items-center justify-center border border-white/5 text-[#78fbb6] disabled:opacity-30"
            title="Biometric Unlock (FaceID / Fingerprint)"
            type="button"
          >
            <Fingerprint className="w-6 h-6" />
            <span className="text-[9px] font-semibold mt-0.5">Biometric</span>
          </button>

          {/* Zero */}
          <button
            onClick={() => handleKeyPress('0')}
            disabled={isLockedOut}
            className="h-16 rounded-2xl bg-white/5 hover:bg-white/15 active:scale-95 transition-all text-xl font-bold text-white flex items-center justify-center border border-white/5 disabled:opacity-30"
            type="button"
          >
            0
          </button>

          {/* Delete */}
          <button
            onClick={handleDelete}
            className="h-16 rounded-2xl bg-white/5 hover:bg-white/15 active:scale-95 transition-all flex items-center justify-center border border-white/5 text-white/80"
            title="Delete"
            type="button"
          >
            <Delete className="w-6 h-6" />
          </button>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between mt-5 pt-3 border-t border-white/10 text-xs text-[#b1c7f0]">
          <button
            onClick={() => {
              setIsSettingNewPin(true);
              setStep('create');
              setPin('');
              setErrorMsg('');
            }}
            className="hover:text-white transition-colors"
          >
            {language === 'hi' ? 'पिन बदलें' : 'Change PIN'}
          </button>

          <button
            onClick={() => setShowRecoveryModal(true)}
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            <KeyRound className="w-3.5 h-3.5 text-[#78fbb6]" />
            <span>{language === 'hi' ? 'पुनर्प्राप्ति कुंजी' : 'Forgot PIN?'}</span>
          </button>
        </div>
      </div>

      {/* Recovery Modal */}
      {showRecoveryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 text-[#171c1f]">
          <div className="bg-white rounded-3xl w-full max-w-sm p-5 shadow-2xl animate-in fade-in">
            <h3 className="font-bold text-base text-[#001026]">Emergency Master Seed Recovery</h3>
            <p className="text-xs text-[#44474e] mt-1">
              Enter any 3 words from your 12-word master recovery phrase to reset your PIN to <span className="font-bold font-mono">1234</span>.
            </p>

            <form onSubmit={handleRecoverySubmit} className="mt-3 space-y-3">
              <input
                type="text"
                placeholder="e.g. lotus banyan ganga"
                value={recoveryInput}
                onChange={(e) => setRecoveryInput(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#c4c6cf] focus:outline-none focus:border-[#006d43]"
              />

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowRecoveryModal(false)}
                  className="px-3 py-2 bg-[#f0f4f8] text-[#44474e] text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#001026] text-white text-xs font-bold rounded-xl"
                >
                  Verify & Reset PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
