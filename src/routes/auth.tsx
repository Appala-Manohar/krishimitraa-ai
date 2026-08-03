import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Lock, User, Moon, Sun, ShieldCheck, Loader2, Phone, Sparkles } from 'lucide-react';

export const Route = createFileRoute('/auth' as any)({
  component: AuthComponent,
});

function AuthComponent() {
  const [isLogin, setIsLogin] = useState(true);
  const [lang, setLang] = useState<'te' | 'en'>('te');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const [farmerName, setFarmerName] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://krishimitraa-ai.onrender.com';
    const endpoint = isLogin ? '/api/login' : '/api/register';

    try {
      await fetch(`${backendUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isLogin ? { farmerName, password } : { farmerName, password, phone }),
      });
    } catch (err) {
      console.error('Backend connection notice:', err);
    } finally {
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-4 lg:p-8 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-800'}`}>
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
        
        {/* Left Hero */}
        <div 
          className="lg:col-span-5 relative hidden lg:flex flex-col justify-between p-8 bg-cover bg-center text-white overflow-hidden" 
          style={{ backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.5), rgba(15, 23, 42, 0.85)), url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop')` }}
        >
          <div className="flex items-center gap-2.5">
            <div className="bg-emerald-600 p-2.5 rounded-2xl text-white shadow-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-wide">KrishiMitra AI</span>
          </div>

          <div className="space-y-4 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'te' ? 'కృత్రిమ మేధస్సు తో నడిచే వ్యవసాయం' : 'Next-Gen Smart Farming'}</span>
            </div>
            <h1 className="text-3xl font-extrabold leading-tight drop-shadow-md">
              {lang === 'te' ? 'రైతు సేవలో AI విప్లవం' : 'AI-Powered Crop & Land Diagnostics'}
            </h1>
            <p className="text-slate-200 text-sm leading-relaxed drop-shadow">
              {lang === 'te' 
                ? 'పంట వ్యాధుల తక్షణ గుర్తింపు, వాతావరణ హెచ్చరికలు మరియు మార్కెట్ ధరలను ఎప్పటికప్పుడు తెలుసుకోండి.' 
                : 'Instant crop disease identification, real-time weather alerts, and smart market price updates.'}
            </p>
          </div>

          <div className="text-xs text-slate-300 border-t border-slate-500/40 pt-4 flex justify-between items-center">
            <span>© 2026 KrishiMitra AI</span>
            <span className="bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border border-emerald-500/30">v1.0.0</span>
          </div>
        </div>

        {/* Right Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-white dark:bg-slate-800">
          <div className="flex items-center justify-end gap-3 mb-6">
            <div className="flex items-center bg-slate-100 dark:bg-slate-700 p-1 rounded-full border border-slate-200 dark:border-slate-600">
              <button 
                type="button"
                onClick={() => setLang('te')} 
                className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${lang === 'te' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'}`}>
                తెలుగు
              </button>
              <button 
                type="button"
                onClick={() => setLang('en')} 
                className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${lang === 'en' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'}`}>
                Eng
              </button>
            </div>

            <button 
              type="button"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 transition">
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl mb-6 border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${isLogin ? 'bg-emerald-700 text-white shadow-md' : 'text-slate-600 dark:text-slate-400'}`}
            >
              {lang === 'te' ? 'లాగిన్ (Log In)' : 'Log In'}
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${!isLogin ? 'bg-emerald-700 text-white shadow-md' : 'text-slate-600 dark:text-slate-400'}`}
            >
              {lang === 'te' ? 'కొత్త ఖాతా (Register)' : 'Register'}
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-1">
              {isLogin 
                ? (lang === 'te' ? 'రైతు ఖాతాలోకి ప్రవేశించండి' : 'Welcome Back')
                : (lang === 'te' ? 'కొత్త రైతు ఖాతాని సృష్టించండి' : 'Create Farmer Account')}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {isLogin 
                ? (lang === 'te' ? 'మీ పేరు మరియు పాస్‌వర్డ్‌తో లాగిన్ అవ్వండి' : 'Enter your credentials to access your dashboard')
                : (lang === 'te' ? 'వివరాలను నమోదు చేసి మీ ఖాతాను ప్రారంభించండి' : 'Fill in your details to register as a farmer')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                {lang === 'te' ? 'రైతు పేరు (Farmer Name)' : 'Farmer Name'}
              </label>
              <div className="relative">
                <User className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  placeholder="e.g. Manohar"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm outline-none transition"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  {lang === 'te' ? 'ఫోన్ నంబర్ (Phone Number)' : 'Phone Number'}
                </label>
                <div className="relative">
                  <Phone className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm outline-none transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                {lang === 'te' ? 'పాస్‌వర్డ్ (Password)' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm outline-none transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-lg transition active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{lang === 'te' ? 'ప్రాసెస్ అవుతోంది...' : 'Processing...'}</span>
                </>
              ) : (
                <span>
                  {isLogin 
                    ? (lang === 'te' ? 'లాగిన్ అవ్వండి (Log In)' : 'Log In')
                    : (lang === 'te' ? 'రిజిస్టర్ అవ్వండి (Register)' : 'Register')}
                </span>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
            {lang === 'te' ? 'కృషిమిత్ర AI - రైతుల సేవలో సదా ముందంజలో' : 'KrishiMitra AI - Empowering Agriculture Worldwide'}
          </p>

        </div>
      </div>
    </div>
  );
}

// Added Default Export for App.tsx compatibility
export default AuthComponent;