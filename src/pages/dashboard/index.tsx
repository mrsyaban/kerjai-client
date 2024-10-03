import Navbar from "@/components/common/navbar";
import { getInterviews } from "@/services/api";
import { Interview, InterviewStatus } from "@/types/interview";
import { useNavigate } from "react-router-dom";
import { format, addHours } from "date-fns";
import { useEffect, useState, useRef, ChangeEvent } from "react";

const Dashboard = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [interviewQuestion, setInterviewQuestion] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const textareaRef = useRef(null);
  const questionRef = useRef(null);

  const handleAnalyzeCV = () => {
    if (!jobTitle || !jobDescription) {
      setErrorMessage("Please fill in both fields before analyzing your resume.");
    }

    navigate("/cv-analyzer?jobTitle=" + jobTitle + "&jobDescription=" + jobDescription);
  };

  const handleAnalyzeInterview = () => {
    navigate("/interview-analyzer/behavioral?question=" + interviewQuestion);
  };

  const handleTechnicalInterview = () => {
    navigate("/interview-analyzer/technical?question=" + interviewQuestion);
  };

  // Auto-expand the textarea as the content changes
  const handleQuestionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInterviewQuestion(e.target.value);
    autoResizeTextarea(e.target);
  };

  // Effect to auto-resize on initial render or content paste
  useEffect(() => {
    if (questionRef.current) {
      autoResizeTextarea(questionRef.current);
    }
  }, [interviewQuestion]);

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

  const navigate = useNavigate();

  const formatDate = (date: Date) => {
    const utcPlus7Date = addHours(date, 7);
    const formattedDate = format(utcPlus7Date, "dd/MM/yyyy-HH:mm a");
    return formattedDate;
  };

  useEffect(() => {
    getInterviews()
      .then((res) => {
        setInterviews(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <Navbar isHome={false} />
      <div className="flex flex-col w-full pt-[74px] items-center">
        {/* features */}
        <div className="flex flex-col w-full max-w-[1200px] bg-primary-white items-center px-24 py-12 pb-24 gap-10">
          <h1 className="font-bold text-primary-blue text-4xl">Dashboard</h1>
          <div className="flex flex-col w-full items-center gap-20">
            {/* Resume & Questions */}
            <div className="flex flex-col items-center w-full max-w-[1200px] gap-4">
              <h2 className="text-3xl font-bold self-start text-primary-blue">Land your dream job now!</h2>
              {/* <div className="font-semibold text-xl">Enter all about the details of your dream job.</div> */}

              {/* Job Details */}
              <div className="grid grid-cols-3 w-full gap-x-10 gap-y-6">
                <div className="w-full col-span-3 flex flex-col gap-2">
                  <div className="font-semibold text-xl text-primary-blue">Job title</div>
                  <input
                    type="text"
                    onChange={(e) => setJobTitle(e.target.value)}
                    className=" border-primary-blue border-1 border rounded-md py-4 px-4 text-lg text-primary-blue font-semibold placeholder:text-opacity-50 placeholder:text-primary-blue"
                    placeholder="Job Title"
                  />
                </div>
                <div className="flex flex-col gap-2 w-full col-span-3">
                  <div className="font-semibold text-xl text-primary-blue">Job description</div>
                  <textarea
                    ref={textareaRef}
                    value={jobDescription}
                    onChange={handleTextareaChange}
                    className="max-h-96 border border-primary-blue rounded-md py-4 px-4 text-primary-blue text-lg font-normal placeholder:text-opacity-50 placeholder:text-primary-blue whitespace-pre-wrap overflow-auto resize-none"
                    placeholder="Job Description"
                  />
                </div>
                {errorMessage && <div className="text-red-700 font-semibold">{errorMessage}</div>}
              </div>

              {/* Feature */}
              <div
                onClick={handleAnalyzeCV}
                className="py-5 px-8 w-72 hover:opacity-90 cursor-pointer border-2 border-primary-yellow bg-button-color text-white font-semibold text-xl flex items-center justify-center text-primary-yellow rounded-lg"
              >
                Grade my resume
              </div>
            </div>

            {/* Analyze Interview */}
            <div className="flex flex-col w-full max-w-[1200px] gap-4 items-center">
              <h2 className="text-3xl font-bold text-primary-blue self-start">Ace your interview!</h2>

              {/* Job Details */}
              <div className="grid grid-cols-3 w-full gap-x-10 gap-y-6">
                <div className="flex flex-col gap-2 w-full col-span-3">
                  <div className="font-semibold text-xl text-primary-blue">Interview question</div>
                  <textarea
                    ref={questionRef}
                    value={interviewQuestion}
                    onChange={handleQuestionChange}
                    className="max-h-96 border border-primary-blue rounded-md py-4 px-4 text-primary-blue text-lg font-normal placeholder:text-opacity-50 placeholder:text-primary-blue whitespace-pre-wrap overflow-auto resize-none"
                    placeholder="Interview question"
                  />
                </div>
                {errorMessage && <div className="text-red-700 font-semibold">{errorMessage}</div>}
              </div>

              {/* Feature */}
              <div className="flex flex-row gap-8">
                <div
                  onClick={handleAnalyzeInterview}
                  className="py-5 px-8 w-72 hover:opacity-90 cursor-pointer border-2 border-secondary-purple bg-button-color text-white flex items-center justify-center text-secondary-purple rounded-lg text-xl font-semibold"
                >
                  Analyze answers
                </div>
                <div
                  onClick={handleTechnicalInterview}
                  className="py-5 px-8 w-72 hover:opacity-90 cursor-pointer border-2 border-secondary-purple bg-button-color text-white flex items-center justify-center text-secondary-purple rounded-lg text-xl font-semibold"
                >
                  Technical Interview
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center px-24 bg-[#f0f0f0] w-full">
          <div className="flex flex-col gap-12 py-12 max-w-[1200px] w-full">
            <div className="col-span-2 text-4xl font-bold">Analyzed interviews</div>
            {/* jobs */}
            {/* interview questions analyzed */}
            <div className="flex flex-col h-fit gap-8 items-center w-full bg-opacity-50 rounded-lg">
              {interviews.length === 0 ? (
                <div className="flex w-full py-4 px-6 bg-white rounded-lg text-lg justify-center">You don't have any analyzed interviews yet.</div>
              ) : (
                <div className="flex flex-col gap-6 w-full">
                  {interviews
                    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .map((interview, idx) => (
                      <div key={idx} className="flex flex-row w-full py-4 px-6 bg-white rounded-lg gap-4 justify-between">
                        <div className="flex flex-col w-full gap-10">
                          <div className="text-2xl font-bold text-primary-blue overflow-hidden text-ellipsis line-clamp-4 whitespace-pre-wrap">{interview.question}</div>
                          <div className="flex flex-row justify-between items-center">
                            <div className="text-lg text-primary-blue text-nowrap text-left font-semibold">Generated on {formatDate(interview.created_at)}</div>
                            <div
                              onClick={() => navigate(`/interview-analyzer/behavioral/result/${interview.id}`)}
                              className={`py-2 px-6  font-bold w-fit hover:bg-opacity-80 flex items-center h-fit rounded-md justify-center cursor-pointer text-nowrap ${
                                interview.status === InterviewStatus.SUCCESS ? "bg-primary-blue text-white" : " border text-primary-blue bg-[#c59eeb] border-primary-blue"
                              }`}
                            >
                              {interview.status === InterviewStatus.SUCCESS ? "View Analysis" : "Analyzing..."}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
