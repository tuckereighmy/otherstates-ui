import * as stylex from '@stylexjs/stylex';
import { Field, Switch } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function FieldSwitch() {
  return (
    <div {...stylex.props(s.root)}>
      <Field description="Anyone with the link can view, not edit.">
        <Switch label="Public link" name="publicLink" defaultSelected />
      </Field>
    </div>
  );
}
