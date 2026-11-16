'use client';

import * as stylex from '@stylexjs/stylex';
import { formatCost, UsageBar } from '../../../components';

const s = stylex.create({ box: { width: '100%', maxWidth: 340 } });

export default function UsageBarInspect() {
  return (
    <UsageBar
      {...stylex.props(s.box)}
      label="Run cost"
      size="xl"
      legend="chips"
      format={formatCost}
      segments={[
        { id: 'search', label: 'Search', value: 0.31 },
        { id: 'draft', label: 'Draft', value: 0.52 },
        { id: 'check', label: 'Check', value: 0.18 },
      ]}
    />
  );
}
