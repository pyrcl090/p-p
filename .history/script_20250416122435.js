// const gridContainer = document.querySelector('.grid-container');
// const overlayGrid = document.querySelector('.overlay-grid');

// const cols = 15;
// let rows = 0;
// let occupied = [];
// let currentRow = 0;
// let currentCol = 0;

// // Set initial grid size
// function setGridSize() {
//   overlayGrid.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
//   gridContainer.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
//   overlayGrid.style.gridTemplateRows = `repeat(${rows}, 30px)`;
//   gridContainer.style.gridTemplateRows = `repeat(${rows}, 30px)`;
// }

// // Helper function to add sub-grid items
// function addGridItems(rowCount) {
//   for (let i = 0; i < rowCount * cols; i++) {
//     const gridItem = document.createElement('div');
//     gridItem.className = 'grid-item';

//     for (let j = 0; j < 4; j++) {
//       const subCell = document.createElement('div');
//       subCell.className = 'sub-cell';
//       gridItem.appendChild(subCell);
//     }

//     gridContainer.appendChild(gridItem);
//   }
// }

// // Find next available free cell with optional span check
// function nextFreeCell(spanCols = 1, spanRows = 1) {
//   while (true) {
//     if (currentRow >= rows) {
//       const extraRows = 10;
//       rows += extraRows;

//       for (let i = 0; i < extraRows; i++) {
//         occupied.push(Array(cols).fill(false));
//       }

//       setGridSize();
//       addGridItems(extraRows);
//     }

//     if (currentCol + spanCols > cols) {
//       currentCol = 0;
//       currentRow++;
//       continue;
//     }

//     let fits = true;
//     for (let r = 0; r < spanRows; r++) {
//       for (let c = 0; c < spanCols; c++) {
//         if (
//           currentRow + r >= rows ||
//           currentCol + c >= cols ||
//           occupied[currentRow + r][currentCol + c]
//         ) {
//           fits = false;
//           break;
//         }
//       }
//       if (!fits) break;
//     }

//     if (fits) {
//       for (let r = 0; r < spanRows; r++) {
//         for (let c = 0; c < spanCols; c++) {
//           occupied[currentRow + r][currentCol + c] = true;
//         }
//       }

//       const position = { row: currentRow + 1, col: currentCol + 1 };
//       currentCol += spanCols;
//       return position;
//     }

//     currentCol++;
//   }
// }

// const menuText = "p";

// // Fetch content from Are.na
// fetch('https://api.are.na/v2/channels/abecadlo?per=100')
//   .then(res => res.json())
//   .then(data => {
//     const blocks = data.contents;

//     // Estimate rows needed initially
//     const estimatedTextLength = (menuText + blocks.map(block =>
//       block.title || block.content || ''
//     ).join('\n')).length;

//     rows = Math.ceil(estimatedTextLength / cols) + 20;

//     for (let i = 0; i < rows; i++) {
//       occupied.push(Array(cols).fill(false));
//     }

//     setGridSize();
//     addGridItems(rows);

//     // ⏫ PREPEND MENU TEXT AT THE TOP
//     for (const char of menuText) {
//       const { row, col } = nextFreeCell();
//       const overlayItem = document.createElement('div');
//       overlayItem.className = 'overlay-item';
//       overlayItem.textContent = char;
//       overlayItem.style.gridColumn = col;
//       overlayItem.style.gridRow = row;
//       overlayGrid.appendChild(overlayItem);
//     }

//     // 📦 Now loop through Are.na blocks
//     blocks.forEach(block => {
//       if (block.image && block.image.display && block.image.display.url) {
//         const img = document.createElement('img');
//         img.src = block.image.display.url;

//         const spanCols = Math.floor(Math.random() * 6) + 3; // 3 to 8
//         const spanRows = 5;

//         const { row, col } = nextFreeCell(spanCols, spanRows);

//         img.className = 'grid-image';
//         img.style.gridColumn = `${col} / span ${spanCols}`;
//         img.style.gridRow = `${row} / span ${spanRows}`;
//         img.style.objectFit = 'contain';
//         img.style.width = '100%';
//         img.style.height = '100%';
//         img.style.opacity = '.8';
//         img.style.alignContent = 'top left';

//         overlayGrid.appendChild(img);

//         currentCol = 0;
//         currentRow = row - 1 + spanRows + 1;
//       }

//       const content = (block.title || block.content || '') + '\n';
//       for (const char of content) {
//         const { row, col } = nextFreeCell();
//         const overlayItem = document.createElement('div');
//         overlayItem.className = 'overlay-item';
//         overlayItem.textContent = char;
//         overlayItem.style.gridColumn = col;
//         overlayItem.style.gridRow = row;
//         overlayGrid.appendChild(overlayItem);
//       }

//       currentCol = 0;
//       currentRow++;
//     });
//   });

const channels = [
  'p-pp-vz1bkeezvp0', // Replace with actual channel slugs
  'read-re_d-rode', // Replace with actual channel slugs
  'putaiinnnnn'  // Replace with actual channel slugs
];

const gridContainer = document.querySelector('.grid-container');
const overlayGrid = document.querySelector('.overlay-grid');

const cols = 15;
let rows = 0;
let occupied = [];
let currentRow = 0;
let currentCol = 0;
let currentlyOpenId = null;

const channelRowMap = {}; // Maps channelId to row range for content

// Set grid size based on rows and cols
function setGridSize() {
  console.log('Setting grid size:', rows);
  overlayGrid.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
  gridContainer.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
  overlayGrid.style.gridTemplateRows = `repeat(${rows}, 30px)`;
  gridContainer.style.gridTemplateRows = `repeat(${rows}, 30px)`;
}

