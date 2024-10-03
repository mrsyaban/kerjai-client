import { useNavigate } from "react-router-dom";

const QuestionCard = ({ question, answer, id, category }: { question: string; answer: string; id: string; category: string }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 bg-white p-8 rounded-lg">
      <div className="text-xl text-justify w-full text-primary-blue font-bold uppercase">{category}</div>
      <div className="text-2xl font-bold text-justify w-full">{question}</div>
      <p className="text-2xl rounded-lg">{answer}</p>
      <div onClick={() => navigate(`/interview?id=${id}`)} className="justify-center bg-primary-blue uppercase self-end cursor-pointer text-white font-bold text-lg py-2 px-6 text-nowrap rounded-md">
        <span>practice interview</span>
      </div>
    </div>
  );
};

export default QuestionCard;
