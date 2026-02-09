
import { GoogleGenAI, Type } from "@google/genai";
import { VideoMetadata, ViralityReport } from "../types.ts";

const REPORT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    overallScore: { type: Type.NUMBER },
    metadataScore: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER },
        label: { type: Type.STRING },
        insights: { type: Type.ARRAY, items: { type: Type.STRING } },
        recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["score", "label", "insights", "recommendations"]
    },
    thumbnailScore: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER },
        label: { type: Type.STRING },
        insights: { type: Type.ARRAY, items: { type: Type.STRING } },
        recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["score", "label", "insights", "recommendations"]
    },
    videoScore: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER },
        label: { type: Type.STRING },
        insights: { type: Type.ARRAY, items: { type: Type.STRING } },
        recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["score", "label", "insights", "recommendations"]
    },
    trendScore: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER },
        label: { type: Type.STRING },
        insights: { type: Type.ARRAY, items: { type: Type.STRING } },
        recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["score", "label", "insights", "recommendations"]
    },
    timelineIssues: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          timestamp: { type: Type.STRING },
          type: { type: Type.STRING },
          message: { type: Type.STRING },
          color: { type: Type.STRING }
        },
        required: ["timestamp", "type", "message", "color"]
      }
    },
    actionPlan: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          task: { type: Type.STRING },
          priority: { type: Type.STRING },
          impact: { type: Type.STRING }
        },
        required: ["task", "priority", "impact"]
      }
    },
    generatedAssets: {
      type: Type.OBJECT,
      properties: {
        alternativeTitles: { type: Type.ARRAY, items: { type: Type.STRING } },
        descriptionHook: { type: Type.STRING },
        optimizedHashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
        thumbnailPrompt: { type: Type.STRING }
      },
      required: ["alternativeTitles", "descriptionHook", "optimizedHashtags", "thumbnailPrompt"]
    }
  },
  required: [
    "overallScore", "metadataScore", "thumbnailScore", "videoScore", 
    "trendScore", "timelineIssues", "actionPlan", "generatedAssets"
  ]
};

export async function analyzeContent(
  metadata: VideoMetadata,
  thumbnailBase64?: string
): Promise<ViralityReport> {
  const isUrl = metadata.title.toLowerCase().startsWith('http');
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  const prompt = `
    VIRALVANTAGE ENGINE ANALYTICS:
    
    Target: ${metadata.platform}
    Niche: ${metadata.niche}
    User Input: ${metadata.title}
    
    ${isUrl ? `
    ACTION: Use the 'googleSearch' tool to find the ACTUAL details of this video link.
    You MUST identify:
    1. Exact Title of the video.
    2. The creator's name.
    3. Content summary and length.
    4. Sentiment of the top comments and current view/like stats if available.
    
    Then, evaluate its virality based on this REAL data.
    ` : `
    ACTION: Evaluate this content draft or title for potential virality.
    `}

    Return the analysis as a JSON object matching the provided schema.
  `;

  const contents: any[] = [{ text: prompt }];
  
  if (thumbnailBase64) {
    contents.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: thumbnailBase64.split(',')[1] || thumbnailBase64
      }
    });
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: { parts: contents },
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: REPORT_SCHEMA,
    }
  });

  if (!response.text) {
    throw new Error("Gagal mendapatkan respons dari AI.");
  }

  return JSON.parse(response.text);
}
