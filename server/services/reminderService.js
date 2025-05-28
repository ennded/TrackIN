const checkReminders = async () => {
  const upcomingInterviews = await Company.find({
    "rounds.date": {
      $lte: new Date(Date.now() + 24 * 60 * 60 * 1000),
      $gte: new Date(),
    },
  }).populate("user");

  upcomingInterviews.forEach((interview) => {
    sendNotification({
      email: interview.user.email,
      subject: `Upcoming interview with ${interview.companyName}`,
      text: `Reminder: Your ${interview.rounds[0].type} round is scheduled for ${interview.rounds[0].date}`,
    });
  });
};

// Run daily at 9 AM
cron.schedule("0 9 * * *", checkReminders);

// File: backend/services/reminderService.js
export const scheduleReminders = async () => {
  const interviews = await Company.find({
    "rounds.date": {
      $gte: new Date(),
      $lte: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days ahead
    },
  }).populate("user");

  interviews.forEach(({ user, rounds }) => {
    sendEmail({
      to: user.email,
      subject: `Upcoming: ${rounds[0].type} Interview`,
      text: `Don't forget your interview on ${rounds[0].date}`,
    });
  });
};
