import * as stylex from '@stylexjs/stylex';
import { Badge, Card, Sparkline } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { width: 260, maxWidth: '100%' },
  tile: { display: 'grid', gap: t['--os-space-2'] },
  top: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: t['--os-space-2'] },
  label: { color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-caption'], lineHeight: t['--os-line-height-sm'], fontWeight: t['--os-font-weight-medium'] },
  value: { fontSize: t['--os-font-size-xl'], lineHeight: t['--os-line-height-lg'], fontWeight: t['--os-font-weight-semibold'], letterSpacing: '-0.02em' },
});

export default function ChartSparkline() {
  return (
    <div {...stylex.props(s.root)}>
      <Card>
        <div {...stylex.props(s.tile)}>
          <div {...stylex.props(s.top)}>
            <span {...stylex.props(s.label)}>Active members</span>
            <Badge variant="success" size="sm">+9.6%</Badge>
          </div>
          <span {...stylex.props(s.value)}>142</span>
          <Sparkline aria-label="Active members rose from 104 to 142 over twelve weeks" values={[104, 112, 109, 118, 121, 126, 124, 133, 138, 135, 140, 142]} />
        </div>
      </Card>
    </div>
  );
}
