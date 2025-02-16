const fs = require("fs");
const _ = require("lodash");

const userTable = JSON.parse(
  fs.readFileSync(__dirname + "/v3_ts_cmc_user.json")
);
const roleTable = JSON.parse(
  fs.readFileSync(__dirname + "/v3_ts_cmc_role.json")
);
const menuTable = JSON.parse(
  fs.readFileSync(__dirname + "/v3_ts_cmc_menu.json")
);
const departTable = JSON.parse(
  fs.readFileSync(__dirname + "/v3_ts_cmc_depart.json")
);

const db = {
  name: "v3_ts_cms",
  tables: [null, roleTable, menuTable, departTable],
  init: () => {
    db.tables[0] = _.cloneDeep(userTable);
    const t1 = db.tables[0];
    const t2 = db.tables[1];
    const t3 = db.tables[2];
    const t4 = db.tables[3];

    for (let userKey in t1.columns) {
      let user = t1.columns[userKey];
      let role = t2.columns.find((c) => c.role === user.role);
      if (role) {
        user.menus = role.menus.map((menuId) => {
          return t3.columns.find((m) => m.id === menuId);
        });
      }
      let depart = t4.columns.find((d) => d.id === user.depart);
      if (depart) {
        user.depart = depart;
      }
    }
  },
  store() {
    fs.writeFileSync(
      __dirname + "/v3_ts_cmc_user.json",
      JSON.stringify(userTable)
    );
    fs.writeFileSync(
      __dirname + "/v3_ts_cmc_role.json",
      JSON.stringify(roleTable)
    );
    fs.writeFileSync(
      __dirname + "/v3_ts_cmc_menu.json",
      JSON.stringify(menuTable)
    );
    fs.writeFileSync(
      __dirname + "/v3_ts_cmc_depart.json",
      JSON.stringify(departTable)
    );
  },
  findById: (id) => {
    return db.tables[0].columns.find((c) => c.id === id);
  },
  findByName: (username) => {
    return db.tables[0].columns.find((c) => c.username === username);
  },
  toUserFormat(userlist) {
    return userlist.map((c) => {
      return {
        id: c.id,
        username: c.username,
        realname: c.realname,
        tel: c.tel,
        status: c.status,
        createTime: c.createTime,
        depart: c.depart,
      };
    });
  },
  queryUserlist(params) {
    //请求体为空，查询所有用户信息
    if (!params) {
      return this.toUserFormat(db.tables[0].columns);
    }
    //请求体不为空，根据条件查询用户信息

    const { username, realname, tel, status, createTimeRange } = params;
    const time1 = new Date(createTimeRange[0]);
    const time2 = new Date(createTimeRange[1]);
    return this.toUserFormat(
      db.tables[0].columns.filter((c) => {
        return (
          c.username.includes(username) &&
          c.realname.includes(realname) &&
          c.tel.includes(tel) &&
          (status === "" || c.status === status) &&
          (createTimeRange.length === 0
            ? true
            : new Date(c.createTime) >= time1 &&
              new Date(c.createTime) <= time2)
        );
      })
    );
  },
  addUser(params) {
    const { username, realname, tel, role, depart } = params;
    userTable.columns.push({
      id: ++userTable.max_id,
      username,
      realname,
      password: "123456",
      tel,
      role,
      status: true,
      createTime: this.formatDate(new Date()),
      depart,
    });

    this.init();
  },
  removeUser(id) {
    let index = userTable.columns.findIndex((c) => c.id === id);
    if (index !== -1) {
      userTable.columns.splice(index, 1);
      this.init();
    }
  },
  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从0开始，需要加1，并且补零
    const day = String(date.getDate()).padStart(2, "0"); // 补零
    return `${year}-${month}-${day}`;
  },
};

db.init();
console.log("db inited");

setInterval(() => {
  console.log("Storing database...");
  db.store();
}, 60000);

process.on("beforeExit", () => {
  console.log("database stored");
  db.store();
});
process.on("SIGINT", () => {
  console.log("database stored");
  db.store();
  process.exit(); // 手动调用 process.exit() 以确保进程退出
});
module.exports = db;
