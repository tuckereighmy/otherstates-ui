import * as stylex from '@stylexjs/stylex';
import { Spinner } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  column: { display: 'grid', justifyItems: 'start', gap: tokens['--os-space-4'] },
  info: { color: tokens['--os-color-fg-info'] },
});

export default function SpinnerTones() {
  return (
    <div {...stylex.props(s.column)}>
      <Spinner size="sm" label="Building preview" />
      <Spinner size="sm" tone="muted" label="Waiting for a runner" />
      <span {...stylex.props(s.info)}>
        <Spinner size="sm" tone="current" label="Importing contacts" />
      </span>
    </div>
  );
}
