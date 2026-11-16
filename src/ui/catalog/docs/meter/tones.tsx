import * as stylex from '@stylexjs/stylex';
import { Meter } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-5'], width: 300, maxWidth: '100%' },
});

export default function MeterTones() {
  return (
    <div {...stylex.props(s.root)}>
      <Meter label="Uptime this month" value={99} tone="success" />
      <Meter label="API quota" value={84} tone="warning" />
      <Meter label="Disk space" value={96} tone="error" />
    </div>
  );
}
