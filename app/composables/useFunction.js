export async function generatePrompt(word) {
  try {
    const response = await fetch(`${useRuntimeConfig().public.cloudFunctionUrl}?word=${encodeURIComponent(word)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch prompt");
      }

    const data = await response.json();
    console.log(data);
    return data.text;
  } catch (err) {
    console.error(err);
    return null;
  }
}