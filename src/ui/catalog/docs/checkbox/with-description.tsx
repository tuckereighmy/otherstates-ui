import * as stylex from '@stylexjs/stylex';
import { Checkbox } from '../../../components';

const s = stylex.create({
  root: { width: 340, maxWidth: '100%' },
});

export default function CheckboxWithDescription() {
  return (
    <div {...stylex.props(s.root)}>
      <Checkbox
        label="Share usage data"
        description="Counts of the features your team opens. Project content is never included."
      />
    </div>
  );
}
