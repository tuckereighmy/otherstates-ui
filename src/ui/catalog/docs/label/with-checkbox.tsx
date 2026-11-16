import * as stylex from '@stylexjs/stylex';
import { Checkbox, Label } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-2'] },
  list: { display: 'grid', gap: t['--os-space-1'] },
});

export default function LabelWithCheckbox() {
  return (
    <div role="group" aria-labelledby="digest-label" {...stylex.props(s.root)}>
      <Label id="digest-label" elementType="span">Email me about</Label>
      <div {...stylex.props(s.list)}>
        <Checkbox label="Comments on my notes" name="comments" defaultSelected />
        <Checkbox label="Changes to shared projects" name="projects" />
      </div>
    </div>
  );
}
