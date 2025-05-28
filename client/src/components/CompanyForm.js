const CompanyForm = ({ onCompanyAdded }) => {
  const [companyName, setCompanyName] = useState("");
  const [rounds, setRounds] = useState([
    { roundName: "", date: "", duration: 30 },
  ]);

  const handleRoundChange = (index, field, value) => {
    const updatedRounds = [...rounds];
    updatedRounds[index][field] = value;
    setRounds(updatedRounds);
  };

  const addRound = () => {
    setRounds([...rounds, { roundName: "", date: "", duration: 30 }]);
  };

  const removeRound = (index) => {
    if (rounds.length <= 1) return;
    const updatedRounds = [...rounds];
    updatedRounds.splice(index, 1);
    setRounds(updatedRounds);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/companies", {
        companyName,
        rounds,
      });
      onCompanyAdded(data);
      setCompanyName("");
      setRounds([{ roundName: "", date: "", duration: 30 }]);
    } catch (error) {
      console.error("Error adding company:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 p-4 bg-white shadow rounded-lg"
    >
      {/* Company Name Field */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Company Name</label>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      {/* Rounds Section */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">Interview Rounds</h3>
          <button type="button" onClick={addRound} className="text-blue-500">
            + Add Round
          </button>
        </div>

        {rounds.map((round, index) => (
          <div key={index} className="border p-3 rounded mb-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
              <div>
                <label className="block mb-1 text-sm">Round Name</label>
                <input
                  type="text"
                  value={round.roundName}
                  onChange={(e) =>
                    handleRoundChange(index, "roundName", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm">Date</label>
                <input
                  type="date"
                  value={round.date}
                  onChange={(e) =>
                    handleRoundChange(index, "date", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm">Duration (mins)</label>
                <input
                  type="number"
                  value={round.duration}
                  onChange={(e) =>
                    handleRoundChange(index, "duration", e.target.value)
                  }
                  min="15"
                  max="480"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
            {rounds.length > 1 && (
              <button
                type="button"
                onClick={() => removeRound(index)}
                className="text-red-500 text-sm"
              >
                Remove Round
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Company
      </button>
    </form>
  );
};
