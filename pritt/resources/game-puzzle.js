    const COLS = 3, ROWS = 5, TOTAL = COLS * ROWS;
    const grid = document.getElementById("puzzle-grid");
    const pieceBar = document.getElementById("piece-bar");

    let pieces = [];
    let dragged = null;

    function createSlots() {
      grid.innerHTML = ""; // limpiar grid
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const slot = document.createElement("div");
          slot.className = "slot";
          slot.dataset.row = r;
          slot.dataset.col = c;
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
          piece.style.backgroundImage = `url(${imageUrl})`;
          piece.style.backgroundPosition = `-${c * 100}px -${r * 100}px`;
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
      pieceBar.innerHTML = "";
      const box = document.createElement("div");
      box.className = "done-box";
      box.textContent = "DONE!";
      pieceBar.appendChild(box);
    }

    function tryDrop(piece, slot) {
      if (slot.dataset.row === piece.dataset.row &&
          slot.dataset.col === piece.dataset.col &&
          slot.children.length === 0) {
        slot.appendChild(piece);
        piece.style.cursor = "default";
        piece.draggable = false;

        refillBar();

        if (grid.querySelectorAll(".piece").length === TOTAL) {
          showDoneMessage();
        }
      }
    }

    // 🔹 Drag & Drop
    document.addEventListener("dragstart", e => {
      if (e.target.classList.contains("piece")) {
        dragged = e.target;
        setTimeout(() => dragged.classList.add("hidden"), 0);
      }
    });

    document.addEventListener("dragend", () => {
      if (dragged) dragged.classList.remove("hidden");
      dragged = null;
    });

    document.addEventListener("dragover", e => e.preventDefault());

    document.addEventListener("drop", e => {
      const slot = e.target.closest(".slot");
      if (dragged && slot) {
        tryDrop(dragged, slot);
      }
    });

    // 🔹 Init puzzle con una URL
    window.initPuzzle = function(imageUrl) {
      createSlots();
      pieceBar.innerHTML = "";
      pieces = createPieces(imageUrl);
      refillBar();
    }

    // 🔹 Llamada inicial (ejemplo con una URL aleatoria)
    initPuzzle("https://picsum.photos/300/500");

    // 🔹 Ejemplo: para regenerar puzzle con otra imagen:
    // initPuzzle("mi-nueva-imagen.jpg");