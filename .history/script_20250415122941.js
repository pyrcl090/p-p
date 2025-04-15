const gridContainer = document.querySelector('.grid-container');
const overlayGrid = document.querySelector('.overlay-grid');

fetch('https://api.are.na/v2/channels/rusalka?per=100')
  .then(res => res.json())
  .then(data => {
    const blocks = data.contents;
    const rowsArray = [];

    blocks.forEach(block => {
      const content = (block.title || block.content || '').trim();
      const link = block.source?.url;

      // Split block content into lines
      const lines = content.split(/\r?\n/);

      lines.forEach(line => {
        const charObjects = line.split('').map((char, i) => ({
          char,
          link: i === 0 && link ? link : null // link only the first char of each block
        }));
        rowsArray.push(charObjects);
      });
    });

    const cols = 15;
    const rows = rowsArray.length;
    const totalCells = rows * cols;

    // Set grid dimensions
    overlayGrid.style.gridTemplateRows = `repeat(${rows}, 1.35em)`;
    overlayGrid.style.gridTemplateColumns = `repeat(${cols}, 1.35em)`;
    gridContainer.style.gridTemplateRows = `repeat(${rows}, 30px)`;
    gridContainer.style.gridTemplateColumns = `repeat(${cols}, 30px)`;

    // Build grid structure row-by-row
    for (let r = 0; r < rows; r++) {
      const row = rowsArray[r];
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;

        // Base grid cell
        const gridItem = document.createElement('div');
        gridItem.className = 'grid-item';
        for (let j = 0; j < 4; j++) {
          const subCell = document.createElement('div');
          subCell.className = 'sub-cell';
          gridItem.appendChild(subCell);
        }
        gridContainer.appendChild(gridItem);

        // Overlay text cell
        const overlayItem = document.createElement('div');
        overlayItem.className = 'overlay-item';

        if (c < row.length) {
          const { char, link } = row[c];
          if (link) {
            const a = document.createElement('a');
            a.href = link;
            a.target = "_blank";
            a.textContent = char;
            a.style.pointerEvents = "auto";
            overlayItem.appendChild(a);
          } else {
            overlayItem.textContent = char;
          }
        }

        overlayGrid.appendChild(overlayItem);
      }
    }
  });
