import * as stylex from '@stylexjs/stylex';
import { Kbd, KbdGroup } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  column: { display: 'grid', justifyItems: 'center', gap: t['--os-space-3'] },
});

export default function KbdGroupExample() {
  return (
    <div {...stylex.props(s.column)}>
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
      <KbdGroup>
        <Kbd>Ctrl</Kbd>+<Kbd>Shift</Kbd>+<Kbd>P</Kbd>
      </KbdGroup>
    </div>
  );
}
