import { useState, useRef } from "react";
import { Upload, Image as ImageIcon, Loader2, Volume2, VolumeX, Camera, RefreshCw } from "lucide-react";
import { GoogleGenAI } from "@google/genai";

export default function DiseaseDetection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>("image/jpeg");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const GEMINI_API_KEY =
    import.meta.env.VITE_GEMINI_API_KEY ||
    "AQ.Ab8RN6JAV-eaQ5KbE09y6qcJkkrxBQDjSivuhT6niVzem5gzjw";

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMimeType(file.type || "image/jpeg");
      const reader = new FileReader();
      reader.onloadend = () => {
        const resultString = reader.result as string;
        setSelectedImage(resultString);
        setBase64Image(resultString.split(",")[1]);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    setIsCameraOpen(true);
    setResult(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      alert("కెమెరాను యాక్సెస్ చేయడం కుదరలేదు.");
      setIsCameraOpen(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setSelectedImage(dataUrl);
        setBase64Image(dataUrl.split(",")[1]);
        setMimeType("image/jpeg");
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  const speakText = (textToSpeak: string) => {
    if (!("speechSynthesis" in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const cleanText = textToSpeak.replace(/[*#_]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "te-IN";
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const analyzeImage = async () => {
    if (!base64Image) return;
    setLoading(true);
    setResult(null);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image,
            },
          },
          {
            text: `You are KrishiMitra AI, an expert plant pathologist. Examine this specific crop/leaf image. Provide a detailed diagnosis strictly in TELUGU language:
- **1. గుర్తించిన వ్యాధి / సమస్య:**
- **2. కారణాలు & కనిపించే లక్షణాలు:**
- **3. నివారణ చర్యలు & పిచికారీ మందులు:**
- **4. భవిష్యత్తు జాగ్రత్తలు:**`,
          },
        ],
      });

      if (response.text) {
        setResult(response.text);
      } else {
        setResult("ఫోటోను సరిగ్గా విశ్లేషించలేకపోయాము.");
      }
    } catch (err: any) {
      console.error("Gemini Error:", err);
      setResult(`Gemini API Error: ${err.message || "విశ్లేషణలో సమస్య వచ్చింది."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto font-sans space-y-6">
      <div className="bg-white border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-800">పంట వ్యాధి నిర్ధారణ (Crop Disease Detection)</h1>
        <p className="text-xs text-slate-500 mt-1">ఫోటో అప్‌లోడ్ చేయండి లేదా లైవ్ కెమెరాతో ఫోటో తీసి AI ద్వారా వ్యాధి నిర్ధారణ పొందండి.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-emerald-200 rounded-3xl p-6 bg-emerald-50/20">
          {isCameraOpen ? (
            <div className="relative w-full flex flex-col items-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="max-h-64 w-full rounded-2xl object-cover border border-slate-200 mb-3 bg-black"
              />
              <canvas ref={canvasRef} className="hidden" />
              <div className="flex gap-2 w-full">
                <button
                  onClick={capturePhoto}
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Camera size={16} /> ఫోటో తీయండి (Capture)
                </button>
                <button
                  onClick={stopCamera}
                  className="bg-red-100 hover:bg-red-200 text-red-700 text-xs font-semibold px-4 py-2.5 rounded-xl cursor-pointer"
                >
                  ఆపు
                </button>
              </div>
            </div>
          ) : selectedImage ? (
            <div className="relative w-full flex flex-col items-center">
              <img
                src={selectedImage}
                alt="Selected Crop"
                className="max-h-64 rounded-2xl object-cover border border-slate-200 shadow-xs mb-4"
              />
              <div className="flex gap-2 w-full">
                <label className="flex-1 cursor-pointer bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-semibold py-2.5 rounded-xl flex items-center justify-center gap-1.5">
                  <Upload size={14} /> మరేదైనా ఫోటో
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
                <button
                  onClick={startCamera}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Camera size={14} /> కెమెరా
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full py-8 gap-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center shadow-2xs">
                <ImageIcon size={32} />
              </div>
              <p className="text-sm font-semibold text-slate-700">పంట ఆకు ఫోటోను ఎంచుకోండి</p>

              <div className="flex flex-col sm:flex-row gap-2 w-full mt-2">
                <label className="flex-1 cursor-pointer bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs">
                  <Upload size={16} /> ఫోటో అప్‌లోడ్ చేయండి
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
                <button
                  onClick={startCamera}
                  className="flex-1 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                  <Camera size={16} /> లైవ్ కెమెరా (Live Camera)
                </button>
              </div>
            </div>
          )}

          <button
            onClick={analyzeImage}
            disabled={!base64Image || loading || isCameraOpen}
            className="w-full mt-5 bg-emerald-900 hover:bg-black disabled:bg-slate-200 text-white font-semibold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Gemini Vision విశ్లేషిస్తోంది...
              </>
            ) : (
              <>
                <RefreshCw size={18} />
                వ్యాధిని నిర్ధారించండి
              </>
            )}
          </button>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 flex flex-col min-h-[320px] shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
            <h2 className="text-sm font-bold text-slate-800">విశ్లేషణ ఫలితాలు (Analysis Results)</h2>
            {result && (
              <button
                onClick={() => speakText(result)}
                className="text-emerald-700 hover:text-emerald-900 flex items-center gap-1 text-xs font-semibold bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-200 cursor-pointer"
              >
                {isSpeaking ? <VolumeX size={15} /> : <Volume2 size={15} />}
                {isSpeaking ? "ఆపు" : "వినండి"}
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto text-xs text-slate-800 leading-relaxed font-medium whitespace-pre-wrap">
            {loading && (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2 py-12">
                <Loader2 size={28} className="animate-spin text-emerald-600" />
                <p>Gemini Visual AI ఫోటోను పరిశీలిస్తోంది...</p>
              </div>
            )}

            {!loading && !result && (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center py-12">
                <p>ఫోటో అప్‌లోడ్ చేసి లేదా కెమెరాతో తీసి 'వ్యాధిని నిర్ధారించండి' నొక్కండి.</p>
              </div>
            )}

            {!loading && result && result}
          </div>
        </div>
      </div>
    </div>
  );
}