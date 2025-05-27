import { useState } from "react";
import api from "../utils/api";

const RoundForm = ({ companyId, onRoundAdded }) => {
  const [roundName, setRoundName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roundName.trim()) return;

    try {
      setIsSubmitting(true);
      const { data } = await api.post(
        `/companies/${companyId}/rounds`,
        { roundName, date: new Date().toISOString() }, // Add required fields
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      onRoundAdded(data);
      setRoundName("");
    } catch (error) {
      console.error("Add Round Error:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        window.location.href = "/login";
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex gap-2 items-center">
        <input
          type="text"
          value={roundName}
          onChange={(e) => setRoundName(e.target.value)}
          placeholder="Enter round name"
          className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting || !roundName.trim()}
          className={`px-4 py-2 rounded-lg ${
            isSubmitting || !roundName.trim()
              ? "bg-gray-200 text-gray-400"
              : "bg-green-500 hover:bg-green-600 text-white"
          } transition-colors`}
        >
          {isSubmitting ? "Adding..." : "Add Round"}
        </button>
      </div>
    </form>
  );
};

export default RoundForm;
