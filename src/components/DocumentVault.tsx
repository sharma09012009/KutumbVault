import React, { useState } from 'react';
import { VaultDocument, FamilyMember, Language, MedicalDocumentCategory } from '../types';
import { 
  Search, 
  Eye, 
  EyeOff, 
  Share2, 
  Download, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  Plus, 
  X, 
  Copy,
  Clock,
  AlertTriangle,
  Heart,
  Pill,
  Activity,
  CreditCard,
  Building2
} from 'lucide-react';

interface DocumentVaultProps {
  documents: VaultDocument[];
  familyMembers: FamilyMember[];
  selectedMemberId: string | null;
  onSelectMember: (memberId: string | null) => void;
  language: Language;
  onOpenScanner: () => void;
  isMaskingGlobal: boolean;
  onToggleMasking: () => void;
  onAddDocument: (doc: VaultDocument) => void;
}

export const DocumentVault: React.FC<DocumentVaultProps> = ({
  documents,
  familyMembers,
  selectedMemberId,
  onSelectMember,
  language,
  onOpenScanner,
  isMaskingGlobal,
  onToggleMasking,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDoc, setSelectedDoc] = useState<VaultDocument | null>(null);
  const [sharingDoc, setSharingDoc] = useState<VaultDocument | null>(null);
  const [shareOtpCode, setShareOtpCode] = useState('8492');
  const [shareCopied, setShareCopied] = useState(false);

  // Filter logic
  const filteredDocs = documents.filter((doc) => {
    // Search query
    const query = searchQuery.toLowerCase();
    const matchesQuery = 
      doc.title.toLowerCase().includes(query) ||
      (doc.titleHi && doc.titleHi.toLowerCase().includes(query)) ||
      doc.issuer.toLowerCase().includes(query) ||
      doc.docNumber.toLowerCase().includes(query) ||
      doc.tags.some(t => t.toLowerCase().includes(query));

    // Category filter
    const matchesCategory = 
      selectedCategory === 'all' || 
      doc.category.toLowerCase().replace(/[^a-z]/g, '').includes(selectedCategory.toLowerCase().replace(/[^a-z]/g, ''));

    // Member filter
    const matchesMember = !selectedMemberId || doc.memberId === selectedMemberId || doc.memberName.toLowerCase().includes('all family');

    return matchesQuery && matchesCategory && matchesMember;
  });

  const categories: { id: string; label: string; labelHi: string; icon: string }[] = [
    { id: 'all', label: 'All Emergency Docs', labelHi: 'सभी मेडिकल रिकॉर्ड', icon: 'medical_services' },
    { id: 'discharge', label: 'Discharge Summaries', labelHi: 'डिस्चार्ज सारांश', icon: 'local_hospital' },
    { id: 'cardiac', label: 'ECG & Cardiac', labelHi: 'ईसीजी एवं हार्ट', icon: 'cardiology' },
    { id: 'prescription', label: 'Emergency Rx', labelHi: 'आपातकालीन पर्चे', icon: 'prescriptions' },
    { id: 'insurance', label: 'Cashless e-Cards', labelHi: 'कैशलेस बीमा', icon: 'health_and_safety' },
    { id: 'allergy', label: 'Allergy Alerts', labelHi: 'एलर्जी अलर्ट', icon: 'warning' },
    { id: 'lab', label: 'ABHA & Labs', labelHi: 'डिजिटल ABHA', icon: 'lab_research' },
  ];

  const handleCreateShare = (doc: VaultDocument) => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setShareOtpCode(code);
    setSharingDoc(doc);
    setShareCopied(false);
  };

  const copyShareLink = () => {
    navigator.clipboard?.writeText(
      `https://kutumbvault.in/emergency-share/${sharingDoc?.id || 'doc'}?token=${shareOtpCode}&exp=1hour`
    );
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2500);
  };

  return (
    <div className="flex flex-col w-full space-y-4 max-w-2xl mx-auto pb-8 animate-in fade-in duration-200">
      {/* 1. Header & Emergency Vault Status */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#eaeef2]">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#006d43]" />
              <h1 className="text-lg font-black text-[#001026]">
                {language === 'hi' ? 'आपातकालीन चिकित्सा वॉल्ट' : 'Emergency Medical Vault'}
              </h1>
            </div>
            <p className="text-xs text-[#44474e] mt-0.5">
              {language === 'hi'
                ? 'अस्पताल भर्ती के लिए डिस्चार्ज, ईसीजी, और कैशलेस कार्ड्स'
                : 'Hospital discharge records, latest ECGs, and cashless pre-auth cards'}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Global Masking Toggle */}
            <button
              onClick={onToggleMasking}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border ${
                isMaskingGlobal
                  ? 'bg-[#f0f4f8] text-[#001026] border-[#eaeef2] hover:bg-[#eaeef2]'
                  : 'bg-[#001026] text-white border-[#001026]'
              }`}
              type="button"
              title="Toggle Policy/ABHA ID Masking"
            >
              {isMaskingGlobal ? (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-[#ba1a1a]" />
                  <span>Masked</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 text-[#75f8b3]" />
                  <span>Unmasked</span>
                </>
              )}
            </button>

            {/* Scan Medical Document */}
            <button
              onClick={onOpenScanner}
              className="px-3.5 py-1.5 rounded-xl bg-[#006d43] text-white text-xs font-bold flex items-center gap-1 hover:bg-[#005333] transition-all active:scale-95 shadow-xs"
              type="button"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Record</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mt-3">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#44474e]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'hi'
                ? 'डिस्चार्ज सारांश, ईसीजी, दवा, या स्टार हेल्थ खोजें...'
                : 'Search discharge summary, ECG, doctor prescription, policy...'
            }
            className="w-full pl-9 pr-8 py-2.5 bg-[#f8fafc] border border-[#eaeef2] rounded-xl text-xs text-[#001026] placeholder-[#74777f] focus:outline-none focus:ring-2 focus:ring-[#006d43]/30"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#74777f] hover:text-[#001026]"
              type="button"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 2. Patient Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => onSelectMember(null)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 border ${
            selectedMemberId === null
              ? 'bg-[#001026] text-white border-[#001026]'
              : 'bg-white text-[#44474e] border-[#eaeef2] hover:bg-[#f0f4f8]'
          }`}
          type="button"
        >
          All Family ({documents.length})
        </button>

        {familyMembers.map((member) => {
          const isSelected = selectedMemberId === member.id;
          const memberDocsCount = documents.filter(d => d.memberId === member.id || d.memberName.toLowerCase().includes('all family')).length;
          return (
            <button
              key={member.id}
              onClick={() => onSelectMember(member.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 border ${
                isSelected
                  ? 'bg-[#001026] text-white border-[#001026]'
                  : 'bg-white text-[#44474e] border-[#eaeef2] hover:bg-[#f0f4f8]'
              }`}
              type="button"
            >
              <img
                src={member.avatarUrl}
                alt={member.name}
                className="w-4 h-4 rounded-full object-cover"
              />
              <span>{member.name.split(' ')[0]}</span>
              <span className="text-[10px] opacity-75">({memberDocsCount})</span>
            </button>
          );
        })}
      </div>

      {/* 3. Medical Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all border flex items-center gap-1 ${
                isSelected
                  ? 'bg-[#0b2545] text-white border-[#0b2545] shadow-xs'
                  : 'bg-white text-[#44474e] border-[#eaeef2] hover:bg-[#f0f4f8]'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-sm">{cat.icon}</span>
              <span>{language === 'hi' ? cat.labelHi : cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. Document Cards List */}
      <div className="space-y-3">
        {filteredDocs.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-[#eaeef2]">
            <Activity className="w-10 h-10 text-[#74777f] mx-auto mb-2" />
            <h3 className="text-sm font-bold text-[#001026]">
              No emergency medical records found
            </h3>
            <p className="text-xs text-[#44474e] mt-1">
              Try changing the search filter or upload new medical discharge summaries.
            </p>
            <button
              onClick={onOpenScanner}
              className="mt-4 px-4 py-2 rounded-xl bg-[#006d43] text-white text-xs font-bold"
              type="button"
            >
              Scan New Record
            </button>
          </div>
        ) : (
          filteredDocs.map((doc) => {
            const isPriorityCritical = doc.emergencyPriority === 'CRITICAL';
            return (
              <div
                key={doc.id}
                className={`bg-white rounded-2xl p-4 shadow-xs border transition-all hover:shadow-sm ${
                  isPriorityCritical
                    ? 'border-l-4 border-l-[#ba1a1a] border-[#eaeef2]'
                    : 'border-[#eaeef2]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                      isPriorityCritical
                        ? 'bg-[#ffdad6] text-[#ba1a1a]'
                        : 'bg-[#f0f4f8] text-[#006d43]'
                    }`}>
                      <FileText className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-xs font-bold text-[#006d43] bg-[#75f8b3]/20 px-2 py-0.2 rounded-md uppercase">
                          {doc.category}
                        </span>
                        {isPriorityCritical && (
                          <span className="text-[10px] font-black text-[#ba1a1a] bg-[#ffdad6] px-1.5 py-0.2 rounded-md uppercase">
                            HIGH CLINICAL PRIORITY
                          </span>
                        )}
                        <span className="text-[11px] text-[#44474e] font-semibold">
                          • {doc.memberName}
                        </span>
                      </div>

                      <h2 className="text-sm font-black text-[#001026] mt-1 tracking-tight">
                        {language === 'hi' && doc.titleHi ? doc.titleHi : doc.title}
                      </h2>

                      <p className="text-xs text-[#44474e] mt-0.5 line-clamp-2 leading-relaxed">
                        {language === 'hi' && doc.summaryHi ? doc.summaryHi : doc.summary}
                      </p>

                      {/* Document Details & Masked ID */}
                      <div className="flex flex-wrap items-center gap-2.5 mt-2.5 text-xs text-[#44474e]">
                        <span className="font-semibold text-[#001026]">
                          {doc.issuer}
                        </span>
                        <span>•</span>
                        <span className="font-mono text-[#001026] font-bold">
                          {isMaskingGlobal ? doc.docNumber : (doc.fullDocNumber || doc.docNumber)}
                        </span>
                        <span>•</span>
                        <span>Date: {doc.issueDate}</span>
                      </div>

                      {/* Clinical Badges */}
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {doc.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-[#f0f4f8] text-[10px] font-semibold text-[#001026] border border-[#eaeef2]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button
                      onClick={() => setSelectedDoc(doc)}
                      className="px-3 py-1.5 rounded-xl bg-[#001026] text-white text-xs font-bold hover:bg-[#0b2545] transition-colors"
                      type="button"
                    >
                      View
                    </button>

                    <button
                      onClick={() => handleCreateShare(doc)}
                      className="p-1.5 rounded-xl bg-[#f0f4f8] text-[#001026] hover:bg-[#eaeef2] transition-colors flex items-center justify-center border border-[#eaeef2]"
                      type="button"
                      title="1-Hour Emergency Hospital Share"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 5. Document Detail Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-3 border-b border-[#eaeef2] pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-[#ba1a1a] bg-[#ffdad6] px-2 py-0.5 rounded">
                  {selectedDoc.category}
                </span>
                <h3 className="text-base font-black text-[#001026] mt-1.5">
                  {selectedDoc.title}
                </h3>
                <p className="text-xs text-[#44474e]">
                  Patient: <strong>{selectedDoc.memberName}</strong> • {selectedDoc.issuer}
                </p>
              </div>

              <button
                onClick={() => setSelectedDoc(null)}
                className="w-8 h-8 rounded-full bg-[#f0f4f8] text-[#44474e] flex items-center justify-center font-bold"
                type="button"
              >
                ✕
              </button>
            </div>

            {/* Simulated Clinical Preview Area */}
            <div className="p-4 rounded-2xl bg-[#f8fafc] border border-[#eaeef2] space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-[#eaeef2] pb-2 text-[11px] font-bold text-[#001026]">
                <span>RECORD ID: {selectedDoc.docNumber}</span>
                <span className="text-[#006d43]">AES-256 VERIFIED</span>
              </div>

              <div className="space-y-1.5 text-xs text-[#001026]">
                <p><strong>Clinical Summary:</strong> {selectedDoc.summary}</p>
                <p><strong>Issuer / Hospital:</strong> {selectedDoc.issuer}</p>
                <p><strong>Verified Date:</strong> {selectedDoc.issueDate}</p>
                {selectedDoc.expiryDate && (
                  <p><strong>Policy Valid Till:</strong> {selectedDoc.expiryDate}</p>
                )}
              </div>

              <div className="pt-2 border-t border-[#eaeef2] flex flex-wrap gap-1">
                {selectedDoc.tags.map((t, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-white border border-[#eaeef2] rounded text-[10px]">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  handleCreateShare(selectedDoc);
                  setSelectedDoc(null);
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#006d43] text-white text-xs font-bold flex items-center justify-center gap-1.5"
                type="button"
              >
                <Share2 className="w-4 h-4" />
                <span>Generate 1-Hr Hospital Link</span>
              </button>

              <button
                onClick={() => setSelectedDoc(null)}
                className="py-2.5 px-4 rounded-xl bg-[#f0f4f8] text-[#001026] text-xs font-bold"
                type="button"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Emergency 1-Hour Hospital Share Modal */}
      {sharingDoc && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#ba1a1a]" />
                <span className="text-xs font-bold uppercase text-[#001026]">
                  1-Hour Emergency ER Link
                </span>
              </div>
              <button
                onClick={() => setSharingDoc(null)}
                className="w-7 h-7 rounded-full bg-[#f0f4f8] text-[#44474e] flex items-center justify-center font-bold text-xs"
                type="button"
              >
                ✕
              </button>
            </div>

            <div className="text-center">
              <h3 className="text-sm font-black text-[#001026]">
                {sharingDoc.title}
              </h3>
              <p className="text-xs text-[#44474e] mt-1">
                Temporary access link for hospital desk. Automatically revokes in 60 minutes.
              </p>
            </div>

            <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#eaeef2] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#44474e]">Single-Use Access Token:</span>
                <span className="font-mono font-bold text-[#ba1a1a] text-sm tracking-widest">{shareOtpCode}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#006d43]">
                <span>Status:</span>
                <span>Active for 59m 59s</span>
              </div>
            </div>

            <button
              onClick={copyShareLink}
              className="w-full py-3 rounded-xl bg-[#001026] text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#0b2545] transition-colors"
              type="button"
            >
              <Copy className="w-4 h-4" />
              <span>{shareCopied ? 'Link Copied to Clipboard!' : 'Copy ER Access Link'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
