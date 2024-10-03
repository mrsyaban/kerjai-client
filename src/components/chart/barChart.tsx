const BarChart = ({ label, value, desc }: { label: string; value: number, desc:string }) => {
    return (
      <div className="flex flex-col bg-white items-center w-full gap-2 p-4 rounded-lg">
        <div className="flex justify-between w-full text-sm">
          <span className="font-bold text-lg text-primary-blue">{label}</span>
          <span className="font-semibold text-primary-blue">{desc}</span>
        </div>
        <div className="w-full flex flex-row gap-8">
          <div className="w-full flex flex-row items-center bg-primary-white rounded-full h-6">
            <div className="bg-primary-blue h-6 rounded-full" style={{ width: `${value * 10}%` }} />
          </div>
          <span className="font-bold text-primary-blue">{(value * 10).toFixed(1)}%</span>
        </div>
      </div>
    );
  };
  
  export default BarChart;
  