function addGridItems(rowCount) {
  console.log('Adding grid items for row count:', rowCount);
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

// Find the next available cell to place content
function nextFreeCell(spanCols = 1, spanRows = 1) {
  console.log(`Finding next free cell for spanCols=${spanCols}, spanRows=${spanRows}`);
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
      console.log(`Found position for new cell: ${JSON.stringify(position)}`);
      return position;
    }
    currentCol++;
  }
}

// Place text in the grid at the calculated position
function placeText(text, isLink = false, linkHref = '', container = overlayGrid, onClick = null) {
  const letterPositions = [];
  console.log('Placing text:', text);
  for (const char of text) {
    if (char === '\n') {
      currentCol = 0;
      currentRow++;
      continue;
    }
    const { row, col } = nextFreeCell();
    const overlayItem = document.createElement('div');
    overlayItem.className = 'overlay-item';
    overlayItem.style.gridColumn = col;
    overlayItem.style.gridRow = row;
    if (isLink) {
      const a = document.createElement('a');
      a.href = linkHref;
      a.target = '_blank';
      a.textContent = char;
      a.style.pointerEvents = 'auto';
      a.style.textDecoration = 'none';
      a.style.color = 'inherit';
      overlayItem.appendChild(a);
    } else {
      overlayItem.textContent = char;
    }
    container.appendChild(overlayItem);
    letterPositions.push({ row, col });
  }

  if (onClick && letterPositions.length > 0) {
    const wrapper = document.createElement('div');
    wrapper.style.gridRow = `${letterPositions[0].row}`;
    wrapper.style.gridColumn = `${letterPositions[0].col} / span ${letterPositions.length}`;
    wrapper.style.zIndex = '10';
    wrapper.style.cursor = 'pointer';
    wrapper.style.pointerEvents = 'auto';
    wrapper.addEventListener('click', onClick);
    container.appendChild(wrapper);
  }
}

// Add or remove channel content dynamically, adjusting the grid size
function toggleChannelContent(channelId) {
  const channelContainer = document.getElementById(channelId);

  if (currentlyOpenId && currentlyOpenId !== channelId) {
    const previousContainer = document.getElementById(currentlyOpenId);
    if (previousContainer) {
      previousContainer.style.display = 'none';
      const range = channelRowMap[currentlyOpenId];
      if (range) {
        for (let r = range.startRow; r < range.endRow; r++) {
          if (occupied[r]) {
            occupied[r] = Array(cols).fill(false);
          }
        }
      }
    }
  }

  if (channelContainer) {
    const isVisible = channelContainer.style.display !== 'none';
    // Toggle visibility of content
    channelContainer.style.display = isVisible ? 'none' : 'grid';

    if (!isVisible) {
      // Add content to grid dynamically
      const range = channelRowMap[channelId];
      if (range) {
        for (let r = range.startRow; r < range.endRow; r++) {
          if (occupied[r]) {
            occupied[r] = Array(cols).fill(false);
          }
        }
      }
      currentlyOpenId = null;
    } else {
      // Add content back dynamically and adjust grid size
      currentlyOpenId = channelId;
    }

    setGridSize();  // Recalculate grid size after toggle
  }
}

// Place a spacer to move to the next row in the grid
function placeSpacer() {
  currentCol = 0;
  currentRow++;
}

// --- CHANNELS SETUP ---
channels.forEach((slug, index) => {
  fetch(`https://api.are.na/v2/channels/${slug}?per=100`)
    .then(res => res.json())
    .then(data => {
      placeSpacer();
      const toggleId = `channel-content-${index}`;

      // Place the channel name in grid, but clickable as a group
      placeText(`${data.title}`, false, '', overlayGrid, () => {
        toggleChannelContent(toggleId);
      });

      placeSpacer();

      const channelContainer = document.createElement('div');
      channelContainer.id = toggleId;
      channelContainer.style.display = 'none';  // Initially hidden
      channelContainer.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
      channelContainer.style.gridAutoRows = '30px';
      channelContainer.style.gridColumn = '1 / span ' + cols;
      channelContainer.style.gridRow = currentRow;
      channelContainer.style.display = 'grid';
      overlayGrid.appendChild(channelContainer);

      currentCol = 0;

      // Save the starting row of the channel's content
      const contentStartRow = currentRow;

      // Channel Title and Description
      if (data.metadata && data.metadata.description) {
        placeText(`${data.title}\n${data.metadata.description}\n`, false, '', channelContainer);
      } else {
        placeText(`${data.title}\n`, false, '', channelContainer);
      }

      placeSpacer();

      // Blocks (images, titles, text)
      data.contents.forEach(block => {
        if (block.image && block.image.display && block.image.display.url) {
          const img = document.createElement('img');
          img.src = block.image.display.url;
          const spanCols = Math.floor(Math.random() * 6) + 3;
          const spanRows = 5;
          const { row, col } = nextFreeCell(spanCols, spanRows);
          img.className = 'grid-image';
          img.style.gridColumn = `${col} / span ${spanCols}`;
          img.style.gridRow = `${row} / span ${spanRows}`;
          img.style.objectFit = 'contain';
          img.style.width = '100%';
          img.style.height = '100%';
          img.style.opacity = '.8';
          img.style.display = 'none';
          overlayGrid.appendChild(img);
          currentCol = 0;
          currentRow = row - 1 + spanRows + 1;
        }

        const content = (block.title || block.content || '') + '\n';
        placeText(content, false, '', channelContainer);
      });

      // Save the ending row of the channel's content
      const contentEndRow = currentRow;
      channelRowMap[toggleId] = { startRow: contentStartRow, endRow: contentEndRow };

      // Show the first channel by default
      if (index === 0
