const express = require("express");
const ResFormat = require("../utils/ResFormat.js");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("cms home page");
});

router.get("/test", (req, res) => {
  res.send("success!");
});

router.post("/login", (req, res) => {
  const name = "admin123";
  const pw = "123456";
  const { username, password } = req.body;

  if (username === name && password === pw) {
    console.log(req.body);
    res.json(
      ResFormat.success(
        { id: 1, name: "admin123", token: "1111" },
        "login success"
      )
    );
  } else {
    console.log(req.body, "login failed");

    res.json(ResFormat.error(1, "login failed"));
  }
});

module.exports = router;
