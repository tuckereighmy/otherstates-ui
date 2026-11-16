import * as stylex from '@stylexjs/stylex';
import { Button, Popover } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  copy: { margin: 0, color: tokens['--os-color-fg-muted'] },
});

export default function PopoverCloseButton() {
  return (
    <Popover
      trigger={<Button appearance="tertiary">Usage</Button>}
      title="Storage"
      showCloseButton
    >
      <p {...stylex.props(s.copy)}>18 of 50 GB used. Files in archived projects still count toward the total.</p>
    </Popover>
  );
}
