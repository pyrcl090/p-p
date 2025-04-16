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

const gridContainer = document.querySelector('.grid-container');
const overlayGrid = document.querySelector('.overlay-grid');

const cols = 15;
let rows = 0;
let occupied = [];
let currentRow = 0;
let currentCol = 0;

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

// List of channel slugs
const channelSlugs = ['p-pp-vz1bkeezvp0'];

async function fetchChannels() {
  const channelData = await Promise.all(channelSlugs.map(async slug => {
    const res = await fetch(`https://api.are.na/v2/channels/${slug}`);
    const data = await res.json();
    return {
      title: data.title,
      slug: data.slug,
      description: data.metadata && data.metadata.description ? data.metadata.description : '',
      url: `https://www.are.na/channel/${slug}`,
      contents: data.contents
    };
  }));

  // Initialize grid
  rows = 100;
  for (let i = 0; i < rows; i++) {
    occupied.push(Array(cols).fill(false));
  }
  setGridSize();
  addGridItems(rows);

  // Create menu
  currentRow = 0;
  currentCol = 0;
  for (const channel of channelData) {
    const label = channel.title || channel.slug;
    const { row, col } = nextFreeCell(label.length + 2, 1);

    const linkEl = document.createElement('a');
    linkEl.href = '#';
    linkEl.textContent = label;
    linkEl.className = 'overlay-link';
    linkEl.style.gridColumn = `${col} / span ${Math.min(label.length + 2, cols)}`;
    linkEl.style.gridRow = row;
    linkEl.addEventListener('click', (e) => {
      e.preventDefault();
      const contentElements = document.querySelectorAll(`.channel-content-${channel.slug}`);
      contentElements.forEach(el => {
        el.style.display = el.style.display === 'none' ? 'block' : 'none';
      });
    });

    overlayGrid.appendChild(linkEl);
    currentCol = 0;
    currentRow++;
  }

  // Create index
  for (const channel of channelData) {
    const label = channel.slug;
    const { row, col } = nextFreeCell(label.length + 2, 1);

    const indexEl = document.createElement('div');
    indexEl.textContent = label;
    indexEl.className = 'overlay-item';
    indexEl.style.gridColumn = `${col} / span ${Math.min(label.length + 2, cols)}`;
    indexEl.style.gridRow = row;

    overlayGrid.appendChild(indexEl);
    currentCol = 0;
    currentRow++;
  }

  // Display channel contents
  for (const channel of channelData) {
    // Channel slug as heading
    const headingText = `\n${channel.slug}\n`;
    for (const char of headingText) {
      const { row, col } = nextFreeCell();
      const overlayItem = document.createElement('div');
      overlayItem.className = `overlay-item channel-content-${channel.slug}`;
      overlayItem.textContent = char;
      overlayItem.style.gridColumn = col;
      overlayItem.style.gridRow = row;
      overlayGrid.appendChild(overlayItem);
    }

    // Channel description
    const descriptionText = channel.description + '\n';
    for (const char of descriptionText) {
      const { row, col } = nextFreeCell();
      const overlayItem = document.createElement('div');
      overlayItem.className = `overlay-item channel-content-${channel.slug}`;
      overlayItem.textContent = char;
      overlayItem.style.gridColumn = col;
      overlayItem.style.gridRow = row;
      overlayGrid.appendChild(overlayItem);
    }

    // Channel contents
    channel.contents.forEach(block => {
      if (block.image && block.image.display && block.image.display.url) {
        const img = document.createElement('img');
        img.src = block.image.display.url;

        const spanCols = Math.floor(Math.random() * 6) + 3;
        const spanRows = 5;

        const { row, col } = nextFreeCell(spanCols, spanRows);

        img.className = `grid-image channel-content-${channel.slug}`;
        img.style.gridColumn = `${col} / span ${spanCols}`;

::contentReference[oaicite:0]{index=0}
 
img.style.gridRow = `${row} / span ${spanRows}`;
img.style.objectFit = 'contain';
img.style.width = '100%';
img.style.height = '100%';
img.style.opacity = '.8';

overlayGrid.appendChild(img);

currentCol = 0;
currentRow = row - 1 + spanRows + 1;
}

// Text blocks
const content = (block.title || block.content || '') + '\n';
for (const char of content) {
const { row, col } = nextFreeCell();
const overlayItem = document.createElement('div');
overlayItem.className = `overlay-item channel-content-${channel.slug}`;
overlayItem.textContent = char;
overlayItem.style.gridColumn = col;
overlayItem.style.gridRow = row;
overlayGrid.appendChild(overlayItem);
}
});
}
}

fetchChannels();
