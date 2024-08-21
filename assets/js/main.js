import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

let scene, camera, renderer;

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

    function animate() {
      const currentTime = Date.now();
      const delta = currentTime - lastFrameTime;

      if (delta > 1000 / 30) { // 30FPSに制限
        lastFrameTime = currentTime;
        renderer.render(scene, camera); // レンダリング処理
      }

      if (totalRotation < maxRotation) {
        requestAnimationFrame(animate);
        gltf.scene.rotation.y += rotationSpeed;
        totalRotation += rotationSpeed;
      }
      // ライトとモデルを含めてレンダリング
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();

    let initialY = gltf.scene.position.y;
    let speed = 0.002;
    let amplitude = 3;

    function flowAnimate() {
      gltf.scene.position.y = initialY + amplitude * Math.sin(Date.now() * speed);
      
      // ライトとモデルを含めてレンダリング
      renderer.render(scene, camera);
      requestAnimationFrame(flowAnimate);
    }
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
}

initScene();

function aboutScene(containerId) {

  const models = [
    {
      url: 'assets/img/tooth.glb',
      settings: {
        scale: [40, 45, 40],
        position: [150, -140, 50],
        rotation: { x: -Math.PI / 9, y: Math.PI, z: -Math.PI / 6 },
        rotationSpeed: 0.03,
        maxRotation: Math.PI * 0.9
      }
    },
    {
      url: 'assets/img/momiji-draco.glb',
      settings: {
        scale: [25, 25, 25],
        position: [100, -50, 150],
        rotation: { x: Math.PI / 6, z: Math.PI / 8 },
      }
    },
    {
      url: 'assets/img/toothgreenkinomi.glb',
      settings: {
        scale: [2, 3, 2],
        position: [120, -10, 150],
        rotation: { x: -Math.PI / 8, y: -Math.PI / 2 },
      }
    },
    {
      url: 'assets/img/toothgreenkinomi.glb',
      settings: {
        scale: [2, 3, 2],
        position: [250, -50, 150],
        rotation: { x: Math.PI / 8, y: -Math.PI / 4 },
      }
    },
    {
      url: 'assets/img/minikinoko-draco.glb',
      settings: {
        scale: [2, 3, 2],
        position: [70, -20, 150],
        rotation: { x: Math.PI / 6, y: -Math.PI / 4 },
      }
    },
    {
      url: 'assets/img/minikinoko-draco.glb',
      settings: {
        scale: [4, 5, 4],
        position: [230, -80, 150],
        rotation: { x: -Math.PI / 6, y: Math.PI / 8 },
      }
    },
    {
      url: 'assets/img/minikinoko-draco.glb',
      settings: {
        scale: [2, 2, 2],
        position: [100, -10, 150],
        rotation: { x: -Math.PI / 6, y: Math.PI / 8 },
      }
    },
    {
      url: 'assets/img/akaimi-draco.glb',
      settings: {
        scale: [2, 2, 2],
        position: [250, -10, 150],
        rotation: { x: -Math.PI / 6, y: Math.PI / 8 },
      }
    },
    {
      url: 'assets/img/akaimi-draco.glb',
      settings: {
        scale: [2, 2, 2],
        position: [200, -120, 150],
        rotation: { x: -Math.PI / 6, y: Math.PI / 8 },
      }
    },
  ];
  renderScene(containerId, models);
}

