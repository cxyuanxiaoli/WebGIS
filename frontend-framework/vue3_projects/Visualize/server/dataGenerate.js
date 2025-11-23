function generateBarData(length, min, max) {
  const array = [];
  for (let i = 0; i < length; i++) {
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    array.push(randomNum);
  }
  return array;
}

function generateRoseData() {
  const count = Math.floor(Math.random() * 7) + 4; // 生成4到10之间的随机整数
  const roseData = [];
  for (let i = 1; i <= count; i++) {
    const value = Math.floor(Math.random() * 31) + 10; // 生成10到40之间的随机整数
    const name = `${i}区`;
    roseData.push({ value, name });
  }
  return roseData;
}

function generateScatterData() {
  const data = [];
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 24; j++) {
      // 根据 i 和 j 的值调整生成大数的概率
      let baseMax = 3;
      let additionalMax = 0;
      // i 越大，additionalMax 增加
      additionalMax += i * 2;
      // j 大于 12 时，additionalMax 增加
      if (j > 12) {
        additionalMax += 2;
      }
      const value = Math.floor(Math.random() * (baseMax + additionalMax));
      data.push([i, j, value]);
    }
  }
  return data;
}

module.exports = {
  generateBarData,
  generateRoseData,
  generateScatterData,
};
