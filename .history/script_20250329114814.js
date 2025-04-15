const gridContainer = document.querySelector('.grid-container');
const text = "HELLOTHISISAGRIDTESTHELLOTHISISAGRIDTEST".split(""); // Example text

let index = 0;
for (let i = 0; i < 22 * 15; i++) {
    let gridItem = document.createElement('div');
    gridItem.className = 'grid-item';

    // Create sub-grid
    let subGrid = document.createElement('div');
    subGrid.className = 'sub-grid';
    
    // Add subdivisions
    for (let j = 0; j < 4; j++) {
        let subCell = document.createElement('div');
        subCell.className = 'sub-cell';
        subGrid.appendChild(subCell);
    }
    gridItem.appendChild(subGrid);

    // Add a letter from the text if available
    if (index < text.length) {
        let textNode = document.createElement('span');
        textNode.textContent = text[index];
        gridItem.appendChild(textNode);
        index++;
    }

    gridContainer.appendChild(gridItem);
}