// File: components/CompanyAccordion.jsx
import { useState } from "react";
import RoundAccordion from "./RoundAccordion";
import RoundForm from "./RoundForm";
import ConversionRateBadge from "./ConversionRateBadge";
import InterviewTimeline from "./InterviewTimeline";
import InterviewStats from "./InterviewStats";
import ReminderSection from "./ReminderSection";
import api from "../utils/api";
import {
  TrashIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";

const CompanyAccordion = ({ company, onDelete, onUpdate }) => {
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
          window.location.href = "/login";
        }
      }
    }
  };

  return (
    <div className="mb-4 border rounded-xl shadow overflow-hidden bg-white">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          {isExpanded ? (
            <ChevronUpIcon className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 text-gray-500" />
          )}
          <h3 className="text-lg font-semibold text-gray-800">
            {company.companyName}
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({company.offerStatus})
            </span>
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <ConversionRateBadge
            total={company.rounds.length}
            accepted={company.offerStatus === "Accepted" ? 1 : 0}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 border-t">
          {/* Timeline */}
          <InterviewTimeline rounds={company.rounds} />

          {/* Stats + Reminder */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <InterviewStats rounds={company.rounds} />
            <ReminderSection company={company} />
          </div>

          {/* Round Form Toggle */}
          <div className="mt-6">
            <button
              onClick={() => setShowRoundForm(!showRoundForm)}
              className="mb-4 text-sm text-blue-600 hover:text-blue-700"
            >
              {showRoundForm ? "Cancel" : "+ Add Round"}
            </button>

            {/* Round Form */}
            {showRoundForm && (
              <RoundForm
                companyId={company._id}
                onRoundAdded={(updatedCompany) => {
                  onUpdate(updatedCompany);
                  setShowRoundForm(false);
                }}
              />
            )}

            {/* Round List */}
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
        </div>
      )}
    </div>
  );
};

export default CompanyAccordion;
