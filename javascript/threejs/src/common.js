import "./main.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export function initScene() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  //创建场景对象
  const scene = new THREE.Scene();
  //坐标轴辅助线
  const axesHelper = new THREE.AxesHelper(1000);
  scene.add(axesHelper);

  //创建相机
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 3000);
  camera.position.set(100, 100, 100);
  camera.lookAt(0, 0, 0);

  //创建渲染器
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    //想把canvas画布上内容下载到本地，需要设置为true
    preserveDrawingBuffer: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  // 设置背景色
  renderer.setClearColor(0xffffff);
  renderer.setSize(width, height);
  renderer.render(scene, camera);

  //创建控件
  new OrbitControls(camera, renderer.domElement);

  //自适应窗口大小
  window.onresize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  };

  //渲染循环
  function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  render();
  return { scene, camera, renderer };
}
