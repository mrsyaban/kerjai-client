import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "@/components/common/navbar";
import VideoRecorder from "@/components/video/recorder";
import VideoUploader from "@/components/video/uploader";
import { getInterviewById } from "@/services/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BehavioralInterviewPage = () => {
  const [searchParams] = useSearchParams();
  const [question, setQuestion] = useState<string>("");
  const [questionId, setQuestionId] = useState<string>("");

  useEffect(() => {
    const questionId = searchParams.get("id") || "";
    setQuestionId(questionId);

    const questionTemp = searchParams.get("question") || "";
    if (questionTemp) {
      setQuestion(questionTemp);
    }

    if (!questionId) return;
    getInterviewById(questionId)
      .then((question) => {
        setQuestion(question.question);
      })
      .catch((error) => {
        console.error("Error fetching question:", error);
      });
  }, [searchParams]);

  return (
    <div>
      <Toaster />
      <Navbar isHome={false} />
      <div className="h-[74px]" />
      <div className="text-4xl font-bold bg-primary-white text-center w-full py-12 text-primary-blue">Interview Grader</div>
      <div className="flex flex-row px-24 w-full justify-center">
        <div className="flex flex-col gap-4 py-12 w-full max-w-[1200px]">
          <textarea
            placeholder="Put your interview question here"
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
              e.target.style.height = "auto"; // Reset height to auto to shrink if needed
              e.target.style.height = `${e.target.scrollHeight}px`; // Adjust height to content
            }}
            className="flex h-fit w-full items-center text-primary-blue resize-none focus:outline-none font-semibold text-3xl bg-transparent rounded-lg"
          />
          <Tabs defaultValue="record" className="w-full bg-transparent rounded-lg bg-white">
            <TabsList className="grid w-full grid-cols-2 bg-transparent border bg-gray-600 rounded-b-none border-black h-fit">
              <TabsTrigger value="record" className="text-2xl font-bold">
                Record
              </TabsTrigger>
              <TabsTrigger value="upload" className="text-2xl font-bold">
                Upload
              </TabsTrigger>
            </TabsList>
            <TabsContent value="record" className="bg-transparent flex justify-center py-12">
              <VideoRecorder question={question} questionId={questionId} />
            </TabsContent>
            <TabsContent value="upload" className="p-4 justify-center">
              <VideoUploader question={question} questionId={questionId} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default BehavioralInterviewPage;
