const db = {
  name: "v3_ts_cms",
  tables: [
    //table 1: users
    {
      name: "users",
      //用户ID，用户名，密码，角色，权限列表
      fields: ["id", "username", "password"],
      columns: [
        {
          id: 1,
          username: "admin123",
          password: "123456",
          role: "admin",
          menus: [],
        },
        {
          id: 2,
          username: "user123",
          password: "123456",
          role: "user",
          menus: [],
        },
        {
          id: 3,
          username: "guest123",
          password: "123456",
          role: "guest",
          menus: [],
        },
      ],
    },
    //table 2: roles
    {
      name: "roles",
      //角色名称，权限列表
      fields: ["role", "menus"],
      columns: [
        {
          role: "admin",
          menus: [1, 2, 3, 4],
        },
        {
          role: "user",
          menus: [1, 3, 4],
        },
        {
          role: "guest",
          menus: [1, 4],
        },
      ],
    },
    //table 3: menus
    {
      name: "menus",
      columns: [
        {
          id: 1,
          name: "系统总览",
          icon: "House",
          children: [
            {
              id: 11,
              name: "核心技术",
              urlName: "CoreTechnology",
              children: null,
            },
            {
              id: 12,
              urlName: "GoodStatic",
              name: "商品统计",
              children: null,
            },
          ],
        },
        {
          id: 2,
          name: "系统管理",
          icon: "Edit",
          children: [
            {
              id: 21,
              name: "用户管理",
              urlName: "UserManage",
              children: null,
            },
            {
              id: 22,
              name: "部门管理",
              urlName: "DepartManage",
              children: null,
            },
            {
              id: 23,
              name: "菜单管理",
              urlName: "MenuManage",
              children: null,
            },
            {
              id: 24,
              name: "角色管理",
              urlName: "RoleManage",
              children: null,
            },
          ],
        },
        {
          id: 3,
          name: "商品中心",
          icon: "ShoppingCart",
          children: [
            {
              id: 31,
              name: "商品类别",
              urlName: "GoodsCategory",
              children: null,
            },
            {
              id: 32,
              name: "商品信息",
              urlName: "GoodsInfo",
              children: null,
            },
          ],
        },
        {
          id: 4,
          name: "随便聊聊",
          icon: "ChatDotSquare",
          children: [
            {
              id: 41,
              name: "你的故事",
              urlName: "YourStory",
              children: null,
            },
            {
              id: 42,
              name: "故事列表",
              urlName: "StoryList",
              children: null,
            },
          ],
        },
      ],
    },
  ],
  findById: (id) => {
    return db.tables[0].columns.find((c) => c.id === id);
  },
  findByName: (username) => {
    return db.tables[0].columns.find((c) => c.username === username);
  },
  init: () => {
    const t1 = db.tables[0];
    const t2 = db.tables[1];
    const t3 = db.tables[2];

    for (let userKey in t1.columns) {
      let user = t1.columns[userKey];
      let role = t2.columns.find((c) => c.role === user.role);
      if (role) {
        user.menus = role.menus.map((menuId) => {
          return t3.columns.find((m) => m.id === menuId);
        });
      }
    }
  },
};

db.init();
console.log("db inited");

module.exports = db;
