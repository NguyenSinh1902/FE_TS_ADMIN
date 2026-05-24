const fs = require('fs');
const path = require('path');

const screens = ['Dashboard', 'Menu', 'StaffManagement', 'Facility', 'Finance', 'AIHistory'];

screens.forEach(screen => {
  const p = path.join('src', 'screens', screen, 'index.js');
  if (!fs.existsSync(p)) return;

  let content = fs.readFileSync(p, 'utf-8');
  const before = content;

  // Remove `import Sidebar ...` lines (in case any remain)
  content = content.replace(/^import Sidebar from ['"].*?['"];?\r?\n/gm, '');
  content = content.replace(/^import BottomNav from ['"].*?['"];?\r?\n/gm, '');

  // Remove <Sidebar ... /> multi-line blocks
  // Match opening <Sidebar or <Sidebar\n, attributes, and closing />
  content = content.replace(/<Sidebar\s[^>]*?\/>/gs, '');
  content = content.replace(/<Sidebar\r?\n[\s\S]*?\/>/g, '');

  // Remove <BottomNav ... /> multi-line blocks
  content = content.replace(/<BottomNav\s[^>]*?\/>/gs, '');
  content = content.replace(/<BottomNav\r?\n[\s\S]*?\/>/g, '');

  if (content !== before) {
    fs.writeFileSync(p, content);
    console.log('Cleaned: ' + screen);
  } else {
    console.log('No change: ' + screen);
  }
});
