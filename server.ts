import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Server-side decision analysis endpoint
app.post([ "/api/analyze", /.*\/api\/analyze/ ], async (req, res) => {
  try {
    const { dilemma, context, customMetrics } = req.body;

    if (!dilemma || typeof dilemma !== "string" || dilemma.trim() === "") {
      return res.status(400).json({ error: "Dilemma is required" });
    }

    if (!apiKey) {
      return res.status(500).json({ 
        error: "GEMINI_API_KEY is not configured in environment variables. Please check your secrets." 
      });
    }

    const metricDescription = customMetrics && customMetrics.length > 0 
      ? `Ensure you evaluate specifically these variables: ${customMetrics.join(", ")}.`
      : "Evaluate standard variables like Effort, Long-term Value, Emotional Toll, and Financial Impact.";

    const prompt = `You are Faisla, an elegant and deeply analytical decision-making engine.
Your task is to analyze the following personal or professional dilemma and return a structured decision analysis report.

Dilemma: "${dilemma}"
Additional Context: "${context || 'No additional context provided.'}"

${metricDescription}

Please perform a thorough, objective, and deeply empathetic breakdown of this decision.
Extract hidden advantages (pros) and blind-spot risks (cons) people usually miss for each core choice.
Compose a clean SWOT analysis.
Compare the chosen paths across the key variables with solid ratings (scores out of 5, where 1 is low/poor/high burden and 5 is high/optimal/low friction).
Finally, offer a calm, deeply supportive, and decisive actionable recommendation, concluding with a tiny "First Step" they can perform within the next 24 hours.

Ensure tone is calm, supportive, analytical, and supportive of human agency. Do not include superficial platitudes. All text must be in natural, refined, editorial English.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            executiveSummary: {
              type: Type.OBJECT,
              properties: {
                acknowledgment: { 
                  type: Type.STRING, 
                  description: "A sympathetic, calm 2-3 sentence acknowledgment of the difficulty/gravity of the situation." 
                },
                coreTension: { 
                  type: Type.STRING, 
                  description: "Framing the fundamental tension or central trade-off of the decision." 
                }
              },
              required: ["acknowledgment", "coreTension"]
            },
            options: {
              type: Type.ARRAY,
              description: "The primary options or alternative paths considered (aim for 2 options).",
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Name of the path, e.g. 'Option A: Transact' or 'Option B: Maintain status quo'" },
                  pros: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Hidden advantages or long-term growth elements usually overlooked."
                  },
                  cons: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Hidden friction points, cognitive loads, or blind spot risks usually overlooked."
                  }
                },
                required: ["name", "pros", "cons"]
              }
            },
            swot: {
              type: Type.OBJECT,
              properties: {
                strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Internal advantages or resources that favor taking action." },
                weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Internal constraints, knowledge gaps, or liabilities." },
                opportunities: { type: Type.ARRAY, items: { type: Type.STRING }, description: "External tailwinds, positive future trends, or open doors." },
                threats: { type: Type.ARRAY, items: { type: Type.STRING }, description: "External vulnerabilities, structural risks, or competitive dangers." }
              },
              required: ["strengths", "weaknesses", "opportunities", "threats"]
            },
            comparison: {
              type: Type.ARRAY,
              description: "Assessments for each variable metric.",
              items: {
                type: Type.OBJECT,
                properties: {
                  metric: { type: Type.STRING, description: "Metric name (e.g. 'Emotional Toll', 'Effort', 'Financial Impact', 'Long-term Value')." },
                  ratings: {
                    type: Type.ARRAY,
                    description: "Rating values (1 to 5 integers) corresponding to each of the options in the options list in order. E.g. [4, 2] means first option gets 4, second gets 2.",
                    items: { type: Type.INTEGER }
                  },
                  tradeoffText: { type: Type.STRING, description: "A pristine 1-2 sentence text comparing how the paths contrast on this specific metric." }
                },
                required: ["metric", "ratings", "tradeoffText"]
              }
            },
            recommendation: {
              type: Type.OBJECT,
              properties: {
                decisivePath: { type: Type.STRING, description: "Clear, bold statement of the recommended decision/direction." },
                rationale: { type: Type.STRING, description: "Deep, objective support explaining why this choice is selected over others." },
                firstStep24Hours: { type: Type.STRING, description: "A simple, highly realistic step to execute in the next 24 hours to begin mapping this choice." }
              },
              required: ["decisivePath", "rationale", "firstStep24Hours"]
            }
          },
          required: ["executiveSummary", "options", "swot", "comparison", "recommendation"]
        }
      }
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);
    return res.json(data);
  } catch (error: any) {
    console.error("Analysis Error:", error);
    return res.status(500).json({ 
      error: "An error occurred while generating the Faisla analysis.", 
      details: error?.message || "" 
    });
  }
});

// Vite middleware flow for full-stack integration
async function main() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Faisla server running at http://0.0.0.0:${PORT}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server", err);
});
