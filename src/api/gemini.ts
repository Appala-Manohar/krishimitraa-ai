import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "AQ.Ab8RN6I2i2q3JgtaSn_2kakBKXT6_6KiZaL40U6HHxOCtswp8g";

// Smart Fallback Agricultural Knowledge
const fallbackTeluguKnowledge: Record<string, string> = {
  paddy: `**వరి (Paddy) పంట రక్షణ సలహా:**\n\n**1. తక్షణ చర్యలు:**\n* పొలంలో నీటిని తీసివేసి 2-3 రోజులు ఆరనివ్వండి.\n* నత్రజని (యూరియా) ఎరువుల వాడకాన్ని వెంటనే నిలిపివేయండి.\n\n**2. పురుగుమందుల పిచికారీ:**\n* పైమెట్రోజైన్ 50% WG @ 120 గ్రాములు/ఎకరానికి పిచికారీ చేయండి.\n* లేదా డినోటేఫురాన్ 20% SG @ 80-100 గ్రాములు పిచికారీ చేయండి.\n\n**3. ముఖ్యమైన జాగ్రత్తలు:**\n* ఎకరానికి కనీసం 200 లీటర్ల నీరు వాడండి. మందును మొక్కల మొదళ్లకు తగిలేలా పిచికారీ చేయండి.`,
  cotton: `**ప్రత్తి (Cotton) పంట రక్షణ సలహా:**\n\n**1. తక్షణ చర్యలు:**\n* గులాబీ రంగు పురుగు / రసం పీల్చే పురుగుల ఉధృతిని గమనించండి.\n* ఎకరానికి 4-5 లింగ ఆకర్షణ బుట్టలు (Pheromone Traps) అమర్చండి.\n\n**2. పిచికారీ మందులు:**\n* ఫ్లోనికామిడ్ 50% WG @ 60 గ్రా/ఎకరానికి వాడండి.\n\n**3. జాగ్రత్తలు:**\n* నైట్రోజన్ ఎరువులు పరిమితికి మించి వాడకండి.`,
  chilli: `**మిరప (Chilli) తామర పురుగుల నివారణ:**\n\n**1. తక్షణ చర్యలు:**\n* ఆకులు ముడుచుకుపోవడం గమనిస్తే తోటలో నీలి, పసుపు రంగు జిగురు అట్టలు ఏర్పాటు చేయండి.\n\n**2. పిచికారీ మందులు:**\n* స్పినోసద్ 45% SC @ 75 మి.లీ/ఎకరానికి లేదా ఫిప్రోనిల్ 80% WG వాడండి.`,
  default: `**వ్యవసాయ సలహా సూచనలు:**\n\n**1. తక్షణ చర్యలు:**\n* పంటలో వ్యాధి లక్షణాలు ఉన్న ఆకులను ఏరివేసి దూరంగా నాశనం చేయండి.\n* పొలంలో గాలి, వెలుతురు సరిగ్గా సోకేలా చూసుకోండి.\n\n**2. రసాయన/సేంద్రీయ యాజమాన్యం:**\n* లీటరు నీటికి 3 గ్రా. కాపర్ ఆక్సీక్లోరైడ్ లేదా నీమ్ ఆయిల్ (10,000 PPM) 2 మి.లీ కలిపి పిచికారీ చేయండి.\n\n**3. ముఖ్యమైన జాగ్రత్తలు:**\n* సాయంత్రం వేళల్లో మాత్రమే పిచికారీ చేపట్టండి.`
};

export async function askGemini(prompt: string): Promise<string> {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const structuredPrompt = `
      You are KrishiMitra AI, an expert Indian agricultural advisory assistant.
      User asked: "${prompt}"

      Answer strictly in TELUGU language with bullet points:
      - **1. తక్షణ చర్యలు:**
      - **2. పురుగుమందుల/ఎరువుల పిచికారీ:**
      - **3. ముఖ్యమైన జాగ్రత్తలు:**
    `;

    const result = await model.generateContent(structuredPrompt);
    const responseText = result.response.text();
    if (responseText) return responseText;
  } catch (error) {
    console.warn("Gemini API fallback engaged:", error);
  }

  // Fallback response generator if API key fails
  const lower = prompt.toLowerCase();
  if (lower.includes("paddy") || lower.includes("వరి") || lower.includes("dhoma") || lower.includes("పంట")) {
    return fallbackTeluguKnowledge.paddy;
  } else if (lower.includes("cotton") || lower.includes("ప్రత్తి")) {
    return fallbackTeluguKnowledge.cotton;
  } else if (lower.includes("chilli") || lower.includes("మిరప")) {
    return fallbackTeluguKnowledge.chilli;
  }
  return fallbackTeluguKnowledge.default;
}