function productScene(containerId) {

  const models = [
    {
      url: 'assets/img/tooth.glb',
      settings: {
        scale: [40, 50, 40],
        position: [200, -180, 40],
        rotation: { x: -Math.PI / 12, z: -Math.PI / 8 },
        rotationSpeed: 1.5,
        maxRotation: Math.PI * 3.8,
      }
    },
    {
      url: 'assets/img/toothpink.glb',
      settings: {
        scale: [40, 50, 40],
        position: [120, -150, 40],
        rotation: { x: -Math.PI / 25, z: Math.PI / 16 },
        rotationSpeed: 0.6,
        maxRotation: Math.PI * 1.8,
      }
    },
    {
      url: 'assets/img/momiji-draco.glb',
      settings: {
        scale: [25, 25, 25],
        position: [40, -50, 150],
        rotation: { x: Math.PI / 6, z: Math.PI / 8 },
      }
    },
    {
      url: 'assets/img/toothgreenkinomi.glb',
      settings: {
        scale: [2, 3, 2],
        position: [120, -10, 150],
        rotation: { x: -Math.PI / 8, y: -Math.PI / 2 },
      }
    },
    {
      url: 'assets/img/toothgreenkinomi.glb',
      settings: {
        scale: [2, 3, 2],
        position: [250, -50, 150],
        rotation: { x: Math.PI / 8, y: -Math.PI / 4 },
      }
    },
    {
      url: 'assets/img/minikinoko-draco.glb',
      settings: {
        scale: [2, 3, 2],
        position: [20, -20, 150],
        rotation: { x: Math.PI / 6, y: -Math.PI / 4 },
      }
    },
    {
      url: 'assets/img/minikinoko-draco.glb',
      settings: {
        scale: [4, 5, 4],
        position: [230, -80, 150],
        rotation: { x: -Math.PI / 6, y: Math.PI / 8 },
      }
    },
    {
      url: 'assets/img/minikinoko-draco.glb',
      settings: {
        scale: [2, 2, 2],
        position: [140, -10, 150],
        rotation: { x: -Math.PI / 6, y: Math.PI / 8 },
      }
    },
    {
      url: 'assets/img/akaimi-draco.glb',
      settings: {
        scale: [2, 2, 2],
        position: [250, -10, 150],
        rotation: { x: -Math.PI / 6, y: Math.PI / 8 },
      }
    },
    {
      url: 'assets/img/akaimi-draco.glb',
      settings: {
        scale: [2, 2, 2],
        position: [200, -120, 150],
        rotation: { x: -Math.PI / 6, y: Math.PI / 8 },
      }
    },
  ];
  renderScene(containerId, models);
}

  // window.addEventListener("resize", onWindowResize, false);

const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav');
const points = document.querySelectorAll('.point');
const pointCurrent = document.querySelector('.point-current');
const menu = document.querySelector('.menu');
const navHeight = document.querySelector('.menu ol').clientHeight;
const aboutSection = document.querySelector('.about');
const iii = document.querySelector('.iii');
const iiititle = document.querySelector('.iiititle');
const iiilink = document.querySelector('.iii-link');
const gradeElement = document.querySelector('.grade');
const uuu = document.querySelector('.uuu');
const eee = document.querySelector('.eee');
const imgElement3 = document.querySelector('.pic3');
const navSection = document.querySelector('.navi');
const navElement = document.querySelector('.pic4');
const navElement2 = document.querySelector('.pic5');
const navElement3 = document.querySelector('.pic6');
const navElement4 = document.querySelector('.pic7');
const navElement5 = document.querySelector('.pic8');
const ooo = document.querySelector('.ooo');
const scrollBtn = document.querySelector('.scroll-btn');
const scrollBtn2 = document.querySelector('.pagetop-btn');

let $section = $('.section');
let previousSectionIndex = 0;

const sectionOffsets = [];
const sectionHeights = [];
// const sectionVisibility = new Array(sections.length).fill(false);

function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return rect.top + window.scrollY;
}

sections.forEach(section => {
    sectionOffsets.push(getOffset(section));
    sectionHeights.push(section.offsetHeight);
});

let isAnimating = false;
let canScroll = true;

let option = {
    section : '.section',
    easing: "swing",
    scrollSpeed: 600,
    scrollbars: true,
    setHeights: true,
    updateHash: false,
    touchScroll: true,
    before: function(index, section, containerId) {
        if (index === 0) {
            canScroll = false;
            resetClasses();
        }
        if (index === 2) {
          resetProductClasses();
        } else {
          resetProductClasses();
        }
        if (index === 3) {
          resetHerbClasses();
        } else {
          resetHerbClasses();
        }
        if (index === 4) {
          resetnavClasses();
        } else {
          resetnavClasses();
        }
    },
    afterRender: function() {
        setCurrent();
    },
    after: function (index, sections) {
      updateIiititle();
  }
};

