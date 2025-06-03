// File: frontend/src/components/CalendarSync.js
const CalendarSync = ({ interview }) => (
  <button onClick={() => exportToCalendar(interview)} className="btn-secondary">
    <CalendarIcon className="w-5 h-5 mr-2" />
    Add to calender
  </button>
);
