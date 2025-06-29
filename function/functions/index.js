/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/https");
const logger = require("firebase-functions/logger");
const fetch = require("node-fetch");
const {VertexAI} = require("@google-cloud/vertexai");


// Cloud Function settings
setGlobalOptions({maxInstances: 10});

// Vertex AI settings
const location = "us-central1";
const project = process.env.GCLOUD_PROJECT;
const vertexAI = new VertexAI({project: project, location: location});

// OpenAI API settings
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_ORG_ID = "org-PMJ7FOFevvGd80AIpyC8W0Dz";
const OPENAI_API_URL = "https://api.openai.com/v1/images/generations";

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


// eslint-disable-next-line require-jsdoc
function withCors(handler) {
  return (req, res) => {
    // Cloudflare Pagesのローカル開発環境からのアクセスを許可
    // res.set("Access-Control-Allow-Origin", "http://localhost:3000");
    res.set("Access-Control-Allow-Origin", "https://aihackathon2-463515.web.app");
    res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }
    return handler(req, res);
  };
}

/**
 * 英単語のイラスト用プロンプトを生成するCloud Function
 */
exports.generatePrompt = onRequest(withCors(async (request, response) => {
  logger.info("プロンプト生成！");
  const word = request.query.word;

  if (!word) {
    response.status(400).json({error: "Word is required."});
    return;
  }

  const prompt = [
    `You are an assistant that generates illustration prompts for English vocabulary learning.`,
    `Given a single English word, return a JSON object with two fields:`,
    // eslint-disable-next-line max-len
    `1. "simple_definition": A short definition in simple English. Use no more than 10 words.`,
    // eslint-disable-next-line max-len
    `2. "image_prompt": A specific and concrete description of a visual scene that illustrates the word’s meaning.`,
    `3. "example_sentence": A simple sentence using the word in context.`,
    // eslint-disable-next-line max-len
    `If the input is not a valid English dictionary word, or if it is a non-English word, a made-up word, or a phrase (more than one word), return an error.`,
    `{"error": "Invalid input. Please enter a single valid English word."}`,
    `Only return the JSON object without any explanation or formatting.`,
    `Word: "${word}"`].join(" ");
  try {
    const gemini = vertexAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.6,
        topK: 40,
        topP: 1,
        maxOutputTokens: 1000,
      },
      safetySettings: [{category: "HARM_CATEGORY_HARASSMENT", threshold: 3}],
    });
    const result = await gemini.generateContent({
      contents: [{role: "user", parts: [{text: prompt}]}],
    });
    const generatedText = result.response.candidates[0].content.parts[0].text;
    const responseJson = JSON.parse(generatedText.replace(/```json|```/g, "").trim());
    response.status(200).json(responseJson);
  } catch (error) {
    logger.error("Error generating content:", error, {structuredData: true});
    response.status(500).json({error: error});
  }
}));

/**
 * Gemini/Imagenで画像を生成するCloud Function
 */
