import * as stylex from '@stylexjs/stylex';
import { Field, Input } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function InputReadOnly() {
  return (
    <div {...stylex.props(s.root)}>
      <Field label="Invoice number" description="Assigned when the invoice is issued." isReadOnly>
        <Input defaultValue="INV-2048" />
      </Field>
    </div>
  );
}
