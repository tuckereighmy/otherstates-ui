'use client';

import * as stylex from '@stylexjs/stylex';
import { useEffect, useState } from 'react';
import { Button, Skeleton } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const notes = ['Launch checklist', 'Hiring plan', 'Design review notes'];

const s = stylex.create({
  root: { display: 'grid', justifyItems: 'start', gap: t['--os-space-4'], width: 320, maxWidth: '100%' },
  list: { display: 'grid', gap: t['--os-space-2'], width: '100%', margin: 0, padding: 0, listStyle: 'none', fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'] },
});

export default function SkeletonLoadingList() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loading) return;
    const timer = window.setTimeout(() => setLoading(false), 1200);
    return () => window.clearTimeout(timer);
  }, [loading]);

  return (
    <div {...stylex.props(s.root)}>
      <ul aria-busy={loading} aria-label="Recent notes" {...stylex.props(s.list)}>
        {notes.map((note, index) => (
          <li key={note}>{loading ? <Skeleton width={`${70 - index * 12}%`} /> : note}</li>
        ))}
      </ul>
      <Button appearance="secondary" size="sm" isDisabled={loading} onClick={() => setLoading(true)}>
        Reload
      </Button>
    </div>
  );
}