$(function(index) {
    $.scrollify(option);
    $.scrollify.update(index); // スクロール位置を更新
});

function setCurrent(index = 0) {
  $section.removeClass('is-show');

  const currentSection = $.scrollify.current();
  const isScrollingInAbout = currentSection.hasClass('about') && iii.scrollTop < iii.scrollHeight - iii.clientHeight;

  if (isScrollingInAbout) {
      // aboutセクション内のスクロール中の場合はaboutセクションにis-showクラスを固定
      currentSection.addClass('is-show');
  } else {
      // 通常の動作
      $section.eq(index).addClass('is-show');
  }
}

let isScrolling = false;

function handleCustomScroll(event) {
  if (isAnimating) {
      event.preventDefault();
      return;
  }

  const currentIndex = $.scrollify.currentIndex();
  const delta = event.wheelDelta || -event.deltaY || -event.detail;
  const isScrollingUp = delta > 0;
  const isScrollingDown = delta < 0;

    // 現在の画面の高さを取得
const viewportHeight = window.innerHeight;
// 現在のスクロール位置を取得
const scrollPositionY = window.scrollY; // または window.pageYOffset;

  // topセクションから下へのスクロール
  if (currentIndex === 0 && isScrollingDown) {
      event.preventDefault();
      startTopToAboutTransition();
      updatePointCurrentPosition();
      return;
  }

  // aboutセクション内のスクロール
  if (currentIndex === 1) {
    const scrollHeight = iii.scrollHeight;
    const clientHeight = iii.clientHeight;
    if (scrollPositionY >= viewportHeight && isScrollingDown) {
      $.scrollify.disable();
      if(scrollPositionY >= scrollHeight && isScrollingDown) {
        event.preventDefault();
        $.scrollify.enable();
        resetProductClasses();
        updateNavigationtxt(2);
        return;
      }
    }
  }
}

function handleAboutScrollEnd() {
  if (iii.scrollTop < iii.scrollHeight - iii.clientHeight) {
      $.scrollify.enable();
      $.scrollify.next(1);
  } else if (iii.scrollTop === 0) {
      $.scrollify.enable();
      $.scrollify.previous();
  }
}

function startTopToAboutTransition() {
  isAnimating = true;
  const topSection = document.querySelector('.top');
  const topElements = topSection.querySelector('.title'); // フェードアウトさせる要素を選択
  const topElements2 = topSection.querySelector('.aaa'); // フェードアウトさせる要素を選択

  $.scrollify.disable();
  topSection.style.background = 'none'; 
  topElements.style.animation = 'fadeOut 1s forwards';
  topElements2.style.animation = 'fadeOut 1s forwards';
  topSection.classList.add('animation');
  
  topElements.addEventListener('animationend', handleTopElementsFadeOutEnd);
  topElements2.addEventListener('animationend', handleTopElementsFadeOutEnd);
}

let isScrollingDown = false; // グローバル変数として定義

window.addEventListener('wheel', function(event) {
  isScrollingDown = event.deltaY > 0;
});

function handleTopElementsFadeOutEnd(event) {
  const topElements = document.querySelectorAll('.top');
  const topElements2 = document.querySelector('.aaa'); 
  const title = document.querySelector('.title');

  // すべてのフェードアウト要素のアニメーション終了リスナーを解除
  topElements.forEach(element => {
      element.removeEventListener('animationend', handleTopElementsFadeOutEnd);
  });

  const currentIndex = $.scrollify.currentIndex();
  if (currentIndex === 0 && isScrollingDown) {

     $.scrollify.enable();
      $.scrollify.move(1); 
  }

  const topSection = document.querySelector('.top');
  topSection.classList.remove('animation');
  isAnimating = false;
}

