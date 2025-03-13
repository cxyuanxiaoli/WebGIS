import express from "express";
import { Pool } from "pg";
import sqlConfig from "./config/postgres"; // 你的数据库配置

const app = express();
const pool = new Pool(sqlConfig); // 创建连接池

// 定义一个路由来处理请求
app.get("/data", (req, res) => {
  pool.query(
    {
      text: "select name,ST_AsGeoJSON(geom) from geometries",
      values: [],
    },
    (err, pgResult) => {
      if (err) {
        return console.error("查询执行错误", err.stack);
      }
      // 注意：这里pgResult是查询结果，res是express的响应对象，不要混淆
      res.json(pgResult.rows); // 将查询结果以JSON格式发送给客户端
    }
  );
});

app.listen(8080, () => {
  console.log("服务器正在运行在端口 8080");
});

// 监听进程关闭信号以优雅地关闭服务器和连接池
process.on("SIGINT", () => {
  pool.end(() => {
    console.log("连接池关闭成功");
    process.exit(0); // 退出进程
  });
});

process.on("SIGTERM", () => {
  pool.end(() => {
    console.log("连接池关闭成功");
    process.exit(0); // 退出进程
  });
});
