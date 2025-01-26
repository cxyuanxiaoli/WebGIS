const express = require("express");
const cors = require("cors");
const myRouter = require("./Router/myRouter.js");
const cmsRouter = require("./Router/cmsRouter.js");

const app = express();
//设置跨域请求
const corsOptions = {
  origin: "*",
  methods: "*",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json()); // 解析 JSON 请求体
app.use("/public", express.static("./public")); // 静态资源目录
// app.use('/data',express.static('./data'))  // 静态资源目录

//路由参数
app.use("/", myRouter);
app.use("/v3-ts-cms", cmsRouter);

// 错误处理
app.use("*", (req, res) => {
  res.status(404).send("<h1>Not Found<h1>");
});

app.listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
});
