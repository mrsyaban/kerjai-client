export interface PhraseAnalysis {
  phrase: string;
  emotion: string;
  gesture: boolean;
  start_time: number;
  end_time: number;
  actual_gesture: boolean;
  actual_emotion: string;
  approved: boolean;
}

export interface BehavioralResult {
  id: string;
  question: string;
  answer: string;
  summary: string;
  totalVideoLength: number;
  improvement: string[];
  relevance: number;
  clarity: number;
  originality: number;
  engagement: number;
  body: number[];
  voice: number[];
  result: PhraseAnalysis[]; 
  created_at?: string;
  updatedAt?: string;
}
