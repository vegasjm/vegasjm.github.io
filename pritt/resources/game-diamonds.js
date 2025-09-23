(() => {
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    let W = Math.min(576, document.body.clientWidth);
    let H = window.innerHeight - $("#page-header").height() - ($("#menu-footer").height() * 2);

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
    let best = parseInt(localStorage.getItem('diamantes_best') || '0', 10);
    bestEl.textContent = best;
    let soundOn = true;

    const diamonds = [];

    const player = PRITT_GAME.world === 1 ? {
        x: 400,
        y: 480,
        w: 90,
        h: 105,
        sprite: null
    } : PRITT_GAME.world === 2 ? {
        x: 400,
        y: 480,
        w: 90,
        h: 150,
        sprite: null
    } : {
        x: 400,
        y: 480,
        w: 93,
        h: 108,
        sprite: null
    };

    // Cargar sprites del personaje
    const sprite1Img = new Image();
    sprite1Img.src = './resources/img/world-1-player.png';
    const sprite2Img = new Image();
    sprite2Img.src = './resources/img/world-2-player.png';
    const sprite3Img = new Image();
    sprite3Img.src = './resources/img/world-3-player.png';

    // Cargar sprites de diamantes
    const diamond1Img = new Image();
    diamond1Img.src = './resources/img/diamond-1.png';
    const diamond2Img = new Image();
    diamond2Img.src = './resources/img/diamond-2.png';
    const diamond3Img = new Image();
    diamond3Img.src = './resources/img/diamond-3.png';

    window.resize = function() {
        const rect = canvas.getBoundingClientRect();
        W = Math.min(576, document.body.clientWidth);
        H = window.innerHeight - $("#page-header").height() - ($("#menu-footer").height() * 2);
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.round(W * dpr);
        canvas.height = Math.round(H * dpr);
        canvas.style.width = W + 'px';
        canvas.style.height = H + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		$('#game-phase1-stats').css('height',H+'px');
		$('#game-phase1').css('height',H+'px');
        // Asegurar que el player quede dentro del canvas
        player.y = H - player.h - 25 - 80;
        if (player.x + player.w > W) player.x = W - player.w;
    }
    window.addEventListener('resize', resize);
    resize();

    const rand = (a, b) => Math.random() * (b - a) + a;

    function drawDiamond(x, y, size, rotation) {
        if (!diamond1Img.complete || !diamond2Img.complete || !diamond3Img.complete) return;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        if (PRITT_GAME.world == 1) ctx.drawImage(diamond1Img, -size / 2, -size / 2, size, size);
        if (PRITT_GAME.world == 2) ctx.drawImage(diamond2Img, -size / 2, -size / 2, size, size);
        if (PRITT_GAME.world == 3) ctx.drawImage(diamond3Img, -size / 2, -size / 2, size, size);
        ctx.restore();
    }

    function drawPlayer() {
        if (!sprite1Img.complete || !sprite2Img.complete || !sprite3Img.complete) return;

        if (PRITT_GAME.world == 1) player.sprite = sprite1Img;
        if (PRITT_GAME.world == 2) player.sprite = sprite2Img;
        if (PRITT_GAME.world == 3) player.sprite = sprite3Img;

        if (player.sprite) {
            ctx.drawImage(player.sprite, player.x, player.y, player.w, player.h);
        } else {
            ctx.fillStyle = '#ffdd55';
            ctx.fillRect(player.x, player.y, player.w, player.h);
        }
    }

    function spawnDiamond() {
        const size = Math.round(rand(50, 50));
        const x = rand(size, W - size);
        const y = -size - rand(10, 80);
        const speed = rand(60, 160);
        const rot = rand(0, Math.PI * 2);
        diamonds.push({
            x,
            y,
            size,
            speed,
            rot,
            rotSpeed: rand(-1, 1) * 0.004
        });
    }

    const sparkles = [];

    function createSparkle(x, y, color) {
        // Crea partículas grandes (núcleo) y pequeñas (chispas)
        for (let i = 0; i < 12; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 4 + 2;
            const size = Math.random() * 6 + 4;
            sparkles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size,
                alpha: 1,
                color,
                decay: Math.random() * 0.04 + 0.03, // velocidad de desvanecimiento
                glow: Math.random() > 0.5 // mitad con glow extra
            });
        }
    }

    function drawSparkles() {
        for (let i = sparkles.length - 1; i >= 0; i--) {
            const s = sparkles[i];

            ctx.save();

            // Gradiente radial con glow
            const gradient = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size);
            gradient.addColorStop(0, `rgba(${s.color}, ${s.alpha})`);
            gradient.addColorStop(0.5, `rgba(${s.color}, ${s.alpha * 0.6})`);
            gradient.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = gradient;

            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            ctx.fill();

            // Extra glow
            if (s.glow) {
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.size * 1.5, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(${s.color}, ${s.alpha * 0.2})`;
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            ctx.restore();

            // Actualizar posición y alpha
            s.x += s.vx;
            s.y += s.vy;
            s.alpha -= s.decay;

            if (s.alpha <= 0) sparkles.splice(i, 1);
        }
    }

    function resetGame() {
        diamonds.length = 0;
        score = 0;
        lives = 5;
        spawnInterval = 800;
        difficultyTimer = 0;
        updateHUD();
        hideMessage();
        player.x = Math.max(0, Math.min(W - player.w, player.x));
    }

    window.gameOver = function() {
        running = false;
        msgTitle.textContent = 'You did it!';
		$('.game-world-item').attr("src",'./resources/img/diamond-'+PRITT_GAME.world+'.png');
		$('#game-phase1-stats').css('visibility','hidden');
        finalScore.textContent = score;
        msg.style.display = 'block';
        if (score > best) {
            best = score;
            localStorage.setItem('diamantes_best', best);
            bestEl.textContent = best;
        }
    }

    function hideMessage() {
        msg.style.display = 'none';
    }

    function updateHUD() {
        scoreEl.textContent = score;
        livesEl.textContent = lives;
        bestEl.textContent = best;
    }

    function setPlayerX(clientX) {
        const rect = canvas.getBoundingClientRect();
        let posX = clientX - rect.left - player.w / 2;
        if (posX < 0) posX = 0;
        if (posX + player.w > W) posX = W - player.w;
        player.x = posX;
    }

    let isPointerDown = false;
    canvas.addEventListener('mousedown', e => {
        isPointerDown = true;
        setPlayerX(e.clientX);
    });
    window.addEventListener('mouseup', () => {
        isPointerDown = false;
    });
    canvas.addEventListener('mousemove', e => {
        if (running && !paused && isPointerDown) setPlayerX(e.clientX);
    });

    canvas.addEventListener('touchstart', e => {
        if (e.touches && e.touches[0]) {
            isPointerDown = true;
            setPlayerX(e.touches[0].clientX);
        }
    }, {
        passive: false
    });
    canvas.addEventListener('touchmove', e => {
        if (running && !paused && e.touches && e.touches[0]) {
            e.preventDefault();
            setPlayerX(e.touches[0].clientX);
        }
    }, {
        passive: false
    });
    window.addEventListener('touchend', () => {
        isPointerDown = false;
    });

    const audioCtx = (window.AudioContext || window.webkitAudioContext) ?
        new(window.AudioContext || window.webkitAudioContext)() :
        null;

function playPing() {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;

    // 1️⃣ Pop inicial (breve y agudo)
    const popOsc = audioCtx.createOscillator();
    const popGain = audioCtx.createGain();
    popOsc.type = 'triangle';
    popOsc.frequency.setValueAtTime(1600 + Math.random() * 200, now);
    popGain.gain.setValueAtTime(0.3, now);
    popGain.gain.exponentialRampToValueAtTime(0.01, now + 0.02);
    popOsc.connect(popGain).connect(audioCtx.destination);
    popOsc.start(now);
    popOsc.stop(now + 0.02);

    // 2️⃣ Chirrido capa 1 (ruido principal de fricción)
    const bufferSize1 = audioCtx.sampleRate * 0.04; // 40ms
    const buffer1 = audioCtx.createBuffer(1, bufferSize1, audioCtx.sampleRate);
    const data1 = buffer1.getChannelData(0);
    for (let i = 0; i < bufferSize1; i++) {
        const t = i / bufferSize1;
        data1[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 3) * Math.sin(t * Math.PI * 20);
    }
    const noise1 = audioCtx.createBufferSource();
    noise1.buffer = buffer1;
    const gainNoise1 = audioCtx.createGain();
    gainNoise1.gain.setValueAtTime(0.12, now);
    gainNoise1.gain.exponentialRampToValueAtTime(0.01, now + 0.04);
    noise1.connect(gainNoise1).connect(audioCtx.destination);
    noise1.start(now);
    noise1.stop(now + 0.04);

    // 3️⃣ Chirrido capa 2 (ruido sutil complementario)
    const bufferSize2 = audioCtx.sampleRate * 0.03; // 30ms
    const buffer2 = audioCtx.createBuffer(1, bufferSize2, audioCtx.sampleRate);
    const data2 = buffer2.getChannelData(0);
    for (let i = 0; i < bufferSize2; i++) {
        const t = i / bufferSize2;
        data2[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 2.5) * Math.sin(t * Math.PI * 25);
    }
    const noise2 = audioCtx.createBufferSource();
    noise2.buffer = buffer2;
    const gainNoise2 = audioCtx.createGain();
    gainNoise2.gain.setValueAtTime(0.08, now);
    gainNoise2.gain.exponentialRampToValueAtTime(0.01, now + 0.03);
    noise2.connect(gainNoise2).connect(audioCtx.destination);
    noise2.start(now);
    noise2.stop(now + 0.03);
}


    function loop(ts) {
        if (!running || paused) {
            lastTime = ts;
            requestAnimationFrame(loop);
            return;
        }
        const dt = Math.min(40, ts - lastTime);
        lastTime = ts;
        spawnTimer += dt;
        difficultyTimer += dt;

        if (spawnTimer >= spawnInterval) {
            spawnTimer = 0;
            spawnDiamond();
        }
        if (difficultyTimer >= 6000) {
            difficultyTimer = 0;
            spawnInterval = Math.max(240, spawnInterval - 40);
        }

        for (let i = diamonds.length - 1; i >= 0; i--) {
            const d = diamonds[i];
            d.y += d.speed * (dt / 1000);
            d.rot += d.rotSpeed * dt;

            if (d.y - d.size > H) {
                diamonds.splice(i, 1);
                lives--;
                if (lives <= 0) {
                    updateHUD();
                    gameOver();
                    return;
                }
                updateHUD();
                continue;
            }

            const overlapFactor = 0.20;
            const hitboxX = player.x + player.w * overlapFactor;
            const hitboxW = player.w * (1 - 2 * overlapFactor);
            const hitboxY = player.y + player.h * overlapFactor;
            const hitboxH = player.h * (1 - 2 * overlapFactor);

            const diamondX1 = d.x - d.size * (1 - overlapFactor);
            const diamondX2 = d.x + d.size * (1 - overlapFactor);
            const diamondY1 = d.y - d.size * (1 - overlapFactor);
            const diamondY2 = d.y + d.size * (1 - overlapFactor);

            if (
                diamondX2 > hitboxX &&
                diamondX1 < hitboxX + hitboxW &&
                diamondY2 > hitboxY &&
                diamondY1 < hitboxY + hitboxH
            ) {
                const color = PRITT_GAME.world === 1 ? '255,255,255' : PRITT_GAME.world === 2 ? '0,255,255' : '255,0,255';
                createSparkle(d.x, d.y, color);
                diamonds.splice(i, 1);
                score += 1;
                if (soundOn) playPing();
                updateHUD();
                continue;
            }
        }

        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();

        for (const d of diamonds) {
            if (d.y - d.size > H || d.y + d.size < 0) continue;
            drawDiamond(d.x, d.y, d.size, d.rot);
        }

        if (player.x < 0) player.x = 0;
        if (player.x + player.w > W) player.x = W - player.w;
        drawPlayer();


        drawSparkles();

        requestAnimationFrame(loop);
    }

    startBtn.addEventListener('click', () => {
        if (running) return;
        resetGame();
        running = true;
        paused = false;
        lastTime = performance.now();
        spawnTimer = 0;
        requestAnimationFrame(loop);
    });
    pauseBtn.addEventListener('click', () => {
        if (!running) return;
        paused = !paused;
        pauseBtn.textContent = paused ? 'Reanudar' : 'Pausar';
        if (!paused) {
            lastTime = performance.now();
        }
    });
    restartBtn.addEventListener('click', () => {
		$('#game-phase1-stats').css('visibility','visible');
        updateClock(PRITT_GAME.gameDuration);
        resetGame();
        running = true;
        paused = false;
        lastTime = performance.now();
        requestAnimationFrame(loop);
    });
    toggleSoundBtn.addEventListener('click', () => {
        soundOn = !soundOn;
        toggleSoundBtn.textContent = 'Sonido: ' + (soundOn ? 'ON' : 'OFF');
    });

    for (let i = 0; i < 4; i++) spawnDiamond();
    updateHUD();
})();