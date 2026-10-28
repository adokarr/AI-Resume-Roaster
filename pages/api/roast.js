import { GoogleGenAI } from "@google/genai";

const MIN_RESUME_LENGTH = 200;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed. Use POST.",
    });
  }

  const resumeText = req.body?.resumeText;

  if (
    typeof resumeText !== "string" ||
    resumeText.trim().length < MIN_RESUME_LENGTH
  ) {
    return res.status(400).json({
      error: "Resume must contain at least 200 characters.",
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "Gemini API key is missing. Check your .env file.",
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: apiKey,
    });

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: `
You are a witty, brutally honest resume reviewer.

Review the resume below. Give a funny but genuinely
useful roast. Point out weaknesses without being cruel.

End with exactly three concrete suggestions for improvement.
Format the ending exactly like this:

Suggestions:
1. ...
2. ...
3. ...

Resume:
${resumeText}
`,
      config: {
        maxOutputTokens: 2000,
      },
    });

    const roast = response.text?.trim();
    console.log("Finish reason:", response.candidates?.[0]?.finishReason);
    console.log("Roast length:", response.text?.length);

    if (!roast) {
      return res.status(500).json({
        error: "The AI returned an empty response.",
      });
    }

    return res.status(200).json({
      roast: roast,
    });
  } catch (error) {
    console.error("Resume roast failed:", error);
    const details = String(error?.message || error || "");
    const busy = details.includes("UNAVAILABLE") || details.includes("503");

    return res.status(busy ? 503 : 500).json({
      error: busy
        ? "The review service is busy. Please try again in a moment."
        : "Failed to generate the roast. Please try again.",
    });
  }
}
