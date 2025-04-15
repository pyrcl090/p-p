// Helper to generate random integer between min and max
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  // Pull image blocks and filter out only valid image URLs
  const imageBlocks = blocks.filter(block => block.image && block.image.display && block.image.display.url);
  
  // Create a container to track occupied grid cells so we don’t overlap
  const occupiedCells = new Set();
  
  // Helper to mark grid cells as occupied
  function occupyCells(startRow, startCol, height, width) {
    for (let r = startRow; r < startRow + height; r++) {
      for (let c = startCol; c < startCol + width; c++) {
        occupiedCells.add(`${r},${c}`);
      }
    }
  }
  
  // Check if the area is free
  function isAreaFree(startRow, startCol, height, width, maxRows, maxCols) {
    if (startRow + height > maxRows || startCol + width > maxCols) return false;
    for (let r = startRow; r < startRow + height; r++) {
      for (let c = startCol; c < startCol + width; c++) {
        if (occupiedCells.has(`${r},${c}`)) return false;
      }
    }
    return true;
  }
  
  // Add images to grid
  const maxRows = rows; // already calculated from text length
  const maxCols = cols;
  
  imageBlocks.forEach(block => {
    const imageUrl = block.image.display.url;
    const imageAlt = block.title || '';
  
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = imageAlt;
    img.className = 'grid-image';
  
    // Random size
    const imgWidth = randomInt(3, 8);
    const imgHeight = randomInt(2, 5);
  
    // Try up to 100 times to find a free spot
    let placed = false;
    for (let tries = 0; tries < 100 && !placed; tries++) {
      const row = randomInt(0, maxRows - imgHeight);
      const col = randomInt(0, maxCols - imgWidth);
  
      if (isAreaFree(row, col, imgHeight, imgWidth, maxRows, maxCols)) {
        occupyCells(row, col, imgHeight, imgWidth);
  
        img.style.gridRow = `${row + 1} / span ${imgHeight}`;
        img.style.gridColumn = `${col + 1} / span ${imgWidth}`;
        img.style.justifySelf = Math.random() > 0.5 ? 'start' : 'end';
  
        overlayGrid.appendChild(img);
        placed = true;
      }
    }
  });
  