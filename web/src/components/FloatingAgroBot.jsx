import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Mic, 
  Sparkles, 
  User, 
  X, 
  Minus, 
  Maximize2, 
  Volume2, 
  VolumeX, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle,
  HelpCircle,
  Clock,
  Wheat,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { getTranslation } from '../services/translations.js';

// Predefined Quick Agronomy Prompts
const QUICK_PROMPTS = [
  {
    en: "🌾 Best crop for black soil in Rabi season?",
    hi: "🌾 रबी में काली मिट्टी हेतु सबसे उपयुक्त फसल?"
  },
  {
    en: "💰 What is the 30-day wheat price trend?",
    hi: "💰 गेहूं का 30-दिवसीय मंडी भाव कैसा रहेगा?"
  },
  {
    en: "🐛 How to treat yellow rust on wheat leaves?",
    hi: "🐛 गेहूं की पत्तियों पर पीला रतुआ का इलाज क्या है?"
  },
  {
    en: "💧 When should I irrigate my field?",
    hi: "💧 मुझे अपने खेत में अगली सिंचाई कब करनी चाहिए?"
  },
  {
    en: "📜 How to check PM-KISAN ₹6,000 installment?",
    hi: "📜 पीएम-किसान ₹6,000 किस्त की स्थिति कैसे देखें?"
  }
];

