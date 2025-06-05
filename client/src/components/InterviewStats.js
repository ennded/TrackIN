// File: components/InterviewStats.jsx
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const InterviewStats = ({ rounds }) => {
  const statusCounts = {
    Success: 0,
    Failed: 0,
    Pending: 0,
    Unknown: 0,
  };

  rounds.forEach((round) => {
    const status = round.status?.toLowerCase();
    if (status === "success") statusCounts.Success++;
    else if (status === "failed") statusCounts.Failed++;
    else if (status === "pending") statusCounts.Pending++;
    else statusCounts.Unknown++;
  });

  const data = Object.keys(statusCounts).map((key) => ({
    name: key,
    value: statusCounts[key],
  }));

  const COLORS = {
    Success: "#10B981", // green
    Failed: "#EF4444", // red
    Pending: "#3B82F6", // blue
    Unknown: "#6B7280", // gray
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <h4 className="text-lg font-medium mb-4">
        Interview Status Distribution
      </h4>
      <PieChart width={300} height={250}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[entry.name] || "#8884d8"}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default InterviewStats;
