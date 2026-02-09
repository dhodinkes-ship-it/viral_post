
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
  const isUrl = metadata.title.startsWith('http');
  
  // Rule: Create instance right before API call
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  const prompt = `
    IMPORTANT: The user has provided ${isUrl ? `a URL: ${metadata.title}` : `the following title: ${metadata.title}`}.
    
    ${isUrl ? `ACTION REQUIRED: Use Google Search to find the ACTUAL details of this video (YouTube/TikTok/Instagram). Identify the creator, the exact title, the content of the video, and its current performance if available.` : ''}

    Analyze this content for virality potential on ${metadata.platform}.
    
    Current provided Metadata:
    - Title/URL: ${metadata.title}
    - User's Description: ${metadata.description || 'Not provided'}
    - Target Niche: ${metadata.niche}
    
    Evaluation Criteria:
    1. Metadata Accuracy: If a URL was provided, your analysis MUST reflect the actual video content found via search.
    2. CTR & Hooks: Analyze the title and hook's emotional trigger.
    3. Trend Match: Compare the content against current viral patterns in the ${metadata.niche} niche.
    4. Action Plan: Provide 5 specific, high-impact tasks to increase reach.

    Return a valid JSON response according to the schema.
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
    throw new Error("Empty response from AI engine");
  }

  return JSON.parse(response.text);
}
