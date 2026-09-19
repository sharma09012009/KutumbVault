import React, { useState, useEffect, useRef } from 'react';
import { Language, FirstAidGuide } from '../types';
import { FIRST_AID_GUIDES } from '../data/mockData';
import { 
  Heart, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw, 
  AlertTriangle, 
  Sparkles, 
  ChevronRight, 
  PhoneCall,
  Activity,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

interface FirstAidViewProps {
  language: Language;
  onOpenAssistantWithPrompt?: (prompt: string) => void;
}

export const FirstAidView: React.FC<FirstAidViewProps> = ({
  language,
  onOpenAssistantWithPrompt,
}) => {
  // CPR Metronome state
  const [isCprRunning, setIsCprRunning] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [compressionCount, setCompressionCount] = useState(0);
  const [cycleCount, setCycleCount] = useState(1);
  const [pulseActive, setPulseActive] = useState(false);
  
  // Selected guide expansion
  const [selectedGuideId, setSelectedGuideId] = useState<string>('fa-cpr');

  // Web Audio context ref for low-latency click/beep
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playClickSound = () => {
    if (isAudioMuted) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          audioCtxRef.current = new AudioContextClass();
        }
      }
      const ctx = audioCtxRef.current;
      if (ctx) {
        if (ctx.state === 'suspended') {
          ctx.resume();
        }
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.09);
      }
    } catch (e) {
      // Audio autoplay policy fallback
    }
  };

  // 105 Beats Per Minute interval (approx 571 ms per beat)
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isCprRunning) {
      const intervalMs = Math.round((60 / 105) * 1000); // 571ms
      interval = setInterval(() => {
        playClickSound();
        setPulseActive(true);
        setTimeout(() => setPulseActive(false), 200);

        setCompressionCount(prev => {
          if (prev >= 30) {
            setCycleCount(c => c + 1);
            return 1;
          }
          return prev + 1;
        });
      }, intervalMs);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCprRunning, isAudioMuted]);

  const handleResetCpr = () => {
    setIsCprRunning(false);
    setCompressionCount(0);
    setCycleCount(1);
  };

  const activeGuide = FIRST_AID_GUIDES.find(g => g.id === selectedGuideId) || FIRST_AID_GUIDES[0];

  return (
    <div className="flex flex-col w-full space-y-5 max-w-2xl mx-auto pb-10 animate-in fade-in duration-200">
      {/* 1. Header Alert */}
      <div className="bg-[#001026] text-white p-5 rounded-2xl shadow-sm border border-[#eaeef2]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#75f8b3]/20 text-[#75f8b3] text-[11px] font-black uppercase mb-1">
              <Activity className="w-3.5 h-3.5" />
              <span>AHA & ERC Emergency Protocols</span>
            </div>
            <h1 className="text-xl font-black tracking-tight text-white">
              {language === 'hi' ? 'प्राथमिक चिकित्सा एवं सीपीआर' : 'First-Aid & Emergency CPR'}
            </h1>
            <p className="text-xs text-white/80 mt-0.5">
              Verified clinical action steps while awaiting paramedic arrival
            </p>
          </div>

          <a
            href="tel:108"
            className="px-3.5 py-2.5 rounded-xl bg-[#ba1a1a] text-white text-xs font-black flex items-center gap-1.5 shadow-md hover:bg-[#93000a] active:scale-95 transition-all"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call 108</span>
          </a>
        </div>
      </div>

      {/* 2. Interactive Hands-Only CPR Metronome Card */}
      <div className="bg-white rounded-2xl p-5 shadow-xs border-2 border-[#ba1a1a]/30 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#ffdad6] text-[#ba1a1a]">
              <Heart className={`w-6 h-6 fill-[#ba1a1a] transition-transform duration-100 ${pulseActive ? 'scale-130' : 'scale-100'}`} />
            </span>
            <div>
              <h2 className="text-base font-black text-[#001026]">
                CPR Chest Compression Metronome
              </h2>
              <span className="text-xs font-bold text-[#ba1a1a]">
                Exact 105 Beats Per Minute (Push 2 inches deep)
              </span>
            </div>
          </div>

          {/* Audio Mute Toggle */}
          <button
            onClick={() => setIsAudioMuted(prev => !prev)}
            className="p-2 rounded-xl bg-[#f0f4f8] text-[#44474e] hover:bg-[#eaeef2] transition-colors"
            type="button"
            title={isAudioMuted ? 'Unmute Metronome Sound' : 'Mute Metronome Sound'}
          >
            {isAudioMuted ? <VolumeX className="w-5 h-5 text-[#ba1a1a]" /> : <Volume2 className="w-5 h-5 text-[#006d43]" />}
          </button>
        </div>

        {/* Metronome Beat Counter Display */}
        <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#eaeef2] flex items-center justify-around">
          <div className="text-center">
            <span className="text-[10px] font-bold text-[#44474e] uppercase block">Compression</span>
            <span className={`text-4xl font-black transition-colors ${
              compressionCount >= 28 ? 'text-[#ba1a1a]' : 'text-[#001026]'
            }`}>
              {compressionCount}
              <span className="text-base text-[#44474e] font-bold">/30</span>
            </span>
          </div>

          <div className="w-px h-12 bg-[#eaeef2]" />

          <div className="text-center">
            <span className="text-[10px] font-bold text-[#44474e] uppercase block">Cycle</span>
            <span className="text-3xl font-black text-[#0b2545]">
              #{cycleCount}
            </span>
          </div>

          <div className="w-px h-12 bg-[#eaeef2]" />

          <div className="text-center">
            <span className="text-[10px] font-bold text-[#44474e] uppercase block">Target Rate</span>
            <span className="text-base font-black text-[#006d43] mt-1 block">
              105 BPM
            </span>
          </div>
        </div>

        {/* Prompt alert during 30:2 cycle */}
        {compressionCount >= 28 && (
          <div className="p-2.5 rounded-xl bg-[#ffdad6] text-[#ba1a1a] text-xs font-black text-center animate-pulse">
            PREPARE FOR 2 RESCUE BREATHS (OR CONTINUE HANDS-ONLY COMPRESSIONS)
          </div>
        )}

        {/* Metronome Controls */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => setIsCprRunning(prev => !prev)}
            className={`flex-1 py-3 px-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 ${
              isCprRunning
                ? 'bg-[#ba1a1a] text-white hover:bg-[#93000a]'
                : 'bg-[#006d43] text-white hover:bg-[#005333]'
            }`}
            type="button"
          >
            {isCprRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
            <span>{isCprRunning ? 'PAUSE METRONOME' : 'START 105 BPM CPR PULSE'}</span>
          </button>

          <button
            onClick={handleResetCpr}
            className="p-3 rounded-xl bg-[#f0f4f8] text-[#44474e] hover:bg-[#eaeef2] transition-colors"
            type="button"
            title="Reset Counter"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 3. Emergency First-Aid Protocols Selector */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#001026] mb-2.5">
          Emergency Action Guides (त्वरित निर्देश)
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {FIRST_AID_GUIDES.map((guide) => {
            const isSelected = guide.id === selectedGuideId;
            return (
              <button
                key={guide.id}
                onClick={() => setSelectedGuideId(guide.id)}
                className={`p-3 rounded-xl text-left transition-all border flex flex-col justify-between min-h-[90px] ${
                  isSelected
                    ? 'bg-[#001026] text-white border-[#001026] shadow-sm'
                    : 'bg-white text-[#001026] border-[#eaeef2] hover:bg-[#f0f4f8]'
                }`}
                type="button"
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-[10px] font-black px-1.5 py-0.2 rounded uppercase ${
                    guide.severity === 'CRITICAL'
                      ? 'bg-[#ba1a1a] text-white'
                      : 'bg-[#ff9800] text-white'
                  }`}>
                    {guide.severity}
                  </span>
                  <span className="material-symbols-outlined text-lg">
                    {guide.icon}
                  </span>
                </div>
                <span className="text-xs font-black tracking-tight mt-2 line-clamp-2">
                  {language === 'hi' ? guide.titleHi : guide.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Active Guide Detailed Steps Card */}
      <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#eaeef2] space-y-4">
        <div className="flex items-start justify-between gap-3 border-b border-[#eaeef2] pb-3">
          <div>
            <span className="text-[10px] font-black uppercase text-[#ba1a1a] tracking-wide">
              PROTOCOL DETAIL
            </span>
            <h3 className="text-lg font-black text-[#001026]">
              {language === 'hi' ? activeGuide.titleHi : activeGuide.title}
            </h3>
            <p className="text-xs text-[#44474e] mt-0.5">
              {activeGuide.shortDesc}
            </p>
          </div>

          {onOpenAssistantWithPrompt && (
            <button
              onClick={() => onOpenAssistantWithPrompt(`Give immediate first-aid instructions for: ${activeGuide.title}`)}
              className="shrink-0 px-3 py-2 rounded-xl bg-[#0b2545] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-[#001026] shadow-xs"
              type="button"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#75f8b3]" />
              <span>Ask AI Guide</span>
            </button>
          )}
        </div>

        {/* Immediate Steps Checklist */}
        <div>
          <span className="text-xs font-black text-[#006d43] uppercase tracking-wide flex items-center gap-1.5 mb-2">
            <CheckCircle2 className="w-4 h-4 text-[#006d43]" />
            <span>Immediate Steps to Take (तत्काल कदम)</span>
          </span>

          <div className="space-y-2">
            {activeGuide.immediateSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#f0f4f8] border border-[#eaeef2] flex items-start gap-3"
              >
                <span className="w-5 h-5 rounded-full bg-[#006d43] text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-xs font-semibold text-[#001026] leading-relaxed">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Critical DO NOTS */}
        <div className="p-3.5 rounded-xl bg-[#ffdad6]/50 border border-[#ba1a1a]/30">
          <span className="text-xs font-black text-[#ba1a1a] uppercase tracking-wide flex items-center gap-1.5 mb-2">
            <AlertTriangle className="w-4 h-4 text-[#ba1a1a]" />
            <span>Critical DO NOTs (ये गलतियां कभी न करें)</span>
          </span>

          <ul className="space-y-1.5">
            {activeGuide.doNots.map((d, idx) => (
              <li key={idx} className="text-xs font-bold text-[#680005] flex items-start gap-2">
                <span>🚫</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
