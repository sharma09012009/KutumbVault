export type Language = 'en' | 'hi';

export type TabView = 'sos' | 'paramedic' | 'records' | 'firstaid' | 'security';

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  relationHi: string;
  age: number;
  avatarUrl: string;
  role: 'Superowner' | 'Co-Owner' | 'Assisted View' | 'Supervised';
  roleHi: string;
  bloodGroup: string;
  donorStatus?: string;
  criticalAllergies: string[];
  chronicConditions: string[];
  emergencyMedications: {
    name: string;
    dosage: string;
    timing: string;
    purpose: string;
    isRescue?: boolean;
  }[];
  emergencyContactName: string;
  emergencyContactPhone: string;
  abhaId: string;
  insurancePolicyNumber: string;
  insuranceTpa: string;
  sumInsured: string;
  organDonor: boolean;
  weightKg?: number;
  phone?: string;
  isUser?: boolean;
  emergencyNotes?: string;
  docCount?: number;
  healthRecordsCount?: number;
}

export type MedicalDocumentCategory = 
  | 'Emergency Discharge' 
  | 'ECG & Cardiac' 
  | 'Doctor Prescription' 
  | 'Cashless Insurance' 
  | 'Allergy & Vitals' 
  | 'Lab & ABHA Report';

export interface VaultDocument {
  id: string;
  title: string;
  titleHi: string;
  category: MedicalDocumentCategory;
  memberId: string;
  memberName: string;
  docNumber: string;
  fullDocNumber?: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  verified: boolean;
  fileSize: string;
  fileType: string;
  tags: string[];
  summary: string;
  summaryHi?: string;
  downloadUrl?: string;
  previewImageUrl?: string;
  emergencyPriority?: 'CRITICAL' | 'HIGH' | 'ROUTINE';
}

export interface HealthRecord {
  id: string;
  title: string;
  titleHi: string;
  memberId: string;
  memberName: string;
  type: 'Prescription' | 'Lab Report' | 'Vaccine' | 'Vital' | 'Discharge';
  date: string;
  doctorHospital: string;
  abhaLinked: boolean;
  notes: string;
  metric?: {
    label: string;
    value: string;
    status: 'normal' | 'attention' | 'good';
  };
  tags: string[];
}

export interface ReminderItem {
  id: string;
  title: string;
  titleHi: string;
  category: 'emergency_meds' | 'policy_renewal' | 'cardiac_lab';
  memberId: string;
  memberName: string;
  dueDate: string;
  dueText: string;
  dueTextHi: string;
  subtitle: string;
  subtitleHi: string;
  details?: string;
  isCompleted?: boolean;
  isUrgent?: boolean;
  dosage?: string;
  actionType?: 'dose' | 'renew' | 'lab' | 'refill';
}

export interface EmergencyHospital {
  id: string;
  name: string;
  distanceKm: string;
  travelTimeMin: string;
  address: string;
  emergencyPhone: string;
  cashlessNetwork: boolean;
  tpaAccepted: string[];
  icuBedsAvailable: number;
  traumaLevel: string;
  hasCathLab: boolean;
}

export interface FirstAidGuide {
  id: string;
  title: string;
  titleHi: string;
  icon: string;
  severity: 'CRITICAL' | 'URGENT' | 'CAUTION';
  shortDesc: string;
  immediateSteps: string[];
  doNots: string[];
  emergencyActionText: string;
}

export interface AuditLog {
  id: string;
  action: string;
  actionHi: string;
  details: string;
  timestamp: string;
  timeAgo: string;
  member: string;
  icon: string;
}

