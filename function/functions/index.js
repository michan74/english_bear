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
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const {VertexAI} = require("@google-cloud/vertexai");

// CORS用のミドルウェアを作成
const corsHandler = cors({
  origin: true, // 開発中は全てのオリジンを許可
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

// Express setup
const app = express();
app.use(cors({origin: "http://localhost:3000"}));
app.use(express.json());

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

exports.generatePrompt = onRequest((request, response) => {
  return corsHandler(request, response, async () => {
    try {
      logger.info("プロンプト生成！");
      const word = request.query.word || "bear";

      // テスト用の固定レスポンス
      const mockResponse = {
        simple_definition: `A ${word} is a common word that everyone knows!`,
        image_prompt: "A cute cartoon character sitting in a sunny garden with flowers and butterflies",
      };

      response.status(200).json(mockResponse);
    } catch (error) {
      logger.error("Error in generatePrompt:", error);
      response.status(500).json({
        error: error.message || "Failed to generate prompt",
        details: error,
      });
    }
  });
});

// 画像生成API
exports.generateImageWithOpenAI = onRequest((request, response) => {
  return corsHandler(request, response, async () => {
    try {
      logger.info("OpenAI画像生成開始！");
      const prompt = request.body && request.body.prompt;
      
      if (!prompt) {
        throw new Error("Prompt is required");
      }

      const openAIResponse = await fetch(OPENAI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "OpenAI-Organization": OPENAI_ORG_ID,
        },
        body: JSON.stringify({
          prompt: prompt,
          n: 1,
          size: "1024x1024",
          response_format: "b64_json",
          // model: "gpt-image-1",
          model: "dall-e-3",
        }),
      });

      if (!openAIResponse.ok) {
        const errorData = await openAIResponse.json();
        throw new Error(errorData.error?.message || "Failed to generate image");
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
  });
});
