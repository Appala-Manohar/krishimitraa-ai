import { useState, useEffect } from 'react';
import AuthComponent from './routes/auth';
import { 
  ShieldCheck, LayoutDashboard, Stethoscope, SunMedium, 
  TrendingUp, MessageSquareText, LogOut, Moon, Sun, 
  Menu, X, Sparkles, Upload 
} from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'disease' | 'weather' | 'market' | 'chat'>('dashboard');
  const [user, setUser] = useState<{ name: string }>({ name: 'Manohar' });
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Check Authentication status on load
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token') || localStorage.getItem('krishimitra_token');
      const authFlag = localStorage.getItem('isAuthenticated') === 'true';
      const storedUser = localStorage.getItem('krishimitra_user') || localStorage.getItem('user');

      if (token || authFlag) {
        setIsAuthenticated(true);
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {
            setUser({ name: 'Manohar' });
          }
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  // If not logged in, render Auth Page
  if (!isAuthenticated && window.location.pathname !== '/dashboard') {
    return <AuthComponent />;
  }

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-emerald-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-5 border-b border-emerald-800/60">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 p-2 rounded-xl">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-wide">KrishiMitra AI</span>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden p-1 text-emerald-300 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="p-4 space-y-1.5 font-medium text-sm">
          <button
            onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'dashboard' ? 'bg-emerald-700 text-white shadow-md' : 'text-emerald-100 hover:bg-emerald-800/60'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>డ్యాష్‌బోర్డ్ (Dashboard)</span>
          </button>

          <button
            onClick={() => { setActiveTab('disease'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'disease' ? 'bg-emerald-700 text-white shadow-md' : 'text-emerald-100 hover:bg-emerald-800/60'}`}
          >
            <Stethoscope className="w-5 h-5" />
            <span>పంట వ్యాధి గుర్తింపు (Disease AI)</span>
          </button>

          <button
            onClick={() => { setActiveTab('weather'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'weather' ? 'bg-emerald-700 text-white shadow-md' : 'text-emerald-100 hover:bg-emerald-800/60'}`}
          >
            <SunMedium className="w-5 h-5" />
            <span>వాతావరణం (Weather)</span>
          </button>

          <button
            onClick={() => { setActiveTab('market'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'market' ? 'bg-emerald-700 text-white shadow-md' : 'text-emerald-100 hover:bg-emerald-800/60'}`}
          >
            <TrendingUp className="w-5 h-5" />
            <span>మార్కెట్ ధరలు (Market Prices)</span>
          </button>

          <button
            onClick={() => { setActiveTab('chat'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'chat' ? 'bg-emerald-700 text-white shadow-md' : 'text-emerald-100 hover:bg-emerald-800/60'}`}
          >
            <MessageSquareText className="w-5 h-5" />
            <span>AI రైతు సలహాదారు (AI Assistant)</span>
          </button>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-emerald-800/60">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-red-600/80 hover:bg-red-600 text-white rounded-xl text-sm font-semibold transition"
          >
            <LogOut className="w-4 h-4" />
            <span>లాగ్ అవుట్ (Log Out)</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header */}
        <header className={`flex items-center justify-between px-6 py-4 border-b ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 text-slate-600 dark:text-slate-300">
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold">స్వాగతం, <span className="text-emerald-600">{user.name || 'Manohar'}</span> 🌾</h2>
          </div>

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:opacity-80 transition"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>
        </header>

        {/* Active Tabs */}
        <main className="flex-1 p-6 overflow-y-auto">
          
          {/* DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
                <div className="relative z-10 max-w-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold mb-3">
                    <Sparkles className="w-3.5 h-3.5" /> AI Powered Farm Assistant
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">రైతు సేవల సమగ్ర వేదిక</h1>
                  <p className="text-emerald-100 text-sm">మీ పంటల ఆరోగ్యం, వాతావరణ సమాచారం మరియు ప్రత్యక్ష మార్కెట్ ధరలను ఇక్కడే పర్యవేక్షించండి.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div onClick={() => setActiveTab('disease')} className={`p-5 rounded-2xl border cursor-pointer hover:shadow-md transition ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <div className="p-3 bg-emerald-100 text-emerald-700 w-fit rounded-xl mb-3"><Stethoscope className="w-6 h-6" /></div>
                  <h3 className="font-bold text-base mb-1">వ్యాధి గుర్తింపు</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">ఆకు ఫోటో అప్‌లోడ్ చేసి నివారణ తెలుసుకోండి</p>
                </div>

                <div onClick={() => setActiveTab('weather')} className={`p-5 rounded-2xl border cursor-pointer hover:shadow-md transition ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <div className="p-3 bg-amber-100 text-amber-700 w-fit rounded-xl mb-3"><SunMedium className="w-6 h-6" /></div>
                  <h3 className="font-bold text-base mb-1">వాతావరణం</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">వర్ష సూచన & ఉష్ణోగ్రత హెచ్చరికలు</p>
                </div>

                <div onClick={() => setActiveTab('market')} className={`p-5 rounded-2xl border cursor-pointer hover:shadow-md transition ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <div className="p-3 bg-blue-100 text-blue-700 w-fit rounded-xl mb-3"><TrendingUp className="w-6 h-6" /></div>
                  <h3 className="font-bold text-base mb-1">మార్కెట్ ధరలు</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">స్థానిక మార్కెట్ రోజువారీ క్వింటాల్ ధరలు</p>
                </div>

                <div onClick={() => setActiveTab('chat')} className={`p-5 rounded-2xl border cursor-pointer hover:shadow-md transition ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <div className="p-3 bg-purple-100 text-purple-700 w-fit rounded-xl mb-3"><MessageSquareText className="w-6 h-6" /></div>
                  <h3 className="font-bold text-base mb-1">AI చార్ట్ సహాయం</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">ఎరువులు, పురుగుమందుల సంశయ నివృత్తి</p>
                </div>
              </div>
            </div>
          )}

          {/* DISEASE */}
          {activeTab === 'disease' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <h2 className="text-xl font-bold mb-1">పంట వ్యాధి AI గుర్తింపు (Disease Detection)</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">వ్యాధిసోకిన ఆకు లేదా పంట ఫోటోను అప్‌లోడ్ చేయండి</p>
                
                <div className="border-2 border-dashed border-emerald-500/40 rounded-2xl p-8 text-center bg-emerald-50/30 dark:bg-emerald-950/20 hover:bg-emerald-50/60 transition cursor-pointer">
                  <Upload className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
                  <p className="text-sm font-semibold mb-1">ఫోటోను ఇక్కడ వేయండి లేదా ఎంచుకోండి</p>
                  <p className="text-xs text-slate-400">PNG, JPG format (Max 5MB)</p>
                </div>
              </div>
            </div>
          )}

          {/* WEATHER */}
          {activeTab === 'weather' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <h2 className="text-xl font-bold mb-4">వాతావరణ సమాచారం (Live Weather Updates)</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                    <span className="text-xs text-emerald-600 font-bold uppercase">ఉష్ణోగ్రత</span>
                    <p className="text-3xl font-extrabold mt-1">31°C</p>
                  </div>
                  <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                    <span className="text-xs text-blue-600 font-bold uppercase">తేమ (Humidity)</span>
                    <p className="text-3xl font-extrabold mt-1">68%</p>
                  </div>
                  <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                    <span className="text-xs text-amber-600 font-bold uppercase">వర్ష సూచన</span>
                    <p className="text-3xl font-extrabold mt-1">సాధారణ వర్షం</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MARKET */}
          {activeTab === 'market' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <h2 className="text-xl font-bold mb-4">ప్రత్యక్ష మార్కెట్ ధరకు అనుగుణంగా (Live Market Prices)</h2>
                <div className="divide-y divide-slate-200 dark:divide-slate-700">
                  <div className="py-3 flex justify-between items-center"><span className="font-semibold text-sm">వరి (Paddy)</span><span className="font-bold text-emerald-600 text-sm">₹2,300 / క్వింటాల్</span></div>
                  <div className="py-3 flex justify-between items-center"><span className="font-semibold text-sm">మిర్చి (Chilli)</span><span className="font-bold text-emerald-600 text-sm">₹18,500 / క్వింటాల్</span></div>
                  <div className="py-3 flex justify-between items-center"><span className="font-semibold text-sm">పత్తి (Cotton)</span><span className="font-bold text-emerald-600 text-sm">₹7,100 / క్వింటాల్</span></div>
                  <div className="py-3 flex justify-between items-center"><span className="font-semibold text-sm">మొక్కజొన్న (Maize)</span><span className="font-bold text-emerald-600 text-sm">₹2,150 / క్వింటాల్</span></div>
                </div>
              </div>
            </div>
          )}

          {/* CHAT */}
          {activeTab === 'chat' && (
            <div className="max-w-3xl mx-auto h-[75vh] flex flex-col rounded-3xl border overflow-hidden bg-white dark:bg-slate-800 dark:border-slate-700 shadow-sm">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-emerald-900 text-white flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-emerald-300" />
                <div>
                  <h3 className="font-bold text-sm">కృషిమిత్ర AI హెల్ప్‌డెస్క్</h3>
                  <p className="text-[10px] text-emerald-200">24/7 ఉచిత రైతు సలహా సేవ</p>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                <div className="bg-emerald-100 dark:bg-emerald-950/60 text-slate-800 dark:text-slate-100 p-3.5 rounded-2xl max-w-md text-xs sm:text-sm">
                  నమస్కారం {user.name || 'Manohar'} గారూ! మీ పంట గురించిన ఏ ప్రశ్లనైనా ఇక్కడ అడగండి.
                </div>
              </div>

              <div className="p-3 border-t border-slate-200 dark:border-slate-700 flex gap-2">
                <input type="text" placeholder="మీ ప్రశ్న ఇక్కడ టైప్ చేయండి..." className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm outline-none" />
                <button className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition">పంపు</button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}