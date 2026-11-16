import { defineConfig } from '@playwright/test';

// Screenshot baseline for the docs: every example on every page, and every template, in light, dark and
// at phone width. `npm run visual:baseline` saves the screenshots; `npm run visual` compares the current
// code against them and `npm run visual:report` shows each difference side by side.
// Everything it writes goes to .visual/ (ignored by git): the build, the baseline, results and the report.

const port = 5199;

export default defineConfig({
  testDir: '.',
  outputDir: '../.visual/results',
  snapshotPathTemplate: '{testDir}/../.visual/baseline/{projectName}/{arg}{ext}',
  globalSetup: './global-setup.ts',
  fullyParallel: true,
  workers: '50%',
  timeout: 180_000,
  reporter: [['list'], ['html', { outputFolder: '../.visual/report', open: 'never' }]],
  expect: {
    // Up to 8 differing pixels pass: Chromium anti-aliases the odd icon edge differently from run to run
    // (seen: 2 pixels). A real change is bigger; a 1 px line 9 px long already fails.
    toHaveScreenshot: { animations: 'disabled', caret: 'hide', scale: 'css', stylePath: './screenshot.css', maxDiffPixels: 8 },
  },
  use: { baseURL: `http://127.0.0.1:${port}/ui/`, deviceScaleFactor: 1 },
  projects: [
    { name: 'light', use: { colorScheme: 'light', viewport: { width: 1280, height: 900 } } },
    { name: 'dark', use: { colorScheme: 'dark', viewport: { width: 1280, height: 900 } } },
    {
      name: 'phone',
      use: { colorScheme: 'light', viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true },
    },
  ],
  // A production build, served on its own port: no HMR, and nothing shared with the dev server on 5180.
  webServer: {
    command: `npx vite build --outDir .visual/build --emptyOutDir --logLevel error && npx vite preview --outDir .visual/build --host 127.0.0.1 --port ${port} --strictPort`,
    cwd: '..',
    url: `http://127.0.0.1:${port}/ui/`,
    reuseExistingServer: false,
    timeout: 240_000,
  },
});
