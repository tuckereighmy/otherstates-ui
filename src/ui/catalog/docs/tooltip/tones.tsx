import * as stylex from '@stylexjs/stylex';
import { Button, Tooltip } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({ row: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: t['--os-space-3'] } });

export default function TooltipTones() {
  return (
    <div {...stylex.props(s.row)}>
      <Tooltip trigger={<Button appearance="secondary">Contrast</Button>}>
        The default, inverted
      </Tooltip>
      <Tooltip tone="subtle" trigger={<Button appearance="secondary">Subtle</Button>}>
        A quiet chip with a hairline
      </Tooltip>
      <Tooltip tone="accent" trigger={<Button appearance="secondary">Accent</Button>}>
        The primary fill
      </Tooltip>
      <Tooltip showArrow={false} trigger={<Button appearance="secondary">No arrow</Button>}>
        Without the arrow
      </Tooltip>
    </div>
  );
}