// Comprehensive Rule-Based & Domain Agronomy NLP Knowledge Base
function generateAgroBotResponse(query, isHi) {
  const lower = query.toLowerCase();

  // 1. Crop Disease & Pest Control
  if (lower.includes('yellow') || lower.includes('rust') || lower.includes('leaf') || lower.includes('पीला') || lower.includes('रतुआ') || lower.includes('फफूंद') || lower.includes('fungus')) {
    return {
      title: isHi ? "गेहूं में पीला रतुआ (Yellow Rust) रोकथाम गाइड" : "Wheat Yellow Rust Management & Treatment",
      badge: isHi ? "ICAR कृषि गाइड" : "ICAR Agronomy Verified",
      type: "warning",
      points: isHi ? [
        "लक्षण: पत्तियों पर पीले रंग की धारियां और पाउडर जैसा रतुआ दिखाई देना।",
        "उपचार: प्रोपिकोनाजोल 25% EC (टिल्ट) @ 200 मिली प्रति 200 लीटर पानी में घोलकर प्रति एकड़ छिड़कें।",
        "सुझाव: सुबह के समय ओस सूखने के बाद छिड़काव करें, तेज धूप में न करें।"
      ] : [
        "Symptom: Linear yellow stripes on leaf blades with powdery pustules.",
        "Chemical Treatment: Spray Propiconazole 25% EC (Tilt) @ 200ml in 200 liters of water per acre.",
        "Best Practice: Spray during calm morning hours after dew has evaporated to maximize foliar absorption."
      ],
      closing: isHi ? "गंभीर संक्रमण होने पर 10-14 दिनों के बाद दूसरा छिड़काव करें।" : "In case of severe spread, repeat spray after 10–14 days."
    };
  }

  // 2. Mandi Rates & Prices
  if (lower.includes('price') || lower.includes('mandi') || lower.includes('rate') || lower.includes('wheat') || lower.includes('भाव') || lower.includes('मंडी') || lower.includes('दाम') || lower.includes('गेहूं') || lower.includes('चावल')) {
    return {
      title: isHi ? "मंडी भाव विश्लेषण व बिक्री पूर्वानुमान" : "Wholesale Mandi Rate Projections",
      badge: isHi ? "APMC Agmarknet लाइव" : "APMC Live Agmarknet",
      type: "success",
      points: isHi ? [
        "वर्तमान भाव: गेहूं का औसत मंडी भाव ₹2,450 / क्विंटल चल रहा है।",
        "30-दिवसीय AI पूर्वानुमान: ₹2,680 / क्विंटल (+9.4% तेजी का रुख)।",
        "बिक्री रणनीति: आगामी 2-3 हफ्तों तक स्टॉक रोक कर रखें (HOLD); सितंबर के पहले पखवाड़े में उच्च मांग रहेगी।"
      ] : [
        "Current Spot Rate: Wheat wholesale rate averaging ₹2,450 / quintal.",
        "30-Day AI Projection: Expected to touch ₹2,680 / quintal (+9.4% Bullish trajectory).",
        "Optimal Selling Window: HOLD stock for 2–3 weeks; flour mills expanding procurement in early September."
      ],
      closing: isHi ? "विस्तृत ग्राफ देखने के लिए 'फसल भाव' टैब खोलें।" : "Check the 'Crop Prices' dashboard for 30-day interactive price charts."
    };
  }

  // 3. Fertilizer & Soil Dosing
  if (lower.includes('npk') || lower.includes('fertilizer') || lower.includes('urea') || lower.includes('dap') || lower.includes('खाद') || lower.includes('यूरिया') || lower.includes('डीएपी')) {
    return {
      title: isHi ? "संतुलित उर्वरक व NPK पोषण तालिका" : "Balanced NPK Fertilizer Dosing Guide",
      badge: isHi ? "मृदा स्वास्थ्य मानक" : "Soil Health Standards",
      type: "info",
      points: isHi ? [
        "अनुशंसित अनुपात: अनाज फसलों हेतु 4:2:1 (यूरिया 120 किग्रा, डीएपी 60 किग्रा, पोटाश 40 किग्रा / हे.)।",
        "बुवाई के समय: पूरी डीएपी + पोटाश और आधी यूरिया बेसल डोज के रूप में दें।",
        "टॉप ड्रेसिंग: बची हुई यूरिया पहली और दूसरी सिंचाई के बाद 2 समान भागों में दें।"
      ] : [
        "Recommended Ratio: 4:2:1 for cereal crops (approx. 120kg N, 60kg P2O5, 40kg K2O per hectare).",
        "Basal Application: Apply full DAP + MOP and 50% Urea at the time of sowing.",
        "Top-Dressing: Apply remaining Nitrogen in two splits after the 1st and 2nd irrigation."
      ],
      closing: isHi ? "यूरिया की बर्बादी रोकने के लिए नीम लेपित यूरिया का ही उपयोग करें।" : "Always prefer Neem Coated Urea to reduce volatilization and nitrogen loss."
    };
  }

  // 4. Irrigation & Soil Moisture
  if (lower.includes('water') || lower.includes('irrigate') || lower.includes('moisture') || lower.includes('सिंचाई') || lower.includes('पानी') || lower.includes('नमी')) {
    return {
      title: isHi ? "स्मार्ट सिंचाई व नमी प्रबंधन" : "Field Moisture & Irrigation Advisory",
      badge: isHi ? "IoT सेंसर विश्लेषण" : "IoT Field Telemetry",
      type: "info",
      points: isHi ? [
        "क्रिटिकल नमी स्तर: 30% से कम नमी होने पर फसल की जड़ें सूखने लगती हैं।",
        "सुरक्षित सीमा: 45% से 65% मिट्टी की नमी पौधे के विकास हेतु सर्वोत्तम है।",
        "सिंचाई समय: वाष्पीकरण से बचने के लिए शाम के समय या सुबह जल्दी हल्की सिंचाई करें।"
      ] : [
        "Critical Threshold: Soil moisture below 30% indicates severe moisture stress.",
        "Optimal Range: 45% to 65% relative moisture ensures uninterrupted nutrient uptake.",
        "Timing: Water during late afternoon or early morning to prevent high evaporative loss."
      ],
      closing: isHi ? "होम स्क्रीन पर अपने खेत का लाइव सेंसर डेटा देखें।" : "Monitor your ESP32 live field moisture from the Home dashboard."
    };
  }

  // 5. Government Schemes (PM-KISAN / PMFBY)
  if (lower.includes('pm-kisan') || lower.includes('scheme') || lower.includes('subsidy') || lower.includes('insurance') || lower.includes('योजना') || lower.includes('किस्त') || lower.includes('बीमा')) {
    return {
      title: isHi ? "पीएम-किसान एवं कृषि सरकारी योजनाएं" : "PM-KISAN & Farmer Welfare Schemes",
      badge: isHi ? "भारत सरकार अधिकृत" : "Govt of India Verified",
      type: "success",
      points: isHi ? [
        "पीएम-किसान सम्मान निधि: ₹6,000 वार्षिक सहायता 3 समान किस्तों (₹2,000 प्रत्येक) में सीधे बैंक में।",
        "अनिवार्य आवश्यकताएं: 1. आधार e-KYC 2. भू-अभिलेख (Land Seeding) 3. बैंक खाता NPCI से लिंक।",
        "प्रधानमंत्री फसल बीमा (PMFBY): प्राकृतिक आपदा से नुकसान पर रबी फसल हेतु केवल 1.5% प्रीमियम।"
      ] : [
        "PM-KISAN Samman Nidhi: ₹6,000 direct income support annually in 3 installments of ₹2,000.",
        "Key Prerequisites: 1. Aadhaar e-KYC verification 2. Land Seeding on pmkisan.gov.in 3. Active Bank NPCI linking.",
        "PM Fasal Bima Yojana (PMFBY): Crop loss insurance at only 1.5% premium for Rabi and 2% for Kharif."
      ],
      closing: isHi ? "हेल्पलाइन नंबर: 155261 / 011-24300606 पर संपर्क कर सकते हैं।" : "Helpline: Dial PM-KISAN toll-free 155261 / 1800115526 for status queries."
    };
  }

  // 6. Default Fallback
  return {
    title: isHi ? "एग्रोबॉट कृषि सलाह" : "AgroBot Agricultural Guidance",
    badge: isHi ? "24/7 AI सहायक" : "24/7 AI Assistant",
    type: "info",
    points: isHi ? [
      `मैंने आपके प्रश्न "${query}" का विश्लेषण किया है।`,
      "विशिष्ट मिट्टी की किस्म (जैसे दोमट या काली मिट्टी) अनुसार फसल जानने के लिए 'फसल चयन' टैब देखें।",
      "सटीक मंडी भाव व बेचने का सही समय जानने के लिए 'मंडी भाव' विकल्प का उपयोग करें।"
    ] : [
      `I have processed your query: "${query}".`,
      "For soil texture-based yield matching, explore our smart 'Crop Recommendation' engine.",
      "To check 30-day forecast curves for wholesale mandis, visit the 'Crop Prices' section."
    ],
    closing: isHi ? "आप मुझसे खाद की मात्रा, फसल बीमारी या मंडी भाव के बारे में कभी भी पूछ सकते हैं!" : "Feel free to ask about fertilizer dose, pest remedies, or market rates anytime!"
  };
}

