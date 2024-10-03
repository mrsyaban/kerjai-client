import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Loader2, Send, Video, RefreshCw, Play, Pause } from 'lucide-react';
import { addInterview, addInterviewById } from '@/services/api';

interface VideoRecorderProps {
  question: string;
  questionId?: string;
}

const VideoRecorder: React.FC<VideoRecorderProps> = ({ question, questionId }) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedVideo, setRecordedVideo] = useState<Blob | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  const navigate = useNavigate();

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = useCallback(async () => {
    try {
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
  }, []);

  const stopRecording = useCallback(() => {
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

  const handleRetake = useCallback(() => {
    setRecordedVideo(null);
    setDuration(0);
    if (videoRef.current) {
      videoRef.current.src = '';
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const submitVideoAnalysis = useCallback(async () => {
    if (!recordedVideo) {
      toast.error('Please record a video before analyzing.');
      return;
    }

    setIsLoading(true);
    try {
      const file = new File([recordedVideo], 'recorded_video.webm', { type: 'video/webm' });
      const message = questionId
        ? await addInterviewById(questionId, file)
        : await addInterview(question, file);
      console.log('Upload successful:', message);
      toast.success(message);
      navigate('/dashboard');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Analysis failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [recordedVideo, questionId, question, navigate]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="flex flex-col gap-4 w-full items-center">
      <div className="w-full max-w-[960px] aspect-video bg-black rounded-lg overflow-hidden relative">
        <video 
          ref={videoRef} 
          autoPlay={isRecording} 
          muted={isRecording} 
          playsInline 
          className="w-full h-full" 
          onEnded={() => setIsPlaying(false)}
        />
        {(isRecording || recordedVideo) && (
          <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
            {formatDuration(duration)}
          </div>
        )}
      </div>
      <div className="flex gap-4">
        {!isRecording && !recordedVideo && (
          <button
            onClick={startRecording}
            className="bg-red-500 text-white rounded-lg py-4 px-8 flex items-center"
          >
            <div className="flex flex-row gap-4 items-center">
              <span className="font-bold text-xl">Start Recording</span>
              <Video size={24} />
            </div>
          </button>
        )}
        {isRecording && (
          <button
            onClick={stopRecording}
            className="bg-gray-500 text-white rounded-lg py-4 px-8 flex items-center"
          >
            <div className="flex flex-row gap-4 items-center">
              <span className="font-bold text-xl">Stop Recording</span>
              <Video size={24} />
            </div>
          </button>
        )}
        {recordedVideo && (
          <>
            <button
              onClick={togglePlayPause}
              className="bg-blue-500 text-white rounded-lg py-4 px-8 flex items-center"
            >
              <div className="flex flex-row gap-4 items-center">
                <span className="font-bold text-xl">{isPlaying ? 'Pause' : 'Play'}</span>
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </div>
            </button>
            <button
              onClick={submitVideoAnalysis}
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
              onClick={handleRetake}
              className="bg-gray-200 text-gray-800 rounded-lg py-4 px-8 flex items-center"
              disabled={isLoading}
            >
              <div className="flex flex-row gap-4 items-center">
                <span className="font-bold text-xl">Retake</span>
                <RefreshCw size={24} />
              </div>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoRecorder;