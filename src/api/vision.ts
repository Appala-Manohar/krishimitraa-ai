export async function analyzeCropDisease(base64Image: string, mimeType: string = "image/jpeg") {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing VITE_GEMINI_API_KEY in .env file.");
  }

  const prompt = `You are Krishi Doctor, an expert plant pathologist for Indian agriculture. 
Analyze this plant/leaf image and return a JSON object with EXACTLY this structure (no markdown formatting, just plain JSON):
{
  "diseaseName": "Name of disease or Healthy",
  "confidence": "High/Medium/Low",
  "symptoms": ["Symptom 1", "Symptom 2"],
  "organicTreatment": "Detailed eco-friendly treatment in Telugu & English",
  "chemicalTreatment": "Recommended chemical spray with dosage in Telugu & English",
  "prevention": "Prevention tips for farmers"
}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: base64Image,
                },
              },
            ],
          },
        ],
      }),
    }
  );

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!rawText) throw new Error("No response from Gemini AI Vision.");

  // Clean JSON response
  const cleanedText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
  return JSON.parse(cleanedText);
}