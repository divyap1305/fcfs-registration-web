const express = require("express");
const router = express.Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_USER &&
    password === process.env.ADMIN_PASS
  ) {
    return res.json({ success: true, token: "ADMIN123TOKEN" });
  }

  res.status(401).json({ success: false, message: "Invalid credentials" });
});

module.exports = router;
