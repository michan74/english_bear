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

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({maxInstances: 10});

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const {VertexAI} = require("@google-cloud/vertexai");

// Location: e.g., us-central1
const location = "us-central1";
const project = process.env.GCLOUD_PROJECT;

const vertexAI = new VertexAI({project: project, location: location});

const generativeModel = vertexAI.getGenerativeModel({
  model: "gemini-2.0-flash", // または gemini-1.0-pro 等
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 1024,
  },
  safetySettings: [{category: "HARM_CATEGORY_HARASSMENT", threshold: 3}],
});

exports.generateImage = onRequest(async (request, response) => {
  // CORSの設定
  // 開発環境の場合、localhost:3000を許可
  // 本番環境にデプロイする際は、あなたのフロントエンドのドメインに置き換えるか、
  // 複数のドメインを許可する場合は、リクエストのOriginヘッダーをチェックして動的に設定するなどの考慮が必要です。
  response.set("Access-Control-Allow-Origin", "http://localhost:3000");
  response.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // プリフライトリクエスト (OPTIONSメソッド) に対応
  if (request.method === "OPTIONS") {
    response.status(204).send("");
    return;
  }

  const word = request.query.word || "bear";

  const prompt = `I want to create an illustration to help someone
    understand the English word ${word}. Please write a short visual 
    description of a scene that clearly shows what the word means, 
    using simple language and a charming tone.
    The scene should include a bear interacting naturally with 
    the object or concept. Avoid including any text, just describe 
    what should be visible in the image.`;

  try {
    const result = await generativeModel.generateContent({
      contents: [{role: "user", parts: [{text: prompt}]}],
    });

    logger.info(result.response, {structuredData: true});
    const generatedText = result.response.candidates[0].content.parts[0].text;

    // 成功した場合はJSON形式でレスポンスを返す
    response.status(200).json({text: generatedText}); // ここでjsonメソッドを使う
  } catch (error) {
    logger.error("Error generating content:", error, {structuredData: true});
    // エラーが発生した場合はエラーレスポンスを返す
    response.status(500).json({error: "Failed to generate image description."});
  }
});
