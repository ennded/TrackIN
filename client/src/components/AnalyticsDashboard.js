const AnalyticsDashboard = ({ companies }) => {
  // Conversion rate calculation
  const conversionRate =
    (companies.filter((c) => c.offerStatus === "Accepted").length /
      companies.length) *
    100;

  return (
    <div className="dashboard-grid">
      <div className="metric-card">
        <h3>Total Interviews</h3>
        <p>{companies.length}</p>
      </div>

      <div className="metric-card">
        <h3>Conversion Rate</h3>
        <p>{conversionRate.toFixed(1)}%</p>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={companies}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="companyName" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="rounds.length" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
