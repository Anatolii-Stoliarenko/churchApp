const fs = require('fs');
const path = require('path');
const packageJson = require('../package.json');

const environment = process.argv[2] || 'development';

const versionFilePath = path.join(__dirname, '../src/environments/version.ts');

const now = new Date();
const formattedDate = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;

const content = `
export const VERSION = {
  version: '${packageJson.version}',
  environment: '${environment}',
  data: '${formattedDate}'
};
`;

fs.writeFileSync(versionFilePath, content.trim() + '\n');
console.log(`✅ Generated version.ts: ${packageJson.version} (${environment})`);
