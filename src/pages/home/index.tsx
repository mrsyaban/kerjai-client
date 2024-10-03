import { useNavigate } from "react-router-dom";
import Navbar from "@/components/common/navbar";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import FeatureCard from "@/components/card/feature";

const Home = () => {
  const navigate = useNavigate();
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleAnalyzeCV = () => {
    if (!jobTitle || !jobDescription) {
      setErrorMessage("Please fill in both fields before analyzing your resume.");
      return;
    }
    navigate("/resume-grader?jobTitle=" + jobTitle + "&jobDescription=" + jobDescription);
  };

  const textareaRef = useRef(null);

  // Auto-expand the textarea as the content changes
  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setJobDescription(e.target.value);
    autoResizeTextarea(e.target);
  };

  // Auto-resize function
  const autoResizeTextarea = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  // Effect to auto-resize on initial render or content paste
  useEffect(() => {
    if (textareaRef.current) {
      autoResizeTextarea(textareaRef.current);
    }
  }, [jobDescription]);

  return (
    <div className="h-screen w-full bg-primary-white">
      <Navbar isHome={true} />
      <div className="flex flex-col gap-32 items-center h-fit pt-12 pb-24">
        <div className="flex flex-col h-fit gap-8 items-center">
          <div className="text-4xl font-bold text-primary-blue">Paste your job posting here!</div>
          <input
            type="text"
            onChange={(e) => setJobTitle(e.target.value)}
            className="w-[640px] border-primary-blue border-1 border rounded-md py-4 px-4 text-lg text-primary-blue font-semibold placeholder:text-opacity-50 placeholder:text-primary-blue"
            placeholder="Job Title"
          />
          <textarea
            ref={textareaRef}
            value={jobDescription}
            onChange={handleTextareaChange}
            className="w-[640px] max-h-96 border border-primary-blue rounded-md py-4 px-4 text-primary-blue text-lg font-normal placeholder:text-opacity-50 placeholder:text-primary-blue whitespace-pre-wrap overflow-auto resize-none"
            placeholder="Job Description"
          />
          {errorMessage && <div className="text-red-700 font-semibold">{errorMessage}</div>}
          <div className="flex flex-row gap-6 justify-center">
            <div onClick={handleAnalyzeCV} className="py-5 px-8 hover:opacity-90 cursor-pointer bg-button-color flex items-center justify-center text-white rounded-lg font-bold">
              Analyze my resume
            </div>
          </div>
        </div>
        <div className="flex flex-col h-fit gap-8 items-center">
          <div className="text-3xl font-bold text-primary-blue">Try out our features here!</div>
          <div className="flex flex-row gap-24 h-full">
            <FeatureCard
              title="Code Interview Analyzer"
              description="Provide your job details and get targeted practice questions designed to help you tackle any interview challenge confidently."
              path="interview-analyzer/technical"
              command="Grade my code interview"
            />
            <FeatureCard title="Interview Analyzer" description="Simulate real interviews on our site and get in-depth feedback to perfect your performance." path="interview-analyzer/behavioral" command="Grade my interview" />
            <FeatureCard title="Resume Grader" description="Stop using the same CV for every job! Our AI analyze your CV to make it relevance with each job vacancy" path="resume-grader" command="Analyze my resume" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
