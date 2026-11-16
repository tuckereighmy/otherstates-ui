import * as stylex from '@stylexjs/stylex';
import { Meter } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-5'], width: 300, maxWidth: '100%' },
});

export default function MeterSizes() {
  return (
    <div {...stylex.props(s.root)}>
      <Meter label="Small" size="sm" value={40} />
      <Meter label="Medium" value={60} />
      <Meter label="Large" size="lg" value={80} />
    </div>
  );
}
