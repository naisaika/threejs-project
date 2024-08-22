import { firstCanvas } from'./firstCanvas.js';

window.onload = () => {
  firstCanvas();
};

import { initScene } from'./threejs.js';
import { clearScene } from './threejs.js';
import { aboutScene } from'./threejs.js';
import { productScene } from'./threejs.js';

initScene();

document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.section');
  const points = document.querySelectorAll('.point');
  const pointCurrent = document.querySelector('.point-current');
  const navItems = document.querySelectorAll('.nav');
  const lines = document.querySelectorAll('.line');
  let currentIndex = 1;

  function updatePointCurrentPosition() {
    const currentPoint = points[currentIndex];
    if (currentPoint) {
      const rect = currentPoint.getBoundingClientRect();
      const parentRect = currentPoint.parentElement.getBoundingClientRect();
      const additionalOffset = 8; // 調整するオフセット
      pointCurrent.style.top = `${rect.top - parentRect.top + additionalOffset}px`;
    }
  }

  function updateNavActiveClass(index) {
    navItems.forEach((item, idx) => {
      item.classList.toggle('active', idx === index);
    });
  }

  function updateLineColors() {
    let activeSectionIndex = 0;

    // 現在表示されているセクションのインデックスを取得
    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
        activeSectionIndex = index;
      }
    });

    // 各line要素のクラスを更新
    lines.forEach((line, index) => {
      if (index < activeSectionIndex) {
        line.classList.add('line--colored');
      } else {
        line.classList.remove('line--colored');
      }
    });
  }

  function handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const index = Array.from(sections).indexOf(entry.target);
        if (index !== -1 && index !== currentIndex) {
          currentIndex = index;
  
          // ポイントの背景色を更新
          points.forEach((point, idx) => {
            if (idx <= currentIndex) {
              point.classList.add('point--active');
            } else {
              point.classList.remove('point--active');
            }
          });
  
          updatePointCurrentPosition();
          updateLineColors();
          updateNavActiveClass(index); // ここでアクティブなナビを更新
        }
      }
    });
  }

  const observer = new IntersectionObserver(handleIntersection, {
    threshold: 0.5, // 閾値を調整
  });

  sections.forEach(section => observer.observe(section));
});

const sections = document.querySelectorAll('section');
const iiititle = document.querySelector('.iiititle');

const titleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const index = Array.from(sections).indexOf(entry.target);

            // 最初のセクション（top）の時はクラスを削除、それ以外は追加
            if (index === 0) {
                iiititle.classList.remove('pshow');
            } else {
                iiititle.classList.add('pshow');
            }
        }
    });
}, {
    threshold: 0.1
});

// 各セクションを監視
sections.forEach(section => {
    titleObserver.observe(section);
});

const firstAnime = document.getElementById('first-anime')
const topSection = document.querySelector('.top');
const aaa = document.querySelector('.aaa');
const title = document.querySelector('.title');

const topObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && firstAnime.style.display === 'none') {
      // topセクションが再び表示されたときにクラスを追加
      topSection.classList.add('top--change');
      aaa.classList.add('aaa--change');
      title.classList.add('title-show');
    } else {
      topSection.classList.remove('top--change');
      aaa.classList.remove('aaa--change');
      title.classList.remove('title-show');
    }
  });
}, {
  threshold: 0.5 // 50%が表示されたときに発火
});

if (topSection) {
  topObserver.observe(topSection);
}

let currentSection = null; // 現在のセクションを記録する変数
let aboutSceneInitialized = false; // Aboutシーンが初期化されているかを記録するフラグ
let fromTopToAbout = false; // top から about への遷移を記録するフラグ

function monitorScrollForAnimation() {
  const animationDiv = document.querySelector('.animation');
  const aboutSection = document.querySelector('#about');
  const topSection = document.querySelector('#top');
  const productSection = document.querySelector('#product');
  const elementsToHide = document.querySelectorAll('.grade, .about-img, .iii');
  const threeJsContainer = document.querySelector('#threejs-container');

  function hideElements() {
    elementsToHide.forEach(el => el.classList.add('hidden'));
    if (threeJsContainer) {
      threeJsContainer.classList.add('hidden');
    }
  }

  function showElements() {
    elementsToHide.forEach(el => el.classList.remove('hidden'));
    if (threeJsContainer) {
      threeJsContainer.classList.remove('hidden');
    }
  }

  function initializeObserver() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;

          if (sectionId === 'about' && currentSection === 'top' && !animationDiv.classList.contains('animation-start')) {
            fromTopToAbout = true; // top から about への遷移を記録
            hideElements();
            animationDiv.classList.add('animation-start');
            animationDiv.classList.remove('animation');
            animationDiv.addEventListener('animationend', function() {
              showElements();
              animationDiv.classList.remove('animation-start');
              animationDiv.classList.add('animation');
              initializeAboutObserver();
            }, { once: true });
          } else if (sectionId === 'about' && currentSection === 'product') {
            fromTopToAbout = false; // product からの遷移なのでリセット
            showElements();
            animationDiv.classList.remove('animation-start');
            animationDiv.classList.add('animation');
            initializeAboutObserver();
          }
          currentSection = sectionId;
        }
      });
    }, {
      threshold: 0.1 
    });

    observer.observe(topSection);
    observer.observe(aboutSection);
    observer.observe(productSection);
  }

  initializeObserver(); 
}

