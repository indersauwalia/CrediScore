const express = require("express");
const router = express.Router();
const controller = require("../controllers/verifyController");
const auth = require("../middleware/auth");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({ storage });

router.post(
  "/verify-user",
  upload.fields([{ name: "pan", maxCount: 1 }, { name: "salarySlip", maxCount: 1 }]),
  controller.verifyUser
);

router.put("/admin/update-loan/:id", auth, controller.adminUpdateLoan);
router.get("/all-loans", auth, controller.getAllLoans);
router.get("/approved-loans", auth, controller.getApprovedLoans);
router.get("/rejected-loans", auth, controller.getRejectedLoans);

module.exports = router;
