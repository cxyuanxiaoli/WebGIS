const express = require("express");
const ResFormat = require("../../utils/ResFormat.js");
const router = express.Router();
const db = require("../../database/v3_ts_cms.js");

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

module.exports = router;
