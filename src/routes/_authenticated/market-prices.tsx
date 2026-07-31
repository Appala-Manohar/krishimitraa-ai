import { useState } from "react";
import { TrendingUp, Search, MapPin, Tag } from "lucide-react";

export default function MarketPrices() {
  const [searchQuery, setSearchQuery] = useState("");

  const marketData = [
    { id: 1, crop: "వరి (Paddy)", price: "₹2,203 / క్వింటాల్", change: "+₹45", location: "ఖమ్మం మార్కెట్", status: "up" },
    { id: 2, crop: "పత్తి (Cotton)", price: "₹7,100 / క్వింటాల్", change: "+₹120", location: "వరంగల్ మార్కెట్", status: "up" },
    { id: 3, crop: "మిర్చి (Chilli)", price: "₹18,500 / క్వింటాల్", change: "-₹200", location: "ఖమ్మం మార్కెట్", status: "down" },
    { id: 4, crop: "మొక్కజొన్న (Maize)", price: "₹2,050 / క్వింటాల్", change: "+₹15", location: "నిజామాబాద్ మార్కెట్", status: "up" },
    { id: 5, crop: "కందులు (Red Gram)", price: "₹10,250 / క్వింటాల్", change: "+₹80", location: "తండూర్ మార్కెట్", status: "up" },
  ];

  const filteredData = marketData.filter((item) =>
    item.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp className="text-emerald-700" size={26} />
            ప్రత్యక్ష మార్కెట్ ధరలు (Live Mandi Prices)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            తెలంగాణలోని వివిధ మార్కెట్ యార్డుల తాజా పంట ధరల వివరాలు.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative flex items-center w-full sm:w-72">
          <input
            type="text"
            placeholder="పంట లేదా మార్కెట్ వెతకండి..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-emerald-600 focus:bg-white transition"
          />
          <Search size={16} className="absolute left-3 text-slate-400" />
        </div>
      </div>

      {/* Prices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.map((item) => (
          <div
            key={item.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-base text-slate-800">{item.crop}</span>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  item.status === "up"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {item.change}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
              <MapPin size={14} className="text-emerald-600" />
              <span>{item.location}</span>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <Tag size={13} /> ప్రస్తుత ధర
              </span>
              <span className="text-base font-extrabold text-emerald-900">{item.price}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}