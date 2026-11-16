import * as stylex from '@stylexjs/stylex';
import { PreviewCard } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  text: { margin: 0, maxWidth: 420, fontSize: tokens['--os-font-size-sm'], lineHeight: tokens['--os-line-height-md'] },
  title: { margin: 0, fontWeight: tokens['--os-font-weight-medium'] },
  meta: { margin: 0, marginBlockStart: tokens['--os-space-1'], fontSize: tokens['--os-font-size-caption'], lineHeight: tokens['--os-line-height-sm'], color: tokens['--os-color-fg-muted'] },
});

export default function PreviewCardDefault() {
  return (
    <p {...stylex.props(s.text)}>
      The launch checklist now lives in{' '}
      <PreviewCard href="#" trigger="Release handbook">
        <p {...stylex.props(s.title)}>Release handbook</p>
        <p {...stylex.props(s.meta)}>Steps, owners and rollback plans for every release. Updated 2 days ago.</p>
      </PreviewCard>
      , next to last quarter’s notes.
    </p>
  );
}
