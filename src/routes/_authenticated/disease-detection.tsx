import { useState, useRef } from "react";
import { Upload, Image as ImageIcon, Loader2, Volume2, VolumeX, Camera, RefreshCw } from "lucide-react";
// @ts-ignore
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
    import.meta.env.VITE_GEMINI_API_KEY || "";

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMimeType(file.type);
      const reader = new FileReader();
      reader.onloadend = () => {
        const resultStr = reader.result as string;
        setSelectedImage(resultStr);
        setBase64Image(resultStr.split(",")[1]);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      alert("కెమెరాను యాక్సెస్ చేయడం కుదరలేదు. దయచేసి అనుమతులు తనిఖీ చేయండి.");
      setIsCameraOpen(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
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

  const analyzeImage = async () => {
    if (!base64Image) return;
    setLoading(true);
    setResult(null);

    try {
      // @ts-ignore
      const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
      const prompt = `నువ్వు ఒక వ్యవసాయ నిపుణుడివి. ఈ పంట లేదా ఆకు ఫోటోను పరిశీలించి కింద పేర్కొన్న వివరాలను తెలుగు భాషలో స్పష్టంగా మరియు సులభంగా అర్థమయ్యేలా విశ్లేషణ ఇవ్వండి:
1. **పంట వ్యాధి పేరు / సమస్య** (పంట ఆరోగ్యంగా ఉంటే అది కూడా చెప్పండి)
2. **ప్రధాన లక్షణాలు**
3. **నివారణ చర్యలు / మందుల వివరాలు**
4. **రైతుకు ముఖ్యమైన సలహాలు**`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              {
                inlineData: {
                  data: base64Image,
                  mimeType: mimeType,
                },
              },
            ],
          },
        ],
      });

      setResult(response.text);
    } catch (error) {
      console.error("Analysis Error:", error);
      setResult("విశ్లేషణలో లోపం జరిగింది. దయచేసి API Key ని సరిచూసుకోండి లేదా మళ్లీ ప్రయత్నించండి.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSpeech = () => {
    if (!result) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(result.replace(/[*#]/g, ""));
      utterance.lang = "te-IN";
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-emerald-800">పంట వ్యాధి గుర్తింపు (AI Crop Doctor)</h1>
        <p className="text-gray-600">నీ పంట ఫోటో అప్‌లోడ్ చేయి లేదా కెమెరాతో తీసి వ్యాధి నివారణ సలహాలు పొందు</p>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 border border-emerald-100 space-y-6">
        {/* Upload & Camera Controls */}
        {!isCameraOpen ? (
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            <label className="flex-1 w-full flex flex-col items-center justify-center h-48 border-2 border-dashed border-emerald-300 rounded-xl cursor-pointer bg-emerald-50/50 hover:bg-emerald-50 transition">
              <Upload className="w-10 h-10 text-emerald-600 mb-2" />
              <span className="text-sm font-medium text-emerald-800">గ్యాలరీ నుండి ఫోటో ఎంచుకో</span>
              <span className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP</span>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>

            <button
              onClick={startCamera}
              className="w-full md:w-48 h-48 flex flex-col items-center justify-center border-2 border-emerald-600 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition"
            >
              <Camera className="w-10 h-10 mb-2" />
              <span className="text-sm font-medium">కెమెరా ఓపెన్ చెయ్</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-full max-w-md bg-black rounded-xl overflow-hidden shadow-lg">
              <video ref={videoRef} autoPlay playsInline className="w-full h-64 object-cover"></video>
              <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="flex gap-4">
              <button
                onClick={capturePhoto}
                className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-emerald-700 flex items-center gap-2"
              >
                <Camera className="w-5 h-5" /> ఫోటో తీయి
              </button>
              <button
                onClick={stopCamera}
                className="bg-gray-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-600"
              >
                క్యాన్సల్
              </button>
            </div>
          </div>
        )}

        {/* Selected Image Preview */}
        {selectedImage && !isCameraOpen && (
          <div className="flex flex-col items-center space-y-4 pt-4 border-t">
            <div className="relative w-full max-w-xs rounded-xl overflow-hidden border-2 border-emerald-500 shadow-md">
              <img src={selectedImage} alt="Crop preview" className="w-full h-48 object-cover" />
            </div>

            <button
              onClick={analyzeImage}
              disabled={loading}
              className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-emerald-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> విశ్లేషిస్తోంది...
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" /> విశ్లేషించు (Analyze)
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Analysis Result Display */}
      {result && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-200 space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <h2 className="text-xl font-bold text-emerald-900 flex items-center gap-2">
              <ImageIcon className="text-emerald-600" /> విశ్లేషణ ఫలితం (AI Diagnosis)
            </h2>
            <button
              onClick={toggleSpeech}
              className="p-2.5 bg-emerald-100 text-emerald-800 rounded-full hover:bg-emerald-200 transition"
              title="వాయిస్ ద్వారా విను"
            >
              {isSpeaking ? <VolumeX className="w-5 h-5 text-red-600" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>

          <div className="prose max-w-none text-gray-800 whitespace-pre-line leading-relaxed text-sm md:text-base">
            {result}
          </div>
        </div>
      )}
    </div>
  );
}