function handleTouchEnd(event) {
  const currentIndex = $.scrollify.currentIndex();
  if (currentIndex === 1 && iii.scrollTop < iii.scrollHeight - iii.clientHeight) {
    $.scrollify.disable();

    // iii 要素のスクロールイベントを監視し、必要に応じて処理を行う
    aboutSection.addEventListener('scroll', handleAboutScrollEnd);
  } else if (currentIndex === 0) {

    $.scrollify.enable();
    $.scrollify.previous();
  }
    return;
  }

// デバイスの種類に応じてイベントリスナーを設定
if ('ontouchstart' in window || navigator.maxTouchPoints) {
  window.addEventListener('touchend', handleTouchEnd, { passive: false });
} else {
  window.addEventListener('wheel', handleCustomScroll, { passive: false });
  window.addEventListener('touchmove', handleCustomScroll, { passive: false });
}

// CSSアニメーションのスタイル
const style = document.createElement('style');
style.innerHTML = `
@keyframes fadeOut {
  to {
      opacity: 0;
  }
}
`;
document.head.appendChild(style);

function updateIiititle() {
    const iiititle = document.querySelector('.iiititle');
    const currentIndex = $.scrollify.currentIndex();

    if (currentIndex > 0) {
        iiititle.classList.add('pshow');
    } else {
        iiititle.classList.remove('pshow');
    }
}

function resetClasses() {
    const top = document.querySelector('.top');
    const aaa = document.querySelector('.aaa');
    const title = document.querySelector('.title');
    const currentIndex = $.scrollify.currentIndex();

    if(currentIndex === 0) {
      top.classList.add('top--change');
      aaa.classList.add('aaa--change');
      title.classList.add('title-show');
    } else {
      top.classList.remove('top--change');
      aaa.classList.remove('aaa--change');
      title.classList.remove('title-show');
    }

    // アニメーションをリセット
    top.style.animation = '';
    aaa.style.animation = '';
    title.style.animation = '';
}

function resetProductClasses() {
  const currentIndex = $.scrollify.currentIndex();

  if(currentIndex === 2) {
    productScene('threejs-container2');
    uuu.classList.add('uuu--show');
  } else {
    clearScene('threejs-container2');
    uuu.classList.remove('uuu--show');
    uuu.style.animation = '';
  }
}

function resetHerbClasses() {
  const currentIndex = $.scrollify.currentIndex();

  if(currentIndex === 3) {
    imgElement3.style.animation = 'imgscaleherb .3s ease-in forwards';
    eee.style.display = 'block';
    eee.style.animation = 'uuuchange 1s ease forwards';
  } else {
    imgElement3.style.animation = '';
    eee.style.animation = '';
    eee.style.display = 'none';
  }
}

