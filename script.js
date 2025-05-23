const channels = [
  'pube-otgnzx7hqk4',
  'possible-eggs'
];

const menuItems = [
  {
    title: 'pp',
    content: 'pp, pianissimo, very softy,             is a collection of                      personal projects   public performances pencil on paper     pocillum pottery    play without purpose                    starting with p,     made very quietly.'
    // title: 'p p',
    // content: '    is              personal projects   public performances pencil on paper     p pianissimo        pocillum pottery    play without purpose'
  }
];

const channelTitles = {
  'pube-otgnzx7hqk4': '<img src="./assets/pube.webp" alt="Full Row Image">'
};

const channelTitleRows = {
  'pube-otgnzx7hqk4': 1,
  'possible-eggs': 1
};

const channelBackgrounds = {
  'pube-otgnzx7hqk4': {
    hover: '',
    active: ''
  },
  'possible-eggs': {
    hover: '',
    active: ''
  }
};

const channelFonts = {
  'pube-otgnzx7hqk4':'"hiragino-mincho-pron", sans-serif',
  'possible-eggs': 'HMP'
};

const gridBorder = document.getElementById('grid-border');
const cols = 20;
const cellSize = 25;
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
      for (let j = 0; j < cols; j++) {
        container.appendChild(document.createElement('div'));
        totalCells++;
      }
    }
  }
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
    const gridWrapper = document.createElement('div');
    gridWrapper.className = 'grid-wrapper-inner';

    // Add title
    if (channelMeta.metadata?.description) {
      const descCells = addTextBlock(channelMeta.metadata.description, contentEl);
      totalCells += descCells;
    }

    // Add blocks (image, file, text)
    for (const block of blocks) {
      if (block.image?.display?.url) {
        const wrapper = document.createElement('div');
        wrapper.className = 'grid-image-wrapper';
        wrapper.style.gridColumn = 'span 20';
        wrapper.style.gridRow = 'span 18';
        wrapper.style.display = 'flex';
        wrapper.style.justifyContent = 'flex-start';
        wrapper.style.alignItems = 'flex-end';
        wrapper.style.width = '100%';

        const img = document.createElement('img');
        img.src = block.image.display.url;
        img.className = 'grid-image';
        img.style.width = '100%';
        img.style.height = `${18 * cellSize}px`;
        img.style.objectFit = 'contain';

        wrapper.appendChild(img);
        contentEl.appendChild(wrapper);
        totalCells += 20 * 18;
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
        const textCells = addTextBlock(text, contentEl);
        totalCells += textCells;
      }
    }

    // Adjust grid size based on content
    const rowsNeeded = Math.ceil(totalCells / cols);
    const wrapper = contentEl.closest('.grid-wrapper-inner');
    if (!wrapper) return;
    const oldGrid = wrapper.querySelector('.grid-columns-rows');
    if (oldGrid) oldGrid.remove();

    const newGrid = createGridStructure(rowsNeeded * cols);
    gridWrapper.appendChild(newGrid);
    wrapper.insertBefore(gridWrapper, contentEl);
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
    if (prevItem) prevItem.style.display = 'none';
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
    if (!loadedChannels.has(slug) && !slug.startsWith('menu-')) {
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
  const rowsAllowed = channelTitleRows[slug] || 1;
  const grid = createGridStructure(rowsAllowed * cols);
  const content = document.createElement('div');
  content.className = 'grid-content';

  const fontFamily = channelFonts[slug];
  if (fontFamily) {
    content.style.setProperty('font-family', fontFamily, 'important');
  }

  if (customHTML) {
    const tempEl = document.createElement('div');
    tempEl.innerHTML = customHTML;
    const img = tempEl.querySelector('img');
    if (img) {
      const imgWrapper = document.createElement('div');
      imgWrapper.style.gridColumn = 'span 20';
      imgWrapper.style.gridRow = `span ${rowsAllowed}`;
      imgWrapper.className = 'grid-image-wrapper';

      img.className = 'grid-image-fullwidth';
      img.style.width = '100%';
      img.style.height = `${rowsAllowed * cellSize}px`;
      img.style.objectFit = 'cover';
      img.style.cursor = 'pointer';

      img.addEventListener('click', () => toggleContent(contentId, slug));
      imgWrapper.appendChild(img);
      content.appendChild(imgWrapper);
    } else {
      const text = tempEl.innerText;
      const textContainer = document.createElement('div');
      textContainer.style.cursor = 'pointer';
      textContainer.addEventListener('click', () => toggleContent(contentId, slug));
      addTextBlock(text, textContainer);
      content.appendChild(textContainer);
    }
  } else {
    const title = channelData.title || `Channel ${index + 1}`;
    const maxCells = rowsAllowed * cols;
    for (const char of title.slice(0, maxCells)) {
      const item = createOverlayItem(char);
      item.style.cursor = 'pointer';
      item.addEventListener('click', () => toggleContent(contentId, slug));
      content.appendChild(item);
    }
    const padding = maxCells - title.length;
    for (let i = 0; i < padding; i++) {
      content.appendChild(document.createElement('div'));
    }
  }

  nameItem.addEventListener('mouseover', () => {
    if (channelBackgrounds[slug]?.hover) {
      document.body.style.background = channelBackgrounds[slug].hover;
    }
  });

  nameItem.addEventListener('mouseout', () => {
    document.body.style.background = '';
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
    const contentId = `menu-content-${index}`;
    const slug = `menu-${index}`;

    const titleItem = document.createElement('div');
    titleItem.className = 'grid-item channel-name';
    titleItem.style.cursor = 'pointer';
    titleItem.dataset.slug = slug;
    titleItem.addEventListener('click', () => toggleContent(contentId, slug));

    const wrapper = document.createElement('div');
    wrapper.className = 'grid-wrapper-inner';
    const grid = createGridStructure(cols);
    const titleContent = document.createElement('div');
    titleContent.className = 'grid-content';
    addTextBlock(menuData.title, titleContent);
    wrapper.appendChild(grid);
    wrapper.appendChild(titleContent);
    titleItem.appendChild(wrapper);
    gridBorder.appendChild(titleItem);

    const contentItem = document.createElement('div');
    contentItem.className = 'grid-item channel-content';
    contentItem.style.display = 'block';
    const menuGrid = createGridStructure(menuData.content.length);
    const menuContent = document.createElement('div');
    menuContent.className = 'grid-content';
    menuContent.id = contentId;
    addTextBlock(menuData.content, menuContent);
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'grid-wrapper-inner';
    contentWrapper.appendChild(menuGrid);
    contentWrapper.appendChild(menuContent);
    contentItem.appendChild(contentWrapper);
    gridBorder.appendChild(contentItem);
  });
  currentlyOpenId = `menu-content-0`;
}

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
  h = d.documentElement,
  t = setTimeout(function(){ h.className = h.className.replace(/\bwf-loading\b/g, '') + " wf-inactive"; }, config.scriptTimeout),
  tk = d.createElement("script"),
  f = false,
  s = d.getElementsByTagName("script")[0],
  a;
  h.className += " wf-loading";
  tk.src = 'https://use.typekit.net/' + config.kitId + '.js';
  tk.async = true;
  tk.onload = tk.onreadystatechange = function(){
    a = this.readyState;
    if (f || a && a !== "complete" && a !== "loaded") return;
    f = true;
    clearTimeout(t);
    try { Typekit.load(config); } catch(e) {}
  };
  s.parentNode.insertBefore(tk, s);
})(document);

