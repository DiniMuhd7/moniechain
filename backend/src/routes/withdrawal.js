const express = require("express");
const { protect } = require("../middleware/auth");
const {
  submitWithdrawal,
  getWithdrawals,
  getUserWithdrawals,
  adminProcessWithdrawal,
  getProcessedWithdrawals,
} = require("../controllers/withdrawal");

const router = express.Router();

router.post("/request", protect, submitWithdrawal);
router.get("/all", protect, getWithdrawals);
router.get("/processed", protect, getProcessedWithdrawals);
router.get("/user-withdrwals", protect, getUserWithdrawals);
router.post("/admin-process-withdrawal", protect, adminProcessWithdrawal);

module.exports = router;
