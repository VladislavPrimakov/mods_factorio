import fs from 'node:fs';
import path from 'node:path';
import { execSync, spawn } from 'node:child_process';

const isWatch = process.argv.includes('--watch');
const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');

function cleanDist() {
  console.log('[Build] Cleaning dist/...');
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
  }
  fs.mkdirSync(distDir, { recursive: true });
}
function build() {
  cleanDist();

  console.log('[Build] Compiling TypeScript using TSTL...');
  try {
    execSync('npx tstl', { stdio: 'inherit' });

    const staticDir = path.join(rootDir, 'static');
    if (fs.existsSync(staticDir)) {
      console.log('[Build] Copying static/ to dist/...');
      fs.cpSync(staticDir, distDir, { recursive: true });
    }

    const graphicsDir = path.join(rootDir, 'graphics');
    if (fs.existsSync(graphicsDir)) {
      console.log('[Build] Copying graphics/ to dist/graphics/...');
      const targetGraphics = path.join(distDir, 'graphics');
      fs.mkdirSync(targetGraphics, { recursive: true });
      fs.cpSync(graphicsDir, targetGraphics, { recursive: true });
    }

    console.log('[Build] Success! Compiled fcore mod is ready in ./dist/');
  } catch (err) {
    console.error('[Build] Error: TSTL compilation failed.');
    if (!isWatch) {
      process.exit(1);
    }
  }
}

if (isWatch) {
  build();
  console.log('[Watch] Starting TSTL watch mode...');
  const child = spawn('npx', ['tstl', '--watch'], { stdio: 'inherit', shell: true });
  child.on('close', (code) => {
    console.log(`[Watch] TSTL process exited with code ${code}`);
  });
} else {
  build();
}
