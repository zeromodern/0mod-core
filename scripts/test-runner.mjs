import { spawn } from 'child_process';
import { readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';

const appsDir = process.cwd();
const apps = readdirSync(appsDir).filter(f => {
    try {
        return statSync(join(appsDir, f)).isDirectory() && 
               !f.startsWith('.') && 
               f !== 'node_modules' && 
               f !== 'scripts';
    } catch (e) { return false; }
});

const testFiles = [];
for (const app of apps) {
  const testDir = join(appsDir, app, 'tests');
  try {
    if (statSync(testDir).isDirectory()) {
      const files = readdirSync(testDir).filter(f => f.endsWith('.mjs'));
      files.forEach(f => testFiles.push(join(testDir, f)));
    }
  } catch (e) {
    // ignore
  }
}

console.log(`Found ${testFiles.length} test files.`);

// Start server
console.log('Starting servers...');
const server = spawn('npm', ['run', 'dev'], { detached: true, stdio: 'ignore' });

const killServer = () => {
  try {
    if (server.pid) process.kill(-server.pid);
  } catch (e) {
    // ignore
  }
};

process.on('SIGINT', () => {
  killServer();
  process.exit();
});

process.on('SIGTERM', () => {
  killServer();
  process.exit();
});

// Wait for server
const waitForServer = async () => {
  let attempts = 0;
  while (attempts < 60) {
    try {
      const res = await fetch('http://localhost:3000');
      if (res.ok) return true;
    } catch (e) {}
    await new Promise(r => setTimeout(r, 1000));
    attempts++;
  }
  return false;
};

(async () => {
  if (await waitForServer()) {
    console.log('Server started.');
    process.env.BASE_URL = 'http://localhost:3000';
    
    let failed = false;
    for (const file of testFiles) {
      console.log(`\nRunning ${file}...`);
      const p = spawn('node', [file], { stdio: 'inherit', env: { ...process.env } });
      await new Promise(resolve => {
        p.on('close', code => {
          if (code !== 0) failed = true;
          resolve();
        });
      });
    }
    
    killServer();
    if (failed) {
        console.log('\nSome tests failed.');
        process.exit(1);
    } else {
        console.log('\nAll tests passed.');
        process.exit(0);
    }
  } else {
    console.error('Failed to start server.');
    killServer();
    process.exit(1);
  }
})();
