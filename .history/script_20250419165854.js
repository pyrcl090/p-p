

const channels = [
  'p-pp-vz1bkeezvp0',
  'read-re_d-rode',
  'putaiinnnnn'
];

const gridBorder = document.getElementById('grid-border');
const cols = 15;
const cellSize = 30;
let currentlyOpenId = null;
const loadedChannels = new Set();

function createGridStructure(numItems) {
  const grid = document.createElement('div');
  grid.className = 'grid-columns-rows';
  const rows = Math.ceil(numItems / cols);
  const totalCells = rows * cols;

  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-item';

    for (let j = 0; j < 4; j++) {
      const sub = document.createElement('div');
      sub.className = 'sub-cell';
      cell.appendChild(sub);
    }

    grid.appendChild(cell);
  }

  return grid;
}

function createOverlayItem(char, isLink = false, href = '') {
  const div = document.createElement('div');
  div.className = 'overlay-item';

  if (isLink) {
    const a = document.createElement('a');
    a.href = href;
    a.target = '_blank';
    a.textContent = char;
    a.style.textDecoration = 'none';
    a.style.color = 'inherit';
    div.appendChild(a);
  } else {
    div.textContent = char;
  }

  return div;
}

function addTextBlock(text, container) {
  console.log(`Adding text block: ${text}`);  // Log the text being added
  for (const char of text) {
    const div = createOverlayItem(char);
    container.appendChild(div);
  }

  const remainder = text.length % cols;
  if (remainder !== 0) {
    for (let i = 0; i < cols - remainder; i++) {
      container.appendChild(document.createElement('div'));
    }
  }
}

function fillChannelContent(contentEl, slug) {
  console.log('Fetching content for channel:', slug);
  fetch(`https://api.are.na/v2/channels/${slug}?per=100`)
    .then(res => res.json())
    .then(data => {
      let totalCells = 0;  // Track the total number of cells used

      // Check for metadata description and log it
      if (data.metadata?.description) {
        console.log(`Channel description: ${data.metadata.description}`);
        addTextBlock(data.metadata.description, contentEl);
        totalCells += data.metadata.description.length;
        totalCells += (cols - (data.metadata.description.length % cols)) % cols;  // Fill remaining columns in row
      }

      // Loop through the content blocks (images, text, PDFs)
      data.contents.forEach(block => {
        console.log(`Processing block:`, block);  // Log the block data

        if (block.image?.display?.url) {
          // Handle Image blocks
          console.log('Found image block:', block.image.display.url);
          const img = document.createElement('img');
          img.src = block.image.display.url;
          img.className = 'grid-image';

          const colSpan = 15;  // Image should always span 15 columns
          const rowSpan = 10;  // Image should always span 5 rows

          img.style.gridColumn = `span ${colSpan}`;
          img.style.gridRow = `span ${rowSpan}`;

          // Randomly align the image left or right
          img.style.justifySelf = Math.random() > 0.5 ? 'flex-start' : 'flex-end';

          contentEl.appendChild(img);

          // After the image, we move to the next row
          totalCells += colSpan * rowSpan;  // Add the image's cell span to total count
        }

        if (block.file?.url) {
          // Handle PDF or other file blocks
          console.log('Found file block:', block.file.url);
          const fileLink = document.createElement('a');
          fileLink.href = block.file.url;
          fileLink.target = '_blank';
          fileLink.textContent = `View file: ${block.file.name || 'Document'}`;
          contentEl.appendChild(fileLink);
          contentEl.appendChild(document.createElement('br'));

          totalCells += 2;  // Link and line break
        }

        // Handle Text Blocks (Title or Content)
        const text = block.content || block.title || block.body || ''; // Grab text from multiple fields
        if (text) {
          console.log(`Found text block: ${text}`);  // Log the text block
          addTextBlock(text, contentEl);
          totalCells += text.length;
          totalCells += (cols - (text.length % cols)) % cols;  // Fill remaining columns in row
        }
      });

      // After collecting all content, recalculate total rows and cells required
      const rowsNeeded = Math.ceil(totalCells / cols); // How many rows are needed to fit everything
      const totalCellsNeeded = rowsNeeded * cols;  // Adjust the total cell count
      console.log(`Total content cells: ${totalCells}, allocating ${rowsNeeded} rows (${totalCellsNeeded} cells)`);

      const wrapper = contentEl.closest('.grid-wrapper-inner');
      const oldGrid = wrapper.querySelector('.grid-columns-rows');
      if (oldGrid) oldGrid.remove();  // Remove old grid structure if it exists

      const newGrid = createGridStructure(totalCellsNeeded);  // Create a new grid structure with calculated total cells
      wrapper.insertBefore(newGrid, contentEl);  // Insert new grid structure before the content

      loadedChannels.add(slug);
      console.log(`Content added for channel: ${slug}`);
    })
    .catch(error => console.error(`Error fetching data for channel ${slug}:`, error));
}

function toggleContent(id, slug) {
  console.log(`Toggling content for ID: ${id}, slug: ${slug}`);
  const contentWrapper = document.getElementById(id);
  const contentItem = contentWrapper.closest('.channel-content');

  if (currentlyOpenId && currentlyOpenId !== id) {
    const prevWrapper = document.getElementById(currentlyOpenId);
    const prevItem = prevWrapper?.closest('.channel-content');
    if (prevItem) prevItem.style.display = 'none';
  }

  const isOpen = contentItem.style.display === 'block';

  if (isOpen) {
    contentItem.style.display = 'none';
    currentlyOpenId = null;
  } else {
    contentItem.style.display = 'block';
    currentlyOpenId = id;

    if (!loadedChannels.has(slug)) {
      fillChannelContent(contentWrapper, slug);
    }
  }
}

function createChannelItem(channelData, index) {
  const slug = channelData.slug;
  const title = channelData.title || `Channel ${index + 1}`;
  const contentId = `channel-content-${index}`;

  const nameItem = document.createElement('div');
  nameItem.className = 'grid-item channel-name';

  const grid = createGridStructure(title.length);
  const content = document.createElement('div');
  content.className = 'grid-content';

  for (const char of title) {
    const item = createOverlayItem(char);
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => toggleContent(contentId, slug));
    content.appendChild(item);
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'grid-wrapper-inner';
  wrapper.appendChild(grid);
  wrapper.appendChild(content);
  nameItem.appendChild(wrapper);
  gridBorder.appendChild(nameItem);

  const contentItem = document.createElement('div');
  contentItem.className = 'grid-item channel-content';
  contentItem.style.display = 'none'; // Start hidden

  const contentGrid = createGridStructure(200); // placeholder size, updates dynamically
  const contentOverlay = document.createElement('div');
  contentOverlay.className = 'grid-content';
  contentOverlay.id = contentId;

  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'grid-wrapper-inner';
  contentWrapper.appendChild(contentGrid);
  contentWrapper.appendChild(contentOverlay);

  contentItem.appendChild(contentWrapper);
  gridBorder.appendChild(contentItem);
}

channels.forEach((slug, index) => {
  fetch(`https://api.are.na/v2/channels/${slug}?per=1`)
    .then(res => res.json())
    .then(data => {
      data.slug = slug;
      createChannelItem(data, index);
    });
});
