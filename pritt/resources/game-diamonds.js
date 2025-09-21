(() => {
      const canvas = document.getElementById('game');
      const ctx = canvas.getContext('2d');
      let W = 576, H = 500;
      const scoreEl = document.getElementById('score');
      const livesEl = document.getElementById('lives');
      const bestEl = document.getElementById('best');
      const msg = document.getElementById('message');
      const msgTitle = document.getElementById('msg-title');
      const finalScore = document.getElementById('final-score');

      const startBtn = document.getElementById('btn-start-game-phase1');
      const pauseBtn = document.getElementById('pause');
      const restartBtn = document.getElementById('restart');
      const toggleSoundBtn = document.getElementById('toggle-sound');

      let running = false;
      let paused = false;
      let lastTime = 0;
      let spawnTimer = 0;
      let spawnInterval = 800;
      let difficultyTimer = 0;
      let score = 0;
      let lives = 5;
      let best = parseInt(localStorage.getItem('diamantes_best')||'0',10);
      bestEl.textContent = best;
      let soundOn = true;

      const diamonds = [];

      const player = {
        x: 400,
        y: 480,
        w: 60,
        h: 60,
        sprite: null
      };

      // Cargar sprite del personaje
      const spriteImg = new Image();
      spriteImg.src = './resources/img/world-2/world-2-character.png'; // ejemplo
      spriteImg.onload = () => { player.sprite = spriteImg; };

      function resize(){
        const rect = canvas.getBoundingClientRect();
        W = Math.max(576, rect.width);
        H = Math.max(500, rect.height);
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.round(W * dpr);
        canvas.height = Math.round(H * dpr);
        canvas.style.width = W + 'px';
        canvas.style.height = H + 'px';
        ctx.setTransform(dpr,0,0,dpr,0,0);
        player.y = H - 80;
      }
      window.addEventListener('resize', resize);
      resize();

      const rand = (a,b)=>Math.random()*(b-a)+a;

      function drawDiamond(x,y,size,rotation){
        ctx.save();
        ctx.translate(x,y);
        ctx.rotate(rotation);
        ctx.beginPath();
        ctx.moveTo(0,-size);
        ctx.lineTo(size*0.6,0);
        ctx.lineTo(0,size);
        ctx.lineTo(-size*0.6,0);
        ctx.closePath();
        const g = ctx.createLinearGradient(-size,-size,size,size);
        g.addColorStop(0, '#ffffff');
        g.addColorStop(0.25, '#abe9ff');
        g.addColorStop(0.6, '#7fd3ff');
        g.addColorStop(1,'#4ab0e6');
        ctx.fillStyle = g;
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.55)';
        ctx.lineWidth = Math.max(1, size*0.06);
        ctx.stroke();
        ctx.restore();
      }

      function drawPlayer(){
        if(player.sprite){
          ctx.drawImage(player.sprite, player.x, player.y, player.w, player.h);
        } else {
          ctx.fillStyle = '#ffdd55';
          ctx.fillRect(player.x, player.y, player.w, player.h);
        }
      }

      function spawnDiamond(){
        const size = Math.round(rand(16,36));
        const x = rand(size, W-size);
        const y = -size - rand(10,80);
        const speed = rand(60, 160);
        const rot = rand(0,Math.PI*2);
        diamonds.push({x,y,size,speed,rot,rotSpeed:rand(-1,1)*0.004});
      }

      function resetGame(){
        diamonds.length = 0;
        score = 0;
        lives = 5;
        spawnInterval = 800;
        difficultyTimer = 0;
        updateHUD();
        hideMessage();
        player.x = W/2 - player.w/2;
      }

      function gameOver(){
        running = false;
        msgTitle.textContent = '¡Fin del juego!';
        finalScore.textContent = score;
        msg.style.display = 'block';
        if(score > best){ best = score; localStorage.setItem('diamantes_best',best); bestEl.textContent = best; }
      }

      function hideMessage(){ msg.style.display = 'none'; }

      function updateHUD(){
        scoreEl.textContent = score;
        livesEl.textContent = lives;
        bestEl.textContent = best;
      }

      // Movimiento táctil/ratón
      function setPlayerX(clientX){
        const rect = canvas.getBoundingClientRect();
        let posX = clientX - rect.left - player.w/2;
        if(posX < 0) posX = 0;
        if(posX + player.w > W) posX = W - player.w;
        player.x = posX;
      }

      canvas.addEventListener('mousemove', e => {
        if(running && !paused) setPlayerX(e.clientX);
      });
      canvas.addEventListener('touchmove', e => {
        if(running && !paused){
          e.preventDefault();
          setPlayerX(e.touches[0].clientX);
        }
      }, {passive:false});

      const audioCtx = (window.AudioContext||window.webkitAudioContext) ? new (window.AudioContext||window.webkitAudioContext)() : null;
      function playPing(){
        if(!audioCtx) return;
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.type = 'sine'; o.frequency.value = 880 + Math.random()*400;
        g.gain.value = 0.08;
        o.connect(g); g.connect(audioCtx.destination);
        o.start(); o.stop(audioCtx.currentTime + 0.08);
      }

      function loop(ts){
        if(!running || paused){ lastTime = ts; requestAnimationFrame(loop); return; }
        const dt = Math.min(40, ts - lastTime);
        lastTime = ts;
        spawnTimer += dt;
        difficultyTimer += dt;

        if(spawnTimer >= spawnInterval){ spawnTimer = 0; spawnDiamond(); }
        if(difficultyTimer >= 6000){ difficultyTimer = 0; spawnInterval = Math.max(240, spawnInterval - 40); }

        for(let i = diamonds.length-1; i>=0; i--){
          const d = diamonds[i];
          d.y += d.speed * (dt/1000);
          d.rot += d.rotSpeed * dt;
          if(d.y - d.size > H){
            diamonds.splice(i,1);
            lives--;
            if(lives <= 0){ updateHUD(); gameOver(); return requestAnimationFrame(loop); }
            updateHUD();
          } else {
            if(d.x > player.x && d.x < player.x + player.w && d.y + d.size > player.y && d.y - d.size < player.y + player.h){
              diamonds.splice(i,1);
              score += Math.round(10 + d.size/2);
              if(soundOn) playPing();
              updateHUD();
            }
          }
        }

        ctx.clearRect(0,0,W,H);
        for(const d of diamonds){ drawDiamond(d.x,d.y,d.size,d.rot); }
        drawPlayer();

        requestAnimationFrame(loop);
      }

      startBtn.addEventListener('click', ()=>{
        if(running) return;
        resetGame();
        running = true;
        paused = false;
        lastTime = performance.now();
        spawnTimer = 0;
        requestAnimationFrame(loop);
      });
      pauseBtn.addEventListener('click', ()=>{
        if(!running) return;
        paused = !paused;
        pauseBtn.textContent = paused ? 'Reanudar' : 'Pausar';
        if(!paused) { lastTime = performance.now(); }
      });
      restartBtn.addEventListener('click', ()=>{
        resetGame();
        running = true; paused = false; lastTime = performance.now(); requestAnimationFrame(loop);
      });
      toggleSoundBtn.addEventListener('click', ()=>{
        soundOn = !soundOn; toggleSoundBtn.textContent = 'Sonido: ' + (soundOn ? 'ON' : 'OFF');
      });

      updateHUD();
    })();