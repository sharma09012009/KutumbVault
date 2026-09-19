import React, { useState, useEffect, useRef } from 'react';
import { 
  TabView, 
  Language, 
  VaultDocument, 
  HealthRecord, 
  ReminderItem, 
  FamilyMember,
  AuditLog
} from './types';
import { 
  INITIAL_FAMILY_MEMBERS, 
  INITIAL_DOCUMENTS, 
  INITIAL_HEALTH_RECORDS, 
  INITIAL_REMINDERS, 
  INITIAL_AUDIT_LOGS 
} from './data/mockData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DocumentVault } from './components/DocumentVault';
import { HealthRecords } from './components/HealthRecords';
import { EmergencySOSView } from './components/EmergencySOSView';
import { ParamedicPassView } from './components/ParamedicPassView';
import { FirstAidView } from './components/FirstAidView';
import { SecurityPrivacyView } from './components/SecurityPrivacyView';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { ScannerModal } from './components/ScannerModal';
import { AppLockScreen } from './components/AppLockScreen';
import { PanicScreen } from './components/PanicScreen';
import { encryptData, decryptData } from './lib/crypto';

export function App() {
  // Global View & UI states
  const [activeTab, setActiveTab] = useState<TabView>('sos');
  const [recordsSubView, setRecordsSubView] = useState<'vault' | 'vitals'>('vault');
  const [language, setLanguage] = useState<Language>('en');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [isMaskingGlobal, setIsMaskingGlobal] = useState<boolean>(true);

  // Security & App Lock State
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [isCamouflage, setIsCamouflage] = useState<boolean>(false);
  const [savedPin, setSavedPin] = useState<string>(() => {
    return localStorage.getItem('kutumb_vault_pin') || '1234';
  });
  const [familyName, setFamilyName] = useState<string>(() => {
    return localStorage.getItem('kutumb_vault_family_name') || 'The Sharma Family';
  });
  const [autoLockDuration, setAutoLockDuration] = useState<string>(() => {
    return localStorage.getItem('kutumb_vault_autolock') || '5m';
  });

  // Modals
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Vault Persistent Data States
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(() => {
    const saved = localStorage.getItem('kutumb_vault_members');
    return saved ? JSON.parse(saved) : INITIAL_FAMILY_MEMBERS;
  });

  const [documents, setDocuments] = useState<VaultDocument[]>(() => {
    const saved = localStorage.getItem('kutumb_vault_docs');
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>(() => {
    const saved = localStorage.getItem('kutumb_vault_health');
    return saved ? JSON.parse(saved) : INITIAL_HEALTH_RECORDS;
  });

  const [reminders, setReminders] = useState<ReminderItem[]>(() => {
    const saved = localStorage.getItem('kutumb_vault_reminders');
    return saved ? JSON.parse(saved) : INITIAL_REMINDERS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('kutumb_vault_audit');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // Save changes to localStorage automatically
  useEffect(() => {
    localStorage.setItem('kutumb_vault_members', JSON.stringify(familyMembers));
  }, [familyMembers]);

  useEffect(() => {
    localStorage.setItem('kutumb_vault_docs', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('kutumb_vault_health', JSON.stringify(healthRecords));
  }, [healthRecords]);

  useEffect(() => {
    localStorage.setItem('kutumb_vault_reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem('kutumb_vault_audit', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('kutumb_vault_pin', savedPin);
  }, [savedPin]);

  useEffect(() => {
    localStorage.setItem('kutumb_vault_family_name', familyName);
  }, [familyName]);

  useEffect(() => {
    localStorage.setItem('kutumb_vault_autolock', autoLockDuration);
  }, [autoLockDuration]);

  // Handle Tab Switcher / Blur Auto-lock & Panic 'Escape' Key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCamouflage(prev => !prev);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        if (autoLockDuration === 'immediate') {
          setIsLocked(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [autoLockDuration]);

  // Language toggle
  const handleToggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'hi' : 'en'));
  };

  // Masking toggle
  const handleToggleMasking = () => {
    setIsMaskingGlobal(prev => !prev);
  };

  // Add new document handler
  const handleAddDocument = (newDoc: VaultDocument) => {
    setDocuments(prev => [newDoc, ...prev]);
    setAuditLogs(prev => [
      {
        id: `audit-${Date.now()}`,
        action: 'Document Upload & Encrypted',
        actionHi: 'दस्तावेज़ अपलोड एवं एन्क्रिप्ट किया गया',
        timeAgo: 'Just now',
        timestamp: new Date().toLocaleTimeString(),
        member: newDoc.memberName,
        details: `${newDoc.title} added for ${newDoc.memberName} with AES-256 seal.`,
        icon: 'badge',
      },
      ...prev,
    ]);
  };

  // Add health record handler
  const handleAddHealthRecord = (newRec: HealthRecord) => {
    setHealthRecords(prev => [newRec, ...prev]);
    setAuditLogs(prev => [
      {
        id: `audit-${Date.now()}`,
        action: 'Health Record Linked',
        actionHi: 'स्वास्थ्य रिकॉर्ड लिंक किया गया',
        timeAgo: 'Just now',
        timestamp: new Date().toLocaleTimeString(),
        member: newRec.memberName,
        details: `${newRec.title} saved to ABHA health vault for ${newRec.memberName}.`,
        icon: 'pill',
      },
      ...prev,
    ]);
  };

  // Add reminder handler
  const handleAddReminder = (newRem: ReminderItem) => {
    setReminders(prev => [newRem, ...prev]);
  };

  // Add family member handler
  const handleAddFamilyMember = (newMem: Partial<FamilyMember>) => {
    const member: FamilyMember = {
      id: `member-${Date.now()}`,
      name: newMem.name || 'Family Member',
      relation: newMem.relation || 'Relative',
      relationHi: newMem.relationHi || 'संबंधी',
      age: newMem.age || 25,
      bloodGroup: newMem.bloodGroup || 'O+',
      role: (newMem.role as any) || 'Supervised',
      roleHi: newMem.roleHi || 'निगरानी में',
      docCount: 0,
      healthRecordsCount: 0,
      avatarUrl: newMem.avatarUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyumfeA8X8clOqPgx0EcZo1Re5BjPJ-YIVdXKVdYa5jdFcvp03r6pnQobpBshxY8_PotL-4zeJznHTcKpgyczkYJ9t4aHu6LOo7-HnGRWkk3mj3nmWGm-bWqXgbxQJhSaOazKw0fdiQkqdvVHOpoTWKHBqP22wCBkg8U3aW7wz2xZRcMIiG9WDTugipnuXI85LMGyu9TRL_lcQ0xmcmVHe5cpF7vg1GkWQ3hMa5aj5',
      criticalAllergies: newMem.criticalAllergies || [],
      chronicConditions: newMem.chronicConditions || [],
      emergencyMedications: newMem.emergencyMedications || [],
      emergencyContactName: newMem.emergencyContactName || 'Emergency Contact',
      emergencyContactPhone: newMem.emergencyContactPhone || '112',
      abhaId: newMem.abhaId || 'ABHA-NEW',
      insurancePolicyNumber: newMem.insurancePolicyNumber || 'INS-FLOATER',
      insuranceTpa: newMem.insuranceTpa || '24x7 Cashless TPA',
      sumInsured: newMem.sumInsured || '₹10,00,000',
      organDonor: newMem.organDonor ?? false,
    };
    setFamilyMembers(prev => [...prev, member]);
  };

  // Export Encrypted Vault Backup
  const handleExportVaultBackup = async () => {
    try {
      const payload = JSON.stringify({
        familyName,
        familyMembers,
        documents,
        healthRecords,
        reminders,
        auditLogs,
        exportedAt: new Date().toISOString(),
      });

      const encrypted = await encryptData(payload, savedPin);
      const blob = new Blob([JSON.stringify(encrypted, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kutumb-vault-encrypted-${Date.now()}.enc`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Failed to export encrypted backup.');
    }
  };

  // Import Encrypted Vault Backup
  const handleImportVaultBackup = async (file: File) => {
    try {
      const text = await file.text();
      const encryptedObj = JSON.parse(text);
      const password = prompt('Enter your Master PIN or Password to decrypt this backup:');
      if (!password) return;

      const decrypted = await decryptData(encryptedObj, password);
      const data = JSON.parse(decrypted);

      if (data.familyMembers) setFamilyMembers(data.familyMembers);
      if (data.documents) setDocuments(data.documents);
      if (data.healthRecords) setHealthRecords(data.healthRecords);
      if (data.reminders) setReminders(data.reminders);
      if (data.auditLogs) setAuditLogs(data.auditLogs);
      if (data.familyName) setFamilyName(data.familyName);

      alert('Vault successfully restored and decrypted!');
    } catch (err) {
      console.error(err);
      alert('Decryption failed! Incorrect PIN/Password or corrupted file.');
    }
  };

  // Reset Vault
  const handleResetVault = (mode: 'clean' | 'demo') => {
    if (mode === 'clean') {
      const confirmed = window.confirm(
        'Start a clean vault for your own family? This will remove sample documents so you can add your real family members.'
      );
      if (confirmed) {
        setFamilyName('My Family');
        setFamilyMembers([
          {
            id: 'admin-user',
            name: 'Rajesh Sharma',
            relation: 'Self',
            relationHi: 'स्वयं',
            age: 42,
            role: 'Superowner',
            roleHi: 'सुपर-ओनर',
            bloodGroup: 'O+',
            docCount: 0,
            healthRecordsCount: 0,
            avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyumfeA8X8clOqPgx0EcZo1Re5BjPJ-YIVdXKVdYa5jdFcvp03r6pnQobpBshxY8_PotL-4zeJznHTcKpgyczkYJ9t4aHu6LOo7-HnGRWkk3mj3nmWGm-bWqXgbxQJhSaOazKw0fdiQkqdvVHOpoTWKHBqP22wCBkg8U3aW7wz2xZRcMIiG9WDTugipnuXI85LMGyu9TRL_lcQ0xmcmVHe5cpF7vg1GkWQ3hMa5aj5',
            isUser: true,
            criticalAllergies: [],
            chronicConditions: ['Pre-hypertension'],
            emergencyMedications: [],
            emergencyContactName: 'Sunita Sharma (Wife)',
            emergencyContactPhone: '+91 98101 23456',
            abhaId: '91-8274-1923-8821',
            insurancePolicyNumber: 'SH-90218-E',
            insuranceTpa: 'Star Health 24x7 TPA',
            sumInsured: '₹15,00,000 Floater',
            organDonor: true,
          }
        ]);
        setDocuments([]);
        setHealthRecords([]);
        setReminders([]);
        setAuditLogs([
          {
            id: `audit-${Date.now()}`,
            action: 'Clean Vault Initialized',
            actionHi: 'स्वच्छ वॉल्ट प्रारंभ किया गया',
            timeAgo: 'Just now',
            timestamp: new Date().toLocaleTimeString(),
            member: 'Me',
            details: 'Ready for production private family documents.',
            icon: 'lock',
          }
        ]);
      }
    } else {
      const confirmed = window.confirm('Reload sample demo data?');
      if (confirmed) {
        setFamilyName('The Sharma Family');
        setFamilyMembers(INITIAL_FAMILY_MEMBERS);
        setDocuments(INITIAL_DOCUMENTS);
        setHealthRecords(INITIAL_HEALTH_RECORDS);
        setReminders(INITIAL_REMINDERS);
        setAuditLogs(INITIAL_AUDIT_LOGS);
      }
    }
  };

  // If Camouflage / Panic Mode is triggered
  if (isCamouflage) {
    return (
      <PanicScreen
        onExitCamouflage={() => {
          setIsCamouflage(false);
          setIsLocked(true); // Return to locked PIN screen for extra safety!
        }}
      />
    );
  }

  // If Vault is Locked with PIN
  if (isLocked) {
    return (
      <AppLockScreen
        language={language}
        savedPin={savedPin}
        onUpdatePin={(newPin) => setSavedPin(newPin)}
        onUnlock={() => setIsLocked(false)}
        familyName={familyName}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#171c1f] flex flex-col font-sans selection:bg-[#75f8b3] selection:text-[#007147]">
      {/* Top Fixed Header */}
      <Header
        language={language}
        onToggleLanguage={handleToggleLanguage}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onLockVaultNow={() => setIsLocked(true)}
        onTriggerCamouflage={() => setIsCamouflage(true)}
        familyName={familyName}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-4 pt-20 pb-24">
        {activeTab === 'sos' && (
          <EmergencySOSView
            familyMembers={familyMembers}
            language={language}
            onOpenParamedicPass={() => setActiveTab('paramedic')}
          />
        )}

        {activeTab === 'paramedic' && (
          <ParamedicPassView
            familyMembers={familyMembers}
            selectedMemberId={selectedMemberId}
            onSelectMember={setSelectedMemberId}
            language={language}
            onOpenSOS={() => setActiveTab('sos')}
          />
        )}

        {activeTab === 'records' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Top Sub-Navigation Toggle for ER Records */}
            <div className="bg-white rounded-2xl p-1.5 shadow-xs border border-[#eaeef2] flex items-center gap-1.5 max-w-md mx-auto">
              <button
                type="button"
                onClick={() => setRecordsSubView('vault')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  recordsSubView === 'vault'
                    ? 'bg-[#001026] text-white shadow-xs'
                    : 'bg-[#f8fafc] text-[#44474e] hover:text-[#001026]'
                }`}
              >
                <span className="material-symbols-outlined text-sm">folder_shared</span>
                <span>{language === 'hi' ? 'आपातकालीन दस्तावेज़ (24)' : 'Emergency Documents (24)'}</span>
              </button>

              <button
                type="button"
                onClick={() => setRecordsSubView('vitals')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  recordsSubView === 'vitals'
                    ? 'bg-[#ba1a1a] text-white shadow-xs'
                    : 'bg-[#f8fafc] text-[#44474e] hover:text-[#001026]'
                }`}
              >
                <span className="material-symbols-outlined text-sm">ecg_heart</span>
                <span>{language === 'hi' ? 'वाइटल्स एवं ABHA' : 'Vitals & ABHA Log'}</span>
              </button>
            </div>

            {recordsSubView === 'vault' ? (
              <DocumentVault
                documents={documents}
                familyMembers={familyMembers}
                selectedMemberId={selectedMemberId}
                onSelectMember={setSelectedMemberId}
                language={language}
                onOpenScanner={() => setIsScannerOpen(true)}
                isMaskingGlobal={isMaskingGlobal}
                onToggleMasking={handleToggleMasking}
                onAddDocument={handleAddDocument}
              />
            ) : (
              <HealthRecords
                healthRecords={healthRecords}
                familyMembers={familyMembers}
                selectedMemberId={selectedMemberId}
                onSelectMember={setSelectedMemberId}
                language={language}
                onOpenScanner={() => setIsScannerOpen(true)}
                onAddRecord={handleAddHealthRecord}
              />
            )}
          </div>
        )}

        {activeTab === 'firstaid' && (
          <FirstAidView
            language={language}
            onOpenAssistantWithPrompt={() => {
              setIsAssistantOpen(true);
            }}
          />
        )}

        {activeTab === 'security' && (
          <SecurityPrivacyView
            language={language}
            onBackToHome={() => setActiveTab('sos')}
            auditLogs={auditLogs}
            familyMembers={familyMembers}
            isMaskingGlobal={isMaskingGlobal}
            onToggleMasking={handleToggleMasking}
            savedPin={savedPin}
            onUpdatePin={(newPin) => setSavedPin(newPin)}
            onLockVaultNow={() => setIsLocked(true)}
            onTriggerCamouflage={() => setIsCamouflage(true)}
            familyName={familyName}
            onUpdateFamilyName={(name) => setFamilyName(name)}
            onExportVaultBackup={handleExportVaultBackup}
            onImportVaultBackup={handleImportVaultBackup}
            onResetVault={handleResetVault}
            autoLockDuration={autoLockDuration}
            onUpdateAutoLockDuration={(d) => setAutoLockDuration(d)}
          />
        )}
      </main>

      {/* Bottom Floating App Navigation */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        language={language}
      />

      {/* Voice Assistant Modal */}
      <VoiceAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        language={language}
      />

      {/* AI Document Scanner Modal */}
      <ScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        language={language}
        familyMembers={familyMembers}
        onSaveDocument={handleAddDocument}
      />
    </div>
  );
}

export default App;
