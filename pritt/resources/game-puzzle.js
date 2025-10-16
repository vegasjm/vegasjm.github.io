	// Crear context d'àudio (compatibilitat)
	const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	const COLS = 3, ROWS = 5, TOTAL = COLS * ROWS;
    const grid = document.getElementById("puzzle-grid");
    const pieceBar = document.getElementById("piece-bar");
	const marginBottom = 25; // espai extra sota la graella
    let pieces = [];
    let dragged = null;
    let slotSize = 0;
    let currentImageUrl = "https://picsum.photos/600/1000";


	function playSound(frequency, duration, type="sine") {
	  const osc = audioCtx.createOscillator();
	  const gainNode = audioCtx.createGain();

	  osc.type = type;
	  osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);

	  // volum inicial i fade out
	  gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
	  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

	  osc.connect(gainNode);
	  gainNode.connect(audioCtx.destination);

	  osc.start();
	  osc.stop(audioCtx.currentTime + duration);
	}

	/* 🔹 So de grava quan agafes una peça */
	function playDragSound() {
	  const bufferSize = audioCtx.sampleRate * 0.2; // 0.2s
	  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
	  const data = buffer.getChannelData(0);

	  // soroll blanc
	  for (let i = 0; i < bufferSize; i++) {
		data[i] = Math.random() * 2 - 1;
	  }

	  const noise = audioCtx.createBufferSource();
	  noise.buffer = buffer;

	  // filtre per fer-ho més "gravat"
	  const filter = audioCtx.createBiquadFilter();
	  filter.type = "bandpass";
	  filter.frequency.value = 800;   // centre
	  filter.Q.value = 1.5;           // amplada

	  const gain = audioCtx.createGain();
	  gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
	  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);

	  noise.connect(filter).connect(gain).connect(audioCtx.destination);
	  noise.start();
	  noise.stop(audioCtx.currentTime + 0.2);
	}

	/* 🔹 So “pop” quan deixes correctament */
	function playDropSound() {
	  const osc = audioCtx.createOscillator();
	  const gain = audioCtx.createGain();

	  osc.type = "sine";
	  osc.frequency.setValueAtTime(220, audioCtx.currentTime);
	  osc.frequency.exponentialRampToValueAtTime(60, audioCtx.currentTime + 0.25);

	  gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
	  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);

	  osc.connect(gain).connect(audioCtx.destination);
	  osc.start();
	  osc.stop(audioCtx.currentTime + 0.25);

	  // afegim un toc de soroll curt per fer-lo més "natural"
	  const bufferSize = audioCtx.sampleRate * 0.1;
	  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
	  const data = buffer.getChannelData(0);
	  for (let i = 0; i < bufferSize; i++) {
		data[i] = Math.random() * 2 - 1;
	  }
	  const noise = audioCtx.createBufferSource();
	  noise.buffer = buffer;
	  const noiseGain = audioCtx.createGain();
	  noiseGain.gain.setValueAtTime(0.2, audioCtx.currentTime);
	  noiseGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

	  noise.connect(noiseGain).connect(audioCtx.destination);
	  noise.start();
	  noise.stop(audioCtx.currentTime + 0.1);
	}

    /* 🔹 Calcula slotSize restant header, footer, piece-bar i marginBottom */
	function calculateSlotSize() {
	  const headerEl = document.getElementById("page-header");
	  const footerEl = document.getElementById("menu-footer");

	  const headerH = headerEl ? headerEl.offsetHeight : 0;
	  const footerH = footerEl ? footerEl.offsetHeight : 0;

	  // 🔹 Espai reservat per la barra inferior (3 peces + marge extra)
	  const reservedBarHeight = 3 * 36 + 40; // 3 peces + 40px d'espai extra
	  const marginBottom = 25;

	  const availableHeight = window.innerHeight - headerH - footerH - reservedBarHeight - marginBottom;
	  const maxWidth = window.innerWidth - 20;

	  const sizeByWidth = Math.floor(maxWidth / COLS);
	  const sizeByHeight = Math.floor(availableHeight / ROWS);

	  slotSize = Math.max(36, Math.min(sizeByWidth, sizeByHeight));
	}

    function createSlots() {
      grid.innerHTML = "";
      grid.style.gridTemplateColumns = `repeat(${COLS}, ${slotSize}px)`;
      grid.style.gridTemplateRows = `repeat(${ROWS}, ${slotSize}px)`;

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const slot = document.createElement("div");
          slot.className = "slot";
          slot.dataset.row = r;
          slot.dataset.col = c;
          slot.style.width = slotSize + "px";
          slot.style.height = slotSize + "px";
          grid.appendChild(slot);
        }
      }
    }

    function createPieces(imageUrl) {
      const arr = [];
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const piece = document.createElement("div");
          piece.className = "piece";
          piece.style.width = slotSize + "px";
          piece.style.height = slotSize + "px";
          piece.style.backgroundImage = `url(${imageUrl})`;
          piece.style.backgroundSize = `${COLS * slotSize}px ${ROWS * slotSize}px`;
          piece.style.backgroundPosition = `-${c * slotSize}px -${r * slotSize}px`;
          piece.dataset.row = r;
          piece.dataset.col = c;
          arr.push(piece);
        }
      }
      return arr.sort(() => Math.random() - 0.5);
    }

    function refillBar() {
      while (pieceBar.children.length < 3 && pieces.length > 0) {
        pieceBar.appendChild(pieces.pop());
      }
    }

	/* 🔹 Missatge final amb botó DONE */
	function showDoneMessage() {
	  pieceBar.innerHTML = "";
	  const btn = document.createElement("button");
	  btn.textContent = "DONE!";
	  btn.id = "done-button";
	  btn.style.fontSize = "2em";
	  pieceBar.appendChild(btn);

	  // afegim listener després de crear el botó
	  btn.addEventListener("click", assembleImage);
	}

	function tryDrop(piece, slot) {
	  if (slot.dataset.row === piece.dataset.row &&
		  slot.dataset.col === piece.dataset.col &&
		  slot.children.length === 0) {
		slot.appendChild(piece);
		piece.style.position = "absolute";
		piece.style.left = "0";
		piece.style.top = "0";
		piece.draggable = false;
		piece.style.cursor = "default";

		playDropSound(); // 🔊 so correcte

		// animacions visuals
		piece.classList.add("correct");
		setTimeout(() => piece.classList.remove("correct"), 300);
		slot.classList.add("correct-slot");
		setTimeout(() => slot.classList.remove("correct-slot"), 400);

		refillBar();
		if (grid.querySelectorAll(".piece").length === TOTAL) showDoneMessage();
	  }
	}

    /* 🔹 Drag & Drop universal (mouse + touch) */
    function enableDrag(piece) {
      let offsetX, offsetY;

      // desktop
      piece.draggable = true;
      piece.addEventListener("dragstart", e => {
		e.dataTransfer.setData("text/plain", piece.id);
		playDragSound(); // 🔊 so generat
        dragged = piece;
        piece.classList.add("dragging");
      });
      piece.addEventListener("dragend", e => {
        piece.classList.remove("dragging");
        dragged = null;
        document.querySelectorAll(".slot").forEach(s => s.classList.remove("highlight"));
      });

      // touch
      piece.addEventListener("touchstart", e => {
        dragged = piece;
        piece.classList.add("dragging");
        const touch = e.touches[0];
        offsetX = touch.clientX - piece.getBoundingClientRect().left;
        offsetY = touch.clientY - piece.getBoundingClientRect().top;
      }, { passive: true });

      piece.addEventListener("touchmove", e => {
        if (!dragged) return;
        const touch = e.touches[0];
        piece.style.position = "fixed";
        piece.style.zIndex = 1000;
        piece.style.left = (touch.clientX - offsetX) + "px";
        piece.style.top = (touch.clientY - offsetY) + "px";

        document.querySelectorAll(".slot").forEach(s => {
          const rect = s.getBoundingClientRect();
          if (touch.clientX > rect.left && touch.clientX < rect.right &&
              touch.clientY > rect.top && touch.clientY < rect.bottom) {
            s.classList.add("highlight");
          } else {
            s.classList.remove("highlight");
          }
        });
      }, { passive: true });

      piece.addEventListener("touchend", e => {
        if (!dragged) return;
        piece.classList.remove("dragging");
        piece.style.position = "";
        piece.style.left = "";
        piece.style.top = "";
        piece.style.zIndex = "";

        const touch = e.changedTouches[0];
        let droppedSlot = null;
        document.querySelectorAll(".slot").forEach(s => {
          const rect = s.getBoundingClientRect();
          s.classList.remove("highlight");
          if (touch.clientX > rect.left && touch.clientX < rect.right &&
              touch.clientY > rect.top && touch.clientY < rect.bottom) {
            droppedSlot = s;
          }
        });

        tryDrop(piece, droppedSlot);
        dragged = null;
      });
    }

    /* Eventos de grid per a desktop drop */
    document.addEventListener("dragover", e => {
      e.preventDefault();
      const slot = e.target.closest(".slot");
      document.querySelectorAll(".slot").forEach(s => s.classList.remove("highlight"));
      if (slot) slot.classList.add("highlight");
    });

    document.addEventListener("drop", e => {
      e.preventDefault();
      const slot = e.target.closest(".slot");
      if (dragged && slot) tryDrop(dragged, slot);
      document.querySelectorAll(".slot").forEach(s => s.classList.remove("highlight"));
    });

	/* Inicialitzar puzzle (versió corregida) */
	function initPuzzle(imageUrl) {
	  const puzzleContainer = document.getElementById("puzzle-container");
	  if (puzzleContainer) {
		// 🔧 Reset complet d'estil per evitar que col·lapsi
		puzzleContainer.style.opacity = "1";
		puzzleContainer.style.display = "inline-block";
		puzzleContainer.style.transition = "";
		puzzleContainer.classList.remove("completed");
	  }

	  currentImageUrl = imageUrl || currentImageUrl;
	  calculateSlotSize();
	  createSlots();
	  pieceBar.innerHTML = "";
	  pieces = createPieces(currentImageUrl);
	  pieces.forEach(enableDrag);
	  placeRandomPieces(3);
	  refillBar();
	}

	/* Ajusta les mides sense reiniciar el joc */
	function resizeLayout() {
	  calculateSlotSize();

	  grid.style.gridTemplateColumns = `repeat(${COLS}, ${slotSize}px)`;
	  grid.style.gridTemplateRows = `repeat(${ROWS}, ${slotSize}px)`;

	  grid.querySelectorAll(".slot").forEach(slot => {
		slot.style.width = slotSize + "px";
		slot.style.height = slotSize + "px";
	  });

	  document.querySelectorAll(".piece").forEach(piece => {
		piece.style.width = slotSize + "px";
		piece.style.height = slotSize + "px";
		piece.style.backgroundSize = `${COLS * slotSize}px ${ROWS * slotSize}px`;
		piece.style.backgroundPosition = `-${piece.dataset.col * slotSize}px -${piece.dataset.row * slotSize}px`;
	  });

	  // 🔹 Barra amb espai extra
		pieceBar.style.minHeight = (slotSize + 40) + "px"; // una mica més gran que slotSize per donar espai
		pieceBar.style.marginBottom = "10px";
	}
	
	// Col·loca aleatòriament 'count' peces ja completes al iniciar
	function placeRandomPieces(count = 3) {
	  for (let i = 0; i < count; i++) {
		if (pieces.length === 0) return;

		const index = Math.floor(Math.random() * pieces.length);
		const piece = pieces.splice(index, 1)[0];

		const row = piece.dataset.row;
		const col = piece.dataset.col;
		const slot = grid.querySelector(`.slot[data-row="${row}"][data-col="${col}"]`);

		if (slot && slot.children.length === 0) {
		  slot.appendChild(piece);
		  // assegurem que encaixi visualment al slot
		  piece.style.position = 'absolute';
		  piece.style.left = '0';
		  piece.style.top = '0';
		  piece.draggable = false;
		  piece.style.cursor = 'default';
		} else {
		  // si el slot està ocupat (cas rar), tornem a posar la peça a la pila
		  pieces.push(piece);
		}
	  }
	}
	
	/* 🔹 Animació de muntatge final */
	function assembleImage() {
	  const puzzleContainer = document.getElementById("puzzle-container");
	  if (!puzzleContainer) return;

	  // recollim totes les peces que estiguin dins del container (les del puzzle, no les de la barra)
	  const piecesList = Array.from(puzzleContainer.querySelectorAll(".piece"));
	  if (!piecesList.length) return;

	  // determinem files i columnes a partir dels slots (si existeixen) o a partir de les dades de les peces
	  const slotEls = Array.from(puzzleContainer.querySelectorAll(".slot"));
	  let colsCount, rowsCount;
	  if (slotEls.length > 0) {
		colsCount = Math.max(...slotEls.map(s => parseInt(s.dataset.col || "0", 10))) + 1;
		rowsCount = Math.max(...slotEls.map(s => parseInt(s.dataset.row || "0", 10))) + 1;
	  } else {
		colsCount = Math.max(...piecesList.map(p => parseInt(p.dataset.col || "0", 10))) + 1;
		rowsCount = Math.max(...piecesList.map(p => parseInt(p.dataset.row || "0", 10))) + 1;
	  }

	  // mida final i offsets per centrar dins del container
	  const finalWidth = colsCount * slotSize;
	  const finalHeight = rowsCount * slotSize;
	  const containerWidth = puzzleContainer.clientWidth;
	  const containerHeight = puzzleContainer.clientHeight;
	  const offsetX = Math.max(0, (containerWidth - finalWidth) / 2);
	  const offsetY = Math.max(0, (containerHeight - finalHeight) / 2);

	  // Marquem el contenidor com a 'completed' (per CSS addicional)
	  puzzleContainer.classList.add("completed");
	  puzzleContainer.style.position = puzzleContainer.style.position || "relative";

	  // Animació: mou una peça cada X ms
	  let index = 0;
	  function placeNext() {
		if (index >= piecesList.length) return;

		const piece = piecesList[index];

		// Mou la peça fora del slot (append al container)
		puzzleContainer.appendChild(piece);

		// Posició absoluta centrada calculada amb offset
		const col = parseInt(piece.dataset.col || "0", 10);
		const row = parseInt(piece.dataset.row || "0", 10);
		piece.style.position = "absolute";
		piece.style.left = (offsetX + col * slotSize) + "px";
		piece.style.top = (offsetY + row * slotSize) + "px";
		piece.style.width = slotSize + "px";
		piece.style.height = slotSize + "px";
		piece.style.transition = "all 0.38s ease";
		piece.style.transform = "scale(1.08)";

		// petita anim i so quan s'assenta
		setTimeout(() => {
		  piece.style.transform = "scale(1)";
		  if (typeof playMagneticClack === "function") playMagneticClack();
		}, 280);

		index++;
		setTimeout(placeNext, 180); // temps entre peces (ajusta si vols més ràpid/lent)
	  }

	  placeNext();

		// eliminar slots passats uns ms després de l'última peça (perquè no solapin)
		const cleanupDelay = piecesList.length * 180 + 500;
		setTimeout(() => {
		  // 🔹 Fade-out de totes les peces sense esborrar la graella
		  const pieces = puzzleContainer.querySelectorAll(".piece");
		  pieces.forEach(piece => {
			piece.style.transition = "opacity 0.8s ease";
			piece.style.opacity = "0";
		  });

		  // 🔹 Després del fade, eliminar només les peces, no els slots
		  setTimeout(() => {
			pieces.forEach(piece => piece.remove());
			puzzleContainer.style.opacity = "1"; // restaurem per al proper joc

			// Tornar al menú, sense tocar l'estructura
			if (PRITT_GAME.world == 1) PRITT_GAME.world_1 = true;
			if (PRITT_GAME.world == 2) PRITT_GAME.world_2 = true;
			if (PRITT_GAME.world == 3) PRITT_GAME.world_3 = true;
			PRITT_GAME.loadGameCompleted();
		  }, 800); // coincideix amb la durada del fade

		}, cleanupDelay);

	}
	
	function playMagneticClack() {
	  const now = audioCtx.currentTime;

	  // Soroll blanc curt
	  const bufferSize = audioCtx.sampleRate * 0.1;
	  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
	  const data = buffer.getChannelData(0);
	  for (let i = 0; i < bufferSize; i++) {
		data[i] = Math.random() * 2 - 1;
	  }
	  const noise = audioCtx.createBufferSource();
	  noise.buffer = buffer;

	  const noiseFilter = audioCtx.createBiquadFilter();
	  noiseFilter.type = "highpass";
	  noiseFilter.frequency.value = 2000; // agut metàl·lic

	  const noiseGain = audioCtx.createGain();
	  noiseGain.gain.setValueAtTime(0.3, now);
	  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

	  noise.connect(noiseFilter).connect(noiseGain).connect(audioCtx.destination);

	  // Oscil·lador greu (ressonància metàl·lica curta)
	  const osc = audioCtx.createOscillator();
	  osc.type = "square";
	  osc.frequency.setValueAtTime(120, now);
	  osc.frequency.exponentialRampToValueAtTime(60, now + 0.15);

	  const oscGain = audioCtx.createGain();
	  oscGain.gain.setValueAtTime(0.4, now);
	  oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

	  osc.connect(oscGain).connect(audioCtx.destination);

	  // iniciar i parar
	  noise.start(now);
	  noise.stop(now + 0.1);
	  osc.start(now);
	  osc.stop(now + 0.15);
	}

	
    initPuzzle(currentImageUrl);

	window.addEventListener("resize", () => {
	  resizeLayout();
	});