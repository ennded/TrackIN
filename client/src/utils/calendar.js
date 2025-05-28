export const exportToCalendar = (interview) => {
  const icsContent = `BEGIN:VCALENDAR
  BEGIN:VEVENT
  DTSTART:${format(interview.date, "yyyyMMdd'T'HHmmss")}
  DURATION:PT${interview.duration}M
  SUMMARY:Interview with ${interview.company}
  DESCRIPTION:${interview.feedback}
  END:VEVENT
  END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: "text/calendar" });
  saveAs(blob, "interview.ics");
};
