const gridContainer = document.querySelector('.grid-container');
const textGrid = document.querySelector('.text-grid');
const text = "HELLOTHISISAGRIDTESTHELLOTHISISAGRIDTEST".split(""); // Example text

let index = 0;
for (let i = 0; i < 22 * 15; i++) {
    let gridItem = document.createElement('div');
    gridItem.className = 'grid-item';

    // Create sub-grid (sub-cells)
    let subGrid = document.createElement('div');
    subGrid.className = 'sub-grid';

    // Add subdivisions (sub-cells)
    for (let j = 0; j < 4; j++) {
        let subCell = document.createElement('div');
        subCell.className = 'sub-cell';
        subGrid.appendChild(subCell);
    }
    gridItem.appendChild(subGrid);
    gridContainer.appendChild(gridItem);

    // Create text grid item
    let textItem = document.createElement('div');
    textItem.className = 'text-item';

    // Add a letter from the text if available
    if (index < text.length) {
        textItem.textContent = text[index];
        index++;
    }
    textGrid.appendChild(textItem);
}