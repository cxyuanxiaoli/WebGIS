const fs = require('fs');
const path = require('path');

/**
 * @function parseDependenciesToEchartsData 解析依赖项信息并生成 echarts 关系图数据
 * @param {*} dependencies
 * @param {*} name
 */
function parseDependenciesToEchartsData(dependencies, name) {
  const simpleDependencies = extractDependencies(dependencies);
  fs.writeFileSync(
    path.resolve(__dirname, './json', name + 'SimpleDependencies.json'),
    JSON.stringify(simpleDependencies)
  );
  const echartsData = dependenciesToEchartsData(simpleDependencies);
  fs.writeFileSync(
    path.resolve(__dirname, './json', name + 'EchartsData.json'),
    JSON.stringify(echartsData)
  );
}

/**
 * @function reandomColor 随机生成颜色
 * @returns {#rrggbb} 随机颜色
 */
function reandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

/**
 * @function extractDependencies 递归提取依赖项信息
 * @param {*} dependencies npm ls --all --json > dependencies.json 命令输出的依赖项信息
 * @returns  简化后依赖项信息
 */
function extractDependencies(dependencies) {
  // 辅助函数：递归提取版本信息
  function extractVersions(obj) {
    const result = {};
    if (obj.version) {
      result.version = obj.version;
    }
    if (obj.dependencies) {
      result.dependencies = {};
      for (const key in obj.dependencies) {
        result.dependencies[key] = extractVersions(obj.dependencies[key]);
      }
    }
    return result;
  }

  // 提取根对象的版本信息
  const root = {
    version: dependencies.version,
    name: dependencies.name,
    dependencies: {},
  };

  // 遍历每个依赖项
  for (const key in dependencies.dependencies) {
    root.dependencies[key] = extractVersions(dependencies.dependencies[key]);
    console.log(key, root.dependencies[key]);
  }

  return root;
}

/**
 * @function dependenciesToEchartsData 将简化后的依赖项信息转换为 echarts 关系图数据
 * @param {*} dependencies
 * @returns {object } {nodes, edges}
 */
function dependenciesToEchartsData(dependencies) {
  // 假设 dependencies.json 已经加载到变量 dependencies 中
  let id = 1;
  function parseDependencies(tree, parentName, nodes, edges) {
    if (!tree.dependencies) return;

    for (const [pkgName, pkgInfo] of Object.entries(tree.dependencies)) {
      // 添加节点
      if (!nodes.some((node) => node.name === pkgName)) {
        nodes.push({
          id: id++ + '',
          name: pkgName,
          symbolSize: 10,
          color: '#0077ffff',
        });
      }

      // 添加边
      edges.push({
        source: nodes.find((node) => node.name === parentName).id,
        target: nodes.find((node) => node.name === pkgName).id,
      });

      // 递归解析子依赖
      parseDependencies(pkgInfo, pkgName, nodes, edges);
    }
  }

  const nodes = [];
  const edges = [];
  nodes.push({
    id: '0',
    name: dependencies.name,
    color: '#ff0000ff',
  });
  parseDependencies(dependencies, dependencies.name, nodes, edges);

  const echartsData = {
    nodes: nodes,
    edges: edges,
  };

  const data = updateNodeSizeByEdges(echartsData);
  return data;
}

/**
 * @function updateNodeSizeByEdges 根据边更新节点的 size 值
 * @param {*} data
 * @returns
 */
function updateNodeSizeByEdges(data) {
  let { nodes, edges } = data;
  // 创建一个对象来存储每个节点的出现次数
  const nodeCount = {};

  // 遍历 edges 数组，统计每个节点的出现次数
  edges.forEach((edge) => {
    nodeCount[edge.source] = (nodeCount[edge.source] || 0) + 1;
    nodeCount[edge.target] = (nodeCount[edge.target] || 0) + 1;
  });

  // 更新 nodes 数组中每个节点的 size 值
  nodes.forEach((node) => {
    node.symbolSize = nodeCount[node.id] || 1; // 如果节点没有出现在 edges 中，size 设置为 1
    if (node.symbolSize < 10) {
      node.symbolSize = 10;
    }
  });

  nodes.find((node) => node.id === '0').symbolSize = 30;

  return data;
}

module.exports = {
  parseDependenciesToEchartsData,
};
