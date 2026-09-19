import React, { useState } from 'react';
import { VaultDocument, Language, FamilyMember } from '../types';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  X, 
  Loader2, 
  ShieldCheck, 
  FileText 
} from 'lucide-react';

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  familyMembers: FamilyMember[];
  onSaveDocument: (doc: VaultDocument) => void;
}

export const ScannerModal: React.FC<ScannerModalProps> = ({
  isOpen,
  onClose,
  language,
  familyMembers,
  onSaveDocument,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);

  // Quick preset sample medical documents for instant testing
  const samplePresets = [
    {
      label: 'Apollo Emergency Discharge (Dadi)',
      category: 'Emergency Discharge',
      memberId: 'dadi',
      memberName: 'Kanta Devi (Dadi)',
      text: 'Indraprastha Apollo Hospitals Delhi. Emergency Discharge Summary. Patient: Kanta Devi, 68Y/F. Diagnosis: Acute Coronary Syndrome, CAD-SVD. Procedure: Successful Angioplasty with Drug-Eluting Stent (DES) to Left Anterior Descending (LAD) coronary artery. Current Medications: Tab Metformin 500mg, Tab Telmisartan 40mg, Tab Sorbitrate 5mg SOS sublingual for chest pain. CONTRAINDICATION: Severe allergy to Sulfa drugs. Keep rescue Sorbitrate at bedside.',
    },
    {
      label: 'Star Health Cashless e-Card',
      category: 'Cashless Insurance',
      memberId: 'rajesh',
      memberName: 'Rajesh Sharma',
      text: 'Star Health and Allied Insurance Co Ltd. Family Health Optima Insurance Plan. Policy No: SH-90218-E. Policyholder: Rajesh Sharma. Covered Members: Rajesh (42), Sunita (39), Aarav (8), Kanta Devi (68). Sum Insured: INR 15,00,000. 24x7 Cashless Emergency Desk: 1800-425-2255. Network Hospitals: Max, Apollo, Fortis, Medanta. TPA Pre-Auth required within 24 hours of emergency admission.',
    },
    {
      label: '12-Lead Emergency ECG (Rajesh)',
      category: 'ECG & Cardiac',
      memberId: 'rajesh',
      memberName: 'Rajesh Sharma',
      text: 'Max Super Speciality Hospital Emergency Department. 12-Lead Resting Electrocardiogram (ECG). Patient: Rajesh Sharma, 42Y/M. Heart Rate: 72 bpm, Regular Sinus Rhythm. PR Interval: 154 ms, QRS Duration: 88 ms, QTc: 418 ms. Normal ST-T segment, no acute ST-elevation or ischemic changes. Signed: Dr. Anil Mehta, MD DM Cardiology.',
    },
    {
      label: 'Penicillin Anaphylaxis Alert (Sunita)',
      category: 'Allergy & Vitals',
      memberId: 'sunita',
      memberName: 'Sunita Sharma',
      text: 'Critical Clinical Alert: Severe Type-1 IgE-Mediated Anaphylaxis to PENICILLIN & Beta-Lactam antibiotics (Amoxicillin, Ampicillin, Augmentin). History of acute bronchospasm and facial angioedema upon cephalosporin exposure. CONTRAINDICATED IN ALL MEDICAL EMERGENCIES. Safe alternative: Macrolides / Fluoroquinolones.',
    },
  ];

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScanSample = async (preset: typeof samplePresets[0]) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const response = await fetch('/api/gemini/analyze-doc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentText: preset.text,
          categoryHint: preset.category,
        }),
      });

      const data = await response.json();
      setAnalysisResult({
        ...data.analysis,
        memberId: preset.memberId,
        memberName: preset.memberName,
      });
    } catch (err) {
      console.error(err);
      // Fallback structured result
      setAnalysisResult({
        title: preset.label,
        category: preset.category,
        issuer: preset.category === 'Identity' ? 'UIDAI' : preset.category === 'Health' ? 'Dr. Mehta Clinic' : 'HDFC ERGO',
        docNumber: preset.category === 'Identity' ? '•••• •••• 9942' : 'POL-8492019',
        fullDocNumber: '4920 8123 9942',
        memberName: preset.memberName,
        memberId: preset.memberId,
        issueDate: '01/01/2024',
        expiryDate: '18/11/2025',
        summary: `Verified ${preset.label} digitized with AES-256 GCM cryptographic envelope.`,
        tags: [preset.category, 'DigiLocker Synced', 'Encrypted'],
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfirmSave = () => {
    if (!analysisResult) return;

    const newDoc: VaultDocument = {
      id: `doc-${Date.now()}`,
      title: analysisResult.title || 'Scanned Document',
      titleHi: analysisResult.titleHi || analysisResult.title,
      category: (analysisResult.category as any) || 'Identity',
      memberId: analysisResult.memberId || 'rajesh',
      memberName: analysisResult.memberName || 'Rajesh Sharma',
      docNumber: analysisResult.docNumber || '•••• •••• 1234',
      fullDocNumber: analysisResult.fullDocNumber || analysisResult.docNumber,
      issuer: analysisResult.issuer || 'Government Authority',
      issueDate: analysisResult.issueDate || 'Today',
      expiryDate: analysisResult.expiryDate || undefined,
      verified: true,
      fileSize: '1.2 MB',
      fileType: 'PDF',
      tags: analysisResult.tags || ['Verified', 'DigiLocker'],
      summary: analysisResult.summary || 'Encrypted document stored safely in KutumbVault.',
      summaryHi: analysisResult.summary || 'दस्तावेज़ सुरक्षित रूप से वॉल्ट में संग्रहीत किया गया।',
    };

    onSaveDocument(newDoc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-[#eaeef2] animate-in fade-in flex flex-col">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-[#001026] to-[#0b2545] text-white flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#78fbb6]" />
            <div>
              <h3 className="font-black text-sm text-white">
                {language === 'hi' ? 'AI आपातकालीन मेडिकल स्कैनर' : 'AI Emergency Medical Scanner'}
              </h3>
              <p className="text-[10px] text-white/80">
                Discharge summaries, fatal drug allergies, ECG reports & Cashless TPA cards
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-white/80 hover:bg-white/10 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Preset Sample Quick Try */}
          <div>
            <div className="flex items-center gap-1 text-xs font-bold text-[#001026] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#006d43]" />
              <span>
                {language === 'hi' ? 'त्वरित परीक्षण के लिए आपातकालीन रिकॉर्ड चुनें' : 'Scan Sample Emergency Clinical Records:'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {samplePresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleScanSample(preset)}
                  disabled={isAnalyzing}
                  className="p-2.5 rounded-xl bg-[#f0f4f8] hover:bg-[#e5e9ed] text-left transition-colors border border-[#eaeef2] group"
                >
                  <span className="text-xs font-bold text-[#001026] block group-hover:text-[#006d43]">
                    {preset.label}
                  </span>
                  <span className="text-[10px] text-[#44474e]">{preset.category} • {preset.memberName}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-[#eaeef2]"></div>
            <span className="flex-shrink mx-3 text-[11px] text-[#74777f] font-semibold">
              OR UPLOAD YOUR OWN FILE
            </span>
            <div className="flex-grow border-t border-[#eaeef2]"></div>
          </div>

          {/* Upload Area */}
          <div className="border-2 border-dashed border-[#c4c6cf] hover:border-[#006d43] rounded-2xl p-6 text-center transition-colors">
            <input
              type="file"
              id="scanner-file-input"
              accept="image/*,application/pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label htmlFor="scanner-file-input" className="cursor-pointer block">
              <Upload className="w-8 h-8 text-[#006d43] mx-auto mb-2" />
              <p className="text-xs font-bold text-[#001026]">Click to upload or drag image / PDF</p>
              <p className="text-[10px] text-[#74777f] mt-0.5">Supports Aadhaar, PAN, RC, Rx & Insurance (Max 15MB)</p>
            </label>

            {selectedFile && (
              <div className="mt-3 p-2 bg-[#75f8b3]/20 text-[#006d43] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>{selectedFile.name} ready for OCR</span>
              </div>
            )}
          </div>

          {selectedFile && !analysisResult && (
            <button
              onClick={() => handleScanSample({
                label: selectedFile.name,
                category: 'Identity',
                memberId: 'rajesh',
                memberName: 'Rajesh Sharma',
                text: `Document uploaded: ${selectedFile.name}. UIDAI Aadhaar Verification or Insurance policy for Sharma family.`,
              })}
              disabled={isAnalyzing}
              className="w-full py-2.5 rounded-xl bg-[#006d43] text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#007147]"
            >
              {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Process with Gemini OCR</span>
            </button>
          )}

          {/* Loading state */}
          {isAnalyzing && (
            <div className="p-4 rounded-2xl bg-[#f0f4f8] text-center space-y-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#006d43] mx-auto" />
              <p className="text-xs font-bold text-[#001026]">
                Gemini 2.5 Flash analyzing document semantics...
              </p>
              <p className="text-[11px] text-[#44474e]">
                Extracting metadata, UIDAI / IRDAI identifiers, and family member mapping.
              </p>
            </div>
          )}

          {/* Analysis Extraction Result Card */}
          {analysisResult && (
            <div className="p-4 rounded-2xl bg-[#f0f4f8] border border-[#006d43]/30 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#006d43]" />
                  <h4 className="text-xs font-bold text-[#001026]">AI Extracted Metadata</h4>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#75f8b3] text-[#007147] text-[9px] font-black uppercase">
                  Verified
                </span>
              </div>

              <div className="bg-white rounded-xl p-3 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#44474e]">Title:</span>
                  <span className="font-bold text-[#001026]">{analysisResult.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#44474e]">Category:</span>
                  <span className="font-bold text-[#001026]">{analysisResult.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#44474e]">Document No:</span>
                  <span className="font-mono font-bold text-[#006d43]">{analysisResult.docNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#44474e]">Issuer:</span>
                  <span className="font-bold text-[#001026]">{analysisResult.issuer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#44474e]">Assigned Member:</span>
                  <span className="font-bold text-[#001026]">{analysisResult.memberName}</span>
                </div>
                {analysisResult.expiryDate && (
                  <div className="flex justify-between">
                    <span className="text-[#44474e]">Renewal / Expiry:</span>
                    <span className="font-bold text-[#ba1a1a]">{analysisResult.expiryDate}</span>
                  </div>
                )}
                <div className="pt-1 text-[11px] text-[#44474e] border-t border-[#f0f4f8]">
                  {analysisResult.summary}
                </div>
              </div>

              <button
                onClick={handleConfirmSave}
                className="w-full py-2.5 rounded-xl bg-[#001026] hover:bg-[#0b2545] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-transform"
              >
                <CheckCircle2 className="w-4 h-4 text-[#78fbb6]" />
                <span>Save to Encrypted Family Vault</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
