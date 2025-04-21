const channels = [
  'p-ppianissimo',
  'l-horreur'
];

const menuItems = [
  {
    title: 'p p',
    content: '                          is a collection of personal projects by a p.'
  }
];

const channelTitles = {
  'p-ppianissimo': '',
  'l-horreur': ''
};

const channelBackgrounds = {
  'p-ppianissimo': {
    hover: 'light pink',
    active: ''
  },
  'example-channel-2': {
    hover: '#e0e0e0',
    active: '#c0c0c0'
  }
};

const channelFonts = {
  'p-ppianissimo': '"hiragino-mincho-pron", sans-serif',
  'l-horreur': '"Courier New", monospace'
};

const gridBorder = document.getElementById('grid-border');
const cols = 15;
const cellSize = 30;
let currentlyOpenId = null;
const loadedChannels = new Set();

function createGridStructure(numItems) {
  console.log(`Creating grid with ${numItems} total cells.`); // Log for debugging
  const grid = document.createElement('div');
  grid.className = 'grid-columns-rows';
  const rows = Math.ceil(numItems / cols);
  const totalCells = rows * cols;
  
  console.log(`Grid will have ${rows} rows and ${totalCells} total cells.`); // Log for debugging

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

function addTextBlock(rawText, container) {
  let totalCells = 0;

  const parts = rawText.split('<br>');
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];

    for (const char of part) {
      const div = createOverlayItem(char);
      container.appendChild(div);
      totalCells++;
    }

    const remainder = part.length % cols;
    if (remainder !== 0) {
      const padding = cols - remainder;
      for (let j = 0; j < padding; j++) {
        container.appendChild(document.createElement('div'));
        totalCells++;
      }
    }

    if (i < parts.length - 1) {
      // Add empty row (15 cols)
      console.log(`Adding empty row after <br> at index ${i}.`); // Log for debugging
      for (let j = 0; j < cols; j++) {
        container.appendChild(document.createElement('div'));
        totalCells++;
      }
    }
  }

  console.log(`Total cells after adding text block: ${totalCells}`); // Log for debugging
  return totalCells;
}

async function fetchAllBlocks(slug) {
  let page = 1;
  let blocks = [];
  let hasMore = true;

  while (hasMore) {
    const res = await fetch(`https://api.are.na/v2/channels/${slug}?per=100&page=${page}`);
    const data = await res.json();
    blocks = blocks.concat(data.contents);
    hasMore = data.contents.length === 100;
    page++;
  }

  return blocks;
}

async function fillChannelContent(contentEl, slug) {
  try {
    const [channelMeta, blocks] = await Promise.all([
      fetch(`https://api.are.na/v2/channels/${slug}?per=1`).then(res => res.json()),
      fetchAllBlocks(slug)
    ]);

    const fontFamily = channelFonts[slug];
    if (fontFamily && contentEl instanceof HTMLElement) {
      contentEl.style.setProperty('font-family', fontFamily, 'important');
    }

    let totalCells = 0;

    if (channelMeta.metadata?.description) {
      totalCells += addTextBlock(channelMeta.metadata.description, contentEl);
    }

    for (const block of blocks) {
      if (block.image?.display?.url) {
        const img = document.createElement('img');
        img.src = block.image.display.url;
        img.className = 'grid-image';

        const colSpan = 15;
        const rowSpan = 10;

        img.style.gridColumn = `span ${colSpan}`;
        img.style.gridRow = `span ${rowSpan}`;
        img.style.justifySelf = Math.random() > 0.5 ? 'flex-start' : 'flex-end';

        contentEl.appendChild(img);
        totalCells += colSpan * rowSpan;
      }

      if (block.file?.url) {
        const fileLink = document.createElement('a');
        fileLink.href = block.file.url;
        fileLink.target = '_blank';
        fileLink.textContent = `View file: ${block.file.name || 'Document'}`;
        contentEl.appendChild(fileLink);
        contentEl.appendChild(document.createElement('br'));
        totalCells += 2;
      }

      const text = block.content || block.title || block.body || '';
      if (text) {
        totalCells += addTextBlock(text, contentEl);
      }
    }

    const rowsNeeded = Math.ceil(totalCells / cols);
    const totalCellsNeeded = rowsNeeded * cols;

    console.log(`Total cells needed: ${totalCellsNeeded}`); // Log for debugging

    const wrapper = contentEl.closest('.grid-wrapper-inner');
    const oldGrid = wrapper.querySelector('.grid-columns-rows');
    if (oldGrid) oldGrid.remove();

    const newGrid = createGridStructure(totalCellsNeeded);
    wrapper.insertBefore(newGrid, contentEl);

    loadedChannels.add(slug);
  } catch (error) {
    console.error(`Error filling content for ${slug}:`, error);
  }
}

