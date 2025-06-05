import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { format } from "date-fns";

const Dashboard = ({ companies }) => {
  // Flatten interview rounds
  const interviewData =
    companies?.flatMap(
      (company) =>
        company?.rounds?.map((round) => {
          const roundDate = round.date ? new Date(round.date) : new Date();
          return {
            date: format(
              isNaN(roundDate) ? new Date() : roundDate,
              "MMM dd, yyyy"
            ),
            status: round.status?.toLowerCase() || "pending",
            company: company.companyName,
            rounds: round.roundNumber,
            questions: round.questions?.length || 0,
          };
        }) || []
    ) || [];

  // Count statuses
  const statusCount = interviewData.reduce((acc, curr) => {
    const status = curr.status || "unknown";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // Chart data
  const chartData = [
    { name: "Success", value: statusCount.success || 0, color: "#4ade80" },
    { name: "Failed", value: statusCount.failed || 0, color: "#f87171" },
    { name: "Pending", value: statusCount.pending || 0, color: "#60a5fa" },
    { name: "Unknown", value: statusCount.unknown || 0, color: "#94a3b8" },
  ];

  // Average rounds
  const totalRounds = companies.reduce(
    (acc, curr) => acc + curr.rounds.length,
    0
  );
  const averageRounds =
    companies.length > 0 ? (totalRounds / companies.length).toFixed(1) : "0.0";

  // Stats
  const totalInterviews = companies.length;
  const acceptedCount = companies.reduce(
    (acc, company) =>
      acc + company.rounds.filter((round) => round.status === "success").length,
    0
  );

  const stats = {
    total: totalInterviews,
    accepted: acceptedCount,
    conversionRate:
      totalInterviews > 0
        ? ((acceptedCount / totalInterviews) * 100).toFixed(1)
        : "0.0",
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Interview Analytics
            </h1>
            <p className="text-gray-500">
              {format(new Date(), "MMM dd, yyyy")}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h3 className="text-gray-500 text-sm">Total Interviews</h3>
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h3 className="text-gray-500 text-sm">Successful</h3>
            <p className="text-2xl font-bold text-green-600">
              {statusCount.success || 0}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h3 className="text-gray-500 text-sm">Conversion Rate</h3>
            <p className="text-2xl font-bold text-purple-600">
              {stats.conversionRate}%
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h3 className="text-gray-500 text-sm">Average Rounds</h3>
            <p className="text-2xl font-bold text-blue-600">{averageRounds}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h3 className="text-gray-500 text-sm">Pending</h3>
            <p className="text-2xl font-bold text-yellow-600">
              {statusCount.pending || 0}
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">
              Interview Status Distribution
            </h3>
            <BarChart width={500} height={300} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value">
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </div>

          {/* Line Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Interview Timeline</h3>
            <LineChart width={500} height={300} data={interviewData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="rounds" stroke="#82ca9d" />
              <Line type="monotone" dataKey="questions" stroke="#8884d8" />
            </LineChart>
          </div>

          {/* Pie Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm col-span-full lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">
              Interview Status Pie Distribution
            </h3>
            <PieChart width={500} height={300}>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
