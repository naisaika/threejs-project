import { firstCanvas } from'./firstCanvas.js';

window.onload = () => {
  firstCanvas();
};

import { initScene } from'./threejs.js';
import { clearScene } from './threejs.js';
import { aboutScene } from'./threejs.js';
import { productScene } from'./threejs.js';
import { herbScene } from'./threejs.js';
import { animateHerbSection } from'./threejs.js';

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
      const additionalOffset = 8; 
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

    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
        activeSectionIndex = index;
      }
    });

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
  
          points.forEach((point, idx) => {
            if (idx <= currentIndex) {
              point.classList.add('point--active');
            } else {
              point.classList.remove('point--active');
            }
          });
  
          updatePointCurrentPosition();
          updateLineColors();
          updateNavActiveClass(index);
        }
      }
    });
  }

  const observer = new IntersectionObserver(handleIntersection, {
    threshold: 0.5,
  });

  sections.forEach(section => observer.observe(section));
});

const sections = document.querySelectorAll('section');
const iiititle = document.querySelector('.iiititle');

const titleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const index = Array.from(sections).indexOf(entry.target);
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
  threshold: 0.5
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
const shampooPic = document.querySelector('.shampoopic');
const ooo = document.querySelector('.ooo');
const navLink = document.querySelectorAll('.navlink__list--link');
const shopLink = document.querySelectorAll('.shoplink__list--link');
const snsImg = document.querySelectorAll('.sns-img');

const naviObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      tsuchiPic.classList.add('tuchipic--show');
      tuchionlyPic.classList.add('tuchionlypic--show');
      tsuchiPic.addEventListener('animationend', function() {
        edahaPic.classList.add('edahapic--show');
        setTimeout(function() {
          shampooPic.classList.add('shampoopic--show');
        }, 1000);
        edahaPic.addEventListener('animationend', function() {
          edahaPic.style.animation = 'moveleft 1.5s forwards';
          shampooPic.style.animation = 'moveleft2 1.5s forwards';
          tuchionlyPic.style.animation = 'moveleft3 1.5s forwards';
          ooo.classList.add('ooo--show');
          navLink.forEach((link) => {
              link.style.cursor = 'pointer';
          });
          shopLink.forEach((link) => {
            link.style.cursor = 'pointer';
          });
          snsImg.forEach((link) => {
            link.style.cursor = 'pointer';
          });
        });
      });
      scrollBtn.classList.remove('scroll-btn--show');
      scrollBtn2.classList.add('pagetop-btn--show');
      isCanvasAnimating = false;
  } else {
        tsuchiPic.classList.remove('tuchipic--show');
        tuchionlyPic.classList.remove('tuchionlypic--show');
        edahaPic.classList.remove('edahapic--show'); 
        shampooPic.classList.remove('shampoopic--show');
        tuchionlyPic.style.animation = '';
        edahaPic.style.animation = '';
        shampooPic.style.animation = '';
        ooo.classList.remove('ooo--show');
        if (!isCanvasAnimating) {
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

const herbSection = document.getElementById('herb');
let animationInProgress = false;

const herbObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      herbScene('threejs-container3');
      window.addEventListener('wheel', handleMouseWheel);
      } else {
        clearScene('threejs-container3');
        window.removeEventListener('wheel', handleMouseWheel);
      }
    }
  );
}, {
  threshold: 0.5
});

if (herbSection) {
  herbObserver.observe(herbSection);
}

function handleMouseWheel(event) {
  if (animationInProgress) return;
  const content = document.querySelector('.content');
  const herbSection = document.getElementById('herb');
  const nextSection = herbSection ? herbSection.nextElementSibling : null;
  const previousSection = herbSection ? herbSection.previousElementSibling : null;

  if (event.deltaY < 0) {
    if (previousSection && previousSection.id === 'product') {
      clearScene('threejs-container3');
      content.style.scrollSnapType = 'y mandatory';
      content.style.position = 'relative';
      previousSection.scrollIntoView({ behavior: 'smooth' });
    }
  } else if (event.deltaY > 0) {
    if (nextSection && nextSection.id === 'navi') {
      content.style.scrollSnapType = 'none';
      content.style.position = 'fixed';
      animateHerbSection(() => {
        content.style.scrollSnapType = 'y mandatory';
        content.style.position = 'relative';
        scrollToNextSection();
      });
    }
  }
}

function scrollToNextSection() {
  const nextSection = herbSection.nextElementSibling;
  if (nextSection) {
    nextSection.scrollIntoView({ behavior: 'smooth' });
  }
}

const menu = document.querySelector('.menu');

scrollBtn2.addEventListener('click', function() {
  menu.classList.remove('menu-show');
  iiititle.classList.remove('pshow');
  scrollBtn2.classList.remove('pagetop-btn--show');
  naviSection.classList.add('animationtop');
  tsuchiPic.classList.remove('tuchipic--show');
  tuchionlyPic.classList.remove('tuchionlypic--show');
  edahaPic.classList.remove('edahapic--show'); 
  shampooPic.classList.remove('shampoopic--show');
  ooo.classList.remove('ooo--show');
  const returnTopTitle = document.querySelector('.returntoptitle');
  setTimeout(function() {
    returnTopTitle.classList.remove('returntoptitle');
    returnTopTitle.classList.add('returntoptitle--show');
    document.querySelector('.content').scrollTo({
      top: 0,
      behavior: 'smooth'
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

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      currentSectionIndex = Array.from(sections).indexOf(entry.target);
    }
  });
}, { threshold: 0.5 });

sections.forEach(section => sectionObserver.observe(section));

function resetClasses() {
  const top = document.querySelector('.top');
  const aaa = document.querySelector('.aaa');
  const title = document.querySelector('.title');

    top.classList.add('top--change');
    aaa.classList.add('aaa--change');
    title.classList.add('title-show');

  top.style.animation = '';
  aaa.style.animation = '';
  title.style.animation = '';
}