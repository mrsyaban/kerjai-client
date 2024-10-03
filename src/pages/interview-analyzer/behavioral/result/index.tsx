import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "@/components/common/navbar";
import PieScoreChart from "@/components/chart/pieChart";
import EngagementChart from "@/components/chart/engagementChart";
import { getBehavioralInterviewResult } from "@/services/api";
import { BehavioralResult } from "@/types/behavioralResult";

const BehavioralInterviewResult = () => {
  const [result, setResult] = useState<BehavioralResult>();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [currentTime, setCurrentTime] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [id]);

  useEffect(() => {
    (async () => {
      try {
        const temp = await getBehavioralInterviewResult(id);
        if (temp) {
          setResult(temp);
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, [id, navigate]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  // If the result hasn't been fetched yet, return null or a loading spinner
  if (!result) return null;

  const totalVideoLength = Math.floor(result.body.length / 4);

  function formatSecondsToTime(seconds: number): string {
    // Calculate minutes, seconds, and milliseconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const milliseconds = Math.floor((seconds % 1) * 100); // Get the milliseconds part

    // Format the components
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");

    // Format milliseconds to always show two decimal places
    const formattedMilliseconds = milliseconds === 0 ? "00" : String(milliseconds).padStart(2, "0");

    // Construct the final formatted time
    const formattedTime = `${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`;

    return formattedTime;
  }

  const goToTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
    }
  };

  const getCurrentCardIndex = () => {
    return result.result.findIndex((item, index) => {
      const nextItem = result.result[index + 1];
      return currentTime >= item.start_time && (!nextItem || currentTime < nextItem.start_time);
    });
  };

  const currentCardIndex = getCurrentCardIndex();

  return (
    <>
      <Navbar isHome={false} />
      <div className="h-[74px]" />
      <div className="flex flex-col py-12 px-24 gap-12 items-center">
        <div className="text-4xl font-bold text-primary-blue">Interview Analysis Result</div>
        {/* Preview */}
        <div className="flex flex-row w-full justify-center">
          <video ref={videoRef} controls autoPlay playsInline className="w-full max-w-3xl mx-auto">
            <source src={`${import.meta.env.VITE_API_URL}/stream/${id}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        {/* chart */}
        <div className="flex flex-col gap-12">
          <div className="flex flex-col max-h-[600px] h-fit w-full max-w-[1200px] overflow-y-auto gap-4 p-2">
            {result.result.map((item, index) => (
              <div
                key={index}
                ref={(el) => (cardRefs.current[index] = el)}
                className={`flex flex-row gap-8 cursor-pointer rounded-lg ${index === currentCardIndex ? "outline outline-4 outline-secondary-purple text-white bg-secondary-purple" : !item.approved ? "bg-[#eacccc] text-[#600303] " : "bg-white"}`}
                onClick={() => goToTime(item.start_time)}
              >
                <div className={`flex flex-row gap-8 w-[60%] p-6 rounded-lg`}>
                  <div className="text-lg font-bold w-[10%]">{formatSecondsToTime(item.start_time)}</div>
                  <div className="text-lg font-base w-[90%]">{item.phrase}</div>
                </div>
                <div className={` flex flex-row p-6 gap-4 items-center justify-between w-[40%] border-l-2`}>
                  <div className="flex flex-col font-bold text-xl gap-2">
                    Emotions
                    <div className="grid grid-cols-2 gap-x-2 font-medium text-lg text-nowrap">
                      <span>Yours</span>
                      <span>: {item.actual_emotion}</span>
                      <span>Expected</span>
                      <span>: {item.emotion}</span>
                    </div>
                  </div>
                  <hr />
                  <div className="flex flex-col font-bold text-xl gap-2">
                    Body Language
                    <div className="grid grid-cols-2 gap-x-2 font-medium text-lg text-nowrap">
                      <span>Yours</span>
                      <span>: {item.actual_gesture ? "Positive" : "Negative"}</span>
                      <span>Expected</span>
                      <span>: {item.gesture ? "Positive" : "Negative"}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-row justify-center h-fit gap-24 max-w-[1200px] w-full">
            <div className="flex flex-col w-[65%] items-center bg-white p-6 rounded-lg">
              <h1 className="text-2xl font-bold mb-4">Engagement Over Time</h1>
              <EngagementChart data={result.voice} data2={result.body} totalVideoLength={totalVideoLength} interval={2} />
            </div>
            <div className="grid grid-cols-2 w-[35%] gap-y-10 gap-x-8">
              <PieScoreChart
                label="Relevance"
                value={result.relevance}
                description="indicating how relevant your answers were to the position you are applying for. A higher score means your answers were more pertinent to the job requirements."
              />
              <PieScoreChart label="Clarity" value={result.clarity} description="representing how clear and understandable your answers were. This measures how well you communicate your points" />
              <PieScoreChart label="Originality" value={result.originality} description="reflecting the uniqueness of your answer. This assesses how much your answers differed from standard or expected responses." />
              <PieScoreChart
                label="Engagement"
                value={result.engagement}
                description="score that combines body language and emotional expression to evaluate how engaging you were. It reflects your overall presence and interaction during the interview."
              />
            </div>
          </div>
        </div>

        {/* result */}
        <div className="flex flex-col w-full bg-white rounded-lg max-w-[1200px] p-10 px-12 gap-4 h-fit">
          <h1 className="text-3xl font-bold">Analysis summary</h1>
          <div className="font-semibold text-justify text-lg">{result.summary}</div>
          <div className="font-semibold flex flex-col gap-2 text-lg">
            <h1 className="text-2xl font-bold">Improvement</h1>
            <div className="flex flex-col gap-4 list-outside">
              {result.improvement.map((item, index) => (
                <div key={index} className="flex flex-row gap-1">
                  <li />
                  <div>{item}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BehavioralInterviewResult;
