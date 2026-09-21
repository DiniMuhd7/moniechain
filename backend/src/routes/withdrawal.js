const express = require("express");
const { protect, requireAdmin } = require("../middleware/auth");
const {
  submitWithdrawal,
  getWithdrawals,
  getUserWithdrawals,
  adminProcessWithdrawal,
  getProcessedWithdrawals,
} = require("../controllers/withdrawal");

const router = express.Router();

router.post("/request", protect, submitWithdrawal);
router.get("/all", protect, requireAdmin, getWithdrawals);
router.get("/processed", protect, requireAdmin, getProcessedWithdrawals);
router.get("/user-withdrawals", protect, getUserWithdrawals);
router.post("/admin-process-withdrawal", protect, requireAdmin, adminProcessWithdrawal);

module.exports = router;
