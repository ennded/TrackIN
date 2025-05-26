import axios from "axios";
import { TrashIcon } from "@heroicons/react/24/outline";

const QuestionItem = ({ companyId, roundId, question, onDelete }) => {
  const handleDelete = async () => {
    if (window.confirm("Delete this question?")) {
      try {
        const { data } = await axios.delete(
          `/api/companies/${companyId}/rounds/${roundId}/questions/${question._id}`
        );
        onDelete(data); // Pass the updated company to parent
      } catch (error) {
        console.error("Delete failed:", error);
        alert("Failed to delete question");
      }
    }
  };

  return (
    <div className="flex items-center justify-between p-2 bg-white rounded border">
      <span>{question.questionText}</span>
      <button
        onClick={handleDelete}
        className="text-red-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50"
      >
        <TrashIcon className="w-4 h-4" />
      </button>
    </div>
  );
};
export default QuestionItem;
