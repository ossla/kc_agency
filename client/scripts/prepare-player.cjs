const fs = require('node:fs');
const path = require('node:path');
const root = path.dirname(require.resolve('plyr'));
fs.copyFileSync(path.join(root, 'plyr.svg'), path.join(__dirname, '../public/plyr.svg'));
