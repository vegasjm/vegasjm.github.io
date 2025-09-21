    (() => {
      const canvas = document.getElementById('game');
      const ctx = canvas.getContext('2d');
      let W = Math.min(576, document.body.clientWidth);
	  let H = document.body.clientHeight-$("#page-header").height()-($("#menu-footer").height()*2);
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
        w: 80,
        h: 140,
        sprite: null
      };

      // Cargar sprite del personaje
      const sprite1Img = new Image();
      sprite1Img.src = './resources/img/world-1-player.png'; 
	  const sprite2Img = new Image();
      sprite2Img.src = './resources/img/world-2-player.png'; 
	  const sprite3Img = new Image();
      sprite3Img.src = './resources/img/world-3-player.png'; 
	  	  
	  const diamond1Img = new Image();
	  diamond1Img.src = './resources/img/diamond-1.png'; 
	  
	  const diamond2Img = new Image();
	  diamond2Img.src = './resources/img/diamond-2.png'; 
	  
	  const diamond3Img = new Image();
	  diamond3Img.src = './resources/img/diamond-3.png'; 

      function resize(){
        const rect = canvas.getBoundingClientRect();
        W = Math.max(W, rect.width);
        H = Math.max(H, rect.height);
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.round(W * dpr);
        canvas.height = Math.round(H * dpr);
        canvas.style.width = W + 'px';
        canvas.style.height = H + 'px';
        // usamos transform para dibujar en coordenadas CSS (0..W,0..H)
        ctx.setTransform(dpr,0,0,dpr,0,0);
        // aseguramos que el jugador esté dentro del canvas
        player.y = H-140-25; // dentro: no dibujar fuera
        if (player.x + player.w > W) player.x = W - player.w;
      }
      window.addEventListener('resize', resize);
      resize();

      const rand = (a,b)=>Math.random()*(b-a)+a;

      function drawDiamond(x,y,size,rotation){
		  if (!diamond1Img.complete) return; 
		  if (!diamond2Img.complete) return; 
		  if (!diamond3Img.complete) return; 
		  ctx.save();
		  ctx.translate(x, y);
		  ctx.rotate(rotation);
		  if( PRITT_GAME.world == 1) ctx.drawImage(diamond1Img, -size/2, -size/2, size, size);
		  if( PRITT_GAME.world == 2) ctx.drawImage(diamond2Img, -size/2, -size/2, size, size);
		  if( PRITT_GAME.world == 3) ctx.drawImage(diamond3Img, -size/2, -size/2, size, size);
		  ctx.restore();
      }

      function drawPlayer(){
		if (!sprite1Img.complete) return; 
		if (!sprite2Img.complete) return; 
		if (!sprite3Img.complete) return; 
		
		if( PRITT_GAME.world == 1) player.sprite = sprite1Img;
		if( PRITT_GAME.world == 2) player.sprite = sprite2Img;
		if( PRITT_GAME.world == 3) player.sprite = sprite3Img;
        // dibujamos el sprite ajustado dentro del canvas
        if(player.sprite){
          // aseguramos que la imagen completa quede dentro de H
          const drawY = player.y;
          ctx.drawImage(player.sprite, player.x, drawY, player.w, player.h);
        } else {
          ctx.fillStyle = '#ffdd55';
          ctx.fillRect(player.x, player.y, player.w, player.h);
        }
      }

      function spawnDiamond(){
        const size = Math.round(rand(50,50));
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
        player.x = Math.max(0, Math.min(W - player.w, player.x));
        player.y = player.y;
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

      // Movimiento táctil/ratón: arrastra solo en X (clamp)
      function setPlayerX(clientX){
        const rect = canvas.getBoundingClientRect();
        let posX = clientX - rect.left - player.w/2;
        if(posX < 0) posX = 0;
        if(posX + player.w > W) posX = W - player.w;
        player.x = posX;
      }

      // arrastre y mouse
      let isPointerDown = false;
      canvas.addEventListener('mousedown', e => { isPointerDown = true; setPlayerX(e.clientX); });
      window.addEventListener('mouseup', () => { isPointerDown = false; });
      canvas.addEventListener('mousemove', e => { if(running && !paused && isPointerDown) setPlayerX(e.clientX); });

      canvas.addEventListener('touchstart', e => { if(e.touches && e.touches[0]){ isPointerDown = true; setPlayerX(e.touches[0].clientX); } }, {passive:false});
      canvas.addEventListener('touchmove', e => { if(running && !paused && e.touches && e.touches[0]){ e.preventDefault(); setPlayerX(e.touches[0].clientX); } }, {passive:false});
      window.addEventListener('touchend', () => { isPointerDown = false; });

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

      // Bucle principal: actualizar posiciones -> eliminar colisiones/fuera -> limpiar TODO el buffer -> dibujar.
      function loop(ts){
        if(!running || paused){ lastTime = ts; requestAnimationFrame(loop); return; }
        const dt = Math.min(40, ts - lastTime);
        lastTime = ts;
        spawnTimer += dt;
        difficultyTimer += dt;

        if(spawnTimer >= spawnInterval){ spawnTimer = 0; spawnDiamond(); }
        if(difficultyTimer >= 6000){ difficultyTimer = 0; spawnInterval = Math.max(240, spawnInterval - 40); }

        // actualizar y eliminar/colisiones ANTES de dibujar
        for(let i = diamonds.length - 1; i >= 0; i--) {
          const d = diamonds[i];
          d.y += d.speed * (dt/1000);
          d.rot += d.rotSpeed * dt;

          // si ha salido completamente fuera por abajo, lo eliminamos sin dibujar
          if (d.y - d.size > H) {
            diamonds.splice(i,1);
            lives--;
            if(lives <= 0){ updateHUD(); gameOver(); return; }
            updateHUD();
            continue;
          }

          // colisión con player: se recoge
          if (d.x > player.x && d.x < player.x + player.w && d.y + d.size > player.y && d.y - d.size < player.y + player.h) {
            diamonds.splice(i,1);
            score += 1;
            if(soundOn) playPing();
            updateHUD();
            continue;
          }
        }

        // limpieza fiable: borramos todo el buffer de pixels (independiente de transforms)
        ctx.save();
        ctx.setTransform(1,0,0,1,0,0);
        ctx.clearRect(0,0, canvas.width, canvas.height);
        ctx.restore();

        // dibujados
        for(const d of diamonds){
          // evitamos dibujar nada fuera del canvas por seguridad
          if (d.y - d.size > H || d.y + d.size < 0) continue;
          drawDiamond(d.x,d.y,d.size,d.rot);
        }

        // aseguramos que el player esté completamente dentro
        if (player.x < 0) player.x = 0;
        if (player.x + player.w > W) player.x = W - player.w;
        player.y = player.y; // forzar a zona visible

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

      // spawn demo
      for(let i=0;i<4;i++) spawnDiamond();
      updateHUD();
    })();

	