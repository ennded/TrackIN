import { useState } from "react";
import axios from "axios";
import RoundAccordion from "./RoundAccordion";
import RoundForm from "./RoundForm";
import api from "../utils/api";
import {
  TrashIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";

const CompanyAccordion = ({ company, onDelete, onUpdate }) => {
  // Add state initialization
  const [isExpanded, setIsExpanded] = useState(false);
  const [showRoundForm, setShowRoundForm] = useState(false);

  const handleDelete = async () => {
    if (window.confirm(`Delete ${company.companyName}?`)) {
      try {
        await api.delete(`/companies/${company._id}`);
        onDelete(company._id);
      } catch (error) {
        console.error("Delete failed:", error);
        if (error.response?.status === 401) {
          alert("Session expired. Please login again.");
          // Redirect to login
          window.location.href = "/login";
        }
      }
    }
  };

  return (
    <div className="mb-4 border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer">
        <div
          className="flex items-center gap-3"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="text-gray-500">
            {isExpanded ? (
              <ChevronUpIcon className="w-5 h-5" />
            ) : (
              <ChevronDownIcon className="w-5 h-5" />
            )}
          </span>
          <h3 className="text-lg font-semibold">{company.companyName}</h3>
        </div>
        <button
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 border-t">
          <button
            onClick={() => setShowRoundForm(!showRoundForm)}
            className="mb-4 text-sm text-blue-600 hover:text-blue-700"
          >
            {showRoundForm ? "Cancel" : "+ Add Round"}
          </button>

          {showRoundForm && (
            <RoundForm
              companyId={company._id}
              onRoundAdded={(updatedCompany) => {
                onUpdate(updatedCompany);
                setShowRoundForm(false);
              }}
            />
          )}

          {company.rounds.map((round) => (
            <RoundAccordion
              key={round._id}
              companyId={company._id}
              round={round}
              onUpdate={onUpdate}
              onDelete={(roundId) => {
                const updatedRounds = company.rounds.filter(
                  (r) => r._id !== roundId
                );
                onUpdate({ ...company, rounds: updatedRounds });
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyAccordion;
