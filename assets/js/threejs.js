'use strict';

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
  renderer.shadowMap.enabled = false;

  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function loadModel(url, { scale, position, rotation, rotationSpeed, maxRotation, moveDistance }) {
  const loader = new GLTFLoader();

  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('/libs/draco/');
  loader.setDRACOLoader(dracoLoader);

  loader.load(url, function (gltf) {
    gltf.scene.scale.set(...scale);
    gltf.scene.position.set(...position);
    gltf.scene.rotation.set(rotation.x || 0, rotation.y || 0, rotation.z || 0);
    scene.add(gltf.scene);

    const startTime = Date.now();
    const duration = 3800; // アニメーションの総時間 (ミリ秒)
    const initialY = gltf.scene.position.y;
    const amplitude = 10;
    const speed = 0.002;

    function animate() {
      const elapsedTime = Date.now() - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      // 回転の計算
      gltf.scene.rotation.y += rotationSpeed;
      if (gltf.scene.rotation.y >= maxRotation) {
        gltf.scene.rotation.y = maxRotation;
      }

      // 位置の計算 (振動を加える)
      const currentY = initialY + (moveDistance * progress) + amplitude * Math.sin(Date.now() * speed);
      gltf.scene.position.y = currentY;

      // 描画とアニメーションの続行
      renderer.render(scene, camera);
      if (progress < 1) {
        animationFrames.push(requestAnimationFrame(animate));
      } else {
        // 回転が終了した後の振動アニメーション
          flowAnimate();
      }
    }
    
    function flowAnimate() {
      gltf.scene.position.y = initialY + (moveDistance * Math.min(1, (Date.now() - startTime) / duration)) + amplitude * Math.sin(Date.now() * speed);
      renderer.render(scene, camera);
      animationFrames.push(requestAnimationFrame(flowAnimate));
    }

    animate();

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

  animationRunning = false; 
}

initScene();

function aboutScene(containerId) {

  const models = [
    {
      url: 'assets/img/tooth.glb',
      settings: {
        scale: [48, 55, 50],
        position: [220, -160, 50],
        rotation: { x: -Math.PI / 12, y: Math.PI, z: -Math.PI / 8 },
        rotationSpeed: 0.06,
        maxRotation: Math.PI * 3.9,
        moveSpeed: 0.3, 
        moveDistance: 120, // 移動する距離
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
        scale: [35, 42, 35],
        position: [200, -200, 40],
        rotation: { x: -Math.PI / 12, z: -Math.PI / 10 },
        rotationSpeed: 0.05,
        maxRotation: Math.PI * 1.9,
        moveSpeed: 0.3, 
        moveDistance: 100, // 移動する距離
      }
    },
    {
      url: 'assets/img/toothpink.glb',
      settings: {
        scale: [38, 42, 38],
        position: [120, -220, 40],
        rotation: { x: -Math.PI / 12, z: Math.PI / 20 },
        rotationSpeed: 0.05,
        maxRotation: Math.PI * 1.9,
        moveSpeed: 0.3, 
        moveDistance: 80, // 移動する距離
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

let allModels = [];
let animationRunning = false;

function herbScene(containerId) {
  animationRunning = true;

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xffffff, 450, 800);
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
    'toothgreenkinomi.glb': 1.5, 
    'akaimi.glb': 0.5,     
    'minikinoko.glb': 1.2    
  };

  const modelCounts = {
    'momiji.glb': 15,
    'toothgreenkinomi.glb': 15,
    'akaimi.glb': 15,
    'minikinoko.glb': 15
  };

  loadModels((models) => {

    allModels = [];

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
          Math.random() * 400 + 50,
          Math.random() * 400 - 50,
          Math.random() * 1000 - 400
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

      if (!animationRunning) return;
      requestAnimationFrame(animate);

      const elapsedTime = (Date.now() - startTime) / 1000; // 秒数
      const speed = 4; // モデルの広がり速度

      allModels.forEach(({ model, startPosition }) => {
        // モデルが右上から放射状に広がる
        const t = Math.min(elapsedTime * speed, 1);

          model.position.set(
            startPosition.x + t * (startPosition.x - window.innerWidth / 4),
            startPosition.y + t * (startPosition.y - window.innerHeight / 4),
            startPosition.z + t * (-startPosition.z)
          );
        // 左回りに回転させる
        model.rotation.y += 0.001; // Y軸周りに少しずつ回転
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

function animateHerbSection(callback) {
  if (allModels.length === 0) {
    console.error('アニメーション用のモデルが見つかりません。');
    return;
  }

  let animationStartTime = Date.now();
  let animationDuration = 2000; // アニメーションの所要時間（ミリ秒）
  let moveToCenterDuration = 2000; // 3Dモデルを中心に移動させるアニメーションの所要時間
  let moveToCenterStartTime = null; // 中心に移動を開始する時間
  let moveToOuterStartTime = null; // 外側に移動を開始する時間
  let moveToOuterDuration = 2000; // 外側に移動させるアニメーションの所要時間
  fadeOut = false; // 必ずリセット
  animationRunning = true; // アニメーションが実行中かどうか

  const originalFog = scene.fog;
  scene.fog = null; // Disable fog

  allModels.forEach(({ model, startPosition }) => {
    model.position.copy(startPosition);
  });

  function animate() {
    if (!animationRunning) {
      scene.fog = originalFog;
      return;
    }
    const elapsedTime = (Date.now() - animationStartTime) / animationDuration;

    // 3Dモデルを画面の中央に移動させるアニメーション
    if (elapsedTime < 1) {
      allModels.forEach(({ model, startPosition }) => {
        model.position.set(
          (startPosition.x - 150) * (1 - elapsedTime),
          (startPosition.y - 250) * (1 - elapsedTime),
          startPosition.z * (1 - elapsedTime)
        );
      });

    renderer.render(scene, camera);
    } else if (elapsedTime >= 1 && !moveToOuterStartTime) {
      // 中心に移動が完了したら、外側に移動するアニメーションを開始
      moveToCenterStartTime = Date.now();
      drawParticles();
      moveToOuterStartTime = Date.now(); // 外側に移動を開始する時間を記録
    } else if (moveToOuterStartTime) {
      // 外側に移動するアニメーション
      const moveToOuterElapsedTime = (Date.now() - moveToOuterStartTime) / moveToOuterDuration;
  
      if (moveToOuterElapsedTime >= 1) {
        // アニメーションが完了したら最終位置に設定
        allModels.forEach(({ model }) => {
          model.position.set(
            (model.position.x - centerX) * (1 + moveToOuterElapsedTime) + centerX - 500,
            (model.position.y - centerY) * (1 + moveToOuterElapsedTime) + centerY - 500,
            model.position.z
          );
        });
        renderer.render(scene, camera);
        callback();
        animationRunning = false;
        return;
      }

      allModels.forEach(({ model }) => {
        model.traverse((child) => {
          if (child.isMesh) {
            child.material.transparent = true;
            child.material.opacity = 0;
          }
        });
      });

    renderer.render(scene, camera);
  }

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
}

const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const lines = [];
const numParticles = 2000; 
const numLines = 100; // ランダムに描画する線の数
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const maxSpeed = 100; 
const minSpeed = 10; 
const acceleration = 0.05;
let fadedParticles = 0; // 消えた粒子のカウント
let fadeOut = false; // フェードアウトを開始するかどうか
let lineAlpha = 0.5;

// パーティクルの作成
function initializeParticles() {
  particles.length = 0; // パーティクル配列をリセット
  for (let i = 0; i < numParticles; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const speed = Math.random() * (maxSpeed - minSpeed) + minSpeed;
    const colors = ['rgb(211, 110, 76)', 'rgb(145, 89, 71)'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const radius = Math.random() * 5; // 粒子の大きさをランダムにする
    const distance = Math.random() * 250; // 中心からランダムな距離（例: 半径50px以内）

    particles.push({
      x : centerX + Math.cos(angle) * distance, // 中心から少しずらした位置
      y : centerY + Math.sin(angle) * distance, // 中心から少しずらした位置
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: radius, 
      color: color,  
      speed: speed
    });
  }
}

// ランダムな線の作成
function initializeLines() {
  lines.length = 0; // 線配列をリセット
  for (let i = 0; i < numLines; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const length = Math.random() * canvas.width * 0.5; // ランダムな長さ
    const x1 = centerX;
    const y1 = centerY;
    const x2 = centerX + Math.cos(angle) * length;
    const y2 = centerY + Math.sin(angle) * length;

    lines.push({
      x1: x1,
      y1: y1,
      x2: x2,
      y2: y2,
      alpha: 0.5
    });
  }
}

// パーティクルの描画
function drawParticles() {
  initializeParticles();
  initializeLines();

  fadedParticles = 0; // フェードアウトカウントをリセット
  fadeOut = false; 
  lineAlpha = 0.5; // ラインの透明度をリセット
  
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ランダムな線の描画（先に描画）
    drawRadiatingLines();

    // 粒子の描画（後に描画）
    particles.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, false);
      ctx.shadowBlur = 30;
      ctx.shadowColor = p.color;
      ctx.fillStyle = p.color;
      ctx.globalAlpha = lineAlpha; // パーティクルの透明度を設定
      ctx.fill();
      ctx.closePath();

      // 粒子の移動
      p.vx += Math.cos(Math.atan2(p.vy, p.vx)) * acceleration;
      p.vy += Math.sin(Math.atan2(p.vy, p.vx)) * acceleration;
      p.x += p.vx;
      p.y += p.vy;

      // 画面外に出た粒子をカウント
      if (p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
        p.radius = 0;
        fadedParticles++; // 消えた粒子をカウント
      }
    });

    // 進行度が80%を超えたらフェードアウトを開始
    if (!fadeOut && fadedParticles >= numParticles * 0.8) {
      fadeOut = true;
    }

    // フェードアウト処理
    if (fadeOut) {
      lineAlpha -= 0.01; // Alpha値の減少量を調整してフェードアウト速度を早める
      if (lineAlpha <= 0) {
        lineAlpha = 0; // 完全に透明になったら止める
        ctx.clearRect(0, 0, canvas.width, canvas.height); // キャンバスをクリア
        return; // アニメーションを終了
      }
    }

    requestAnimationFrame(draw);
  }

  draw();
}

// ランダムな放射線状の線の描画
function drawRadiatingLines() {
    ctx.save();
    ctx.globalAlpha = lineAlpha; // Alpha値を適用
    ctx.strokeStyle = 'rgba(223, 191, 153, 0.8)'; // 色を設定
    ctx.lineWidth = 5; // 線の太さを設定
    ctx.shadowBlur = 50; // ぼかし効果を設定
    ctx.shadowColor = 'rgba(223, 191, 153, 0.8)'; // ぼかしの色を設定

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        ctx.beginPath();
        ctx.moveTo(line.x1, line.y1);
        ctx.lineTo(line.x2, line.y2);
        ctx.stroke();
    }

    ctx.restore();

    // フェードアウトを行う
    if (fadeOut) {
      // 3Dモデルと同じように、中心から外へ広がる動きをつける
      allModels.forEach(({ model }) => {
        model.position.x += model.vx * acceleration;
        model.position.y += model.vy * acceleration;
        model.position.z += model.vz * acceleration;
      });
      renderer.render(scene, camera);

        lineAlpha -= 0.05; // Alpha値の減少量を調整してフェードアウト速度を早める
        if (lineAlpha <= 0) {
            lineAlpha = 0; // 完全に透明になったら止める
        }
    }
}

// パーティクルのリセット
function clearParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.length = 0;
  lines.length = 0;
  fadedParticles = 0; 
  fadeOut = false; 
  lineAlpha = 0.5; 
}

export {initScene, clearScene, aboutScene, productScene, herbScene,
  animateHerbSection, clearParticles}