import * as stylex from '@stylexjs/stylex';
import { NumberField } from '../../../components';

const s = stylex.create({
  root: { width: 240, maxWidth: '100%' },
});

export default function NumberFieldReadOnly() {
  return (
    <div {...stylex.props(s.root)}>
      <NumberField
        label="Invoice number"
        defaultValue={1042}
        formatOptions={{ useGrouping: false }}
        isReadOnly
      />
    </div>
  );
}
