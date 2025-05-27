import { useState } from "react";
import DatePicker from "react-datepicker"; // Use DateTimePicker component
import "react-datepicker/dist/react-datepicker.css";
import api from "../utils/api";

const RoundForm = ({ companyId, onRoundAdded }) => {
  const [roundName, setRoundName] = useState("");
  const [roundType, setRoundType] = useState("HR");
  const [interviewDate, setInterviewDate] = useState(new Date());
  const [duration, setDuration] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roundName.trim()) return;

    try {
      setIsSubmitting(true);
      const { data } = await api.post(
        `/companies/${companyId}/rounds`,
        {
          roundName,
          roundType,
          interviewDate,
          duration: Number(duration),
          feedback,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      onRoundAdded(data);
      setRoundName("");
      setRoundType("HR");
      setInterviewDate(new Date());
      setDuration("");
      setFeedback("");
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
    <form
      onSubmit={handleSubmit}
      className="mb-4 p-4 bg-gray-50 rounded-lg space-y-4"
    >
      <input
        type="text"
        value={roundName}
        onChange={(e) => setRoundName(e.target.value)}
        placeholder="Enter round name"
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        disabled={isSubmitting}
      />

      <select
        value={roundType}
        onChange={(e) => setRoundType(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
      >
        <option value="HR">HR</option>
        <option value="Technical">Technical</option>
        <option value="System Design">System Design</option>
      </select>

      <DatePicker
        selected={interviewDate}
        onChange={(date) => setInterviewDate(date)}
        showTimeSelect
        dateFormat="Pp"
        className="w-full px-4 py-2 border rounded-lg"
      />

      <input
        type="number"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        placeholder="Duration (minutes)"
        className="w-full px-4 py-2 border rounded-lg"
      />

      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Feedback/Notes"
        className="w-full px-4 py-2 border rounded-lg"
      />

      <button
        type="submit"
        disabled={isSubmitting || !roundName.trim()}
        className={`w-full py-2 rounded-lg ${
          isSubmitting || !roundName.trim()
            ? "bg-gray-200 text-gray-400"
            : "bg-green-500 hover:bg-green-600 text-white"
        } transition-colors`}
      >
        {isSubmitting ? "Adding..." : "Add Round"}
      </button>
    </form>
  );
};

export default RoundForm;