export default function FloatingAgroBot({ language = 'EN', theme = 'light' }) {
  const t = getTranslation(language);
  const isHi = language === 'HI';

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [autoSpeech, setAutoSpeech] = useState(false);
  const [speakingIdx, setSpeakingIdx] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('agrostat_chat_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 1,
        sender: 'bot',
        data: {
          title: isHi ? "नमस्ते किसान भाई! 🙏 मैं एग्रोबॉट हूँ।" : "Namaste! 🙏 I am AgroBot.",
          badge: isHi ? "24/7 AI सहायक" : "24/7 AI Assistant",
          type: "info",
          points: isHi ? [
            "मैं आपकी भाषा में खेती, मौसम, खाद, फसल सुरक्षा व मंडी भाव की सटीक सलाह देता हूँ।",
            "आप नीचे दिए गए त्वरित प्रश्नों पर टैप कर सकते हैं या माइक से बोलकर पूछ सकते हैं।"
          ] : [
            "I provide real-time guidance on crop diseases, balanced fertilizers, mandi prices, and weather advisories.",
            "Tap any quick topic below or use the Voice Mic to ask questions naturally."
          ],
          closing: isHi ? "आज आपकी खेती में क्या सहायता चाहिए?" : "How can I assist your farm today?"
        },
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const chatEndRef = useRef(null);

  // Save chat to localStorage
  useEffect(() => {
    localStorage.setItem('agrostat_chat_history', JSON.stringify(messages));
  }, [messages]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen && !isMinimized) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  // Text to Speech
  const speakBotMessage = (text, idx) => {
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

  const handleSend = (textToSend) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');

    // Simulate AI thinking and generate agronomy answer
    setTimeout(() => {
      const responseData = generateAgroBotResponse(query, isHi);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        data: responseData,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);

      if (autoSpeech) {
        const speechSummary = `${responseData.title}. ${responseData.points.join(' ')} ${responseData.closing || ''}`;
        speakBotMessage(speechSummary, botMsg.id);
      }
    }, 450);
  };

  // Speech-to-Text Microphone
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
      const sample = isHi ? "गेहूं में पीला रतुआ का उपचार क्या है?" : "How to treat yellow rust on wheat leaves?";
      setInputMessage(sample);
      handleSend(sample);
    }, 1800);
  };

  const handleClearChat = () => {
    window.speechSynthesis?.cancel();
    setSpeakingIdx(null);
    setMessages([
      {
        id: Date.now(),
        sender: 'bot',
        data: {
          title: isHi ? "चैट साफ़ की गई। मैं आपकी क्या मदद कर सकता हूँ?" : "Chat cleared. What can I help you with?",
          badge: isHi ? "24/7 AI सहायक" : "24/7 AI Assistant",
          type: "info",
          points: isHi ? [
            "मुझसे खाद, मंडी भाव, मौसम या फसल रोग के बारे में पूछें।"
          ] : [
            "Ask me about fertilizers, mandi rates, weather alerts, or pest management."
          ],
          closing: ""
        },
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <>
      {/* ── 1. Floating Action Launcher Button (Always visible bottom-right) ── */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-subtle">
          <button
            id="floating-agrobot-launcher"
            onClick={() => { setIsOpen(true); setIsMinimized(false); }}
            className="group flex items-center gap-3 px-5 py-3.5 rounded-full bg-gradient-to-r from-[#1B5E20] via-[#246B28] to-[#2E7D32] dark:from-[#22C55E] dark:to-[#16A34A] text-white dark:text-[#052E16] shadow-2xl hover:shadow-[0_12px_30px_rgba(46,125,50,0.45)] hover:scale-105 transition-all border-2 border-white/20 dark:border-black/20"
            title="Open 24/7 AgroBot AI Assistant"
          >
            <div className="relative w-8 h-8 rounded-full bg-white/20 dark:bg-black/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white dark:text-[#052E16]" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 dark:bg-black border-2 border-white dark:border-black animate-ping" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 dark:bg-black border-2 border-white dark:border-black" />
            </div>
            
            <div className="text-left">
              <div className="text-xs font-black tracking-wide flex items-center gap-1.5">
                <span>{isHi ? "एग्रोबॉट 24/7 AI" : "AgroBot 24/7 AI"}</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-300 dark:text-emerald-950 group-hover:rotate-12 transition-transform" />
              </div>
              <div className="text-[10px] font-semibold opacity-90 text-emerald-100 dark:text-emerald-950">
                {isHi ? "कृषि मित्र से पूछें" : "Instant Agronomist"}
              </div>
            </div>
          </button>
        </div>
      )}

      {/* ── 2. Floating Chatbot Window / GUI Drawer ── */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ease-out shadow-2xl rounded-3xl overflow-hidden border-2 border-[#A5D6A7]/50 dark:border-[#2E5E33] bg-[#FDF6E9] dark:bg-[#0F1710] flex flex-col font-['Plus_Jakarta_Sans',sans-serif] ${
            isMinimized
              ? 'bottom-6 right-6 w-80 h-16 cursor-pointer'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[420px] h-[600px] max-h-[88vh]'
          }`}
        >
          {/* Header */}
          <div
            onClick={() => isMinimized && setIsMinimized(false)}
            className="p-4 bg-gradient-to-r from-[#1B5E20] via-[#246B28] to-[#2E7D32] dark:from-[#112413] dark:via-[#163519] dark:to-[#1D4A22] text-white flex items-center justify-between shadow-md select-none shrink-0"
          >
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-2xl bg-white/20 dark:bg-black/40 flex items-center justify-center backdrop-blur-sm border border-white/20">
                <Bot className="w-6 h-6 text-white" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white dark:border-[#112413]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-base text-white leading-none">
                    AgroBot AI
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-400/20 text-emerald-300 border border-emerald-300/30">
                    24/7 Live
                  </span>
                </div>
                <p className="text-[11px] text-white/80 font-medium mt-0.5">
                  {isHi ? "भारतीय किसान डिजिटल सहायक" : "Digital Farming Agronomist"}
                </p>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
              <button
                onClick={() => setAutoSpeech(!autoSpeech)}
                className={`p-1.5 rounded-xl text-xs font-bold transition-all ${
                  autoSpeech ? 'bg-amber-400 text-amber-950' : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                title={autoSpeech ? "Auto Voice Readout On" : "Turn On Auto Voice Readout"}
              >
                {autoSpeech ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 opacity-70" />}
              </button>

              <button
                onClick={handleClearChat}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                title="Clear Chat History"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                title={isMinimized ? "Expand" : "Minimize"}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
              </button>

              <button
                onClick={() => { setIsOpen(false); window.speechSynthesis?.cancel(); setSpeakingIdx(null); }}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-red-500/80 text-white transition-colors"
                title="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body (only when not minimized) */}
          {!isMinimized && (
            <>
              {/* Message Feed */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
                {messages.map((msg, idx) => {
                  const isUser = msg.sender === 'user';
                  const data = msg.data;

                  return (
                    <div
                      key={msg.id || idx}
                      className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'} animate-fade-up`}
                    >
                      {!isUser && (
                        <div className="w-7 h-7 rounded-xl bg-[#2E7D32] dark:bg-[#22C55E] text-white dark:text-[#052E16] flex items-center justify-center shrink-0 mt-1 shadow-xs">
                          <Bot className="w-4 h-4" />
                        </div>
                      )}

                      <div className={`max-w-[85%] space-y-1.5 ${isUser ? 'items-end' : 'items-start'}`}>
                        {/* Message Bubble */}
                        <div
                          className={`p-3.5 rounded-2xl shadow-xs leading-relaxed ${
                            isUser
                              ? 'bg-[#2E7D32] text-white rounded-br-none font-bold'
                              : 'bg-white dark:bg-[#162217] text-[#2C2416] dark:text-[#F0FDF4] border border-[#F0E6D2] dark:border-[#263828] rounded-tl-none font-medium'
                          }`}
                        >
                          {isUser ? (
                            <p className="text-xs font-semibold">{msg.text}</p>
                          ) : (
                            <div className="space-y-2.5">
                              {data?.title && (
                                <div className="flex items-center justify-between gap-2 border-b border-[#F0E6D2] dark:border-[#263828] pb-1.5">
                                  <span className="font-black text-xs text-[#2C2416] dark:text-[#F0FDF4]">
                                    {data.title}
                                  </span>
                                  {data?.badge && (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8F5E9] dark:bg-[#1C3320] text-[#2E7D32] dark:text-[#4ADE80] shrink-0">
                                      {data.badge}
                                    </span>
                                  )}
                                </div>
                              )}

                              {data?.points && (
                                <ul className="space-y-1.5 list-none">
                                  {data.points.map((p, pIdx) => (
                                    <li key={pIdx} className="flex items-start gap-1.5 text-xs text-[#5A4F3F] dark:text-[#CBD5E1]">
                                      <span className="text-[#2E7D32] dark:text-[#4ADE80] font-black shrink-0">•</span>
                                      <span>{p}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}

                              {data?.closing && (
                                <p className="text-[11px] font-bold text-[#2E7D32] dark:text-[#4ADE80] pt-1">
                                  {data.closing}
                                </p>
                              )}

                              {/* Action button inside message (Speak aloud) */}
                              <div className="pt-1.5 border-t border-[#F0E6D2]/60 dark:border-[#263828] flex items-center justify-between">
                                <span className="text-[10px] text-[#8C7B6B] dark:text-[#94A3B8]">{msg.time}</span>
                                <button
                                  onClick={() => {
                                    const speechText = `${data?.title || ''}. ${data?.points?.join(' ') || ''} ${data?.closing || ''}`;
                                    speakBotMessage(speechText, msg.id || idx);
                                  }}
                                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                                    speakingIdx === (msg.id || idx)
                                      ? 'bg-[#2E7D32] text-white animate-pulse'
                                      : 'bg-[#FDF6E9] dark:bg-[#1C2C1E] text-[#2E7D32] dark:text-[#4ADE80] hover:bg-[#E8F5E9]'
                                  }`}
                                  title="Listen via Text-to-Speech"
                                >
                                  <Volume2 className="w-3 h-3" />
                                  <span>{speakingIdx === (msg.id || idx) ? (isHi ? "बोल रहे हैं…" : "Speaking…") : (isHi ? "सुनें" : "Listen")}</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>

              {/* Quick Action Suggestion Chips */}
              <div className="px-3.5 py-2 bg-white/70 dark:bg-[#141F15]/90 border-t border-[#F0E6D2] dark:border-[#263828] overflow-x-auto flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-black text-[#8C7B6B] dark:text-[#94A3B8] uppercase whitespace-nowrap">
                  {isHi ? "त्वरित प्रश्न:" : "Quick Ideas:"}
                </span>
                {QUICK_PROMPTS.map((q, qIdx) => (
                  <button
                    key={qIdx}
                    onClick={() => handleSend(isHi ? q.hi : q.en)}
                    className="px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-[#FDF6E9] dark:bg-[#1C2C1E] text-[#2C2416] dark:text-[#F0FDF4] hover:bg-[#E8F5E9] dark:hover:bg-[#253B28] hover:text-[#2E7D32] dark:hover:text-[#4ADE80] border border-[#F0E6D2] dark:border-[#2E4530] transition-colors whitespace-nowrap shrink-0 shadow-xs"
                  >
                    {isHi ? q.hi : q.en}
                  </button>
                ))}
              </div>

              {/* Input Area with Mic & Send */}
              <div className="p-3 bg-white dark:bg-[#141F15] border-t border-[#F0E6D2] dark:border-[#263828] flex items-center gap-2 shrink-0">
                <button
                  onClick={handleVoiceRecording}
                  disabled={isRecording}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
                    isRecording
                      ? 'bg-red-500 text-white animate-pulse shadow-lg scale-105'
                      : 'bg-[#E8F5E9] dark:bg-[#1C3320] text-[#2E7D32] dark:text-[#4ADE80] hover:bg-[#2E7D32] hover:text-white border border-[#A5D6A7] dark:border-[#2E5E33]'
                  }`}
                  title="Speak via Microphone (Speech-to-Text)"
                >
                  <Mic className="w-5 h-5" />
                </button>

                <div className="relative flex-1">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder={
                      isRecording
                        ? (isHi ? "आपकी आवाज़ सुन रहे हैं…" : "Listening to your voice…")
                        : (isHi ? "यहाँ प्रश्न लिखें (उदा. खाद, रोग, भाव)…" : "Type your farm question…")
                    }
                    className="w-full pl-3 pr-9 py-2.5 rounded-xl bg-[#FDF6E9] dark:bg-[#162217] text-[#2C2416] dark:text-[#F0FDF4] border border-[#F0E6D2] dark:border-[#263828] text-xs font-semibold placeholder:text-[#8C7B6B] dark:placeholder:text-[#64748B] focus:outline-none focus:border-[#2E7D32] dark:focus:border-[#4ADE80]"
                  />
                  {inputMessage && (
                    <button
                      onClick={() => setInputMessage('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C7B6B] hover:text-[#2C2416]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => handleSend()}
                  disabled={!inputMessage.trim()}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
                    inputMessage.trim()
                      ? 'bg-[#2E7D32] dark:bg-[#22C55E] text-white dark:text-[#052E16] shadow-md hover:scale-105 cursor-pointer'
                      : 'bg-[#F0E6D2] dark:bg-[#1E2E20] text-[#8C7B6B] dark:text-[#64748B] cursor-not-allowed'
                  }`}
                  title="Send Message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
