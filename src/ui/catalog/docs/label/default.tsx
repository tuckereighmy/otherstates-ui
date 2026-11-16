import * as stylex from '@stylexjs/stylex';
import { Input, Label } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-2'], width: 320, maxWidth: '100%' },
});

export default function LabelDefault() {
  return (
    <div {...stylex.props(s.root)}>
      <Label htmlFor="display-name">Display name</Label>
      <Input id="display-name" name="displayName" placeholder="How teammates see you" />
    </div>
  );
}
