const express = require("express");
const {
  getRounds,
  getRound,
  createRound,
  updateRound,
  deleteRound,
} = require("../controllers/rounds");

const router = express.Router();

const { protect } = require("../middleware/auth");

router.route("/").get(protect, getRounds);

router
  .route("/:id")
  .get(protect, getRound)
  .put(protect, updateRound)
  .delete(protect, deleteRound);

router
  .route("/companies/:companyId/rounds")
  .get(protect, getRounds)
  .post(protect, createRound);

module.exports = router;
