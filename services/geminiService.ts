
import { GoogleGenAI, Type } from "@google/genai";
import { VideoMetadata, ViralityReport } from "../types";

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
  
  // Rule: Always create fresh instance for API call
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  const prompt = `
    VIRALVANTAGE ENGINE PROMPT:
    
    User Input: ${metadata.title}
    Target Platform: ${metadata.platform}
    Niche: ${metadata.niche}
    User Description: ${metadata.description || 'N/A'}

    ${isUrl ? `
    DETECTION: This is a URL.
    TASK: Use 'googleSearch' tool to find the ACTUAL details of this video.
    Look for:
    1. Exact Title & Creator Name.
    2. Video Duration.
    3. Content Summary (Hook, Body, CTA).
    4. Comment sentiment & current view count if possible.
    
    Analyze the REAL video found from the web.
    ` : `
    DETECTION: This is a content draft/title.
    TASK: Evaluate the potential of this draft within the ${metadata.niche} niche.
    `}

    EVALUATION MATRIX:
    - METADATA: SEO performance, keyword density.
    - THUMBNAIL: Visual hook potential (if image provided).
    - VIDEO STRUCTURE: Predict retention based on typical ${metadata.platform} patterns.
    - TREND: Correlation with current viral hashtags/topics.

    Return the analysis in a structured JSON format according to the provided schema.
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
    throw new Error("AI did not return a valid report string.");
  }

  return JSON.parse(response.text);
}
