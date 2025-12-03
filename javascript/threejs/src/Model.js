import { initScene } from "./common";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const { scene, camera, renderer } = initScene();

const orbitControls = new OrbitControls(camera, renderer.domElement);

const gridHelper = new THREE.GridHelper(100, 20);
scene.add(gridHelper);

document.body.appendChild(renderer.domElement);
