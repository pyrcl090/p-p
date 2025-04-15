const gridContainer = document.querySelector('.grid-container');
const overlayGrid = document.querySelector('.overlay-grid');
const text = "HELLOTHISISAGRIDTESTHELLOTHISISAGRIDTEST".split(""); // Example text

let index = 0;

// Create the base grid items (with sub-cells)
for (let i = 0; i < 22 * 15; i++) {
    let gridItem = document.createElement('div');
    gridItem.className = 'grid-item';

    // Add sub-cells inside each grid item
    for (let j = 0; j < 4; j++) {
        let subCell = document.createElement('div');
        subCell.className = 'sub-cell';
        gridItem.appendChild(subCell);
    }

    gridContainer.appendChild(gridItem);
}

// Create the overlay grid items (with text)
for (let i = 0; i < 22 * 15; i++) {
    let overlayItem = document.createElement('div');
    overlayItem.className = 'overlay-item';

    // Add a letter from the text if available
    if (index < text.length) {
        overlayItem.textContent = text[index];
        index++;
    }

    overlayGrid.appendChild(overlayItem);
}