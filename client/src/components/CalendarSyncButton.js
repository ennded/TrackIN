import { useState } from "react"; // Add this
import { CalendarDaysIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify"; // Add this
import api from "../utils/api"; // Add this

const CalendarSyncButton = ({ interview }) => {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await api.post(
        `/api/companies/${interview.companyId}/rounds/${interview.roundId}/sync`
      );
      toast.success("Calendar event updated successfully!");
    } catch (error) {
      toast.error("Sync failed: " + error.message);
    }
    setIsSyncing(false);
  };

  return (
    <div className="relative group">
      <button
        onClick={handleSync}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
          interview.calendarEventId
            ? "bg-green-100 text-green-700 hover:bg-green-200"
            : "bg-blue-100 text-blue-700 hover:bg-blue-200"
        }`}
      >
        {isSyncing ? (
          <ArrowPathIcon className="w-5 h-5 animate-spin" />
        ) : (
          <CalendarDaysIcon className="w-5 h-5" />
        )}
        <span className="hidden sm:inline">
          {interview.calendarEventId ? "Update Calendar" : "Add to Calendar"}
        </span>
      </button>
      <div className="absolute hidden group-hover:block bottom-full mb-2 px-2 py-1 text-sm bg-gray-800 text-white rounded-lg">
        {interview.calendarEventId
          ? "Sync changes to your calendar"
          : "Create calendar event with reminders"}
      </div>
    </div>
  );
};

export default CalendarSyncButton;
