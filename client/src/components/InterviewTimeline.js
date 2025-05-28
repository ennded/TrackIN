// Add these imports at the top
import { formatInterviewDate } from "../utils/dateUtils";
import CalendarSyncButton from "./CalendarSyncButton";

const InterviewTimeline = ({ rounds }) => (
  <div className="space-y-4">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">
      Interview Timeline
    </h3>
    {rounds.map((round, index) => (
      <div key={round._id} className="flex items-start gap-4">
        <div className="flex flex-col items-center">
          <div
            className={`w-3 h-3 rounded-full ${
              round.status === "Selected"
                ? "bg-green-500"
                : round.status === "Rejected"
                ? "bg-red-500"
                : "bg-blue-500"
            }`}
          />
          {index < rounds.length - 1 && (
            <div className="w-px h-8 bg-gray-200 mt-1" />
          )}
        </div>
        <div className="flex-1 bg-white p-4 rounded-xl shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium text-gray-800">{round.roundName}</h4>
              <p className="text-sm text-gray-500">
                {formatInterviewDate(round.date)} {/* Updated this line */}
              </p>
            </div>
            <CalendarSyncButton interview={round} />
          </div>
          <div className="mt-2 flex gap-2">
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
              Duration: {Math.floor(round.duration / 60)}h {round.duration % 60}
              m
            </span>
            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
              {round.type}
            </span>
          </div>
          {round.feedback && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">{round.feedback}</p>
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
);

export default InterviewTimeline;
