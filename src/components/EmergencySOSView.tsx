import React, { useState, useEffect } from 'react';
import { FamilyMember, Language } from '../types';
import { EMERGENCY_HOSPITALS } from '../data/mockData';
import { 
  PhoneCall, 
  QrCode, 
  Share2, 
  CheckCircle2, 
  MapPin,
  Navigation,
  Activity,
  AlertTriangle,
  Building2,
  Clock,
  ShieldCheck,
  Send,
  Radio
} from 'lucide-react';

interface EmergencySOSViewProps {
  familyMembers: FamilyMember[];
  language: Language;
  onOpenParamedicPass?: () => void;
}

export const EmergencySOSView: React.FC<EmergencySOSViewProps> = ({
  familyMembers,
  language,
  onOpenParamedicPass,
}) => {
  const [sosSent, setSosSent] = useState(false);
  const [gpsLocation, setGpsLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
    accuracy: string;
    timestamp: string;
  }>({
    lat: 28.5244,
    lng: 77.2066,
    address: 'Saket, New Delhi, Delhi 110017 (Near Press Enclave)',
    accuracy: 'Accurate to 8 meters',
    timestamp: new Date().toLocaleTimeString(),
  });
  const [isLocating, setIsLocating] = useState(false);

  // Attempt real browser geolocation if available
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsLocation({
            lat: Number(pos.coords.latitude.toFixed(5)),
            lng: Number(pos.coords.longitude.toFixed(5)),
            address: `GPS Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)}`,
            accuracy: `Accurate to ${Math.round(pos.coords.accuracy)} meters`,
            timestamp: new Date().toLocaleTimeString(),
          });
        },
        () => {
          // Graceful fallback to default NCR coordinates
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, []);

  const handleRefreshGps = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsLocation({
            lat: Number(pos.coords.latitude.toFixed(5)),
            lng: Number(pos.coords.longitude.toFixed(5)),
            address: `GPS Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)}`,
            accuracy: `Accurate to ${Math.round(pos.coords.accuracy)}m (Live Satellite)`,
            timestamp: new Date().toLocaleTimeString(),
          });
          setIsLocating(false);
        },
        () => {
          setIsLocating(false);
        }
      );
    } else {
      setTimeout(() => setIsLocating(false), 800);
    }
  };

  const handleTriggerSOS = () => {
    setSosSent(true);
    // WhatsApp pre-formatted broadcast message
    const mapsLink = `https://maps.google.com/?q=${gpsLocation.lat},${gpsLocation.lng}`;
    const sosMessage = encodeURIComponent(
      `🚨 EMERGENCY MEDICAL SOS ALERT!
A family member requires immediate medical attention.
📍 Live GPS Location: ${mapsLink} (${gpsLocation.address})
Critical Medical Alert:
- Kanta Devi (Dadi, 68y, Blood: B+): Cardiac Stent in LAD, Severe SULFA Allergy. Sorbitrate SOS under tongue.
- Sunita Sharma (39y, Blood: A+): FATAL PENICILLIN ANAPHYLAXIS.
- Star Health Cashless Policy: SH-90218-E (Toll-Free: 1800-425-2255)
Please send ambulance or assist immediately!`
    );

    window.open(`https://wa.me/?text=${sosMessage}`, '_blank');
  };

  return (
    <div className="flex flex-col w-full space-y-4 max-w-2xl mx-auto pb-8 animate-in fade-in duration-200">
      {/* 1. Main 1-Tap SOS Dispatch Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#ba1a1a] via-[#93000a] to-[#410002] p-5 sm:p-6 text-white shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-black uppercase mb-2">
              <Radio className="w-3.5 h-3.5 animate-pulse text-white" />
              <span>1-TAP EMERGENCY DISPATCH HUB</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
              {language === 'hi' ? 'आपातकालीन सहायता (SOS)' : 'Emergency Medical SOS'}
            </h1>
            <p className="text-xs text-white/90 mt-1 max-w-md">
              Broadcasts live GPS location, blood group, critical drug allergies, and cashless hospital policy to all ICE contacts.
            </p>
          </div>

          {onOpenParamedicPass && (
            <button
              onClick={onOpenParamedicPass}
              className="shrink-0 p-3 rounded-2xl bg-white text-[#ba1a1a] font-black text-xs flex flex-col items-center gap-1 shadow-md hover:bg-white/90 active:scale-95 transition-transform"
              type="button"
            >
              <QrCode className="w-6 h-6" />
              <span className="text-[10px]">Medical QR</span>
            </button>
          )}
        </div>

        {/* Live GPS Coordinates Banner */}
        <div className="mt-4 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <MapPin className="w-5 h-5 text-[#75f8b3] shrink-0 animate-bounce" />
            <div className="min-w-0">
              <span className="text-xs font-black text-white block truncate">
                {gpsLocation.address}
              </span>
              <span className="text-[10px] text-white/70">
                {gpsLocation.accuracy} • Updated: {gpsLocation.timestamp}
              </span>
            </div>
          </div>

          <button
            onClick={handleRefreshGps}
            className="shrink-0 px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[10px] font-bold transition-colors"
            type="button"
          >
            {isLocating ? 'Pinging...' : 'Update GPS'}
          </button>
        </div>

        {/* 1-Tap SOS Dispatch Broadcast Button */}
        <div className="mt-4">
          <button
            onClick={handleTriggerSOS}
            className="w-full py-4 rounded-2xl bg-white hover:bg-white/90 text-[#ba1a1a] font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl active:scale-98 transition-all"
            type="button"
          >
            <Send className="w-5 h-5 fill-[#ba1a1a]" />
            <span>DISPATCH SOS WITH LIVE GPS & MEDICAL PASS</span>
          </button>
          {sosSent && (
            <p className="text-center text-xs text-[#75f8b3] font-bold mt-2">
              ✓ WhatsApp emergency alert window launched with live coordinates & medical allergy warnings!
            </p>
          )}
        </div>
      </div>

      {/* 2. Direct Emergency Calling Hotlines */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#eaeef2]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#001026] flex items-center gap-1.5">
            <PhoneCall className="w-3.5 h-3.5 text-[#ba1a1a]" />
            <span>Instant Emergency Dialers (त्वरित कॉल)</span>
          </h2>
          <span className="text-[10px] font-bold text-[#006d43] px-2 py-0.5 rounded bg-[#75f8b3]/20">
            Toll-Free 24x7
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* 108 Ambulance */}
          <a
            href="tel:108"
            className="p-3.5 rounded-xl bg-[#ffdad6]/40 hover:bg-[#ffdad6]/70 border border-[#ba1a1a]/30 flex items-center justify-between transition-colors shadow-xs"
          >
            <div>
              <span className="text-sm font-black text-[#93000a] block">108 Ambulance</span>
              <span className="text-[10px] text-[#ba1a1a] font-semibold">Government Medical ER</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#ba1a1a] text-white flex items-center justify-center shadow-xs">
              <PhoneCall className="w-4 h-4" />
            </div>
          </a>

          {/* 112 National Emergency */}
          <a
            href="tel:112"
            className="p-3.5 rounded-xl bg-[#f0f4f8] hover:bg-[#e5e9ed] border border-[#eaeef2] flex items-center justify-between transition-colors shadow-xs"
          >
            <div>
              <span className="text-sm font-black text-[#001026] block">112 National</span>
              <span className="text-[10px] text-[#44474e]">Police • Fire • Medical</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#001026] text-white flex items-center justify-center shadow-xs">
              <PhoneCall className="w-4 h-4" />
            </div>
          </a>

          {/* Apollo Cardiac 1066 */}
          <a
            href="tel:1066"
            className="p-3.5 rounded-xl bg-[#f0f4f8] hover:bg-[#e5e9ed] border border-[#eaeef2] flex items-center justify-between transition-colors shadow-xs"
          >
            <div>
              <span className="text-sm font-black text-[#001026] block">1066 Apollo Heart</span>
              <span className="text-[10px] text-[#44474e]">Stroke & Cardiac Rescue</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#006d43] text-white flex items-center justify-center shadow-xs">
              <PhoneCall className="w-4 h-4" />
            </div>
          </a>

          {/* Star Health TPA */}
          <a
            href="tel:18004252255"
            className="p-3.5 rounded-xl bg-[#f0f4f8] hover:bg-[#e5e9ed] border border-[#eaeef2] flex items-center justify-between transition-colors shadow-xs"
          >
            <div>
              <span className="text-sm font-black text-[#001026] block">Star Health TPA</span>
              <span className="text-[10px] text-[#44474e]">1800-425-2255 (Cashless)</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#0b2545] text-white flex items-center justify-center shadow-xs">
              <PhoneCall className="w-4 h-4" />
            </div>
          </a>
        </div>
      </div>

      {/* 3. Nearest 24x7 Emergency Trauma Centers */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#eaeef2]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#001026] flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-[#006d43]" />
            <span>Nearest 24x7 Trauma Centers & ICUs (निकटतम अस्पताल)</span>
          </h2>
          <span className="text-[10px] font-bold text-[#44474e]">Delhi NCR Network</span>
        </div>

        <div className="space-y-2.5">
          {EMERGENCY_HOSPITALS.map((hosp) => (
            <div
              key={hosp.id}
              className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#eaeef2] hover:border-[#001026]/20 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-black text-[#001026]">
                      {hosp.name}
                    </h3>
                  </div>
                  <p className="text-[11px] text-[#44474e] mt-0.5 line-clamp-1">
                    {hosp.address}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px]">
                    <span className="px-2 py-0.5 rounded-md bg-[#ffdad6] text-[#ba1a1a] font-black">
                      {hosp.travelTimeMin} ({hosp.distanceKm})
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#75f8b3]/30 text-[#007147] font-bold">
                      {hosp.icuBedsAvailable} ICU Beds Active
                    </span>
                    {hosp.cashlessNetwork && (
                      <span className="px-2 py-0.5 rounded-md bg-[#001026] text-white font-bold">
                        Cashless Network
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 shrink-0">
                  <a
                    href={`tel:${hosp.emergencyPhone.replace(/[^0-9]/g, '')}`}
                    className="px-3 py-1.5 rounded-lg bg-[#ba1a1a] text-white text-xs font-black flex items-center justify-center gap-1 hover:bg-[#93000a] transition-colors shadow-xs"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>Call ER</span>
                  </a>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(hosp.name + ' ' + hosp.address)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-white border border-[#eaeef2] text-[#001026] text-xs font-bold flex items-center justify-center gap-1 hover:bg-[#f0f4f8] transition-colors"
                  >
                    <Navigation className="w-3 h-3 text-[#006d43]" />
                    <span>Map</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. ICE Decision Makers & Family Doctor */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#eaeef2]">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#001026] mb-3">
          Family Physician & ICE Decision Makers
        </h2>

        <div className="space-y-2">
          {/* Dr. Anil Mehta */}
          <div className="p-3 rounded-xl bg-[#f0f4f8] border border-[#eaeef2] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-[#0b2545] text-white flex items-center justify-center font-black text-xs">
                MD
              </div>
              <div>
                <span className="text-xs font-bold text-[#001026] block">Dr. Anil Mehta (Cardiologist)</span>
                <span className="text-[10px] text-[#44474e]">Family Doctor • Saket Heart Clinic</span>
              </div>
            </div>
            <a
              href="tel:01126515050"
              className="px-3 py-1.5 rounded-lg bg-[#006d43] text-white text-xs font-bold flex items-center gap-1"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call Clinic</span>
            </a>
          </div>

          {/* Rajesh */}
          <div className="p-3 rounded-xl bg-[#f0f4f8] border border-[#eaeef2] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={familyMembers[0]?.avatarUrl}
                alt="Rajesh"
                className="w-10 h-10 rounded-full object-cover border border-[#eaeef2]"
              />
              <div>
                <span className="text-xs font-bold text-[#001026] block">Rajesh Sharma (Head / Next of Kin)</span>
                <span className="text-[10px] text-[#44474e]">Star Health Cashless Manager • +91 98100 12345</span>
              </div>
            </div>
            <a
              href="tel:+919810012345"
              className="px-3 py-1.5 rounded-lg bg-[#001026] text-white text-xs font-bold flex items-center gap-1"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
