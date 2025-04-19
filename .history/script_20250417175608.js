// const channels = [
//     'p-pp-vz1bkeezvp0',
//     'read-re_d-rode',
//     'putaiinnnnn'
//   ];
  
//   const gridContainer = document.querySelector('.grid-container');
//   const cols = 15;
//   const rows = 40;
//   const cellSize = 30;
//   let currentlyOpenId = null;
//   const loadedChannels = new Set();
  
//   // Set up the grid container layout
//   gridContainer.style.display = 'grid';
//   gridContainer.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;
//   gridContainer.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;
//   gridContainer.style.position = 'relative';
//   gridContainer.style.zIndex = '1';
  
//   // 👉 Create the background subgrid (with dashed sub-cells)
//   function createSubgrid(rows = 40, cols = 15) {
//     for (let i = 0; i < rows * cols; i++) {
//       const cell = document.createElement('div');
//       cell.className = 'grid-item';
  
//       for (let j = 0; j < 4; j++) {
//         const sub = document.createElement('div');
//         sub.className = 'sub-cell';
//         cell.appendChild(sub);
//       }
  
//       gridContainer.appendChild(cell);
//     }
//   }
  
//   createSubgrid(); // Call it once on page load
  
//   // 👉 Helper to create one character block
//   function createGridItem(char, isLink = false, href = '') {
//     const div = document.createElement('div');
//     div.className = 'overlay-item';
//     div.style.pointerEvents = isLink ? 'auto' : 'none';
  
//     if (isLink) {
//       const a = document.createElement('a');
//       a.href = href;
//       a.target = '_blank';
//       a.textContent = char;
//       a.style.textDecoration = 'none';
//       a.style.color = 'inherit';
//       div.appendChild(a);
//     } else {
//       div.textContent = char;
//     }
  
//     return div;
//   }
  
//   // 👉 Wrapper for title + content
//   function createChannelContainer(channelIndex) {
//     const wrapper = document.createElement('div');
//     wrapper.className = 'channel-wrapper';
//     wrapper.dataset.index = channelIndex;
//     wrapper.style.display = 'contents'; // Keeps grid layout intact
//     return wrapper;
//   }
  
//   // 👉 Layout the channel title and clickable toggle
//   function placeChannelTitle(channelData, channelIndex) {
//     const title = channelData.title || `Channel ${channelIndex + 1}`;
//     const wrapper = createChannelContainer(channelIndex);
//     const toggleId = `channel-content-${channelIndex}`;
  
//     for (const char of title) {
//       const item = createGridItem(char);
//       item.style.cursor = 'pointer';
//       item.style.pointerEvents = 'auto';
//       item.addEventListener('click', () => toggleChannel(toggleId, channelData.slug, wrapper));
//       wrapper.appendChild(item);
//     }
  
//     for (let i = title.length; i < cols; i++) {
//       const spacer = document.createElement('div');
//       wrapper.appendChild(spacer);
//     }
  
//     const contentContainer = document.createElement('div');
//     contentContainer.id = toggleId;
//     contentContainer.classList.add('channel-content');
//     contentContainer.style.gridColumn = `1 / span ${cols}`;
//     contentContainer.style.display = 'none';
//     contentContainer.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;
//     contentContainer.style.gridAutoRows = `${cellSize}px`;
//     contentContainer.style.display = 'grid';
//     contentContainer.style.gap = '2px';
//     contentContainer.style.zIndex = '2';
//     contentContainer.style.position = 'relative';
  
//     wrapper.appendChild(contentContainer);
//     gridContainer.appendChild(wrapper);
//   }
  
//   // 👉 Lays out text left-to-right inside content area
//   function placeTextBlock(text, container) {
//     for (const char of text) {
//       const div = createGridItem(char);
//       container.appendChild(div);
//     }
  
//     const remainder = text.length % cols;
//     if (remainder !== 0) {
//       for (let i = 0; i < cols - remainder; i++) {
//         container.appendChild(document.createElement('div'));
//       }
//     }
//   }
  
//   // 👉 Toggle a channel content block open/closed
//   function toggleChannel(id, slug, wrapper) {
//     if (currentlyOpenId && currentlyOpenId !== id) {
//       const prev = document.getElementById(currentlyOpenId);
//       if (prev) prev.style.display = 'none';
//     }
  
//     const contentEl = document.getElementById(id);
//     const isOpen = contentEl.style.display === 'grid';
  
//     if (isOpen) {
//       contentEl.style.display = 'none';
//       currentlyOpenId = null;
//       return;
//     }
  
//     currentlyOpenId = id;
//     contentEl.style.display = 'grid';
  
//     if (!loadedChannels.has(slug)) {
//       fetch(`https://api.are.na/v2/channels/${slug}?per=100`)
//         .then(res => res.json())
//         .then(data => {
//           if (data.metadata?.description) {
//             placeTextBlock(data.metadata.description + '\n', contentEl);
//           }
  
