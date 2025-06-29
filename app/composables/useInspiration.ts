// composables/useInspiration.ts
import { ref } from 'vue'
import { useSpeech } from "~/composables/useSpeech";

interface Quote {
  text: string;
  author: string;
  audioUrl?: string;
}

export const useInspiration = () => {
  const generateQuote = async () => {
    const config = useRuntimeConfig();
    const endpoint = config.public.cloudFunctionQuoteUrl;

    try {
      console.log("Calling endpoint:", endpoint);
      const res = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch quote: ${res.status}`);
      }

      const data = await res.json();
      console.log("Received data:", data);

      if (!data || !data.quote) {
        throw new Error("Invalid response format");
      }

      const { generateSpeech } = useSpeech()
      const { audioUrl } = await generateSpeech(data.quote);

      const date = new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour12: true
      });

      const newQuote: Quote = {
        text: `${data.quote}`,
        author: `- Bear Horizon ${date}`,
        audioUrl: audioUrl ? audioUrl : undefined,
      };
      
      return newQuote;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : '予期せぬエラーが発生しました';
      console.error('Error generating quote:', e);
      throw new Error(errorMessage);
    } 
  };

  return {
    generateQuote,
  };
};
