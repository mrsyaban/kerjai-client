export interface Interview {
    id: string;
    question: string;
    video: string;
    status: InterviewStatus;
    created_at: Date;
    updatedAt?: string;
  }
  
  export enum InterviewStatus {
    SUCCESS = "SUCCESS",
    Analyzing = "analyzing",
  }
  