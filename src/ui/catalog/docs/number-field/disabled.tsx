import * as stylex from '@stylexjs/stylex';
import { NumberField } from '../../../components';

const s = stylex.create({
  root: { width: 240, maxWidth: '100%' },
});

export default function NumberFieldDisabled() {
  return (
    <div {...stylex.props(s.root)}>
      <NumberField label="Seats" defaultValue={5} isDisabled />
    </div>
  );
}
