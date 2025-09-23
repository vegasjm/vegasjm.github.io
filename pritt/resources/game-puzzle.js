
    const COLS = 3, ROWS = 5, TOTAL = COLS * ROWS;
    const grid = document.getElementById('puzzle-grid');
    const pieceBar = document.getElementById('piece-bar');

    let pieces = [];
    let dragged = null;
    let slotSize = 0;

    /* Calcula la mida de cada slot restant l'altura de page-header i menu-footer */
    function calculateSlotSize() {
      const header = document.getElementById('page-header');
      const footer = document.getElementById('menu-footer');

      const headerH = header ? header.offsetHeight : 0;
      const footerH = footer ? footer.offsetHeight : 0;

      // restem també l'alçada de la barra de peces per evitar solapament
      const pieceBarH = pieceBar ? pieceBar.offsetHeight : 0;

      // petit marge per seguretat
      const verticalMargin = 12;

      const availableHeight = window.innerHeight - headerH - footerH - pieceBarH - verticalMargin;
      const maxWidth = window.innerWidth - 2 * 10; // tenir en compte padding lateral del body (10px)

      const sizeByWidth = Math.floor(maxWidth / COLS);
      const sizeByHeight = Math.floor(availableHeight / ROWS);

      // escollim la mida que s'adapti millor, amb un mínim raonable
      const computed = Math.min(sizeByWidth, sizeByHeight);
      slotSize = Math.max(36, computed); // evitar que sigui massa petit
    }

    function createSlots() {
      grid.innerHTML = '';
      grid.style.gridTemplateColumns = `repeat(${COLS}, ${slotSize}px)`;
      grid.style.gridTemplateRows = `repeat(${ROWS}, ${slotSize}px)`;

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const slot = document.createElement('div');
          slot.className = 'slot';
          slot.dataset.row = r;
          slot.dataset.col = c;
          slot.style.width = slotSize + 'px';
          slot.style.height = slotSize + 'px';
          grid.appendChild(slot);
        }
      }
    }

    function createPieces(imageUrl) {
      const arr = [];
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const piece = document.createElement('div');
          piece.className = 'piece';
          piece.style.width = slotSize + 'px';
          piece.style.height = slotSize + 'px';
          piece.style.backgroundImage = `url(${imageUrl})`;
          // posició i mida exacta per que l'arxiu s'ajusti perfectament
          piece.style.backgroundSize = `${COLS * slotSize}px ${ROWS * slotSize}px`;
          piece.style.backgroundPosition = `-${c * slotSize}px -${r * slotSize}px`;
          piece.dataset.row = r;
          piece.dataset.col = c;
          piece.draggable = true;
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
      pieceBar.innerHTML = '';
      const box = document.createElement('div');
      box.className = 'done-box';
      box.textContent = 'DONE!';
      pieceBar.appendChild(box);
    }

    function tryDrop(piece, slot) {
      if (!piece || !slot) return;
      if (slot.dataset.row === piece.dataset.row &&
          slot.dataset.col === piece.dataset.col &&
          slot.children.length === 0) {
        // ajustem la peça perquè ocupi el slot (posició absoluta ja definida)
        slot.appendChild(piece);
        piece.style.position = 'absolute';
        piece.style.left = '0';
        piece.style.top = '0';
        piece.draggable = false;
        piece.style.cursor = 'default';

        refillBar();

        if (grid.querySelectorAll('.piece').length === TOTAL) {
          showDoneMessage();
        }
      }
    }

    /* Drag & drop natiu */
    document.addEventListener('dragstart', e => {
      if (e.target.classList.contains('piece')) {
        dragged = e.target;
        setTimeout(() => dragged.classList.add('hidden'), 0);
      }
    });

    document.addEventListener('dragend', () => {
      if (dragged) dragged.classList.remove('hidden');
      dragged = null;
    });

    document.addEventListener('dragover', e => e.preventDefault());

    document.addEventListener('drop', e => {
      const slot = e.target.closest('.slot');
      if (dragged && slot) tryDrop(dragged, slot);
    });

    /* Inicialitza (o torna a inicialitzar) el puzzle amb una URL */
    function initPuzzle(imageUrl) {
      PRITT_GAME.imgPuzzleURL = imageUrl || PRITT_GAME.imgPuzzleURL;
      calculateSlotSize();
      createSlots();
      pieceBar.innerHTML = '';
      pieces = createPieces(PRITT_GAME.imgPuzzleURL);
      refillBar();
    }

    // crida inicial amb la imatge per defecte
    initPuzzle(PRITT_GAME.imgPuzzleURL);

    // al redimensionar re-inicialitzem amb la mateixa imatge
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      // debounce suau per evitar re-inicialitzacions massives
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => initPuzzle(PRITT_GAME.imgPuzzleURL), 120);
    });

    /* ---- Ús: per regenerar amb nova imatge crida:
         initPuzzle('https://example.com/la-teva-imatge-3x5.jpg')
       Això recalcula mida i regenera el puzzle sense recarregar la pàgina.
    */