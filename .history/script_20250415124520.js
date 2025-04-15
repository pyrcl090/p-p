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

fetch('https://api.are.na/v2/channels/rusalka?per=100')
  .then(res => res.json())
  .then(data => {
    const blocks = data.contents;

    // -------- TEXT --------
    const menuText = "p, p text about etc\n";
    const areNaText = blocks.map(block => block.title || block.content || '').join(' ');
    const fullText = (menuText + areNaText).split(/(?!^)/); // Split by characters
    const textArray = fullText.join('').split('');

    const cols = 15;
    const rows = Math.ceil(textArray.length / cols);
    const totalCells = rows * cols;

    overlayGrid.style.gridTemplateRows = `repeat(${rows}, 30px)`;
    overlayGrid.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
    gridContainer.style.gridTemplateRows = `repeat(${rows}, 30px)`;
    gridContainer.style.gridTemplateColumns = `repeat(${cols}, 30px)`;

    // TRACK OCCUPIED CELLS
    const occupied = new Set();

    for (let i = 0; i < totalCells; i++) {
      const gridItem = document.createElement('div');
      gridItem.className = 'grid-item';

      for (let j = 0; j < 4; j++) {
        const subCell = document.createElement('div');
        subCell.className = 'sub-cell';
        gridItem.appendChild(subCell);
      }
      gridContainer.appendChild(gridItem);
    }

    // -------- OVERLAY TEXT --------
    let index = 0;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const overlayItem = document.createElement('div');
        overlayItem.className = 'overlay-item';
        overlayItem.style.gridRow = row + 1;
        overlayItem.style.gridColumn = col + 1;

        const char = textArray[index++];
        if (char === '\n') {
          continue; // skip placing anything, force line break
        }

        overlayItem.textContent = char || '';
        overlayGrid.appendChild(overlayItem);
        occupied.add(`${row},${col}`);
      }
    }

    // -------- IMAGES --------
    const imageBlocks = blocks.filter(b => b.image && b.image.display && b.image.display.url);

    function randomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function isAreaFree(startRow, startCol, height, width) {
      if (startRow + height > rows || startCol + width > cols) return false;
      for (let r = startRow; r < startRow + height; r++) {
        for (let c = startCol; c < startCol + width; c++) {
          if (occupied.has(`${r},${c}`)) return false;
        }
      }
      return true;
    }

    function occupyCells(startRow, startCol, height, width) {
      for (let r = startRow; r < startRow + height; r++) {
        for (let c = startCol; c < startCol + width; c++) {
          occupied.add(`${r},${c}`);
        }
      }
    }

    imageBlocks.forEach(block => {
      const img = document.createElement('img');
      img.src = block.image.display.url;
      img.alt = block.title || '';
      img.className = 'grid-image';

      const imgWidth = randomInt(3, 8);
      const imgHeight = randomInt(2, 5);
      let placed = false;

      for (let attempts = 0; attempts < 100 && !placed; attempts++) {
        const row = randomInt(0, rows - imgHeight);
        const col = randomInt(0, cols - imgWidth);

        if (isAreaFree(row, col, imgHeight, imgWidth)) {
          occupyCells(row, col, imgHeight, imgWidth);
          img.style.gridRow = `${row + 1} / span ${imgHeight}`;
          img.style.gridColumn = `${col + 1} / span ${imgWidth}`;
          img.style.justifySelf = Math.random() > 0.5 ? 'start' : 'end';
          overlayGrid.appendChild(img);
          placed = true;
        }
      }
    });
  });
