import { useState } from "react";
import { FlaskConical, Scale, CheckCircle } from "lucide-react";

export default function FertilizerCalc() {
  const [crop, setCrop] = useState("paddy");
  const [acres, setAcres] = useState<number>(1);
  const [soilType, setSoilType] = useState("black");

  // NPK calculation formulas based on crop standards (per acre)
  const getRequirements = () => {
    let urea = 0;
    let dap = 0;
    let mop = 0;
    let organic = 0;

    switch (crop) {
      case "paddy":
        urea = 110 * acres;
        dap = 50 * acres;
        mop = 40 * acres;
        organic = 500 * acres;
        break;
      case "cotton":
        urea = 130 * acres;
        dap = 65 * acres;
        mop = 50 * acres;
        organic = 600 * acres;
        break;
      case "chilli":
        urea = 150 * acres;
        dap = 75 * acres;
        mop = 60 * acres;
        organic = 800 * acres;
        break;
      case "maize":
        urea = 100 * acres;
        dap = 50 * acres;
        mop = 35 * acres;
        organic = 400 * acres;
        break;
      default:
        urea = 100 * acres;
        dap = 50 * acres;
        mop = 40 * acres;
        organic = 500 * acres;
    }

    // Soil type adjustments
    if (soilType === "sandy") {
      urea = Math.round(urea * 1.1); // Needs 10% more Nitrogen due to leaching
    }

    return { urea, dap, mop, organic };
  };

  const results = getRequirements();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-pink-100 text-pink-700 p-3 rounded-2xl">
          <FlaskConical size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            🧪 NPK Fertilizer Calculator
          </h1>
          <p className="text-gray-500 text-sm">
            Calculate accurate fertilizer dosages based on crop type & land size in Acres.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Form Inputs */}
        <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-sm space-y-4 md:col-span-1">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
              Select Crop (పంట)
            </label>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full border rounded-xl p-3 bg-gray-50 outline-none focus:border-green-600 font-semibold"
            >
              <option value="paddy">Paddy / వరి</option>
              <option value="cotton">Cotton / పత్తి</option>
              <option value="chilli">Chilli / మిర్చి</option>
              <option value="maize">Maize / మొక్కజొన్న</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
              Land Area in Acres (ఎకరాలు)
            </label>
            <input
              type="number"
              min="0.5"
              step="0.5"
              value={acres}
              onChange={(e) => setAcres(Math.max(0.5, parseFloat(e.target.value) || 1))}
              className="w-full border rounded-xl p-3 outline-none focus:border-green-600 font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
              Soil Type (నేల రకం)
            </label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full border rounded-xl p-3 bg-gray-50 outline-none focus:border-green-600 font-semibold"
            >
              <option value="black">Black Soil / నల్ల రేగడి</option>
              <option value="red">Red Soil / ఎర్ర నేల</option>
              <option value="sandy">Sandy Soil / ఇసుక నేల</option>
            </select>
          </div>
        </div>

        {/* Calculated Results */}
        <div className="md:col-span-2 bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-3xl border border-green-200 shadow-md">
          <h2 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
            <Scale size={20} /> Recommended Dosages for {acres} Acre(s)
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-green-100">
              <span className="text-xs text-gray-500 uppercase font-bold">Urea (యూరియా)</span>
              <p className="text-3xl font-extrabold text-green-700 mt-1">{results.urea} kg</p>
              <p className="text-xs text-gray-400 mt-1">Nitrogen Source</p>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-green-100">
              <span className="text-xs text-gray-500 uppercase font-bold">DAP (డి.ఎ.పి)</span>
              <p className="text-3xl font-extrabold text-emerald-700 mt-1">{results.dap} kg</p>
              <p className="text-xs text-gray-400 mt-1">Phosphorus Source</p>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-green-100">
              <span className="text-xs text-gray-500 uppercase font-bold">Potash / MOP (పోటాష్)</span>
              <p className="text-3xl font-extrabold text-teal-700 mt-1">{results.mop} kg</p>
              <p className="text-xs text-gray-400 mt-1">Potassium Source</p>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-green-100">
              <span className="text-xs text-gray-500 uppercase font-bold">Organic Compost (సేంద్రీయ ఎరువు)</span>
              <p className="text-3xl font-extrabold text-amber-700 mt-1">{results.organic} kg</p>
              <p className="text-xs text-gray-400 mt-1">Soil Health Improvement</p>
            </div>
          </div>

          <div className="mt-6 bg-white/80 p-4 rounded-2xl text-xs text-gray-600 flex items-start gap-2">
            <CheckCircle size={16} className="text-green-600 shrink-0 mt-0.5" />
            <span>
              యూరియాను 2-3 విడతలుగా (సగానికి విడగొట్టి) పంట పెరుగుదల సమయంలో వేయడం శ్రేయస్కరం.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}