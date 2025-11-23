const express = require("express");
const fs = require("fs");
const db = require("../Config/mydbcofig");

const router = express.Router();

router.use((req, res, next) => {
  const dateStr = new Date().toDateString();
  fs.appendFile(
    `./logs/log_${dateStr}.txt`,
    dateStr +
      " " +
      new Date().toTimeString() +
      " " +
      req.url +
      "," +
      req.method +
      "\n",
    "utf-8",
    (err, data) => {
      if (err) {
        console.log(err);
      }
    }
  );
  next();
});

router.get("/", (req, res) => {
  res.status(200).set("Content-Type", "application/json"); //状态码默认是200，设置响应头
  res.send({ msg: "hello" });
  //res.status(200).json({msg:'hello'}) //效果相同
  res.end(); //express会自动调用end方法，结束响应
});

//链式路由
router
  .route("/linkRouter")
  .get((req, res) => {
    res.send("linkRouter get");
  })
  .post((req, res) => {
    res.send("linkRouter post");
  })
  .put((req, res) => {
    res.send("linkRouter put");
  })
  .delete((req, res) => {
    res.send("linkRouter delete");
  });

//获取日志
router.get("/getlog", (req, res) => {
  fs.readFile(
    `./logs/log_${new Date().toDateString()}.txt`,
    "utf-8",
    (err, data) => {
      if (err) {
        console.log(err.message);
        res.json({ success: false, msg: err.message });
        return;
      }
      res.json({ success: true, data: data });
      console.log("日志文件读取成功");
    }
  );
});

//登录校验
router.post("/login", (req, res) => {
  const body = req.body; //获取请求体
  console.log(body);
  db.query(
    `select count(*) from usertable where username='${body.username}' and 
      password='${body.password}'`,
    (err, result) => {
      if (err) {
        console.log(err.message);
        res.json({ success: false, msg: err.message });
        return;
      }
      if (result[0]["count(*)"] > 0) {
        res.json({ success: true, msg: "用户存在，登录成功" });
      } else {
        res.json({ success: false, msg: "用户不存在，登录失败" });
      }
    }
  );
});

module.exports = router;
