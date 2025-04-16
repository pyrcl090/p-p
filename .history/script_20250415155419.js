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

const blockContainers = []; // 🔢 for storing each block’s div

function setGridSize() {
  overlayGrid.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
  gridContainer.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
  overlayGrid.style.gridTemplateRows = `repeat(${rows}, 30px)`;
  gridContainer.style.gridTemplateRows = `repeat(${rows}, 30px)`;
}

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

function nextFreeCell(spanCols = 1, spanRows = 1) {
  while (true) {
    if (currentRow >= rows) {
      const extraRows = 10;
      rows += extraRows;
      for (let i = 0; i < extraRows; i++) {
        occupied.push(Array(cols).fill(false));
      }
      setGridSize();
      addGridItems(extraRows);
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

      const position = { row: currentRow + 1, col: currentCol + 1 };
      currentCol += spanCols;
      return position;
    }

    currentCol++;
  }
}

const menuText = "p, p text about etc\n";

// Initialize Are.na content
fetch('https://api.are.na/v2/channels/abecadlo?per=100')
  .then(res => res.json())
  .then(data => {
    const blocks = data.contents;

    rows = 100; // can expand dynamically
    for (let i = 0; i < rows; i++) {
      occupied.push(Array(cols).fill(false));
    }

    setGridSize();
    addGridItems(rows);

    // 🔠 Place menuText first in its own container
    const menuDiv = document.createElement('div');
    menuDiv.className = 'block-container menu-text';
    overlayGrid.appendChild(menuDiv);
    blockContainers.push(menuDiv);

    for (const char of menuText) {
      const { row, col } = nextFreeCell();
      const overlayItem = document.createElement('div');
      overlayItem.className = 'overlay-item';
      overlayItem.textContent = char;
      overlayItem.style.gridColumn = col;
      overlayItem.style.gridRow = row;
      menuDiv.appendChild(overlayItem);
    }

    // 🧱 Now handle each Are.na block in its own div
    blocks.forEach((block, index) => {
      const blockDiv = document.createElement('div');
      blockDiv.className = `block-container block-${index}`;
      overlayGrid.appendChild(blockDiv);
      blockContainers.push(blockDiv);

      if (block.image && block.image.display && block.image.display.url) {
        const img = document.createElement('img');
        img.src = block.image.display.url;

        const spanCols = Math.floor(Math.random() * 6) + 3; // 3 to 8
        const spanRows = 5;

        const { row, col } = nextFreeCell(spanCols, spanRows);

        img.className = 'grid-image';
        img.style.gridColumn = `${col} / span ${spanCols}`;
        img.style.gridRow = `${row} / span ${spanRows}`;
        img.style.objectFit = 'contain';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.padding = '4px';
        img.style.backgroundColor = '#fff';

        blockDiv.appendChild(img);

        currentCol = 0;
        currentRow = row - 1 + spanRows + 1;
      }

      const content = (block.title || block.content || '') + '\n';
      for (const char of content) {
        const { row, col } = nextFreeCell();
        const overlayItem = document.createElement('div');
        overlayItem.className = 'overlay-item';
        overlayItem.textContent = char;
        overlayItem.style.gridColumn = col;
        overlayItem.style.gridRow = row;
        blockDiv.appendChild(overlayItem);
      }
    });
  });
