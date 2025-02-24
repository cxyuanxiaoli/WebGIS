const express = require("express");
const ResFormat = require("../../utils/ResFormat.js");
const router = express.Router();
const db = require("../../database/v3_ts_cms.js");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../Config/auth.js");

//登录接口
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = db.findUserByName(username);
  if (!user) {
    return res.json(ResFormat.error(1, "user not found"));
  }
  if (user.password !== password) {
    return res.json(ResFormat.error(1, "password error"));
  }
  if (!user.status) {
    return res.json(ResFormat.error(1, "user is disabled"));
  }
  console.log(req.body);
  //生成token
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
  //返回token
  res.json(ResFormat.success({ id: user.id, token: token }, "login success"));
});

//登录校验中间件
router.use((req, res, next) => {
  //获取 ‘Bearer <token>’ 字符串
  const authHeader = req.headers["authorization"];
  //获取token
  const token = authHeader && authHeader.split(" ")[1];
  //token不存在
  if (!token) {
    return res.sendStatus(401);
  }
  //token校验
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      //token无效
      return res.sendStatus(403);
    }
    //token校验成功，将用户id存入req对象
    req.user = user;
    next();
  });
});

//token有效性测试接口
router.get("/test2", (req, res) => {
  res.send("success!");
});

module.exports = router;
