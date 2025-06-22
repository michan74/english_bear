// composables/useImagePrompt.ts
export async function useImagePrompt(word: string) {
  const endpoint = `https://${useRuntimeConfig().public.cloudFunctionUrl}?word=${encodeURIComponent(word)}`;

  try {
    const res = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch prompt");
    }

    const data = await res.json();
    console.log("Received prompt:", data);

    return data.prompt; // => Geminiが返したプロンプト文字列
  } catch (err) {
    console.error(err);
    return null;
  }
}
