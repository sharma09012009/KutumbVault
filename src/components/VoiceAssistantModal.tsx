import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../types';
import { 
  Mic, 
  Send, 
  Volume2, 
  VolumeX, 
  X, 
  Sparkles, 
  Bot, 
  User, 
  Loader2 
} from 'lucide-react';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: language === 'hi' 
        ? 'आपातकालीन चिकित्सा डेस्क: मैं आपका मेडिकल ट्राइएज AI सहायक हूँ। आप मुझसे सीपीआर, सीने में दर्द प्रोटोकॉल, पारिवारिक दवा एलर्जी (जैसे सुनीता की पेनिसिलिन एलर्जी), सोर्बिट्रेट SOS खुराक, या कैशलेस अस्पताल भर्ती के बारे में पूछ सकते हैं।' 
        : 'Emergency Medical Desk: I am your First-Aid & Medical Triage Assistant. Ask me about CPR chest compressions, acute chest pain protocols, family drug allergies (e.g. Sunita\'s fatal penicillin allergy), Dadi\'s Sorbitrate rescue dose, or Star Health cashless admission.',
      timestamp: 'Just now',
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const quickPrompts = [
    'Acute chest pain protocol for Dadi',
    'CPR compression rate & depth',
    'Check Sunita penicillin allergy',
    'Star Health cashless admission helpline',
    'Child asthma / choking emergency'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputText('');
    setIsLoading(true);

    try {
      // Call server Gemini endpoint
      const response = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSend.trim(),
          language: language,
        }),
      });

      const data = await response.json();
      const reply = data.reply || (language === 'hi'
        ? 'माफ़ कीजिए, मैं अभी यह विवरण प्राप्त नहीं कर सका। कृपया पुनः प्रयास करें।'
        : 'I was unable to retrieve that information right now. Please try again.');

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, botMsg]);

      // Speak answer if enabled
      if (speechEnabled && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(reply);
        utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      console.error('Assistant error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: 'Error connecting to KutumbVault AI. Please check your connection.',
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Browser Speech Recognition for voice dictation
  const toggleSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice dictation is not supported in this browser. Please type your query.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        if (transcript) {
          handleSend(transcript);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg h-[85vh] max-h-[680px] shadow-2xl border border-[#eaeef2] flex flex-col overflow-hidden animate-in fade-in">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-[#001026] to-[#0b2545] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#006d43] flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5 text-[#78fbb6]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm">Emergency Medical AI</h3>
                <span className="px-1.5 py-0.2 rounded bg-[#ba1a1a] text-white text-[9px] font-black uppercase">
                  TRIAGE LIVE
                </span>
              </div>
              <p className="text-[11px] text-[#b1c7f0]">
                {language === 'hi' ? 'आपातकालीन चिकित्सा एवं प्राथमिक उपचार' : 'Emergency Triage & First-Aid Enclave'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                setSpeechEnabled(!speechEnabled);
              }}
              className="p-2 rounded-full text-white/80 hover:bg-white/10"
              title={speechEnabled ? 'Mute AI Voice' : 'Enable AI Voice'}
            >
              {speechEnabled ? <Volume2 className="w-4 h-4 text-[#78fbb6]" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                onClose();
              }}
              className="p-2 rounded-full text-white/80 hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f8fafc]">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  m.sender === 'user'
                    ? 'bg-[#001026] text-white'
                    : 'bg-[#006d43] text-white shadow-2xs'
                }`}
              >
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[82%] rounded-2xl p-3 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#0b2545] text-white rounded-tr-none'
                    : 'bg-white text-[#171c1f] shadow-xs border border-[#eaeef2] rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-wrap">{m.text}</p>
                <span className={`text-[9px] block mt-1 ${m.sender === 'user' ? 'text-white/60 text-right' : 'text-[#74777f]'}`}>
                  {m.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-[#44474e] p-2 bg-white rounded-xl w-fit shadow-xs border border-[#eaeef2]">
              <Loader2 className="w-4 h-4 animate-spin text-[#006d43]" />
              <span>Checking encrypted vault & medical records...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-2 bg-white border-t border-[#eaeef2] flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
          <span className="text-[10px] font-bold text-[#74777f] uppercase shrink-0">Try:</span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-[#f0f4f8] hover:bg-[#e5e9ed] text-[#001026] whitespace-nowrap shrink-0 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-[#eaeef2] flex items-center gap-2 shrink-0">
          <button
            onClick={toggleSpeechRecognition}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              isListening
                ? 'bg-[#ba1a1a] text-white animate-pulse'
                : 'bg-[#f0f4f8] hover:bg-[#e5e9ed] text-[#001026]'
            }`}
            title="Voice input"
          >
            <Mic className="w-5 h-5" />
          </button>

          <input
            type="text"
            placeholder={isListening ? 'Listening... Speak now' : 'Ask about documents, dues, medications...'}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            className="flex-1 px-3 py-2 text-xs rounded-xl bg-[#f0f4f8] border-none focus:outline-none focus:ring-2 focus:ring-[#006d43]/30 text-[#171c1f]"
          />

          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim() || isLoading}
            className="w-10 h-10 rounded-full bg-[#001026] hover:bg-[#0b2545] disabled:opacity-40 text-white flex items-center justify-center transition-all active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