exports.generateImage = onRequest(withCors(async (request, response) => {
  logger.info("画像生成！");
  const prompt = request.query.prompt || (request.body && request.body.prompt);
  if (!prompt) {
    response.status(400).json({error: "Prompt is required."});
    return;
  }

  // くまのイラスト用プロンプトを生成
  const basePrompt = [
    `A simple flat-style vector illustration of a cute brown bear acting out the meaning of the word.`,
    `The bear is the main character and clearly shows the concept through its actions or situation.`,
    `The bear has a thick black outline, soft colors, and a friendly expression.`,
    // eslint-disable-next-line max-len
    `The background is pastel or beige, and the illustration is minimalist and child-friendly, like an educational flashcard.`,
    `Do not include any text or writing anywhere in the image.`,
  ].join(" ");

  const fullPrompt = `${basePrompt} Scene: ${prompt}`;

  try {
    const imagen = vertexAI.getGenerativeModel({
      model: "imagen-3.0-generate-002",
      generationConfig: {
        temperature: 0.6,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [{category: "HARM_CATEGORY_HARASSMENT", threshold: 3}],
    });
    const image = await imagen.generateContent({
      contents: [{role: "user", parts: [{text: fullPrompt}]}],
    });
    response.status(200).json({image});
  } catch (error) {
    response.status(500).json({error: error});
  }
}));

/**
 * OpenAI (DALL-E) で画像を生成するCloud Function
 */
exports.generateImageWithOpenAI = onRequest(withCors(async (request, response) => {
  try {
    logger.info("OpenAI画像生成開始！");
    const prompt = request.body && request.body.prompt;
    if (!prompt) {
      throw new Error("Prompt is required");
    }

    // くまのイラスト用プロンプトを生成
    const basePrompt = [
      `Create a simple flat-style vector illustration.`,
      // eslint-disable-next-line max-len
      `If the prompt includes human characters, replace humans with a bear character`,
      // eslint-disable-next-line max-len
      `The illustration should be child-friendly, minimalist. Use a pastel or beige background.`,
      `Do not include any text or writing anywhere in the image.`,
    ].join(" ");

    const fullPrompt = `${basePrompt} Scene: ${prompt}`;

    const openAIResponse = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "OpenAI-Organization": OPENAI_ORG_ID,
      },
      body: JSON.stringify({
        prompt: fullPrompt,
        n: 1,
        size: "512x512",
        response_format: "b64_json",
        model: "dall-e-2",
      }),
    });
    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.json();
      throw new Error(errorData.error.message || "Failed to generate image");
    }
    const data = await openAIResponse.json();
    logger.info("Image generated successfully");
    response.status(200).json({
      image: `data:image/webp;base64,${data.data[0].b64_json}`,
      revised_prompt: data.data[0].revised_prompt,
    });
  } catch (error) {
    logger.error("Error generating image:", error);
    response.status(500).json({
      error: error.message || "Failed to generate image",
      details: error,
    });
  }
}));

/**
 * Google Cloud Text-to-Speech で音声を生成するCloud Function
 */
const {TextToSpeechClient} = require("@google-cloud/text-to-speech");
const textToSpeech = new TextToSpeechClient({
  projectId: process.env.GCLOUD_PROJECT,
});

exports.generateSpeech = onRequest(withCors(async (request, response) => {
  try {
    logger.info("Text-to-Speech開始！");
    const text = request.body.text;
    logger.info("text:", text);
    if (!text) {
      throw new Error("Text is required");
    }
    const speechRequest = {
      input: {text},
      voice: {
        languageCode: "en-US",
        name: "en-US-Studio-O",
      },
      audioConfig: {
        audioEncoding: "MP3",
        pitch: 0,
        speakingRate: 1,
      },
    };
    const [speechResponse] = await textToSpeech.synthesizeSpeech(speechRequest);
    response.status(200).json({
      audioContent: speechResponse.audioContent.toString("base64"),
    });
  } catch (error) {
    logger.error("Error generating speech:", error);
    response.status(500).json({
      error: "Failed to generate speech",
      details: error.message,
    });
  }
}));

/**
 * くまの名言を生成するCloud Function
 */
exports.generateQuote = onRequest(withCors(async (request, response) => {
  const prompt = [
    `You are a gentle bear sharing encouraging thoughts with English learners.`,
    `Please generate a motivational message for someone learning English,`,
    `written from the perspective of a bear. The tone should be soft, kind, and uplifting — like a comforting quote.`,
    `Limit the message to 20 words or fewer.`,
    `Return only the quote, with no attribution or name.`,
  ].join(" ");
  try {
    const gemini = vertexAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 1,
        maxOutputTokens: 100,
      },
      safetySettings: [{category: "HARM_CATEGORY_HARASSMENT", threshold: 3}],
    });
    const result = await gemini.generateContent({
      contents: [{role: "user", parts: [{text: prompt}]}],
    });
    const generatedText = result.response.candidates[0].content.parts[0].text;
    response.status(200).json({quote: generatedText});
  } catch (error) {
    logger.error("Error generating content:", error, {structuredData: true});
    response.status(500).json({error: error});
  }
}));
