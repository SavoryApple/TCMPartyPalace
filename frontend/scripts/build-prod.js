const fs = require('fs');
const path = require('path');

// Paths
const envLocal = path.resolve(__dirname, '..', '.env.local');
const envBackup = path.resolve(__dirname, '..', '.env.local.backup');

// Move .env.local out of the way
if (fs.existsSync(envLocal)) {
  fs.renameSync(envLocal, envBackup);
}

// Run the build command
const { execSync } = require('child_process');
execSync('npm run build', { stdio: 'inherit' });

// Restore .env.local
if (fs.existsSync(envBackup)) {
  fs.renameSync(envBackup, envLocal);
}