function resetnavClasses() {
  const currentIndex = $.scrollify.currentIndex();
  const navlinkLists = document.querySelectorAll('.navlink__list--link');
  const shoplinkLists = document.querySelectorAll('.shoplist--link');
  const snsLists = document.querySelectorAll('.sns-img');

  if(currentIndex === 4) {
    imgElement3.style.animation = 'imgscaleherbFadeout2 1s forwards';
    navElement.style.animation = 'navimgview 1s forwards';
    scrollBtn.classList.remove('scroll-btn--show');
    
    navElement.addEventListener('animationend', function handleSecondAnimationEnd() {
      navElement.removeEventListener('animationend', handleSecondAnimationEnd);

      navElement2.style.animation = 'splushextend 2s forwards';
      
      navElement2.addEventListener('animationend', function handleThirdAnimationEnd() {
        navElement2.removeEventListener('animationend', handleThirdAnimationEnd);
      
      // 3つ目のアニメーション
      navElement3.style.animation = 'sproutview 1.5s forwards';

      navElement3.addEventListener('animationend', function handleThirdAnimationEnd() {
        navElement3.removeEventListener('animationend', handleThirdAnimationEnd);

        navElement4.style.animation = 'sproutview2 1.5s forwards';

        navElement4.addEventListener('animationend', function handleThirdAnimationEnd() {
          navElement4.removeEventListener('animationend', handleThirdAnimationEnd);

          navElement5.style.animation = 'sproutview2 1.5s forwards';

        navElement5.addEventListener('animationend', function handleThirdAnimationEnd() {
          navElement5.removeEventListener('animationend', handleThirdAnimationEnd);

          navElement4.style.animation = 'moveleft2 1.5s forwards';
            navElement5.style.animation = 'moveleft 1.5s forwards';

          navSection.style.left = '50%';
          ooo.style.animation = 'oooshow 1.5s forwards';

          navlinkLists.forEach(item => item.style.cursor = 'pointer');
          shoplinkLists.forEach(item => item.style.cursor = 'pointer');
          snsLists.forEach(item => item.style.cursor = 'pointer');
          scrollBtn2.classList.add('pagetop-btn--show');

          ooo.addEventListener('animationend', function handleThirdAnimationEnd() {
            ooo.removeEventListener('animationend', handleThirdAnimationEnd);
          });
        });
        });
      });
      });
    });
  } else {
    navElement.style.animation = '';
    navElement2.style.animation = '';
    navElement3.style.animation = '';
    navElement4.style.animation = '';
    navElement5.style.animation = '';
    ooo.style.animation = '';
    scrollBtn.classList.add('scroll-btn--show');
    scrollBtn2.classList.remove('pagetop-btn--show');
    navlinkLists.forEach(item => item.style.cursor = 'default');
    shoplinkLists.forEach(item => item.style.cursor = 'default');
    snsLists.forEach(item => item.style.cursor = 'default');
  }
}

let isScrollifyEnabled = true; 

function updatePointCurrentPosition() {
  window.addEventListener('scroll', () => {
    if (!isScrollifyEnabled) return;

    let currentIndex = 0;

    // 現在のスクロール位置に基づいてセクションを判定
    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
        currentIndex = index;
      }
    });

    // point-currentを現在のポイントに移動
    const currentPoint = points[currentIndex];
    if (currentPoint) {
      const rect = currentPoint.getBoundingClientRect();
      const parentRect = currentPoint.parentElement.getBoundingClientRect();
      const additionalOffset = 8;
      pointCurrent.style.top = `${rect.top - parentRect.top + additionalOffset}px`; // 親要素のtopからの相対位置に修正

      // ナビゲーション項目のactiveクラスを更新
      navItems.forEach((item, index) => {
        item.classList.toggle('active', index === currentIndex);
      });

      // ポイントの背景色を更新
      points.forEach((point, index) => {
        if (index <= currentIndex) {
          point.classList.add('point--active');
        } else {
          point.classList.remove('point--active');
        }
      });
      updateLines(currentIndex);
    }
  }
  );
}

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function updateNavigationtxt(currentSection) {
  document.querySelectorAll('.nav').forEach((nav, index) => {
      nav.classList.toggle('active', index === currentSection);
  });

  updatePagination(currentSection);
  updateLines(currentSection);
}

function updatePagination(currentSection) {
  const activeIndex = currentSection + 1;
  document.querySelectorAll('.point-current span').forEach((span, index) => {
    span.classList.toggle('active', index === currentSection);
  });
}

function updateLines(currentSection) {
    const lines = document.querySelectorAll('.line');
    const sections = document.querySelectorAll('section');
  
    let activeSectionIndex = 0;
    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
        activeSectionIndex = index;
      }
    });
  
    lines.forEach((line, index) => {
      if (activeSectionIndex === 4) {
        line.classList.add('line--colored');
      } else {
        if (index < activeSectionIndex) {
          line.classList.add('line--colored');
        } else {
          line.classList.remove('line--colored')
        }
      }
    });
  }

