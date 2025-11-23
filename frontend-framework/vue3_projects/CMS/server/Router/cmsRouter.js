const express = require("express");
const router = express.Router();

const loginRouter = require("./login/login.js");
const userRouter = require("./systemManage/userManage.js");
const roleRouter = require("./systemManage/roleManage.js");
const departRouter = require("./systemManage/departManage.js");

//测试接口
router.get("/test", (req, res) => {
  res.send("success!");
});

router.use("/", loginRouter);
router.use("/", userRouter);
router.use("/", roleRouter);
router.use("/", departRouter);

module.exports = router;
