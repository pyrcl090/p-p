const gridContainer = document.querySelector('.grid-container');
const overlayGrid = document.querySelector('.overlay-grid');

// Step 1: Add your menu line
const menuText = "p, p text about etc".split("");
const menuLink = "https://are.na/rusalka";

// Step 2: Fetch Are.na content
fetch('https://api.are.na/v2/channels/rusalka?per=100')
  .then(res => res.json())
  .then(data => {
    const blocks = data.contents;
    const rowsArray = [];

    // Add menu row first
    const menuRow = menuText.map((char, i) => ({
      char,
      link: menuLink
    }));
    rowsArray.push(menuRow); // row 0

    // Add a blank line as a spacer
    const spacerRow = Array(15).fill({ char: " ", link: null });
    rowsArray.push(spacerRow); // row 1

    // Add Are.na text rows
    blocks.forEach(block => {
      const content = (block.title || block.content || '').trim();
      const link = block.source?.url;
      const lines = content.split(/\r?\n/);

      lines.forEach(line => {
        const charObjects = line.split('').map((char, i) => ({
          char,
          link: i === 0 && link ? link : null
        }));
        rowsArray.push(charObjects);
      });
    });

    const cols = 15;
    const rows = rowsArray.length;

    // Apply grid dimensions
    overlayGrid.style.gridTemplateRows = `repeat(${rows}, 30px)`;
    overlayGrid.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
    gridContainer.style.gridTemplateRows = `repeat(${rows}, 30px)`;
    gridContainer.style.gridTemplateColumns = `repeat(${cols}, 30px)`;

    // Build grid
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

        // Overlay cell
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
            a.style.textDecoration = "none";
            overlayItem.appendChild(a);
          } else {
            overlayItem.textContent = char;
          }
        }

        overlayGrid.appendChild(overlayItem);
      }
    }
  });


