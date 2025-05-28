import { format, isValid } from "date-fns";

export const formatInterviewDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return isValid(date)
      ? format(date, "MMM dd, yyyy ∙ hh:mm a")
      : "Date not available";
  } catch (error) {
    return "Invalid date format";
  }
};