//           data.contents.forEach(block => {
//             if (block.image?.display?.url) {
//               const img = document.createElement('img');
//               img.src = block.image.display.url;
//               img.className = 'grid-image';
//               img.style.gridColumn = `span 8`;
//               img.style.gridRow = `span 5`;
//               img.style.width = '100%';
//               img.style.height = '100%';
//               img.style.objectFit = 'contain';
//               img.style.opacity = '0.85';
//               contentEl.appendChild(img);
  
//               // 👉 Add a full-width line break after each image
//               const lineBreak = document.createElement('div');
//               lineBreak.style.gridColumn = '1 / -1';
//               contentEl.appendChild(lineBreak);
//             }
  
//             const text = (block.title || block.content || '') + '\n';
//             placeTextBlock(text, contentEl);
//           });
  
//           loadedChannels.add(slug);
//         });
//     }
//   }
  
//   // 👉 Load each channel's title only (quick)
//   channels.forEach((slug, index) => {
//     fetch(`https://api.are.na/v2/channels/${slug}?per=1`)
//       .then(res => res.json())
//       .then(data => {
//         data.slug = slug;
//         placeChannelTitle(data, index);
//       });
//   });
  

const channels = [
    'p-pp-vz1bkeezvp0',
    'read-re_d-rode',
    'putaiinnnnn'
  ];
  
  const gridBorder = document.getElementById('grid-border');
  const cols = 15;
  const rows = 0;
  const cellSize = 30;
  let currentlyOpenId = null;
  const loadedChannels = new Set();
  
  // 👉 Creates the visual background grid
  function createGridStructure() {
    const grid = document.createElement('div');
    grid.className = 'grid-columns-rows';
  
    for (let i = 0; i < cols * rows; i++) {
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
  
  // 👉 Creates a styled character block
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
  
  // 👉 Creates a grid-content block and fills text/images into it
  function fillChannelContent(contentEl, slug) {
    fetch(`https://api.are.na/v2/channels/${slug}?per=100`)
      .then(res => res.json())
      .then(data => {
        if (data.metadata?.description) {
          addTextBlock(data.metadata.description, contentEl);
        }
  
        data.contents.forEach(block => {
          if (block.image?.display?.url) {
            const img = document.createElement('img');
            img.src = block.image.display.url;
            img.className = 'grid-image';
            img.style.gridColumn = `span ${Math.floor(Math.random() * 6) + 3}`;
            img.style.gridRow = `span 5`;
            contentEl.appendChild(img);
          }
  
          const text = (block.title || block.content || '') + '\n';
          addTextBlock(text, contentEl);
        });
  
        loadedChannels.add(slug);
      });
  }
  
  // 👉 Adds characters as overlay items inside the content block
  function addTextBlock(text, container) {
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
  
  // 👉 Toggle open/close state of a content block
  function toggleContent(id, slug) {
    if (currentlyOpenId && currentlyOpenId !== id) {
      const prev = document.getElementById(currentlyOpenId);
      if (prev) prev.parentElement.style.display = 'none';
    }
  
    const contentWrapper = document.getElementById(id);
    const isOpen = contentWrapper.parentElement.style.display === 'block';
  
    if (isOpen) {
      contentWrapper.parentElement.style.display = 'none';
      currentlyOpenId = null;
    } else {
      contentWrapper.parentElement.style.display = 'block';
      currentlyOpenId = id;
  
      if (!loadedChannels.has(slug)) {
        fillChannelContent(contentWrapper, slug);
      }
    }
  }
  
  // 👉 Create each channel name + content
  function createChannelItem(channelData, index) {
    const slug = channelData.slug;
    const title = channelData.title || `Channel ${index + 1}`;
    const contentId = `channel-content-${index}`;
  
    // Create channel name item
    const nameItem = document.createElement('div');
    nameItem.className = 'grid-item channel-name';
  
    const grid = createGridStructure();
    const content = document.createElement('div');
    content.className = 'grid-content';
  
    for (const char of title) {
      const item = createOverlayItem(char);
      item.style.cursor = 'pointer';
      item.addEventListener('click', () => toggleContent(contentId, slug));
      content.appendChild(item);
    }
  
    nameItem.appendChild(grid);
    nameItem.appendChild(content);
    gridBorder.appendChild(nameItem);
  
    // Create hidden content block
    const contentItem = document.createElement('div');
    contentItem.className = 'grid-item channel-content';
    contentItem.style.display = 'none';
  
    const contentGrid = createGridStructure();
    const contentOverlay = document.createElement('div');
    contentOverlay.className = 'grid-content';
    contentOverlay.id = contentId;
  
    contentItem.appendChild(contentGrid);
    contentItem.appendChild(contentOverlay);
    gridBorder.appendChild(contentItem);
  }
  
  // 👉 Fetch channel data and create the UI
  channels.forEach((slug, index) => {
    fetch(`https://api.are.na/v2/channels/${slug}?per=1`)
      .then(res => res.json())
      .then(data => {
        data.slug = slug;
        createChannelItem(data, index);
      });
  });
  