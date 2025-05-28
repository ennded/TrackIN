router.get("/stats/:userId", auth, async (req, res) => {
  try {
    const stats = await Company.aggregate([
      { $match: { user: req.user.id } },
      { $unwind: "$rounds" },
      {
        $group: {
          _id: null,
          totalInterviews: { $sum: 1 },
          selected: {
            $sum: { $cond: [{ $eq: ["$rounds.outcome", "Selected"] }, 1, 0] },
          },
          conversionRate: {
            $avg: { $cond: [{ $eq: ["$offerStatus", "Accepted"] }, 1, 0] },
          },
        },
      },
    ]);

    res.json(stats[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// File: backend/routes/analyticsRoutes.js
router.get("/stats", auth, async (req, res) => {
  const stats = await Company.aggregate([
    { $match: { user: req.user._id } },
    {
      $project: {
        total: { $size: "$rounds" },
        accepted: {
          $size: {
            $filter: {
              input: "$rounds",
              as: "round",
              cond: { $eq: ["$$round.status", "Selected"] },
            },
          },
        },
      },
    },
  ]);
  res.json(stats);
});
