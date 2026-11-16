'use client';

import * as stylex from '@stylexjs/stylex';
import { formatCost, UsageBar } from '../../../components';

const s = stylex.create({ box: { width: '100%', maxWidth: 340 } });

export default function UsageBarCost() {
  return (
    <UsageBar
      {...stylex.props(s.box)}
      label="Run cost"
      format={formatCost}
      segments={[
        { id: 'plan', label: 'Plan the report', value: 0.04 },
        { id: 'search', label: 'Search sources', value: 0.31 },
        { id: 'draft', label: 'Draft', value: 0.52 },
        { id: 'check', label: 'Check citations', value: 0.18 },
      ]}
    />
  );
}
