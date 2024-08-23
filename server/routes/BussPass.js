const express = require("express");
const router = express.Router();
const {
  renewBusPass,
  applyForBusPass,
  UserPass,
} = require("../controllers/BussPass");
const { auth } = require("../middlewares/auth");
const { uplaod } = require("../middlewares/multer");
router.post("/renewBusPass", auth, renewBusPass);
router.post("/applyForBusPass", auth, applyForBusPass);
// router.get("/pass", upload.single("file"), auth, UserPass);
router.get("/pass/:id", auth, UserPass);

module.exports = router;
