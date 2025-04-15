const gridContainer = document.querySelector('.grid-container');
const overlayGrid = document.querySelector('.overlay-grid');

fetch('https://api.are.na/v2/channels/pube-grid?per=100')
  .then(res => res.json())
  .then(data => {
    const blocks = data.contents;
    const textArray = blocks.map(block => block.title || block.content || '').join(' ').split("");

    const cols = 15;
    const rows = Math.ceil(textArray.length / cols);
    const totalCells = rows * cols;

    // Set the grid rows dynamically
    overlayGrid.style.gridTemplateRows = `repeat(${rows}, 30px)`;
    gridContainer.style.gridTemplateRows = `repeat(${rows}, 30px)`;

    // Create base grid
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

    // Create overlay grid with text
    for (let i = 0; i < totalCells; i++) {
      const overlayItem = document.createElement('div');
      overlayItem.className = 'overlay-item';

      if (i < textArray.length) {
        overlayItem.textContent = textArray[i];
      }

      overlayGrid.appendChild(overlayItem);
    }
  });
