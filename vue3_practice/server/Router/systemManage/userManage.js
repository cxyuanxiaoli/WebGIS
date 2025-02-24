const express = require("express");
const ResFormat = require("../../utils/ResFormat.js");
const router = express.Router();
const db = require("../../database/v3_ts_cms.js");

//获取用户信息接口
router.get("/user/:id", (req, res) => {
  const id = +req.params.id;
  const user = db.findUserById(id);
  if (!user) {
    return res.json(ResFormat.error(1, "user not found"));
  }
  res.json(ResFormat.success(user, "user info"));
});

//修改用户接口
router.put("/user/:id", (req, res) => {
  const id = +req.params.id;
  db.editUserById(id, req.body);
  res.json(ResFormat.success(null, "edit user success"));
});

//删除用户接口
router.delete("/user/:id", (req, res) => {
  const id = +req.params.id;
  db.removeUserById(id);
  res.json(ResFormat.success(null, "delete user success"));
});

//添加用户接口
router.post("/user/add", (req, res) => {
  db.addUser(req.body);
  res.json(ResFormat.success(null, "add user success"));
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

module.exports = router;
