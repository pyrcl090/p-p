const gridContainer = document.querySelector('.grid-container');
const overlayGrid = document.querySelector('.overlay-grid');

const text = "  p            1 p ianissimo  2 p iasek      3 ".split("");

const cols = 15;
const rows = Math.ceil(text.length / cols);
const totalCells = rows * cols;

// Set grid row count dynamically based on content
gridContainer.style.gridTemplateRows = `repeat(${rows}, 30px)`;
overlayGrid.style.gridTemplateRows = `repeat(${rows}, 30px)`;

// Create base grid with sub-cells
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

// Create overlay grid with characters
for (let i = 0; i < totalCells; i++) {
  const overlayItem = document.createElement('div');
  overlayItem.className = 'overlay-item';

  if (i < text.length) {
    overlayItem.textContent = text[i];
  }

  overlayGrid.appendChild(overlayItem);
}

