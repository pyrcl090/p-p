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

fetch('https://api.are.na/v2/channels/rusalka?per=100')
  .then(res => res.json())
  .then(data => {
    const blocks = data.contents;

    const cols = 15;
    const cellSize = 30; // px
    let currentRow = 0;
    let currentCol = 0;

    // Helper to advance grid position
    function advancePosition(steps = 1) {
      currentCol += steps;
      if (currentCol >= cols) {
        currentCol = 0;
        currentRow++;
      }
    }

    // Helper to check if position is within bounds
    function isWithinBounds(colSpan, rowSpan) {
      return currentCol + colSpan <= cols;
    }

    // Set initial grid template
    gridContainer.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;
    overlayGrid.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;

    blocks.forEach((block, i) => {
      // === If block has image ===
      if (block.image) {
        const colSpan = Math.floor(Math.random() * 6) + 3; // 3–8 cols
        const rowSpan = Math.floor(Math.random() * 3) + 3; // 3–5 rows

        // If the image won't fit on this row, move to next row
        if (!isWithinBounds(colSpan, rowSpan)) {
          currentCol = 0;
          currentRow++;
        }

        const img = document.createElement('img');
        img.src = block.image.display.url;
        img.alt = block.title || "image";
        img.className = 'overlay-image';
        img.style.gridColumn = `${currentCol + 1} / span ${colSpan}`;
        img.style.gridRow = `${currentRow + 1} / span ${rowSpan}`;
        img.style.justifySelf = Math.random() < 0.5 ? 'start' : 'end';

        overlayGrid.appendChild(img);
        advancePosition(colSpan);
      }

      // === If block has text ===
      const text = (block.title || block.content || '').replace(/\n/g, '↵');
      text.split('').forEach(char => {
        const overlayItem = document.createElement('div');
        overlayItem.className = 'overlay-item';
        overlayItem.textContent = char;

        overlayItem.style.gridColumn = `${currentCol + 1}`;
        overlayItem.style.gridRow = `${currentRow + 1}`;

        overlayGrid.appendChild(overlayItem);
        advancePosition();
      });
    });

    // Set grid template rows based on final row count
    const totalRows = currentRow + 1;
    gridContainer.style.gridTemplateRows = `repeat(${totalRows}, ${cellSize}px)`;
    overlayGrid.style.gridTemplateRows = `repeat(${totalRows}, ${cellSize}px)`;
  });

