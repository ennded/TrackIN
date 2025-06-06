import { useState } from "react";
import api from "../utils/api";
import QuestionForm from "./QuestionForm";
import QuestionItem from "./QuestionItem";
import {
  TrashIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";

const statusOptions = ["pending", "success", "failed"];

const RoundAccordion = ({ companyId, round, onUpdate, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [status, setStatus] = useState(round.status || "pending"); // default pending
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const handleDelete = async () => {
    if (window.confirm(`Delete ${round.roundName} round?`)) {
      try {
        const { data } = await api.delete(
          `/companies/${companyId}/rounds/${round._id}`
        );
        onUpdate(data); // Pass updated company to parent
      } catch (error) {
        console.error("Delete failed:", error);
        alert(
          `Deletion failed: ${error.response?.data?.message || "Server error"}`
        );
      }
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setUpdatingStatus(true);

    try {
      const { data } = await api.put(
        `/companies/${companyId}/rounds/${round._id}/status`,
        { status: newStatus }
      );
      onUpdate(data); // update parent with new data
    } catch (error) {
      console.error("Status update failed:", error);
      alert(
        `Status update failed: ${
          error.response?.data?.message || "Server error"
        }`
      );
      setStatus(round.status || "pending"); // revert status in case of failure
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="mb-3 border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-3 bg-white hover:bg-gray-50 cursor-pointer">
        <div
          className="flex items-center gap-2"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="text-gray-400">
            {isExpanded ? (
              <ChevronUpIcon className="w-4 h-4" />
            ) : (
              <ChevronDownIcon className="w-4 h-4" />
            )}
          </span>
          <h4 className="font-medium">{round.roundName}</h4>
          <span className="text-sm text-gray-500 ml-2">
            ({round.questions.length} questions)
          </span>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={status}
            onChange={handleStatusChange}
            disabled={updatingStatus}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-3 bg-gray-50 border-t">
          <button
            onClick={() => setShowQuestionForm(!showQuestionForm)}
            className="mb-2 text-sm text-purple-600 hover:text-purple-700"
          >
            {showQuestionForm ? "Cancel" : "+ Add Question"}
          </button>

          {showQuestionForm && (
            <QuestionForm
              companyId={companyId}
              roundId={round._id}
              onQuestionAdded={onUpdate}
            />
          )}

          <div className="space-y-2 mt-2">
            {round.questions.map((question) => (
              <QuestionItem
                key={question._id}
                companyId={companyId}
                roundId={round._id}
                question={question}
                onDelete={onUpdate}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoundAccordion;
