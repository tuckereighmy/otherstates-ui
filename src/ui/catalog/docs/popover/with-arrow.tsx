import * as stylex from '@stylexjs/stylex';
import { Button, Icon, Popover } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  copy: { margin: 0, fontSize: tokens['--os-font-size-caption'], lineHeight: tokens['--os-line-height-sm'] },
});

export default function PopoverWithArrow() {
  return (
    <Popover
      showArrow
      width={224}
      placement="top"
      aria-label="About retries"
      trigger={
        <Button appearance="text" iconOnly aria-label="About retries">
          <Icon name="help-circle" />
        </Button>
      }
    >
      <p {...stylex.props(s.copy)}>Failed deployments retry twice, one minute apart, before they are marked as failed.</p>
    </Popover>
  );
}
