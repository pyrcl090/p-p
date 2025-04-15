const gridContainer = document.querySelector('.grid-container');
const overlayGrid = document.querySelector('.overlay-grid');
const text = "   P           1  P ianissimo 2  ".split("");

let index = 0;
const totalCells = 22 * 15;

// Create the base grid items (with sub-cells)
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

// Create the overlay grid items (with text)
for (let i = 0; i < totalCells; i++) {
  const overlayItem = document.createElement('div');
  overlayItem.className = 'overlay-item';

  if (index < text.length) {
    overlayItem.textContent = text[index];
    index++;
  }

  overlayGrid.appendChild(overlayItem);
}