function toggleContent(id, slug) {
  const contentWrapper = document.getElementById(id);
  const contentItem = contentWrapper.closest('.channel-content');

  if (currentlyOpenId && currentlyOpenId !== id) {
    const prevWrapper = document.getElementById(currentlyOpenId);
    const prevItem = prevWrapper?.closest('.channel-content');
    if (prevItem) {
      prevItem.style.display = 'none';
      console.log(`Closed previous content: ${currentlyOpenId}`); // Log for debugging
    }
    document.body.style.background = '';
  }

  const isOpen = contentItem.style.display === 'block';

  if (isOpen) {
    contentItem.style.display = 'none';
    currentlyOpenId = null;
    document.body.style.background = '';
  } else {
    contentItem.style.display = 'block';
    currentlyOpenId = id;

    if (!loadedChannels.has(slug)) {
      fillChannelContent(contentWrapper, slug);
    }

    if (channelBackgrounds[slug]?.active) {
      document.body.style.background = channelBackgrounds[slug].active;
    }
  }
}

function createChannelItem(channelData, index) {
  const slug = channelData.slug;
  const contentId = `channel-content-${index}`;
  const customHTML = channelTitles[slug] || null;
  const nameItem = document.createElement('div');
  nameItem.className = 'grid-item channel-name';
  nameItem.dataset.slug = slug;

  const wrapper = document.createElement('div');
  wrapper.className = 'grid-wrapper-inner';

  const grid = createGridStructure(cols);
  const content = document.createElement('div');
  content.className = 'grid-content';

  const fontFamily = channelFonts[slug];
  if (fontFamily) {
    content.style.setProperty('font-family', fontFamily, 'important');
  }

  if (customHTML) {
    const isImage = /<img/i.test(customHTML.trim());
    if (isImage) {
      const customContainer = document.createElement('div');
      customContainer.innerHTML = customHTML;
      customContainer.style.gridColumn = `span ${cols}`;
      customContainer.style.gridRow = `span 1`;
      customContainer.style.cursor = 'pointer';
      customContainer.addEventListener('click', () => toggleContent(contentId, slug));
      content.appendChild(customContainer);
    } else {
      const tempEl = document.createElement('div');
      tempEl.innerHTML = customHTML;
      const text = tempEl.innerText;
      const textContainer = document.createElement('div');
      textContainer.style.cursor = 'pointer';
      textContainer.addEventListener('click', () => toggleContent(contentId, slug));
      addTextBlock(text, textContainer);
      content.appendChild(textContainer);
    }
  } else {
    const title = channelData.title || `Channel ${index + 1}`;
    for (const char of title) {
      const item = createOverlayItem(char);
      item.style.cursor = 'pointer';
      item.addEventListener('click', () => toggleContent(contentId, slug));
      content.appendChild(item);
    }
  }

  nameItem.addEventListener('mouseover', () => {
    if (channelBackgrounds[slug]?.hover) {
      document.body.style.background = channelBackgrounds[slug].hover;
    }
  });

  nameItem.addEventListener('mouseout', () => {
    if (currentlyOpenId !== contentId) {
      document.body.style.background = '';
    }
  });

  wrapper.appendChild(grid);
  wrapper.appendChild(content);
  nameItem.appendChild(wrapper);
  gridBorder.appendChild(nameItem);

  const contentItem = document.createElement('div');
  contentItem.className = 'grid-item channel-content';
  contentItem.style.display = 'none';

  const contentGrid = createGridStructure(200);
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

function renderMenu() {
  menuItems.forEach((menuData, index) => {
    const text = `${menuData.title}\n${menuData.content}`;
    const textLength = text.length;

    const menuItem = document.createElement('div');
    menuItem.className = 'grid-item channel-content';
    menuItem.style.display = 'block';

    const menuGrid = createGridStructure(textLength);
    const menuContent = document.createElement('div');
    menuContent.className = 'grid-content';

    addTextBlock(text, menuContent);

    const menuWrapper = document.createElement('div');
    menuWrapper.className = 'grid-wrapper-inner';
    menuWrapper.appendChild(menuGrid);
    menuWrapper.appendChild(menuContent);

    menuItem.appendChild(menuWrapper);
    gridBorder.appendChild(menuItem);
  });
}

// Initialize
renderMenu();

channels.forEach((slug, index) => {
  fetch(`https://api.are.na/v2/channels/${slug}?per=1`)
    .then(res => res.json())
    .then(data => {
      data.slug = slug;
      createChannelItem(data, index);
    });
});

(function(d) {
  var config = {
    kitId: 'sho3ojz',
    scriptTimeout: 3000,
    async: true
  },
  h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\bwf-loading\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
})(document);
