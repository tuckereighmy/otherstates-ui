import { expect, test, type Page } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// One test per docs page and per template. Each example on a page (every element with data-example) is
// its own screenshot, so a change shows up as the examples it touched, not as a whole page that shifted.

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'src/ui/agent/manifest.json'), 'utf8')) as {
  components: { id: string }[];
  templates: { id: string }[];
};
// Page ids from the pages registry (the dev-only token audit is not in a production build).
const pages = [...fs.readFileSync(path.join(root, 'src/ui/catalog/pages/registry.ts'), 'utf8')
  .matchAll(/^ {4}id: '([a-z0-9-]+)'/gm)].map(match => match[1]).filter(id => id !== 'token-audit');

// A paused clock: dates, timers, live counters and the template simulations land in the same place on every
// run. Each page runs 4 seconds of that clock so springs and count-ups finish before the screenshot, and
// nothing moves after it (an installed clock keeps running in real time until it is paused).
const now = new Date('2026-03-02T09:30:00');

async function open(page: Page, hash: string) {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.clock.install({ time: now });
  await page.clock.pauseAt(new Date(now.getTime() + 1000));
  await page.goto(hash);
  await page.evaluate(() => document.fonts.ready);
  await page.clock.runFor(4000);
  await page.evaluate(() => document.fonts.ready);
  return errors;
}

/** Screenshots every example on the page under <scope>/<page>/<example>.png. */
async function shootExamples(page: Page, scope: string, id: string) {
  const examples = page.locator('main [data-example]');
  await expect(page.locator('main')).toBeVisible();
  // The window grows to the page's height first. Chromium stitches anything taller than the window from
  // tiles, and on the phone those stitched shots differ by a few pixels from one capture to the next.
  const { width, height } = page.viewportSize()!;
  const full = await page.evaluate(() => document.documentElement.scrollHeight);
  if (full > height) {
    await page.setViewportSize({ width, height: Math.min(full + 200, 16_000) });
    await page.clock.runFor(500);
  }
  const names = await examples.evaluateAll(elements => elements.map(element => element.getAttribute('data-example') ?? 'example'));
  if (names.length === 0) {
    await expect.soft(page.locator('main')).toHaveScreenshot([scope, id, 'page.png']);
    return;
  }
  const seen = new Map<string, number>();
  for (const [index, name] of names.entries()) {
    const count = (seen.get(name) ?? 0) + 1;
    seen.set(name, count);
    const file = count === 1 ? `${name}.png` : `${name}-${count}.png`;
    await expect.soft(examples.nth(index)).toHaveScreenshot([scope, id, file]);
  }
}

async function noBrokenExamples(page: Page, errors: string[]) {
  expect.soft(errors, 'uncaught errors on the page').toEqual([]);
  await expect.soft(page.locator('.docs-stage-error'), 'examples that failed to render').toHaveCount(0);
}

for (const { id } of manifest.components) {
  test(`component/${id}`, async ({ page }) => {
    const errors = await open(page, `#component/${id}`);
    await expect(page.locator('main [data-example]').first()).toBeVisible();
    await shootExamples(page, 'component', id);
    await noBrokenExamples(page, errors);
  });
}

// Foundations pages draw most of their specimens (swatches, type ramps, scales) outside data-example, so
// each page is also taken whole.
for (const id of pages) {
  test(`docs/${id}`, async ({ page }) => {
    const errors = await open(page, `#docs/${id}`);
    await shootExamples(page, 'docs', id);
    if (await page.locator('main [data-example]').count()) {
      await expect.soft(page.locator('main')).toHaveScreenshot(['docs', id, 'page.png']);
    }
    await noBrokenExamples(page, errors);
  });
}

// A template is taken as it first appears on the screen, then on a tall screen so everything below the
// fold is in the picture too.
for (const { id } of manifest.templates) {
  test(`template/${id}`, async ({ page }) => {
    const errors = await open(page, `#preview/${id}`);
    await expect.soft(page).toHaveScreenshot(['template', `${id}.png`]);
    const { width } = page.viewportSize()!;
    await page.setViewportSize({ width, height: width < 768 ? 3200 : 2400 });
    await page.clock.runFor(1000);
    await expect.soft(page).toHaveScreenshot(['template', `${id}-full.png`]);
    expect.soft(errors, 'uncaught errors on the page').toEqual([]);
  });
}
