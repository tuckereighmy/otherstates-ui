import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Records which commit a baseline was taken from, and says which baseline a comparison runs against.
const baseline = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../.visual/baseline');
const stamp = path.join(baseline, 'COMMIT');

export default function globalSetup() {
  const updating = process.argv.some(arg => arg.startsWith('--update-snapshots') || arg === '-u');
  if (updating) {
    const commit = execSync('git describe --always --dirty', { encoding: 'utf8' }).trim();
    fs.mkdirSync(baseline, { recursive: true });
    fs.writeFileSync(stamp, `${commit}\n${new Date().toISOString()}\n`);
    console.log(`Saving a new baseline from ${commit}`);
  } else if (fs.existsSync(stamp)) {
    const [commit, date] = fs.readFileSync(stamp, 'utf8').trim().split('\n');
    console.log(`Comparing against the baseline from ${commit} (${date})`);
  } else {
    console.log('No baseline yet: run `npm run visual:baseline` first.');
  }
}
