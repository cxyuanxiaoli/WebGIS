const express = require("express");
const ResFormat = require("../utils/ResFormat.js");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../Config/auth.js");
const db = require("../database/v3_ts_cms.js");

//测试接口
router.get("/test", (req, res) => {
  res.send("success!");
});

//登录接口
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = db.findByName(username);
  if (!user) {
    return res.json(ResFormat.error(1, "user not found"));
  }
  if (user.password !== password) {
    return res.json(ResFormat.error(1, "password error"));
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

//获取用户信息接口
router.get("/user/:id", (req, res) => {
  const id = +req.params.id;
  const user = db.findById(id);
  if (!user) {
    return res.json(ResFormat.error(1, "user not found"));
  }
  res.json(ResFormat.success(user, "user info"));
});

//获取/查询用户列表接口
router.post("/userlist", (req, res) => {
  const { searchUser, pageSize, offset } = req.body;
  const list = db.queryUserlist(searchUser);

  const pageList = {
    list: list.slice(offset * pageSize, (offset + 1) * pageSize),
    // totalCount: list.length,
    totalCount: list.length,
  };
  res.json(ResFormat.success(pageList, "user list"));
});

//获取角色列表接口
router.get("/rolelist", (req, res) => {
  const list = [];
  db.tables[1].columns.forEach((item) => {
    list.push(item.role);
  });
  res.json(ResFormat.success(list, "role list"));
});

//获取部门列表接口
router.get("/departlist", (req, res) => {
  const list = db.tables[3].columns.map((item) => {
    return {
      id: item.id,
      name: item.name,
    };
  });
  res.json(ResFormat.success(list, "departlist"));
});

//添加用户接口
router.post("/user/add", (req, res) => {
  db.addUser(req.body);
  res.json(ResFormat.success(null, "add user success"));
});

//删除用户接口
router.delete("/user/:id", (req, res) => {
  const id = +req.params.id;
  db.removeUser(id);
  res.json(ResFormat.success(null, "delete user success"));
});

module.exports = router;
