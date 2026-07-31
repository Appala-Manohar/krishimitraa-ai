import { useState, useEffect } from "react";
import { Sun, Cloud, Rain, MapPin, Droplets, Wind } from "lucide-react";

export default function WeatherWidget() {
  const [weather, setWeather] = useState({
    temp: "31°C",
    condition: "పాక్షికంగా మేఘావృతం",
    humidity: "68%",
    wind: "12 km/h",
    location: "తెలంగాణ",
  });

  return (
    <div className="bg-gradient-to-br from-emerald-800 to-teal-900 text-white rounded-3xl p-6 shadow-xl border border-emerald-700/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-emerald-200">
          <MapPin size={18} />
          <span className="font-semibold text-sm">{weather.location}</span>
        </div>
        <span className="text-xs bg-emerald-700/50 px-3 py-1 rounded-full border border-emerald-500/30 font-medium">
          లైవ్ అప్‌డేట్
        </span>
      </div>

      <div className="flex items-center justify-between my-2">
        <div>
          <h3 className="text-4xl font-extrabold tracking-tight">{weather.temp}</h3>
          <p className="text-xs text-emerald-100/80 mt-1 font-medium">{weather.condition}</p>
        </div>
        <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
          <Sun size={36} className="text-amber-300 animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-emerald-700/60 text-xs">
        <div className="flex items-center gap-2 text-emerald-100">
          <Droplets size={16} className="text-emerald-300" />
          <span>తేమ: <strong className="text-white">{weather.humidity}</strong></span>
        </div>
        <div className="flex items-center gap-2 text-emerald-100">
          <Wind size={16} className="text-emerald-300" />
          <span>గాలి వేగం: <strong className="text-white">{weather.wind}</strong></span>
        </div>
      </div>
    </div>
  );
}