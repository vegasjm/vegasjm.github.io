const COLS = 3, ROWS = 5, TOTAL = COLS * ROWS;
    const grid = document.getElementById("puzzle-grid");
    const pieceBar = document.getElementById("piece-bar");
	const marginBottom = 25; // espai extra sota la graella
    let pieces = [];
    let dragged = null;
    let slotSize = 0;
    let currentImageUrl = "https://picsum.photos/600/1000";

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

    function showDoneMessage() {
      pieceBar.innerHTML = "";
      const box = document.createElement("div");
      box.className = "done-box";
      box.textContent = "DONE!";
      pieceBar.appendChild(box);
    }

    function tryDrop(piece, slot) {
      if (!piece || !slot) return;
      if (slot.dataset.row === piece.dataset.row &&
          slot.dataset.col === piece.dataset.col &&
          slot.children.length === 0) {
        slot.appendChild(piece);
        piece.style.left = "0";
        piece.style.top = "0";
        piece.style.cursor = "default";
        piece.draggable = false;

        refillBar();

        if (grid.querySelectorAll(".piece").length === TOTAL) {
          showDoneMessage();
        }
      }
    }

    /* 🔹 Drag & Drop universal (mouse + touch) */
    function enableDrag(piece) {
      let offsetX, offsetY;

      // desktop
      piece.draggable = true;
      piece.addEventListener("dragstart", e => {
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
	  currentImageUrl = imageUrl || currentImageUrl;

	  calculateSlotSize();
	  createSlots();
	  pieceBar.innerHTML = "";

	  // IMPORTANT: usar currentImageUrl per evitar passar undefined
	  pieces = createPieces(currentImageUrl);
	  pieces.forEach(enableDrag);

	  // Col·locar 3 peces automàticament
	  placeRandomPieces(3);

	  // Omplir la barra amb les primeres peces
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
	
    initPuzzle(currentImageUrl);

	window.addEventListener("resize", () => {
	  resizeLayout();
	});