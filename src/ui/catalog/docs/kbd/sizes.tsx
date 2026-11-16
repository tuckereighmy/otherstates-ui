import * as stylex from '@stylexjs/stylex';
import { Kbd, KbdGroup } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: t['--os-space-6'] },
});

export default function KbdSizes() {
  return (
    <div {...stylex.props(s.row)}>
      <KbdGroup size="sm">
        <Kbd>Shift</Kbd>
        <Kbd>Enter</Kbd>
      </KbdGroup>
      <KbdGroup size="md">
        <Kbd>Shift</Kbd>
        <Kbd>Enter</Kbd>
      </KbdGroup>
    </div>
  );
}
