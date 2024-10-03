import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { addInterview, addInterviewById } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { Loader2, Send, Upload, RefreshCw } from "lucide-react";

interface UploadVideoProps {
  question: string;
  questionId?: string;
}

const VideoUploader: React.FC<UploadVideoProps> = ({ question, questionId }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type === "video/mp4") {
      setVideoFile(file);
    } else {
      toast.error("Please upload a valid MP4 video file.");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "video/mp4": [".mp4"] },
    multiple: false,
  });

  const submitVideoUpload = async () => {
    if (!question) {
      toast.error("Please provide a question before uploading the video.");
      return;
    }
    if (!videoFile) {
      toast.error("Please select a video to upload.");
      return;
    }

    setIsLoading(true);
    try {
      const message = questionId
        ? await addInterviewById(questionId, videoFile)
        : await addInterview(question, videoFile);
      console.log("Upload successful:", message);
      toast.success(message);
      navigate("/dashboard");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReupload = () => {
    setVideoFile(null);
  };

  return (
    <div className="flex flex-col gap-4 w-full items-center">
      {!videoFile ? (
        <div
          {...getRootProps()}
          className={`flex flex-col items-center justify-center w-full max-w-[960px] aspect-video border-2 border-dashed rounded-lg p-4 cursor-pointer ${
            isDragActive ? "border-primary-blue bg-blue-50" : "border-gray-300"
          }`}
        >
          <input {...getInputProps()} />
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">
              Drag and drop your MP4 video here, or click to select a file
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-[960px] aspect-video">
          <video
            src={URL.createObjectURL(videoFile)}
            controls
            className="w-full h-full rounded-lg"
          />
        </div>
      )}
      {videoFile && (
        <div className="flex gap-4">
          <button
            onClick={submitVideoUpload}
            className="bg-button-color text-white rounded-lg py-4 px-8 flex items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex flex-row w-full justify-center items-center gap-2">
                <Loader2 className="animate-spin" />
                Analyzing...
              </div>
            ) : (
              <div className="flex flex-row gap-4 items-center">
                <span className="font-bold text-xl">Analyze</span>
                <Send size={24} />
              </div>
            )}
          </button>
          <button
            onClick={handleReupload}
            className="bg-gray-200 text-gray-800 rounded-lg py-4 px-8 flex items-center"
            disabled={isLoading}
          >
            <div className="flex flex-row gap-4 items-center">
              <span className="font-bold text-xl">Reupload</span>
              <RefreshCw size={24} />
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoUploader;