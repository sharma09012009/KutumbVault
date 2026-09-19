import React, { useState } from 'react';
import { Language, TabView } from '../types';
import { Shield, Bell, CheckCircle2, Lock, X } from 'lucide-react';

interface HeaderProps {
  language: Language;
  onToggleLanguage: () => void;
  activeTab: TabView;
  onSelectTab: (tab: TabView) => void;
  onOpenAssistant: () => void;
  onLockVaultNow?: () => void;
  onTriggerCamouflage?: () => void;
  familyName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onToggleLanguage,
  onSelectTab,
  onOpenAssistant,
  onLockVaultNow,
  onTriggerCamouflage,
  familyName,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-40 bg-[#ffffff]/90 backdrop-blur-xl pt-safe shadow-[0_1px_8px_rgba(11,37,69,0.04)] border-b border-[#eaeef2]">
        <div className="max-w-4xl mx-auto h-16 px-4 flex items-center justify-between gap-2">
          {/* Logo & Title */}
          <div 
            className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
            onClick={() => onSelectTab('sos')}
          >
            <img
              alt="KutumbVault Emergency Logo"
              className="h-8 w-auto object-contain shrink-0"
              src="https://lh3.googleusercontent.com/aida/AEtjO1X17yWgdxIT0KJiPQkhJbrXn7M-ZibblA6q00MSLYDZW5IwRGANTyLDJmVbza8r05VNb7pkGLhMtCXY8Sr8sCg49JQygvSM_XPYQwx5GaTlxYd6Eu5FSFKNxNr3rf_Y2a120Eg1Ltqy2QJMuuD8dVpb1tegu8T9ymvo9Fl8JofgbvnSBUIwQ6gNCx3c6tOnwK4GFCG4P5C4fxchY_yL3xu1jSevySZfZ04yzOswU-abyg"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black text-[#001026] tracking-tight leading-none truncate">
                  {familyName || (language === 'hi' ? 'आपातकालीन कुटुंबवॉल्ट' : 'KutumbVault Emergency')}
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[9px] font-black bg-[#ba1a1a] text-white uppercase">
                  MED SOS
                </span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <Lock className="w-2.5 h-2.5 text-[#006d43]" />
                <span className="text-[10px] font-bold text-[#006d43] tracking-wide uppercase">
                  {language === 'hi' ? 'पैरामेडिक ब्रेक-ग्लास सक्रिय' : 'Paramedic Break-Glass Active'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Panic Camouflage Quick Button */}
            {onTriggerCamouflage && (
              <button
                id="header-panic-btn"
                aria-label="Stealth Camouflage"
                onClick={onTriggerCamouflage}
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-[#ffdad6]/40 text-[#ba1a1a] hover:bg-[#ffdad6] transition-colors"
                type="button"
                title="Panic Camouflage (Hide Vault)"
              >
                <span className="text-xs">🧮</span>
              </button>
            )}

            {/* Quick Lock Button */}
            {onLockVaultNow && (
              <button
                id="header-lock-btn"
                aria-label="Lock Vault"
                onClick={onLockVaultNow}
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-[#f0f4f8] text-[#001026] hover:bg-[#eaeef2] transition-colors"
                type="button"
                title="Lock Vault Now"
              >
                <Lock className="w-4 h-4 text-[#006d43]" />
              </button>
            )}
            {/* Language Switcher */}
            <button
              id="header-lang-toggle"
              aria-label="Switch Language"
              onClick={onToggleLanguage}
              className="h-9 px-2.5 flex items-center justify-center rounded-full bg-[#f0f4f8] text-[#001026] text-xs font-semibold tracking-wide hover:bg-[#eaeef2] transition-colors"
              type="button"
            >
              <span className="text-xs mr-1 text-[#44474e]">🌐</span>
              <span>{language === 'en' ? 'EN | अ' : 'अ | EN'}</span>
            </button>

            {/* AI Assistant Quick Trigger */}
            <button
              id="header-assistant-btn"
              aria-label="Voice & AI Assistant"
              onClick={onOpenAssistant}
              className="h-9 px-2.5 flex items-center justify-center rounded-full bg-[#0b2545] text-white text-xs font-bold shadow-xs hover:bg-[#001026] transition-all active:scale-95"
              type="button"
            >
              <span className="w-2 h-2 rounded-full bg-[#78fbb6] mr-1.5 animate-pulse"></span>
              <span>{language === 'hi' ? 'AI सहायक' : 'AI Help'}</span>
            </button>

            {/* Security Vault Shortcut */}
            <button
              id="header-security-btn"
              aria-label="Security & Privacy"
              onClick={() => onSelectTab('security')}
              className="w-10 h-10 flex items-center justify-center rounded-full text-[#44474e] hover:bg-[#f0f4f8] transition-colors"
              type="button"
              title="Security & Privacy"
            >
              <Shield className="w-5 h-5 text-[#006d43]" />
            </button>

            {/* Notifications */}
            <button
              id="header-notifications-btn"
              aria-label="Notifications"
              onClick={() => setShowNotifications(true)}
              className="w-10 h-10 relative flex items-center justify-center rounded-full text-[#171c1f] hover:bg-[#f0f4f8] transition-colors"
              type="button"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#ba1a1a] ring-2 ring-white animate-pulse"></span>
            </button>

            {/* Family Profile Avatar */}
            <button
              id="header-profile-btn"
              aria-label="Family Profile Account"
              onClick={() => setShowProfileModal(true)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#f0f4f8] ml-0.5 transition-colors"
              type="button"
            >
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover ring-1 ring-[#006d43]/40"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyumfeA8X8clOqPgx0EcZo1Re5BjPJ-YIVdXKVdYa5jdFcvp03r6pnQobpBshxY8_PotL-4zeJznHTcKpgyczkYJ9t4aHu6LOo7-HnGRWkk3mj3nmWGm-bWqXgbxQJhSaOazKw0fdiQkqdvVHOpoTWKHBqP22wCBkg8U3aW7wz2xZRcMIiG9WDTugipnuXI85LMGyu9TRL_lcQ0xmcmVHe5cpF7vg1GkWQ3hMa5aj5"
              />
            </button>
          </div>
        </div>
      </header>

      {/* Notifications Modal */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden border border-[#eaeef2] animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 bg-[#0b2545] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#78fbb6]" />
                <h3 className="font-bold text-sm">
                  {language === 'hi' ? 'लाइव अलर्ट एवं सूचनाएं' : 'Live Alerts & Sync Alerts'}
                </h3>
              </div>
              <button 
                onClick={() => setShowNotifications(false)}
                className="p-1 rounded-full text-white/80 hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 divide-y divide-[#f0f4f8] max-h-96 overflow-y-auto">
              <div className="py-2.5 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center shrink-0 mt-0.5">
                  ⚠️
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-black text-[#93000a]">Sunita: Penicillin Anaphylaxis</p>
                    <span className="text-[10px] font-black text-[#ba1a1a] bg-[#ffdad6] px-1.5 py-0.2 rounded">CRITICAL</span>
                  </div>
                  <p className="text-[11px] text-[#44474e] mt-0.5">Fatal allergy contraindication flagged on Paramedic Break-Glass Pass.</p>
                </div>
              </div>

              <div className="py-2.5 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#75f8b3]/30 text-[#007147] flex items-center justify-center shrink-0 mt-0.5">
                  🛡️
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-[#001026]">Star Health Cashless Active</p>
                    <span className="text-[10px] text-[#007147] font-semibold">₹15L Floater</span>
                  </div>
                  <p className="text-[11px] text-[#44474e] mt-0.5">Policy SH-90218-E verified across Max, Apollo & Fortis networks.</p>
                </div>
              </div>

              <div className="py-2.5 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#d5e3ff] text-[#0b2545] flex items-center justify-center shrink-0 mt-0.5">
                  ❤️
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-[#001026]">Dadi LAD Stent & Sorbitrate SOS</p>
                    <span className="text-[10px] text-[#44474e]">Emergency Rx</span>
                  </div>
                  <p className="text-[11px] text-[#44474e] mt-0.5">Cardiology discharge summary and sublingual rescue protocol ready.</p>
                </div>
              </div>
            </div>
            <div className="p-3 bg-[#f0f4f8] flex justify-end">
              <button
                onClick={() => {
                  setShowNotifications(false);
                  onSelectTab('paramedic');
                }}
                className="px-4 py-2 bg-[#001026] text-white text-xs font-bold rounded-xl hover:bg-[#0b2545]"
              >
                {language === 'hi' ? 'पैरामेडिक पास देखें' : 'View Paramedic Pass'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden border border-[#eaeef2] animate-in fade-in">
            <div className="p-5 bg-gradient-to-br from-[#001026] to-[#0b2545] text-white text-center relative">
              <button 
                onClick={() => setShowProfileModal(false)}
                className="absolute top-3 right-3 p-1 rounded-full text-white/80 hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
              <img
                alt="Rajesh"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyumfeA8X8clOqPgx0EcZo1Re5BjPJ-YIVdXKVdYa5jdFcvp03r6pnQobpBshxY8_PotL-4zeJznHTcKpgyczkYJ9t4aHu6LOo7-HnGRWkk3mj3nmWGm-bWqXgbxQJhSaOazKw0fdiQkqdvVHOpoTWKHBqP22wCBkg8U3aW7wz2xZRcMIiG9WDTugipnuXI85LMGyu9TRL_lcQ0xmcmVHe5cpF7vg1GkWQ3hMa5aj5"
                className="w-16 h-16 rounded-full mx-auto ring-4 ring-[#78fbb6]/50 shadow-md object-cover"
              />
              <h3 className="font-bold text-base mt-2">Rajesh Sharma</h3>
              <p className="text-xs text-[#b1c7f0]">Family Head • Superowner</p>
              <div className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full bg-[#75f8b3]/20 text-[#78fbb6] text-[10px] font-semibold">
                <CheckCircle2 className="w-3 h-3" />
                <span>DigiLocker & ABHA ID Active</span>
              </div>
            </div>
            <div className="p-4 space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#f0f4f8]">
                <span className="text-[#44474e]">Family Members</span>
                <span className="font-bold text-[#171c1f]">4 (Rajesh, Sunita, Aarav, Dadi)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#f0f4f8]">
                <span className="text-[#44474e]">Encrypted Documents</span>
                <span className="font-bold text-[#171c1f]">24 Verified Files</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#f0f4f8]">
                <span className="text-[#44474e]">Health Records</span>
                <span className="font-bold text-[#171c1f]">18 Active Reports</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[#44474e]">Vault Security Standard</span>
                <span className="font-bold text-[#006d43]">AES-256 GCM Zero-Knowledge</span>
              </div>
            </div>
            <div className="p-3 bg-[#f0f4f8] flex gap-2">
              <button
                onClick={() => {
                  setShowProfileModal(false);
                  onSelectTab('security');
                }}
                className="flex-1 py-2 rounded-xl bg-[#001026] text-white text-xs font-bold hover:bg-[#0b2545]"
              >
                {language === 'hi' ? 'सुरक्षा सेटिंग्स' : 'Security Settings'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
