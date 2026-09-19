import React from 'react';
import { TabView, Language } from '../types';

interface BottomNavProps {
  activeTab: TabView;
  onSelectTab: (tab: TabView) => void;
  language: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  language,
}) => {
  const tabs: {
    id: TabView;
    label: string;
    labelHi: string;
    icon: string;
    isEmergency?: boolean;
  }[] = [
    {
      id: 'sos',
      label: 'Emergency SOS',
      labelHi: 'इमरजेंसी SOS',
      icon: 'e911_emergency',
      isEmergency: true,
    },
    {
      id: 'paramedic',
      label: 'Paramedic Pass',
      labelHi: 'पैरामेडिक पास',
      icon: 'medical_information',
    },
    {
      id: 'records',
      label: 'ER Records',
      labelHi: 'मेडिकल रिकॉर्ड्स',
      icon: 'folder_shared',
    },
    {
      id: 'firstaid',
      label: 'First-Aid CPR',
      labelHi: 'प्राथमिक उपचार',
      icon: 'ecg_heart',
    },
    {
      id: 'security',
      label: 'Security',
      labelHi: 'सुरक्षा',
      icon: 'shield',
    },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 pb-safe bg-[#ffffff]/95 backdrop-blur-xl border-t border-[#eaeef2] shadow-[0_-4px_16px_rgba(11,37,69,0.06)]">
      <div className="max-w-lg mx-auto flex justify-around items-center h-16 px-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-btn-${tab.id}`}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center flex-1 h-14 gap-1 transition-all ${
                isActive
                  ? tab.isEmergency
                    ? 'text-[#ba1a1a] font-black'
                    : 'text-[#001026] font-black'
                  : tab.isEmergency
                  ? 'text-[#ba1a1a]/80 hover:text-[#ba1a1a]'
                  : 'text-[#44474e] hover:text-[#001026]'
              }`}
              type="button"
            >
              <div className="relative flex items-center justify-center">
                <span 
                  className={`material-symbols-outlined text-2xl transition-transform ${
                    isActive ? 'scale-115' : ''
                  }`}
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {tab.icon}
                </span>

                {tab.isEmergency && (
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-[#ba1a1a] animate-ping" />
                )}
              </div>
              <span className={`text-[10px] leading-tight text-center truncate max-w-[70px] ${
                isActive ? 'font-black' : 'font-semibold'
              }`}>
                {language === 'hi' ? tab.labelHi : tab.label}
              </span>
              {isActive && (
                <div className={`w-1.5 h-1.5 rounded-full -mb-1 mt-0.5 ${
                  tab.isEmergency ? 'bg-[#ba1a1a]' : 'bg-[#001026]'
                }`} />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
