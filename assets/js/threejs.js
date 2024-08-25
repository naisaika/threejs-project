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

  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function loadModel(url, { scale, position, rotation, rotationSpeed, maxRotation }) {
  const loader = new GLTFLoader();

  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('/libs/draco/');
  loader.setDRACOLoader(dracoLoader);

  loader.load(url, function (gltf) {
    gltf.scene.scale.set(...scale);
    gltf.scene.position.set(...position);
    gltf.scene.rotation.set(rotation.x || 0, rotation.y || 0, rotation.z || 0);
    scene.add(gltf.scene);

    let totalRotation = 0;
    let initialY = gltf.scene.position.y;
    const speed = 0.001;
    const amplitude = 3;

    function animate() {
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
        scale: [48, 55, 50],
        position: [220, -80, 50],
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

function loadModels(callback) {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('/libs/draco/'); 
  loader.setDRACOLoader(dracoLoader);
  const modelPaths = [
    'assets/img/momiji.glb',
    'assets/img/toothgreenkinomi.glb',
    'assets/img/akaimi.glb',
    'assets/img/minikinoko.glb'
  ];

  const loadedModels = [];
  let loadedCount = 0;

  modelPaths.forEach((path, index) => {
    loader.load(path, (gltf) => {
      const model = gltf.scene;
      loadedModels[index] = model;
      loadedCount++;

      if (loadedCount === modelPaths.length) {
        callback(loadedModels);
      }
    }, undefined, (error) => {
      console.error(`モデルの読み込みエラー: ${path}`, error);
    });
  });
}

function herbScene(containerId) {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 500); 
  camera.lookAt(scene.position);

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = false;

  const modelPaths = [
    'assets/img/momiji.glb',
    'assets/img/toothgreenkinomi.glb',
    'assets/img/akaimi.glb',
    'assets/img/minikinoko.glb'
  ];

  const scaleFactors = {
    'momiji.glb': 5.0, 
    'toothgreenkinomi.glb': 1.0, 
    'akaimi.glb': 0.4,     
    'minikinoko.glb': 1.0    
  };

  const modelCounts = {
    'momiji.glb': 15,
    'toothgreenkinomi.glb': 15,
    'akaimi.glb': 15,
    'minikinoko.glb': 15
  };

  loadModels((models) => {

    const totalModels = models.length;
    let allModels = [];

    // モデルごとの生成位置を準備
    for (const modelPath of modelPaths) {
      const modelName = modelPath.split('/').pop();
      const count = modelCounts[modelName] || 0;
      
      for (let i = 0; i < count; i++) {
        const model = models[modelPaths.indexOf(modelPath)].clone();
        const scaleFactor = scaleFactors[modelName] || 1;
        const scale = Math.random() * 10 + 5;
        model.scale.set(scale * scaleFactor, scale * scaleFactor, scale * scaleFactor);

        // モデルの初期位置設定
        model.position.set(
          Math.random() * 400,
          Math.random() * 400 - 50,
          Math.random() * 400 - 200 
        );

        // 初期方向をランダムに設定
        model.rotation.set(
          Math.random() * 2 * Math.PI,
          Math.random() * 2 * Math.PI,
          Math.random() * 2 * Math.PI
        );

        // 初期位置を記録
        allModels.push({ model, startPosition: model.position.clone() });
        scene.add(model);
      }
    }

    let startTime = Date.now();
    function animate() {
      requestAnimationFrame(animate);

      const elapsedTime = (Date.now() - startTime) / 1000; // 秒数
      const speed = 4; // モデルの広がり速度

      allModels.forEach(({ model, startPosition }) => {
        // モデルが右上から放射状に広がる
        const t = Math.min(elapsedTime * speed, 1);
        model.position.set(
          startPosition.x + t * (startPosition.x - window.innerWidth / 4),  // 画面右上から拡散
          startPosition.y + t * (startPosition.y - window.innerHeight / 4), // 画面右上から拡散
          startPosition.z + t * (-startPosition.z)  // z方向も広がる
        );
        // 左回りに回転させる
        model.rotation.y += 0.0004; // Y軸周りに少しずつ回転
      });

      renderer.render(scene, camera);
    }
    animate();

    const container = document.getElementById(containerId);
    if (container) {
      container.appendChild(renderer.domElement);
    } else {
      console.error('Container not found');
    }
  });
}

export {scene, camera, renderer, initScene, 
    loadModel, renderScene, clearScene, aboutScene, productScene, herbScene}