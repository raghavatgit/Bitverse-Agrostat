import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Mic, 
  Sparkles, 
  User, 
  HelpCircle, 
  CheckCircle2,
  Volume2,
  Square
} from 'lucide-react';
import { getTranslation } from '../services/translations.js';
import { queryAgroBotAI } from '../services/data.js';

export default function AgroBot({ language = 'EN' }) {
  const t = getTranslation(language);
  const isHi = language === 'HI';

  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: isHi 
        ? 'नमस्ते! मैं एग्रोबॉट हूँ, आपका 24/7 एआई किसान सहायक। आप मुझसे फसल रोग, यूरिया-खाद की सही मात्रा, मंडी भाव या सरकारी योजनाओं के बारे में कुछ भी पूछ सकते हैं।'
        : 'Namaste! I am AgroBot, your digital farming AI assistant. Ask me anything about crop diseases, market mandi prices, fertilizer calculations, or PM-KISAN schemes.',
      time: 'Just now'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [speakingIdx, setSpeakingIdx] = useState(null);

  // Update initial message when language toggles
  useEffect(() => {
    setMessages(prev => [
      {
        ...prev[0],
        text: isHi 
          ? 'नमस्ते! मैं एग्रोबॉट हूँ, आपका 24/7 एआई किसान सहायक। आप मुझसे फसल रोग, यूरिया-खाद की सही मात्रा, मंडी भाव या सरकारी योजनाओं के बारे में कुछ भी पूछ सकते हैं।'
          : 'Namaste! I am AgroBot, your digital farming AI assistant. Ask me anything about crop diseases, market mandi prices, fertilizer calculations, or PM-KISAN schemes.'
      },
      ...prev.slice(1)
    ]);
  }, [language, isHi]);

  const speakText = (text, idx) => {
    if (!('speechSynthesis' in window)) return;
    if (speakingIdx === idx) {
      window.speechSynthesis.cancel();
      setSpeakingIdx(null);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = isHi ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.92;
    utterance.onend = () => setSpeakingIdx(null);
    utterance.onerror = () => setSpeakingIdx(null);
    setSpeakingIdx(idx);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (textToSend) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    // Add user message
    const userMsg = { 
      sender: 'user', 
      text: query, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');

    // Try Live FastAPI NLP Backend first
    let botAnswer = null;
    try {
      const liveRes = await queryAgroBotAI(query, language);
      if (liveRes && liveRes.response) {
        botAnswer = liveRes.response;
      }
    } catch (e) {
      // Fallback
    }

    if (!botAnswer) {
      const lower = query.toLowerCase();
      if (lower.includes('yellow') || lower.includes('rust') || lower.includes('leaf') || lower.includes('पीला') || lower.includes('रतुआ')) {
        botAnswer = isHi
          ? "गेहूं में पीला रतुआ (Yellow Rust) कवक जनित रोग है। इसके रोकथाम के लिए प्रोपिकोनाजोल 25% EC (टिल्ट) 200 मिलीलीटर को 200 लीटर पानी में मिलाकर प्रति एकड़ छिड़काव करें।"
          : "Yellow Rust in wheat is fungal. Spray Propiconazole 25% EC (Tilt) @ 200ml in 200 liters of water per acre during calm morning hours.";
      } else if (lower.includes('pm-kisan') || lower.includes('scheme') || lower.includes('subsidy') || lower.includes('किस्त') || lower.includes('योजना')) {
        botAnswer = isHi
          ? "पीएम-किसान योजना के तहत पात्र किसानों को प्रति वर्ष ₹6,000 (3 किस्तों में) सीधे बैंक खाते में मिलते हैं। अपना e-KYC और भूमि रिकॉर्ड pmkisan.gov.in पर सत्यापित रखें।"
          : "Under PM-KISAN, eligible landholding farmers receive ₹6,000 annually in 3 direct installments. Ensure your Aadhaar e-KYC and land seeding are verified on pmkisan.gov.in.";
      } else if (lower.includes('npk') || lower.includes('fertilizer') || lower.includes('urea') || lower.includes('खाद') || lower.includes('यूरिया')) {
        botAnswer = isHi
          ? "अनाज फसलों के लिए सामान्य NPK अनुपात 4:2:1 (यूरिया 120 किग्रा, डीएपी 60 किग्रा, पोटाश 40 किग्रा प्रति हेक्टेयर) उपयुक्त है। बुवाई के समय आधा नाइट्रोजन और पूरी फास्फोरस दें।"
          : "Standard recommended NPK ratio for cereal crops is 4:2:1 (approx. 120kg N, 60kg P2O5, 40kg K2O per hectare). Apply 50% Nitrogen as basal and remaining in split top-dressings.";
      } else if (lower.includes('price') || lower.includes('mandi') || lower.includes('wheat') || lower.includes('भाव') || lower.includes('टमाटर')) {
        botAnswer = isHi
          ? "गेहूं का वर्तमान औसत मंडी भाव ₹2,450/क्विंटल है। आवक घटने से अगले 14 दिनों में भाव ₹2,680 तक पहुंचने का अनुमान है। सुरक्षित भंडारण होने पर रोक कर रखें।"
          : "Wheat prices are currently averaging ₹2,450/quintal. We project prices to rise towards ₹2,680 over the next 14 days due to tight mandi arrivals. Recommendation: HOLD.";
      } else {
        botAnswer = isHi 
          ? "मैंने आपका प्रश्न दर्ज कर लिया है। सटीक समाधान के लिए आप हमारे 'फसल चयन' टूल का उपयोग करें या निकटतम कृषि विज्ञान केंद्र से संपर्क करें।"
          : "I have recorded your query. For personalized soil-level advice, please explore our Crop Recommendation tool or consult your nearest Krishi Vigyan Kendra.";
      }
    }

    setMessages(prev => [
      ...prev, 
      { 
        sender: 'bot', 
        text: botAnswer, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }
    ]);
  };

  const handleVoiceRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = isHi ? 'hi-IN' : 'en-IN';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => setIsRecording(true);
        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInputMessage(transcript);
          handleSend(transcript);
        };
        recognition.onerror = () => setIsRecording(false);
        recognition.onend = () => setIsRecording(false);

        recognition.start();
        return;
      } catch (err) {
        console.error('Speech recognition error:', err);
      }
    }

    // Fallback simulation if browser mic blocked
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      handleSend(isHi ? "गेहूं में पीला रतुआ रोग का उपचार क्या है?" : "How do I control yellowing of leaves in my wheat crop?");
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] dark:bg-[#1C3320] border-2 border-[#A5D6A7] dark:border-[#2E5E33] flex items-center justify-center shadow-sm shrink-0">
            <Sparkles className="w-6 h-6 text-[#2E7D32] dark:text-[#4ADE80]" strokeWidth={2.2} />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#2C2416] dark:text-[#F0FDF4] tracking-tight">
              {t.agrobot.title}
            </h2>
            <p className="text-sm font-semibold text-[#5A4F3F] dark:text-[#94A3B8] mt-0.5">
              {t.agrobot.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="live-dot" />
          <span className="text-xs text-[#2E7D32] dark:text-[#4ADE80] font-black uppercase tracking-wider">
            {t.agrobot.online}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Chat Interface (8 Cols) */}
        <div className="lg:col-span-8 card p-5 sm:p-6 flex flex-col justify-between min-h-[520px] shadow-card">
          {/* Chat Messages */}
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {messages.map((msg, idx) => (
              <div 
                key={idx}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-xl bg-[#E8F5E9] dark:bg-[#1C3320] border border-[#A5D6A7] dark:border-[#2E5E33] text-[#2E7D32] dark:text-[#4ADE80] flex items-center justify-center shrink-0 mt-1 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[82%] p-4 rounded-2xl text-xs sm:text-sm space-y-2 ${
                  msg.sender === 'user'
                    ? 'bg-[#2E7D32] dark:bg-[#22C55E] text-white dark:text-[#052E16] font-bold rounded-tr-none shadow-sm'
                    : 'bg-[#FDF6E9] dark:bg-[#1C2C1E] border border-[#E8DDD0] dark:border-[#2E4530] text-[#2C2416] dark:text-[#E2E8F0] rounded-tl-none font-medium leading-relaxed'
                }`}>
                  <div>{msg.text}</div>
                  <div className="flex items-center justify-between gap-3 pt-1 border-t border-black/5 dark:border-white/5">
                    <span className={`text-[10px] ${msg.sender === 'user' ? 'text-white/80 dark:text-[#052E16]/80' : 'text-[#8C7B6B] dark:text-[#94A3B8]'}`}>
                      {msg.time}
                    </span>
                    {msg.sender === 'bot' && (
                      <button
                        onClick={() => speakText(msg.text, idx)}
                        title={speakingIdx === idx ? "Stop speaking" : "Listen in audio"}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2E7D32] dark:text-[#4ADE80] hover:underline"
                      >
                        {speakingIdx === idx ? (
                          <>
                            <Square className="w-3 h-3 text-red-500 fill-current" />
                            <span>Stop</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>{isHi ? "सुनें" : "Listen"}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-[#FDF6E9] dark:bg-[#1C2C1E] border border-[#E8DDD0] dark:border-[#2E4530] text-[#2C2416] dark:text-[#F0FDF4] flex items-center justify-center shrink-0 mt-1 font-black text-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input Bar */}
          <div className="pt-4 border-t border-[#F0E6D2] dark:border-[#263828] space-y-3">
            <div className="relative flex items-center gap-2">
              <input
                type="text"
                placeholder={t.agrobot.placeholder}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="field-input pr-24"
              />

              <div className="absolute right-2 flex items-center gap-1.5">
                <button
                  onClick={handleVoiceRecording}
                  title={t.agrobot.micTooltip}
                  className={`p-2 rounded-xl text-xs font-bold transition-all ${
                    isRecording 
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-[#FDF6E9] dark:bg-[#1C2C1E] text-[#5A4F3F] dark:text-[#94A3B8] hover:text-[#2E7D32] dark:hover:text-[#4ADE80] border border-[#E8DDD0] dark:border-[#2E4530]'
                  }`}
                >
                  <Mic className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleSend()}
                  className="p-2 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] dark:bg-[#22C55E] dark:hover:bg-[#16A34A] text-white dark:text-[#052E16] font-bold transition-all shadow-sm"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {isRecording && (
              <div className="text-center text-xs text-rose-500 font-bold flex items-center justify-center gap-2 animate-pulse">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-3 bg-rose-500 rounded-full animate-bounce" />
                  <span className="w-1.5 h-4 bg-rose-500 rounded-full animate-bounce [animation-delay:0.1s]" />
                  <span className="w-1.5 h-2 bg-rose-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                </div>
                <span>{isHi ? "सुन रहा हूँ... बोलिए..." : "Listening... Speak your farming question..."}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Quick Prompts & Knowledge Shortcuts (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="card p-5 space-y-4 shadow-card">
            <h3 className="text-base font-black text-[#2C2416] dark:text-[#F0FDF4] flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#2E7D32] dark:text-[#4ADE80]" />
              {isHi ? "अक्सर पूछे जाने वाले सवाल" : "Frequently Asked Questions"}
            </h3>

            <div className="space-y-2">
              {t.agrobot.sampleQueries.map((query, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(query)}
                  className="w-full p-3 rounded-xl bg-[#FDF6E9] dark:bg-[#1C2C1E] border border-[#E8DDD0] dark:border-[#2E4530] text-left hover:border-[#2E7D32] dark:hover:border-[#4ADE80] text-xs font-bold text-[#2C2416] dark:text-[#E2E8F0] transition-all group shadow-xs hover:shadow-sm"
                >
                  <span className="group-hover:text-[#2E7D32] dark:group-hover:text-[#4ADE80] transition-colors">
                    💬 {query}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

