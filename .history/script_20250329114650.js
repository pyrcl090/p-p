const gridContainer = document.querySelector('.grid-container');
const text = "HELLOTHISISAGRIDTESTHELLOTHISISAGRIDTEST".split(""); // Example text

let index = 0;
for (let i = 0; i < 22 * 15; i++) {
    let gridItem = document.createElement('div');
    gridItem.className = 'grid-item';

    // Add subdivisions
    for (let j = 0; j < 4; j++) {
        let subCell = document.createElement('div');
        subCell.className = 'sub-cell';
        gridItem.appendChild(subCell);
    }

    // Add a letter from the text if available
    if (index < text.length) {
        gridItem.textContent = text[index];
        index++;
    }

    gridContainer.appendChild(gridItem);
}