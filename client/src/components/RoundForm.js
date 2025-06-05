import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Add CSS import

import api from "../utils/api";

const RoundForm = ({ companyId, onRoundAdded }) => {
  const [roundName, setRoundName] = useState("");
  const [date, setDate] = useState(new Date());
  const [duration, setDuration] = useState(60); // Default 60 minutes
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!roundName.trim()) {
      setError("Round name is required");
      return;
    }

    if (duration < 15 || duration > 480) {
      setError("Duration must be between 15-480 minutes");
      return;
    }
    if (!date || isNaN(date.getTime())) {
      setError("Invalid interview date");
      return;
    }
    try {
      setIsSubmitting(true);
      const { data } = await api.post(`/companies/${companyId}/rounds`, {
        roundName: roundName.trim(),
        date: date.toISOString(),
        duration: Number(duration),
        status: "pending", // Default status
      });

      onRoundAdded(data);
      setRoundName("");
      setDuration(60);
      setDate(new Date());
    } catch (error) {
      console.log("Full Error Object:", error);
      console.log("Response Data:", error.response?.data);
      setError(error.response?.data?.error || "Failed to create round");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-50 rounded-lg">
      <div className="space-y-4">
        {error && <div className="text-red-500 text-sm">{error}</div>}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Round Name
          </label>
          <input
            type="text"
            value={roundName}
            onChange={(e) => setRoundName(e.target.value)}
            className="w-full p-2 border rounded-lg"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date & Time
          </label>
          <DatePicker
            selected={date}
            onChange={(date) => setDate(date)}
            showTimeSelect
            dateFormat="MMMM d, yyyy h:mm aa"
            className="w-full p-2 border rounded-lg"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration (minutes)
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            min="15"
            max="480"
            className="w-full p-2 border rounded-lg"
            disabled={isSubmitting}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isSubmitting ? "Adding..." : "Add Round"}
        </button>
      </div>
    </form>
  );
};

export default RoundForm;
