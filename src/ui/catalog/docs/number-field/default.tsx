import * as stylex from '@stylexjs/stylex';
import { NumberField } from '../../../components';

const s = stylex.create({
  root: { width: 240, maxWidth: '100%' },
});

export default function NumberFieldDefault() {
  return (
    <div {...stylex.props(s.root)}>
      <NumberField label="Quantity" defaultValue={1} minValue={0} />
    </div>
  );
}
