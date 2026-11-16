'use client';

import * as stylex from '@stylexjs/stylex';
import { useEffect, useState } from 'react';
import { Avatar, Button, SkeletonReveal } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  card: { boxSizing: 'border-box', display: 'grid', justifyItems: 'start', gap: t['--os-space-3'], width: 300, maxWidth: '100%', padding: t['--os-space-5'], borderRadius: t['--os-radius-xl'], backgroundColor: t['--os-color-bg-surface'] },
  head: { display: 'flex', alignItems: 'center', gap: t['--os-space-3'] },
  name: { margin: 0, fontSize: t['--os-font-size-body'], lineHeight: t['--os-line-height-lg'], fontWeight: t['--os-font-weight-medium'] },
  bio: { margin: 0, fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'], color: t['--os-color-fg-muted'] },
});

export default function SkeletonRevealExample() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) return;
    const timer = window.setTimeout(() => setReady(true), 900);
    return () => window.clearTimeout(timer);
  }, [ready]);

  return (
    <article aria-label="Profile" {...stylex.props(s.card)}>
      <div {...stylex.props(s.head)}>
        <SkeletonReveal ready={ready} blocks={[{ width: 40, height: 40, radius: '50%' }]}>
          <Avatar name="Noor Halden" fallback="gradient" />
        </SkeletonReveal>
        <SkeletonReveal ready={ready} blocks={[{ width: 110, height: 14, top: 5 }]}>
          <h3 {...stylex.props(s.name)}>Noor Halden</h3>
        </SkeletonReveal>
      </div>
      <SkeletonReveal ready={ready} order={1} fullWidth blocks={[{ width: '100%', height: 14, top: 3 }, { width: '62%', height: 14, top: 23 }]}>
        <p {...stylex.props(s.bio)}>Leads onboarding for new teams and answers every thread.</p>
      </SkeletonReveal>
      <Button appearance="secondary" size="sm" onClick={() => setReady(false)}>Reload</Button>
    </article>
  );
}