function initializeAboutObserver() {
  const aboutSection = document.querySelector('#about');
  const grade = document.querySelector('.grade');
  const aboutImg = document.querySelectorAll('.about-img');
  const iii = document.querySelector('.iii');

  const aboutObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // top から about への遷移であれば初期化する
        if (fromTopToAbout || !aboutSceneInitialized) {
          clearScene('threejs-container');
          aboutScene('threejs-container');
          aboutSceneInitialized = true;
        }

        iii.classList.add('iii--change');
        grade.classList.remove('grade--none');
        aboutImg.forEach(img => img.classList.remove('img--none'));
        entry.target.classList.add('is-animated');
      } else {
        iii.classList.remove('iii--change');
        grade.classList.add('grade--none');
        aboutImg.forEach(img => img.classList.add('img--none'));
        clearScene('threejs-container');
        aboutSceneInitialized = false; 
        entry.target.classList.remove('is-animated');
      }
    });
  }, {
    threshold: 0.5 
  });

  if (aboutSection) {
    aboutObserver.observe(aboutSection);
  }
}

// ページの読み込み時にスクロールを監視するように設定
document.addEventListener('DOMContentLoaded', monitorScrollForAnimation);

const productSection = document.querySelector('#product');
const uuu = document.querySelector('.uuu');
const productImg = document.querySelectorAll('.product-img');

const productObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      productScene('threejs-container2');
      uuu.classList.add('uuu--show');
      productImg.forEach(img => img.classList.remove('img--none'));
    } else {
      clearScene('threejs-container2');
      uuu.classList.remove('uuu--show');
      productImg.forEach(img => img.classList.add('img--none'));
    }
  });
}, {
  threshold: 0.5 
});

if (productSection) {
  productObserver.observe(productSection);
}

let isCanvasAnimating = true;

const naviSection = document.getElementById('navi');
const scrollBtn = document.querySelector('.scroll-btn');
const scrollBtn2 = document.querySelector('.pagetop-btn');
const tsuchiPic = document.querySelector('.tuchipic');
const tuchionlyPic = document.querySelector('.tuchionlypic');
const edahaPic = document.querySelector('.edahapic');

const naviObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      tsuchiPic.classList.add('tuchipic--show');
      tuchionlyPic.classList.add('tuchionlypic--show');
      tsuchiPic.addEventListener('animationend', function() {
        edahaPic.classList.add('edahapic--show');
      });
      scrollBtn.classList.remove('scroll-btn--show');
      scrollBtn2.classList.add('pagetop-btn--show');
      isCanvasAnimating = false;
    } else {
      if (!isCanvasAnimating) {
        tsuchiPic.classList.remove('tuchipic--show');
        tuchionlyPic.classList.remove('tuchionlypic--show');
        edahaPic.classList.remove('edahapic--show'); 
        scrollBtn.classList.add('scroll-btn--show');
        scrollBtn2.classList.remove('pagetop-btn--show');
      }
    }
  });
}, {
  threshold: 0.1
});

if (naviSection) {
  naviObserver.observe(naviSection);
}

// tsuchiPicのアニメーションが終了した後に他の要素のアニメーションを実行


const menu = document.querySelector('.menu');


scrollBtn2.addEventListener('click', function() {
  // アニメーションをリセット
  // navElement.style.animation = '';
  // navElement2.style.animation = '';
  // navElement3.style.animation = '';
  // navElement4.style.animation = '';
  // navElement5.style.animation = '';
  // ooo.style.animation = '';
  menu.classList.remove('menu-show');
  iiititle.classList.remove('pshow');
  scrollBtn2.classList.remove('pagetop-btn--show');

// navSectionをアニメーション開始位置に移動
  // naviSection.style.left = '0%';
  naviSection.classList.add('animationtop');
  const returnTopTitle = document.querySelector('.returntoptitle');
  setTimeout(function() {
    returnTopTitle.classList.remove('returntoptitle');
    returnTopTitle.classList.add('returntoptitle--show');
    document.querySelector('.content').scrollTo({
      top: 0,
      behavior: 'smooth' // スムーズにスクロールする
  });
  }, 1000);

  setTimeout(function() {
      returnTopTitle.classList.add('returntoptitle');
      returnTopTitle.classList.remove('returntoptitle--show');
      resetClasses();
      naviSection.classList.remove('animationtop');
      setTimeout(function() {
        menu.classList.add('menu-show');
        scrollBtn.classList.add('scroll-btn--show');
      }, 2000);
  }, 2500);
});

let currentSectionIndex = -1;

// Create an IntersectionObserver to observe sections
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Update the current section index based on visibility
      currentSectionIndex = Array.from(sections).indexOf(entry.target);
    }
  });
}, { threshold: 0.5 }); // Adjust threshold as needed

// Observe each section
sections.forEach(section => sectionObserver.observe(section));

function resetClasses() {
  const top = document.querySelector('.top');
  const aaa = document.querySelector('.aaa');
  const title = document.querySelector('.title');

    top.classList.add('top--change');
    aaa.classList.add('aaa--change');
    title.classList.add('title-show');

  // アニメーションをリセット
  top.style.animation = '';
  aaa.style.animation = '';
  title.style.animation = '';
}