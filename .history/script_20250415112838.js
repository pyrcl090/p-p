const overlayGrid = document.querySelector('.overlay-grid');

// Fetch from Are.na
fetch('https://api.are.na/v2/channels/rusalka?per=100')
  .then(res => res.json())
  .then(data => {
    const blocks = data.contents;
    const textArray = blocks.map(block => block.title || block.content || '').join(' ').split("");

    const cols = 15;
    const rows = Math.ceil(textArray.length / cols);

    overlayGrid.style.gridTemplateRows = `repeat(${rows}, 30px)`;

    for (let i = 0; i < textArray.length; i++) {
      const overlayItem = document.createElement('div');
      overlayItem.className = 'overlay-item';
      overlayItem.textContent = textArray[i];
      overlayGrid.appendChild(overlayItem);
    }
  });
