const express = require("express");
const ResFormat = require("../../utils/ResFormat.js");
const router = express.Router();
const db = require("../../database/v3_ts_cms.js");

//获取角色列表接口
router.get("/rolelist", (req, res) => {
  const list = [];
  db.tables[1].columns.forEach((item) => {
    list.push(item.role);
  });
  res.json(ResFormat.success(list, "role list"));
});

module.exports = router;
