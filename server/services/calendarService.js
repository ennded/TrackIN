// File: backend/services/calendarService.js
import { google } from "googleapis";
import Company from "../models/Company.js";

// Configure OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export const createCalendarEvent = async (interview, user) => {
  try {
    oAuth2Client.setCredentials({
      access_token: user.googleAccessToken,
      refresh_token: user.googleRefreshToken,
    });

    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

    // Check if event already exists
    let event;
    if (interview.calendarEventId) {
      event = await calendar.events.update({
        calendarId: "primary",
        eventId: interview.calendarEventId,
        resource: createEventObject(interview),
      });
    } else {
      event = await calendar.events.insert({
        calendarId: "primary",
        resource: createEventObject(interview),
      });

      // Save event ID to database
      await Company.findByIdAndUpdate(
        interview._id,
        {
          $set: { "rounds.$[round].calendarEventId": event.data.id },
        },
        {
          arrayFilters: [{ "round._id": interview.roundId }],
        }
      );
    }

    return event.data;
  } catch (error) {
    console.error("Calendar API Error:", error.message);
    throw new Error("Failed to sync with Google Calendar");
  }
};

const createEventObject = (interview) => ({
  summary: `Interview with ${interview.companyName}`,
  description: `Round Type: ${interview.roundType}\nStatus: ${interview.status}`,
  start: {
    dateTime: interview.date,
    timeZone: "UTC",
  },
  end: {
    dateTime: new Date(interview.date.getTime() + interview.duration * 60000),
    timeZone: "UTC",
  },
  reminders: {
    useDefault: false,
    overrides: [
      { method: "email", minutes: 24 * 60 }, // 24 hours before
      { method: "popup", minutes: 30 }, // 30 minutes before
    ],
  },
  attendees: interview.interviewerEmail
    ? [{ email: interview.interviewerEmail }]
    : [],
  conferenceData:
    interview.mode === "Video Call"
      ? {
          createRequest: { requestId: Date.now().toString() },
        }
      : null,
});

// File: backend/services/calendarService.js
export const syncAllInterviews = async (user) => {
  const companies = await Company.find({ user: user._id })
    .select("companyName rounds")
    .lean();

  for (const company of companies) {
    for (const round of company.rounds) {
      if (round.date) {
        await createCalendarEvent(
          {
            ...round,
            companyName: company.companyName,
            _id: company._id,
            roundId: round._id,
          },
          user
        );
      }
    }
  }
};

// Add to .env file
