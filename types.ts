
export interface VideoMetadata {
  title: string;
  description: string;
  hashtags: string[];
  niche: string;
  platform: 'TikTok' | 'YouTube' | 'Instagram';
  url?: string;
  thumbnailUrl?: string;
  videoBlob?: Blob;
}

export interface ScoreComponent {
  score: number;
  label: string;
  insights: string[];
  recommendations: string[];
}

export interface ViralityReport {
  overallScore: number;
  metadataScore: ScoreComponent;
  thumbnailScore: ScoreComponent;
  videoScore: ScoreComponent;
  trendScore: ScoreComponent;
  timelineIssues: Array<{
    timestamp: string;
    type: 'drop' | 'attention' | 'low-quality';
    message: string;
    color: string;
  }>;
  actionPlan: Array<{
    task: string;
    priority: 'High' | 'Medium' | 'Low';
    impact: string;
  }>;
  generatedAssets: {
    alternativeTitles: string[];
    descriptionHook: string;
    optimizedHashtags: string[];
    thumbnailPrompt: string;
  };
}

export interface AnalysisState {
  isAnalyzing: boolean;
  progress: number;
  statusText: string;
  report: ViralityReport | null;
  error: string | null;
}
