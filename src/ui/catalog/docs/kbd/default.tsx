import * as stylex from '@stylexjs/stylex';
import { Kbd } from '../../../components';

const s = stylex.create({
  text: { margin: 0 },
});

export default function KbdDefault() {
  return (
    <p {...stylex.props(s.text)}>
      Press <Kbd>Esc</Kbd> to close the panel.
    </p>
  );
}