const handleScroll = debounce(() => {
    const scrollPosition = window.scrollY + window.innerHeight * 0.5;
    let currentSectionIndex = 0;

    for (let i = 0; i < sectionOffsets.length; i++) {
        if (scrollPosition >= sectionOffsets[i] && scrollPosition < sectionOffsets[i] + sectionHeights[i]) {
            currentSectionIndex = i;
            break;
        }
    }

    if (currentSectionIndex !== previousSectionIndex) {
        previousSectionIndex = currentSectionIndex;
        updateNavigationtxt(currentSectionIndex);
    }

    const navItems = document.querySelectorAll('.nav');
    navItems.forEach((item, index) => {
        if (index === currentSectionIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    updatePointCurrentPosition();
    updateLines(); 
}, 10);

document.addEventListener('scroll', handleScroll);

const aboutObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // アニメーションのスタートは1度のみにする
      if (!entry.target.classList.contains('is-animated')) {
        entry.target.classList.add('is-animated');
        aboutScene('threejs-container');
      }
      iii.classList.add('iii--show');
      gradeElement.classList.add('grade--show');
      gradeElement.classList.remove('grade--none');
      iiilink.classList.add('iii-link--show');
    } else {
      iii.classList.remove('iii--show');
      gradeElement.classList.remove('grade--show');
      gradeElement.classList.add('grade--none');
      iiilink.classList.remove('iii-link--show');
      iii.style.animation = '';
      iiilink.style.animation = '';
      clearScene('threejs-container');
      entry.target.classList.remove('is-animated');
    }
  });
}, {
  threshold: 0.5 // 閾値を0.1から0.5に増やして負荷を軽減
});

if (aboutSection) {
  aboutObserver.observe(aboutSection);
}

scrollBtn2.addEventListener('click', function() {
  // アニメーションをリセット
  navElement.style.animation = '';
  navElement2.style.animation = '';
  navElement3.style.animation = '';
  navElement4.style.animation = '';
  navElement5.style.animation = '';
  ooo.style.animation = '';
  menu.classList.remove('menu-show');
  iiititle.classList.remove('pshow');
  scrollBtn2.classList.remove('pagetop-btn--show');

  // // navSectionをアニメーション開始位置に移動
  navSection.style.left = '0%';
  navSection.classList.add('animationtop');
  const returnTopTitle = document.querySelector('.returntoptitle');
  setTimeout(function() {
    returnTopTitle.classList.remove('returntoptitle');
    returnTopTitle.classList.add('returntoptitle--show');
  }, 1000);

  setTimeout(function() {
      // スクロールを一番上に戻す
      window.scrollTo({ top: 0 });
      // isScrollingDownをリセット
      isScrollingDown = false;

      returnTopTitle.classList.add('returntoptitle');
      returnTopTitle.classList.remove('returntoptitle--show');
      resetClasses();
      navSection.classList.remove('animationtop');
      setTimeout(function() {
        menu.classList.add('menu-show');
        scrollBtn.classList.add('scroll-btn--show');
      }, 2000);
  }, 2500);
});

let previousSection = null;
let nextSection = null;

