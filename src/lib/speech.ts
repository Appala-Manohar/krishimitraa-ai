// Speech to Text (Voice Input)
export const startVoiceRecognition = (
  onResult: (text: string) => void,
  lang: string = "te-IN"
) => {
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Voice recognition is not supported on this browser.");
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = lang; // 'te-IN' for Telugu, 'en-US' for English
  recognition.interimResults = false;

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  recognition.start();
  return recognition;
};

// Text to Speech (Audio Output for Farmers)
export const speakText = (text: string, lang: string = "te-IN") => {
  if (!("speechSynthesis" in window)) {
    alert("Text-to-speech is not supported on this browser.");
    return;
  }

  window.speechSynthesis.cancel(); // Stop any active speech
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.9; // Farmer-friendly clear reading speed
  window.speechSynthesis.speak(utterance);
};