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

	let difficultyLevel = 0; // 0 = fácil, irá aumentando poco a poco
    let running = false;
    let paused = false;
    let lastTime = 0;
    let spawnTimer = 0;
    let spawnInterval = 1200;
    let difficultyTimer = 0;
    let score = 0;
    let lives = 500;
    let best = parseInt(localStorage.getItem('diamantes_best') || '0', 10);
    bestEl.textContent = best;
    let soundOn = true;
	let damageFlash = 0;

    const diamonds = [];
	const badObjects = [];

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
	
	// Sprite de objeto malo
	const badItemImg = new Image();
	badItemImg.src = './resources/img/bad-item.png'; // ⚠️ cambia la ruta según tu imagen real

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
        $('#game-phase1-stats').css('height', H + 'px');
        $('#game-phase1').css('height', H + 'px');
        // Asegurar que el player quede dentro del canvas
        player.y = H - player.h - 50;
        if (player.x + player.w > W) player.x = W - player.w;
    }
    window.addEventListener('resize', resize);
    resize();

    const rand = (a, b) => Math.random() * (b - a) + a;

	function drawDiamond(x, y, size, rotation, isBad = false) {
		ctx.save();
		ctx.translate(x, y);
		ctx.rotate(rotation);

		if (isBad) {
			ctx.drawImage(badItemImg, -size / 2, -size / 2, size, size);
		} else {
			if (PRITT_GAME.world == 1) ctx.drawImage(diamond1Img, -size / 2, -size / 2, size, size);
			if (PRITT_GAME.world == 2) ctx.drawImage(diamond2Img, -size / 2, -size / 2, size, size);
			if (PRITT_GAME.world == 3) ctx.drawImage(diamond3Img, -size / 2, -size / 2, size, size);
		}

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
		const baseSpeed = 100 + difficultyLevel * 10;
		const speed = rand(baseSpeed, baseSpeed + 120);
		const rot = rand(0, Math.PI * 2);

		const isBad = Math.random() < 0.2; // 20% de probabilidad

		diamonds.push({
			x,
			y,
			size,
			speed,
			rot,
			rotSpeed: rand(-1, 1) * 0.004,
			isBad
		});
	}

	
	function spawnBadObject() {
		const size = Math.round(rand(40, 60));
		const x = rand(size, W - size);
		const y = -size - rand(10, 80);
		const baseSpeed = 120 + difficultyLevel * 15;
		const speed = rand(baseSpeed, baseSpeed + 140);
		const rot = rand(0, Math.PI * 2);

		badObjects.push({
			x,
			y,
			size,
			speed,
			rot,
			rotSpeed: rand(-1, 1) * 0.006
		});
	}
	
	function drawBadObject(x, y, size, rotation) {
		ctx.save();
		ctx.translate(x, y);
		ctx.rotate(rotation);
		ctx.fillStyle = 'rgba(80, 0, 0, 0.9)';
		ctx.strokeStyle = 'rgba(255, 60, 60, 0.8)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(0, -size / 2);
		for (let i = 1; i < 6; i++) {
			const angle = (i * Math.PI * 2) / 5;
			const radius = size * (i % 2 === 0 ? 0.5 : 1);
			ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
		}
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		ctx.restore();
	}

	const sparkles = [];
	const flashes = [];

	function createSparkle(x, y) {
		const colors = [
			'255,255,230', // blanco cálido
			'200,220,255', // azul hielo
			'255,245,180'  // amarillo luz suave
		];

		// Chispas
		for (let i = 0; i < 26; i++) {
			const angle = Math.random() * Math.PI * 2;
			const speed = Math.random() * 2.5 + 0.5; // más lento
			const length = Math.random() * 25 + 10;
			sparkles.push({
				x, y,
				vx: Math.cos(angle) * speed,
				vy: Math.sin(angle) * speed,
				length,
				life: 1,
				decay: 0.015 + Math.random() * 0.015, // dura más
				color: colors[Math.floor(Math.random() * colors.length)],
				width: Math.random() * 2 + 0.6
			});
		}

		// Flash central
		flashes.push({
			x, y,
			radius: 0,
			maxRadius: 40 + Math.random() * 20,
			alpha: 0.6,
			decay: 0.02
		});
	}
	
	function createEvilEffect(x, y) {
		// Flash oscuro principal
		flashes.push({
			x, y,
			radius: 0,
			maxRadius: 60 + Math.random() * 20,
			alpha: 0.5,
			decay: 0.03,
			type: 'evil'
		});

		// Chispas rojas oscuras que se expanden poco
		for (let i = 0; i < 18; i++) {
			const angle = Math.random() * Math.PI * 2;
			const speed = Math.random() * 2 + 0.5;
			const length = Math.random() * 20 + 8;
			sparkles.push({
				x, y,
				vx: Math.cos(angle) * speed,
				vy: Math.sin(angle) * speed,
				length,
				life: 1,
				decay: 0.02 + Math.random() * 0.01,
				color: Math.random() < 0.5 ? '180,0,200' : '255,30,30',
				width: Math.random() * 2 + 0.8
			});
		}
	}


	function drawSparkles() {
		ctx.save();
		ctx.globalCompositeOperation = 'lighter';

		// Flash radial
		for (let i = flashes.length - 1; i >= 0; i--) {
			const f = flashes[i];
			const gradient = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.radius);
			if (f.type === 'evil') {
				gradient.addColorStop(0, `rgba(120,0,200,${f.alpha})`);
				gradient.addColorStop(0.5, `rgba(255,30,30,${f.alpha * 0.5})`);
				gradient.addColorStop(1, `rgba(0,0,0,0)`);
			} else {
				gradient.addColorStop(0, `rgba(255,255,230,${f.alpha})`);
				gradient.addColorStop(0.4, `rgba(255,245,180,${f.alpha * 0.6})`);
				gradient.addColorStop(1, `rgba(200,220,255,0)`);
			}

			ctx.fillStyle = gradient;
			ctx.beginPath();
			ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
			ctx.fill();

			f.radius += 3;
			f.alpha -= f.decay;
			if (f.alpha <= 0) flashes.splice(i, 1);
		}

		// Rayos de chispa
		for (let i = sparkles.length - 1; i >= 0; i--) {
			const s = sparkles[i];
			ctx.beginPath();
			ctx.strokeStyle = `rgba(${s.color},${s.life})`;
			ctx.lineWidth = s.width;
			ctx.moveTo(s.x, s.y);
			ctx.lineTo(
				s.x - s.vx * s.length * 0.3,
				s.y - s.vy * s.length * 0.3
			);
			ctx.stroke();

			s.x += s.vx;
			s.y += s.vy;
			s.life -= s.decay;

			if (s.life <= 0) sparkles.splice(i, 1);
		}

		ctx.restore();
	}

    window.resetGame= function() {
		difficultyLevel = 0;
        diamonds.length = 0;
        score = 0;
        lives = 500;
        spawnInterval = 1200;
        difficultyTimer = 0;
        updateHUD();
        hideMessage();
        player.x = Math.max(0, Math.min(W - player.w, player.x));
    }

    window.gameOver = function() {
        running = false;
        msgTitle.textContent = 'You did it!';
        $('.game-world-item').attr("src", './resources/img/diamond-' + PRITT_GAME.world + '.png');
        $('.game-world-item').attr("src", './resources/img/diamond-' + PRITT_GAME.world + '.png');
        $('#game-phase1-stats').css('visibility', 'hidden');
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
	
	function playThud() {
		if (!audioCtx) return;
		const now = audioCtx.currentTime;

		// Baix curt i apagat
		const osc = audioCtx.createOscillator();
		const gain = audioCtx.createGain();
		osc.type = 'sine';
		osc.frequency.setValueAtTime(150, now);
		osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);
		gain.gain.setValueAtTime(0.25, now);
		gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
		osc.connect(gain).connect(audioCtx.destination);
		osc.start(now);
		osc.stop(now + 0.15);
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
		
		if (difficultyTimer >= 2000) { // cada 5 segundos aumenta un poco
			difficultyTimer = 0;
			// Incrementa el nivel de dificultad
			difficultyLevel++;
			// Los diamantes aparecen más seguido
			spawnInterval = Math.max(300, spawnInterval - 50);
			// También aumentan ligeramente la velocidad base (ya lo usamos arriba)
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
				if (d.isBad) {
					score -= 5;
					if (lives <= 0) {
						updateHUD();
						gameOver();
						return;
					}
					createEvilEffect(d.x, d.y);
					if (soundOn) playThud();
				} else {
					createSparkle(d.x, d.y);
					score += 1;
					if (soundOn) playPing();
				}

				diamonds.splice(i, 1);
				updateHUD();
				continue;
			}

        }
		
		for (let i = badObjects.length - 1; i >= 0; i--) {
			const b = badObjects[i];
			b.y += b.speed * (dt / 1000);
			b.rot += b.rotSpeed * dt;

			if (b.y - b.size > H) {
				badObjects.splice(i, 1);
				continue;
			}

			const overlapFactor = 0.20;
			const hitboxX = player.x + player.w * overlapFactor;
			const hitboxW = player.w * (1 - 2 * overlapFactor);
			const hitboxY = player.y + player.h * overlapFactor;
			const hitboxH = player.h * (1 - 2 * overlapFactor);

			const bx1 = b.x - b.size * (1 - overlapFactor);
			const bx2 = b.x + b.size * (1 - overlapFactor);
			const by1 = b.y - b.size * (1 - overlapFactor);
			const by2 = b.y + b.size * (1 - overlapFactor);

			if (
				bx2 > hitboxX &&
				bx1 < hitboxX + hitboxW &&
				by2 > hitboxY &&
				by1 < hitboxY + hitboxH
			) {
				// 💥 impacto con objeto malo
				createSparkle(b.x, b.y);
				badObjects.splice(i, 1);
                score += -5;
				if (lives <= 0) {
					updateHUD();
					gameOver();
					return;
				}
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
				drawDiamond(d.x, d.y, d.size, d.rot, d.isBad);
        }

        if (player.x < 0) player.x = 0;
        if (player.x + player.w > W) player.x = W - player.w;
        drawPlayer();
		
		if (damageFlash > 0) {
			ctx.save();
			ctx.globalAlpha = damageFlash;
			ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
			ctx.fillRect(0, 0, W, H);
			ctx.restore();
			damageFlash -= 0.05;
		}

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
        $('#game-phase1-stats').css('visibility', 'visible');
		clearInterval(PRITT_GAME.gameDurationInterval);
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