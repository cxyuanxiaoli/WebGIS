/**
 *@function randomColor 生成随机颜色
 * @param {'hex' | 'rgb'} type  十六进制或rgb
 * @returns {string}
 */
export function randomColor(type) {
  let color = "";
  if (type === "hex") {
    let letters = "0123456789ABCDEF";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    color = "#" + color;
  } else if (type === "rgb") {
    color =
      "rgb(" +
      Math.floor(Math.random() * 256) +
      "," +
      Math.floor(Math.random() * 256) +
      "," +
      Math.floor(Math.random() * 256) +
      ")";
  }
  return color;
}
