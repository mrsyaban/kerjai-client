import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

import Navbar from "@/components/common/navbar";
import { addTechnicalInterview} from "@/services/api";

type Language = "python" | "cpp" | "javascript";

const languageConfigs: Record<Language, { extension: string, template: string }> = {
  python: {
    extension: "py",
    template: "# Write your Python code here\n\ndef main():\n    pass\n\nif __name__ == \"__main__\":\n    main()"
  },
  cpp: {
    extension: "cpp",
    template: "#include <iostream>\n\nint main() {\n    // Write your C++ code here\n    return 0;\n}"
  },
  javascript: {
    extension: "js",
    template: "// Write your JavaScript code here\n\nfunction main() {\n    \n}\n\nmain();"
  }
};

const TechnicalInterviewPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [question, setQuestion] = useState<string>("");
  const [sandboxId, setSandboxId] = useState<string>("");
  const [language, setLanguage] = useState<Language>("python");
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedVideo, setRecordedVideo] = useState<Blob | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const timerRef = useRef<number | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const questionTemp = searchParams.get("question") || "";
    if (questionTemp) {
      setQuestion(questionTemp);
    }
  }, [searchParams]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [streamRef, timerRef]);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const stopRecording = useCallback(async () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, []);

  const stopInterview = async () => {
    await stopRecording();
    submitVideoAnalysis();
  };

  const submitVideoAnalysis = useCallback(async () => {
    if (!recordedVideo) {
      toast.error('Please record a video before analyzing.');
      return;
    }

    try {
      // const config = languageConfigs[language];
      const response = await fetch(`https://codesandbox.io/api/v1/sandboxes/${sandboxId}`);
      const data = await response.json();
      const code = data.files;
      
      toast.success("Code submitted successfully");

      const file = new File([recordedVideo], 'recorded_video.webm', { type: 'video/webm' });
      const message = await addTechnicalInterview(question, file, code);
      setRecordedVideo(null);
      console.log('Upload successful:', message);
      toast.success(message);
      navigate('/dashboard');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Analysis failed. Please try again.');
    } 
  }, [recordedVideo, question, navigate, sandboxId]);

  const startInterview = useCallback(async () => {
    if (!question) {
      toast.error("Please enter a question before starting the interview");
      return;
    }
    try {
      const newSandboxId = await createSandbox(language);
      setSandboxId(newSandboxId);

      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        setRecordedVideo(blob);
        if (videoRef.current) {
          videoRef.current.srcObject = null;
          videoRef.current.src = URL.createObjectURL(blob);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);
      timerRef.current = window.setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing media devices:', error);
      toast.error('Failed to access camera and microphone');
    }
  }, [language, question]);

  const createSandbox = async (lang: Language) => {
    const config = languageConfigs[lang];
    const response = await fetch('https://codesandbox.io/api/v1/sandboxes/define?json=1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        files: {
          [`index.${config.extension}`]: {
            content: config.template,
          },
        },
      }),
    });
    const data = await response.json();
    return data.sandbox_id;
  };

  const handleLanguageChange = async (newLanguage: Language) => {
    if (isRecording) {
      const newSandboxId = await createSandbox(newLanguage);
      setSandboxId(newSandboxId);
    }
    setLanguage(newLanguage);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster />
      <Navbar isHome={false} />
      <div className="h-[74px]" />
      <div className="text-4xl font-bold bg-primary-white text-center w-full py-12 text-primary-blue">Interview Grader</div>
      <div className="flex flex-col items-center px-24 w-full">
        <div className="flex flex-col gap-4 py-12 w-full">
          <textarea
            placeholder="Put your interview question here"
            value={question}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              setQuestion(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            className="flex h-fit w-full items-center text-primary-blue resize-none focus:outline-none font-semibold text-3xl bg-transparent rounded-lg p-2"
          />
          <div className="flex items-center gap-4">
            <Select value={language} onValueChange={(value: Language) => handleLanguageChange(value)}>
              <SelectTrigger className="w-[180px] bg-white font-bold">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="cpp">C++</SelectItem>
                <SelectItem value="javascript">JavaScript</SelectItem>
              </SelectContent>
            </Select>
            {!isRecording && (
              <Button onClick={startInterview}>Start Interview</Button>
            )}
          </div>
          {isRecording && (
            <div className="flex flex-row gap-4 mt-4">
              <div className="w-[80%] aspect-video">
                {sandboxId && (
                  <iframe
                    src={`https://codesandbox.io/embed/${sandboxId}?fontsize=14&hidenavigation=1&theme=dark`}
                    className="w-full h-full border-0 rounded-lg overflow-hidden"
                    title="Code Editor"
                    allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
                    sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
                  />
                )}
              </div>
              <div className="w-[20%] flex flex-col gap-4">
                <div className="flex flex-col gap-4 w-full items-center">
                  <div className="w-full max-w-[960px] aspect-video bg-black rounded-lg overflow-hidden relative">
                    <video ref={videoRef} autoPlay={isRecording} muted={isRecording} playsInline className="w-full h-full" />
                  </div>
                </div>
                <div className="font-bold w-full text-center text-2xl">{formatDuration(duration)}</div>
              </div>
            </div>
          )}
          {isRecording && (
            <Button onClick={stopInterview} className="mt-4 bg-button-color">
              Submit Interview
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechnicalInterviewPage;