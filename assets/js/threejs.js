import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

let scene, camera, renderer;
let animationFrames = [];

function initScene() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 500);
  camera.lookAt(scene.position);

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
}

function loadModel(url, { scale, position, rotation, rotationSpeed, maxRotation }) {
  const loader = new GLTFLoader();

  // DRACOLoader の設定
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('/libs/draco/'); // Draco デコーダーのパスを設定
  loader.setDRACOLoader(dracoLoader);

  loader.load(url, function (gltf) {
    gltf.scene.scale.set(...scale);
    gltf.scene.position.set(...position);
    gltf.scene.rotation.set(rotation.x || 0, rotation.y || 0, rotation.z || 0);
    scene.add(gltf.scene);

    let totalRotation = 0;
    let lastFrameTime = Date.now();
    let initialY = gltf.scene.position.y;
    const speed = 0.001;
    const amplitude = 3;

    function animate() {
      const currentTime = Date.now();
      const delta = currentTime - lastFrameTime;
    
      if (totalRotation < maxRotation) {
        gltf.scene.rotation.y += rotationSpeed;
        totalRotation += rotationSpeed;
        animationFrames.push(requestAnimationFrame(animate));
      }
    }
    
    function flowAnimate() {
      gltf.scene.position.y = initialY + amplitude * Math.sin(Date.now() * speed);
      renderer.render(scene, camera);
      animationFrames.push(requestAnimationFrame(flowAnimate));
    }

    animate();
    flowAnimate();

  }, undefined, function (error) {
    console.error(error);
  });

}

function renderScene(containerId, models) {
  clearScene(containerId);

  const container = document.getElementById(containerId);
  if (container) {
    container.appendChild(renderer.domElement);
  }

  models.forEach(model => {
    loadModel(model.url, model.settings);
  });

  // 全体のシーンをレンダリング
  renderer.render(scene, camera);
}

function clearScene(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    const canvases = container.getElementsByTagName('canvas');
    while (canvases.length > 0) {
      container.removeChild(canvases[0]);
    }
  }

  if (scene) {
    while (scene.children.length > 0) {
      const child = scene.children[0];
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(material => material.dispose());
        } else {
          child.material.dispose();
        }
      }
      scene.remove(child);
    }
  }

  if (renderer) {
    renderer.dispose();
  }

  animationFrames.forEach(id => cancelAnimationFrame(id));
  animationFrames = [];
}

initScene();

function aboutScene(containerId) {

  const models = [
    {
      url: 'assets/img/tooth.glb',
      settings: {
        scale: [38, 45, 40],
        position: [150, -140, 50],
        rotation: { x: -Math.PI / 12, y: Math.PI, z: -Math.PI / 8 },
        rotationSpeed: 0.03,
        maxRotation: Math.PI * 0.9,
      }
    },
  ];
  renderScene(containerId, models);
}

function productScene(containerId) {

  const models = [
    {
      url: 'assets/img/tooth2.glb',
      settings: {
        scale: [50, 60, 50],
        position: [260, -100, 40],
        rotation: { x: -Math.PI / 12, z: -Math.PI / 10 },
        rotationSpeed: 0.1,
        maxRotation: Math.PI * 1.9,
      }
    },
    {
      url: 'assets/img/toothpink.glb',
      settings: {
        scale: [40, 45, 40],
        position: [120, -120, 40],
        rotation: { x: -Math.PI / 12, z: Math.PI / 20 },
        rotationSpeed: 0.1,
        maxRotation: Math.PI * 1.9,
      }
    },
  ];
  renderScene(containerId, models);
}

export {scene, camera, renderer, initScene, 
    loadModel, renderScene, clearScene, aboutScene, productScene}