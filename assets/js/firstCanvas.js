'use strict';

export function firstCanvas() {
    const rand = function(min, max) {
      return Math.random() * (max - min) + min;
    }
  
    let canvas = document.getElementById('first-anime');
    let ctx = canvas.getContext('2d');
  
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // スクロールを無効にする関数
    function disableScroll(event) {
        event.preventDefault();
    }
    // スクロール無効化を設定
    window.addEventListener('scroll', disableScroll, { passive: false });
    window.addEventListener('wheel', disableScroll, { passive: false });
  
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
    let isCanvasAnimating = true;
  
    // 3秒後にキャンバスをフェードアウトさせる
    setTimeout(function() {
      window.addEventListener('scroll', disableScroll, { passive: false });
      window.addEventListener('wheel', disableScroll, { passive: false });
      canvas.style.opacity = '0'; // フェードアウトを開始
      const top = document.querySelector('.top');
      const aaa = document.querySelector('.aaa');
      const title = document.querySelector('.title');
      const menu = document.querySelector('.menu');
      top.classList.add('top--change');
      aaa.classList.add('aaa--change');
      title.classList.add('title-show');
      menu.classList.add('menu-show');
      const scrollBtn = document.querySelector('.scroll-btn');

      // さらに1秒後にアニメーションを停止し、キャンバスを非表示にする
      setTimeout(function() {
          canvas.style.display = 'none';
          scrollBtn.classList.add('scroll-btn--show');
          // アニメーションを停止する
          if (animationId) {
              window.cancelAnimationFrame(animationId);
          }
          isCanvasAnimating = false; // アニメーション終了時にフラグを更新

      }, 1000);
      top.addEventListener('animationend', () => {
        window.removeEventListener('scroll', disableScroll);
        window.removeEventListener('wheel', disableScroll);
      });
    }, 3000);
  }
  
  const text = document.querySelector('.first-text');
  
  setInterval(() => {
    text.classList.add('is-active');
  }, 100);

  

