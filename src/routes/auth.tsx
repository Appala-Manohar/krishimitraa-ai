import { useState } from "react";
import { 
  Sprout, 
  Lock, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  Sun, 
  Moon, 
  Globe, 
  Code, 
  Mail, 
  PhoneCall, 
  Sparkles 
} from "lucide-react";

export default function Auth() {
  // Toggle between Login and Register modes
  const [isRegister, setIsRegister] = useState(false);
  
  // Theme Toggle State (Light / Dark)
  const [isDark, setIsDark] = useState(false);

  // Language Toggle State (Telugu / English)
  const [lang, setLang] = useState<"te" | "en">("te");
  
  // Credentials (Only Farmer Name & Password)
  const [farmerName, setFarmerName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmerName.trim() || !password.trim()) return;

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      localStorage.setItem("krishi_farmer_name", farmerName);
      window.location.href = "/dashboard";
    }, 1000);
  };

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center justify-between font-sans transition-colors duration-300 p-4 sm:p-6 ${
        isDark ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-800"
      }`}
    >
      {/* Main Card Container */}
      <div
        className={`w-full max-w-4xl rounded-3xl shadow-2xl border overflow-hidden grid grid-cols-1 md:grid-cols-2 my-auto transition-colors ${
          isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200/80"
        }`}
      >
        {/* Left Side: Warm Golden Agriculture Background */}
        <div className="relative hidden md:flex flex-col justify-between p-8 text-white overflow-hidden min-h-[520px]">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1920&auto=format&fit=crop')`,
            }}
          />
          {/* Golden Warm Sunset Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-amber-950/40 to-black/30 backdrop-blur-[1px]" />

          {/* Top Logo */}
          <div className="relative z-10 flex items-center gap-2">
            <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-md">
              <Sprout size={24} />
            </div>
            <span className="font-extrabold text-xl tracking-wide">KrishiMitra AI</span>
          </div>

          {/* Banner Text */}
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/30 border border-amber-300/40 rounded-full text-xs font-bold text-amber-200">
              <Sparkles size={14} /> Smart AI Platform
            </div>
            <h2 className="text-2xl font-bold leading-tight text-white">
              {lang === "te" ? "రైతు మిత్ర AI ప్లాట్‌ఫారమ్" : "KrishiMitra AI Platform"}
            </h2>
            <p className="text-xs text-emerald-100/90 leading-relaxed font-medium">
              {lang === "te"
                ? "పంట వ్యాధి నిర్ధారణ, ఉచిత వ్యవసాయ సలహాలు మరియు ప్రత్యక్ష మార్కెట్ ధరలను వెంటనే పొందండి."
                : "Real-time crop diagnosis, smart advisory, and live commodity prices."}
            </p>
          </div>
        </div>

        {/* Right Side: Auth Form with Toggles */}
        <div className="p-6 sm:p-10 flex flex-col justify-between">
          <div>
            {/* Top Bar: Theme Toggle & Language Toggle */}
            <div className="flex items-center justify-between mb-5 gap-2">
              <div className="md:hidden flex items-center gap-2">
                <Sprout size={24} className="text-emerald-600" />
                <span className="font-bold text-lg">KrishiMitra</span>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                {/* 1. Language Toggle */}
                <div
                  className={`flex items-center gap-1 p-1 rounded-xl border text-xs font-bold ${
                    isDark ? "bg-slate-700/60 border-slate-600" : "bg-slate-100 border-slate-200"
                  }`}
                >
                  <Globe size={13} className="text-slate-400 ml-1" />
                  <button
                    type="button"
                    onClick={() => setLang("te")}
                    className={`px-2 py-0.5 rounded-lg transition cursor-pointer ${
                      lang === "te"
                        ? "bg-emerald-800 text-white shadow-xs"
                        : "text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    తెలుగు
                  </button>
                  <button
                    type="button"
                    onClick={() => setLang("en")}
                    className={`px-2 py-0.5 rounded-lg transition cursor-pointer ${
                      lang === "en"
                        ? "bg-emerald-800 text-white shadow-xs"
                        : "text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    Eng
                  </button>
                </div>

                {/* 2. Light / Dark Theme Toggle Button */}
                <button
                  type="button"
                  onClick={() => setIsDark(!isDark)}
                  className={`p-1.5 rounded-xl border transition cursor-pointer flex items-center justify-center ${
                    isDark
                      ? "bg-slate-700 border-slate-600 text-yellow-300 hover:bg-slate-600"
                      : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
                  }`}
                  title="Toggle Light/Dark Theme"
                >
                  {isDark ? <Sun size={16} /> : <Moon size={16} />}
                </button>
              </div>
            </div>

            {/* Mode Selection Toggle Buttons (Login vs Register) */}
            <div
              className={`grid grid-cols-2 p-1 rounded-2xl mb-5 border ${
                isDark ? "bg-slate-700/60 border-slate-600" : "bg-slate-100 border-slate-200"
              }`}
            >
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                  !isRegister
                    ? "bg-emerald-800 text-white shadow-xs"
                    : isDark
                    ? "text-slate-400 hover:text-white"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {lang === "te" ? "లాగిన్ (Log In)" : "Log In"}
              </button>
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                  isRegister
                    ? "bg-emerald-800 text-white shadow-xs"
                    : isDark
                    ? "text-slate-400 hover:text-white"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {lang === "te" ? "కొత్త ఖాతా (Register)" : "Register"}
              </button>
            </div>

            {/* Form Title */}
            <div className="mb-5">
              <h2 className="text-xl font-extrabold">
                {isRegister
                  ? lang === "te" ? "కొత్త రైతు ఖాతా తెరవండి" : "Create Farmer Account"
                  : lang === "te" ? "రైతు ఖాతాలోకి ప్రవేశించండి" : "Farmer Login"}
              </h2>
              <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                {isRegister
                  ? lang === "te" ? "రైతు పేరు మరియు పాస్‌వర్డ్ ఎంటర్ చేసి ఖాతా సృష్టించండి" : "Enter your name and password to register"
                  : lang === "te" ? "మీ పేరు మరియు పాస్‌వర్డ్‌తో లాగిన్ అవ్వండి" : "Log in with your registered name & password"}
              </p>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Farmer Name */}
              <div>
                <label className="text-xs font-semibold block mb-1">
                  {lang === "te" ? "రైతు పేరు (Farmer Name)" : "Farmer Name"}
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder={lang === "te" ? "ఉదా: A. Manohar" : "e.g. A. Manohar"}
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    className={`w-full pl-9 pr-4 py-3 border rounded-xl text-xs font-semibold outline-none transition ${
                      isDark
                        ? "bg-slate-700 border-slate-600 text-white focus:border-emerald-500"
                        : "bg-slate-50 border-slate-200 text-slate-800 focus:border-emerald-600"
                    }`}
                    required
                  />
                  <User size={16} className="absolute left-3 text-slate-400" />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-semibold block mb-1">
                  {lang === "te" ? "పాస్‌వర్డ్ (Password)" : "Password"}
                </label>
                <div className="relative flex items-center">
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-9 pr-4 py-3 border rounded-xl text-xs font-semibold outline-none transition ${
                      isDark
                        ? "bg-slate-700 border-slate-600 text-white focus:border-emerald-500"
                        : "bg-slate-50 border-slate-200 text-slate-800 focus:border-emerald-600"
                    }`}
                    required
                  />
                  <Lock size={16} className="absolute left-3 text-slate-400" />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-800 hover:bg-emerald-900 disabled:bg-slate-400 text-white text-xs font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition shadow-md mt-2"
              >
                {loading ? (
                  lang === "te" ? "ప్రాసెస్ అవుతోంది..." : "Processing..."
                ) : isRegister ? (
                  <>
                    {lang === "te" ? "ఖాతా సృష్టించండి (Create Account)" : "Create Account"} <ArrowRight size={16} />
                  </>
                ) : (
                  <>
                    {lang === "te" ? "లాగిన్ అవ్వండి (Log In)" : "Log In"} <ShieldCheck size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Developer Footer */}
      <footer
        className={`w-full max-w-4xl mt-4 pt-3 border-t flex flex-col sm:flex-row items-center justify-between text-[11px] gap-2 ${
          isDark ? "border-slate-800 text-slate-400" : "border-slate-200/80 text-slate-500"
        }`}
      >
        <div className="flex items-center gap-1.5 font-semibold">
          <Code size={14} className="text-emerald-500" />
          <span>
            Developed by: <strong className={isDark ? "text-white" : "text-slate-800"}>A. Manohar</strong> (AIML)
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Mail size={13} className="text-slate-400" /> manohar@krishimitra.ai
          </span>
          <span className="flex items-center gap-1">
            <PhoneCall size={13} className="text-slate-400" /> +91 9876543210
          </span>
        </div>
      </footer>
    </div>
  );
}