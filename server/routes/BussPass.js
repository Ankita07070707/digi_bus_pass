const express = require("express");
const router = express.Router();
const {
  renewBusPass,
  applyForBusPass,
  UserPass,
} = require("../controllers/BussPass");
const { auth } = require("../middlewares/auth");

router.post("/renewBusPass", auth, renewBusPass);
router.post("/applyForBusPass", auth, applyForBusPass);
router.get("/pass", auth, UserPass);

module.exports = router;
