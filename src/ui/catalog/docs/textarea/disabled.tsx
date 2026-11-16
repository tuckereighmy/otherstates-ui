import * as stylex from '@stylexjs/stylex';
import { Textarea } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function TextareaDisabled() {
  return (
    <div {...stylex.props(s.root)}>
      <Textarea
        label="Handover notes"
        description="Notes lock once the shift is closed."
        defaultValue="Two orders are waiting on stock. Call the supplier before noon."
        isDisabled
      />
    </div>
  );
}
