// const gridContainer = document.querySelector('.grid-container');
// const overlayGrid = document.querySelector('.overlay-grid');

// // Step 1: Add your menu line
// const menuText = "p, p text about etc".split("");
// const menuLink = "https://are.na/rusalka";

// // Step 2: Fetch Are.na content
// fetch('https://api.are.na/v2/channels/rusalka?per=100')
//   .then(res => res.json())
//   .then(data => {
//     const blocks = data.contents;
//     const rowsArray = [];

//     // Add menu row first
//     const menuRow = menuText.map((char, i) => ({
//       char,
//       link: menuLink
//     }));
//     rowsArray.push(menuRow); // row 0

//     // Add a blank line as a spacer
//     const spacerRow = Array(15).fill({ char: " ", link: null });
//     rowsArray.push(spacerRow); // row 1

//     // Add Are.na text rows
//     blocks.forEach(block => {
//       const content = (block.title || block.content || '').trim();
//       const link = block.source?.url;
//       const lines = content.split(/\r?\n/);

//       lines.forEach(line => {
//         const charObjects = line.split('').map((char, i) => ({
//           char,
//           link: i === 0 && link ? link : null
//         }));
//         rowsArray.push(charObjects);
//       });
//     });

//     const cols = 15;
//     const rows = rowsArray.length;

//     // Apply grid dimensions
//     overlayGrid.style.gridTemplateRows = `repeat(${rows}, 30px)`;
//     overlayGrid.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
//     gridContainer.style.gridTemplateRows = `repeat(${rows}, 30px)`;
//     gridContainer.style.gridTemplateColumns = `repeat(${cols}, 30px)`;

//     // Build grid
//     for (let r = 0; r < rows; r++) {
//       const row = rowsArray[r];
//       for (let c = 0; c < cols; c++) {
//         const i = r * cols + c;

//         // Base grid cell
//         const gridItem = document.createElement('div');
//         gridItem.className = 'grid-item';
//         for (let j = 0; j < 4; j++) {
//           const subCell = document.createElement('div');
//           subCell.className = 'sub-cell';
//           gridItem.appendChild(subCell);
//         }
//         gridContainer.appendChild(gridItem);

//         // Overlay cell
//         const overlayItem = document.createElement('div');
//         overlayItem.className = 'overlay-item';

//         if (c < row.length) {
//           const { char, link } = row[c];
//           if (link) {
//             const a = document.createElement('a');
//             a.href = link;
//             a.target = "_blank";
//             a.textContent = char;
//             a.style.pointerEvents = "auto";
//             a.style.textDecoration = "none";
//             overlayItem.appendChild(a);
//           } else {
//             overlayItem.textContent = char;
//           }
//         }

//         overlayGrid.appendChild(overlayItem);
//       }
//     }
//   });

const gridContainer = document.querySelector('.grid-container');
const overlayGrid = document.querySelector('.overlay-grid');

const cols = 15;
let rows = 0;
let occupied = [];
let currentRow = 0;
let currentCol = 0;

// Set initial grid size
function setGridSize() {
  overlayGrid.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
  gridContainer.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
  overlayGrid.style.gridTemplateRows = `repeat(${rows}, 30px)`;
  gridContainer.style.gridTemplateRows = `repeat(${rows}, 30px)`;
}

// 🆕 Helper function to add sub-grid items
function addGridItems(rowCount) {
  for (let i = 0; i < rowCount * cols; i++) {
    const gridItem = document.createElement('div');
    gridItem.className = 'grid-item';

    for (let j = 0; j < 4; j++) {
      const subCell = document.createElement('div');
      subCell.className = 'sub-cell';
      gridItem.appendChild(subCell);
    }

    gridContainer.appendChild(gridItem);
  }
}

// Find next available free cell with optional span check
function nextFreeCell(spanCols = 1, spanRows = 1) {
  while (true) {
    if (currentRow >= rows) {
      const extraRows = 10;
      rows += extraRows;

      for (let i = 0; i < extraRows; i++) {
        occupied.push(Array(cols).fill(false));
      }

      setGridSize();
      addGridItems(extraRows); // 🆕 extend grid visuals
    }

    if (currentCol + spanCols > cols) {
      currentCol = 0;
      currentRow++;
      continue;
    }

    let fits = true;
    for (let r = 0; r < spanRows; r++) {
      for (let c = 0; c < spanCols; c++) {
        if (
          currentRow + r >= rows ||
          currentCol + c >= cols ||
          occupied[currentRow + r][currentCol + c]
        ) {
          fits = false;
          break;
        }
      }
      if (!fits) break;
    }

    if (fits) {
      for (let r = 0; r < spanRows; r++) {
        for (let c = 0; c < spanCols; c++) {
          occupied[currentRow + r][currentCol + c] = true;
        }
      }

      const position = { row: currentRow + 1, col: currentCol + 1 }; // 1-based for CSS
      currentCol += spanCols;
      return position;
    }

    currentCol++;
  }
}

// 🔡 Menu text to prepend
const menuText = "p, p text about etc\n";

// Fetch content from Are.na
fetch('https://api.are.na/v2/channels/abecadlo?per=100')
  .then(res => res.json())
  .then(data => {
    const blocks = data.contents;
    const textArray = (menuText + blocks.map(block =>
      block.title || block.content || ''
    ).join('\n')).split("");

    rows = Math.ceil(textArray.length / cols) + 10;

    for (let i = 0; i < rows; i++) {
      occupied.push(Array(cols).fill(false));
    }

    setGridSize();
    addGridItems(rows);

    let index = 0;

    blocks.forEach(block => {
      if (block.image && block.image.display && block.image.display.url) {
        const img = document.createElement('img');
        img.src = block.image.display.url;

        const spanCols = Math.floor(Math.random() * 5) + 3; // 3 to 7
        const spanRows = Math.floor(Math.random() * 3) + 3; // 3 to 5

        const { row, col } = nextFreeCell(spanCols, spanRows);

        img.className = 'grid-image';
        img.style.gridColumn = `${col} / span ${spanCols}`;
        img.style.gridRow = `${row} / span ${spanRows}`;
        img.style.objectFit = 'cover';
        img.style.width = '100%';
        img.style.height = '100%';

        overlayGrid.appendChild(img);
      }

      const content = (block.title || block.content || '') + '\n';
      for (const char of content) {
        const { row, col } = nextFreeCell();
        const overlayItem = document.createElement('div');
        overlayItem.className = 'overlay-item';
        overlayItem.textContent = char;
        overlayItem.style.gridColumn = col;
        overlayItem.style.gridRow = row;
        overlayGrid.appendChild(overlayItem);
      }
    });

    // Prepend menu text after Are.na blocks processed
    const combinedText = menuText.split("").reverse();
    for (const char of combinedText.reverse()) {
      const { row, col } = nextFreeCell();
      const overlayItem = document.createElement('div');
      overlayItem.className = 'overlay-item';
      overlayItem.textContent = char;
      overlayItem.style.gridColumn = col;
      overlayItem.style.gridRow = row;
      overlayGrid.appendChild(overlayItem);
    }
  });

