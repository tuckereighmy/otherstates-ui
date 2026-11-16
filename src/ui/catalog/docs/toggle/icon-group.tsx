import * as stylex from '@stylexjs/stylex';
import { Icon, Toggle } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  group: { display: 'flex', gap: t['--os-space-1-5'] },
});

export default function ToggleIconGroup() {
  return (
    <div role="group" aria-label="Text style" {...stylex.props(s.group)}>
      <Toggle iconOnly aria-label="Bold" defaultSelected>
        <Icon name="bold" />
      </Toggle>
      <Toggle iconOnly aria-label="Italic">
        <Icon name="italic" />
      </Toggle>
      <Toggle iconOnly aria-label="Underline">
        <Icon name="underline" />
      </Toggle>
      <Toggle iconOnly aria-label="Strikethrough">
        <Icon name="strikethrough" />
      </Toggle>
    </div>
  );
}
