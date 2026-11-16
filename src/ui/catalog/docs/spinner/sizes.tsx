import * as stylex from '@stylexjs/stylex';
import { Spinner } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: t['--os-space-6'] },
});

export default function SpinnerSizes() {
  return (
    <div {...stylex.props(s.row)}>
      <Spinner size="sm" aria-label="Loading" />
      <Spinner size="md" aria-label="Loading" />
      <Spinner size="lg" aria-label="Loading" />
    </div>
  );
}
