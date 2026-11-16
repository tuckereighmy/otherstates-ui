import * as stylex from '@stylexjs/stylex';
import { Badge, Button, Card } from '__UI__/components';
import { tokens as t } from '__UI__/tokens.stylex';
import { ThemeSwitch } from './theme-switch';

// The Otherstates UI starter screen. Every value here is a token and every control a system component: replace it
// with your app, the same way. The page is a Server Component; the one interactive piece, the dark-mode switch,
// lives in its own 'use client' file.

const s = stylex.create({
  page: {
    boxSizing: 'border-box', minHeight: '100vh', display: 'grid', placeItems: 'center',
    paddingInline: t['--os-space-6'], paddingBlock: t['--os-space-12'],
    backgroundColor: t['--os-color-bg-subtle'], color: t['--os-color-fg-base'], fontFamily: t['--os-font-family'],
  },
  column: { width: '100%', maxWidth: 560, display: 'grid', gap: t['--os-space-8'] },
  intro: { display: 'grid', gap: t['--os-space-2'] },
  title: {
    margin: 0, fontSize: t['--os-font-size-2xl'], lineHeight: 1.2, fontWeight: t['--os-font-weight-semibold'],
    letterSpacing: t['--os-tracking-tight'],
  },
  lead: { margin: 0, color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-body'], lineHeight: t['--os-line-height-lg'] },
  row: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: t['--os-space-3'] },
  stack: { display: 'grid', gap: t['--os-space-5'] },
  steps: { margin: 0, paddingInlineStart: t['--os-space-5'], display: 'grid', gap: t['--os-space-2'], color: t['--os-color-fg-muted'] },
  code: { fontSize: t['--os-font-size-caption'], color: t['--os-color-fg-base'] },
});

export default function Home() {
  return (
    <main {...stylex.props(s.page)}>
      <div {...stylex.props(s.column)}>
        <div {...stylex.props(s.intro)}>
          <div {...stylex.props(s.row)}><Badge variant="success" size="sm">Installed</Badge></div>
          <h1 {...stylex.props(s.title)}>Otherstates UI is ready</h1>
          <p {...stylex.props(s.lead)}>Every screen in this app is built from the design system in <code {...stylex.props(s.code)}>__DIR__</code>. Start from a component or a whole template.</p>
        </div>
        <Card heading="Try it" description="Real components, styled only by the tokens.">
          <div {...stylex.props(s.stack)}>
            <div {...stylex.props(s.row)}>
              <Button>Primary</Button>
              <Button appearance="secondary">Secondary</Button>
              <Button appearance="text">Text</Button>
            </div>
            <ThemeSwitch />
          </div>
        </Card>
        <Card heading="Next steps">
          <ol {...stylex.props(s.steps)}>
            <li>Look a component up in <code {...stylex.props(s.code)}>llms.txt</code> before building one.</li>
            <li>Copy a whole screen from <code {...stylex.props(s.code)}>__DIR__/templates</code>: analytics, projects or settings.</li>
            <li>Run <code {...stylex.props(s.code)}>npm run ui:check</code> before you ship. Agents follow <code {...stylex.props(s.code)}>__DIR__/AGENTS.md</code>.</li>
          </ol>
        </Card>
      </div>
    </main>
  );
}
