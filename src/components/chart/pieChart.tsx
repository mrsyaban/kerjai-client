import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useState } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieScoreChart = ({ label, value, description }: { label: string; value: number; description: string }) => {
  const [isTooltipVisible, setTooltipVisible] = useState(false);

  const data = {
    labels: [label, "Remaining"],
    datasets: [
      {
        data: [value, 1 - value],
        backgroundColor: ["#4A90E2", "#E0E0E0"],
        borderColor: ["#4A90E2", "#E0E0E0"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: (tooltipItem: any) => `${tooltipItem.label}: ${(tooltipItem.raw * 100).toFixed(1)}%`,
        },
      },
      legend: {
        display: false,
      },
      datalabels: {
        display: false,
      },
      centerText: {
        id: 'centerText',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        beforeDraw: (chart: any) => {
          const { ctx, chartArea } = chart;
          const { width, height, top, left } = chartArea;

          const centerX = (width - left) / 2 + left;
          const centerY = (height - top) / 2 + top;

          if (width && height) {
            ctx.save();
            ctx.font = "bold 16px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "#4A90E2"; // Text color
            ctx.fillText(`${(value * 100).toFixed(1)}%`, centerX, centerY);
            ctx.restore();
          }
        },
      },
    },
    cutout: "60%",
  };

  return (
    <div className="flex flex-col items-center w-full gap-2">
      <div className="p-2 w-full">
        <Doughnut
          data={data}
          options={options}
          style={{
            width: "100%",
            height: "100%",
          }}
          plugins={[options.plugins.centerText]}
        />
      </div>
      <div className="flex items-center justify-center">
        <div className="text-lg font-bold text-primary-blue text-center">{label}</div>
        <div
          className="ml-2 relative"
          onMouseEnter={() => setTooltipVisible(true)}
          onMouseLeave={() => setTooltipVisible(false)}
        >
          {/* Information Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4 text-gray-500 cursor-pointer"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M12 5h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
          </svg>
          {/* Tooltip */}
          {isTooltipVisible && (
            <div className="absolute bg-black text-white text-md w-44 text-wrap rounded py-1 px-2 -top-8 left-[104px] transform -translate-x-1/2 whitespace-nowrap z-10">
              {description}
              <div className="absolute left-12 transform -translate-x-1/2 border-8 border-transparent border-t-black"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PieScoreChart;
