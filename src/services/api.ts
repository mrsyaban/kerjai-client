import { emotionGroups } from "@/types/emotion";
import { Axios } from "./http";
import { PhraseAnalysis } from "@/types/behavioralResult";

export async function userLogin() {
  await Axios.get(`/login`);
}

// Resume Grader
export async function analyzeResume(resume: File, jobTitle: string, jobDescription: string) {
  const formData = new FormData();
  formData.append("file", resume);
  formData.append("job_title", jobTitle);
  formData.append("description", jobDescription);
  const res = await Axios.post(`/cv`, formData);
  return res.data;
}

// Interview Analyzer
export async function getInterviews() {
  const res = await Axios.get(`/questions`);
  return res.data.questions;
}

export async function getInterviewById(interviewId: string) {
  const res = await Axios.get(`/question/${interviewId}`);
  return res.data;
}

export async function addInterview(question: string, interviewVideo: File) {
  const formData = new FormData();
  formData.append("question", question);
  formData.append("file", interviewVideo);
  const res = await Axios.post(`/question`, formData);
  return res.data.message;
}

export async function addTechnicalInterview(question: string, interviewVideo: File, code: string) {
  const formData = new FormData();
  formData.append("question", question);
  formData.append("file", interviewVideo);
  formData.append("code", code);
  formData.append("category", "technical");
  const res = await Axios.post(`/question`, formData);
  return res.data.message;
}

export async function addInterviewById(questionId: string, interviewVideo: File) {
  const formData = new FormData();
  formData.append("id", questionId);
  formData.append("file", interviewVideo);
  const res = await Axios.post(`/answer-question`, formData);
  return res.data.message;
}

export async function getBehavioralInterviewResult(vacancyId: string | undefined) {
  if (!vacancyId) return [];
  const res = await Axios.get(`/question-result/${vacancyId}`);
  
  function isSameEmotionGroup(emotion: string, actual_emotion: string): boolean {
    const isInGroup1 = emotionGroups.positive.includes(emotion) && emotionGroups.positive.includes(actual_emotion);
    const isInGroup2 = emotionGroups.negative.includes(emotion) && emotionGroups.negative.includes(actual_emotion);
    return isInGroup1 || isInGroup2;
  }
  
  function approvePhrase(phraseData: PhraseAnalysis): PhraseAnalysis {
    const gestureApproved = phraseData.gesture === phraseData.actual_gesture;
    const emotionApproved = isSameEmotionGroup(phraseData.emotion, phraseData.actual_emotion);
    
    return {
      ...phraseData,
      approved: gestureApproved && emotionApproved,
    };
  }

  const result = res.data.result;
  return {
    ...res.data,
    result: result.map(approvePhrase),
  };
}