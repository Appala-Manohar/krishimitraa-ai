import { Award, ExternalLink, CheckCircle } from "lucide-react";

interface Scheme {
  id: number;
  title: string;
  teluguTitle: string;
  description: string;
  eligibility: string;
  link: string;
}

export default function Schemes() {
  const schemesList: Scheme[] = [
    {
      id: 1,
      title: "Telangana Agriculture Department & Fertilizer Services",
      teluguTitle: "తెలంగాణ వ్యవసాయ శాఖ & ఎరువుల సేవలు",
      description: "Official Telangana Agriculture Portal for subsidized Urea, fertilizers, seeds, and farm services.",
      eligibility: "Telangana Farmers with Pattadar Passbook / Aadhaar",
      link: "https://agri.telangana.gov.in/",
    },
    {
      id: 2,
      title: "Rythu Bandhu Scheme (రైతు బంధు)",
      teluguTitle: "రైతు బంధు పథకం",
      description: "Financial assistance of ₹10,000 per acre per year for crop investment support.",
      eligibility: "Land-owning farmers in Telangana state.",
      link: "https://rythubandhu.telangana.gov.in/",
    },
    {
      id: 3,
      title: "PM-KISAN Samman Nidhi",
      teluguTitle: "పి.ఎమ్. కిసాన్ సమ్మాన్ నిధి",
      description: "Direct income support of ₹6,000 per year in three equal installments of ₹2,000.",
      eligibility: "Small and marginal farmer families with cultivable land.",
      link: "https://pmkisan.gov.in/",
    },
    {
      id: 4,
      title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
      teluguTitle: "పంట బీమా పథకం",
      description: "Crop insurance coverage against natural calamities, pests, and diseases.",
      eligibility: "All farmers growing notified crops in notified areas.",
      link: "https://pmfby.gov.in/",
    },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto font-sans space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Award className="text-emerald-700" size={24} />
          ప్రభుత్వ పథకాలు & ఎరువుల సేవలు (Govt Schemes & Urea Services)
        </h1>
        <p className="text-xs text-slate-500 mt-1">అధికారిక ప్రభుత్వ పథకాలు మరియు తెలంగాణ వ్యవసాయ శాఖ పోర్టల్ వివరాలు.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {schemesList.map((scheme) => (
          <div
            key={scheme.id}
            className={`bg-white border p-5 rounded-3xl flex flex-col justify-between shadow-2xs transition ${
              scheme.id === 1 ? "border-emerald-500 bg-emerald-50/20" : "border-slate-200/80"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                  {scheme.id === 1 ? "★ Official State Portal" : "Government Scheme"}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-800">{scheme.title}</h3>
              <p className="text-xs font-semibold text-emerald-700 mt-0.5">{scheme.teluguTitle}</p>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{scheme.description}</p>
              
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-start gap-1.5 text-[11px] text-slate-500 font-medium">
                <CheckCircle size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <span> అర్హత: {scheme.eligibility}</span>
              </div>
            </div>

            <a
              href={scheme.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition"
            >
              అధికారిక వెబ్‌సైట్‌కి వెళ్ళండి (Visit Official Portal) <ExternalLink size={14} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}