function startAnimation() {
    const rand = function(min, max) {
      return Math.random() * (max - min) + min;
    }
  
    let canvas = document.getElementById('first-anime');
    let ctx = canvas.getContext('2d');
  
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  
    window.addEventListener('resize', function() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx = canvas.getContext('2d');
      ctx.globalCompositeOperation = 'lighter';
    });
  
    let backgroundColors = ['#000', '#000'];
    let colors = [
      ['#c64825', '#d59201'],
      ['#174a40', '#0a6123'],
      ['#cd2828', '#17420f']
    ];
  
    let count = 30;
    let blur = [100, 180];
    let radius = [30, 120];
  
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'lighter';
  
    let grd = ctx.createLinearGradient(0, canvas.height, canvas.width, 0);
    grd.addColorStop(0, backgroundColors[0]);
    grd.addColorStop(1, backgroundColors[1]);
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    let items = [];
  
    while (count--) {
      let thisRadius = rand(radius[0], radius[1]);
      let thisBlur = rand(blur[0], blur[1]);
      let x, y;
      let overlap = true;
  
      while (overlap) {
        overlap = false;
        x = rand(-100, canvas.width + 100);
        y = rand(-100, canvas.height + 100);
  
        for (let i = 0; i < items.length; i++) {
          let item = items[i];
          let dx = x - item.x;
          let dy = y - item.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < thisRadius + item.radius) {
            overlap = true;
            break;
          }
        }
      }
  
      let colorIndex = Math.floor(rand(0, 299) / 100);
      let colorOne = colors[colorIndex][0];
      let colorTwo = colors[colorIndex][1];
  
      ctx.beginPath();
      ctx.filter = `blur(${thisBlur}px)`;
      let grd = ctx.createLinearGradient(x - thisRadius / 2, y - thisRadius / 2, x + thisRadius, y + thisRadius);
  
      grd.addColorStop(0, colorOne);
      grd.addColorStop(1, colorTwo);
      ctx.fillStyle = grd;
      ctx.arc(x, y, thisRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
  
      let directionX = Math.round(rand(-99, 99) / 100);
      let directionY = Math.round(rand(-99, 99) / 100);
  
      items.push({
        x: x,
        y: y,
        blur: thisBlur,
        radius: thisRadius,
        initialXDirection: directionX,
        initialYDirection: directionY,
        initialBlurDirection: directionX,
        colorOne: colorOne,
        colorTwo: colorTwo,
        gradient: [x - thisRadius / 2, y - thisRadius / 2, x + thisRadius, y + thisRadius],
      });
    }
  
    let animationId;
  
    function changeCanvas(timestamp) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let adjX = 2;
      let adjY = 2;
      let adjBlur = 1;
  
      items.forEach(function(item) {
        if (item.x + (item.initialXDirection * adjX) >= canvas.width && item.initialXDirection !== 0 || item.x + (item.initialXDirection * adjX) <= 0 && item.initialXDirection !== 0) {
          item.initialXDirection = item.initialXDirection * -1;
        }
        if (item.y + (item.initialYDirection * adjY) >= canvas.height && item.initialYDirection !== 0 || item.y + (item.initialYDirection * adjY) <= 0 && item.initialYDirection !== 0) {
          item.initialYDirection = item.initialYDirection * -1;
        }
  
        if (item.blur + (item.initialBlurDirection * adjBlur) >= blur[1] && item.initialBlurDirection !== 0 || item.blur + (item.initialBlurDirection * adjBlur) <= blur[0] && item.initialBlurDirection !== 0) {
          item.initialBlurDirection *= -1;
        }
  
        item.x += (item.initialXDirection * adjX);
        item.y += (item.initialYDirection * adjY);
        item.blur += (item.initialBlurDirection * adjBlur);
        ctx.beginPath();
        ctx.filter = `blur(${item.blur}px)`;
        let grd = ctx.createLinearGradient(item.gradient[0], item.gradient[1], item.gradient[2], item.gradient[3]);
        grd.addColorStop(0, item.colorOne);
        grd.addColorStop(1, item.colorTwo);
        ctx.fillStyle = grd;
        ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
      });
      animationId = window.requestAnimationFrame(changeCanvas);
    }
  
    animationId = window.requestAnimationFrame(changeCanvas);
  
    // 3秒後にキャンバスをフェードアウトさせる
    setTimeout(function() {
      canvas.style.opacity = '0'; // フェードアウトを開始
      const top = document.querySelector('.top');
      const aaa = document.querySelector('.aaa');
      const title = document.querySelector('.title');
      const menu = document.querySelector('.menu');
      top.classList.add('top--change');
      aaa.classList.add('aaa--change');
      title.classList.add('title-show');
      menu.classList.add('menu-show');
  
  
      // さらに1秒後にアニメーションを停止し、キャンバスを非表示にする
      setTimeout(function() {
        canvas.style.display = 'none';
        scrollBtn.classList.add('scroll-btn--show');
        // アニメーションを停止する
        if (animationId) {
          window.cancelAnimationFrame(animationId);
        }
      }, 1000);
    }, 3000);
  }
  
  window.onload = startAnimation;
  
  const text = document.querySelector('.first-text');
  
  setInterval(() => {
    text.classList.add('is-active');
  }, 100);
  

