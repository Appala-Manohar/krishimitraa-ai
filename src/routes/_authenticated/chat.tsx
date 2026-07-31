import { useState, useRef, useEffect } from "react";
import { Send, Volume2, Mic, MicOff, VolumeX, AlertTriangle, CheckCircle } from "lucide-react";

interface Message {
  id: number;
  sender: "user" | "bot";
  text: string;
  isWarning?: boolean;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "bot",
      text: "నమస్కారం! నేను కృషిమిత్ర AI ని. మీ పంటలు, వాతావరణం, పురుగుల యాజమాన్యం లేదా ప్రభుత్వ పథకాల గురించి ఏదైనా అడగండి.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fallback Groq Key provided directly
  const GROQ_API_KEY =
    import.meta.env.VITE_GROQ_API_KEY ||
    "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";

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- Voice Input ---
  const handleMicClick = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("మీ బ్రౌజర్ వాయిస్ ఇన్‌పుట్‌కు మద్దతు ఇవ్వడం లేదు. దయచేసి Google Chrome వాడండి.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "te-IN";
    recognition.interimResults = false;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event: any) => {
      setInput(event.results[0][0].transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  };

  // --- Voice Output ---
  const speakText = (textToSpeak: string, messageId: number) => {
    if (!("speechSynthesis" in window)) return;

    if (isSpeaking && speakingMessageId === messageId) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();

    const cleanText = textToSpeak.replace(/[*#_]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "te-IN";

    utterance.onstart = () => {
      setIsSpeaking(true);
      setSpeakingMessageId(messageId);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingMessageId(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpeakingMessageId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  // --- Groq Safe AI Call ---
  const fetchAIResponse = async (userQuery: string): Promise<{text: string; isWarning?: boolean}> => {
    try {
      const res = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              {
                role: "system",
                content: `You are KrishiMitra AI, a strict and factual agricultural advisor for Indian farmers. 
Your primary goal is to provide **ACCURATE, RELIABLE, and SAFE** information.

Follow these strict rules:
1.  **Truth First:** Only provide information you are certain about. If you are unsure, state: "క్షమించండి, ఈ విషయం గురించి నాకు ఖచ్చితమైన సమాచారం లేదు." Do NOT invent facts or scientific names.
2.  **Reputable Sources Only:** Base all advice on accepted agricultural science from sources like ICAR and KVKs. 
3.  **Safety Focus (Pesticides):** If suggesting a chemical pesticide, always add a mandatory safety warning: "**హెచ్చరిక:** పురుగుల మందులను వాడేటప్పుడు లేబుల్‌పై ఉన్న సూచనలను జాగ్రత్తగా చదవండి. ముఖానికి మాస్క్, చేతులకు గ్లౌజులు ధరించండి." 
4.  **Language:** Respond *only* in TELUGU language using Telugu script.
5.  **Output Structure:**
- **సమాధానం:** (The accurate response to the question)
- **ముఖ్యమైన సూచన:** (Any crucial reliable tips)
- **భద్రతా హెచ్చరిక:** (Mandatory if chemicals are involved)`,
              },
              {
                role: "user",
                content: userQuery,
              },
            ],
            temperature: 0.2,
            max_tokens: 1024,
          }),
        }
      );

      const data = await res.json();

      if (data?.choices?.[0]?.message?.content) {
        const botText = data.choices[0].message.content;
        const isUnknownResponse = botText.includes("ఖచ్చితమైన సమాచారం లేదు");
        return { text: botText, isWarning: isUnknownResponse };
      }

      if (data?.error?.message) {
        return { text: `Groq API Error: ${data.error.message}`, isWarning: true };
      }
    } catch (err: any) {
      console.error("Groq Fetch Error:", err);
    }

    return { text: "క్షమించండి, సర్వర్‌ను కనెక్ట్ చేయడంలో సమస్య వచ్చింది. దయచేసి మళ్లీ ప్రయత్నించండి.", isWarning: true };
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userQuery = input.trim();
    setInput("");
    
    setMessages((prev) => [...prev, { id: Date.now(), sender: "user", text: userQuery }]);
    setLoading(true);

    const botResponse = await fetchAIResponse(userQuery);
    
    setMessages((prev) => [
      ...prev, 
      { id: Date.now() + 1, sender: "bot", text: botResponse.text, isWarning: botResponse.isWarning }
    ]);
    
    setLoading(false);
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto h-[calc(100vh-64px)] flex flex-col font-sans bg-gray-50/50 rounded-3xl border border-gray-100 shadow-inner">
      {/* Header */}
      <div className="bg-white border border-gray-100 p-4 rounded-2xl flex items-center justify-between mb-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
            <CheckCircle size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">కృషిమిత్ర AI</h1>
            <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              వ్యవసాయ సలహాదారు (Agricultural Advisor)
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-gray-100 scrollbar-track-transparent">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.sender === "bot" && (
              <div className="p-2 bg-white border border-gray-100 rounded-full mt-1 flex-shrink-0 shadow-2xs">
                 <CheckCircle size={16} className="text-emerald-600" />
              </div>
            )}
            <div
              className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl text-xs leading-relaxed font-medium relative group ${
                msg.sender === "user"
                  ? "bg-emerald-800 text-white rounded-tr-none shadow-xs"
                  : msg.isWarning
                    ? "bg-yellow-50 text-yellow-900 border border-yellow-200 rounded-tl-none whitespace-pre-wrap shadow-2xs"
                    : "bg-white text-gray-800 border border-gray-200/70 rounded-tl-none whitespace-pre-wrap shadow-2xs"
              }`}
            >
              {msg.isWarning && (
                <div className="flex items-center gap-1.5 text-yellow-700 mb-1.5 font-semibold">
                  <AlertTriangle size={14} />
                  <span>ముఖ్య సూచన (Important Note)</span>
                </div>
              )}
              {msg.text}
              {msg.sender === "bot" && (
                <div className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-2 group-hover:opacity-100 transition">
                  <button
                    onClick={() => speakText(msg.text, msg.id)}
                    className="text-emerald-700 hover:text-emerald-900 flex items-center gap-1.5 text-[11px] font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg cursor-pointer"
                  >
                    {isSpeaking && speakingMessageId === msg.id ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    {isSpeaking && speakingMessageId === msg.id ? "ఆపు" : "వినండి"}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 p-3 rounded-2xl text-xs text-gray-500 flex items-center gap-2 shadow-2xs">
              <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"></div>
              పరిశీలిస్తోంది...
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={sendMessage}
        className="relative flex items-center gap-3 bg-white p-2.5 mt-4 rounded-2xl border border-gray-200 shadow-xs flex-shrink-0"
      >
        <button
          type="button"
          onClick={handleMicClick}
          className={`p-3 rounded-xl transition ${
            isListening
              ? "bg-red-100 text-red-600 animate-pulse"
              : "text-gray-400 hover:text-emerald-700 hover:bg-emerald-50"
          }`}
          title="వాయిస్ టైపింగ్"
        >
          {isListening ? <MicOff size={20} /> : <Mic size={20} />}
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            isListening
              ? "మాట్లాడండి..."
              : "పంటల గురించి, వాతావరణం గురించి ఏదైనా అడగండి..."
          }
          className="flex-1 text-sm outline-none px-2 font-medium bg-transparent"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-emerald-800 hover:bg-emerald-900 disabled:bg-gray-200 text-white p-3.5 rounded-xl transition shadow-xs cursor-pointer"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}