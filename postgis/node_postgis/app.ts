const express = require("express");
const sqlConfig = require("./config/postgres");
const { Pool } = require("pg");

const app = express();
app.get("/", (req, res) => {
  res.send("Hello World");
});

const pool = new Pool(sqlConfig);

pool.connect((err, client, release) => {
  if (err) {
    return console.error("错误连接数据库", err.stack);
  }
  console.log("成功连接数据库");
  console.log("成功连接数据库");
  release();
});

pool.query(
  {
    text: "select name,ST_AsGeoJSON(geom) from geometries where name = $1",
    values: ["Point"],
  },
  (err, res) => {
    if (err) {
      return console.error("错误执行查询", err.stack);
    }
    console.log(res.rows);
    pool.end(); // 关闭连接池
  }
);

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
