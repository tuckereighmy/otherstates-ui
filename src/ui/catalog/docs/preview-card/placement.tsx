import * as stylex from '@stylexjs/stylex';
import { PreviewCard } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  title: { margin: 0, fontSize: tokens['--os-font-size-sm'], lineHeight: tokens['--os-line-height-md'], fontWeight: tokens['--os-font-weight-medium'] },
  meta: { margin: 0, marginBlockStart: tokens['--os-space-1'], fontSize: tokens['--os-font-size-caption'], lineHeight: tokens['--os-line-height-sm'], color: tokens['--os-color-fg-muted'] },
});

export default function PreviewCardPlacement() {
  return (
    <PreviewCard href="#" trigger="Invoice 2041" placement="bottom" delay={300} closeDelay={200}>
      <p {...stylex.props(s.title)}>Invoice 2041 · €1,280.00</p>
      <p {...stylex.props(s.meta)}>Due 30 November. Sent to the finance team on 2 November.</p>
    </PreviewCard>
  );
}
