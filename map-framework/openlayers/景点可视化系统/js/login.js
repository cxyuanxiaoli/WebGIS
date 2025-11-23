let userInfos = null;
let backgrounds = null;

/**
 * @async 获取所有景点图片，设置为随机背景
 */
fetch("../data/4A景点.json")
  .then((res) => res.json())
  .then((data) => {
    backgrounds = data
      .filter((item) => item["照片"])
      .map((item) => item["照片"]);
    backgrounds = backgrounds.flat(Infinity);
    toggleBackground();
  });

/**
 * @function toggleBackground 切换背景
 */
function toggleBackground() {
  document.querySelector("body").style.backgroundImage = `url(${
    backgrounds[Math.floor(Math.random() * backgrounds.length)]
  })`;
}

/**
 * @async 获取所有用户信息
 */
fetch("../data/userInfo.json")
  .then((res) => res.json())
  .then((data) => {
    userInfos = data;
  })
  .catch((e) => console.log(e));

/**
 * @function login 登录逻辑
 */
function login() {
  if (!userInfos) return;
  const username = document.querySelector("#username").value;
  const password = document.querySelector("#password").value;
  const user = userInfos.find((item) => item.username === username);
  if (!user) {
    alert("用户不存在!");
    return;
  }
  if (user.password !== password) {
    alert("密码错误!");
  } else {
    window.location.href = "index.html";
  }
}
