import { useState } from "react";
import api from "../utils/api";

const QuestionForm = ({ companyId, roundId, onQuestionAdded }) => {
  const [questionText, setQuestionText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedText = questionText.trim();

    if (!trimmedText || trimmedText.length < 3) {
      alert("Question must be at least 3 characters");
      return;
    }

    try {
      setIsSubmitting(true);
      const { data } = await api.post(
        `/companies/${companyId}/rounds/${roundId}/questions`,
        { questionText: trimmedText }, // Send only necessary field
        {
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
        }
      );
      onQuestionAdded(data);
      setQuestionText("");
    } catch (error) {
      console.error("Question Error:", error.response?.data);
      alert(error.response?.data?.error || "Failed to add question");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="flex gap-2 items-center">
        <input
          type="text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Enter your question"
          className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting || !questionText.trim()}
          className={`px-4 py-2 rounded-lg ${
            isSubmitting || !questionText.trim()
              ? "bg-gray-200 text-gray-400"
              : "bg-purple-500 hover:bg-purple-600 text-white"
          } transition-colors`}
        >
          {isSubmitting ? "Adding..." : "Add"}
        </button>
      </div>
    </form>
  );
};

export default QuestionForm;
