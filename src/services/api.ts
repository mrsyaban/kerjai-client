import { Axios } from "./http";

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

export async function addInterviewById(questionId: string, interviewVideo: File) {
  const formData = new FormData();
  formData.append("id", questionId);
  formData.append("file", interviewVideo);
  const res = await Axios.post(`/answer-question`, formData);
  return res.data.message;
}
