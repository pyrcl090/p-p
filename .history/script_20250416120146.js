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
    'p-pp-vz1bkeezvp0',
    'read-re_d-rode',
    'putaiinnnnn'
  ];
  
  const gridContainer = document.querySelector('.grid-container');
  const overlayGrid = document.querySelector('.overlay-grid');
  
  const cols = 15;
  let rows = 0;
  let occupied = [];
  let currentRow = 0;
  let currentCol = 0;
  let currentlyOpenId = null;
  
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
  
  function placeText(text, isLink = false, linkHref = '', container = overlayGrid, onClick = null) {
    const letterPositions = [];
  
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
      overlayGrid.appendChild(wrapper);
    }
  }
  
  function toggleChannelContent(channelId) {
    const channelContainer = document.getElementById(channelId);
  
    if (currentlyOpenId && currentlyOpenId !== channelId) {
      const previousContainer = document.getElementById(currentlyOpenId);
      if (previousContainer) {
        previousContainer.style.display = 'none';
      }
    }
  
    if (channelContainer) {
      const isCurrentlyVisible = channelContainer.style.display !== 'none';
      channelContainer.style.display = isCurrentlyVisible ? 'none' : 'grid';
      currentlyOpenId = isCurrentlyVisible ? null : channelId;
    }
  }
  
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
  
        // Place clickable channel title
        placeText(`${data.title}`, false, '', overlayGrid, () => {
          toggleChannelContent(toggleId);
        });
  
        placeSpacer();
  
        const contentStartRow = currentRow;
  
        // Create separate container for channel content
        const channelContainer = document.createElement('div');
        channelContainer.id = toggleId;
        channelContainer.style.display = 'none';
        channelContainer.style.position = 'relative';
        channelContainer.style.gridColumn = `1 / span ${cols}`;
        channelContainer.style.gridRow = `${contentStartRow}`;
        channelContainer.style.display = 'grid';
        channelContainer.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
        channelContainer.style.gridAutoRows = '30px';
        overlayGrid.appendChild(channelContainer);
  
        // Shift cursor down so next stuff doesn't overlap
        placeSpacer();
  
        if (data.metadata && data.metadata.description) {
          placeText(`${data.metadata.description}\n`, false, '', channelContainer);
        }
  
        placeSpacer();
  
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
            overlayGrid.appendChild(img);
            currentCol = 0;
            currentRow = row - 1 + spanRows + 1;
          }
  
          const content = (block.title || block.content || '') + '\n';
          placeText(content, false, '', channelContainer);
        });
      });
  });
  