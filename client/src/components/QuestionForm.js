import { useState } from "react";
import axios from "axios";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

const QuestionForm = ({ companyId, roundId, onQuestionAdded }) => {
  const [questionText, setQuestionText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    try {
      setIsSubmitting(true);
      const { data } = await axios.post(
        `/api/companies/${companyId}/rounds/${roundId}/questions`,
        { questionText: questionText.trim() }
      );
      onQuestionAdded(data);
      setQuestionText("");
    } catch (error) {
      console.error("Error adding question:", error);
      alert("Failed to add question. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex gap-2 items-stretch">
        <input
          type="text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Enter interview question"
          className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting || !questionText.trim()}
          className={`px-4 py-2 rounded-md flex items-center gap-1 ${
            isSubmitting || !questionText.trim()
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700 text-white"
          } transition-colors text-sm`}
        >
          <PlusCircleIcon className="w-5 h-5" />
          {isSubmitting ? "Adding..." : "Add Question"}
        </button>
      </div>
    </form>
  );
};

export default QuestionForm;
