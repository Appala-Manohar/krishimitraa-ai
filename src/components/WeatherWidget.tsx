import { useEffect, useState } from "react";
import { MapPin, Droplets, Wind, AlertCircle, CloudSun } from "lucide-react";

interface WeatherData {
  temp: number;
  humidity: number;
  windSpeed: number;
  condition: string;
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`
          );
          const data = await res.json();

          setWeather({
            temp: Math.round(data.current.temperature_2m),
            humidity: data.current.relative_humidity_2m,
            windSpeed: data.current.wind_speed_10m,
            condition: "Live Field Conditions",
          });
        } catch (err) {
          setError("Failed to fetch live weather data.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Please enable GPS/Location access for accurate live farm weather.");
        setLoading(false);
      }
    );
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-green-800 text-white rounded-3xl animate-pulse flex items-center justify-between">
        <div className="text-lg">Fetching live GPS weather for your farm...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl flex items-center gap-2">
        <AlertCircle size={20} />
        <span className="text-sm">{error}</span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-green-700 via-emerald-700 to-teal-800 text-white p-6 rounded-3xl shadow-xl flex justify-between items-center">
      <div>
        <div className="flex items-center gap-2 text-green-100 text-sm">
          <MapPin size={16} />
          <span>Live GPS Location</span>
        </div>
        <div className="text-5xl font-extrabold mt-2">{weather?.temp}°C</div>
        <p className="text-green-100 text-sm mt-1">{weather?.condition}</p>
      </div>

      <div className="flex gap-6 text-right">
        <div className="flex flex-col items-center">
          <Droplets size={22} className="text-blue-200" />
          <span className="text-xs text-green-100 mt-1">Humidity</span>
          <span className="font-bold text-base">{weather?.humidity}%</span>
        </div>
        <div className="flex flex-col items-center">
          <Wind size={22} className="text-teal-200" />
          <span className="text-xs text-green-100 mt-1">Wind</span>
          <span className="font-bold text-base">{weather?.windSpeed} km/h</span>
        </div>
      </div>
    </div>
  );
}