import { useState, useEffect } from "react";
import {
  Search,
  Navigation,
  Wind,
  Droplets,
  Ruler,
  Play,
  Square,
  RefreshCw,
  Sun,
  Scan,
  MessageSquare,
  TrendingUp,
  ArrowRight,
  LayoutDashboard,
  Calculator,
  Award,
  Sprout,
  LogOut,
  User,
  MapPin,
  ShieldCheck,
  X,
  Save
} from "lucide-react";

interface WeatherData {
  temp: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  locationName: string;
}

interface GPSPoint {
  lat: number;
  lng: number;
}

interface FarmerProfile {
  name: string;
  phone: string;
  acres: string;
  fieldType: string;
  district: string;
}

export default function Dashboard() {
  const [profile, setProfile] = useState<FarmerProfile>({
    name: "A. Manohar",
    phone: "+91 9876543210",
    acres: "5",
    fieldType: "Paddy & Chilli (వరి మరియు మిరప)",
    district: "Khammam, Telangana",
  });
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [weather, setWeather] = useState<WeatherData>({
    temp: 28,
    humidity: 78,
    windSpeed: 14,
    condition: "Partly Cloudy",
    locationName: "Khammam, TS",
  });
  const [searchCity, setSearchCity] = useState("");
  const [weatherLoading, setWeatherLoading] = useState(false);

  const [isMeasuring, setIsMeasuring] = useState(false);
  const [gpsPoints, setGpsPoints] = useState<GPSPoint[]>([]);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [areaInSqMeters, setAreaInSqMeters] = useState<number>(0);

  const fetchWeatherByCoords = async (lat: number, lng: number, nameName?: string) => {
    setWeatherLoading(true);
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`
      );
      const data = await res.json();

      if (data?.current) {
        setWeather({
          temp: Math.round(data.current.temperature_2m),
          humidity: data.current.relative_humidity_2m,
          windSpeed: Math.round(data.current.wind_speed_10m),
          condition: getWeatherCondition(data.current.weather_code),
          locationName: nameName || `${lat.toFixed(2)}°, ${lng.toFixed(2)}°`,
        });
      }
    } catch (err) {
      console.error("Weather fetch error:", err);
    } finally {
      setWeatherLoading(false);
    }
  };

  const getWeatherCondition = (code: number) => {
    if (code === 0) return "Clear Sky";
    if (code <= 3) return "Partly Cloudy";
    if (code <= 65) return "Rainy";
    if (code <= 82) return "Heavy Rain";
    return "Cloudy";
  };

  const handleCitySearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCity.trim()) return;

    setWeatherLoading(true);
    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          searchCity
        )}&count=1&language=en&format=json`
      );
      const geoData = await geoRes.json();

      if (geoData?.results?.[0]) {
        const { latitude, longitude, name, admin1 } = geoData.results[0];
        const locationTitle = `${name}${admin1 ? `, ${admin1}` : ""}`;
        await fetchWeatherByCoords(latitude, longitude, locationTitle);
      } else {
        alert("ఊరి పేరు దొరకలేదు. దయచేసి సరిగ్గా టైప్ చేయండి.");
      }
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setWeatherLoading(false);
    }
  };

  const handleCurrentLocationWeather = () => {
    if (!navigator.geolocation) {
      alert("GPS మీ బ్రౌజర్‌లో పని చేయడం లేదు.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const revRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const revData = await revRes.json();
          const cityName =
            revData?.address?.suburb ||
            revData?.address?.village ||
            revData?.address?.town ||
            revData?.address?.city ||
            "Current Location";
          await fetchWeatherByCoords(latitude, longitude, cityName);
        } catch {
          await fetchWeatherByCoords(latitude, longitude, "Current Location");
        }
      },
      (err) => {
        alert("GPS లొకేషన్ దొరకలేదు: " + err.message);
      }
    );
  };

  useEffect(() => {
    handleCurrentLocationWeather();
  }, []);

  const calculateArea = (points: GPSPoint[]) => {
    if (points.length < 3) return 0;
    const origin = points[0];
    const metersPoints = points.map((p) => {
      const x = (p.lng - origin.lng) * 111320 * Math.cos((origin.lat * Math.PI) / 180);
      const y = (p.lat - origin.lat) * 110540;
      return { x, y };
    });

    let area = 0;
    const n = metersPoints.length;
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      area += metersPoints[i].x * metersPoints[j].y;
      area -= metersPoints[j].x * metersPoints[i].y;
    }
    return Math.abs(area / 2);
  };

  const startLandMeasurement = () => {
    if (!navigator.geolocation) {
      alert("మీ పరికరంలో GPS అందుబాటులో లేదు.");
      return;
    }
    setIsMeasuring(true);
    setGpsPoints([]);
    setAreaInSqMeters(0);

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const newPoint = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setGpsPoints((prev) => {
          const updated = [...prev, newPoint];
          setAreaInSqMeters(calculateArea(updated));
          return updated;
        });
      },
      (err) => console.error("GPS Watch Error:", err),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
    setWatchId(id);
  };

  const stopLandMeasurement = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
    }
    setIsMeasuring(false);
  };

  const resetLandMeasurement = () => {
    stopLandMeasurement();
    setGpsPoints([]);
    setAreaInSqMeters(0);
  };

  const handleLogout = () => {
    if (confirm("మీరు KrishiMitra AI నుండి లాగౌట్ అవ్వాలనుకుంటున్నారా?")) {
      window.location.href = "/auth";
    }
  };

  const acres = (areaInSqMeters / 4046.86).toFixed(2);
  const guntas = (areaInSqMeters / 101.17).toFixed(1);

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between p-4 flex-shrink-0 shadow-xs">
        <div>
          <div className="flex items-center gap-3 px-3 py-4 mb-4 border-b border-slate-100">
            <div className="p-2.5 bg-emerald-600 text-white rounded-2xl shadow-xs">
              <Sprout size={24} />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-800 leading-none">KrishiMitra</h1>
              <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                AI CROP PLATFORM
              </span>
            </div>
          </div>

          <nav className="space-y-1.5">
            <a
              href="/dashboard"
              className="flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-semibold bg-emerald-800 text-white shadow-xs"
            >
              <LayoutDashboard size={18} />
              Dashboard
            </a>
            <a
              href="/chat"
              className="flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-semibold text-slate-600 hover:bg-slate-100/80 transition"
            >
              <MessageSquare size={18} />
              AI Chat Assistant
            </a>
            <a
              href="/disease-detection"
              className="flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-semibold text-slate-600 hover:bg-slate-100/80 transition"
            >
              <Scan size={18} />
              Disease Detection
            </a>
            <a
              href="/fertilizer-calc"
              className="flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-semibold text-slate-600 hover:bg-slate-100/80 transition"
            >
              <Calculator size={18} />
              Fertilizer Calc
            </a>
            <a
              href="/market-prices"
              className="flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-semibold text-slate-600 hover:bg-slate-100/80 transition"
            >
              <TrendingUp size={18} />
              Market Prices
            </a>
            <a
              href="/schemes"
              className="flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-semibold text-slate-600 hover:bg-slate-100/80 transition"
            >
              <Award size={18} />
              Govt Schemes
            </a>
            <button
              onClick={() => setIsProfileOpen(true)}
              className="w-full text-left flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-semibold text-slate-600 hover:bg-emerald-50 hover:text-emerald-800 transition cursor-pointer"
            >
              <User size={18} />
              Farmer Profile
            </button>
          </nav>
        </div>

        <div className="space-y-2 pt-3 border-t border-slate-100">
          <div 
            onClick={() => setIsProfileOpen(true)}
            className="bg-emerald-50/70 border border-emerald-100 p-3 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-emerald-100/60 transition"
          >
            <div>
              <p className="text-[10px] text-slate-400 font-medium">Logged in as:</p>
              <p className="text-xs font-bold text-emerald-900">{profile.name}</p>
            </div>
            <ShieldCheck size={18} className="text-emerald-600" />
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-100 transition cursor-pointer"
          >
            <LogOut size={16} />
            Log Out
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="bg-emerald-600 rounded-3xl p-6 text-white shadow-xs relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
            <div>
              <span className="text-[10px] uppercase tracking-wider bg-emerald-700/80 px-2.5 py-1 rounded-full font-bold">
                LIVE ADVISORY SESSION
              </span>
              <h1 className="text-2xl md:text-3xl font-bold mt-2">
                స్వాగతం, {profile.name}! 🚜
              </h1>
              <p className="text-emerald-100 text-xs mt-1">
                Field: {profile.fieldType} ({profile.acres} Acres) | {profile.district}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3.5 rounded-2xl flex flex-col gap-2 min-w-[280px]">
              <div className="flex items-center justify-between gap-2 border-b border-white/20 pb-2">
                <form onSubmit={handleCitySearch} className="flex items-center gap-1.5 bg-white/20 rounded-xl px-2.5 py-1 flex-1">
                  <Search size={14} className="text-white/80" />
                  <input
                    type="text"
                    placeholder="Search city..."
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    className="w-full bg-transparent text-xs text-white placeholder-white/60 outline-none font-medium"
                  />
                </form>
                <button
                  type="button"
                  onClick={handleCurrentLocationWeather}
                  title="Current GPS Weather"
                  className="p-1.5 bg-emerald-500 hover:bg-emerald-400 rounded-xl transition text-white cursor-pointer"
                >
                  <Navigation size={14} />
                </button>
              </div>

              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-2 text-yellow-300">
                  <Sun size={28} />
                  <div>
                    <p className="text-xs font-semibold text-emerald-100 flex items-center gap-1">
                      <MapPin size={12} /> {weather.locationName}
                    </p>
                    <p className="text-lg font-bold text-white">{weatherLoading ? "..." : `${weather.temp}°C`}</p>
                  </div>
                </div>
                <span className="text-[11px] font-medium bg-emerald-900/40 px-2 py-0.5 rounded-lg text-white">
                  {weather.condition}
                </span>
              </div>

              <div className="flex justify-between text-[11px] text-emerald-100 pt-1 border-t border-white/10">
                <span className="flex items-center gap-1"><Droplets size={12} /> {weather.humidity}% Humidity</span>
                <span className="flex items-center gap-1"><Wind size={12} /> {weather.windSpeed} km/h</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <a
            href="/disease-detection"
            className="bg-white border border-slate-200/80 p-5 rounded-3xl hover:border-emerald-500 hover:shadow-md transition group flex flex-col justify-between min-h-[160px]"
          >
            <div>
              <div className="w-10 h-10 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center mb-3">
                <Scan size={20} />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Crop Disease Detection</h3>
              <p className="text-xs text-slate-500 mt-1">
                Upload or capture leaf photos with Live Camera for instant AI diagnosis.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700 mt-4 group-hover:translate-x-1 transition-transform">
              Scan Leaf <ArrowRight size={14} />
            </div>
          </a>

          <a
            href="/chat"
            className="bg-white border border-slate-200/80 p-5 rounded-3xl hover:border-emerald-500 hover:shadow-md transition group flex flex-col justify-between min-h-[160px]"
          >
            <div>
              <div className="w-10 h-10 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center mb-3">
                <MessageSquare size={20} />
              </div>
              <h3 className="text-sm font-bold text-slate-800">AI Farming Assistant</h3>
              <p className="text-xs text-slate-500 mt-1">
                Ask crop management questions in Telugu or English with Groq AI.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700 mt-4 group-hover:translate-x-1 transition-transform">
              Start Chat <ArrowRight size={14} />
            </div>
          </a>

          <a
            href="/market-prices"
            className="bg-white border border-slate-200/80 p-5 rounded-3xl hover:border-emerald-500 hover:shadow-md transition group flex flex-col justify-between min-h-[160px]"
          >
            <div>
              <div className="w-10 h-10 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center mb-3">
                <TrendingUp size={20} />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Mandi Market Prices</h3>
              <p className="text-xs text-slate-500 mt-1">
                Track live daily crop rates across nearby markets and mandis.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700 mt-4 group-hover:translate-x-1 transition-transform">
              Check Rates <ArrowRight size={14} />
            </div>
          </a>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4 mb-4 gap-3">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl">
                <Ruler size={22} />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800">
                  పొలం విస్తీర్ణ కొలత (GPS Land Area Calculator)
                </h2>
                <p className="text-xs text-slate-500">
                  పొలం చుట్టూ నడుస్తూ ప్రత్యక్షంగా భూమి విస్తీర్ణాన్ని ఎకరాల్లో కొలవండి.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isMeasuring ? (
                <button
                  onClick={startLandMeasurement}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Play size={14} /> స్టార్ట్ (Start GPS Walk)
                </button>
              ) : (
                <button
                  onClick={stopLandMeasurement}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Square size={14} /> స్టాప్ (Stop & Calculate)
                </button>
              )}
              <button
                onClick={resetLandMeasurement}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2.5 rounded-xl transition cursor-pointer"
                title="Reset"
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100">
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/70 shadow-2xs">
              <p className="text-[11px] text-slate-500 font-medium">GPS Points</p>
              <p className="text-lg font-bold text-emerald-800">{gpsPoints.length} Points</p>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/70 shadow-2xs">
              <p className="text-[11px] text-slate-500 font-medium">Square Meters</p>
              <p className="text-lg font-bold text-emerald-800">{areaInSqMeters.toFixed(1)} m²</p>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/70 shadow-2xs">
              <p className="text-[11px] text-slate-500 font-medium">Acres (ఎకరాలు)</p>
              <p className="text-lg font-bold text-emerald-800">{acres} Acres</p>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/70 shadow-2xs">
              <p className="text-[11px] text-slate-500 font-medium">Guntas (గుంటలు)</p>
              <p className="text-lg font-bold text-emerald-800">{guntas} Guntas</p>
            </div>
          </div>

          {isMeasuring && (
            <p className="text-xs text-emerald-700 font-semibold mt-3 flex items-center gap-2 animate-pulse">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              GPS Active: Recording boundary coordinates... Walk around your field.
            </p>
          )}
        </div>
      </main>

      {/* --- PROFILE MODAL --- */}
      {isProfileOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-xl border border-slate-100 relative">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <User size={20} className="text-emerald-700" />
                రైతు వివరాలు (Farmer Profile)
              </h2>
              <button
                onClick={() => setIsProfileOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600">రైతు పేరు (Farmer Name)</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600">ఫోన్ నంబర్ (Phone Number)</label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600">భూమి (Total Acres)</label>
                  <input
                    type="text"
                    value={profile.acres}
                    onChange={(e) => setProfile({ ...profile, acres: e.target.value })}
                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">జిల్లా / ఊరు (District)</label>
                  <input
                    type="text"
                    value={profile.district}
                    onChange={(e) => setProfile({ ...profile, district: e.target.value })}
                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600">పంట రకం (Field / Crop Type)</label>
                <input
                  type="text"
                  value={profile.fieldType}
                  onChange={(e) => setProfile({ ...profile, fieldType: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-emerald-600"
                />
              </div>

              <button
                onClick={() => {
                  alert("Profile details saved successfully!");
                  setIsProfileOpen(false);
                }}
                className="w-full mt-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition shadow-xs"
              >
                <Save size={16} /> Save Profile (వివరాలను సేవ్ చేయండి)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}