import { useState } from "react";
import axios from "axios";

const RoundForm = ({ companyId, onRoundAdded }) => {
  const [roundName, setRoundName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`/api/companies/${companyId}/rounds`, {
        roundName,
      });
      onRoundAdded(data);
      setRoundName("");
    } catch (error) {
      console.error("Error adding round:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-4 bg-gray-50 rounded">
      <div className="flex gap-2">
        <input
          type="text"
          value={roundName}
          onChange={(e) => setRoundName(e.target.value)}
          placeholder="Enter round name"
          className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
        >
          Add Round
        </button>
      </div>
    </form>
  );
};

export default RoundForm;
