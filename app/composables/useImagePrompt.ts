// composables/useImagePrompt.ts
export async function usePromptGenerate(word: string) {
  const config = useRuntimeConfig();
  const endpoint = `${config.public.cloudFunctionPromptUrl}?word=${encodeURIComponent(word)}`;

  try {
    console.log("Calling endpoint:", endpoint);
    const res = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Response status:", res.status);
    if (!res.ok) {
      const errorText = await res.text();
      console.error("Error response:", errorText);
      throw new Error(`Failed to fetch prompt: ${res.status} ${errorText}`);
    }

    const data = await res.json();
    console.log("Received data:", data);

    if (!data) {
      throw new Error("Empty response from server");
    }

    return data;
  } catch (err) {
    console.error("Error in usePromptGenerate:", err);
    throw err;
  }
}

// Vertex AI Imagen用の画像生成（既存の関数）
export async function useImageGenerate(prompt: string) {
  const config = useRuntimeConfig();
  const endpoint = config.public.cloudFunctionImageUrl;

  try {
    console.log("Calling Vertex AI image endpoint:", endpoint);
    console.log("With prompt:", prompt);
    
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    console.log("Image response status:", res.status);
    if (!res.ok) {
      const errorText = await res.text();
      console.error("Error response:", errorText);
      throw new Error(`Failed to generate image: ${res.status} ${errorText}`);
    }

    const data = await res.json();
    console.log("Received image data:", data);

    if (!data || !data.image) {
      throw new Error("Invalid image response");
    }

    return data.image;
  } catch (err) {
    console.error("Error in useImageGenerate:", err);
    throw err;
  }
}

// OpenAI DALL-E用の画像生成（新規追加）
export async function useImageGenerateWithOpenAI(prompt: string) {
  const config = useRuntimeConfig();
  const endpoint = config.public.cloudFunctionImageWithOpenAIUrl;

  try {
    console.log("Calling OpenAI image endpoint:", endpoint);
    console.log("With prompt:", prompt);
    
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    console.log("OpenAI image response status:", res.status);
    if (!res.ok) {
      const errorText = await res.text();
      console.error("OpenAI error response:", errorText);
      throw new Error(`Failed to generate image with OpenAI: ${res.status} ${errorText}`);
    }

    const data = await res.json();
    console.log("Received OpenAI image data:", data);

    if (!data || !data.image) {
      throw new Error("Invalid OpenAI image response");
    }

    return data.image; // OpenAIが返す画像URL
  } catch (err) {
    console.error("Error in useImageGenerateWithOpenAI:", err);
    throw err;
  }
}
