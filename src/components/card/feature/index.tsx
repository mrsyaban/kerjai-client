import { useNavigate } from "react-router-dom";
import useAuthStore from "@/store/authStore";

const FeatureCard = ({ title, description, path, command }: { title: string; description: string; path: string; command: string }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const handleClicked = () => {
    if (isAuthenticated) {
      navigate(path);
    } else {
      navigate("/auth");
    }
  };


  return (
    <div className="flex flex-col p-6 w-96 h-full justify-between items-center gap-12 bg-white rounded-lg">
      <div className="flex flex-col items-center gap-3">
        <div className="text-xl text-primary-blue font-bold text-nowrap">{title}</div>
        <div className="text-lg text-[#68718B] text-wrap text-center">{description}</div>
      </div>
      <div onClick={handleClicked} className="py-4 px-8 bg-button-color rounded-lg font-semibold text-white cursor-pointer">
        {command}
      </div>
    </div>
  );
};

export default FeatureCard;
