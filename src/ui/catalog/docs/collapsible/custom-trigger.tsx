'use client';

import * as stylex from '@stylexjs/stylex';
import { Badge, Collapsible, Icon } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
  trigger: { display: 'flex', alignItems: 'center', gap: t['--os-space-2'], width: '100%' },
  label: { flexGrow: 1 },
});

export default function CollapsibleCustomTrigger() {
  return (
    <div {...stylex.props(s.root)}>
      <Collapsible
        trigger={({ isExpanded }) => (
          <span {...stylex.props(s.trigger)}>
            <Icon name="file" size={16} />
            <span {...stylex.props(s.label)}>Attachments</span>
            <Badge variant="secondary" size="sm">{isExpanded ? 'Hide' : '3 files'}</Badge>
          </span>
        )}
      >
        brief-final.pdf, moodboard.png and budget-q3.csv
      </Collapsible>
    </div>
  );
}
