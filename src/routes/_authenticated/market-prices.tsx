import { useState } from "react";
import { TrendingUp, Search, RefreshCw, ArrowUpRight, ArrowDownRight, MapPin } from "lucide-react";

interface CommodityPrice {
  id: number;
  cropName: string;
  teluguName: string;
  mandi: string;
  pricePerQuintal: number;
  change: number; // percentage or amount change
  isUp: boolean;
}

export default function MarketPrices() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("Telangana");

  const marketData: CommodityPrice[] = [
    { id: 1, cropName: "Paddy (Common)", teluguName: "వరి", mandi: "Khammam Mandi", pricePerQuintal: 2320, change: 15, isUp: true },
    { id: 2, cropName: "Chilli (Teja)", teluguName: "మిరప (తేజ)", mandi: "Khammam Market", pricePerQuintal: 18500, change: -120, isUp: false },
    { id: 3, cropName: "Cotton", teluguName: "పత్తి", mandi: "Warangal Mandi", pricePerQuintal: 7450, change: 80, isUp: true },
    { id: 4, cropName: "Maize", teluguName: "మొక్కజొన్న", mandi: "Nizamabad Mandi", pricePerQuintal: 2150, change: -10, isUp: false },
    { id: 5, cropName: "Groundnut", teluguName: "వేరుశనగ", mandi: "Mahabubnagar", pricePerQuintal: 6800, change: 45, isUp: true },
    { id: 6, cropName: "Red Gram (Toor)", teluguName: "కందులు", mandi: "Tandur Market", pricePerQuintal: 10250, change: 110, isUp: true },
  ];

  const filteredData = marketData.filter(
    (item) =>
      item.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.teluguName.includes(searchTerm) ||
      item.mandi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp className="text-emerald-600" size={24} />
            Mandi Market Prices (మార్కెట్ ధరలు)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time daily commodity market rates across major agricultural markets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search crop or mandi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-emerald-500 transition"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredData.map((item) => (
          <div key={item.id} className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-2xs hover:shadow-md transition">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-base font-bold text-slate-800">{item.cropName}</h3>
                <p className="text-xs font-semibold text-emerald-700">{item.teluguName}</p>
              </div>
              <span className={`flex items-center text-xs font-bold px-2.5 py-1 rounded-xl ${
                item.isUp ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
              }`}>
                {item.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {item.change > 0 ? `+${item.change}` : item.change} ₹
              </span>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-end justify-between">
              <div>
                <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                  <MapPin size={12} /> {item.mandi}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">Per Quintal (క్వింటాల్)</p>
              </div>
              <p className="text-lg font-extrabold text-slate-800">₹ {item.pricePerQuintal.toLocaleString("en-IN")}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}