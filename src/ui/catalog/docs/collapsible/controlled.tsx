'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, Collapsible } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', justifyItems: 'start', gap: t['--os-space-3'], width: 360, maxWidth: '100%' },
  full: { justifySelf: 'stretch' },
});

export default function CollapsibleControlled() {
  const [isExpanded, setExpanded] = useState(false);

  return (
    <div {...stylex.props(s.root)}>
      <Button appearance="tertiary" size="sm" onClick={() => setExpanded(!isExpanded)}>
        {isExpanded ? 'Hide build details' : 'Show build details'}
      </Button>
      <div {...stylex.props(s.full)}>
        <Collapsible title="Build details" isExpanded={isExpanded} onExpandedChange={setExpanded}>
          Built in 48 seconds from the main branch. 214 files were uploaded.
        </Collapsible>
      </div>
    </div>
  );
}
